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
    class Config:
        orm_mode = True


class Meter(ORMBase):
    id: int
    name: str
    serialnumber: Optional[str] = None


class Owner(ORMBase):
    id: int
    name: str


class Well(ORMBase):
    id: int
    name: str
    location: str
    osepod: Optional[str] = None

    owner: Optional[Owner] = None
    meter: Optional[Meter] = None


class Reading(ORMBase):
    id: int
    timestamp: datetime
    value: float
    eread: str
    repair: str
# ============= EOF =============================================
