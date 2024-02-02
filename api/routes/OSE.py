from datetime import datetime, date, time

from pydantic import BaseModel
from fastapi import Depends, APIRouter
from sqlalchemy import select, and_
from sqlalchemy.orm import Session, joinedload

from api.models.main_models import (
    Meters,
    MeterActivities,
    MeterObservations,
)

from api.session import get_db
from api.enums import ScopedUser

ose_router = APIRouter()


class ObservationDTO(BaseModel):
    observation_time: time  # Will be associated with a given activity
    observation_type: str
    measurement: float
    units: str


class ActivityDTO(BaseModel):
    activity_id: int
    activity_start: datetime
    activity_end: datetime
    activity_type: str
    well_ra_number: str | None
    well_ose_tag: str | None
    description: str
    services: list[str]
    notes: list[str]
    parts_used: list[str]
    observations: list[ObservationDTO]


class MeterHistoryDTO(BaseModel):
    serial_number: str
    activities: list[ActivityDTO]


class DateHistoryDTO(BaseModel):
    date: date
    meters: list[MeterHistoryDTO] = []


def getObservations(
    activity_start: datetime,
    activity_end: datetime,
    meter_id: int,
    observations: list[MeterObservations],
) -> list[ObservationDTO]:
    """
    A function to return a list of observations that occurred during a given activity
    """
    observations_list = []
    for observation in observations:
        if (
            observation.timestamp >= activity_start
            and observation.timestamp <= activity_end
            and observation.meter_id == meter_id
        ):
            observation = ObservationDTO(
                observation_time=observation.timestamp.time(),
                observation_type=observation.observed_property.name,
                measurement=observation.value,
                units=observation.unit.name_short,
            )
            observations_list.append(observation)

    return observations_list


@ose_router.get(
    "/ose_well_history",
    dependencies=[Depends(ScopedUser.OSE)],
    response_model=list[DateHistoryDTO],
    tags=["OSE"],
)
def get_ose_history(
    start_datetime: datetime, end_datetime: datetime, db: Session = Depends(get_db)
):
    """
    Returns activities and meter readings for each OSE well over input date range.

    Datetime Format ISO8601: YYYY-MM-DDTHH:MM:SS+HH:MM, example 2023-09-12T00:00:00+00:00
    """

    # Get all activities in the date range
    activities = (
        db.scalars(
            select(MeterActivities)
            .options(
                joinedload(MeterActivities.activity_type),
                joinedload(MeterActivities.parts_used),
                joinedload(MeterActivities.meter).joinedload(Meters.well),
            )
            .filter(
                and_(
                    MeterActivities.timestamp_end >= start_datetime,
                    MeterActivities.timestamp_end <= end_datetime,
                    MeterActivities.ose_share == True,
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
                    MeterObservations.ose_share == True,
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

    # For each date, build the list of meters and their activities that occured
    history_list = []
    for date_with_history in activity_dates:
        # Get activities/observations that occur on this day (current loop value's date), use that to get meters that have activities/observations on the date
        activities_on_date = list(
            filter(
                lambda activity: activity.timestamp_end.date() == date_with_history,
                activities_list,
            )
        )

        meters_with_activities_on_date: list[activities] = list(
            map(lambda activity: activity.meter, activities_on_date)
        )

        # For each meter that has history on this day, build its history object
        meter_history_list = []
        for meter_with_history in meters_with_activities_on_date:
            meter_activities_on_date = list(
                filter(
                    lambda activity: activity.meter.id == meter_with_history.id,
                    activities_on_date,
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
                activity_observations = getObservations(
                    meter_activity.timestamp_start,
                    meter_activity.timestamp_end,
                    meter_activity.meter_id,
                    observations_list,
                )

                # Some activities are not associated with a well
                # If well is none, set the well's RA number and OSE tag to None
                if not meter_activity.meter.well:
                    ra_number = None
                    ose_tag = None
                else:
                    ra_number = meter_activity.meter.well.ra_number
                    ose_tag = meter_activity.meter.well.osetag

                activity = ActivityDTO(
                    activity_id=meter_activity.id,
                    activity_type=meter_activity.activity_type.name,
                    activity_start=meter_activity.timestamp_start,
                    activity_end=meter_activity.timestamp_end,
                    well_ra_number=ra_number,
                    well_ose_tag=ose_tag,
                    description=meter_activity.description,
                    services=services_performed_strings,
                    notes=notes_strings,
                    parts_used=parts_used_strings,
                    observations=activity_observations,
                )
                meter_activity_list.append(activity)

            # Use the meter's info and it's history that occurred on this day to build its information object
            meter_history = MeterHistoryDTO(
                serial_number=meter_with_history.serial_number,
                activities=meter_activity_list,
            )
            meter_history_list.append(meter_history)

        date_history = DateHistoryDTO(date=date_with_history, meters=meter_history_list)

        history_list.append(date_history)

    return history_list
