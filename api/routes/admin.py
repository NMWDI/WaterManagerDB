from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session, joinedload, undefer
from sqlalchemy import select
from typing import List
from passlib.context import CryptContext

from api.models.security_models import Users, UserRoles, SecurityScopes

from api.schemas import security_schemas
from api.session import get_db
from api.route_util import _patch
from api.enums import ScopedUser

admin_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# define response models
@admin_router.post(
    "/users/update_password",
    response_model=security_schemas.User,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Admin"],
)
def update_user_password(
    updatedUserPassword: security_schemas.UpdatedUserPassword,
    db: Session = Depends(get_db),
):
    user = db.scalars(
        select(Users).where(Users.id == updatedUserPassword.user_id)
    ).first()

    user.hashed_password = pwd_context.hash(updatedUserPassword.new_password)
    db.commit()
    db.refresh(user)

    return user


@admin_router.patch(
    "/users",
    response_model=security_schemas.User,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Admin"],
)
def update_user(
    updated_user: security_schemas.UpdatedUser, db: Session = Depends(get_db)
):
    _patch(db, Users, updated_user.id, updated_user)

    qualified_user = db.scalars(
        select(Users)
        .options(
            undefer(Users.username),
            undefer(Users.user_role_id),
            undefer(Users.email),
            joinedload(Users.user_role),
        )
        .where(Users.id == updated_user.id)
    ).first()

    return qualified_user


@admin_router.post(
    "/users",
    response_model=security_schemas.User,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Admin"],
)
def create_user(user: security_schemas.NewUser, db: Session = Depends(get_db)):
    new_user = Users(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        user_role_id=user.user_role_id,
        disabled=user.disabled,
        hashed_password=pwd_context.hash(user.password),
    )

    db.add(new_user)
    db.commit()

    qualified_user = db.scalars(
        select(Users)
        .options(
            undefer(Users.username),
            undefer(Users.user_role_id),
            undefer(Users.email),
            joinedload(Users.user_role),
        )
        .where(Users.id == new_user.id)
    ).first()

    return qualified_user


@admin_router.get(
    "/usersadmin",
    response_model=List[security_schemas.User],
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Admin"],
)
def get_users_admin(db: Session = Depends(get_db)):
    """
    Admin-specific users list that includes sensitive information such as username and role
    """
    return (
        db.scalars(
            select(Users).options(
                undefer(Users.username),
                undefer(Users.user_role_id),
                undefer(Users.email),
                joinedload(Users.user_role),
            )
        )
        .unique()
        .all()
    )


@admin_router.get(
    "/security_scopes",
    response_model=List[security_schemas.SecurityScope],
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Admin"],
)
def get_security_scopes(db: Session = Depends(get_db)):
    return db.scalars(select(SecurityScopes)).all()


@admin_router.get(
    "/roles",
    response_model=List[security_schemas.UserRole],
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Admin"],
)
def get_roles(db: Session = Depends(get_db)):
    return (
        db.scalars(select(UserRoles).options(joinedload(UserRoles.security_scopes)))
        .unique()
        .all()
    )


@admin_router.post(
    "/roles",
    response_model=security_schemas.UserRole,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Admin"],
)
def create_role(
    new_role: security_schemas.UserRole, db: Session = Depends(get_db)
):
    scopes = []
    if new_role.security_scopes:
        scope_ids = map(lambda s: s.id, new_role.security_scopes)
        scopes = db.scalars(
            select(SecurityScopes).where(SecurityScopes.id.in_(scope_ids))
        ).all()

    new_role_model = UserRoles(name=new_role.name, security_scopes=scopes)

    db.add(new_role_model)
    db.commit()
    db.refresh(new_role_model)

    return db.scalars(
        select(UserRoles)
        .where(UserRoles.id == new_role_model.id)
        .options(joinedload(UserRoles.security_scopes))
    ).first()


@admin_router.patch(
    "/roles",
    response_model=security_schemas.UserRole,
    dependencies=[Depends(ScopedUser.Admin)],
    tags=["Admin"],
)
def update_role(
    updated_role: security_schemas.UserRole, db: Session = Depends(get_db)
):
    role = db.scalars(select(UserRoles).where(UserRoles.id == updated_role.id)).first()

    scope_ids = map(lambda s: s.id, updated_role.security_scopes)

    scopes = db.scalars(
        select(SecurityScopes).where(SecurityScopes.id.in_(scope_ids))
    ).all()

    role.name = updated_role.name
    role.security_scopes = scopes

    db.commit()

    return db.scalars(
        select(UserRoles)
        .where(UserRoles.id == updated_role.id)
        .options(joinedload(UserRoles.security_scopes))
    ).first()
