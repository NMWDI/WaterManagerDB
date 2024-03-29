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

from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session

from api.schemas import meter_schemas
from api.models import Meters, Worker
from api.route_util import _add, _patch
from api.security import scoped_user
from api.session import get_db

worker_router = APIRouter()

write_user = scoped_user(["read", "workers:write"])


@worker_router.get(
    "/workers", response_model=List[meter_schemas.Worker], tags=["workers"]
)
def read_workers(db: Session = Depends(get_db)):
    return db.query(Worker).all()


@worker_router.post(
    "/workers",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.Worker,
    tags=["workers"],
)
async def add_worker(
    worker: meter_schemas.WorkerCreate,
    db: Session = Depends(get_db),
):
    return _add(db, Worker, worker)


@worker_router.patch(
    "/workers/{worker_id}",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.Worker,
    tags=["workers"],
)
async def patch_worker(
    worker_id: int, worker: meter_schemas.Worker, db: Session = Depends(get_db)
):
    return _patch(db, Worker, worker_id, worker)


@worker_router.delete(
    "/workers/{worker_id}", dependencies=[Depends(write_user)], tags=["workers"]
)
async def delete_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.get(Worker, worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    db.delete(worker)
    db.commit()
    return {"ok": True}


# ============= EOF =============================================
