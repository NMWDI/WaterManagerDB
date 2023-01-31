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
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from api import schemas
from api.models import Meters, MeterTypes, MeterStatusLU, Well, MeterHistory, Contacts
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
    return _add(db, Meters, obj)


@meter_router.get("/meters", response_model=List[schemas.Meter], tags=["meters"])
async def read_meters(
    fuzzy_search: str = None,
    db: Session = Depends(get_db),
    ):

    stmt = (
        select(
            Meters.serial_number,
            MeterTypes.brand,
            MeterTypes.model,
            MeterTypes.size,
            MeterStatusLU.status_name.label('status'),
            Contacts.organization,
            Meters.ra_number,
            Meters.tag,
            Meters.latitude,
            Meters.longitude,
            Meters.trss,
            Meters.notes
        )
        .join(MeterTypes)
        .join(MeterStatusLU)
        .join(Contacts)
    )

    if fuzzy_search:
        print('searching')
        stmt = stmt.where(
            or_(
                Meters.serial_number.like(f"%{fuzzy_search}%"),
                Meters.ra_number.like(f"%{fuzzy_search}%"),
                MeterTypes.brand.like(f"%{fuzzy_search}%"),
                Contacts.organization.like(f"%{fuzzy_search}%")
            )
        )

    print(stmt)
    results = db.execute(stmt)

    return results.all()


@meter_router.patch(
    "/meters/{meter_id}",
    dependencies=[Depends(write_user)],
    response_model=schemas.Meter,
    tags=["meters"],
)
async def patch_meters(
    meter_id: int, obj: schemas.MeterPatch, db: Session = Depends(get_db)
):
    return _patch(db, Meters, meter_id, obj)


@meter_router.get(
    "/meter_history/{meter_id}", response_model=List[schemas.MeterHistory]
)
async def read_meter_history(meter_id, db: Session = Depends(get_db)):
    return db.query(MeterHistory).filter_by(meter_id=meter_id).all()


# ============= EOF =============================================
