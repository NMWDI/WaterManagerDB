from datetime import datetime, date, time

from pydantic import BaseModel
from fastapi import Depends, APIRouter, HTTPException, Query
from sqlalchemy import select, and_
from sqlalchemy.orm import Session, joinedload

from api.models.main_models import (
    Meters,
    MeterActivities,
    MeterObservations,
    Wells,
    meterRegisters,
    workOrders,
)

from api.schemas import meter_schemas
from api.session import get_db
from api.enums import ScopedUser

ose_router = APIRouter(dependencies=[Depends(ScopedUser.OSE)])


class ObservationDTO(BaseModel):
    observation_time: time  # Will be associated with a given activity
    observation_type: str
    measurement: float
    units: str


class ActivityDTO(BaseModel):
    activity_id: int
    ose_request_id: int | None = None
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

def reorganizeHistory(activities: list[MeterActivities], observations: list[MeterObservations]) -> list[DateHistoryDTO]:
    """
    A function to reorganize the data into the desired format for OSE history
    """
    # Reorganize the data into dictionaries mapping date and meter serial number to activities history{date: {meter: [activities]}}
    history = {}
    for activity in activities:
        date = activity.timestamp_start.strftime("%Y-%m-%d")
        meter = activity.meter.serial_number

        if date not in history:
            history[date] = {}

        if meter not in history[date]:
            history[date][meter] = []

        history[date][meter].append(activity)

    # Build the output list of DateHistoryDTO objects from the history dictionary
    history_list = []
    for date, meters in history.items():
        meter_history_list = []
        for meter, activities in meters.items():
            meter_activity_list = []
            for activity in activities:
                notes_strings = list(map(lambda note: note.note, activity.notes))
                parts_used_strings = list(
                    map(
                        lambda part: f"{part.part_type.name} ({part.part_number})",
                        activity.parts_used,
                    )
                )
                services_performed_strings = list(
                    map(
                        lambda service: service.service_name,
                        activity.services_performed,
                    )
                )
                activity_observations = getObservations(
                    activity.timestamp_start,
                    activity.timestamp_end,
                    activity.meter_id,
                    observations,
                )

                # Some activities are not associated with a well
                # If well is none, set the well's RA number and OSE tag to None
                if not activity.meter.well:
                    ra_number = None
                    ose_tag = None
                else:
                    ra_number = activity.meter.well.ra_number
                    ose_tag = activity.meter.well.osetag

                activity = ActivityDTO(
                    activity_id=activity.id,
                    ose_request_id=activity.work_order.ose_request_id if activity.work_order else None,
                    activity_type=activity.activity_type.name,
                    activity_start=activity.timestamp_start,
                    activity_end=activity.timestamp_end,
                    well_ra_number=ra_number,
                    well_ose_tag=ose_tag,
                    description=activity.description,
                    services=services_performed_strings,
                    notes=notes_strings,
                    parts_used=parts_used_strings,
                    observations=activity_observations,
                )
                meter_activity_list.append(activity)

            meter_history = MeterHistoryDTO(
                serial_number=meter, activities=meter_activity_list
            )
            meter_history_list.append(meter_history)

        date_history = DateHistoryDTO(date=date, meters=meter_history_list)
        history_list.append(date_history)

    return history_list


@ose_router.get(
    "/shared_meter_maintenance_history",
    response_model=list[DateHistoryDTO],
    tags=["OSE"],
)
def get_shared_history(
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
                joinedload(MeterActivities.work_order)
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

    return reorganizeHistory(activities_list, observations_list)

@ose_router.get(
    "/meter_maintenance_by_ose_request_id",
    response_model=list[DateHistoryDTO],
    tags=["OSE"],
)
def get_ose_maintenance_by_requestID(
    ose_request_ids: list[int] = Query(None), db: Session = Depends(get_db)
):
    """
    Returns activities and meter readings for each OSE well associated with a given OSE request ID.
    """

    # Get all activities in the date range
    activities = (
        db.scalars(
            select(MeterActivities)
            .options(
                joinedload(MeterActivities.activity_type),
                joinedload(MeterActivities.parts_used),
                joinedload(MeterActivities.meter).joinedload(Meters.well),
                joinedload(MeterActivities.work_order)
            )
            .join(workOrders)
            .where(
                and_(
                    workOrders.ose_request_id.in_(ose_request_ids),
                    MeterActivities.ose_share == True,
                )
            )
        )
        .unique()
        .all()
    )

    # Convert activities to a list so we can iterate over it multiple times (as opposed to using the SQLAlchemy cursor)
    activities_list = list(activities)

    if not activities_list:
        return []
    
    # Since observations do no include the OSE request ID, figure out what observations are associated with the activities using a date range
    activities_start_date = min([activity.timestamp_start for activity in activities_list])
    activities_end_date = max([activity.timestamp_end for activity in activities_list])

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
                    MeterObservations.timestamp >= activities_start_date,
                    MeterObservations.timestamp <= activities_end_date,
                    MeterObservations.ose_share == True,
                )
            )
        )
        .unique()
        .all()
    )

    # Store results in list so we can iterate over it multiple times (as opposed to using the SQLAlchemy cursor)
    observations_list = list(observations)

    return reorganizeHistory(activities_list, observations_list)

@ose_router.get(
    "/meter_information",
    tags=["OSE"],
    response_model=meter_schemas.PublicMeter,
)
def get_meter_information(
    serial_number: str,
    db: Session = Depends(get_db),
):

    # Create the basic query
    query = select(Meters).options(
            joinedload(Meters.meter_type),
            joinedload(Meters.well).joinedload(Wells.location),
            joinedload(Meters.status),
            joinedload(Meters.meter_register).joinedload(meterRegisters.dial_units),
            joinedload(Meters.meter_register).joinedload(meterRegisters.totalizer_units),
        )
    
    query = query.filter(Meters.serial_number == serial_number)

    # Execute the query
    meter = db.scalars(query).first()

    if not meter:
        raise HTTPException(status_code=404, detail="Meter not found")

    # Manually create the response model because the object and response are organized differently
    output_meter = meter_schemas.PublicMeter(
        serial_number=meter.serial_number,
        status=meter.status.status_name,
        well=meter_schemas.PublicMeter.PublicWell(
            ra_number=meter.well.ra_number,
            osetag=meter.well.osetag,
            trss=meter.well.location.trss,
            longitude=meter.well.location.longitude,
            latitude=meter.well.location.latitude,
        ) if meter.well else None,
        notes=meter.notes,
        meter_type=meter_schemas.PublicMeter.MeterType(
            brand=meter.meter_type.brand,
            model=meter.meter_type.model,
            size=meter.meter_type.size,
        ),
        meter_register=meter_schemas.PublicMeter.MeterRegister(
            ratio=meter.meter_register.ratio,
            number_of_digits=meter.meter_register.number_of_digits,
            decimal_digits=meter.meter_register.decimal_digits,
            dial_units=meter.meter_register.dial_units.name,
            totalizer_units=meter.meter_register.totalizer_units.name,
            multiplier=meter.meter_register.multiplier,
        ) if meter.meter_register else None,
    )

    return output_meter
