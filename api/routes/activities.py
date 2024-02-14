from fastapi import Depends, APIRouter
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from datetime import datetime
from typing import List

from api.schemas import meter_schemas
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
    Wells,
    Locations,
    MeterStatusLU,
    Users,
)
from api.session import get_db
from api.security import get_current_user
from api.enums import ScopedUser

activity_router = APIRouter()


# Process a submitted activity
# Returns 422 when one or more required fields of ActivityForm are not present
# Returns the new MeterActivity on success
@activity_router.post(
    "/activities",
    response_model=meter_schemas.MeterActivity,
    dependencies=[Depends(ScopedUser.ActivityWrite)],
    tags=["Activities"],
)
def post_activity(
    activity_form: meter_schemas.ActivityForm, db: Session = Depends(get_db)
):
    """
    Handles submission of an activity.
    """

    # First check that the date and time of the activity are newer than the last activity
    last_activity = db.scalars(
        select(MeterActivities)
        .where(MeterActivities.meter_id == activity_form.activity_details.meter_id)
        .order_by(MeterActivities.timestamp_end.desc())
        .limit(1)
    ).first()

    # Calculate event start and end datetimes
    activity_date = activity_form.activity_details.date.date()
    # Set the times to have 0 seconds, this prevents accidental duplicate activities
    starttime = activity_form.activity_details.start_time.time().replace(second=0)
    endtime = activity_form.activity_details.end_time.time().replace(second=0)
    start_datetime = datetime.combine(activity_date, starttime)
    end_datetime = datetime.combine(activity_date, endtime)

    if last_activity:
        if last_activity.timestamp_end > end_datetime:
            raise HTTPException(
                status_code=409,
                detail="Submitted activity is older than the last activity.",
            )

    activity_meter = db.scalars(
        select(Meters).where(activity_form.activity_details.meter_id == Meters.id)
    ).first()

    activity_type = db.scalars(
        select(ActivityTypeLU).where(
            activity_form.activity_details.activity_type_id == ActivityTypeLU.id
        )
    ).first()

    # Get the location of the activity based on the well associated with the meter
    # If there is no well, assume the activity took place at the "Warehouse"
    hq_location = db.scalars(
        select(Locations).where(Locations.type_id == 1)
    ).first()  # Probably needs a slug

    if activity_form.current_installation.well_id:
        activity_well = db.scalars(
            select(Wells).where(activity_form.current_installation.well_id == Wells.id)
        ).first()
        activity_location = activity_well.location.id
    else:
        activity_location = hq_location.id

    # ---- Update the meter based on the activity type ----
    if activity_type.name == "Uninstall":  # This needs to be a slug
        warehouse_status = db.scalars(
            select(MeterStatusLU).where(MeterStatusLU.status_name == "Warehouse")
        ).first()

        activity_meter.location_id = hq_location.id
        activity_meter.well_id = None
        activity_meter.status_id = warehouse_status.id
        activity_meter.water_users = None

    if activity_type.name == "Install":
        installed_status = db.scalars(
            select(MeterStatusLU).where(MeterStatusLU.status_name == "Installed")
        ).first()
        activity_meter.well_id = activity_well.id
        activity_meter.location_id = activity_location
        activity_meter.status_id = installed_status.id
        activity_meter.water_users = activity_form.current_installation.water_users

    if activity_type.name == "Scrap":
        scrapped_status = db.scalars(
            select(MeterStatusLU).where(MeterStatusLU.status_name == "Scrapped")
        ).first()
        activity_meter.well_id = None
        activity_meter.location_id = None
        activity_meter.status_id = scrapped_status.id
        activity_meter.water_users = None
        activity_meter.meter_owner = None

    if activity_type.name == "Sell":
        sold_status = db.scalars(
            select(MeterStatusLU).where(MeterStatusLU.status_name == "Sold")
        ).first()
        activity_meter.well_id = None
        activity_meter.location_id = None
        activity_meter.status_id = sold_status.id
        activity_meter.water_users = None
        activity_meter.meter_owner = activity_form.current_installation.meter_owner

    if activity_type.name == "Change Water Users":
        activity_meter.water_users = activity_form.current_installation.water_users

    # Make updates to the meter based on user's entry in the current installation section
    if activity_type.name != "Uninstall":
        activity_meter.contact_name = activity_form.current_installation.contact_name
        activity_meter.contact_phone = activity_form.current_installation.contact_phone
        activity_meter.notes = activity_form.current_installation.notes

    # ---- Create the activity itself ----
    meter_activity = MeterActivities(
        timestamp_start=start_datetime,
        timestamp_end=end_datetime,
        description=activity_form.maintenance_repair.description,
        submitting_user_id=activity_form.activity_details.user_id,
        meter_id=activity_form.activity_details.meter_id,
        activity_type_id=activity_form.activity_details.activity_type_id,
        location_id=activity_location,
        ose_share=activity_form.activity_details.share_ose,
        water_users=activity_form.current_installation.water_users,
    )

    try:
        db.add(meter_activity)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(
            status_code=409, detail="Activity overlaps with existing activity."
        )

    db.flush()

    # Create the observations
    if activity_form.activity_details.share_ose:
        # Set OSE flag in observation to true
        share_ose_observation = True
    else:
        share_ose_observation = False

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
            location_id=activity_location,
            ose_share=share_ose_observation,
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
    response_model=List[meter_schemas.ActivityTypeLU],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Activities"],
)
def get_activity_types(
    db: Session = Depends(get_db), user: Users = Depends(get_current_user)
):
    """
    Only returns activity types approved for user type.
    """
    if user.user_role.name not in ["Admin", "Technician"]:
        return []
    else:
        activities = db.scalars(select(ActivityTypeLU)).all()
        if user.user_role.name != "Admin":
            return [
                activity
                for activity in activities
                if activity.name not in ["Sell", "Scrap"]
            ]

    return activities


@activity_router.get(
    "/users",
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Activities"],
)
def get_users(db: Session = Depends(get_db)):
    return db.scalars(select(Users).where(Users.disabled == False)).all()


@activity_router.get(
    "/units",
    response_model=List[meter_schemas.Unit],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Activities"],
)
def get_units(db: Session = Depends(get_db)):
    return db.scalars(select(Units)).all()


@activity_router.get(
    "/observed_property_types",
    response_model=List[meter_schemas.ObservedPropertyTypeLU],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Activities"],
)
def get_observed_property_types(db: Session = Depends(get_db)):
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
    response_model=List[meter_schemas.ServiceTypeLU],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Activities"],
)
def get_service_types(db: Session = Depends(get_db)):
    return db.scalars(select(ServiceTypeLU)).all()


@activity_router.get(
    "/note_types",
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Activities"],
)
def get_note_types(db: Session = Depends(get_db)):
    return db.scalars(select(NoteTypeLU)).all()
