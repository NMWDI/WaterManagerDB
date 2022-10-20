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
import os
from datetime import datetime, timedelta, date

import requests
from fastapi import FastAPI, Depends, HTTPException

from typing import List

from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from api import schemas
from api.models import (
    Base,
    Meter,
    Well,
    Owner,
    Reading,
    Worker,
    Repair,
    MeterStatusLU,
    MeterHistory,
    Alert,
)
from api.session import engine, SessionLocal

tags_metadata = [
    {"name": "wells", "description": "Water Wells"},
    {"name": "repairs", "description": "Meter Repairs"},
    {"name": "meters", "description": "Water use meters"},
]
description = """
The PVACD Meter API gives programatic access to the PVACDs meter database

"""
title = "PVACD Meter API"

app = FastAPI(
    title=title,
    description=description,
    openapi_tags=tags_metadata,
    version="0.2.0",
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "https://localhost",
    "https://localhost:3000",
    "https://localhost:8000",
    "https://pvacd.newmexicowaterdata.org",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def setup_db(eng, db=None, populate_db=False):

    if not os.environ.get("POPULATE_DB"):
        Base.metadata.create_all(bind=eng)
        return
    else:
        Base.metadata.drop_all(bind=eng)
        Base.metadata.create_all(bind=eng)

    if db is None:
        db = SessionLocal()

    # build meter status lookup
    db.add(MeterStatusLU(name="POK", description="Pump OK"))
    db.add(MeterStatusLU(name="NP", description="Not Pumping"))
    db.add(MeterStatusLU(name="PIRO", description="Pump ON, Register Off"))
    db.commit()

    # add meters
    db.add(Meter(name="moo", serial_year=1992, serial_id=1234, serial_case_diameter=4))
    db.add(Meter(name="tor", serial_year=1992, serial_id=2235, serial_case_diameter=4))
    db.add(Meter(name="hag", serial_year=1992, serial_id=3236, serial_case_diameter=4))

    # add alert
    db.add(Alert(meter_id=1, alert="foo bar alert"))
    # add owners
    db.add(Owner(name="Guy & Jackson"))
    db.add(Owner(name="Spencer"))

    # add workers
    for name in ("Default", "Buster", "Alice"):
        db.add(Worker(name=name))

    db.commit()

    # add wells
    db.add(
        Well(
            name="bar",
            owner_id=1,
            township=100,
            range=10,
            section=4,
            quarter=4,
            half_quarter=3,
            osepod="RA-1234-123",
            # latitude=34,
            # longitude=-106,
            geom="POINT (-106 34)",
        )
    )
    db.add(
        Well(
            name="bag",
            owner_id=2,
            township=100,
            range=10,
            section=4,
            quarter=2,
            half_quarter=1,
            osepod="RA-1234-123",
            # latitude=35.5,
            # longitude=-105.1,
            geom="POINT (-105.1 35.5)",
        )
    )
    db.add(
        Well(
            name="bat",
            owner_id=1,
            township=100,
            range=10,
            section=4,
            quarter=3,
            half_quarter=2,
            osepod="RA-1234-123",
            # latitude=36,
            # longitude=-105.5,
            geom="POINT (-105.5 36)",
        )
    )
    db.commit()

    # add meter history
    db.add(MeterHistory(well_id=1, meter_id=1))
    db.add(MeterHistory(well_id=2, meter_id=2))
    db.add(MeterHistory(well_id=3, meter_id=3))

    db.add(
        Repair(
            worker_id=1,
            well_id=1,
            h2o_read=638.831,
            e_read="E 2412341",
            meter_status_id=1,
            preventative_maintenance="",
            repair_description="""Gasket for saddle
grease bearing
PREV MAINT
Working on Arrivial""".encode(
                "utf8"
            ),
            note="""DIST 107" DISCHG 100%""".encode("utf8"),
            timestamp=datetime.now(),
        )
    )

    db.add(
        Repair(
            worker_id=1,
            timestamp=datetime.now() - timedelta(days=365),
            well_id=1,
            h2o_read=638000.831,
            e_read="E 241da2341",
            meter_status_id=1,
            preventative_maintenance="",
            repair_description="""a
    Working on Arrivial""".encode(
                "utf8"
            ),
            note="""DIST 107" DISCHG 100%""".encode("utf8"),
        )
    )
    db.add(
        Repair(
            worker_id=1,
            timestamp=datetime.now() - timedelta(days=2 * 365),
            well_id=2,
            h2o_read=300.831,
            e_read="E 241da2341",
            meter_status_id=1,
            preventative_maintenance="",
            repair_description="""
        Working on Arrivial""".encode(
                "utf8"
            ),
            note="""DIST 107" DISCHG 100%""".encode("utf8"),
        )
    )
    db.add(
        Repair(
            worker_id=3,
            timestamp=datetime.now() - timedelta(days=2 * 360),
            well_id=3,
            h2o_read=8002.22,
            e_read="E 341",
            meter_status_id=1,
            preventative_maintenance="",
            repair_description="""
            Working on Arrivial""".encode(
                "utf8"
            ),
            note="""DIST 107" DISCHG 100%""".encode("utf8"),
        )
    )

    db.commit()
    db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post('/token')
def post_oauth_token():
    requests.post()

@app.get("/repair_report", response_model=List[schemas.RepairReport])
def read_repair_report(
    after_date: date = None, after: datetime = None, db: Session = Depends(get_db)
):
    q = db.query(Repair)
    if after_date:
        q = q.filter(Repair.timestamp > datetime.fromordinal(after_date.toordinal()))
    elif after:
        q = q.filter(Repair.timestamp > after)

    return q.all()


@app.get("/api_status", response_model=schemas.Status)
def api_status(db: Session = Depends(get_db)):
    try:
        db.query(Well).first()
        return {"ok": True}
    except BaseException:
        return {"ok": False}


@app.get("/meter_history/{meter_id}", response_model=List[schemas.MeterHistory])
async def read_meter_history(meter_id, db: Session = Depends(get_db)):
    return db.query(MeterHistory).filter_by(meter_id=meter_id).all()


@app.get(
    "/meter_status_lu",
    description="Return list of MeterStatus codes and definitions",
    response_model=List[schemas.MeterStatusLU],
)
def read_meter_status_lookup_table(db: Session = Depends(get_db)):
    return db.query(MeterStatusLU).all()


@app.get("/owners", response_model=List[schemas.Owner])
def read_owners(db: Session = Depends(get_db)):
    return db.query(Owner).all()


@app.get("/readings", response_model=List[schemas.Reading])
async def read_readings(db: Session = Depends(get_db)):
    return db.query(Reading).all()


@app.get("/wellreadings/{wellid}", response_model=List[schemas.Reading])
async def read_wellreadings(wellid, db: Session = Depends(get_db)):
    return db.query(Reading).filter_by(well_id=wellid).all()


# ====== Alerts
@app.get("/alerts", response_model=List[schemas.Alert], tags=["alerts"])
async def read_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).all()


