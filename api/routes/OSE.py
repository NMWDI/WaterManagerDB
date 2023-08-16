"""
Routes related to OSE reporting and work requests
"""
from typing import List
from datetime import datetime, date

from pydantic import BaseModel
from fastapi import Depends, APIRouter
from sqlalchemy import select, and_
from sqlalchemy.orm import Session, joinedload

from api.models.main_models import (
    Meters,
    MeterActivities,
    MeterObservations,
)

from api.security import scoped_user
from api.session import get_db

ose_router = APIRouter()
ose_user = scoped_user(["ose"])


class ActivityDTO(BaseModel):
    activity_type: str
    meter_sn: str
    description: str
    services: List[str]
    notes: List[str]
    parts_used: List[str]


class ObservationDTO(BaseModel):
    observation_time: datetime
    observation_type: str
    measurement: float
    units: str


class MeterHistoryDTO(BaseModel):
    name: str
    location: str
    ra_numbers: List[str]
    owners: List[str]
    activities: List[ActivityDTO]
    observations: List[ObservationDTO]


class DateHistoryDTO(BaseModel):
    date: date
    meters: List[MeterHistoryDTO] = []

@ose_router.get(
        "/ose_well_history",
        dependencies=[Depends(ose_user)],
        response_model=List[DateHistoryDTO],
        tags=["OSE"]
    )
def get_ose_history(start_datetime: datetime, end_datetime: datetime,db: Session = Depends(get_db)):
    """
    Returns activities and meter readings for each OSE well over input date range
    """

    # Get all activities in the date range
    activities = (
        db.scalars(
            select(MeterActivities)
            .options(
                joinedload(MeterActivities.location),
                joinedload(MeterActivities.submitting_user),
                joinedload(MeterActivities.activity_type),
                joinedload(MeterActivities.parts_used),
                joinedload(MeterActivities.meter).joinedload(Meters.well),
            )
            .filter(
                and_(
                    MeterActivities.timestamp_end >= start_datetime,
                    MeterActivities.timestamp_end <= end_datetime,
                )
            )
        )
        .unique()
        .all()
    )

    # Get all observations in the date range
    observations = (
        db.scalars(
            select(MeterObservations)
            .options(
                joinedload(MeterObservations.observed_property),
                joinedload(MeterObservations.unit),
                joinedload(MeterObservations.meter),
            )
            .filter(
                and_(
                    MeterObservations.timestamp >= start_datetime,
                    MeterObservations.timestamp <= end_datetime,
                )
            )
        )
        .unique()
        .all()
    )

    # Store results in list so we can iterate over it multiple times (as opposed to using the SQLAlchemy cursor)
    activities_list = list(activities)
    observations_list = list(observations)

    # Get all dates that have activities or observations
    activity_dates = list(
        map(lambda activity: activity.timestamp_end.date(), activities_list)
    )
    observation_dates = list(
        map(lambda observation: observation.timestamp.date(), observations_list)
    )
    dates_with_history = sorted(set(activity_dates + observation_dates))

    # For each date, build the list of meters and their activities that occured
    history_list = []
    for date_with_history in dates_with_history:
        # Get activities/observations that occur on this day (current loop value's date), use that to get meters that have activities/observations on the date
        activities_on_date = list(
            filter(
                lambda activity: activity.timestamp_end.date() == date_with_history,
                activities_list,
            )
        )
        observations_on_date = list(
            filter(
                lambda observation: observation.timestamp.date() == date_with_history,
                observations_list,
            )
        )

        meters_with_activities_on_date = list(
            map(lambda activity: activity.meter, activities_on_date)
        )
        meters_with_observations_on_date = list(
            map(lambda observation: observation.meter, observations_on_date)
        )
        meters_with_history_on_date = set(
            meters_with_activities_on_date + meters_with_observations_on_date
        )

        # For each meter that has history on this day, build its history object
        meter_history_list = []
        for meter_with_history in meters_with_history_on_date:
            meter_activities_on_date = list(
                filter(
                    lambda activity: activity.meter.id == meter_with_history.id,
                    activities_on_date,
                )
            )
            meter_observations_on_date = list(
                filter(
                    lambda observation: observation.meter.id == meter_with_history.id,
                    observations_on_date,
                )
            )

            # For each activity that occurred on this day, on this meter, build its information object
            meter_activity_list = []
            for meter_activity in meter_activities_on_date:
                notes_strings = list(map(lambda note: note.note, meter_activity.notes))
                parts_used_strings = list(
                    map(
                        lambda part: f"{part.part_type.name} ({part.part_number})",
                        meter_activity.parts_used,
                    )
                )
                services_performed_strings = list(
                    map(
                        lambda service: service.service_name,
                        meter_activity.services_performed,
                    )
                )

                activity = ActivityDTO(
                    activity_type=meter_activity.activity_type.name,
                    meter_sn=meter_with_history.serial_number,
                    description="",
                    services=services_performed_strings,
                    notes=notes_strings,
                    parts_used=parts_used_strings,
                )
                meter_activity_list.append(activity)

            # For each observation that occurred on this day, on this meter, build its information object
            meter_observation_list = []
            for meter_observation in meter_observations_on_date:
                observation = ObservationDTO(
                    observation_time=meter_observation.timestamp,
                    observation_type=meter_observation.observed_property.name,
                    measurement=meter_observation.value,
                    units=meter_observation.unit.name_short,
                )
                meter_observation_list.append(observation)

            # This is messy, but may be subject to change while we change relationships
            meter_well = meter_with_history.well
            meter_location = (
                meter_well.location
                if meter_well != None
                else meter_with_history.location
            )
            land_owner = meter_location.land_owner if meter_location != None else None
            ra_number = meter_well.ra_number if meter_well != None else "N/A (NO WELL)"
            owners = (
                land_owner.organization if land_owner != None else "N/A (NO LAND OWNER)"
            )

            # Use the meter's info and it's history that occurred on this day to build its information object
            meter_history = MeterHistoryDTO(
                name=meter_with_history.serial_number,
                activities=meter_activity_list,
                observations=meter_observation_list,
                location=meter_location.name
                if meter_location != None
                else "N/A (NO LOCATION)",
                ra_numbers=[ra_number],
                owners=[owners],
            )
            meter_history_list.append(meter_history)

        date_history = DateHistoryDTO(date=date_with_history, meters=meter_history_list)

        history_list.append(date_history)

    return history_list
