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

from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Union

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from starlette import status

from api import schemas, security_schemas
from api.models import (
    Base,
    Meter,
    Well,
    Owner,
    Worker,
    Repair,
    MeterStatusLU,
    MeterHistory,
    Alert,
    WellConstruction,
    ScreenInterval,
    WellMeasurement,
    ObservedProperty,
)
from api.route_util import _patch, _add, _delete
from api.routes.alerts import alert_router
from api.routes.meters import meter_router
from api.routes.repairs import repair_query, repair_router
from api.routes.well_measurements import well_measurement_router
from api.routes.wells import well_router
from api.routes.workers import worker_router
from api.security import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticated_router,
)
from api.security_models import User
from api.session import engine, SessionLocal, get_db

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


# ============== Security ==============


@app.post("/token", response_model=security_schemas.Token, tags=['login'])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "scopes": form_data.scopes},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# =======================================


@authenticated_router.get("/repair_report", response_model=List[schemas.RepairReport])
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


@authenticated_router.get("/api_status", response_model=schemas.Status)
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


@authenticated_router.get("/owners", response_model=List[schemas.Owner])
def read_owners(db: Session = Depends(get_db)):
    return db.query(Owner).all()


# ======= WaterLevels ========


# @app.get("/well_wate/{wellid}", response_model=List[schemas.Reading])
# async def read_wellreadings(wellid, db: Session = Depends(get_db)):
#     return db.query(Reading).filter_by(well_id=wellid).all()


# ====== WellConstruction
@authenticated_router.get(
    "/wellconstruction/{wellid}",
    response_model=schemas.WellConstruction,
    tags=["wells"],
)
async def read_wellconstruction(wellid, db: Session = Depends(get_db)):
    return db.query(WellConstruction).filter_by(well_id=wellid).first()


# ====== Alerts
@app.get("/nalerts", response_model=int, tags=["alerts"])
async def read_nalerts(
    db: Session = Depends(get_db),
):
    q = db.query(Alert)
    return q.count()


# ====== Wells
@app.get("/nwells", response_model=int, tags=["wells"])
async def read_nwells(
    db: Session = Depends(get_db),
):
    q = db.query(Well)
    return q.count()


# ======  Meters
@app.get("/nmeters", response_model=int, tags=["meters"])
async def read_nmeters(
    db: Session = Depends(get_db),
):
    q = db.query(Meter)
    return q.count()


# ======  Repairs
@app.get("/nrepairs", response_model=int, tags=["repairs"])
async def read_nrepairs(
    location: str = None,
    well_id: int = None,
    meter_id: int = None,
    db: Session = Depends(get_db),
):
    q = repair_query(db, location, well_id, meter_id)
    return q.count()


# ======== Worker
@app.get("/nworkers", response_model=int, tags=["workers"])
async def read_nworkers(
    db: Session = Depends(get_db),
):
    q = db.query(Worker)
    return q.count()


@app.get("/")
async def index():
    return {"message": "Hello World WaterManagerDBffff"}


authenticated_router.include_router(alert_router)
authenticated_router.include_router(meter_router)
authenticated_router.include_router(well_router)
authenticated_router.include_router(repair_router)
authenticated_router.include_router(worker_router)
authenticated_router.include_router(well_measurement_router)
app.include_router(authenticated_router)

if os.environ.get("SETUP_DB"):
    from api.dbsetup import setup_db

    setup_db(engine)
# ============= EOF =============================================
