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

from fastapi import FastAPI, Depends

from typing import List

from sqlalchemy.orm import Session

from api import schemas
from api.db import Base, Meter
from api.session import engine, SessionLocal

app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get('/meters', response_model=List[schemas.Meter])
def read_meters(db: Session = Depends(get_db)):
    return db.query(Meter).all()


@app.get('/')
async def index():
    return {"message": "Hello World WaterManagerDBffff"}
# ============= EOF =============================================
