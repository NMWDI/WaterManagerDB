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
import os
from datetime import datetime, timedelta

from api.security import get_password_hash
from api.security_models import User
from api.models import (
    Base,
    Meter,
    Well,
    Owner,
    Worker,
    Repair,
    MeterStatusLU,
    MeterHistory,
    Alert,
    WellConstruction,
    ScreenInterval,
    WellMeasurement,
    ObservedProperty,
)
from api.session import SessionLocal


def setup_db(eng, db=None, populate_db=False):
    if not os.environ.get("POPULATE_DB"):
        Base.metadata.create_all(bind=eng)
        return
    else:
        Base.metadata.drop_all(bind=eng)
        Base.metadata.create_all(bind=eng)

    if db is None:
        db = SessionLocal()

    # build meter status lookup
    db.add(MeterStatusLU(name="POK", description="Pump OK"))
    db.add(MeterStatusLU(name="NP", description="Not Pumping"))
    db.add(MeterStatusLU(name="PIRO", description="Pump ON, Register Off"))
    db.commit()

    # add meters
    db.add(Meter(name="moo", serial_year=1992, serial_id=1234, serial_case_diameter=4))
    db.add(Meter(name="tor", serial_year=1992, serial_id=2235, serial_case_diameter=4))
    db.add(Meter(name="hag", serial_year=1992, serial_id=3236, serial_case_diameter=4))

    # add alert
    db.add(Alert(meter_id=1, alert="foo bar alert"))
    # add owners
    db.add(Owner(name="Guy & Jackson"))
    db.add(Owner(name="Spencer"))

    # add workers
    for name in ("Default", "Buster", "Alice"):
        db.add(Worker(name=name))

    db.commit()

    # add wells
    db.add(
        Well(
            name="bar",
            owner_id=1,
            township=100,
            range=10,
            section=4,
            quarter=4,
            half_quarter=3,
            osepod="RA-1237-123",
            # latitude=34,
            # longitude=-106,
            geom="POINT (-106 34)",
        )
    )
    db.add(
        Well(
            name="bag",
            owner_id=2,
            township=100,
            range=10,
            section=4,
            quarter=2,
            half_quarter=1,
            osepod="RA-1234-123",
            # latitude=35.5,
            # longitude=-105.1,
            geom="POINT (-105.1 35.5)",
        )
    )
    db.add(
        Well(
            name="bat",
            owner_id=1,
            township=100,
            range=10,
            section=4,
            quarter=3,
            half_quarter=2,
            osepod="RA-1234-123",
            # latitude=36,
            # longitude=-105.5,
            geom="POINT (-105.5 36)",
        )
    )
    db.commit()

    # add meter history
    db.add(MeterHistory(well_id=1, meter_id=1))
    db.add(MeterHistory(well_id=2, meter_id=2))
    db.add(MeterHistory(well_id=3, meter_id=3))

    db.add(
        Repair(
            worker_id=1,
            well_id=1,
            h2o_read=638.831,
            e_read="E 2412341",
            meter_status_id=1,
            preventative_maintenance="",
            repair_description="""Gasket for saddle
grease bearing
PREV MAINT
Working on Arrivial""".encode(
                "utf8"
            ),
            note="""DIST 107" DISCHG 100%""".encode("utf8"),
            timestamp=datetime.now(),
        )
    )

    db.add(
        Repair(
            worker_id=1,
            timestamp=datetime.now() - timedelta(days=365),
            well_id=1,
            h2o_read=638000.831,
            e_read="E 241da2341",
            meter_status_id=1,
            preventative_maintenance="",
            repair_description="""a
    Working on Arrivial""".encode(
                "utf8"
            ),
            note="""DIST 107" DISCHG 100%""".encode("utf8"),
        )
    )
    db.add(
        Repair(
            worker_id=1,
            timestamp=datetime.now() - timedelta(days=2 * 365),
            well_id=2,
            h2o_read=300.831,
            e_read="E 241da2341",
            meter_status_id=1,
            preventative_maintenance="",
            repair_description="""
        Working on Arrivial""".encode(
                "utf8"
            ),
            note="""DIST 107" DISCHG 100%""".encode("utf8"),
        )
    )
    db.add(
        Repair(
            worker_id=3,
            timestamp=datetime.now() - timedelta(days=2 * 360),
            well_id=3,
            h2o_read=8002.22,
            e_read="E 341",
            meter_status_id=1,
            preventative_maintenance="",
            repair_description="""
            Working on Arrivial""".encode(
                "utf8"
            ),
            note="""DIST 107" DISCHG 100%""".encode("utf8"),
        )
    )
    db.add(ObservedProperty(name="groundwaterlevel"))
    db.add(ObservedProperty(name="chloride"))

    db.commit()
    db.add(
        WellMeasurement(
            well_id=1, timestamp=datetime.now(), value=0.12, observed_property_id=1
        )
    )
    db.add(
        WellMeasurement(
            well_id=1, timestamp=datetime.now(), value=1234, observed_property_id=2
        )
    )

    db.add(WellConstruction(well_id=1))
    db.commit()

    db.add(ScreenInterval(well_construction_id=1, top=10, bottom=20))
    db.commit()

    db.add(
        User(
            full_name="john doe",
            username="jd",
            email="johndoe@example.com",
            hashed_password=get_password_hash("secret"),
        )
    )
    db.commit()
    db.close()


# ============= EOF =============================================
