"""
FastAPI input and response schemas
Well related
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, validator, constr


class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class Well(ORMBase):
    name: Optional[str]
    location_id: Optional[str]
    ra_number: Optional[str]
    osepod: Optional[str]


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
    name: str
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
    land_owner_id: int

    land_owner: Optional[LandOwner]


class LocationTypeLU(ORMBase):
    type_name: Optional[str]
    description: Optional[str]


class WellMeasurement(ORMBase):
    id: int


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


class WaterLevelCreate(ORMBase):
    well_id: int
    timestamp: datetime
    value: float
    observed_property_id: int
    submitting_user_id: int
    unit_id: int


class WaterLevelPatch(ORMBase):
    timestamp: Optional[datetime] = None
    value: Optional[float]
    well_id: Optional[int]
