# ===============================================================================
# Routes supporting PVACD activities and observations
# ===============================================================================
from http.client import HTTPException
from typing import List

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import select

from api import schemas
from api.models import Meters, MeterActivities, MeterObservations, PartsUsed, Part
from api.route_util import _add, _patch, _delete
from api.security import scoped_user
from api.session import get_db

activity_router = APIRouter()

write_user = scoped_user(["read", "activities:write"])

#Endpoint to receive meter maintenance form submission
@activity_router.post(
    "/meter_maintenance",
    dependencies=[Depends(write_user)],
    tags=["Activities"],
)
async def add_maintenance(maintenance: schemas.Maintenance, db: Session = Depends(get_db)):
    '''
    Receive and parse all data associated with a meter maintenance event
    '''
    #Create new MeterActivities object
    activity = MeterActivities(meter_id=maintenance.meter_id,**maintenance.activity.dict())
    db.add(activity)
    db.flush() #Need to flush in order to get activity id for associated parts

    #Update installation
    #Empty string or 0 indicates set null
    #None indicates no change
    if maintenance.installation_update:
        #Get meter from database
        meter = db.scalars(select(Meters).where(Meters.id == maintenance.meter_id)).one()

        #Update meter installation
        for k, v in dict(maintenance.installation_update).items():
            if v is not None:
                if (v == 0) or (v == ''):
                    #None in SQLAlchemy means Null in DB
                    setattr(meter,k,None)
                else:
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
    
    return 'dev'


