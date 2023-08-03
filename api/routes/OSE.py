'''
Routes related to OSE reporting and work requests
'''
from typing import List
from datetime import datetime, date

from pydantic import BaseModel
from fastapi import Depends, APIRouter
from sqlalchemy import select, and_
from sqlalchemy.orm import Session, joinedload
from enum import Enum

from api.schemas import ose_schemas
from api.models.main_models import (
    Meters,
    MeterActivities,
    MeterObservations,
    Wells
)

from api.security import scoped_user
from api.session import get_db
from typing import Optional, List

ose_router = APIRouter()
# ose_user = scoped_user(["read", "admin", "ose"])
ose_user = scoped_user(["read", "admin"])

class ORMBase(BaseModel):

    class Config:
        orm_mode = True


class ActivityDTO(BaseModel):
    activity_type: str
    # meter_sn: str
    # description: str
    # services: List[str]
    # notes: List[str]
    # parts_used: List[str]

class ObservationDTO(BaseModel):
    observation_time: datetime
    observation_type: str
    measurement: float
    units: str

class MeterHistoryDTO(BaseModel):

    # location: str
    # ra_numbers: List[str]
    # owners: List[str]
    activities: List[ActivityDTO]
    # observations: List[ObservationDTO]
    name: str

class DateHistoryDTO(BaseModel):
    date: date
    meters: List[MeterHistoryDTO] = []

# add reponse model?
@ose_router.get(
        "/ose_well_history",
        response_model=List[DateHistoryDTO],
        tags=["OSE"]
    )
def get_ose_history(start_datetime: datetime, end_datetime: datetime,db: Session = Depends(get_db)):
    '''
    Returns activities and meter readings for each OSE well over input date range
    '''

    # Get all activities in the date range
    activities = (
        db.scalars(
            select(MeterActivities)
            .options(
                joinedload(MeterActivities.location),
                joinedload(MeterActivities.submitting_user),
                joinedload(MeterActivities.activity_type),
                joinedload(MeterActivities.parts_used),
                joinedload(MeterActivities.meter),
            )
            .filter(and_(MeterActivities.timestamp_end >= start_datetime, MeterActivities.timestamp_end <= end_datetime))
        )
        .unique()
        .all()
    )

    # not just activities, should probably get activity and observation dates, then combine, set, and sort them
    dates_with_history = sorted(set(map(lambda activity: activity.timestamp_end.date(), activities)))

    # For each date, build the list of meters and their activities that occured
    history_list = []
    for date_with_history in dates_with_history:

        # Get activities that occur on this day (current loop value's date), use that to get meters that have activities on the date
        activities_on_date = filter(lambda activity: activity.timestamp_end.date() == date_with_history, activities)

        # for a in activities_on_date:
        #     print(a.activity_type.name)
        meters_with_activities_on_date = map(lambda activity: activity.meter, activities_on_date)

        # For each meter that has history on this day, build its history object
        meter_history_list = []
        for meter_with_activities in meters_with_activities_on_date:

            meter_activities_on_date = filter(lambda activity: activity.meter.id == meter_with_activities.id, activities_on_date)

            # For each activity that occurred on this day, on this meter, build its information object
            meter_activity_list = []
            print("DATE: ", date_with_history)
            for meter_activity in meter_activities_on_date:
                print(meter_activity.__dict__)
                activity = ActivityDTO(activity_type=meter_activity.activity_type.name)
                meter_activity_list.append(activity)

            meter_history = MeterHistoryDTO(
                name=meter_with_activities.serial_number,
                activities=meter_activity_list
            )
            meter_history_list.append(meter_history)


        date_history = DateHistoryDTO(
            date=date_with_history,
            meters=meter_history_list
        )

        history_list.append(date_history)

    return history_list
