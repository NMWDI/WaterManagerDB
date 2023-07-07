# ===============================================================================
# Routes associated with direct interaction with meters
# ===============================================================================
from typing import List

from fastapi import Depends, APIRouter, HTTPException, Security
from sqlalchemy import or_, select, desc, and_, text
from sqlalchemy.orm import Session, joinedload, eagerload, selectinload, load_only, subqueryload
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import LimitOffsetPage

from api.schemas import meter_schemas, activity_schemas
from api.models.main_models import (
        Meters,
        MeterTypeLU,
        Parts,
        PartAssociation,
        PartTypeLU,
        LandOwners,
        MeterStatusLU,
        MeterActivities,
        MeterObservations,
        ActivityTypeLU,
        Technicians,
        ObservedPropertyTypeLU,
        Units,
        MeterLocations
)
from api.route_util import _add, _patch
from api.security import get_current_user, scoped_user
from api.models.security_models import Users
from api.session import get_db

from enum import Enum

# Find better location for these
class MeterSortByField(Enum):
    SerialNumber = 'serial_number'
    RANumber = 'ra_number'
    LandOwnerName = 'land_owner_name'
    TRSS = 'trss'

class SortDirection(Enum):
    Ascending = 'asc'
    Descending = 'desc'

meter_router = APIRouter()
write_user = scoped_user(["read", "meters:write"])

# What scope is req.??
# Get paginated, sorted list of meters, filtered by a search string if applicable
@meter_router.get("/meters", response_model=LimitOffsetPage[meter_schemas.MeterListDTO], tags=["meters"])
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
                return Meters.ra_number

            case MeterSortByField.LandOwnerName:
                return LandOwners.land_owner_name

            case MeterSortByField.TRSS:
                return Meters.trss

    # Build the query statement based on query params
    # joinedload loads relationships, outer joins on relationship tables makes them search/sortable
    query_statement = (
        select(Meters)
        .options(joinedload(Meters.meter_location))
        .join(MeterLocations, isouter=True)
        .join(LandOwners, isouter=True)
    )

    if search_string:
        query_statement = query_statement.where(
            or_(
                Meters.serial_number.ilike(f"%{search_string}%"),
                Meters.ra_number.ilike(f"%{search_string}%"),
                Meters.trss.ilike(f"%{search_string}%"),
                LandOwners.land_owner_name.ilike(f"%{search_string}%"),
            )
        )

    if sort_by:
        schema_field_name = sort_by_field_to_schema_field(sort_by)

        if sort_direction != SortDirection.Ascending:
            query_statement = query_statement.order_by(desc(schema_field_name))
        else:
            query_statement = query_statement.order_by(schema_field_name) # SQLAlchemy orders ascending by default

    return paginate(db, query_statement)

# Get list of all meters and their coordinates (if they have them)
@meter_router.get("/meters_locations", response_model=List[meter_schemas.MeterMapDTO], tags=["meters"])
async def get_meters_locations(
    db: Session = Depends(get_db),
):

    return db.scalars(
            select(Meters)
                .options(
                    joinedload(Meters.meter_location)
                )
                .where(
                    and_(
                        MeterLocations.latitude.is_not(None),
                        MeterLocations.longitude.is_not(None)
                        )
                    )
                .join(MeterLocations, isouter=True)
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
                    joinedload(Meters.meter_location)
                )
                .filter(Meters.id == meter_id)
            ).first()

@meter_router.get("/meter_history", response_model=None, tags=["meters"])
async def get_meter_history(meter_id: int, db: Session = Depends(get_db)):

    class HistoryType(Enum):
        Activity = 'Activity'
        Observation = 'Observation'
        LocationChange = 'LocationChange'

    activities = db.scalars(select(MeterActivities).filter(MeterActivities.meter_id == meter_id)).all()
    observations = db.scalars(select(MeterObservations).filter(MeterObservations.meter_id == meter_id)).all()

    # Take all the history object we just got from the database and make them into a object that's easy for the frontend to consume
    formattedHistoryItems = []
    itemID = 0

    for activity in activities:
        formattedHistoryItems.append({
            'id': itemID,
            'history_type': HistoryType.Activity,
            'activity_type': activity.activity_type_id,
            'date': activity.timestamp_start,
            'history_item': activity
        })
        itemID += 1

    for observation in observations:
        formattedHistoryItems.append({
            'id': itemID,
            'history_type': HistoryType.Observation,
            'date': observation.timestamp,
            'history_item': observation
        })
        itemID += 1

    # Add location history also

    formattedHistoryItems.sort(key=lambda x: x['date'])

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
