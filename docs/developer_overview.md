# Developer Manual Overview:

## Introduction
The Water Meter Manager is a web application that facilitates irrigation meter management activities such as maintenance and reporting to regulatory agencies.
It has been developed to support the needs of the PVACD (...link), but may be useful to other conservation districts and water management organizations.
This documentation describes how the application is built with the goal of onboarding new developers and documenting application components.

## Getting Started
To get started, clone the repository **or fork?** to a local development environment. The production application leverages Docker for each component.
However, depending on the local environment, it may be easier to develop some components outside of Docker. Development on Windows in particular has
led to some issues when using Docker.  **Branching? and other git workflow?**

### Dockerized Setup
The application is composed of several Docker containers build for the following application components:

- Database
- Python Backend
- React Frontend
- Traefik Server for routing

Docker compose is used to orchestrate the containers and a docker compose configuration file, specifically for development, 
is provided in the repository (docker-compose.dev.yml). Run docker compose with the following command:
```console
docker-compose -f docker-compose.dev.yml up
```
Running docker compose should build everything needed for development including a database with some test data and relevant environment variables.
However, most development has not been done in a fully Dockerized environment, so there may be some issues docker-compose.dev.yml. 

### Local or Hybrid Setup
Development has primarily taken place using a hybrid setup of a Dockerized database, but a local Python backend and React frontend. This configuration
uses the docker compose file 'docker-compose.dev.dbonly.yml' to create an empty database.