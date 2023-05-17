# ===============================================================================
# Routes supporting PVACD activities and observations
# ===============================================================================

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import select

from api.schemas.activity_schemas import (
    Maintenance, 
    ActivitiesFormOptions,
    ObservationType
)
from api.models import *
from api.security import scoped_user
from api.session import get_db

activity_router = APIRouter()

write_user = scoped_user(["read", "activities:write"])


#Endpoint to retrieve activities form options
@activity_router.get(
    "/activities_options",
    dependencies=[Depends(write_user)],
    response_model=ActivitiesFormOptions,
    tags=["Activities"]
)
def get_activity_form_options(db: Session = Depends(get_db)) -> ActivitiesFormOptions:
    '''
    Retrieve all options associated with Activities Form
    '''
    #Get serial numbers
    serial_number_list = []
    serial_numbers = db.execute(select(Meters.serial_number))
    for row in serial_numbers:
        serial_number_list.append(row[0])

    #Get activity types
    activities_list = []
    activities = db.execute(select(Activities.id,Activities.name))
    for row in activities:
        activities_list.append({'activity_id':row[0],'activity_name':row[1]})

    #Get observed properties
    properties_map = {}
    observed_props = db.execute(
        select(
            PropertyUnits.property_id,
            ObservedProperties.name,
            PropertyUnits.unit_id,
            Units.name_short
        ).join(ObservedProperties).join(Units)
    )
    for row in observed_props:
        #Parse rows into ObservationType schema
        row_units = {'unit_id':row[2],'unit_name':row[3]}
        try:
            #If existing property, just add units
            properties_map[row[1]].observed_property_units.append(row_units)
        except KeyError as ke:
            properties_map[row[1]] = ObservationType(
                observed_property_id=row[0],
                observed_property_name=row[1],
                observed_property_units=[row_units]
            )
             

    #Get technicians
    technician_list = []
    technicians = db.execute(select(Worker.id,Worker.name))
    for row in technicians:
        technician_list.append({'technician_id':row[0],'technician_name':row[1]})

    #Get organizations
    organization_list = []
    organizations = db.execute(select(Organizations.id,Organizations.organization_name))
    for row in organizations:
        organization_list.append({'organization_id':row[0],'organization_name':row[1]})

    #Create form options
    form_options = ActivitiesFormOptions(
        serial_numbers=serial_number_list,
        activity_types=activities_list,
        observed_properties=list(properties_map.values()),
        technicians=technician_list,
        organizations=organization_list
    )

    return form_options


#Endpoint to receive meter maintenance form submission
@activity_router.post(
    "/meter_maintenance",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def add_maintenance(maintenance: Maintenance, db: Session = Depends(get_db)):
    '''
    Receive and parse all data associated with a meter maintenance event
    '''
    print(maintenance.activity.dict())

    #Create new MeterActivities object
    activity = MeterActivities(meter_id=maintenance.meter_id,**maintenance.activity.dict())
    db.add(activity)
    db.flush() #Need to flush in order to get activity id for associated parts

    #Update installation
    #None indicates that field should be set null
    #Any fields not in body will not be changed in DB
    if maintenance.installation_update:
        #Get meter from database
        meter = db.scalars(select(Meters).where(Meters.id == maintenance.meter_id)).one()

        for k, v in maintenance.installation_update.dict(exclude_unset=True).items():
            setattr(meter,k,v)

    #Add new observations
    if maintenance.observations:
        for obs in maintenance.observations:
            meter_obs = MeterObservations(meter_id=maintenance.meter_id,**obs.dict())
            db.add(meter_obs)
    
    #Add new parts_used
    #Also subtract count off of parts inventory for a part used
    if maintenance.parts:
        for part in maintenance.parts:
            part_used = db.scalars(select(Part).where(Part.id == part.part_id)).one()
            part_used.count = part_used.count - part.count
            db.add(PartsUsed(meter_activity_id= activity.id, **part.dict()))

    db.commit()
    
    return {'status':'success'}


