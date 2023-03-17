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
    
    #Add some data to blank database
    
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

    #Add some supporting properties
    db.add(api.models.ObservedProperty(
        name="depthtowater",
        description="Depth in feet below ground surface to water surface"
        )
    )
    db.add(api.models.ObservedProperty(name="chloride"))

    db.commit()
    db.close()
    
    #Get the psycopg2 connector - enables running of lower level functions
    conn = engine.raw_connection()
    cursor = conn.cursor()

    #Load meter types CSV
    with open('api/data/devdata_metertypes.csv','r') as f:
        qry = 'COPY "MeterTypes"(id,brand,model,size) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_contacts.csv','r') as f:
        qry = 'COPY "Contacts"(id,organization,phone,name) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_meterstatus.csv','r') as f:
        qry = 'COPY "MeterStatusLU"(id,status_name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_meters.csv','r') as f:
        qry = 'COPY "Meters"(serial_number,tag,meter_type_id,contact_id,status_id,ra_number,latitude,longitude,trss,notes) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_activities.csv','r') as f:
        qry = 'COPY "Activities"(name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_workers.csv','r') as f:
        qry = 'COPY "Worker"(id,name) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    # with open('api/data/devdata_meterhistory.csv','r') as f:
    #     qry = 'COPY "MeterHistory"(meter_id,timestamp,activity_id,energy_reading,description,initial_reading,final_reading,technician_id,note) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
    #     cursor.copy_expert(qry,f)
    #     conn.commit()

    with open('api/data/devdata_well.csv','r') as f:
        qry = 'COPY "Well"(id,name) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_wellMeasurement.csv','r') as f:
        qry = 'COPY "WellMeasurement"(timestamp,value,well_id,observed_property_id,worker_id) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_parttypeLU.csv','r') as f:
        qry = 'COPY "PartTypeLU"(name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_parts.csv','r') as f:
        qry = 'COPY "Part"(part_number,part_type_id,description,count,note) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_observedproperties.csv','r') as f:
        qry = 'COPY "ObservedProperties"(name,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    with open('api/data/devdata_units.csv','r') as f:
        qry = 'COPY "Units"(name,name_short,description) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)'
        cursor.copy_expert(qry,f)
        conn.commit()

    
    


