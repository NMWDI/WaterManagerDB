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
from datetime import date, datetime
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette.responses import FileResponse

from api import schemas
from api.models import Repair, Meter, Well, MeterHistory, Owner, MeterStatusLU
from api.security import scoped_user
from api.session import get_db
from api.xls_persistence import make_xls_backup

report_user = scoped_user(["read", "reports:run"])
report_router = APIRouter(dependencies=[Depends(report_user)])


@report_router.get("/repair_report",
                   response_model=List[schemas.RepairReport], tags=['reports'])
def read_repair_report(
    after_date: date = None,
    after: datetime = None,
    db: Session = Depends(get_db),
):
    q = db.query(Repair)
    if after_date:
        q = q.filter(Repair.timestamp > datetime.fromordinal(after_date.toordinal()))
    elif after:
        q = q.filter(Repair.timestamp > after)

    return q.all()


@report_router.get("/xls_backup", tags=['reports'])
async def get_xls_backup(db: Session = Depends(get_db)):
    path = make_xls_backup(db, (Meter, Well, Owner,
                                MeterHistory, MeterStatusLU,

                                ))
    return FileResponse(path=path, media_type='application/octet-stream', filename='backup.xlsx')

# ============= EOF =============================================
