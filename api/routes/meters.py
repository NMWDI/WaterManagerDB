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
from typing import List

from fastapi import Depends, APIRouter, HTTPException, Security
from sqlalchemy import or_
from sqlalchemy.orm import Session

from api import schemas
from api.models import Meter, Owner, Well, MeterHistory
from api.route_util import _add, _patch
from api.security import get_current_user, scoped_user
from api.security_models import User
from api.session import get_db

meter_router = APIRouter()

write_user = scoped_user(["read", "meters:write"])


@meter_router.post(
    "/meters",
    dependencies=[Depends(write_user)],
    response_model=schemas.Meter,
    tags=["meters"],
)
async def add_meter(obj: schemas.MeterCreate, db: Session = Depends(get_db)):
    return _add(db, Meter, obj)


@meter_router.get("/meters", response_model=List[schemas.Meter], tags=["meters"])
async def read_meters(fuzzy_serial: str = None,
                      fuzzy_owner_name: str = None,
                      db: Session = Depends(get_db)):
    q = db.query(Meter)

    if fuzzy_owner_name:
        q = q.join(MeterHistory)
        q = q.join(Well)
        q = q.join(Owner)

    if fuzzy_serial:
        q = q.filter(
            or_(
                Meter.serial_id.like(f"%{fuzzy_serial}%"),
                Meter.serial_year.like(f"%{fuzzy_serial}%"),
                Meter.serial_case_diameter.like(f"%{fuzzy_serial}%"),
            )
        )
    if fuzzy_owner_name:
        q = q.filter(Owner.name.like(f'%{fuzzy_owner_name}%'))

    return q.all()


@meter_router.patch(
    "/meters/{meter_id}",
    dependencies=[Depends(write_user)],
    response_model=schemas.Meter,
    tags=["meters"],
)
async def patch_meters(
    meter_id: int, obj: schemas.MeterPatch, db: Session = Depends(get_db)
):
    return _patch(db, Meter, meter_id, obj)


# ============= EOF =============================================
