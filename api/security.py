# ===============================================================================
# Copyright 2022 ross
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ===============================================================================
from datetime import timedelta, datetime
from typing import Union

from fastapi import HTTPException, Depends, APIRouter, Security
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import ValidationError
from starlette import status
from sqlalchemy.orm import joinedload

from api.models import security_models
from api.schemas import security_schemas
from api.session import get_db

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={
        "read": "Read all data",
        "meters:write": "Write meters",
        "activities:write": "Write activities",
        "well_measurement:write": "Write well measurements, i.e. Water Levels and Chlorides",
        "reports:run": "Run reports",
        "admin": "Admin specific scope",
    },
)

SECRET_KEY = "09d25e194fbb6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(username: str):
    db = next(get_db())

    # Eager load roles and scopes
    dbuser = (
        db.query(security_models.Users)
        .filter(security_models.Users.username == username)
        .options(
            joinedload(security_models.Users.user_role).joinedload(
                security_models.UserRoles.security_scopes
            )
        )
        .first()
    )

    if dbuser:
        return security_schemas.UserInDB(**dbuser.__dict__)


async def get_current_user(
    security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme)
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = f"Bearer"
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": authenticate_value},
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = security_schemas.TokenData(
            security_scopes=token_scopes, username=username
        )
    except (JWTError, ValidationError):
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception

    for scope in security_scopes.scopes:
        if scope not in token_data.security_scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user


def scoped_user(scopes):
    async def get_user(
        current_user: security_models.Users = Security(get_current_user, scopes=scopes)
    ):
        if current_user.disabled:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user

    return get_user


authenticated_router = APIRouter(dependencies=[Depends(scoped_user(["read"]))])


@authenticated_router.get(
    "/users/me", response_model=security_schemas.User, tags=["login"]
)
async def read_users_me(
    current_user: security_schemas.User = Depends(get_current_user),
):
    return current_user


# ============= EOF =============================================
