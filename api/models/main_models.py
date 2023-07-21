# ===============================================================================
# Models in database
# ===============================================================================
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float,
    DateTime,
    LargeBinary,
    func,
    Boolean,
    Table,
)
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from sqlalchemy.ext.hybrid import hybrid_property, Comparator


@as_declarative()
class Base:
    """
    Base class for all models
    - Adds id column on all tables
    """

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    __name__: str

    # to generate tablename from classname
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__

# ---------- Parts/Services/Notes ------------

class PartTypeLU(Base):
    name = Column(String)
    description = Column(String)

class Parts(Base):
    part_number = Column(String, unique=True, nullable=False)
    part_type_id = Column(Integer, ForeignKey("PartTypeLU.id"), nullable=False)
    description = Column(String)
    vendor = Column(String)
    count = Column(Integer, default=0)
    note = Column(String)

class PartAssociation(Base):
    meter_type_id = Column(Integer, ForeignKey("MeterTypeLU.id"),nullable=False)
    part_id = Column(Integer,ForeignKey("Parts.id"),nullable=False)
    commonly_used = Column(Boolean)

PartsUsed = Table(
    "PartsUsed",
    Base.metadata,
    Column("meter_activity_id", ForeignKey("MeterActivities.id"), nullable=False),
    Column("part_id", ForeignKey("Parts.id"), nullable=False),
    Column("count", Integer),
)

class ServiceTypeLU(Base):
    '''
    Describes the type of service performed during an activity
    '''
    service_name = Column(String)
    description = Column(String)

class ServicesPerformed(Base):
    '''
    Tracks services performed during an activity
    '''
    meter_activity_id = Column(Integer, ForeignKey("MeterActivities.id"), nullable=False)
    service_type_id = Column(Integer, ForeignKey("ServiceTypeLU.id"), nullable=False)

class NoteTypeLU(Base):
    '''
    Commonly used notes associated with meter activities
    '''
    note = Column(String)
    details = Column(String)

class Notes(Base):
    '''
    Tracks notes associated with meter activities
    '''
    meter_activity_id = Column(Integer, ForeignKey("MeterActivities.id"), nullable=False)
    note_type_id = Column(Integer, ForeignKey("NoteTypeLU.id"), nullable=False)

# ---------  Meter Related Tables ---------

class Meters(Base):
    """
    Primary table for tracking meters
    """

    serial_number = Column(String, nullable=False)
    contact_name = Column(String)  # Contact information specific to particular meter
    contact_phone = Column(String)
    old_contact_name = Column(String)
    old_contact_phone = Column(String)
    tag = Column(String)  # OSE tag of some sort?

    well_distance_ft = Column(Float)  # Distance of meter install from well
    notes = Column(String)

    meter_type_id = Column(Integer, ForeignKey("MeterTypeLU.id"), nullable=False)
    status_id = Column(Integer, ForeignKey("MeterStatusLU.id"))
    well_id = Column(Integer, ForeignKey("Wells.id"))

    meter_type = relationship("MeterTypeLU", lazy="noload") # Indicate that these relationships have to be manually loaded
    status = relationship("MeterStatusLU", lazy="noload")
    well = relationship("Wells", lazy="noload")


class MeterTypeLU(Base):
    """
    Details different meter types, but does not include parts
    - See parts table for sub-components
    """

    brand = Column(String)
    series = Column(String)
    model_number = Column(String)
    size = Column(Float)
    description = Column(String)


class MeterStatusLU(Base):
    """
    Establishes if a meter is installed, in inventory, retired, or other options as needed.
    """

    status_name = Column(String)
    description = Column(String)


