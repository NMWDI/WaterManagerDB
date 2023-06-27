# # ===============================================================================
# This script builds the database from scratch and so should only be run as needed
# # ===============================================================================

import os
import api.models
from api.security import get_password_hash
from sqlalchemy import create_engine
from api.session import SessionLocal
from .config import settings

# Set up a connection
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create all models if environmental var set
# Note: create_all checks for existance of the table first. So it will only add a table if it doesn't exist.
#       if the table is changed the database will need to be created new.
if os.environ.get("SETUP_DB"):
    print('Setting up the database')
    api.models.main_models.Base.metadata.create_all(engine)

# Load development data from CSV
# Follows - https://stackoverflow.com/questions/31394998/using-sqlalchemy-to-load-csv-file-into-a-database
if os.environ.get("POPULATE_DB"):
    # Get the psycopg2 connector - enables running of lower level functions
    conn = engine.raw_connection()
    cursor = conn.cursor()

    # Load meter types CSV
    with open("api/data/devdata_metertypes.csv", "r") as f:
        qry = 'COPY "MeterTypes"(id,brand,series,model_number,size,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_contacts.csv", "r") as f:
        qry = 'COPY "Organizations"(id,organization_name,phone,city) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_meterstatus.csv", "r") as f:
        qry = 'COPY "MeterStatusLU"(id,status_name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_observedproperties.csv", "r") as f:
        qry = 'COPY "ObservedProperties"(id,name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_units.csv", "r") as f:
        qry = 'COPY "Units"(id,name,name_short,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_propertyunits.csv", "r") as f:
        qry = 'COPY "PropertyUnits"(property_id,unit_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_meters.csv", "r") as f:
        qry = 'COPY "Meters"(serial_number,tag,meter_type_id,organization_id,status_id,contact_name,contact_phone,ra_number,latitude,longitude,trss,notes) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_activities.csv", "r") as f:
        qry = 'COPY "Activities"(name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_workers.csv", "r") as f:
        qry = 'COPY "Worker"(id,name) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_well.csv", "r") as f:
        qry = 'COPY "Well"(id,name) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_wellMeasurement.csv", "r") as f:
        qry = 'COPY "WellMeasurement"(timestamp,value,well_id,observed_property_id,worker_id,unit_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_parttypeLU.csv", "r") as f:
        qry = 'COPY "PartTypeLU"(name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_parts.csv", "r") as f:
        qry = 'COPY "Part"(id,part_number,part_type_id,description,count,note) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    with open("api/data/devdata_partsassociated.csv", "r") as f:
        qry = 'COPY "PartAssociation"(meter_type_id,part_id,commonly_used) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry, f)

    conn.commit()
    conn.close()

    # Add users, roles, and scopes for testing
    db = SessionLocal()

    SecurityScopes = api.models.security_models.SecurityScopes
    UserRoles = api.models.security_models.UserRoles
    User = api.models.security_models.User

    admin_scope = SecurityScopes(scope_string="admin", description="Admin-specific scope.")
    meter_write_scope = SecurityScopes(scope_string="meter:write", description="Write meters")
    activities_write_scope = SecurityScopes(scope_string="activities:write", description="Write activities")
    well_measurements_write_scope = SecurityScopes(scope_string="well_measurement:write", description="Write well measurements, i.e. Water Levels and Chlorides")
    reports_run_scope = SecurityScopes(scope_string="reports:run", description="Run reports")
    read_scope = SecurityScopes(scope_string="read", description="Read all data.")

    technician_role = UserRoles(name="Technician", security_scopes=[read_scope, meter_write_scope, activities_write_scope, well_measurements_write_scope, reports_run_scope])
    admin_role = UserRoles(name="Admin", security_scopes=[read_scope, meter_write_scope, activities_write_scope, well_measurements_write_scope, reports_run_scope, admin_scope])

    technician_user = User(
        full_name="Technician User",
        username="test",
        email="johndoe@example.com",
        hashed_password=get_password_hash("secret"),
        user_role=technician_role
    )

    admin_user = User(
        full_name="Admin User",
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("secret"),
        user_role=admin_role
    )

    db.add_all([admin_scope, meter_write_scope, activities_write_scope, well_measurements_write_scope, reports_run_scope, read_scope, technician_role, admin_role, technician_user, admin_user])

    db.commit()
    db.close()
