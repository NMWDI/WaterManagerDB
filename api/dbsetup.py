# # ===============================================================================
# This script builds the database from scratch and so should only be run as needed
# # ===============================================================================

import os
import api.models
from api.security import get_password_hash
from sqlalchemy import create_engine
from sqlalchemy.sql import text
from api.session import SessionLocal
from .config import settings

# Set up a connection
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

print("Setting up the database")
api.models.main_models.Base.metadata.create_all(engine)

# Add initial users, roles, and scopes
db = SessionLocal()

SecurityScopes = api.models.security_models.SecurityScopes
UserRoles = api.models.security_models.UserRoles
Users = api.models.security_models.Users

admin_scope = SecurityScopes(scope_string="admin", description="Admin-specific scope.")
meter_write_scope = SecurityScopes(
    scope_string="meter:write", description="Write meters"
)
activities_write_scope = SecurityScopes(
    scope_string="activities:write", description="Write activities"
)
well_measurements_write_scope = SecurityScopes(
    scope_string="well_measurement:write",
    description="Write well measurements, i.e. Water Levels and Chlorides",
)
reports_run_scope = SecurityScopes(
    scope_string="reports:run", description="Run reports"
)
read_scope = SecurityScopes(scope_string="read", description="Read all data.")
ose_scope = SecurityScopes(scope_string="ose", description="Scope given to the OSE")

technician_role = UserRoles(
    name="Technician",
    security_scopes=[
        read_scope,
        meter_write_scope,
        activities_write_scope,
        well_measurements_write_scope,
        reports_run_scope,
    ],
)
admin_role = UserRoles(
    name="Admin",
    security_scopes=[
        read_scope,
        meter_write_scope,
        activities_write_scope,
        well_measurements_write_scope,
        reports_run_scope,
        ose_scope,
        admin_scope,
    ],
)
ose_role = UserRoles(
    name="OSE",
    security_scopes=[read_scope, ose_scope],
)

admin_user = Users(
    full_name="NMWDI Admin",
    username="nmwdi_admin",
    email="johndoe@example.com",
    hashed_password=get_password_hash("testthisapp"),
    user_role=technician_role,
)

db.add_all(
    [
        admin_scope,
        meter_write_scope,
        activities_write_scope,
        well_measurements_write_scope,
        reports_run_scope,
        read_scope,
        ose_scope,
        technician_role,
        admin_role,
        ose_role,
        admin_user,
    ]
)

db.commit()
db.close()


# Load seed data from CSV
# Follows - https://stackoverflow.com/questions/31394998/using-sqlalchemy-to-load-csv-file-into-a-database
# Get the psycopg2 connector - enables running of lower level functions
conn = engine.raw_connection()
cursor = conn.cursor()

with open("../PVACDdb_migration/csv_data/tables/metertypes.csv", "r") as f:
    qry = 'COPY "MeterTypeLU"(id,brand,series,model_number,size,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/NoteTypeLU.csv", "r") as f:
    qry = 'COPY "NoteTypeLU"(id,note,details,slug) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/ServiceTypeLU.csv", "r") as f:
    qry = 'COPY "ServiceTypeLU"(id,service_name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/landowners.csv", "r") as f:
    qry = 'COPY "LandOwners"(organization,address,city,state,zip,phone,mobile,note,id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/meterstatus.csv", "r") as f:
    qry = 'COPY "MeterStatusLU"(id,status_name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/observedproperties.csv", "r") as f:
    qry = 'COPY "ObservedPropertyTypeLU"(id,name,description,context) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/units.csv", "r") as f:
    qry = 'COPY "Units"(id,name,name_short,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/propertyunits.csv", "r") as f:
    qry = 'COPY "PropertyUnits"(property_id,unit_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/locationtypeLU.csv", "r") as f:
    qry = 'COPY "LocationTypeLU"(id,type_name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/locations.csv", "r") as f:
    qry = 'COPY "Locations"(id,name,type_id,latitude,longitude,trss) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/welluseLU.csv", "r") as f:
    qry = 'COPY "WellUseLU"(id,use_type,code,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/wells.csv", "r") as f:
    qry = 'COPY "Wells"(id,name,use_type_id,location_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/meters.csv", "r") as f:
    qry = 'COPY "Meters"(serial_number,meter_type_id,status_id,location_id,well_id,id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/activities.csv", "r") as f:
    qry = 'COPY "ActivityTypeLU"(id,name,description,permission) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open(
    "../PVACDdb_migration/csv_data/testing/devdata_wellMeasurement.csv", "r"
) as f:
    qry = 'COPY "WellMeasurements"(timestamp,value,well_id,observed_property_id,submitting_user_id,unit_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/parttypeLU.csv", "r") as f:
    qry = 'COPY "PartTypeLU"(id,name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/parts.csv", "r") as f:
    qry = 'COPY "Parts"(id,part_number,part_type_id,description,count,note) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

with open("../PVACDdb_migration/csv_data/tables/partsassociated.csv", "r") as f:
    qry = 'COPY "PartAssociation"(meter_type_id,part_id,commonly_used) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    cursor.copy_expert(qry, f)

# Only load the following for local testing
testing = False
if testing:
    with open("api/data/testdata_users.csv", "r") as f:
        qry = 'COPY "Users"(id, username, full_name, email, hashed_password, disabled, user_role_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

        # with open("api/data/testdata_meterobservations.csv", "r") as f:
        #     qry = 'COPY "MeterObservations"(timestamp, value, notes, submitting_user_id, meter_id, observed_property_type_id, unit_id, location_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        #     cursor.copy_expert(qry, f)

        # with open("api/data/testdata_meteractivities.csv", "r") as f:
        #     qry = 'COPY "MeterActivities"(id, timestamp_start, timestamp_end, notes, submitting_user_id, meter_id, activity_type_id, location_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        #     cursor.copy_expert(qry, f)

        # with open("api/data/testdata_partsused.csv", "r") as f:
        #     qry = 'COPY "PartsUsed"(meter_activity_id, part_id, count) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        #     cursor.copy_expert(qry, f)

        with open("api/data/devdata_chloridemeasurements.csv", "r") as f:
            qry = 'COPY "WellMeasurements"(timestamp,value,well_id,observed_property_id,submitting_user_id,unit_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
            cursor.copy_expert(qry, f)

# Create geometries from location lat longs
cursor.execute('update "Locations" set geom = ST_MakePoint(longitude,latitude)')

conn.commit()
conn.close()


# SQL for activity type security scopes if we ever decide to go that route
# INSERT INTO "SecurityScopes" (scope_string, description)
# VALUES
# 	('activities:install', 'Submit install activities'),
# 	('activities:uninstall', 'Submit install activities'),
# 	('activities:general_maintenance', 'Submit general maintenance activities'),
# 	('activities:preventative_maintenance', 'Submit preventative maintenance activities'),
# 	('activities:repair', 'Submit repair activities'),
# 	('activities:rate_meter', 'Submit rate meter activities'),
# 	('activities:sell', 'Submit sell activities'),
# 	('activities:scrap', 'Submit scrap activities');

# INSERT INTO "ScopesRoles" (security_scope_id, user_role_id)
# VALUES
# 	(7, 2),
# 	(8, 2),
# 	(9, 2),
# 	(10, 2),
# 	(11, 2),
# 	(12, 2),
# 	(13, 2),
# 	(14, 2),
# 	(7, 1),
# 	(8, 1),
# 	(9, 1),
# 	(10, 1),
# 	(11, 1),
# 	(12, 1);
