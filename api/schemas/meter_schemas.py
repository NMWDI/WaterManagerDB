# ===============================================================================
# FastAPI input and response schemas
# Meter related schemas
# ===============================================================================

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel
from api.schemas.part_schemas import Part

class MeterMapDTO(BaseModel):
    id: Optional[int]
    longitude: Optional[float]
    latitude: Optional[float]

class MeterListDTO(BaseModel):
    id: int
    serial_number: Optional[str]
    trss: Optional[str]
    organization_name: Optional[str]
    ra_number: Optional[str]

class MeterDTO(BaseModel):
    id: int
    serial_number: Optional[str]
    brand: Optional[str]
    size: Optional[float]
    contact_name: Optional[str]
    contact_phone: Optional[str]
    organization_name: Optional[str]
    ra_number: Optional[str]
    tag: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    trss: Optional[str]
    well_distance_ft: Optional[float]
    notes: Optional[str]

class Meter(BaseModel):
    id: int
    serial_number: str
    brand: str
    model_number: str
    status: str = None
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
    parts_associated: List[Part] = None
