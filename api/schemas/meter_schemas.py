# ===============================================================================
# FastAPI input and response schemas
# Meter related schemas
# ===============================================================================

from datetime import datetime
from typing import List, Optional, Union

from pydantic import BaseModel
from api.schemas.part_schemas import Part
from api.schemas.activity_schemas import Activity, Observation, LandOwner

class MeterActivityDTO(BaseModel):
    timestamp_start: datetime
    timestamp_end: datetime
    notes: Optional[str]

class MeterObservationDTO(BaseModel):
    timestamp: datetime
    value: float
    notes: Optional[str]

class MeterHistory(BaseModel):
    activities: Optional[List[MeterActivityDTO]]
    observations: Optional[List[MeterObservationDTO]]

class MeterMapDTO(BaseModel):
    class MeterLocationDTO(BaseModel):
        longitude: Optional[float]
        latitude: Optional[float]

        class Config:
            orm_mode = True

    id: int
    meter_location: Optional[MeterLocationDTO]

    class Config:
        orm_mode = True


class MeterTypeLU(BaseModel):
    id: int
    brand: Optional[str]
    series: Optional[str]
    model_number: str
    size: float
    description: Optional[str]

    class Config:
        orm_mode = True

class MeterListDTO(BaseModel):

    class MeterLocationDTO(BaseModel):
        class LandOwnerDTO(BaseModel):
            land_owner_name: Optional[str]

            class Config:
                orm_mode = True

        land_owner: Optional[LandOwnerDTO]

        class Config:
            orm_mode = True

    id: int
    serial_number: Optional[str]
    trss: Optional[str]
    ra_number: Optional[str]
    meter_location: Optional[MeterLocationDTO]

    class Config:
        orm_mode = True

# NEW ------------------------------------




class MeterLocation(BaseModel):
    name: str
    latitude: float
    longitude: float
    trss: Optional[str]

    land_owner: Optional[LandOwner]

    class Config:
        orm_mode = True

class MeterStatusLU(BaseModel):
    status_name: Optional[str]
    description: Optional[str]

    class Config:
        orm_mode = True

class Meter(BaseModel):
    id: int
    serial_number: str
    contact_name: Optional[str]
    contact_phone: Optional[str]
    old_contact_name: Optional[str]
    old_contact_phone: Optional[str]
    ra_number: Optional[str]
    tag: Optional[str]
    well_distance_ft: Optional[float]
    notes: Optional[str]

    meter_type_id: Optional[int]
    status_id: Optional[int]
    meter_location_id: Optional[int]

    meter_type: Optional[MeterTypeLU]
    status: Optional[MeterStatusLU]
    meter_location: Optional[MeterLocation]

    class Config:
        orm_mode = True

    # Can also have location history
