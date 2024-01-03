from datetime import datetime
from api.schemas.base import ORMBase
from api.schemas.well_schemas import Well, Location
from api.schemas.security_schemas import User


class MeterTypeLU(ORMBase):
    brand: str | None = None
    series: str | None = None
    model: str
    size: float | None = None
    description: str | None = None
    in_use: bool


# The minimal information used by the meters list
class MeterListDTO(ORMBase):
    class WellDTO(ORMBase):
        ra_number: str | None = None
        name: str | None = None
        owners: str | None = None

    class LocationDTO(ORMBase):
        trss: str | None = None
        longitude: float | None = None
        latitude: float | None = None

    class StatusDTO(ORMBase):
        status_name: str | None = None

    id: int
    serial_number: str
    well: WellDTO | None = None
    location: LocationDTO | None = None
    status: StatusDTO | None = None


# Similar to MeterListDTO, but focused on location and installed meters
class MeterMapDTO(ORMBase):
    class WellDTO(ORMBase):
        ra_number: str | None = None
        name: str | None = None

    class LocationDTO(ORMBase):
        trss: str | None = None
        longitude: float | None = None
        latitude: float | None = None

    id: int
    serial_number: str
    well: WellDTO | None = None
    location: LocationDTO | None = None


class MeterStatusLU(ORMBase):
    status_name: str | None = None
    description: str | None = None


class NoteTypeLU(ORMBase):
    note: str | None = None
    details: str | None = None
    slug: str | None = None


class SubmitNewMeter(ORMBase):
    serial_number: str
    meter_type: MeterTypeLU

    contact_name: str | None = None
    contact_phone: str | None = None
    notes: str | None = None
    well: Well | None = None


class SubmitMeterUpdate(ORMBase):
    serial_number: str
    contact_name: str | None = None
    contact_phone: str | None = None
    notes: str | None = None
    meter_type: MeterTypeLU
    status: MeterStatusLU | None = None
    well: Well | None = None


class Meter(ORMBase):
    serial_number: str
    contact_name: str | None = None
    contact_phone: str | None = None
    notes: str | None = None

    meter_type_id: int
    status_id: int | None = 6  # Default "unknown"
    well_id: int | None = None
    location_id: int | None = None

    meter_type: MeterTypeLU | None = None
    status: MeterStatusLU | None = None
    well: Well | None = None
    location: Location | None = None


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
        contact_name: str | None = None
        contact_phone: str | None = None
        well_id: int | None = None
        notes: str | None = None

    class ObservationForm(ORMBase):
        time: datetime
        reading: float
        property_type_id: int
        unit_id: int

    class MaintenanceRepair(ORMBase):
        service_type_ids: list[int] | None = None
        description: str | None = None

    class Notes(ORMBase):
        working_on_arrival_slug: str
        selected_note_ids: list[int] | None = None

    activity_details: ActivityDetails
    current_installation: CurrentInstallation
    observations: list[ObservationForm] | None = None
    maintenance_repair: MaintenanceRepair | None = None
    notes: Notes
    part_used_ids: list[int] | None = None


class Unit(ORMBase):
    name: str | None = None
    name_short: str | None = None
    description: str | None = None


class ActivityTypeLU(ORMBase):
    name: str | None = None
    description: str | None = None


class MeterActivity(ORMBase):
    timestamp_start: datetime
    timestamp_end: datetime
    description: str | None = None

    submitting_user_id: int
    meter_id: int
    activity_type_id: int
    location_id: int
    ose_share: bool


class ObservedPropertyTypeLU(ORMBase):
    name: str | None = None
    description: str | None = None
    context: str | None = None

    units: list[Unit] | None = None


class MeterObservation(ORMBase):
    timestamp: datetime
    value: float
    notes: str | None = None

    submitting_user_id: int
    meter_id: int
    observed_property_type_id: int
    unit_id: int
    location_id: int

    submitting_user: User | None = None
    meter: Meter | None = None
    observed_property_type: ObservedPropertyTypeLU | None = None
    unit: Unit | None = None
    location: Location | None = None


class ServiceTypeLU(ORMBase):
    service_name: str | None = None
    description: str | None = None
