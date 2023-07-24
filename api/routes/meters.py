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
    Wells
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
write_user = scoped_user(["read", "meters:write"])
admin_user = scoped_user(["read", "admin"])


# Get paginated, sorted list of meters, filtered by a search string if applicable
@meter_router.get(
    "/meters",
    response_model=LimitOffsetPage[meter_schemas.MeterListDTO],
    tags=["meters"],
)
async def get_meters(
    # offset: int, limit: int - From fastapi_pagination
    search_string: str = None,
    sort_by: MeterSortByField = MeterSortByField.SerialNumber,
    sort_direction: SortDirection = SortDirection.Ascending,
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
        .options(joinedload(Meters.well))
        .join(Wells, isouter=True)
        .join(Locations, isouter=True)
        .join(LandOwners, isouter=True)
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
    "/meters_locations", response_model=List[meter_schemas.MeterMapDTO], tags=["meters"]
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
                Meters.status_id == 1 # Need to improve this
            )
        )
        .join(Wells, isouter=True)
        .join(Locations, isouter=True)
    ).all()


# Get single, fully qualified meter
@meter_router.get("/meter", response_model=meter_schemas.Meter, tags=["meters"])
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
    "/meter_types", response_model=List[meter_schemas.MeterTypeLU], tags=["meters"]
)
async def get_meter_types(
    db: Session = Depends(get_db),
):
    return db.scalars(select(MeterTypeLU)).all()


@meter_router.get(
    "/land_owners", response_model=List[well_schemas.LandOwner], tags=["meters"]
)
async def get_land_owners(
    db: Session = Depends(get_db),
):
    return db.scalars(select(LandOwners)).all()


@meter_router.patch(
    "/meter",
    response_model=meter_schemas.Meter,
    dependencies=[Depends(admin_user)],
    tags=["meters"],
)
async def patch_meter(
    updated_meter: meter_schemas.Meter,
    db: Session = Depends(get_db),
):

    return _patch(db, Meters, updated_meter.id, updated_meter)


# Build a list of a meter's history (activities and observations)
# There's no real defined structure/schema to this on the front or backend
@meter_router.get("/meter_history", response_model=None, tags=["meters"])
async def get_meter_history(meter_id: int, db: Session = Depends(get_db)):
    class HistoryType(Enum):
        Activity = "Activity"
        Observation = "Observation"
        LocationChange = "LocationChange"

    activities = (
        db.scalars(
            select(MeterActivities)
            .options(
                joinedload(MeterActivities.submitting_user),
                joinedload(MeterActivities.activity_type),
                joinedload(MeterActivities.location),
                joinedload(MeterActivities.parts_used),
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


"""
@meter_router.get(
    "/meter_history/{meter_id}", response_model=List[schemas.MeterHistory]
)
async def read_meter_history(meter_id, db: Session = Depends(get_db)):
    return db.query(MeterHistory).filter_by(meter_id=meter_id).all()

@meter_router.post(
    "/meters",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.Meter,
    tags=["meters"],
)
async def add_meter(obj: meter_schemas.MeterCreate, db: Session = Depends(get_db)):
    return _add(db, Meters, obj)

@meter_router.patch(
    "/meters/{meter_id}",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.Meter,
    tags=["meters"],
)
async def patch_meters(
    meter_id: int, obj: meter_schemas.MeterPatch, db: Session = Depends(get_db)
):
    return _patch(db, Meters, meter_id, obj)


"""
