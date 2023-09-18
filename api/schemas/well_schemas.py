"""
FastAPI input and response schemas
Well related
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, validator, constr
from api.schemas.security_schemas import User


class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True


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
    code: str
    description: str

class Well(ORMBase):
    name: Optional[str]
    location_id: Optional[int]
    use_type_id: Optional[int]
    ra_number: Optional[str]
    osepod: Optional[str]

    location: Optional[Location]
    use_type: Optional[WellUseLU]


class WellListDTO(ORMBase):
    name: Optional[str]


class LocationTypeLU(ORMBase):
    type_name: Optional[str]
    description: Optional[str]


class WellMeasurement(ORMBase):
    id: int
    timestamp: datetime
    value: float
    observed_property_id: int
    submitting_user_id: int
    unit_id: int
    well_id: int

    submitting_user: Optional[User]


class WellMeasurementDTO(ORMBase):
    class UserDTO(ORMBase):
        full_name: str

    id: int
    timestamp: datetime
    value: float
    submitting_user: UserDTO


class WellCreate(ORMBase):
    owner_id: int
    # location: str
    # osepod: Optional[str] = None


class ScreenInterval(ORMBase):
    top: float
    bottom: float


class WellConstruction(ORMBase):
    casing_diameter: float
    hole_depth: float
    well_depth: float
    screens: Optional[List[ScreenInterval]]


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
