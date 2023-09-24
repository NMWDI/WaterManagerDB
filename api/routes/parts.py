from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from typing import List

from api.models.main_models import (
    Parts,
    PartAssociation,
    PartTypeLU,
    Meters,
    MeterTypeLU,
)
from api.schemas import part_schemas
from api.session import get_db
from api.route_util import _patch
from api.enums import ScopedUser

part_router = APIRouter()

@part_router.get(
    "/parts",
    response_model=List[part_schemas.Part],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Parts"],
)
async def get_parts(db: Session = Depends(get_db)):
    return db.scalars(select(Parts).options(joinedload(Parts.part_type))).all()


@part_router.get(
    "/part_types",
    response_model=List[part_schemas.PartTypeLU],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Parts"],
)
async def get_part_types(db: Session = Depends(get_db)):
    return db.scalars(select(PartTypeLU)).all()


@part_router.get(
    "/part",
    response_model=part_schemas.Part,
    dependencies=[Depends(ScopedUser.Read)],
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
    response_model=part_schemas.Part,
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Parts"],
)
async def update_part(updated_part: part_schemas.Part, db: Session = Depends(get_db)):
    _patch(db, Parts, updated_part.id, updated_part)

    part = db.scalars(
        select(Parts)
        .where(Parts.id == updated_part.id)
        .options(joinedload(Parts.part_type))
    ).first()

    # Update associations, _patch only handles direct attributes
    if updated_part.part_type:
        part.part_type = db.scalars(
            select(PartTypeLU).where(PartTypeLU.id == updated_part.part_type["id"])
        ).first()

    if updated_part.meter_types:
        part.meter_types = db.scalars(
            select(MeterTypeLU).where(
                MeterTypeLU.id.in_(
                    map(lambda type: type["id"], updated_part.meter_types)
                )
            )
        ).all()

    db.commit()
    db.refresh(part)

    return part


@part_router.post(
    "/parts",
    response_model=part_schemas.Part,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Parts"],
)
async def create_part(new_part: part_schemas.Part, db: Session = Depends(get_db)):
    new_part_model = Parts(
        part_number=new_part.part_number,
        part_type_id=db.scalars(
            select(PartTypeLU).where(PartTypeLU.id == new_part.part_type["id"])
        )
        .first()
        .id,
        description=new_part.description,
        vendor=new_part.vendor,
        count=new_part.count,
        note=new_part.note,
        in_use=new_part.in_use,
        commonly_used=new_part.commonly_used,
    )

    db.add(new_part_model)
    db.commit()
    db.refresh(new_part_model)

    if new_part.meter_types:
        new_part_model.meter_types = db.scalars(
            select(MeterTypeLU).where(
                MeterTypeLU.id.in_(map(lambda type: type["id"], new_part.meter_types))
            )
        ).all()

    db.commit()
    db.refresh(new_part_model)

    # Load part_type relationship
    new_part_model.part_type

    return new_part_model


@part_router.get(
    "/meter_parts",
    response_model=List[part_schemas.Part],
    dependencies=[Depends(ScopedUser.Read)],
    tags=["Parts"],
)
async def get_meter_parts(meter_id: int, db: Session = Depends(get_db)):
    meter_type_id = db.scalars(
        select(Meters.meter_type_id).where(Meters.id == meter_id)
    ).first()

    part_id_list = db.scalars(
        select(PartAssociation.c.part_id).where(
            PartAssociation.c.meter_type_id == meter_type_id
        )
    ).all()

    return db.scalars(
        select(Parts)
        .where(Parts.id.in_(part_id_list))
        .options(joinedload(Parts.part_type))
    ).all()
