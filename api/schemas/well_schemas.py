'''
FastAPI input and response schemas
Well related
'''

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, validator, constr


class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True

class Well(ORMBase):
    name: Optional[str] = None
    location: Optional[str] = None
    osepod: Optional[str] = None
    owner_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    # owner: Optional[Owner] = None
    # meter: Optional[Meter] = None

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
    technician: str


class WaterLevelCreate(WaterLevel):
    pass


class WaterLevelPatch(ORMBase):
    timestamp: Optional[datetime] = None
    value: Optional[float]
    well_id: Optional[int]