@app.get("/alerts/{alert_id}", response_model=schemas.Alert, tags=["alerts"])
async def read_alerts(alert_id: int, db: Session = Depends(get_db)):
    return db.query(Alert).filter(Alert.id == alert_id).first()


@app.post("/alerts", response_model=schemas.Alert, tags=["alerts"])
async def add_alerts(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    return _add(db, Alert, alert)


@app.patch("/alerts/{alert_id}", response_model=schemas.Alert, tags=["alerts"])
async def patch_alerts(
    alert_id: int, obj: schemas.AlertPatch, db: Session = Depends(get_db)
):
    return _patch(db, Alert, alert_id, obj)


# ====== Wells
@app.get("/wells", response_model=List[schemas.Well], tags=["wells"])
def read_wells(radius: float = None, latlng: str = None, db: Session = Depends(get_db)):
    """
    radius in kilometers

    :param radius:
    :param latlng:
    :param db:
    :return:
    """
    q = db.query(Well)
    if radius and latlng:
        latlng = latlng.split(",")
        radius = radius / 111.139
        q = q.filter(
            func.ST_DWithin(Well.geom, f"POINT ({latlng[1]} {latlng[0]})", radius)
        )

    return q.all()


@app.patch("/wells/{well_id}", response_model=schemas.Well, tags=["wells"])
async def patch_wells(well_id: int, obj: schemas.Well, db: Session = Depends(get_db)):
    return _patch(db, Well, well_id, obj)


# ======  Meters
@app.get("/meters", response_model=List[schemas.Meter], tags=["meters"])
async def read_meters(db: Session = Depends(get_db)):
    return db.query(Meter).all()


@app.patch("/meters/{meter_id}", response_model=schemas.Meter, tags=["meters"])
async def patch_meters(
    meter_id: int, obj: schemas.MeterPatch, db: Session = Depends(get_db)
):
    return _patch(db, Meter, meter_id, obj)


@app.get("/nmeters", response_model=int, tags=["meters"])
async def read_nmeters(
    db: Session = Depends(get_db),
):
    q = db.query(Meter)
    return q.count()


@app.post("/meters", response_model=schemas.Meter, tags=["meters"])
async def add_meter(obj: schemas.MeterCreate, db: Session = Depends(get_db)):
    return _add(db, Meter, obj)


def parse_location(location_str):
    return location_str.split(".")


def repair_query(db, location, well_id, meter_id):
    q = db.query(Repair)
    q = q.join(Well)

    if meter_id is not None:
        q = q.join(MeterHistory)
        q = q.filter(MeterHistory.meter_id == meter_id)
    elif well_id is not None:
        q = q.filter(Well.id == well_id)
    elif location is not None:
        t, r, s, qu, hq = parse_location(location)
        q = (
            q.filter(Well.township == t)
            .filter(Well.range == r)
            .filter(Well.section == s)
            .filter(Well.quarter == qu)
            .filter(Well.half_quarter == hq)
        )
    return q


# ======  Repairs
@app.get("/repairs", response_model=List[schemas.Repair], tags=["repairs"])
async def read_repairs(
    location: str = None,
    well_id: int = None,
    meter_id: int = None,
    db: Session = Depends(get_db),
):
    q = repair_query(db, location, well_id, meter_id)

    return q.all()


@app.get("/nrepairs", response_model=int, tags=["repairs"])
async def read_nrepairs(
    location: str = None,
    well_id: int = None,
    meter_id: int = None,
    db: Session = Depends(get_db),
):
    q = repair_query(db, location, well_id, meter_id)
    return q.count()


@app.patch("/repairs/{repair_id}", response_model=schemas.Repair, tags=["repairs"])
async def patch_repairs(
    repair_id: int, obj: schemas.Repair, db: Session = Depends(get_db)
):
    return _patch(db, Repair, repair_id, obj)


@app.post("/repairs", response_model=schemas.RepairCreate, tags=["repairs"])
async def add_repair(repair: schemas.RepairCreate, db: Session = Depends(get_db)):
    print(repair.dict())

    db_item = Repair(**repair.dict())
    db_item.worker_id = 1
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.delete("/repairs/{repair_id}", tags=["repairs"])
async def delete_repair(repair_id: int, db: Session = Depends(get_db)):
    return _delete(db, Repair, repair_id)


# ======== Worker
@app.get("/workers", response_model=List[schemas.Worker], tags=["workers"])
def read_workers(db: Session = Depends(get_db)):
    return db.query(Worker).all()


@app.post("/workers", response_model=schemas.Worker, tags=["workers"])
async def add_worker(
    worker: schemas.WorkerCreate,
    db: Session = Depends(get_db),
):
    return _add(db, Worker, worker)


@app.patch("/workers/{worker_id}", response_model=schemas.Worker, tags=["workers"])
async def patch_worker(
    worker_id: int, worker: schemas.Worker, db: Session = Depends(get_db)
):
    return _patch(db, Worker, worker_id, worker)


@app.delete("/workers/{worker_id}", tags=["workers"])
async def delete_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.get(Worker, worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    db.delete(worker)
    db.commit()
    return {"ok": True}


@app.get("/")
async def index():
    return {"message": "Hello World WaterManagerDBffff"}


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


if os.environ.get("SETUP_DB"):
    setup_db(engine)
# ============= EOF =============================================
