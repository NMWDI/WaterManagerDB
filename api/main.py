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
from datetime import timedelta

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_pagination import add_pagination

from fastapi.middleware.cors import CORSMiddleware
from starlette import status

from api.schemas import security_schemas

from api.routes.meters import meter_router
from api.routes.well_measurements import well_measurement_router
from api.routes.activities import activity_router
from api.routes.OSE import ose_router
from api.routes.parts import part_router
from api.routes.admin import admin_router
from api.routes.wells import well_router

from api.security import (
    authenticate_user,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_HOURS,
    authenticated_router,
)

tags_metadata = [
    {"name": "Wells", "description": "Well Related Endpoints"},
    {"name": "Parts", "description": "Part Related Endpoints"},
    {"name": "Meters", "description": "Meter Related Endpoints"},
    {
        "name": "Activities",
        "description": "Activity Submission and Viewing Related Endpoints",
    },
    {
        "name": "WaterLevels",
        "description": "Groundwater Depth and Chloride Measurement Related Endpoints",
    },
    {"name": "OSE", "description": "Endpoints Used by the OSE to Generate Reports"},
    {"name": "Admin", "description": "Admin Functionality Related Endpoints"},
    {"name": "Login", "description": "User Auth and Token Related Endpoints"},
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


@app.post("/token", response_model=security_schemas.Token, tags=["Login"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account is disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={
            "sub": user.username,
            "scopes": list(
                map(lambda scope: scope.scope_string, user.user_role.security_scopes)
            ),
        },
        expires_delta=timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS),
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


# =======================================

authenticated_router.include_router(meter_router)
authenticated_router.include_router(activity_router)
authenticated_router.include_router(well_measurement_router)
authenticated_router.include_router(part_router)
authenticated_router.include_router(admin_router)
authenticated_router.include_router(well_router)

add_pagination(app)

app.include_router(ose_router)
app.include_router(authenticated_router)
