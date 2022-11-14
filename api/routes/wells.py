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

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from api import schemas
from api.models import Well
from api.route_util import _patch, _add
from api.security import scoped_user
from api.session import get_db

well_router = APIRouter()

write_user = scoped_user(["read", "wells:write"])


@well_router.get("/wells", response_model=List[schemas.Well], tags=["wells"])
def read_wells(
        radius: float = None,
        latlng: str = None,
        osepod: str = None,
        township: int = None,
        range_: int = None,
        section: int = None,
        quarter: int = None,
        half_quarter: int = None,
        db: Session = Depends(get_db),
):
    """
    radius in kilometers

    :return:
    """
    q = db.query(Well)
    if radius and latlng:
        latlng = latlng.split(",")
        radius = radius / 111.139
        q = q.filter(
            func.ST_DWithin(Well.geom, f"POINT ({latlng[1]} {latlng[0]})", radius)
        )

    if osepod:
        q = q.filter(Well.osepod.like(f"%{osepod}%"))
    if township:
        q = q.filter(Well.township == township)
    if range_:
        q = q.filter(Well.range == range_)
    if section:
        q = q.filter(Well.section == section)

    if quarter:
        q = q.filter(Well.quarter == quarter)
    if half_quarter:
        q = q.filter(Well.half_quarter == half_quarter)

    return q.all()


@well_router.patch(
    "/wells/{well_id}",
    dependencies=[Depends(write_user)],
    response_model=schemas.Well,
    tags=["wells"],
)
async def patch_wells(well_id: int, obj: schemas.Well, db: Session = Depends(get_db)):
    return _patch(db, Well, well_id, obj)


@well_router.post(
    "/wells",
    dependencies=[Depends(write_user)],
    response_model=schemas.Well,
    tags=["wells"],
)
async def add_well(obj: schemas.WellCreate, db: Session = Depends(get_db)):
    return _add(db, Well, obj)

# ============= EOF =============================================
