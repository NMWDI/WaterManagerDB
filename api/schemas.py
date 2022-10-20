# ===============================================================================
# Copyright 2022 ross
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ===============================================================================
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
    name: str
    serial_number: str


class MeterPatch(ORMBase):
    name: str
    serial_year: int
    serial_id: int
    serial_case_diameter: int


class Owner(ORMBase):
    name: str


class Well(ORMBase):
    name: str
    location: str
    osepod: Optional[str] = None
    owner_id: int
    latitude: float
    longitude: float
    # owner: Optional[Owner] = None
    # meter: Optional[Meter] = None


class Reading(ORMBase):
    timestamp: datetime
    value: float
    eread: str
    repair: str
    well_id: int


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


class MeterHistory(ORMBase):
    well_id: int
    timestamp: datetime
    meter_id: int
    note: Optional[bytes] = None


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


# ============= EOF =============================================
