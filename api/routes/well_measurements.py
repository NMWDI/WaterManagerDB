from typing import List
from datetime import datetime

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, and_

from api.schemas import well_schemas
from api.models.main_models import WellMeasurements, ObservedPropertyTypeLU, Units, Wells
from api.session import get_db
from api.enums import ScopedUser

well_measurement_router = APIRouter()


@well_measurement_router.post(
    "/waterlevels",
    dependencies=[Depends(ScopedUser.WellMeasurementWrite)],
    response_model=well_schemas.WellMeasurement,
    tags=["WaterLevels"],
)
def add_waterlevel(
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


@well_measurement_router.get(
    "/waterlevels",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=List[well_schemas.WellMeasurementDTO],
    tags=["WaterLevels"],
)
def read_waterlevels(well_id: int = None, db: Session = Depends(get_db)):
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

@well_measurement_router.patch(
    "/waterlevels",
    dependencies=[Depends(ScopedUser.Admin)],
    response_model=well_schemas.WellMeasurement,
    tags=["WaterLevels"],
)
def patch_waterlevel(waterlevel_patch: well_schemas.PatchWaterLevel, db: Session = Depends(get_db)):
    # Find the measurement
    well_measurement = (
        db.scalars(select(WellMeasurements).where(WellMeasurements.id == waterlevel_patch.levelmeasurement_id)).first()
    )

    # Update the fields, all are mandatory
    well_measurement.submitting_user_id = waterlevel_patch.submitting_user_id
    well_measurement.timestamp = waterlevel_patch.timestamp
    well_measurement.value = waterlevel_patch.value

    db.commit()

    return well_measurement

@well_measurement_router.delete(
    "/waterlevels",
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["WaterLevels"],
)
def delete_waterlevel(waterlevel_id: int, db: Session = Depends(get_db)):
    # Find the measurement
    well_measurement = (
        db.scalars(select(WellMeasurements).where(WellMeasurements.id == waterlevel_id)).first()
    )

    db.delete(well_measurement)
    db.commit()

    return True




#----------------- Chloride Concentration -----------------#

@well_measurement_router.get(
    "/chlorides",
    dependencies=[Depends(ScopedUser.Read)],
    #response_model=List[well_schemas.ChlorideMeasurement],
    tags=["Chlorides"],
)
def read_chlorides(group_id: int = None, db: Session = Depends(get_db)):
    return db.scalars(
        select(WellMeasurements, Wells.chloride_group_id)  
        .options(joinedload(WellMeasurements.submitting_user))
        .join(Wells)
        .where(
            and_(
                WellMeasurements.observed_property_id == 5,  # Chloride Concentration
                Wells.chloride_group_id == group_id
            )
        )
    ).all()


@well_measurement_router.post(
    "/chlorides",
    dependencies=[Depends(ScopedUser.WellMeasurementWrite)],
    response_model=well_schemas.WellMeasurement,
    tags=["WaterLevels"],
)
def add_chloride_measurement(
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



