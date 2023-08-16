# ===============================================================================
# Routes associated with direct interaction with meters
# ===============================================================================
from typing import List

from fastapi import Depends, APIRouter
from sqlalchemy import or_, select, desc, and_
from sqlalchemy.orm import Session, joinedload
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import LimitOffsetPage

from api.schemas import meter_schemas
from api.schemas import well_schemas
from api.models.main_models import (
    Meters,
    LandOwners,
    MeterActivities,
    MeterObservations,
    Locations,
    MeterTypeLU,
    Wells,
)
from api.route_util import _patch
from api.security import scoped_user
from api.session import get_db

from enum import Enum


# Find better location for these
class MeterSortByField(Enum):
    SerialNumber = "serial_number"
    RANumber = "ra_number"
    LandOwnerName = "land_owner_name"
    TRSS = "trss"


class SortDirection(Enum):
    Ascending = "asc"
    Descending = "desc"


meter_router = APIRouter()
meter_write_user = scoped_user(["meters:write"])
read_user = scoped_user(["read"])
admin_user = scoped_user(["admin"])


# Get paginated, sorted list of meters, filtered by a search string if applicable
@meter_router.get(
    "/meters",
    dependencies=[Depends(read_user)],
    response_model=LimitOffsetPage[meter_schemas.MeterListDTO],
    tags=["meters"],
)
async def get_meters(
    # offset: int, limit: int - From fastapi_pagination
    search_string: str = None,
    sort_by: MeterSortByField = MeterSortByField.SerialNumber,
    sort_direction: SortDirection = SortDirection.Ascending,
    exclude_inactive: bool = False,
    db: Session = Depends(get_db),
):
    def sort_by_field_to_schema_field(name: MeterSortByField):
        match name:
            case MeterSortByField.SerialNumber:
                return Meters.serial_number

            case MeterSortByField.RANumber:
                return Wells.ra_number

            case MeterSortByField.LandOwnerName:
                return LandOwners.organization

            case MeterSortByField.TRSS:
                return Locations.trss

    # Build the query statement based on query params
    # joinedload loads relationships, outer joins on relationship tables makes them search/sortable
    query_statement = (
        select(Meters)
        .options(joinedload(Meters.well), joinedload(Meters.status))
        .join(Wells, isouter=True)
        .join(Locations, isouter=True)
        .join(LandOwners, isouter=True)
    )

    if exclude_inactive:
        query_statement = query_statement.where(
            and_(Meters.status_id != 3, Meters.status_id != 4, Meters.status_id != 5)
        )

    if search_string:
        query_statement = query_statement.where(
            or_(
                Meters.serial_number.ilike(f"%{search_string}%"),
                Wells.ra_number.ilike(f"%{search_string}%"),
                Locations.trss.ilike(f"%{search_string}%"),
                LandOwners.organization.ilike(f"%{search_string}%"),
            )
        )

    if sort_by:
        schema_field_name = sort_by_field_to_schema_field(sort_by)

        if sort_direction != SortDirection.Ascending:
            query_statement = query_statement.order_by(desc(schema_field_name))
        else:
            query_statement = query_statement.order_by(
                schema_field_name
            )  # SQLAlchemy orders ascending by default

    return paginate(db, query_statement)


# Get list of all meters and their coordinates (if they have them)


@meter_router.get(
    "/meters_locations",
    dependencies=[Depends(read_user)],
    response_model=List[meter_schemas.MeterMapDTO],
    tags=["meters"]
)
async def get_meters_locations(
    db: Session = Depends(get_db),
):
    return db.scalars(
        select(Meters)
        .options(joinedload(Meters.well))
        .where(
            and_(
                Locations.latitude.is_not(None),
                Locations.longitude.is_not(None),
                Meters.status_id == 1,  # Need to improve this
            )
        )
        .join(Wells, isouter=True)
        .join(Locations, isouter=True)
    ).all()


# Get single, fully qualified meter
@meter_router.get(
    "/meter",
    dependencies=[Depends(read_user)],
    response_model=meter_schemas.Meter,
    tags=["meters"]
)
async def get_meter(
    meter_id: int,
    db: Session = Depends(get_db),
):
    return db.scalars(
        select(Meters)
        .options(
            joinedload(Meters.meter_type),
            joinedload(Meters.well).joinedload(Wells.location),
            joinedload(Meters.status),
        )
        .filter(Meters.id == meter_id)
    ).first()


