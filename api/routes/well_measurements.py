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
from api.models import Meter, WellMeasurement, ObservedProperty
from api.route_util import _add, _patch
from api.session import get_db

well_measurement_router = APIRouter()


@well_measurement_router.patch(
    "/waterlevel/{waterlevel_id}",
    response_model=schemas.WaterLevel,
    tags=["waterlevels"],
)
async def patch_waterlevel(
    waterlevel_id: int, obj: schemas.WaterLevelPatch, db: Session = Depends(get_db)
):
    return _patch(db, WellMeasurement, waterlevel_id, obj)


@well_measurement_router.post(
    "/waterlevel", response_model=schemas.WaterLevel, tags=["waterlevels"]
)
async def add_waterlevel(
    waterlevel: schemas.WaterLevelCreate, db: Session = Depends(get_db)
):
    return _add(db, WellMeasurement, waterlevel)


@well_measurement_router.get(
    "/waterlevels", response_model=List[schemas.WaterLevel], tags=["waterlevels"]
)
async def read_waterlevels(well_id: int = None, db: Session = Depends(get_db)):
    return _read_well_measurement(db, "groundwaterlevel", well_id)


@well_measurement_router.get(
    "/chlorides", response_model=List[schemas.WaterLevel], tags=["chlorides"]
)
async def read_chlorides(well_id: int = None, db: Session = Depends(get_db)):
    return _read_well_measurement(db, "chloride", well_id)


def _read_well_measurement(db, obsprop, well_id):
    q = db.query(WellMeasurement)
    q = q.join(ObservedProperty)
    if well_id is not None:
        q = q.filter(WellMeasurement.well_id == well_id)
    q = q.filter(ObservedProperty.name == obsprop)
    return q.all()


# ============= EOF =============================================
