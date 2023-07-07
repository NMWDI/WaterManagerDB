# ===============================================================================
# Models in database
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
    select
)
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from sqlalchemy.ext.hybrid import hybrid_property, Comparator


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

class MeterLocationHistory(Base):
    '''
    Table for tracking a meter's locations over time
    '''
    install_date: Column(DateTime, nullable=False)
    meter_id = Column(Integer, ForeignKey("Meters.id"))
    location_id = Column(Integer, ForeignKey("MeterLocations.id"))
    # Need to define relationships

class MeterLocations(Base):
    '''
    Table for tracking information about a meters location
    '''
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    trss = Column(String)

    land_owner_id = Column(Integer, ForeignKey("LandOwners.id"))

    land_owner = relationship("LandOwners")

class Meters(Base):
    '''
    Primary table for tracking meters
    '''
    serial_number = Column(String, nullable=False)
    contact_name = Column(String) #Contact information specific to particular meter
    contact_phone = Column(String)
    ra_number = Column(String) #RA Number is an identifier of the well the meter is attached to
    tag = Column(String)  #OSE tag
    well_distance_ft = Column(Float) #Distance of meter install from well
    notes = Column(String)

    meter_type_id = Column(Integer, ForeignKey("MeterTypeLU.id"), nullable=False)
    status_id = Column(Integer, ForeignKey("MeterStatusLU.id"))
    meter_location_id = Column(Integer, ForeignKey("MeterLocations.id"))

    meter_type = relationship("MeterTypeLU", lazy="noload")
    status = relationship("MeterStatusLU", lazy="noload")
    meter_location = relationship("MeterLocations", lazy="noload")

    @hybrid_property
    def land_owner_name(self):
        return self.meter_location.land_owner.land_owner_name

    class LandOwnerNameComparator(Comparator):
        def __eq__(self, other):
            return func.lower(self.__clause_element__()) == func.lower(other)


    # Random fields that seeder wants to fill
    land_owner_id = Column(Integer)
    longitude = Column(Float)
    latitude = Column(Float)
    trss = Column(String)

class MeterTypeLU(Base):
    '''
    Details different meter types, but does not include parts
    - See parts table for sub-components
    '''
    brand = Column(String)
    series = Column(String)
    model_number = Column(String)
    size = Column(Float)
    description = Column(String)

class MeterStatusLU(Base):
    '''
    Establishes if a meter is installed, in inventory, retired, or other options as needed.
    '''
    status_name = Column(String)
    description = Column(String)

class MeterActivities(Base):
    '''
    Logs all meter activities
    '''
    timestamp_start = Column(DateTime, nullable=False)
    timestamp_end = Column(DateTime, nullable=False)
    notes = Column(String)

    technician_id = Column(Integer, ForeignKey("Technicians.id"))
    meter_id = Column(Integer, ForeignKey("Meters.id"), nullable=False)
    activity_type_id = Column(Integer, ForeignKey("ActivityTypeLU.id"), nullable=False)

    technician = relationship("Technicians")
    meter = relationship("Meters")
    activity_type = relationship("ActivityTypeLU")

class ActivityTypeLU(Base):
    '''
    Details the different types of activities PVACD implements
    '''
    name = Column(String)
    description = Column(String)

