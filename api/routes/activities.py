# ===============================================================================
# Routes supporting PVACD activities and observations
# ===============================================================================

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from datetime import datetime

from api.schemas.meter_schemas import (
    ObservedPropertyTypeLU,
    MeterActivity,
    ActivityForm
)
from api.models.main_models import (
    Meters,
    Parts,
    ActivityTypeLU,
    ObservedPropertyTypeLU,
    Units,
    PartsUsed,
    LandOwners,
    MeterActivities,
    MeterObservations,
    PropertyUnits,
    ServiceTypeLU,
    NoteTypeLU,
    PartAssociation,
    Wells,
    Notes,
    ServicesPerformed,
    Locations,
    MeterStatusLU
)
from api.models.security_models import Users
from api.security import scoped_user
from api.session import get_db

activity_router = APIRouter()

write_user = scoped_user(["read", "activities:write"])

# Process a submitted activity
# Returns 442 when one or more required fields of ActivityForm are not present
# Returns the new MeterActivity on success
@activity_router.post(
    "/activities",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def post_activity(activity_form: ActivityForm, db: Session = Depends(get_db)):

    activity_meter = db.scalars(select(Meters).where(activity_form.activity_details.meter_id == Meters.id)).first()
    activity_well = db.scalars(select(Wells).where(activity_form.current_installation.well_id == Wells.id)).first()
    activity_type = db.scalars(select(ActivityTypeLU).where(activity_form.activity_details.activity_type_id == ActivityTypeLU.id)).first()

    if (activity_type.name == 'Uninstall'): # This needs to be a slug
        warehouse_status = db.scalars(select(MeterStatusLU).where(MeterStatusLU.status_name == 'Warehouse')).first()
        assumed_hq_location = db.scalars(select(Locations).where(Locations.type_id == 1)).first() # Probably needs a slug
        activity_meter.location_id = assumed_hq_location.id
        activity_meter.well_id = None
        activity_meter.status_id = warehouse_status.id

    if (activity_type.name == 'Install'):
        installed_status = db.scalars(select(MeterStatusLU).where(MeterStatusLU.status_name == 'Installed')).first()
        activity_meter.well_id = activity_well.id
        activity_meter.location_id = activity_well.location.id
        activity_meter.status_id = installed_status.id

    if(activity_type.name == 'Scrap'):
        scrapped_status = db.scalars(select(MeterStatusLU).where(MeterStatusLU.status_name == 'Scrapped')).first()
        activity_meter.well_id = None
        activity_meter.location_id = None
        activity_meter.status_id = scrapped_status.id

    if(activity_type.name == 'Sell'):
        sold_status = db.scalars(select(MeterStatusLU).where(MeterStatusLU.status_name == 'Sold')).first()
        activity_meter.well_id = None
        activity_meter.location_id = None
        activity_meter.status_id = sold_status.id

    # Make updates to the meter based on user's entry in the current installation section
    if (activity_type.name != 'Uninstall'):
        activity_meter.contact_name = activity_form.current_installation.contact_name
        activity_meter.contact_phone = activity_form.current_installation.contact_phone
        activity_meter.well_distance_ft = activity_form.current_installation.well_distance_ft
        activity_meter.notes = activity_form.current_installation.notes

    # Use the date and times to assign correct timestamp datetimes
    date = activity_form.activity_details.date.date()
    starttime = activity_form.activity_details.start_time.time()
    endtime = activity_form.activity_details.end_time.time()
    start_datetime = datetime.combine(date, starttime)
    end_datetime = datetime.combine(date, endtime)

    # Create the meter activity
    meter_activity = MeterActivities(
            timestamp_start = start_datetime,
            timestamp_end = end_datetime,
            notes = activity_form.maintenance_repair.description,

            submitting_user_id = activity_form.activity_details.user_id,
            meter_id = activity_form.activity_details.meter_id,
            activity_type_id = activity_form.activity_details.activity_type_id,
            location_id = activity_well.location.id,
    )

    # If testing this with seeded test data, must run 'alter sequence "MeterActivities_id_seq" restart with 401' for correct autoinc ID
    db.add(meter_activity)
    db.flush()

    # Create the regular notes
    for note_id in activity_form.notes.selected_note_ids:
        note = Notes(meter_activity_id = meter_activity.id, note_type_id = note_id)
        db.add(note)

    # Create the working status note
    # NOTE: The details section of the NoteTypeLU is being used as a slug (for now), 'working', 'not-working', and 'not-checked' are sent from the form
    # And are checked for below to determine the correct working status note to use
    status_note_type = db.scalars(select(NoteTypeLU).where(NoteTypeLU.details == activity_form.notes.working_on_arrival)).first()
    note = Notes(meter_activity_id = meter_activity.id, note_type_id = status_note_type.id)
    db.add(note)

    # Create the observations
    for observation_form in activity_form.observations:
        observation = MeterObservations(
            timestamp = observation_form.time,
            value = observation_form.reading,
            observed_property_type_id = observation_form.property_type_id,
            unit_id = observation_form.unit_id,
            submitting_user_id = activity_form.activity_details.user_id,
            meter_id = activity_form.activity_details.meter_id,
            location_id = activity_well.location.id
        )
        db.add(observation)

    # Create the part use
    used_parts = db.scalars(select(Parts).where(Parts.id.in_(activity_form.part_used_ids))).all()
    meter_activity.parts_used = used_parts

    # Create the services performed
    for service_type_id in activity_form.maintenance_repair.service_type_ids:
        service = ServicesPerformed(meter_activity_id = meter_activity.id, service_type_id = service_type_id)
        db.add(service)

    db.commit()

    return meter_activity

@activity_router.get(
    "/activity_types",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def get_activity_types(db: Session = Depends(get_db)):
    return db.scalars(select(ActivityTypeLU)).all()

@activity_router.get(
    "/users",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def get_users(db: Session = Depends(get_db)):
    return db.scalars(select(Users).where(Users.disabled == False)).all()

@activity_router.get(
    "/units",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def get_units(db: Session = Depends(get_db)):
    return db.scalars(select(Units)).all()

@activity_router.get(
    "/observed_property_types",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def get_observed_property_types(db: Session = Depends(get_db)):
    return db.scalars(select(ObservedPropertyTypeLU)).all()

@activity_router.get(
    "/service_types",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def get_service_types(db: Session = Depends(get_db)):
    return db.scalars(select(ServiceTypeLU)).all()

@activity_router.get(
    "/note_types",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def get_note_types(db: Session = Depends(get_db)):
    return db.scalars(select(NoteTypeLU)).all()

@activity_router.get(
    "/parts",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def get_parts(db: Session = Depends(get_db)):
    return db.scalars(select(Parts)).all()

@activity_router.get(
    "/meter_parts",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def get_meter_parts(meter_id: int, db: Session = Depends(get_db)):
        meter_type_id = db.scalars(select(Meters.meter_type_id).where(Meters.id == meter_id)).first()
        # return db.scalars(select(PartAssociation.part_id, PartAssociation.commonly_used).where(PartAssociation.meter_type_id == meter_type_id)).all()
        return db.scalars(
                select(PartAssociation)
                    .where(PartAssociation.meter_type_id == meter_type_id)
                    .options(joinedload(PartAssociation.part).joinedload(Parts.part_type))).all()

# Endpoint to receive meter maintenance form submission
# @activity_router.post(
#     "/meter_maintenance",
#     dependencies=[Depends(write_user)],
#     tags=["Activities"],
# )
# async def add_maintenance(maintenance: Maintenance, db: Session = Depends(get_db)):
#     """
#     Receive and parse all data associated with a meter maintenance event
#     """
#     print(maintenance.activity.dict())

#     # Create new MeterActivities object
#     activity = MeterActivities(
#         meter_id=maintenance.meter_id, **maintenance.activity.dict()
#     )
#     db.add(activity)
#     db.flush()  # Need to flush in order to get activity id for associated parts

#     # Update installation
#     # None indicates that field should be set null
#     # Any fields not in body will not be changed in DB
#     if maintenance.installation_update:
#         # Get meter from database
#         meter = db.scalars(
#             select(Meters).where(Meters.id == maintenance.meter_id)
#         ).one()

#         for k, v in maintenance.installation_update.dict(exclude_unset=True).items():
#             setattr(meter, k, v)

#     # Add new observations
#     if maintenance.observations:
#         for obs in maintenance.observations:
#             meter_obs = MeterObservations(meter_id=maintenance.meter_id, **obs.dict())
#             db.add(meter_obs)

#     # Add new parts_used
#     # Also subtract count off of parts inventory for a part used
#     if maintenance.parts:
#         for part in maintenance.parts:
#             part_used = db.scalars(select(Parts).where(Parts.id == part.part_id)).one()
#             part_used.count = part_used.count - part.count
#             db.add(PartsUsed(meter_activity_id=activity.id, **part.dict()))

#     db.commit()

#     return {"status": "success"}
