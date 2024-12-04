from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

from api.schemas.security_schemas import User
from api.schemas.base import ORMBase

class ORMBaseSimple(BaseModel):
    class Config:
        from_attributes = True


class LandOwner(ORMBase):
    contact_name: str | None = None
    organization: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip: str | None = None
    phone: str | None = None
    email: str | None = None
    city: str | None = None


class Location(ORMBase):
    name: str | None = None
    type_id: int
    trss: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    township: int | None = None
    range: int | None = None
    section: int | None = None
    quarter: int | None = None
    half_quarter: int | None = None
    quarter_quarter: int | None = None
    land_owner_id: int | None = None

    land_owner: LandOwner | None = None


class WellUseLU(ORMBase):
    use_type: str
    code: str | None = None
    description: str | None = None

class WaterSources(ORMBase):
    name: str
    description: str | None = None

class WellMeterInfo(ORMBase):
    '''Subset of Meter schema'''
    serial_number: str
    water_users: str | None = None

class Well(ORMBase):
    name: str | None = None
    ra_number: str | None = None
    owners: str | None = None
    osetag: str | None = None

    location_id: int | None = None
    use_type_id: int | None = None

    location: Location | None = None
    use_type: WellUseLU | None = None
    water_source: WaterSources | None = None

    meters: list[WellMeterInfo] | None = None


class SubmitWellCreate(ORMBaseSimple):
    class SubmitLocationCreate(ORMBaseSimple):
        name: str | None = None
        trss: str
        longitude: float
        latitude: float

    class SubmitUseTypeCreate(ORMBaseSimple):
        id: int

    name: str | None = None
    ra_number: str | None = None
    owners: str | None = None
    osetag: str | None = None

    location: SubmitLocationCreate
    use_type: SubmitUseTypeCreate
    water_source: WaterSources | None = None


class SubmitWellUpdate(ORMBaseSimple):
    class SubmitLocationUpdate(ORMBaseSimple):
        id: int
        name: str
        trss: str
        longitude: float
        latitude: float

    class SubmitUseTypeUpdate(ORMBaseSimple):
        id: int

    id: int
    name: str
    ra_number: str | None = None
    owners: str | None = None
    osetag: str | None = None

    location: SubmitLocationUpdate
    use_type: SubmitUseTypeUpdate
    water_source: WaterSources

class SubmitWellMerge(ORMBaseSimple):
    merge_well: str
    target_well: str

class WellListDTO(ORMBase):
    name: str | None = None


class LocationTypeLU(ORMBase):
    type_name: str | None = None
    description: str | None = None


class WellMeasurement(ORMBase):
    timestamp: datetime
    value: float

    observed_property_id: int
    submitting_user_id: int
    unit_id: int
    well_id: int

    submitting_user: User | None = None


class WellMeasurementDTO(ORMBase):
    class UserDTO(ORMBase):
        full_name: str

    id: int
    timestamp: datetime
    value: float
    submitting_user: UserDTO


class WaterLevel(ORMBase):
    id: int
    timestamp: datetime
    value: float
    well_id: int
    submitting_user_name: str


class NewWaterLevelMeasurement(ORMBase):
    well_id: int
    timestamp: datetime
    value: float
    submitting_user_id: int

# Well and units should stay the same, so are not included in the patch
class PatchWaterLevel(BaseModel):
    levelmeasurement_id: int
    submitting_user_id: int
    timestamp: datetime
    value: float | None = None

