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

from sqlalchemy import Column, Integer, String, ForeignKeyConstraint, ForeignKey, Float, BLOB, DateTime, LargeBinary
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
    serialnumber = Column(String)

    well = relationship('Well', back_populates='meter')


class Well(Base):
    __tablename__ = 'welltbl'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    owner_id = Column(Integer, ForeignKey('ownertbl.id'))
    meter_id = Column(Integer, ForeignKey('metertbl.id'), nullable=True)
    osepod = Column(String)

    meter = relationship('Meter', uselist=False, back_populates='well')
    owner = relationship('Owner', back_populates='wells')
    readings = relationship('Reading', back_populates='well')


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


class Repair(Base):
    __tablename__= 'repairtbl'
    id = Column(Integer, primary_key=True, index=True)
    meter_id = Column(Integer, ForeignKey('metertbl.id'))
    well_id = Column(Integer, ForeignKey('welltbl.id'))
    worker_id = Column(Integer, ForeignKey('workertbl.id'))

    timestamp = Column(DateTime)
    h2o_read = Column(Float)
    e_read = Column(String)
    new_read = Column(String)
    repair_description = Column(LargeBinary)
    note = Column(LargeBinary)

    meter = relationship('Meter', uselist=False)

# ============= EOF =============================================
