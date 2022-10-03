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
    id: int

    class Config:
        orm_mode = True


class Meter(ORMBase):
    name: str
    serialnumber: Optional[str] = None


class Owner(ORMBase):
    name: str


class Well(ORMBase):
    name: str
    location: str
    osepod: Optional[str] = None
    meter_id: int
    owner_id: int
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


class RepairCreate(ORMBase):
    h2o_read: Optional[float] = 0
    e_read: Optional[str] = None
    new_read: Optional[str] = None
    repair_description: Optional[str] = None
    note: Optional[str] = None
    timestamp: Optional[datetime] = None


class Status(BaseModel):
    ok: bool
# ============= EOF =============================================