class MeterActivities(Base):
    """
    Logs all meter activities
    """

    timestamp_start = Column(DateTime, nullable=False)
    timestamp_end = Column(DateTime, nullable=False)
    notes = Column(String)

    submitting_user_id = Column(Integer, ForeignKey("Users.id"))
    meter_id = Column(Integer, ForeignKey("Meters.id"), nullable=False)
    activity_type_id = Column(Integer, ForeignKey("ActivityTypeLU.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("Locations.id"), nullable=False)

    submitting_user = relationship("Users")
    meter = relationship("Meters")
    activity_type = relationship("ActivityTypeLU")
    location = relationship("Locations")
    parts_used = relationship("Parts", secondary=PartsUsed)


class ActivityTypeLU(Base):
    """
    Details the different types of activities PVACD implements
    """

    name = Column(String)
    description = Column(String)
    permission = Column(String) #Specifies who can perform this activity


class MeterObservations(Base):
    """
    Tracks all observations associated with a meter
    """

    timestamp = Column(DateTime, nullable=False)
    value = Column(Float, nullable=False)
    notes = Column(String)

    submitting_user_id = Column(Integer, ForeignKey("Users.id"))
    meter_id = Column(Integer, ForeignKey("Meters.id"), nullable=False)
    observed_property_type_id = Column(
        Integer, ForeignKey("ObservedPropertyTypeLU.id"), nullable=False
    )
    unit_id = Column(Integer, ForeignKey("Units.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("Locations.id"), nullable=False)

    submitting_user = relationship("Users")
    meter = relationship("Meters")
    observed_property = relationship("ObservedPropertyTypeLU")
    unit = relationship("Units")
    location = relationship("Locations")


class ObservedPropertyTypeLU(Base):
    """
    Defines the types of observations made during meter maintenance
    """

    name = Column(String)
    description = Column(String)
    context = Column(String) # Specifies if property associated with meter or well


class Units(Base):
    """
    Defines units used in observations
    """

    name = Column(String)
    name_short = Column(String)
    description = Column(String)


class PropertyUnits(Base):
    """
    Table linking Observed Properties to Units
    Describes which units are associated with which properties
    """
    property_id = Column(Integer, ForeignKey("ObservedPropertyTypeLU.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("Units.id"), nullable=False)

# ---------- Other Tables ---------------

class Locations(Base):
    """
    Table for tracking information about a meters location
    """

    name = Column(String, nullable=False)
    type_id = Column(Integer, ForeignKey("LocationTypeLU.id"), nullable=False)
    trss = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    township = Column(Integer)
    range = Column(Integer)
    section = Column(Integer)
    quarter = Column(Integer)
    half_quarter = Column(Integer)
    quarter_quarter = Column(Integer)
    land_owner_id = Column(Integer, ForeignKey("LandOwners.id"), nullable=False)

    land_owner = relationship("LandOwners")


    '''
    Future stuff
    #geom = Column(Geometry("POINT"))
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
    '''

    land_owner_id = Column(Integer, ForeignKey("LandOwners.id"))
    land_owner = relationship("LandOwners")

class LocationTypeLU(Base):
    '''
    Defines the type of location, such as well
    '''
    type_name = Column(String)
    description = Column(String)

class LandOwners(Base):
    """
    Organizations and people that have some relationship with a PVACD meter
    - Typically irrigators?
    """
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


# class RepairPartAssociation(Base):
#     repair_id = Column(Integer, ForeignKey("Repairs.id"))
#     part_id = Column(Integer, ForeignKey("Parts.id"))

# Not used? Now represented by a MeterActivity
# class Repairs(Base):
#     # id = Column(Integer, primary_key=True, index=True)
#     # meter_id = Column(Integer, ForeignKey('metertbl.id'))

#     timestamp = Column(DateTime, default=func.now())
#     h2o_read = Column(Float)
#     e_read = Column(String)
#     new_read = Column(String)
#     repair_description = Column(LargeBinary)
#     note = Column(LargeBinary)
#     preventative_maintenance = Column(String)
#     public_release = Column(Boolean)

#     well_id = Column(Integer, ForeignKey("Wells.id"))
#     meter_status_id = Column(Integer, ForeignKey("MeterStatusLU.id"))  # pok, np, piro
#     qc_id = Column(Integer, ForeignKey("QC.id"))
#     submitting_user_id = Column(Integer, ForeignKey("Users.id"))
#     location_id = Column(Integer, ForeignKey("Locations.id"))

#     well = relationship("Wells", uselist=False)
#     submitting_user = relationship("Users", uselist=False)
#     meter_status = relationship("MeterStatusLU", uselist=False)
#     qc = relationship("QC", uselist=False)
#     location = relationship("Locations", uselist=False)

#     @property
#     def well_name(self):
#         return self.well.name

#     @property
#     def well_location(self):
#         return self.well.location

#     @property
#     def meter_serial_number(self):
#         return self.well.meter_history.meter.serial_number

#     @property
#     def meter_status_name(self):
#         return self.meter_status.name

#     @property
#     def worker(self):
#         return self.repair_by.name

#     @worker.setter
#     def worker(self, v):
#         self.repair_by.id


# ------------ Wells --------------


class Wells(Base):
    # id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location_id = Column(Integer, ForeignKey("Locations.id"))
    ra_number = Column(String)  # RA Number is an OSE well identifier
    osepod = Column(String) #Another OSE identifier?

    location = relationship("Locations")

    #waterlevels = relationship("WellMeasurements", back_populates="well")
    #construction = relationship("WellConstructions", uselist=False)


class WellConstructions(Base):
    # id = Column(Integer, primary_key=True, index=True)
    casing_diameter = Column(Float, default=0)
    hole_depth = Column(Float, default=0)
    well_depth = Column(Float, default=0)
    well_id = Column(Integer, ForeignKey("Wells.id"))

    #screens = relationship("ScreenIntervals")
    #well = relationship("Wells")


class ScreenIntervals(Base):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    top = Column(Float)
    bottom = Column(Float)
    well_construction_id = Column(Integer, ForeignKey("WellConstructions.id"))


class WellMeasurements(Base):
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    value = Column(Float, nullable=False)

    observed_property_id = Column(
        Integer, ForeignKey("ObservedPropertyTypeLU.id"), nullable=False
    )
    submitting_user_id = Column(Integer, ForeignKey("Users.id"))
    unit_id = Column(Integer, ForeignKey("Units.id"), nullable=False)
    well_id = Column(Integer, ForeignKey("Wells.id"), nullable=False)

    #well = relationship("Wells", back_populates="waterlevels")
    #observed_property = relationship("ObservedPropertyTypeLU")


class QC(Base):
    # user_id = Column(Integer, ForeignKey("User.id"))
    timestamp = Column(DateTime, default=func.now())
    status = Column(Boolean)
