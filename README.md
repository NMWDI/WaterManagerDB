# WaterManagerDB

[![Unittests](https://github.com/NMWDI/WaterManagerDB/actions/workflows/testing.yml/badge.svg)](https://github.com/NMWDI/WaterManagerDB/actions/workflows/testing.yml)
[![Format code](https://github.com/NMWDI/WaterManagerDB/actions/workflows/format_code.yml/badge.svg)](https://github.com/NMWDI/WaterManagerDB/actions/workflows/format_code.yml)

## Versions
V0.1.9 - Add owners to Meters table, fix various bugs
V0.1.8 - Fix bug in meter selection autocomplete
V0.1.7 - Fixed bugs in Add Meter
V0.1.6 - Various fixes and meter search via map UI
V0.1.5 - Various minor bug fixes
V0.1.4 - Updated "current installation" section of activities to match Meters page
V0.1.3 - Added user admin, improved appearance, fixed OSE endpoint scope.
V0.1.2 - Added an initial parts inventory and minor meter installation UI improvements
V0.1.1 - Initial version with new clean database
V0.0 - Initial minimum viable product

## Purpose
This web app facilitates reporting of water management operations to other organizations. The initial goal is to help water conservation districts communicate with local and state governments. However, the interface may eventually be developed to be more general.

## Installation
The app is built with the following components:
* PostgreSQL database with PostGIS extension
* Python FastAPI backend for interfacing with database
* React based frontend

App components are organized into Docker containers, but it can also be run locally.

To run the app, clone the repository and use Docker Compose to run:
```
/watermanagerdb >> docker compose -f docker-compose.dev.yml --build
```

The API component will need several environmental variables that should be specified in the file 'api/.env'. See api/.env_example for an example. The PostgreSQL environmental variables should match the database settings.
