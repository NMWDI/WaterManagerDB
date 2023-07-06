# ===============================================================================
# Routes associated with direct interaction with meters
# ===============================================================================
from typing import List

from fastapi import Depends, APIRouter, HTTPException, Security
from sqlalchemy import or_, select, desc, and_
from sqlalchemy.orm import Session, joinedload
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import LimitOffsetPage

from api.schemas import meter_schemas, activity_schemas
from api.models.main_models import (
        Meters,
        MeterTypes,
        Part,
        PartAssociation,
        PartTypeLU,
        Organizations,
        MeterStatusLU,
        MeterActivities,
        MeterObservations,
        Activities
)
from api.route_util import _add, _patch
from api.security import get_current_user, scoped_user
from api.models.security_models import User
from api.session import get_db

from enum import Enum

# Find better location for these
class MeterSortByField(Enum):
    SerialNumber = 'serial_number'
    RANumber = 'ra_number'
    OrganizationName = 'organization_name'
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

            case MeterSortByField.OrganizationName:
                return Organizations.organization_name

            case MeterSortByField.TRSS:
                return Meters.trss

    # Build the query statement based on query params
    query_statement = (
        select(
            Meters.id,
            Meters.serial_number,
            Organizations.organization_name,
            Meters.ra_number,
            Meters.trss,
        )
        .join(Organizations)
    )

    if search_string:
        query_statement = query_statement.where(
            or_(
                Meters.serial_number.ilike(f"%{search_string}%"),
                Meters.ra_number.ilike(f"%{search_string}%"),
                Meters.trss.ilike(f"%{search_string}%"),
                Organizations.organization_name.ilike(f"%{search_string}%"),
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
    stmt = (
        select(
            Meters.id,
            Meters.latitude,
            Meters.longitude,
        )
        .where(
            and_(
                Meters.latitude.is_not(None),
                Meters.longitude.is_not(None)
                )
            )
    )

    return db.execute(stmt).all()

# Get single, fully qualified meter
@meter_router.get("/meter", response_model=meter_schemas.Meter, tags=["meters"])
async def get_meter(
    meter_id: int,
    db: Session = Depends(get_db),
):
    response_data = {}
    response_data["parts_associated"] = []

    # Statement for meter
    stmt = (
        select(
            Meters.id,
            Meters.serial_number,
            MeterTypes.brand,
            MeterTypes.model_number,
            Meters.contact_name,
            Meters.contact_phone,
            Organizations.organization_name.label("organization"),
            MeterStatusLU.status_name.label("status"),
            Meters.ra_number,
            Meters.tag,
            Meters.latitude,
            Meters.longitude,
            Meters.trss,
            Meters.well_distance_ft,
            Meters.notes,
        )
        .join(MeterTypes)
        .join(Organizations)
        .join(MeterStatusLU)
        .where(Meters.id == meter_id)
    )

    result = db.execute(stmt).fetchone()
    for col in result.keys():
        response_data[col] = result[col]

    # Get associated parts
    partstmt = (
        select(
            Part.id.label("part_id"),
            Part.part_number,
            Part.description,
            PartTypeLU.name.label("part_type"),
            PartAssociation.commonly_used,
        )
        .select_from(Meters)
        .join(MeterTypes)
        .join(PartAssociation)
        .join(Part)
        .join(PartTypeLU)
        .where(Meters.id == meter_id)
    )

    #       Remove parts stuff???

    # partresult = db.execute(partstmt)
    # for row in partresult:
    #     response_data["parts_associated"].append(row)

    return response_data

@meter_router.get("/meter_history", response_model=meter_schemas.MeterHistory, tags=["meters"])
async def get_meter_history(meter_id: int, db: Session = Depends(get_db)):

    activitiesStmt = (
        select(
            Meters.id,
            MeterActivities.meter_id,
            MeterActivities.timestamp_start,
            MeterActivities.timestamp_end,
            MeterActivities.activity_id,
            MeterActivities.technician_id,
            MeterActivities.notes,
            MeterActivities.activity
        )
        .where(Meters.id == meter_id)
        .join(MeterActivities, MeterActivities.activity_id == Activities.id)
    )

    observationsStmt = (
        select(
            Meters.id,
            MeterObservations.timestamp,
            MeterObservations.value,
            MeterObservations.observed_property_id,
            MeterObservations.unit_id,
            MeterObservations.notes,
            MeterObservations.technician_id
        )
        .where(Meters.id == meter_id)
        .join(MeterObservations)
    )

    return {
        'activities': db.execute(activitiesStmt).all(),
        'observations': db.execute(observationsStmt).all()
    }



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
