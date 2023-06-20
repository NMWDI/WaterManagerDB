# ===============================================================================
# FastAPI input and response schemas
# Meter related schemas
# ===============================================================================

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel
from api.schemas.part_schemas import Part


class Meter(BaseModel):
    meter_id: int
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
