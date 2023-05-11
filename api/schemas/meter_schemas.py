# ===============================================================================
# FastAPI input and response schemas
# Meter related schemas
# ===============================================================================
import re
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True

class MeterCreate(ORMBase):
    name: str
    serial_case_diameter: int
    serial_id: int
    serial_year: int

class Meter(ORMBase):
    serial_number: str
    brand: str
    model: str
    size: float
    status: str
    contact_name: str = None
    contact_phone: str = None
    organization: str = None
    ra_number: str = None
    tag: str = None
    latitude: float = None
    longitude: float = None
    trss: str = None
    well_distance_ft: float = None
    notes: str = None

class MeterPatch(ORMBase):
    name: str
    serial_year: int
    serial_id: int
    serial_case_diameter: int

class MeterHistory(ORMBase):
    timestamp: datetime
    activity_id: int
    description: Optional[str]
    energy_reading: Optional[int]
    initial_reading: Optional[float]
    #note: Optional[bytes] = None

class MeterStatusLU(ORMBase):
    name: str
    description: str





class Alert(ORMBase):
    alert: str
    meter_serial_number: str
    open_timestamp: datetime
    closed_timestamp: Optional[datetime] = None
    active: bool


class AlertCreate(ORMBase):
    meter_id: int
    alert: str


class AlertPatch(ORMBase):
    alert: Optional[str] = None
    closed_timestamp: Optional[datetime] = None


class PartType(ORMBase):
    name: str
    description: str

class PartCreate(ORMBase):
    part_number: str
    vendor: str
    note: Optional[str] = None
    part_type_id: int




# ============= EOF =============================================
