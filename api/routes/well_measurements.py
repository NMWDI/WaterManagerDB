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
from datetime import datetime

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, and_

from api.schemas import well_schemas
from api.models.main_models import WellMeasurements, ObservedPropertyTypeLU, Units
from api.session import get_db
from api.enums import ScopedUser

well_measurement_router = APIRouter()


@well_measurement_router.post(
    "/waterlevels",
    dependencies=[Depends(ScopedUser.WellMeasurementWrite)],
    response_model=well_schemas.WellMeasurement,
    tags=["WaterLevels"],
)
async def add_waterlevel(
    waterlevel: well_schemas.NewWaterLevelMeasurement, db: Session = Depends(get_db)
):
    # Create the well measurement from the form, qualify with units and property type
    well_measurement = WellMeasurements(
        timestamp=datetime.combine(
            waterlevel.timestamp.date(), waterlevel.timestamp.time()
        ),  # Convert to UTC
        value=waterlevel.value,
        observed_property_id=db.scalars(
            select(ObservedPropertyTypeLU.id).where(
                ObservedPropertyTypeLU.name == "Depth to water"
            )
        ).first(),
        submitting_user_id=waterlevel.submitting_user_id,
        unit_id=db.scalars(select(Units.id).where(Units.name == "feet")).first(),
        well_id=waterlevel.well_id,
    )

    db.add(well_measurement)
    db.commit()

    return well_measurement


@well_measurement_router.post(
    "/chlorides",
    dependencies=[Depends(ScopedUser.WellMeasurementWrite)],
    response_model=well_schemas.WellMeasurement,
    tags=["WaterLevels"],
)
async def add_chloride_measurement(
    chloride_measurement: well_schemas.NewWaterLevelMeasurement,
    db: Session = Depends(get_db),
):
    # Create the well measurement from the form, qualify with units and property type
    well_measurement = WellMeasurements(
        timestamp=datetime.combine(
            chloride_measurement.timestamp.date(), chloride_measurement.timestamp.time()
        ),  # Convert to UTC
        value=chloride_measurement.value,
        observed_property_id=db.scalars(
            select(ObservedPropertyTypeLU.id).where(
                ObservedPropertyTypeLU.name == "Chloride Concentration"
            )
        ).first(),
        submitting_user_id=chloride_measurement.submitting_user_id,
        unit_id=db.scalars(
            select(Units.id).where(Units.name == "Micrograms per Liter")
        ).first(),
        well_id=chloride_measurement.well_id,
    )

    db.add(well_measurement)
    db.commit()

    return well_measurement


@well_measurement_router.get(
    "/waterlevels",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=List[well_schemas.WellMeasurementDTO],
    tags=["WaterLevels"],
)
async def read_waterlevels(well_id: int = None, db: Session = Depends(get_db)):
    return db.scalars(
        select(WellMeasurements)
        .options(joinedload(WellMeasurements.submitting_user))
        .join(ObservedPropertyTypeLU)
        .where(
            and_(
                ObservedPropertyTypeLU.name == "Depth to water",
                WellMeasurements.well_id == well_id,
            )
        )
    ).all()


@well_measurement_router.get(
    "/chlorides",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=List[well_schemas.WellMeasurementDTO],
    tags=["WaterLevels"],
)
async def read_chlorides(well_id: int = None, db: Session = Depends(get_db)):
    return db.scalars(
        select(WellMeasurements)
        .options(joinedload(WellMeasurements.submitting_user))
        .join(ObservedPropertyTypeLU)
        .where(
            and_(
                ObservedPropertyTypeLU.name == "Chloride Concentration",
                WellMeasurements.well_id == well_id,
            )
        )
    ).all()
