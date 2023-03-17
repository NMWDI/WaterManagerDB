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
from api.models import Well, WellConstruction, Contacts
from api.route_util import _patch, _add
from api.security import scoped_user
from api.session import get_db

contacts_router = APIRouter()

write_user = scoped_user(["read", "wells:write"])


@contacts_router.get("/contacts", response_model=List[schemas.Owner], tags=["contacts"])
def read_contacts(db: Session = Depends(get_db)):
    return db.query(Contacts).all()


# ============= EOF =============================================
