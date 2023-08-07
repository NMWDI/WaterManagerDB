'''
Configures the database connection
Can be local or remote

Before using set an environmental variable APPDB_ENV to the name of the environment file to use.
.env_dev - remote development database
.env_local - local development database
.env_production - production database

'''

import os
from dotenv import load_dotenv

from pathlib import Path

env_path = Path("api") / os.getenv("APPDB_ENV")
load_dotenv(dotenv_path=env_path)


class Settings:

    POSTGRES_USER: str = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", 5432)  # default postgres port is 5432
    POSTGRES_DB: str = os.getenv("POSTGRES_DB")
    DATABASE_URL = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"


settings = Settings()
# ============= EOF =============================================
