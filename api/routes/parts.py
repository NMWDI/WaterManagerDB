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
from api.models import Meter, Part, Well, MeterHistory, PartClass
from api.route_util import _add, _patch, _delete
from api.security import scoped_user
from api.session import get_db

part_router = APIRouter()

write_user = scoped_user(["read", "parts:write"])


@part_router.post(
    "/parts",
    dependencies=[Depends(write_user)],
    response_model=schemas.Part,
    tags=["parts"],
)
async def add_part(part: schemas.PartCreate, db: Session = Depends(get_db)):
    db_item = Part(**part.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@part_router.delete(
    "/parts/{part_id}", dependencies=[Depends(write_user)], tags=["parts"]
)
async def delete_part(part_id: int, db: Session = Depends(get_db)):
    return _delete(db, Part, part_id)


@part_router.patch(
    "/parts/{part_id}",
    dependencies=[Depends(write_user)],
    response_model=schemas.Part,
    tags=["parts"],
)
async def patch_parts(
        part_id: int, obj: schemas.Part, db: Session = Depends(get_db)
):
    return _patch(db, Part, part_id, obj)


@part_router.get("/parts", response_model=List[schemas.Part], tags=["parts"])
async def read_parts(
        # location: str = None,
        # well_id: int = None,
        # meter_id: int = None,
        db: Session = Depends(get_db),
):
    q = db.query(Part)
    return q.all()


# ============================================================
# @part_router.post(
#     "/part_classes",
#     dependencies=[Depends(write_user)],
#     response_model=schemas.PartClass,
#     tags=["parts"],
# )
# async def add_part_class(part_class: schemas.PartClassCreate, db: Session = Depends(get_db)):
#     db_item = PartClass(**part_class.dict())
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)
#     return db_item
#
#
# @part_router.delete(
#     "/part_classes/{part_class_id}", dependencies=[Depends(write_user)], tags=["parts"]
# )
# async def delete_part_class(part_class_id: int, db: Session = Depends(get_db)):
#     return _delete(db, PartClass, part_class_id)
#
#
# @part_router.patch(
#     "/part_classes/{part_class_id}",
#     dependencies=[Depends(write_user)],
#     response_model=schemas.PartClass,
#     tags=["parts"],
# )
# async def patch_part_classes(
#         part_class_id: int, obj: schemas.PartClass, db: Session = Depends(get_db)
# ):
#     return _patch(db, PartClass, part_class_id, obj)
#
#
# @part_router.get("/part_classes", response_model=List[schemas.PartClass], tags=["parts"])
# async def read_part_classes(
#         # location: str = None,
#         # well_id: int = None,
#         # meter_id: int = None,
#         db: Session = Depends(get_db),
# ):
#     q = db.query(PartClass)
#     return q.all()

    # q = part_query(db, location, well_id, meter_id)
    # return q.all()

#
# def parse_location(location_str):
#     return location_str.split(".")
#
#
# def part_query(db, location, well_id, meter_id):
#     q = db.query(Part)
#     q = q.join(Well)
#
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
#     return q


# ============= EOF =============================================
