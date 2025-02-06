import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/appdb_local")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    """Creates database tables if they do not exist."""
    Base.metadata.create_all(engine)
