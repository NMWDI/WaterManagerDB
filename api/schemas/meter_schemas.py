from datetime import datetime
from typing import List, Optional, Any
from api.schemas.base import ORMBase
from api.schemas.part_schemas import Part
from api.schemas.well_schemas import Well, Location
from api.schemas.security_schemas import User


class MeterTypeLU(ORMBase):
    brand: Optional[str]
    series: Optional[str]
    model: str
    size: Optional[float]
    description: Optional[str]
    in_use: bool

    # parts: Optional[List[Any]]


# The minimal information used by the meters list
class MeterListDTO(ORMBase):
    class WellDTO(ORMBase):
        ra_number: Optional[str]
        name: Optional[str]
        owners: Optional[str]

    class LocationDTO(ORMBase):
        trss: Optional[str]
        longitude: Optional[float]
        latitude: Optional[float]

    class StatusDTO(ORMBase):
        status_name: Optional[str]

    id: int
    serial_number: str
    well: Optional[WellDTO]
    location: Optional[LocationDTO]
    status: Optional[StatusDTO]


# Similar to MeterListDTO, but focused on location and installed meters
class MeterMapDTO(ORMBase):
    class WellDTO(ORMBase):
        ra_number: Optional[str]
        name: Optional[str]

    class LocationDTO(ORMBase):
        trss: Optional[str]
        longitude: Optional[float]
        latitude: Optional[float]

    id: int
    serial_number: str
    well: Optional[WellDTO]
    location: Optional[LocationDTO]


class MeterStatusLU(ORMBase):
    status_name: Optional[str]
    description: Optional[str]


class NoteTypeLU(ORMBase):
    note: Optional[str]
    details: Optional[str]
    slug: Optional[str]


class SubmitNewMeter(ORMBase):
    serial_number: str
    meter_type: MeterTypeLU

    contact_name: Optional[str]
    contact_phone: Optional[str]
    notes: Optional[str]
    well: Optional[Well]


class SubmitMeterUpdate(ORMBase):
    serial_number: str
    contact_name: Optional[str]
    contact_phone: Optional[str]
    notes: Optional[str]
    meter_type: MeterTypeLU
    status: Optional[MeterStatusLU]
    well: Optional[Well]


class Meter(ORMBase):
    serial_number: str
    contact_name: Optional[str]
    contact_phone: Optional[str]
    notes: Optional[str]

    meter_type_id: int
    status_id: Optional[int]
    well_id: Optional[int]
    location_id: Optional[int]

    meter_type: Optional[MeterTypeLU]
    status: Optional[MeterStatusLU]
    well: Optional[Well]
    location: Optional[Location]


# The activity form submitted by the frontend
class ActivityForm(ORMBase):
    class ActivityDetails(ORMBase):
        meter_id: int
        activity_type_id: int
        user_id: int
        date: datetime
        start_time: datetime
        end_time: datetime
        share_ose: bool = False

    class CurrentInstallation(ORMBase):
        contact_name: Optional[str]
        contact_phone: Optional[str]
        well_id: Optional[int]
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
    ose_share: bool


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

    submitting_user: Optional[User]
    meter: Optional[Meter]
    observed_property_type: Optional[ObservedPropertyTypeLU]
    unit: Optional[Unit]
    location: Optional[Location]


class ServiceTypeLU(ORMBase):
    service_name: Optional[str]
    description: Optional[str]
