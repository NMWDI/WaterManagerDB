# # ===============================================================================
# This script builds the database from scratch and so should only be run as needed
# # ===============================================================================

import os
import api.models
import api.security_models
from api.security import get_password_hash
from sqlalchemy import create_engine
from api.session import SessionLocal
from .config import settings

#Set up a connection
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

#Create all models if environmental var set
# Note: create_all checks for existance of the table first. So it will only add a table if it doesn't exist.
#       if the table is changed the database will need to be created new.
if os.environ.get("SETUP_DB"):
    print('Setting up the database')
    api.models.Base.metadata.create_all(engine)

#Load development data from CSV
# Follows - https://stackoverflow.com/questions/31394998/using-sqlalchemy-to-load-csv-file-into-a-database
if os.environ.get("POPULATE_DB"):
    
    #Get the psycopg2 connector - enables running of lower level functions
    conn = engine.raw_connection()
    cursor = conn.cursor()

    #Load meter types CSV
    with open('api/data/devdata_metertypes.csv','r') as f:
        qry = 'COPY "MeterTypes"(id,brand,model) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_contacts.csv','r') as f:
        qry = 'COPY "Contacts"(id,organization,phone,name) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_meters.csv','r') as f:
        qry = 'COPY "Meters"(serial_number,tag,meter_type_id,contact_id,ra_number) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_activities.csv','r') as f:
        qry = 'COPY "Activities"(id,name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_workers.csv','r') as f:
        qry = 'COPY "Worker"(id,name) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_meterhistory.csv','r') as f:
        qry = 'COPY "MeterHistory"(meter_id,timestamp,activity_id,energy_reading,description,initial_reading,final_reading,technician_id,note) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    #Add a user for testing
    db = SessionLocal()
    db.add(
        api.security_models.User(
            full_name="Test User",
            username="test",
            email="johndoe@example.com",
            hashed_password=get_password_hash("secret"),
        )
    )
    db.commit()
    db.close()
    


