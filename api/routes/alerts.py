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
from sqlalchemy.orm import Session

from api import schemas
from api.models import Alert
from api.route_util import _add, _patch
from api.session import get_db

alert_router = APIRouter()
@alert_router.get("/alerts", response_model=List[schemas.Alert], tags=["alerts"])
async def read_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).all()


@alert_router.get("/alerts/{alert_id}", response_model=schemas.Alert, tags=["alerts"])
async def read_alerts(alert_id: int, db: Session = Depends(get_db)):
    return db.query(Alert).filter(Alert.id == alert_id).first()


@alert_router.post("/alerts", response_model=schemas.Alert, tags=["alerts"])
async def add_alerts(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    return _add(db, Alert, alert)


@alert_router.patch("/alerts/{alert_id}", response_model=schemas.Alert, tags=["alerts"])
async def patch_alerts(
        alert_id: int, obj: schemas.AlertPatch, db: Session = Depends(get_db)
):
    return _patch(db, Alert, alert_id, obj)





# ============= EOF =============================================
