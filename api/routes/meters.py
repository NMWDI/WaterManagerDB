from typing import List

from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy import or_, select, desc, and_
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import LimitOffsetPage
from enum import Enum

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
    MeterStatusLU,
)
from api.route_util import _patch, _get
from api.session import get_db
from api.enums import ScopedUser, MeterSortByField, SortDirection

meter_router = APIRouter()


# Get paginated, sorted list of meters, filtered by a search string if applicable
@meter_router.get(
    "/meters",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=LimitOffsetPage[meter_schemas.MeterListDTO],
    tags=["Meters"],
)
def get_meters(
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

            case MeterSortByField.WaterUsers:
                return Meters.water_users

            case MeterSortByField.TRSS:
                return Locations.trss

    # Build the query statement based on query params
    # joinedload loads relationships, outer joins on relationship tables makes them search/sortable
    query_statement = (
        select(Meters)
        .options(joinedload(Meters.well), joinedload(Meters.status))
        .join(Wells, isouter=True)
        .join(Locations, isouter=True)
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
                Meters.water_users.ilike(f"%{search_string}%"),
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


@meter_router.post(
    "/meters",
    response_model=meter_schemas.Meter,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Meters"],
)
def create_meter(
    new_meter: meter_schemas.SubmitNewMeter, db: Session = Depends(get_db)
):
    """
    Create a new meter. This requires a SN and meter type.
    Status is infered from based on if a well is provided.
    """
    warehouse_status_id = db.scalars(
        select(MeterStatusLU.id).where(MeterStatusLU.status_name == "Warehouse")
    ).first()

    warehouse_location_id = db.scalars(
        select(Locations.id).where(Locations.name == "headquarters")
    ).first()

    # Create a meter located in warehouse
    new_meter_model = Meters(
        serial_number=new_meter.serial_number,
        contact_name=new_meter.contact_name,
        contact_phone=new_meter.contact_phone,
        meter_type_id=new_meter.meter_type.id,
        status_id=warehouse_status_id,
        location_id=warehouse_location_id,
        meter_owner="PVACD",
    )

    # If there is a well set, update status, well and location
    if new_meter.well:
        new_meter_model.status_id = db.scalars(
            select(MeterStatusLU.id).where(MeterStatusLU.status_name == "Installed")
        ).first()

        new_meter_model.well_id = new_meter.well.id
        new_meter_model.location_id = new_meter.well.location_id

    # Try adding the meter, if it fails due to integrety error...
    try:
        db.add(new_meter_model)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=409, detail="Meter already exists")

    db.refresh(new_meter_model)

    return new_meter_model


# Get search for meters similar to /meters but no pagination and only for installed meters
# Returns all installed meters with a location when search is None
@meter_router.get(
    "/meters_locations",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=List[meter_schemas.MeterMapDTO],
    tags=["Meters"],
)
def get_meters_locations(
    search_string: str = None,
    db: Session = Depends(get_db),
):
    # Build the query statement based on query params
    # joinedload loads relationships, outer joins on relationship tables makes them search/sortable
    query_statement = (
        select(Meters).join(Wells, isouter=True).join(Locations, isouter=True)
    )

    # Ensure there are coordinates and meter is installed
    query_statement = query_statement.where(
        and_(
            Locations.latitude.is_not(None),
            Locations.longitude.is_not(None),
            Meters.status_id == 1,
        )
    )

    if search_string:
        query_statement = query_statement.where(
            or_(
                Meters.serial_number.ilike(f"%{search_string}%"),
                Wells.ra_number.ilike(f"%{search_string}%"),
                Locations.trss.ilike(f"%{search_string}%"),
            )
        )

    return db.scalars(query_statement).all()


# Get single, fully qualified meter
@meter_router.get(
    "/meter",
    tags=["Meters"],
)
def get_meter(
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
    response_model=List[meter_schemas.MeterTypeLU],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Meters"],
)
def get_meter_types(db: Session = Depends(get_db)):
    return db.scalars(select(MeterTypeLU)).all()

# A route to return status types from the MeterStatusLU table
@meter_router.get(
    "/meter_status",
    response_model=List[meter_schemas.MeterStatusLU],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Meters"],
)
def get_meter_status(db: Session = Depends(get_db)):
    return db.scalars(select(MeterStatusLU)).all()


@meter_router.patch(
    "/meter_types",
    response_model=meter_schemas.MeterTypeLU,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Meters"],
)
def update_meter_type(
    updated_meter_type: meter_schemas.MeterTypeLU, db: Session = Depends(get_db)
):
    _patch(db, MeterTypeLU, updated_meter_type.id, updated_meter_type)

    meter_type = db.scalars(
        select(MeterTypeLU).where(MeterTypeLU.id == updated_meter_type.id)
    ).first()

    return meter_type


@meter_router.post(
    "/meter_types",
    response_model=meter_schemas.MeterTypeLU,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Meters"],
)
def create_meter_type(
    new_meter_type: meter_schemas.MeterTypeLU, db: Session = Depends(get_db)
):
    new_type_model = MeterTypeLU(
        brand=new_meter_type.brand,
        series=new_meter_type.series,
        model=new_meter_type.model,
        size=new_meter_type.size,
        description=new_meter_type.description,
        in_use=new_meter_type.in_use,
    )

    db.add(new_type_model)
    db.commit()
    db.refresh(new_type_model)

    return new_type_model


@meter_router.get(
    "/land_owners",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=List[well_schemas.LandOwner],
    tags=["Meters"],
)
def get_land_owners(
    db: Session = Depends(get_db),
):
    return db.scalars(select(LandOwners)).all()


@meter_router.patch(
    "/meter",
    dependencies=[Depends(ScopedUser.Admin)],
    response_model=meter_schemas.Meter,
    tags=["Meters"],
)
def patch_meter(
    updated_meter: meter_schemas.SubmitMeterUpdate, db: Session = Depends(get_db)
):
    """
    Update the current state of a meter. This is only used by Meter Details on the frontend.

    Returns http error if meter SN changed to existing SN.
    """
    meter_db = _get(db, Meters, updated_meter.id)

    # Update the meter (this won't include Well or Location due to schema structure)
    for k, v in updated_meter.model_dump(exclude_unset=True).items():
        try:
            setattr(meter_db, k, v)
        except AttributeError as e:
            print(e)
            continue

    # If there is a well set, update status, well and location
    if updated_meter.well:
        meter_db.status_id = db.scalars(
            select(MeterStatusLU.id).where(MeterStatusLU.status_name == "Installed")
        ).first()

        meter_db.well_id = updated_meter.well.id
        meter_db.location_id = updated_meter.well.location_id
    else:
        # If there is no well set, clear the well and location
        meter_db.location_id = None
        meter_db.well_id = None

    # Update the meter status, if it isn't set don't update it
    if updated_meter.status:
        meter_db.status_id = updated_meter.status.id

    try:
        db.add(meter_db)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=409, detail="Meter already exists")

    return db.scalars(
        select(Meters)
        .options(
            joinedload(Meters.meter_type),
            joinedload(Meters.well).joinedload(Wells.location),
            joinedload(Meters.status),
        )
        .filter(Meters.id == updated_meter.id)
    ).first()


# Build a list of a meter's history (activities and observations)
# There's no real defined structure/schema to this on the front or backend
@meter_router.get(
    "/meter_history", dependencies=[Depends(ScopedUser.Read)], tags=["Meters"]
)
def get_meter_history(meter_id: int, db: Session = Depends(get_db)):
    """
    Get a list of the given meters history.
    No defined schema for this at the moment.
    """

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
