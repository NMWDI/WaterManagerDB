# Application Architecture

The technologies used in the application are largely based on some combination of developer familiarity, creating a modern aesthetic, and ease of deployment.
The application has the following architecture:

- Backend
    - Postgres Database
    - Python based API using FastAPI
- Frontend
    - Single page application using React

Each component of the application is Dockerized to some extent. In production, the frontend and Python component of the backend
run inside Docker containers, but the database is on a separate server. In development, all components can be Dockerized if desired, but 
it may be easier to run some components locally. 

This approach was originally chosen to make development and deployment environments similar,
and to facilitate rapid deployment. However, the benefits to running the production database on a separate server, namely automated backups and 
increased stability, has led to the current mixed approach.

## Technology Stack Details
On the backend, the database includes the PostGIS extension to Postgres, which allows for spatial queries. At this point, this
functionality has yet to be utilized. In combination with FastAPI, SQLAlchemy is used for database interactions.  Recently, SQLAlchemy has 
transitioned to version 2.0, but version 1.4 is still being used in this application. Where possible, the 2.0 style of working should be used in 
order to facilitate later upgrades. Finally, it may be worth noting that authentication is handled using JWT tokens, following the basic tutorial
presented in the FastAPI documentation.

The frontend is built as a single page web application using React. Many of the components utilize the MUI (mui.com) library, which provides a 
standardized look based on Googles Material UI design (*Need to verify*). Two other Javascript libraries are used for mapping (leafletjs.com) and 
charts (plotly.js). Both of these libraries have React wrappers, which are used in the application.