class MeterObservations(Base):
    '''
    Tracks all observations associated with a meter
    '''
    timestamp = Column(DateTime, nullable=False)
    value = Column(Float, nullable=False)
    notes = Column(String)

    technician_id = Column(Integer, ForeignKey("Technicians.id"))
    meter_id = Column(Integer, ForeignKey("Meters.id"), nullable=False)
    observed_property_id = Column(Integer, ForeignKey("ObservedPropertyTypeLU.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("Units.id"), nullable=False)

    technician = relationship("Technicians")
    meter = relationship("Meters")
    observed_property = relationship("ObservedPropertyTypeLU")
    unit = relationship("Units")

class ObservedPropertyTypeLU(Base):
    '''
    Defines the types of observations made during meter maintenance
    '''
    name = Column(String)
    description = Column(String)

class Units(Base):
    '''
    Defines units used in observations
    '''
    name = Column(String)
    name_short = Column(String)
    description = Column(String)

class PropertyUnits(Base):
    '''
    Table linking Observed Properties to Units
    Describes which units are associated with which properties
    '''
    property_id = Column(Integer, ForeignKey("ObservedPropertyTypeLU.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("Units.id"), nullable=False)


# ---------- Parts Inventory ------------

class PartTypeLU(Base):
    name = Column(String)
    description = Column(String)

class Parts(Base):
    part_number = Column(String, unique=True, nullable=False)
    description = Column(String)
    vendor = Column(String)
    count = Column(Integer, default=0)
    note = Column(String)

    part_type_id = Column(Integer, ForeignKey("PartTypeLU.id"), nullable=False)

    part_type = relationship("PartTypeLU")

class PartAssociation(Base):
    commonly_used = Column(Boolean)

    meter_type_id = Column(Integer, ForeignKey("MeterTypeLU.id"),nullable=False)
    part_id = Column(Integer,ForeignKey("Parts.id"),nullable=False)

class PartsUsed(Base):
    meter_activity_id = Column(Integer, ForeignKey("MeterActivities.id"), nullable=False)
    part_id = Column(Integer, ForeignKey("Parts.id"), nullable=False)
    count = Column(Integer, nullable=False)

# ---------- Other Tables ---------------

class LandOwners(Base):
    '''
    Organizations and people that have some relationship with a PVACD meter
    - Typically irrigators?
    '''
    contact_name = Column(String)
    land_owner_name = Column(String)
    phone = Column(String)
    email = Column(String)
    city = Column(String)

class Alerts(Base):
    # id = Column(Integer, primary_key=True, index=True)
    alert = Column(String)
    open_timestamp = Column(DateTime, default=func.now())
    closed_timestamp = Column(DateTime)

    meter_id = Column(Integer, ForeignKey("Meters.id"))

    meter = relationship("Meters")

    @property
    def meter_serial_number(self):
        return self.meter.serial_number

    @property
    def active(self):
        return not bool(self.closed_timestamp)

class Technicians(Base):
    # id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class RepairPartAssociation(Base):
    repair_id = Column(Integer, ForeignKey("Repairs.id"))
    part_id = Column(Integer, ForeignKey("Parts.id"))

class Repairs(Base):
    # id = Column(Integer, primary_key=True, index=True)
    # meter_id = Column(Integer, ForeignKey('metertbl.id'))

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

    well_id = Column(Integer, ForeignKey("Wells.id"))
    technician_id = Column(Integer, ForeignKey("Technicians.id"))

    well = relationship("Wells", uselist=False)
    technician = relationship("Technicians", uselist=False)
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

# ------------ Monitoring Wells --------------

class Wells(Base):
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
    waterlevels = relationship("WellMeasurements", back_populates="well")

    #meter_history = relationship("MeterHistory", uselist=False)
    construction = relationship("WellConstructions", uselist=False)

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


class WellConstructions(Base):
    # id = Column(Integer, primary_key=True, index=True)
    casing_diameter = Column(Float, default=0)
    hole_depth = Column(Float, default=0)
    well_depth = Column(Float, default=0)
    well_id = Column(Integer, ForeignKey("Wells.id"))

    screens = relationship("ScreenIntervals")
    well = relationship("Wells")


class ScreenIntervals(Base):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    top = Column(Float)
    bottom = Column(Float)
    well_construction_id = Column(Integer, ForeignKey("WellConstructions.id"))

class WellMeasurements(Base):
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    value = Column(Float, nullable=False)

    observed_property_id = Column(Integer, ForeignKey("ObservedPropertyTypeLU.id"), nullable=False)
    technician_id = Column(Integer, ForeignKey("Technicians.id"))
    unit_id = Column(Integer, ForeignKey("Units.id"), nullable=False)
    well_id = Column(Integer, ForeignKey("Wells.id"), nullable=False)

    well = relationship("Wells", back_populates="waterlevels")
    observed_property = relationship("ObservedPropertyTypeLU")


class QC(Base):
    # user_id = Column(Integer, ForeignKey("User.id"))
    timestamp = Column(DateTime, default=func.now())
    status = Column(Boolean)


