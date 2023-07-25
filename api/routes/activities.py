# ===============================================================================
# Routes supporting PVACD activities and observations
# ===============================================================================

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select

from api.schemas.meter_schemas import (
    ObservedPropertyTypeLU,
    MeterActivity
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
)
from api.models.security_models import Users
from api.security import scoped_user
from api.session import get_db

activity_router = APIRouter()

write_user = scoped_user(["read", "activities:write"])


# Endpoint to retrieve activities form options
# @activity_router.get(
#     "/activities_options",
#     dependencies=[Depends(write_user)],
#     response_model=ActivitiesFormOptions,
#     tags=["Activities"],
# )
# def get_activity_form_options(db: Session = Depends(get_db)) -> ActivitiesFormOptions:
#     """
#     Retrieve all options associated with Activities Form
#     """
#     # Get serial numbers
#     serial_number_list = []
#     serial_numbers = db.execute(select(Meters.serial_number))
#     for row in serial_numbers:
#         serial_number_list.append(row[0])

#     # Get activity types
#     activities_list = []
#     activities = db.execute(select(ActivityTypeLU.id, ActivityTypeLU.name))
#     for row in activities:
#         activities_list.append({"activity_id": row[0], "activity_name": row[1]})

#     # Get observed properties
#     properties_map = {}
#     observed_props = db.execute(
#         select(
#             PropertyUnits.property_id,
#             ObservedPropertyTypeLU.name,
#             PropertyUnits.unit_id,
#             Units.name_short,
#         )
#         .join(ObservedPropertyTypeLU)
#         .join(Units)
#     )
#     for row in observed_props:
#         # Parse rows into ObservationType schema
#         row_units = {"unit_id": row[2], "unit_name": row[3]}
#         try:
#             # If existing property, just add units
#             properties_map[row[1]].observed_property_units.append(row_units)
#         except KeyError as ke:
#             properties_map[row[1]] = ObservationType(
#                 observed_property_id=row[0],
#                 observed_property_name=row[1],
#                 observed_property_units=[row_units],
#             )

#     # Get technicians
#     technician_list = []
#     technicians = db.execute(select(Users.id, Users.full_name))
#     for row in technicians:
#         technician_list.append({"technician_id": row[0], "technician_name": row[1]})

#     # Get organizations

#     # Removing until locations is fixed
#     # land_owner_list = []
#     # land_owners = db.execute(select(LandOwners.id, LandOwners.land_owner_name))
#     # for row in land_owners:
#     #     land_owner_list.append({"land_owner_id": row[0], "land_owner_name": row[1]})

#     # Create form options
#     form_options = ActivitiesFormOptions(
#         serial_numbers=serial_number_list,
#         activity_types=activities_list,
#         observed_properties=list(properties_map.values()),
#         technicians=technician_list,
#         # land_owners=land_owner_list,
#         land_owners=[],
#     )

#     return form_options


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
