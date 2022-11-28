:: A batch file to quickly set environmental variables
@echo off
set POSTGRES_USER=docker
set POSTGRES_PASSWORD=docker
set POSTGRES_SERVER=db
set POSTGRES_PORT=5432
set POSTGRES_DB=gis

:: Uncomment these to initially populate database
:: set SETUP_DB=1
:: set POPULATE_DB=1