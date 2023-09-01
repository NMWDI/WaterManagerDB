from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select

from api.models.main_models import (
    Parts,
    PartAssociation,
    PartTypeLU,
    Meters
)
from api.schemas.part_schemas import PartForm, Part
from api.security import scoped_user
from api.session import get_db
from api.route_util import _patch

part_router = APIRouter()

activity_write_user = scoped_user(["read", "activities:write"])
read_user = scoped_user(["read"])
admin_user = scoped_user(["admin"])


@part_router.get(
    "/parts",
    dependencies=[Depends(read_user)],
    tags=["Parts"],
)
async def get_parts(db: Session = Depends(get_db)):
    return db.scalars(
        select(Parts)
        .options(joinedload(Parts.part_type))
    ).all()


@part_router.get(
    "/part_types",
    dependencies=[Depends(read_user)],
    tags=["Parts"],
)
async def get_part_types(db: Session = Depends(get_db)):
    return db.scalars(select(PartTypeLU)).all()


@part_router.get(
    "/part",
    dependencies=[Depends(read_user)],
    tags=["Parts"],
)
async def get_part(part_id: int, db: Session = Depends(get_db)):
    return db.scalars(
        select(Parts)
        .where(Parts.id == part_id)
        .options(
            joinedload(Parts.part_type),
            joinedload(Parts.meter_types),
        )
    ).first()


@part_router.patch(
    "/part",
    dependencies=[Depends(read_user)],
    tags=["Parts"],
)
async def update_part(updated_part: Part, db: Session = Depends(get_db)):
    _patch(db, Parts, updated_part.id, updated_part)


    # HANDLE ASSOCIATED METER TYPES
    return db.scalars(
        select(Parts)
        .where(Parts.id == updated_part.id)
        .options(joinedload(Parts.part_type))
    ).first()

@part_router.post(
    "/parts",
    dependencies=[Depends(admin_user)],
    tags=["Parts"],
)
async def create_part(new_part: PartForm, db: Session = Depends(get_db)):
    new_part_model = Parts(
        part_number = new_part.part_number,
        part_type_id = new_part.part_type_id,
        description = new_part.description,
        vendor = new_part.vendor,
        count = new_part.count,
        note = new_part.note
    )

    # HANDLE ASSOCIATED METERS

    db.add(new_part_model)
    db.commit()

    return new_part_model


@part_router.get(
    "/meter_parts",
    dependencies=[Depends(read_user)],
    tags=["Parts"],
)
async def get_meter_parts(meter_id: int, db: Session = Depends(get_db)):
    meter_type_id = db.scalars(
        select(Meters.meter_type_id).where(Meters.id == meter_id)
    ).first()

    return db.scalars(
        select(PartAssociation)
        .where(PartAssociation.meter_type_id == meter_type_id)
        .options(joinedload(PartAssociation.part).joinedload(Parts.part_type))
    ).all()
