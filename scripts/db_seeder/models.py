from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class UserRole(Base):
    __tablename__ = 'UserRoles'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

class User(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    full_name = Column(String)
    email = Column(String)
    hashed_password = Column(String, nullable=False, default="password")
    disabled = Column(Boolean)
    user_role_id = Column(Integer, ForeignKey('UserRoles.id'), nullable=False)
