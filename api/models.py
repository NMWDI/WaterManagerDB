# ===============================================================================
# Models in database
# - Alembic used to initialize new database with these models
# ===============================================================================
from typing import Any

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKeyConstraint,
    ForeignKey,
    Float,
    BLOB,
    DateTime,
    LargeBinary,
    func,
    Boolean,
)
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape


@as_declarative()
class Base:
    '''
    Base class for all models
    - Adds id column on all tables
    '''
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    __name__: str

    # to generate tablename from classname
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__


# ---------  Meter Related Tables ---------

class Meters(Base):
    '''
    Primary table for tracking meters
    '''
    serial_number = Column(String, nullable=False)
    meter_type_id = Column(Integer, ForeignKey("MeterTypes.id"), nullable=False)
    contact_id = Column(Integer, ForeignKey("Contacts.id"), nullable=False)

    #RA Number is an identifier of the well the meter is attached to
    ra_number = Column(String)
    
    latitude = Column(Float)
    longitude = Column(Float)
    tag = Column(String)  #Unclear purpose - in PVACD Access db
    #status_id = Column(Integer, ForeignKey("MeterStatusLU.id"), nullable=False)

class MeterTypes(Base):
    '''
    Details different meter types, but does not include parts
    - See parts table for sub-components
    '''
    brand = Column(String)
    model = Column(String)
    size = Column(Integer)

class MeterStatusLU(Base):
    '''
    Establishes if a meter is installed, in inventory, retired, or other options as needed.
    '''
    name = Column(String)
    description = Column(String)

class MeterHistory(Base):
    '''
    Logs all meter activities
    '''
    timestamp = Column(DateTime, nullable=False)
    meter_id = Column(Integer, ForeignKey("Meters.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("Activities.id"), nullable=False)
    meter_reading = Column(Float)
    energy_reading = Column(Integer)
    note = Column(LargeBinary)

    #meter = relationship("Meter", uselist=False)

class Contacts(Base):
    '''
    Organizations and people that have some relationship with a PVACD meter
    - Typically irrigators?
    '''
    name = Column(String)
    organization = Column(String)
    phone = Column(String)
    email = Column(String)

    #wells = relationship("Well", back_populates="owner")

# ---------- PVACD Operations Tables ---------------  

class Activities(Base):
    '''
    Details the different types of activities PVACD implements...
    - Under dev
    '''
    name = Column(String)
    description = Column(String)


class Alert(Base):
    # id = Column(Integer, primary_key=True, index=True)
    alert = Column(String)
    meter_id = Column(Integer, ForeignKey("Meters.id"))
    open_timestamp = Column(DateTime, default=func.now())
    closed_timestamp = Column(DateTime)

    #meter = relationship("Meter", uselist=False)

    @property
    def meter_serial_number(self):
        return self.meter.serial_number

    @property
    def active(self):
        return not bool(self.closed_timestamp)

class Worker(Base):
    # id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class RepairPartAssociation(Base):
    repair_id = Column(Integer, ForeignKey("Repair.id"))
    part_id = Column(Integer, ForeignKey("Part.id"))

class Repair(Base):
    # id = Column(Integer, primary_key=True, index=True)
    # meter_id = Column(Integer, ForeignKey('metertbl.id'))
    well_id = Column(Integer, ForeignKey("Well.id"))
    worker_id = Column(Integer, ForeignKey("Worker.id"))

    timestamp = Column(DateTime, default=func.now())
    h2o_read = Column(Float)
    e_read = Column(String)
    new_read = Column(String)
    repair_description = Column(LargeBinary)
    note = Column(LargeBinary)
    meter_status_id = Column(Integer, ForeignKey("MeterStatusLU.id"))  # pok, np, piro
    preventative_maintenance = Column(String)
    qc_id = Column(Integer, ForeignKey("QC.id"))
    public_release = Column(Boolean)

    well = relationship("Well", uselist=False)
    repair_by = relationship("Worker", uselist=False)
    meter_status = relationship("MeterStatusLU", uselist=False)
    qc = relationship("QC", uselist=False)

    @property
    def well_name(self):
        return self.well.name

    @property
    def well_location(self):
        return self.well.location

    @property
    def meter_serial_number(self):
        return self.well.meter_history.meter.serial_number

    @property
    def meter_status_name(self):
        return self.meter_status.name

    @property
    def worker(self):
        return self.repair_by.name

    @worker.setter
    def worker(self, v):
        self.repair_by.id


# ---------- Parts Inventory ------------

class PartTypeLU(Base):
    name = Column(String)
    description = Column(String)


class Part(Base):
    part_type_id = Column(Integer, ForeignKey("PartTypeLU.id"))

    part_number = Column(String)
    count = Column(Integer)
    vendor = Column(String)
    note = Column(String)
    create_date = Column(DateTime, default=func.now())


# ------------ Monitoring Wells --------------

class Well(Base):
    # id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    township = Column(Integer)
    range = Column(Integer)
    section = Column(Integer)
    quarter = Column(Integer)
    half_quarter = Column(Integer)
    quarter_quarter = Column(Integer)

    # latitude = Column(Float)
    # longitude = Column(Float)

    geom = Column(Geometry("POINT"))

    # owner_id = Column(Integer, ForeignKey("Owner.id"))
    osepod = Column(String)

    # meter = relationship('Meter', uselist=False, back_populates='well')
    # owner = relationship("Owner", back_populates="wells")
    waterlevels = relationship("WellMeasurement", back_populates="well")

    #meter_history = relationship("MeterHistory", uselist=False)
    construction = relationship("WellConstruction", uselist=False)

    @property
    def latitude(self):
        try:
            return to_shape(self.geom).y
        except BaseException:
            return

    @property
    def longitude(self):
        try:
            return to_shape(self.geom).x
        except BaseException:
            return

    @property
    def location(self):
        return f"{self.township}.{self.range}.{self.section}.{self.quarter}.{self.half_quarter}"


class WellConstruction(Base):
    # id = Column(Integer, primary_key=True, index=True)
    casing_diameter = Column(Float, default=0)
    hole_depth = Column(Float, default=0)
    well_depth = Column(Float, default=0)
    well_id = Column(Integer, ForeignKey("Well.id"))

    screens = relationship("ScreenInterval")


class ScreenInterval(Base):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    top = Column(Float)
    bottom = Column(Float)
    well_construction_id = Column(Integer, ForeignKey("WellConstruction.id"))


class ObservedProperty(Base):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)


class WellMeasurement(Base):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    value = Column(Float)
    timestamp = Column(DateTime, default=func.now())
    well_id = Column(Integer, ForeignKey("Well.id"))

    well = relationship("Well", back_populates="waterlevels")
    observed_property_id = Column(Integer, ForeignKey("ObservedProperty.id"))


class QC(Base):
    # user_id = Column(Integer, ForeignKey("User.id"))
    timestamp = Column(DateTime, default=func.now())
    status = Column(Boolean)


