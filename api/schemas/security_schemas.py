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
from typing import Union, List

from pydantic import BaseModel

class SecurityScope(BaseModel):
    id: int
    scope_string: str
    description: str

    class Config:
        orm_mode = True

class UserRole(BaseModel):
    id: int
    name: str
    security_scopes: Union[List[SecurityScope], None] = None # Can be optionally joined

    class Config:
        orm_mode = True

class User(BaseModel):
    username: str
    email: Union[str, None] = None
    full_name: Union[str, None] = None
    disabled: Union[bool, None] = None
    user_role_id: int
    user_role: Union[UserRole, None] = None # Can be optionally joined

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    username: Union[str, None] = None
    security_scopes: List[str] = []

class UserInDB(User):
    hashed_password: str

# ============= EOF =============================================
