from typing import List

from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy import or_, select, desc
from sqlalchemy.orm import Session, joinedload
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import LimitOffsetPage

from api.schemas import well_schemas
from api.models.main_models import Locations, WellUseLU, Wells
from api.route_util import _patch
from api.session import get_db
from api.enums import ScopedUser, WellSortByField, SortDirection

well_router = APIRouter()


@well_router.get(
    "/use_types",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=List[well_schemas.WellUseLU],
    tags=["Wells"],
)
async def get_use_types(
    db: Session = Depends(get_db),
):
    return db.scalars(select(WellUseLU)).all()


@well_router.get(
    "/wells",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=LimitOffsetPage[well_schemas.Well],
    tags=["Wells"],
)
async def get_wells(
    # offset: int, limit: int - From fastapi_pagination
    search_string: str = None,
    sort_by: WellSortByField = WellSortByField.Name,
    sort_direction: SortDirection = SortDirection.Ascending,
    db: Session = Depends(get_db),
):
    def sort_by_field_to_schema_field(name: WellSortByField):
        match name:
            case WellSortByField.Name:
                return Wells.name

            case WellSortByField.RANumber:
                return Wells.ra_number

            case WellSortByField.OSEPod:
                return Wells.osepod

            case WellSortByField.UseType:
                return WellUseLU.use_type

            case WellSortByField.Location:
                return Locations.name

    query_statement = (
        select(Wells)
        .options(joinedload(Wells.location), joinedload(Wells.use_type))
        .join(Locations, isouter=True)
        .join(WellUseLU, isouter=True)
    )

    if search_string:
        query_statement = query_statement.where(
            or_(
                Wells.name.ilike(f"%{search_string}%"),
                Wells.ra_number.ilike(f"%{search_string}%"),
                Wells.osepod.ilike(f"%{search_string}%"),
                Locations.trss.ilike(f"%{search_string}%"),
                WellUseLU.use_type.ilike(f"%{search_string}%"),
            )
        )

    if sort_by:
        schema_field_name = sort_by_field_to_schema_field(sort_by)

        if sort_direction != SortDirection.Ascending:
            query_statement = query_statement.order_by(desc(schema_field_name))
        else:
            query_statement = query_statement.order_by(
                schema_field_name
            )  # SQLAlchemy orders ascending by default

    return paginate(db, query_statement)


@well_router.patch(
    "/wells",
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Wells"],
)
async def update_well(
    updated_well: well_schemas.SubmitWellUpdate, db: Session = Depends(get_db)
):
    # Update well and location
    _patch(db, Locations, updated_well.location.id, updated_well.location)
    updated_well_model = _patch(db, Wells, updated_well.id, updated_well)

    # Update use type of well
    updated_well_model.use_type_id = updated_well.use_type.id
    db.commit()

    # Get qualified well model
    updated_well_model = db.scalars(
        select(Wells)
        .where(Wells.id == updated_well.id)
        .options(joinedload(Wells.use_type), joinedload(Wells.location))
    ).first()

    # Return qualified well model
    return updated_well_model


@well_router.post(
    "/wells",
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Wells"],
)
async def create_well(
    new_well: well_schemas.SubmitWellCreate, db: Session = Depends(get_db)
):
    # First, commit the new location that was added with the new well
    new_location_model = Locations(
        name=new_well.location.name,
        type_id=2,
        trss=new_well.location.trss,
        latitude=new_well.location.latitude,
        longitude=new_well.location.longitude,
    )

    db.add(new_location_model)
    db.commit()
    db.refresh(new_location_model)

    # Then, commit the well using the location we just created
    try:
        new_well_model = Wells(
            name=new_well.name,
            use_type_id=new_well.use_type.id,
            location_id=new_location_model.id,
            ra_number=new_well.ra_number,
            osepod=new_well.osepod,
        )

        db.add(new_well_model)
        db.commit()
        db.refresh(new_well_model)

    # Manually rollback adding the location if anything fails
    except:
        db.rollback()
        db.delete(new_location_model)
        db.commit()
        raise HTTPException(status_code=500, detail=None)

    return new_well_model


@well_router.get(
    "/well",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=well_schemas.Well,
    tags=["Wells"],
)
async def get_well(well_id: int, db: Session = Depends(get_db)):
    return db.scalars(
        select(Wells)
        .options(
            joinedload(Wells.location).joinedload(Locations.land_owner),
        )
        .filter(Wells.id == well_id)
    ).first()