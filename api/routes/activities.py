# ===============================================================================
# Routes supporting PVACD activities and observations
# ===============================================================================

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from datetime import datetime

from api.schemas.meter_schemas import ActivityForm
from api.models.main_models import (
    Meters,
    ObservedPropertyTypeLU,
    Parts,
    ActivityTypeLU,
    Units,
    MeterActivities,
    MeterObservations,
    ServiceTypeLU,
    NoteTypeLU,
    PartAssociation,
    Wells,
    Locations,
    MeterStatusLU,
    PartTypeLU,
)
from api.models.security_models import Users
from api.security import scoped_user
from api.session import get_db

activity_router = APIRouter()

activity_write_user = scoped_user(["read", "activities:write"])
read_user = scoped_user(["read"])


# Process a submitted activity
# Returns 422 when one or more required fields of ActivityForm are not present
# Returns the new MeterActivity on success
@activity_router.post(
    "/activities",
    dependencies=[Depends(activity_write_user)],
    tags=["Activities"],
)
async def post_activity(activity_form: ActivityForm, db: Session = Depends(get_db)):
    activity_meter = db.scalars(
        select(Meters).where(activity_form.activity_details.meter_id == Meters.id)
    ).first()
    activity_well = db.scalars(
        select(Wells).where(activity_form.current_installation.well_id == Wells.id)
    ).first()
    activity_type = db.scalars(
        select(ActivityTypeLU).where(
            activity_form.activity_details.activity_type_id == ActivityTypeLU.id
        )
    ).first()

    if activity_type.name == "Uninstall":  # This needs to be a slug
        warehouse_status = db.scalars(
            select(MeterStatusLU).where(MeterStatusLU.status_name == "Warehouse")
        ).first()
        assumed_hq_location = db.scalars(
            select(Locations).where(Locations.type_id == 1)
        ).first()  # Probably needs a slug
        activity_meter.location_id = assumed_hq_location.id
        activity_meter.well_id = None
        activity_meter.status_id = warehouse_status.id

    if activity_type.name == "Install":
        installed_status = db.scalars(
            select(MeterStatusLU).where(MeterStatusLU.status_name == "Installed")
        ).first()
        activity_meter.well_id = activity_well.id
        activity_meter.location_id = activity_well.location.id
        activity_meter.status_id = installed_status.id

    if activity_type.name == "Scrap":
        scrapped_status = db.scalars(
            select(MeterStatusLU).where(MeterStatusLU.status_name == "Scrapped")
        ).first()
        activity_meter.well_id = None
        activity_meter.location_id = None
        activity_meter.status_id = scrapped_status.id

    if activity_type.name == "Sell":
        sold_status = db.scalars(
            select(MeterStatusLU).where(MeterStatusLU.status_name == "Sold")
        ).first()
        activity_meter.well_id = None
        activity_meter.location_id = None
        activity_meter.status_id = sold_status.id

    # Make updates to the meter based on user's entry in the current installation section
    if activity_type.name != "Uninstall":
        activity_meter.contact_name = activity_form.current_installation.contact_name
        activity_meter.contact_phone = activity_form.current_installation.contact_phone
        activity_meter.well_distance_ft = (
            activity_form.current_installation.well_distance_ft
        )
        activity_meter.notes = activity_form.current_installation.notes

    # Use the date and times to assign correct timestamp datetimes
    activity_date = activity_form.activity_details.date.date()
    starttime = activity_form.activity_details.start_time.time()
    endtime = activity_form.activity_details.end_time.time()
    start_datetime = datetime.combine(activity_date, starttime)
    end_datetime = datetime.combine(activity_date, endtime)

    # Create the meter activity
    meter_activity = MeterActivities(
        timestamp_start=start_datetime,
        timestamp_end=end_datetime,
        description=activity_form.maintenance_repair.description,
        submitting_user_id=activity_form.activity_details.user_id,
        meter_id=activity_form.activity_details.meter_id,
        activity_type_id=activity_form.activity_details.activity_type_id,
        location_id=activity_well.location.id,
    )

    # If testing this with seeded test data, must run 'alter sequence "MeterActivities_id_seq" restart with 401' for correct autoinc ID
    db.add(meter_activity)
    db.flush()

    # Create the observations
    for observation_form in activity_form.observations:
        observation_time = observation_form.time.time()
        observation_datetime = datetime.combine(activity_date, observation_time)
        observation = MeterObservations(
            timestamp=observation_datetime,
            value=observation_form.reading,
            observed_property_type_id=observation_form.property_type_id,
            unit_id=observation_form.unit_id,
            submitting_user_id=activity_form.activity_details.user_id,
            meter_id=activity_form.activity_details.meter_id,
            location_id=activity_well.location.id,
        )
        db.add(observation)

    # Associate notes
    notes = db.scalars(
        select(NoteTypeLU).where(
            NoteTypeLU.id.in_(activity_form.notes.selected_note_ids)
        )
    ).all()
    meter_activity.notes = notes

    # Associate working status note
    status_note_type = db.scalars(
        select(NoteTypeLU).where(
            NoteTypeLU.slug == activity_form.notes.working_on_arrival_slug
        )
    ).first()
    meter_activity.notes.append(status_note_type)

    # Associate and handle parts use
    used_parts = db.scalars(
        select(Parts).where(Parts.id.in_(activity_form.part_used_ids))
    ).all()
    meter_activity.parts_used = used_parts

    for used_part in used_parts:
        used_part.count -= 1

    # Associate services performed
    services = db.scalars(
        select(ServiceTypeLU).where(
            ServiceTypeLU.id.in_(activity_form.maintenance_repair.service_type_ids)
        )
    ).all()
    meter_activity.services_performed = services

    db.commit()

    return meter_activity


@activity_router.get(
    "/activity_types",
    dependencies=[Depends(read_user)],
    tags=["Activities"],
)
async def get_activity_types(db: Session = Depends(get_db)):
    return db.scalars(select(ActivityTypeLU)).all()


@activity_router.get(
    "/users",
    dependencies=[Depends(read_user)],
    tags=["Activities"],
)
async def get_users(db: Session = Depends(get_db)):
    return db.scalars(select(Users).where(Users.disabled == False)).all()


@activity_router.get(
    "/units",
    dependencies=[Depends(read_user)],
    tags=["Activities"],
)
async def get_units(db: Session = Depends(get_db)):
    return db.scalars(select(Units)).all()


@activity_router.get(
    "/observed_property_types",
    dependencies=[Depends(read_user)],
    tags=["Activities"],
)
async def get_observed_property_types(db: Session = Depends(get_db)):
    return (
        db.scalars(
            select(ObservedPropertyTypeLU).options(
                joinedload(ObservedPropertyTypeLU.units)
            )
        )
        .unique()
        .all()
    )


@activity_router.get(
    "/service_types",
    dependencies=[Depends(read_user)],
    tags=["Activities"],
)
async def get_service_types(db: Session = Depends(get_db)):
    return db.scalars(select(ServiceTypeLU)).all()


@activity_router.get(
    "/note_types",
    dependencies=[Depends(read_user)],
    tags=["Activities"],
)
async def get_note_types(db: Session = Depends(get_db)):
    return db.scalars(select(NoteTypeLU)).all()
