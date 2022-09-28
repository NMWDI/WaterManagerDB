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

from fastapi import FastAPI, Depends, HTTPException

from typing import List

from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from api import schemas
from api.models import Base, Meter, Well, Owner, Reading, Worker, Repair
from api.session import engine, SessionLocal

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://34.106.112.233:8000",
    "http://34.106.112.233:3000"
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
    db.add(Worker(name='Buster'))
    db.commit()
    # if not db.query(Well).filter_by(name='bar').first():
    db.add(Well(name='bar', owner_id=1, location='123.123.123', meter_id=1, osepod='RA-1234-123'))
    db.add(Well(name='bag', owner_id=2, location='323.123.123', meter_id=2, osepod='RA-1234-123'))
    db.add(Well(name='bat', owner_id=1, location='5123.123.123', meter_id=3, osepod='RA-1234-123'))

    db.add(Repair(worker_id=1, repair_description='Thasoacsd thasdf eiasdfasd'.encode('utf8'),
                  note='This ia  noasdfte'.encode('utf8')))
    db.add(Reading(value=103.31, eread='adsf',
                   timestamp=datetime.now(),
                   well_id=1,
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


@app.get('/wellreadings/{wellid}', response_model=List[schemas.Reading])
def read_wellreadings(wellid, db: Session = Depends(get_db)):
    return db.query(Reading).filter_by(well_id=wellid).all()


# ======  Repairs
@app.get('/repairs', response_model=List[schemas.Repair])
def read_repairs(db: Session = Depends(get_db)):
    return db.query(Repair).all()


@app.patch('/repairs/{repair_id}', response_model=schemas.Repair)
async def patch_worker(repair_id: int, obj: schemas.Repair, db: Session = Depends(get_db)):
    return _patch(db, Repair, repair_id, obj)


@app.post('/repairs', response_model=schemas.Repair)
async def add_repair(repair: schemas.RepairCreate, db: Session = Depends(get_db), ):
    db_item = Repair(**repair.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


# ======== Worker
@app.get('/workers', response_model=List[schemas.Worker])
def read_workers(db: Session = Depends(get_db)):
    return db.query(Worker).all()


@app.post('/workers', response_model=schemas.Worker)
async def add_worker(worker: schemas.WorkerCreate, db: Session = Depends(get_db), ):
    return _add(db, Worker, worker)


@app.patch('/workers/{worker_id}', response_model=schemas.Worker)
async def patch_worker(worker_id: int, worker: schemas.Worker, db: Session = Depends(get_db)):
    return _patch(db, Worker, worker_id, worker)


@app.delete('/workers/{worker_id}')
async def delete_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.get(Worker, worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    db.delete(worker)
    db.commit()
    return {"ok": True}


@app.get('/')
async def index():
    return {"message": "Hello World WaterManagerDBffff"}


def _patch(db, table, id, obj):
    db_item = db.get(table, id)
    for k, v in obj.dict(exclude_unset=True).items():
        setattr(db_item, k, v)
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


setup_db()
# ============= EOF =============================================
