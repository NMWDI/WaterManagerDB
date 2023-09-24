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
from typing import List, Optional
from api.schemas.base import ORMBase


class SecurityScope(ORMBase):
    scope_string: str
    description: Optional[str]


class UserRole(ORMBase):
    name: str

    security_scopes: Optional[List[SecurityScope]]


class UpdatedUserPassword(ORMBase):
    user_id: int
    new_password: str


class UpdatedUser(ORMBase):
    id: int
    username: str
    email: str
    full_name: str
    disabled: bool
    user_role_id: int


class NewUser(ORMBase):
    username: str
    email: str
    full_name: str
    disabled: bool
    user_role_id: int
    password: str


class User(ORMBase):
    username: Optional[str]
    email: Optional[str]
    full_name: Optional[str]
    disabled: bool

    user_role_id: int

    user_role: Optional[UserRole]


class Token(ORMBase):
    access_token: str
    token_type: str
    user: User


class TokenData(ORMBase):
    username: Optional[str]
    security_scopes: List[str] = []


class UserInDB(User):
    hashed_password: str


# ============= EOF =============================================
