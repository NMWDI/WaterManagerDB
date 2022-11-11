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
from fastapi import HTTPException


def _patch(db, table, dbid, obj):
    db_item = _get(db, table, dbid)
    for k, v in obj.dict(exclude_unset=True).items():
        try:
            setattr(db_item, k, v)
        except AttributeError as e:
            print(e)
            continue

    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def _add(db, table, obj):
    db_item = table(**obj.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def _delete(db, table, dbid):
    db_item = _get(db, table, dbid)
    db.delete(db_item)
    db.commit()
    return {"ok": True}


def _get(db, table, dbid):
    db_item = db.get(table, dbid)
    if not db_item:
        raise HTTPException(status_code=404, detail=f"{table}.{dbid} not found")

    return db_item


# ============= EOF =============================================