@meter_router.get(
    "/meter_types",
    dependencies=[Depends(read_user)],
    response_model=List[meter_schemas.MeterTypeLU],
    tags=["meters"]
)
async def get_meter_types(
    db: Session = Depends(get_db),
):
    return db.scalars(select(MeterTypeLU)).all()


@meter_router.get(
    "/land_owners",
    dependencies=[Depends(read_user)],
    response_model=List[well_schemas.LandOwner],
    tags=["meters"]
)
async def get_land_owners(
    db: Session = Depends(get_db),
):
    return db.scalars(select(LandOwners)).all()


@meter_router.get(
    "/wells",
    dependencies=[Depends(read_user)],
    response_model=LimitOffsetPage[well_schemas.WellListDTO],
    tags=["meters"]
)
async def get_wells(
    # offset: int, limit: int - From fastapi_pagination
    search_string: str = None,
    db: Session = Depends(get_db),
):
    queryStatement = select(Wells)

    if search_string:
        queryStatement = queryStatement.where(Wells.name.ilike(f"%{search_string}%"))

    return paginate(db, queryStatement)

@meter_router.get(
    "/well",
    dependencies=[Depends(read_user)],
    response_model=well_schemas.Well,
    tags=["meters"]
)
async def get_well(
    well_id: int,
    db: Session = Depends(get_db)
):
    return db.scalars(
        select(Wells)
        .options(
            joinedload(Wells.location).joinedload(Locations.land_owner),
        )
        .filter(Wells.id == well_id)
    ).first()


@meter_router.patch(
    "/meter",
    dependencies=[Depends(admin_user)],
    response_model=meter_schemas.Meter,
    tags=["meters"],
)
async def patch_meter(
    updated_meter: meter_schemas.Meter,
    db: Session = Depends(get_db),
):
    return _patch(db, Meters, updated_meter.id, updated_meter)


# Build a list of a meter's history (activities and observations)
# There's no real defined structure/schema to this on the front or backend
@meter_router.get(
    "/meter_history",
    dependencies=[Depends(read_user)],
    tags=["meters"]
)
async def get_meter_history(meter_id: int, db: Session = Depends(get_db)):
    class HistoryType(Enum):
        Activity = "Activity"
        Observation = "Observation"
        LocationChange = "LocationChange"

    activities = (
        db.scalars(
            select(MeterActivities)
            .options(
                joinedload(MeterActivities.location),
                joinedload(MeterActivities.submitting_user),
                joinedload(MeterActivities.activity_type),
                joinedload(MeterActivities.parts_used),
                joinedload(MeterActivities.notes),
            )
            .filter(MeterActivities.meter_id == meter_id)
        )
        .unique()
        .all()
    )

    observations = db.scalars(
        select(MeterObservations)
        .options(
            joinedload(MeterObservations.submitting_user),
            joinedload(MeterObservations.observed_property),
            joinedload(MeterObservations.unit),
            joinedload(MeterObservations.location),
        )
        .filter(MeterObservations.meter_id == meter_id)
    ).all()

    # Take all the history object we just got from the database and make them into a object that's easy for the frontend to consume
    formattedHistoryItems = []
    itemID = 0

    for activity in activities:
        activity.location.geom = None  # FastAPI errors when returning this
        formattedHistoryItems.append(
            {
                "id": itemID,
                "history_type": HistoryType.Activity,
                "location": activity.location,
                "activity_type": activity.activity_type_id,
                "date": activity.timestamp_start,
                "history_item": activity,
            }
        )
        itemID += 1

    for observation in observations:
        observation.location.geom = None
        formattedHistoryItems.append(
            {
                "id": itemID,
                "history_type": HistoryType.Observation,
                "location": observation.location,
                "date": observation.timestamp,
                "history_item": observation,
            }
        )
        itemID += 1

    # Add location history also

    formattedHistoryItems.sort(key=lambda x: x["date"], reverse=True)

    return formattedHistoryItems
