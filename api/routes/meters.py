# ===============================================================================
# Routes associated with direct interaction with meters
# ===============================================================================
from typing import List

from fastapi import Depends, APIRouter, HTTPException, Security
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from api.schemas import meter_schemas
from api.models import Meters, MeterTypes, MeterStatusLU, Well, Contacts
from api.route_util import _add, _patch
from api.security import get_current_user, scoped_user
from api.security_models import User
from api.session import get_db

meter_router = APIRouter()

write_user = scoped_user(["read", "meters:write"])


@meter_router.post(
    "/meters",
    dependencies=[Depends(write_user)],
    response_model=meter_schemas.Meter,
    tags=["meters"],
)
async def add_meter(obj: meter_schemas.MeterCreate, db: Session = Depends(get_db)):
    return _add(db, Meters, obj)


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
            MeterStatusLU.status_name.label('status'),
            Contacts.name.label('contact_name'),
            Contacts.organization,
            Contacts.phone,
            Meters.ra_number,
            Meters.tag,
            Meters.latitude,
            Meters.longitude,
            Meters.trss,
            Meters.notes
        )
        .join(MeterTypes)
        .join(MeterStatusLU)
        .join(Contacts)
    )

    if meter_sn:
        stmt = stmt.where(Meters.serial_number == meter_sn)
        
    elif fuzzy_search:
        stmt = stmt.where(
            or_(
                Meters.serial_number.like(f"%{fuzzy_search}%"),
                Meters.ra_number.like(f"%{fuzzy_search}%"),
                MeterTypes.brand.like(f"%{fuzzy_search}%"),
                Contacts.organization.like(f"%{fuzzy_search}%")
            )
        )
    print(stmt)
    results = db.execute(stmt)

    return results.all()


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

'''
@meter_router.get(
    "/meter_history/{meter_id}", response_model=List[schemas.MeterHistory]
)
async def read_meter_history(meter_id, db: Session = Depends(get_db)):
    return db.query(MeterHistory).filter_by(meter_id=meter_id).all()
'''
@meter_router.get("/meter_serial_numbers", response_model=List[str], tags=["meters"])
async def get_meter_serial_numbers(db: Session = Depends(get_db)):
    '''
    Simply return a list of all serial numbers
    '''
    results = db.execute(select(Meters.serial_number))

    sns = []
    for row in results:
        sns.append(row[0])

    return sns


