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
from sqlalchemy import String, Column, Boolean, Integer, ForeignKey, Table
from api.models.main_models import Base
from sqlalchemy.orm import relationship, deferred


# Association table that links roles and their associated scopes
ScopesRoles = Table(
    "ScopesRoles",
    Base.metadata,
    Column("security_scope_id", ForeignKey("SecurityScopes.id"), nullable=False),
    Column("user_role_id", ForeignKey("UserRoles.id"), nullable=False),
)


class SecurityScopes(Base):
    """
    Individual permissions
    """

    scope_string = Column(String, nullable=False)
    description = Column(String)


class UserRoles(Base):
    name = Column(String, nullable=False)

    # The scopes associated with a given role
    security_scopes = relationship("SecurityScopes", secondary=ScopesRoles)


class Users(Base):
    """
    All info about a user of the app
    """

    full_name = Column(String)
    disabled = Column(Boolean, default=False)
    username = deferred(Column(String, nullable=False)) # Defer sensitive info so it's not sent when it's included as part of a relationship
    email = deferred(Column(String))
    hashed_password = deferred(Column(String, nullable=False))

    user_role_id = deferred(Column(Integer, ForeignKey("UserRoles.id"), nullable=False))

    user_role = relationship("UserRoles")


# ============= EOF =============================================
