# WaterManagerDB

[![Unittests](https://github.com/NMWDI/WaterManagerDB/actions/workflows/testing.yml/badge.svg)](https://github.com/NMWDI/WaterManagerDB/actions/workflows/testing.yml)
[![Format code](https://github.com/NMWDI/WaterManagerDB/actions/workflows/format_code.yml/badge.svg)](https://github.com/NMWDI/WaterManagerDB/actions/workflows/format_code.yml)

## Versions
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
