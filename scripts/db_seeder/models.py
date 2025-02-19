from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    Float,
    Text,
    TIMESTAMP,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geometry


Base = declarative_base()


class LandOwner(Base):
    __tablename__ = "LandOwners"
    id = Column(Integer, primary_key=True, autoincrement=True)
    contact_name = Column(String)
    organization = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip = Column(String)
    phone = Column(String)
    mobile = Column(String)
    email = Column(String)
    note = Column(String)


class LocationTypeLU(Base):
    __tablename__ = "LocationTypeLU"
    id = Column(Integer, primary_key=True)
    type_name = Column(String)
    description = Column(String)


class Location(Base):
    __tablename__ = "Locations"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    type_id = Column(Integer, ForeignKey("LocationTypeLU.id"), nullable=False)
    trss = Column(String)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    township = Column(Integer)
    range = Column(Integer)
    section = Column(Integer)
    quarter = Column(Integer)
    half_quarter = Column(Integer)
    quarter_quarter = Column(Integer)
    geom = Column(Geometry("POINT"))
    land_owner_id = Column(Integer, ForeignKey("LandOwners.id"))
    type = relationship("LocationTypeLU")
    land_owner = relationship("LandOwner")


class UserRole(Base):
    __tablename__ = "UserRoles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)


class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    full_name = Column(String)
    email = Column(String)
    hashed_password = Column(String, nullable=False, default="password")
    disabled = Column(Boolean)
    user_role_id = Column(Integer, ForeignKey("UserRoles.id"), nullable=False)


class WellUseLU(Base):
    __tablename__ = "WellUseLU"
    id = Column(Integer, primary_key=True)
    use_type = Column(String, nullable=False)
    code = Column(String)
    description = Column(String)


class WaterSource(Base):
    __tablename__ = "water_sources"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)


class WellStatus(Base):
    __tablename__ = "well_status"
    id = Column(Integer, primary_key=True)
    status = Column(String(50), nullable=False)
    description = Column(Text)


class Well(Base):
    __tablename__ = "Wells"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    use_type_id = Column(Integer, ForeignKey("WellUseLU.id"))
    location_id = Column(Integer, ForeignKey("Locations.id"))
    ra_number = Column(String)
    owners = Column(String)
    comments = Column(String)
    osetag = Column(String(30))
    water_source_id = Column(Integer, ForeignKey("water_sources.id"))
    well_status_id = Column(Integer, ForeignKey("well_status.id"))
    casing = Column(String(30))
    total_depth = Column(Float)
    outside_recorder = Column(Boolean)
    use_type = relationship("WellUseLU")
    location = relationship("Location")
    water_source = relationship("WaterSource")
    well_status = relationship("WellStatus")


class Unit(Base):
    __tablename__ = "Units"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    name_short = Column(String)
    description = Column(Text)


class ObservedPropertyTypeLU(Base):
    __tablename__ = "ObservedPropertyTypeLU"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    description = Column(String)
    context = Column(String)


class WellMeasurement(Base):
    __tablename__ = "WellMeasurements"
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(TIMESTAMP, nullable=False)
    value = Column(Float, nullable=False)
    observed_property_id = Column(
        Integer, ForeignKey("ObservedPropertyTypeLU.id"), nullable=False
    )
    submitting_user_id = Column(Integer, ForeignKey("Users.id"))
    unit_id = Column(Integer, ForeignKey("Units.id"), nullable=False)
    well_id = Column(Integer, ForeignKey("Wells.id"), nullable=False)

    observed_property = relationship("ObservedPropertyTypeLU")
    submitting_user = relationship("User")
    unit = relationship("Unit")
    well = relationship("Well")
