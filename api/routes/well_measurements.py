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
from sqlalchemy import select

from api.schemas import well_schemas
from api.models.main_models import WellMeasurements, ObservedPropertyTypeLU, Technicians
from api.route_util import _add, _patch
from api.security import scoped_user
from api.session import get_db

well_measurement_router = APIRouter()
write_user = scoped_user(["read", "well_measurement:write"])


@well_measurement_router.patch(
    "/waterlevel/{waterlevel_id}",
    response_model=well_schemas.WaterLevel,
    dependencies=[Depends(write_user)],
    tags=["waterlevels"],
)
async def patch_waterlevel(
    waterlevel_id: int, obj: well_schemas.WaterLevelPatch, db: Session = Depends(get_db)
):
    return _patch(db, WellMeasurements, waterlevel_id, obj)


@well_measurement_router.post(
    "/waterlevel",
    dependencies=[Depends(write_user)],
    response_model=well_schemas.WaterLevelCreate,
    tags=["waterlevels"],
)
async def add_waterlevel(
    waterlevel: well_schemas.WaterLevelCreate, db: Session = Depends(get_db)
):
    return _add(db, WellMeasurements, waterlevel)


@well_measurement_router.get(
    # "/waterlevels", response_model=List[schemas.WaterLevel], tags=["waterlevels"]
    "/waterlevels",
    tags=["waterlevels"],
)
async def read_waterlevels(well_id: int = None, db: Session = Depends(get_db)):
    return _read_well_measurement(db, "DTW BGS", well_id)


@well_measurement_router.get(
    "/chlorides", response_model=List[well_schemas.WaterLevel], tags=["chlorides"]
)
async def read_chlorides(well_id: int = None, db: Session = Depends(get_db)):
    return _read_well_measurement(db, "chloride", well_id)


def _read_well_measurement(db, obsprop, well_id):
    stmt = (
        select(
            WellMeasurements.id,
            WellMeasurements.well_id,
            WellMeasurements.timestamp,
            WellMeasurements.value,
            Technicians.name.label("technician"),
        )
        .join(Technicians)
        .join(ObservedPropertyTypeLU)
        .where(ObservedPropertyTypeLU.name == obsprop)
        .where(WellMeasurements.well_id == well_id)
    )
    # print(stmt)
    results = db.execute(stmt)
    return results.all()


# ============= EOF =============================================
