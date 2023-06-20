# ===============================================================================
# Routes associated with direct interaction with meters
# ===============================================================================
from typing import List

from fastapi import Depends, APIRouter, HTTPException, Security
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from api.schemas import meter_schemas
from api.models import (
    Meters,
    MeterTypes,
    Part,
    PartAssociation,
    PartTypeLU,
    Organizations,
)
from api.route_util import _add, _patch
from api.security import get_current_user, scoped_user
from api.security_models import User
from api.session import get_db

meter_router = APIRouter()

write_user = scoped_user(["read", "meters:write"])


@meter_router.get("/meters", response_model=List[meter_schemas.Meter], tags=["meters"])
async def read_meters(
    meter_sn: str = None,
    fuzzy_search: str = None,
    db: Session = Depends(get_db),
):
    stmt = (
        select(
            Meters.id,
            Meters.serial_number,
            MeterTypes.brand,
            MeterTypes.model,
            MeterTypes.size,
            MeterStatusLU.status_name.label("status"),
            Meters.contact_name,
            Meters.contact_phone,
            Organizations.organization_name,
            Meters.ra_number,
            Meters.tag,
            Meters.latitude,
            Meters.longitude,
            Meters.trss,
            Meters.well_distance_ft,
            Meters.notes,
        )
        .join(MeterTypes)
        .join(MeterStatusLU)
        .join(Organizations)
    )

    if meter_sn:
        stmt = stmt.where(Meters.serial_number == meter_sn)

    elif fuzzy_search:
        stmt = stmt.where(
            or_(
                Meters.serial_number.like(f"%{fuzzy_search}%"),
                Meters.ra_number.like(f"%{fuzzy_search}%"),
                MeterTypes.brand.like(f"%{fuzzy_search}%"),
                Organizations.organization_name.like(f"%{fuzzy_search}%"),
            )
        )
    print(stmt)
    results = db.execute(stmt)

    return results.all()


@meter_router.get("/meter", response_model=meter_schemas.Meter, tags=["meters"])
async def get_meter(
    meter_sn: str,
    db: Session = Depends(get_db),
):
    response_data = {}
    response_data["parts_associated"] = []

    # Statement for meter
    stmt = (
        select(
            Meters.id.label("meter_id"),
            Meters.serial_number,
            MeterTypes.brand,
            MeterTypes.model_number,
            Meters.contact_name,
            Meters.contact_phone,
            Organizations.organization_name.label("organization"),
            Meters.ra_number,
            Meters.tag,
            Meters.latitude,
            Meters.longitude,
            Meters.trss,
            Meters.well_distance_ft,
            Meters.notes,
        )
        .join(MeterTypes)
        .join(Organizations)
        .where(Meters.serial_number == meter_sn)
    )

    result = db.execute(stmt).fetchone()
    for col in result.keys():
        response_data[col] = result[col]

    # Get associated parts
    partstmt = (
        select(
            Part.id.label("part_id"),
            Part.part_number,
            Part.description,
            PartTypeLU.name.label("part_type"),
            PartAssociation.commonly_used,
        )
        .select_from(Meters)
        .join(MeterTypes)
        .join(PartAssociation)
        .join(Part)
        .join(PartTypeLU)
        .where(Meters.serial_number == meter_sn)
    )

    partresult = db.execute(partstmt)
    for row in partresult:
        response_data["parts_associated"].append(row)

    return response_data


"""
@meter_router.get(
    "/meter_history/{meter_id}", response_model=List[schemas.MeterHistory]
)
async def read_meter_history(meter_id, db: Session = Depends(get_db)):
    return db.query(MeterHistory).filter_by(meter_id=meter_id).all()

@meter_router.post(
    "/meters",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.Meter,
    tags=["meters"],
)
async def add_meter(obj: meter_schemas.MeterCreate, db: Session = Depends(get_db)):
    return _add(db, Meters, obj)

@meter_router.patch(
    "/meters/{meter_id}",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.Meter,
    tags=["meters"],
)
async def patch_meters(
    meter_id: int, obj: meter_schemas.MeterPatch, db: Session = Depends(get_db)
):
    return _patch(db, Meters, meter_id, obj)


"""
