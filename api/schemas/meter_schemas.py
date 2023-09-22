from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel
from api.schemas.security_schemas import User


class ORMBase(BaseModel):
    id: Optional[int] = None # TODO: Make this not optional

    class Config:
        orm_mode = True


class MeterMapDTO(ORMBase):
    class WellDTO(ORMBase):
        class MeterLocationDTO(ORMBase):
            longitude: Optional[float]
            latitude: Optional[float]

        location: Optional[MeterLocationDTO]

    id: int
    well: Optional[WellDTO]


class MeterTypeLU(ORMBase):
    brand: Optional[str]
    series: Optional[str]
    model_number: str
    size: Optional[float]
    description: Optional[str]
    in_use: bool

    # parts: Optional[List[any]]


# The minimal information used by the meters list
class MeterListDTO(ORMBase):
    class WellDTO(ORMBase):
        class LocationDTO(ORMBase):
            class LandOwnerDTO(ORMBase):
                organization: Optional[str]

            trss: Optional[str]
            land_owner: Optional[LandOwnerDTO]

        ra_number: Optional[str]
        location: Optional[LocationDTO]

    class StatusDTO(ORMBase):
        status_name: Optional[str]

    serial_number: str
    well: Optional[WellDTO]
    status: Optional[StatusDTO]


class MeterStatusLU(ORMBase):
    status_name: Optional[str]
    description: Optional[str]


class NoteTypeLU(ORMBase):
    note: Optional[str]
    details: Optional[str]
    slug: Optional[str]


class Meter(ORMBase):
    serial_number: str
    contact_name: Optional[str]
    contact_phone: Optional[str]
    well_distance_ft: Optional[float]
    notes: Optional[str]

    meter_type_id: int
    status_id: int
    well_id: int
    location_id: int

    # meter_type: Optional[any]
    # status: Optional[any]
    # well: Optional[any]
    # location: Optional[any]


# The activity form submitted by the frontend
class ActivityForm(ORMBase):
    class ActivityDetails(ORMBase):
        meter_id: int
        activity_type_id: int
        user_id: int
        date: datetime
        start_time: datetime
        end_time: datetime

    class CurrentInstallation(ORMBase):
        contact_name: Optional[str]
        contact_phone: Optional[str]
        well_id: Optional[int]
        well_distance_ft: Optional[int]
        notes: Optional[str]

    class ObservationForm(ORMBase):
        time: datetime
        reading: float
        property_type_id: int
        unit_id: int

    class MaintenanceRepair(ORMBase):
        service_type_ids: Optional[List[int]]
        description: Optional[str]

    class Notes(ORMBase):
        working_on_arrival_slug: str
        selected_note_ids: Optional[List[int]]

    activity_details: ActivityDetails
    current_installation: CurrentInstallation
    observations: Optional[List[ObservationForm]]
    maintenance_repair: Optional[MaintenanceRepair]
    notes: Notes
    part_used_ids: Optional[List[int]]


class Unit(ORMBase):
    name: Optional[str]
    name_short: Optional[str]
    description: Optional[str]


class ActivityTypeLU(ORMBase):
    name: Optional[str]
    description: Optional[str]


class MeterActivity(ORMBase):
    timestamp_start: datetime
    timestamp_end: datetime
    description: Optional[str]

    submitting_user_id: int
    meter_id: int
    activity_type_id: int
    location_id: int

    # submitting_user: Optional[any]
    # meter: Optional[any]
    # activity_type: Optional[any]
    # location: Optional[any]

    # parts_used: Optional[List[any]]


class ObservedPropertyTypeLU(ORMBase):
    name: Optional[str]
    description: Optional[str]
    context: Optional[str]

    units: Optional[List[Unit]]


class MeterObservation(ORMBase):
    timestamp: datetime
    value: float
    notes: Optional[str]

    submitting_user_id: int
    meter_id: int
    observed_property_type_id: int
    unit_id: int
    location_id: int

    # submitting_user: Optional[User]
    # meter: Optional[Meter]
    # observed_property_type: Optional[ObservedPropertyTypeLU]
    # unit: Optional[Unit]
    # location: Optional[Location]

class ServiceTypeLU(ORMBase):
    service_name: Optional[str]
    description: Optional[str]
