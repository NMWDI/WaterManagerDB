# ===============================================================================
# Output models:
# Used by FastAPI for various things -> https://fastapi.tiangolo.com/tutorial/response-model/
# ===============================================================================
import re
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, validator, constr


class ORMBase(BaseModel):
    id: Optional[int] = None

    class Config:
        orm_mode = True

#------- Low Level Types ------
class Activity(BaseModel):
    '''
    Used in Maintenance schema
    '''
    timestamp_start: datetime
    timestamp_end: datetime
    activity_id: int
    notes: Optional[str]
    technician_id = int

class Observation(BaseModel):
    '''
    Used in Maintenance schema
    '''
    timestamp: datetime
    value: float
    observed_property_id: int
    units_id: int
    notes: Optional[str]
    technician_id: int

class Part(BaseModel):
    '''
    Used in Maintenance
    '''
    part_id: int
    count: int

#------- Derived -------

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
    organization: str = None
    ra_number: str = None
    tag: str = None
    latitude: float = None
    longitude: float = None
    trss: str = None
    notes: str = None

class MeterPatch(ORMBase):
    name: str
    serial_year: int
    serial_id: int
    serial_case_diameter: int

class Maintenance(BaseModel):
    '''
    Data associated with maintenance
    '''
    meter_id: int
    activity: Activity
    observations: Optional[List[Observation]]
    parts: Optional[List[Part]]



#--------------- Old??

PhoneConstr = constr(
    strip_whitespace=True,
    regex="^(\\+)[1-9][0-9\\-\\(\\)\\.]{9,15}$",
)
class Owner(ORMBase):
    name: str
    email: Optional[EmailStr]
    phone: Optional[PhoneConstr]

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


class Worker(ORMBase):
    name: str


class WorkerCreate(Worker):
    pass


class Repair(ORMBase):
    h2o_read: Optional[float] = 0
    e_read: Optional[str] = None
    new_read: Optional[str] = None
    repair_description: Optional[bytes] = None
    worker_id: int
    note: Optional[bytes] = None
    worker: str
    timestamp: Optional[datetime] = None
    well_id: int
    meter_status_id: int
    preventative_maintenance: Optional[str] = None
    meter_serial_number: Optional[str] = None
    public_release: bool


class MeterHistory(ORMBase):
    timestamp: datetime
    activity_id: int
    description: Optional[str]
    energy_reading: Optional[int]
    initial_reading: Optional[float]
    #note: Optional[bytes] = None


class RepairReport(Repair):
    well_name: str
    well_location: str
    meter_status_name: str


class RepairCreate(ORMBase):
    h2o_read: Optional[float] = 0
    e_read: Optional[str] = None
    new_read: Optional[str] = None
    repair_description: Optional[str] = None
    note: Optional[str] = None
    timestamp: Optional[datetime] = None
    meter_status_id: Optional[int] = 1
    preventative_maintenance: str
    well_id: int


class Status(BaseModel):
    ok: bool


class MeterStatusLU(ORMBase):
    name: str
    description: str


class PartTypeLU(ORMBase):
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
