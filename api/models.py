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

from sqlalchemy import Column, Integer, String, ForeignKeyConstraint, ForeignKey, Float, BLOB, DateTime, LargeBinary, \
    func, Boolean
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.orm import relationship


@as_declarative()
class Base:
    id: Any
    __name__: str

    # to generate tablename from classname
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


class Meter(Base):
    __tablename__ = 'metertbl'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    serial_year = Column(Integer)
    serial_case_diameter = Column(Integer)
    serial_id = Column(Integer)

    deployed = Column(Boolean)

    # well = relationship('Well', back_populates='meter')

    @property
    def serial_number(self):
        print('asdfasdf', self.serial_year)
        return f'{self.serial_year}-{self.serial_case_diameter}-{self.serial_id}'


class MeterHistory(Base):
    __tablename__ = 'meterhistorytbl'
    id = Column(Integer, primary_key=True, index=True)

    well_id = Column(Integer, ForeignKey('welltbl.id'))
    meter_id = Column(Integer, ForeignKey('metertbl.id'))
    timestamp = Column(DateTime, default=func.now())
    note = Column(LargeBinary)

    meter = relationship('Meter', uselist=False)


class Well(Base):
    __tablename__ = 'welltbl'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    township = Column(Integer)
    range = Column(Integer)
    section = Column(Integer)
    quarter = Column(Integer)
    half_quarter = Column(Integer)
    quarter_quarter = Column(Integer)

    latitude = Column(Float)
    longitude = Column(Float)

    owner_id = Column(Integer, ForeignKey('ownertbl.id'))
    osepod = Column(String)

    # meter = relationship('Meter', uselist=False, back_populates='well')
    owner = relationship('Owner', back_populates='wells')
    readings = relationship('Reading', back_populates='well')

    meter_history = relationship('MeterHistory', uselist=False)

    @property
    def location(self):
        return f'{self.township}.{self.range}.{self.section}.{self.quarter}.{self.half_quarter}'


class Reading(Base):
    __tablename__ = 'readingtbl'
    id = Column(Integer, primary_key=True, index=True)
    value = Column(Float)
    eread = Column(String)
    repair = Column(LargeBinary)
    timestamp = Column(DateTime)
    well_id = Column(Integer, ForeignKey('welltbl.id'))

    well = relationship('Well', back_populates='readings')


class Owner(Base):
    __tablename__ = 'ownertbl'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    wells = relationship('Well', back_populates='owner')


class Worker(Base):
    __tablename__ = 'workertbl'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class MeterStatusLU(Base):
    __tablename__ = 'meterstatus_lutbl'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)


class Repair(Base):
    __tablename__ = 'repairtbl'
    id = Column(Integer, primary_key=True, index=True)
    # meter_id = Column(Integer, ForeignKey('metertbl.id'))
    well_id = Column(Integer, ForeignKey('welltbl.id'))
    worker_id = Column(Integer, ForeignKey('workertbl.id'))

    timestamp = Column(DateTime, default=func.now())
    h2o_read = Column(Float)
    e_read = Column(String)
    new_read = Column(String)
    repair_description = Column(LargeBinary)
    note = Column(LargeBinary)
    meter_status_id = Column(Integer, ForeignKey('meterstatus_lutbl.id'))  # pok, np, piro
    preventative_maintenance = Column(String)

    well = relationship('Well', uselist=False)
    repair_by = relationship('Worker', uselist=False)
    meter_status = relationship('MeterStatusLU', uselist=False)

    @property
    def well_name(self):
        return self.well.name

    @property
    def well_location(self):
        return self.well.location

    @property
    def meter_serialnumber(self):
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
