from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

from api.schemas.security_schemas import User
from api.schemas.base import ORMBase


class ORMBaseSimple(BaseModel):
    class Config:
        from_attributes = True


class LandOwner(ORMBase):
    contact_name: Optional[str]
    organization: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    city: Optional[str]


class Location(ORMBase):
    name: Optional[str]
    type_id: int
    trss: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    township: Optional[int]
    range: Optional[int]
    section: Optional[int]
    quarter: Optional[int]
    half_quarter: Optional[int]
    quarter_quarter: Optional[int]
    land_owner_id: Optional[int]

    land_owner: Optional[LandOwner]


class WellUseLU(ORMBase):
    use_type: str
    code: Optional[str]
    description: Optional[str]


class Well(ORMBase):
    name: Optional[str]
    ra_number: Optional[str]
    owners: Optional[str]
    osetag: Optional[str]

    location_id: Optional[int]
    use_type_id: Optional[int]

    location: Optional[Location]
    use_type: Optional[WellUseLU]


class SubmitWellCreate(ORMBaseSimple):
    class SubmitLocationCreate(ORMBaseSimple):
        name: str
        trss: str
        longitude: float
        latitude: float

    class SubmitUseTypeCreate(ORMBaseSimple):
        id: int

    name: Optional[str]
    ra_number: Optional[str]
    owners: Optional[str]
    osetag: Optional[str]

    location: SubmitLocationCreate
    use_type: SubmitUseTypeCreate


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
    ra_number: Optional[str]
    owners: Optional[str]
    osetag: Optional[str]

    location: SubmitLocationUpdate
    use_type: SubmitUseTypeUpdate


class WellListDTO(ORMBase):
    name: Optional[str]


class LocationTypeLU(ORMBase):
    type_name: Optional[str]
    description: Optional[str]


class WellMeasurement(ORMBase):
    timestamp: datetime
    value: float

    observed_property_id: int
    submitting_user_id: int
    unit_id: int
    well_id: int

    observed_property: Optional[
        Any
    ]  # ObservedProeprtyTypeLU, but cant import bc of circular imports
    submitting_user: Optional[User]


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


class WaterLevelPatch(ORMBase):
    timestamp: Optional[datetime] = None
    value: Optional[float]
    well_id: Optional[int]
