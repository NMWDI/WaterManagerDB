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

# Create all models if environmental var set
# Note: create_all checks for existance of the table first. So it will only add a table if it doesn't exist.
#       if the table is changed the database will need to be created new.
if os.environ.get("SETUP_DB"):
    print("Setting up the database")
    api.models.main_models.Base.metadata.create_all(engine)

# Load development data from CSV
# Follows - https://stackoverflow.com/questions/31394998/using-sqlalchemy-to-load-csv-file-into-a-database
if os.environ.get("POPULATE_DB"):
    # Get the psycopg2 connector - enables running of lower level functions
    conn = engine.raw_connection()
    cursor = conn.cursor()

    # Load meter types CSV
    with open("api/data/devdata_metertypes.csv", "r") as f:
        qry = 'COPY "MeterTypeLU"(id,brand,series,model_number,size,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/landowners.csv", "r") as f:
        qry = 'COPY "LandOwners"(organization,address,city,state,zip,phone,mobile,note,id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_meterstatus.csv", "r") as f:
        qry = 'COPY "MeterStatusLU"(id,status_name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_observedproperties.csv", "r") as f:
        qry = 'COPY "ObservedPropertyTypeLU"(id,name,description,context) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_units.csv", "r") as f:
        qry = 'COPY "Units"(id,name,name_short,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_propertyunits.csv", "r") as f:
        qry = 'COPY "PropertyUnits"(property_id,unit_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/meters.csv", "r") as f:
        qry = 'COPY "Meters"(id,serial_number,old_contact_name,tag,meter_type_id,status_id,location_id,well_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_locationtypeLU.csv", "r") as f:
        qry = 'COPY "LocationTypeLU"(id,type_name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/locations.csv", "r") as f:
        qry = 'COPY "Locations"(id,name,type_id,trss,latitude,longitude,owner_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_activities.csv", "r") as f:
        qry = 'COPY "ActivityTypeLU"(name,description,permission) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_workers.csv", "r") as f:
        qry = 'COPY "Technicians"(id,name) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/wells.csv", "r") as f:
        qry = 'COPY "Wells"(id,name,ra_number,location_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_wellMeasurement.csv", "r") as f:
        qry = 'COPY "WellMeasurements"(timestamp,value,well_id,observed_property_id,technician_id,unit_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_parttypeLU.csv", "r") as f:
        qry = 'COPY "PartTypeLU"(name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_parts.csv", "r") as f:
        qry = 'COPY "Parts"(id,part_number,part_type_id,description,count,note) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_partsassociated.csv", "r") as f:
        qry = 'COPY "PartAssociation"(meter_type_id,part_id,commonly_used) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/testdata_meterobservations.csv", "r") as f:
        qry = 'COPY "MeterObservations"(timestamp, value, notes, technician_id, meter_id, observed_property_id, unit_id, location_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/testdata_meteractivities.csv", "r") as f:
        qry = 'COPY "MeterActivities"(timestamp_start, timestamp_end, notes, technician_id, meter_id, activity_type_id, location_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/testdata_partsused.csv", "r") as f:
        qry = 'COPY "PartsUsed"(meter_activity_id, part_id, count) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    conn.commit()
    conn.close()

    # Add users, roles, and scopes for testing
    db = SessionLocal()

    SecurityScopes = api.models.security_models.SecurityScopes
    UserRoles = api.models.security_models.UserRoles
    Users = api.models.security_models.Users

    admin_scope = SecurityScopes(
        scope_string="admin", description="Admin-specific scope."
    )
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
            admin_scope,
        ],
    )

    technician_user = Users(
        full_name="Technician User",
        username="test",
        email="johndoe@example.com",
        hashed_password=get_password_hash("secret"),
        user_role=technician_role,
    )

    admin_user = Users(
        full_name="Admin User",
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("secret"),
        user_role=admin_role,
    )

    db.add_all(
        [
            admin_scope,
            meter_write_scope,
            activities_write_scope,
            well_measurements_write_scope,
            reports_run_scope,
            read_scope,
            technician_role,
            admin_role,
            technician_user,
            admin_user,
        ]
    )

    # Temporary fix to give locations to meters, until a new meters seeder is created
    db.execute(text('UPDATE "Meters" SET meter_location_id=1'))

    db.commit()
    db.close()
