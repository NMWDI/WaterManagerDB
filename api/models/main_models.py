from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float,
    DateTime,
    func,
    Boolean,
    Table,
)
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape


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
    """
    The types of parts
    """

    name = Column(String)
    description = Column(String)


# Association table that links meter types and their commonly used parts
PartAssociation = Table(
    "PartAssociation",
    Base.metadata,
    Column("part_id", ForeignKey("Parts.id"), nullable=False),
    Column("meter_type_id", ForeignKey("MeterTypeLU.id"), nullable=False),
)


class Parts(Base):
    """
    All parts
    """

    part_number = Column(String, unique=True, nullable=False)
    description = Column(String)
    vendor = Column(String)
    count = Column(Integer, default=0)
    note = Column(String)
    in_use = Column(Boolean, nullable=False, default=True)
    commonly_used = Column(Boolean, nullable=False, default=False)

    part_type_id = Column(Integer, ForeignKey("PartTypeLU.id"), nullable=False)

    part_type = relationship("PartTypeLU")

    # The meter types associated with this part
    meter_types = relationship("MeterTypeLU", secondary="PartAssociation")


# Association table that links parts and the meter activity they were used on
PartsUsed = Table(
    "PartsUsed",
    Base.metadata,
    Column("meter_activity_id", ForeignKey("MeterActivities.id"), nullable=False),
    Column("part_id", ForeignKey("Parts.id"), nullable=False),
)


class ServiceTypeLU(Base):
    """
    Describes the type of service performed during an activity
    """

    service_name = Column(String)
    description = Column(String)


# Association table that links meter activities and the services that were performed during
ServicesPerformed = Table(
    "ServicesPerformed",
    Base.metadata,
    Column("meter_activity_id", ForeignKey("MeterActivities.id"), nullable=False),
    Column("service_type_id", ForeignKey("ServiceTypeLU.id"), nullable=False),
)


class NoteTypeLU(Base):
    """
    Pre-defined notes that can be set on activities
    """

    note = Column(String)
    details = Column(String)

    # Either one of the special 3 slugs that represent the working status of a meter or null
    # working | not-working | not-checked | null
    slug = Column(String)


# Association table that links notes and the meter activity they were added to
Notes = Table(
    "Notes",
    Base.metadata,
    Column("meter_activity_id", ForeignKey("MeterActivities.id"), nullable=False),
    Column("note_type_id", ForeignKey("NoteTypeLU.id"), nullable=False),
)

# ---------  Meter Related Tables ---------


class Meters(Base):
    """
    Primary table for tracking meters
    """

    serial_number = Column(String, nullable=False)
    contact_name = Column(String)  # Contact information specific to particular meter
    contact_phone = Column(String)
    notes = Column(String)

    meter_type_id = Column(Integer, ForeignKey("MeterTypeLU.id"), nullable=False)
    status_id = Column(Integer, ForeignKey("MeterStatusLU.id"), nullable=False)
    well_id = Column(Integer, ForeignKey("Wells.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("Locations.id"), nullable=False)

    meter_type = relationship("MeterTypeLU")
    status = relationship("MeterStatusLU")
    well = relationship("Wells")
    location = relationship("Locations")


class MeterTypeLU(Base):
    """
    Meter types
    """

    brand = Column(String)
    series = Column(String)
    model_number = Column(String)
    size = Column(Float)
    description = Column(String)
    in_use = Column(Boolean, nullable=False)

    # parts = relationship("Parts", secondary="PartAssociation")


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
    description = Column(String)

    submitting_user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    meter_id = Column(Integer, ForeignKey("Meters.id"), nullable=False)
    activity_type_id = Column(Integer, ForeignKey("ActivityTypeLU.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("Locations.id"), nullable=False)

    submitting_user = relationship("Users")
    meter = relationship("Meters")
    activity_type = relationship("ActivityTypeLU")
    location = relationship("Locations")

    parts_used = relationship("Parts", secondary=PartsUsed)
    services_performed = relationship("ServiceTypeLU", secondary=ServicesPerformed)
    notes = relationship("NoteTypeLU", secondary=Notes)


class ActivityTypeLU(Base):
    """
    Details the different types of activities PVACD implements
    """

    name = Column(String)
    description = Column(String)

    # Specifies who can perform this activity (must be either 'technician' or 'admin')
    # If admin, only admins can perform, if technician then technician or admin can perform
    permission = Column(String)


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
    Defines the types of observations made on a meter
    """

    name = Column(String)
    description = Column(String)
    context = Column(String)  # Specifies if property associated with 'meter' or 'well'

    # The units that can be used on this property type
    units = relationship("Units", secondary="PropertyUnits")


class Units(Base):
    """
    Defines units used in observations
    """

    name = Column(String)
    name_short = Column(String)
    description = Column(String)


# Association table that links observed property types and their appropriate units
PropertyUnits = Table(
    "PropertyUnits",
    Base.metadata,
    Column("property_id", ForeignKey("ObservedPropertyTypeLU.id"), nullable=False),
    Column("unit_id", ForeignKey("Units.id"), nullable=False),
)

# ---------- Other Tables ---------------


class Locations(Base):
    """
    Table for tracking information about a well's location
    """

    name = Column(String)
    trss = Column(String)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    township = Column(Integer)
    range = Column(Integer)
    section = Column(Integer)
    quarter = Column(Integer)
    half_quarter = Column(Integer)
    quarter_quarter = Column(Integer)
    # geom = Column(Geometry("POINT")) # SQLAlchemy/FastAPI has some issue sending this

    type_id = Column(Integer, ForeignKey("LocationTypeLU.id"), nullable=False)
    land_owner_id = Column(Integer, ForeignKey("LandOwners.id"))

    land_owner = relationship("LandOwners")
    type = relationship("LocationTypeLU")

    @property
    def lat(self):
        try:
            return to_shape(self.geom).y
        except BaseException:
            return

    @property
    def long(self):
        try:
            return to_shape(self.geom).x
        except BaseException:
            return

    @property
    def location(self):
        return f"{self.township}.{self.range}.{self.section}.{self.quarter}.{self.half_quarter}"


class LocationTypeLU(Base):
    """
    Defines the type of location, such as well
    """

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


# Not used
class Alerts(Base):
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


# ------------ Wells --------------


class WellUseLU(Base):
    """
    The type of well
    """

    use_type = Column(String, nullable=False)
    code = Column(String)
    description = Column(String)


class Wells(Base):
    """
    All wells
    """

    name = Column(String)
    ra_number = Column(String)  # RA Number is an OSE well identifier
    owners = Column(String)

    use_type_id = Column(Integer, ForeignKey("WellUseLU.id"))
    location_id = Column(Integer, ForeignKey("Locations.id"))

    use_type = relationship("WellUseLU")
    location = relationship("Locations")


class WellMeasurements(Base):
    """
    The measurements made on a monitored well
    """

    timestamp = Column(DateTime, default=func.now(), nullable=False)
    value = Column(Float, nullable=False)

    observed_property_id = Column(
        Integer, ForeignKey("ObservedPropertyTypeLU.id"), nullable=False
    )
    submitting_user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("Units.id"), nullable=False)
    well_id = Column(Integer, ForeignKey("Wells.id"), nullable=False)

    observed_property = relationship("ObservedPropertyTypeLU")
    submitting_user = relationship("Users")
    unit = relationship("Units")
    well = relationship("Wells")

    submitting_user = relationship("Users")
