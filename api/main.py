# ===============================================================================
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

from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
from starlette.responses import RedirectResponse, FileResponse

from api import security_schemas

from api.route_util import _patch, _add, _delete
from api.routes.meters import meter_router
from api.routes.well_measurements import well_measurement_router
from api.routes.activities import activity_router
from api.schemas import meter_schemas

from api.security import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticated_router,
)
from api.security_models import User
from api.session import engine, SessionLocal, get_db
from api.xls_persistence import make_xls_backup

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

@app.post("/token", response_model=security_schemas.Token, tags=["login"])
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
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}

# =======================================



# ======  Meters
@app.get("/nmeters", response_model=int, tags=["meters"])
async def read_nmeters(
    db: Session = Depends(get_db),
):
    q = db.query(Meters)
    return q.count()


authenticated_router.include_router(meter_router)
authenticated_router.include_router(activity_router)
authenticated_router.include_router(well_measurement_router)


app.include_router(authenticated_router)


