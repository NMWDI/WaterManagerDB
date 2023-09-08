from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload, undefer
from sqlalchemy import select

from api.models.main_models import (
    Parts,
    PartAssociation,
    PartTypeLU,
    Meters,
    MeterTypeLU,
)
from api.models.security_models import (
    Users,
    UserRoles
)
from api.security import scoped_user
from api.session import get_db
from api.route_util import _patch

admin_router = APIRouter()

admin_user = scoped_user(["admin"])

@admin_router.get(
    "/usersadmin",
    dependencies=[Depends(admin_user)],
    tags=["Admin"]
)
async def get_users_admin(db: Session = Depends(get_db)):
    return db.scalars(
        select(Users)
        .options(
            undefer(Users.username),
            undefer(Users.user_role_id),
            undefer(Users.email),
            joinedload(Users.user_role)
        )
    ).unique().all()


@admin_router.get(
    "/roles",
    dependencies=[Depends(admin_user)],
    tags=["Admin"]
)
async def get_roles(db: Session = Depends(get_db)):
    return db.scalars(
        select(UserRoles)
    ).all()
