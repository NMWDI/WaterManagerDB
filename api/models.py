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
    id: Any
    __name__: str

    # to generate tablename from classname
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__


class Alert(Base):
    id = Column(Integer, primary_key=True, index=True)
    alert = Column(String)
    meter_id = Column(Integer, ForeignKey("Meter.id"))
    open_timestamp = Column(DateTime, default=func.now())
    closed_timestamp = Column(DateTime)

    meter = relationship("Meter", uselist=False)

    @property
    def meter_serial_number(self):
        return self.meter.serial_number

    @property
    def active(self):
        return not bool(self.closed_timestamp)


class Meter(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    serial_year = Column(Integer)
    serial_case_diameter = Column(Integer)
    serial_id = Column(Integer)

    # well = relationship('Well', back_populates='meter')

    @property
    def serial_number(self):
        return f"{self.serial_year}-{self.serial_case_diameter}-{self.serial_id}"


class MeterHistory(Base):
    id = Column(Integer, primary_key=True, index=True)

    well_id = Column(Integer, ForeignKey("Well.id"))
    meter_id = Column(Integer, ForeignKey("Meter.id"))
    timestamp = Column(DateTime, default=func.now())
    note = Column(LargeBinary)

    meter = relationship("Meter", uselist=False)


class Well(Base):
    id = Column(Integer, primary_key=True, index=True)
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

    owner_id = Column(Integer, ForeignKey("Owner.id"))
    osepod = Column(String)

    # meter = relationship('Meter', uselist=False, back_populates='well')
    owner = relationship("Owner", back_populates="wells")
    waterlevels = relationship("WaterLevel", back_populates="well")

    meter_history = relationship("MeterHistory", uselist=False)
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
    id = Column(Integer, primary_key=True, index=True)
    casing_diameter = Column(Float, default=0)
    hole_depth = Column(Float, default=0)
    well_depth = Column(Float, default=0)
    well_id = Column(Integer, ForeignKey("Well.id"))

    screens = relationship('ScreenInterval')


class ScreenInterval(Base):
    id = Column(Integer, primary_key=True, index=True)
    top = Column(Float)
    bottom = Column(Float)
    well_construction_id = Column(Integer, ForeignKey("WellConstruction.id"))


class WaterLevel(Base):
    id = Column(Integer, primary_key=True, index=True)
    value = Column(Float)
    timestamp = Column(DateTime, default=func.now())
    well_id = Column(Integer, ForeignKey("Well.id"))

    well = relationship("Well", back_populates="waterlevels")


class Owner(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    email = Column(String)

    wells = relationship("Well", back_populates="owner")


class Worker(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class MeterStatusLU(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)


class Repair(Base):
    id = Column(Integer, primary_key=True, index=True)
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

    well = relationship("Well", uselist=False)
    repair_by = relationship("Worker", uselist=False)
    meter_status = relationship("MeterStatusLU", uselist=False)

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

# ============= EOF =============================================
