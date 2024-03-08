from typing import List

from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy import or_, select, desc, text
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import LimitOffsetPage

from api.schemas import well_schemas
from api.models.main_models import Locations, WellUseLU, Wells
from api.route_util import _patch, _get
from api.session import get_db
from api.enums import ScopedUser, WellSortByField, SortDirection

well_router = APIRouter()


@well_router.get(
    "/use_types",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=List[well_schemas.WellUseLU],
    tags=["Wells"],
)
def get_use_types(
    db: Session = Depends(get_db),
):
    return db.scalars(select(WellUseLU)).all()


@well_router.get(
    "/wells",
    dependencies=[Depends(ScopedUser.Read)],
    response_model=LimitOffsetPage[well_schemas.Well],
    tags=["Wells"],
)
def get_wells(
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

            case WellSortByField.Owners:
                return Wells.owners

            case WellSortByField.OSETag:
                return Wells.osetag

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
                Wells.owners.ilike(f"%{search_string}%"),
                Wells.osetag.ilike(f"%{search_string}%"),
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
    dependencies=[Depends(ScopedUser.WellWrite)],
    tags=["Wells"],
)
def update_well(
    updated_well: well_schemas.SubmitWellUpdate, db: Session = Depends(get_db)
):
    # Update location since locations are mostly associated with wells
    _patch(db, Locations, updated_well.location.id, updated_well.location)

    # Update well - RA number must be unique
    updated_well_model = _get(db, Wells, updated_well.id)

    for k, v in updated_well.dict(exclude_unset=True).items():
        try:
            setattr(updated_well_model, k, v)
        except AttributeError as e:
            print(e)
            continue

    try:
        db.add(updated_well_model)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=409, detail="RA number already exists")

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
def create_well(new_well: well_schemas.SubmitWellCreate, db: Session = Depends(get_db)):
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
            owners=new_well.owners,
            osetag=new_well.osetag,
        )

        db.add(new_well_model)
        db.commit()
        db.refresh(new_well_model)

    except IntegrityError as e:
        db.rollback()
        db.delete(new_location_model)
        db.commit()
        raise HTTPException(status_code=409, detail="RA number already exists")

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
def get_well(well_id: int, db: Session = Depends(get_db)):
    return db.scalars(
        select(Wells)
        .options(
            joinedload(Wells.location).joinedload(Locations.land_owner),
        )
        .filter(Wells.id == well_id)
    ).first()

@well_router.post(
    "/merge_wells",
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Wells"],
)
def merge_well(well: well_schemas.SubmitWellMerge, db: Session = Depends(get_db)):
    '''
    Transfers the history of merge well to target well then deletes the merge well
    '''
    merge_well = db.scalars(select(Wells).where(Wells.ra_number == well.merge_well)).first()
    target_well = db.scalars(select(Wells).where(Wells.ra_number == well.target_well)).first()
    merge_location = db.scalars(select(Locations).where(Locations.id == merge_well.location_id)).first()

    # Transfer history of merge well to target well
    # Change well_id and location_id of Meters table to target well_id and location_id
    meters_sql = text("""
        UPDATE "Meters"
        SET well_id = :target_well_id, location_id = :target_location_id
        WHERE well_id = :merge_well_id
    """)

    db.execute(meters_sql, {
        'target_well_id': target_well.id,
        'target_location_id': target_well.location_id,
        'merge_well_id': merge_well.id
    })
    # Update meter activities table to target well_id and location_id
    meter_activities_sql = text("""
        UPDATE "MeterActivities"
        SET location_id = :target_location_id
        WHERE location_id = :merge_location_id
    """)
    db.execute(meter_activities_sql, {
        'target_well_id': target_well.id,
        'target_location_id': target_well.location_id,
        'merge_location_id': merge_well.location_id
    })
    # Update meter observations table to target well_id and location_id
    meter_observations_sql = text("""
        UPDATE "MeterObservations"
        SET location_id = :target_location_id
        WHERE location_id = :merge_location_id
    """)
    db.execute(meter_observations_sql, {
        'target_well_id': target_well.id,
        'target_location_id': target_well.location_id,
        'merge_location_id': merge_well.location_id
    })

    # Delete merge well and location
    db.delete(merge_well)
    db.delete(merge_location)

    db.commit()

    return True