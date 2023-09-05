from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select

from api.models.main_models import (
    Parts,
    PartAssociation,
    PartTypeLU,
    Meters,
    MeterTypeLU
)
from api.schemas.part_schemas import Part
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

    part = db.scalars(
        select(Parts)
        .where(Parts.id == updated_part.id)
        .options(joinedload(Parts.part_type))
    ).first()

    # Update associations, _patch only handles direct attributes
    if (updated_part.part_type):
        part.part_type = db.scalars(
            select(PartTypeLU)
            .where(PartTypeLU.id == updated_part.part_type["id"])
        ).first()

    if (updated_part.meter_types):
        part.meter_types = db.scalars(
            select(MeterTypeLU)
            .where(MeterTypeLU.id
                .in_(map(lambda type: type["id"], updated_part.meter_types)
            ))
        ).all()

    db.commit()
    db.refresh(part)

    return part

    # HANDLE ASSOCIATED METER TYPES

@part_router.post(
    "/parts",
    dependencies=[Depends(admin_user)],
    tags=["Parts"],
)
async def create_part(new_part: Part, db: Session = Depends(get_db)):
    print(new_part.__dict__)
    new_part_model = Parts(
        part_number = new_part.part_number,
        part_type_id = db.scalars(
            select(PartTypeLU)
            .where(PartTypeLU.id == new_part.part_type["id"])
        ).first().id,
        description = new_part.description,
        vendor = new_part.vendor,
        count = new_part.count,
        note = new_part.note
    )

    db.add(new_part_model)
    db.commit()

    if (new_part.meter_types):
        new_part_model.meter_types = db.scalars(
            select(MeterTypeLU)
            .where(MeterTypeLU.id
                .in_(map(lambda type: type["id"], new_part.meter_types)
            ))
        ).all()

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
