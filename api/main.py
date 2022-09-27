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
from datetime import datetime

from fastapi import FastAPI, Depends

from typing import List

from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from api import schemas
from api.models import Base, Meter, Well, Owner, Reading
from api.session import engine, SessionLocal

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    # if not db.query(Owner).filter_by(name='foo').first():

    db.add(Meter(name='moo'))
    db.add(Meter(name='tor'))
    db.add(Meter(name='hag'))
    db.add(Owner(name='foo'))
    db.add(Owner(name='john'))
    db.commit()
    # if not db.query(Well).filter_by(name='bar').first():
    db.add(Well(name='bar', owner_id=1, location='123.123.123', meter_id=1, osepod='RA-1234-123'))
    db.add(Well(name='bag', owner_id=2, location='323.123.123', meter_id=2, osepod='RA-1234-123'))
    db.add(Well(name='bat', owner_id=1, location='5123.123.123', meter_id=3, osepod='RA-1234-123'))

    db.add(Reading(value=103.31, eread='adsf',
                   timestamp=datetime.now(),
                   repair='asdfsadfsa'.encode('utf8')))
    db.commit()
    db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get('/meters', response_model=List[schemas.Meter])
def read_meters(db: Session = Depends(get_db)):
    return db.query(Meter).all()


@app.get('/wells', response_model=List[schemas.Well])
def read_wells(db: Session = Depends(get_db)):
    return db.query(Well).all()


@app.get('/owners', response_model=List[schemas.Owner])
def read_owners(db: Session = Depends(get_db)):
    return db.query(Owner).all()

@app.get('/readings', response_model=List[schemas.Reading])
def read_readings(db: Session = Depends(get_db)):
    return db.query(Reading).all()


@app.get('/')
async def index():
    return {"message": "Hello World WaterManagerDBffff"}



setup_db()
# ============= EOF =============================================
