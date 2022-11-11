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

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from api import schemas
from api.models import Meter, Repair, Well, MeterHistory
from api.route_util import _add, _patch, _delete
from api.session import get_db

repair_router = APIRouter()


@repair_router.post("/repairs", response_model=schemas.RepairCreate, tags=["repairs"])
async def add_repair(repair: schemas.RepairCreate, db: Session = Depends(get_db)):
    print(repair.dict())

    db_item = Repair(**repair.dict())
    db_item.worker_id = 1
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@repair_router.delete("/repairs/{repair_id}", tags=["repairs"])
async def delete_repair(repair_id: int, db: Session = Depends(get_db)):
    return _delete(db, Repair, repair_id)


@repair_router.patch("/repairs/{repair_id}", response_model=schemas.Repair, tags=["repairs"])
async def patch_repairs(
        repair_id: int, obj: schemas.Repair, db: Session = Depends(get_db)
):
    return _patch(db, Repair, repair_id, obj)


@repair_router.get("/repairs", response_model=List[schemas.Repair], tags=["repairs"])
async def read_repairs(
        location: str = None,
        well_id: int = None,
        meter_id: int = None,
        db: Session = Depends(get_db),
):
    q = repair_query(db, location, well_id, meter_id)

    return q.all()


def parse_location(location_str):
    return location_str.split(".")


def repair_query(db, location, well_id, meter_id):
    q = db.query(Repair)
    q = q.join(Well)

    if meter_id is not None:
        q = q.join(MeterHistory)
        q = q.filter(MeterHistory.meter_id == meter_id)
    elif well_id is not None:
        q = q.filter(Well.id == well_id)
    elif location is not None:
        t, r, s, qu, hq = parse_location(location)
        q = (
            q.filter(Well.township == t)
            .filter(Well.range == r)
            .filter(Well.section == s)
            .filter(Well.quarter == qu)
            .filter(Well.half_quarter == hq)
        )
    return q

# ============= EOF =============================================
