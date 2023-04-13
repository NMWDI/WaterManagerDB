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
from http.client import HTTPException
from typing import List

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from api.schemas import meter_schemas
from api.models import Meters, Repair, Well, QC
from api.route_util import _add, _patch, _delete
from api.security import scoped_user
from api.session import get_db

repair_router = APIRouter()

write_user = scoped_user(["read", "repairs:write"])


@repair_router.post(
    "/repairs",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.RepairCreate,
    tags=["repairs"],
)
async def add_repair(repair: meter_schemas.RepairCreate, db: Session = Depends(get_db)):
    # save empty qc reference
    qc = QC()
    db.add(qc)

    db_item = Repair(**repair.dict())
    db_item.qc = qc
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@repair_router.delete(
    "/repairs/{repair_id}", dependencies=[Depends(write_user)], tags=["repairs"]
)
async def delete_repair(repair_id: int, db: Session = Depends(get_db)):
    return _delete(db, Repair, repair_id)


@repair_router.patch(
    "/repairs/{repair_id}",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.Repair,
    tags=["repairs"],
)
async def patch_repairs(
    repair_id: int, obj: meter_schemas.Repair, db: Session = Depends(get_db)
):
    return _patch(db, Repair, repair_id, obj)


@repair_router.get("/repairs", response_model=List[meter_schemas.Repair], tags=["repairs"])
async def read_repairs(
    location: str = None,
    well_id: int = None,
    meter_id: int = None,
    db: Session = Depends(get_db),
):
    try:
        user = write_user()
        public_release = True
    except HTTPException:
        public_release = False

    q = repair_query(db, location, well_id, meter_id, public_release)

    return q.all()


def parse_location(location_str):
    return location_str.split(".")


# def repair_query(db, location, well_id, meter_id, public_release):
#     q = db.query(Repair)
#     q = q.join(Well)

#     if meter_id is not None:
#         q = q.join(MeterHistory)
#         q = q.filter(MeterHistory.meter_id == meter_id)
#     elif well_id is not None:
#         q = q.filter(Well.id == well_id)
#     elif location is not None:
#         t, r, s, qu, hq = parse_location(location)
#         q = (
#             q.filter(Well.township == t)
#             .filter(Well.range == r)
#             .filter(Well.section == s)
#             .filter(Well.quarter == qu)
#             .filter(Well.half_quarter == hq)
#         )
#     q = q.filter(Repair.public_release == public_release)
#     return q


# ============= EOF =============================================
