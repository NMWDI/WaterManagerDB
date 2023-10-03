
---
### High-level Purpose/Functioning
- The backend of this application is fairly straightforward, it serves as an API to recieve and process HTTP requests from the frontend.
- As with most API backends, it is basically an interface with the database that handles some business logic and authentication.


---
### Main Technologies
- Postgres - Current DB
- SQLAlchemy - Python ORM
- FastAPI - Python web framework for building APIs
- Pydantic - Python data validation/structure
- FastAPI Pagination - Pagination support for FastAPI


---
### Directory Structure (from /api)
-  /components/ --- Higher-level/reusable components
	- /RHControlled/ --- MUI input components wrapped with a React Hook Form controller (and some abstractions on them for app-specific inputs (eg: ControlledMeterSelect.tsx))
- /alembic/ --- Unused to my knowledge
- /models/ --- SQLAlchemy models that describe the DB tables and relationships
	- main_models.py --- Contains all non-security/user related DB table definitions
	- security_models.py --- Contains table definitions relating to security and users
- /routes/ --- Contains files with endpoint functions per-category
- /schemas/ --- Contains the Pydantic schemas used in the routes as either parameter type definitions or response model type defintions.
- /tests/ --- Unused as of my knowledge :(
- config.py - Configures the backend environment settings, mostly pertains to the DB connection
- dbsetup.py --- DB creation and seeding script, not updated recently but could somewhat easily be
- Dockerfile --- Self explanatory
- enums.py --- Various enums used throughout the app, backend version of enums.ts
- main.py --- App entrypoint and configuration
- requirements.txt --- Self explanatory
- route_util.py --- Util functions used in some route functions
- security.py --- Functions and endpoint functions relating to security and authentication

---
### SwaggerUI
The Swagger UI lists all of the app's endpoints by category, their HTTP methods, and when clicked on will show the endpoints parameters and response structure. It can be viewed by visiting the /docs route on the API URL. Ensure that you "Authorize" if needed.

Note that especially on POST/PATCH endpoints, the object structure that is shown for the request and response may not exactly reflect what the endpoint has to receive or return. Eg: the SwaggerUI may show the structure of a POST request should include an ID or a POST/PATCH request should include a deeply qualified object but these are not always necessary for the endpoint to perform it's function. Or, a GET request may claim that it returns a deeply qualified object but it may not always.

These discrepencies are just because there is generally one Pydantic schema defined per DB table, and it includes all of the attributes/relationships that could be on that given table. This could be resolved by defining specific Pydantic schemas per endpoint or structure.

---
### Models
The models descibe the structure and relationship of the DB tables so that the ORM can interact with the database. Each model in this app generally follows the same structure in this order:

- The name of the DB table declared as a class that extends the Base class in main_models
- Any non-foreign-key DB columns, each with their type and constraints defined
- Foreign key columns, each with their type and ForeignKey related table defined
- Any relationships from the foreign key columns
- (If applicable) any relationships that come from an intermediary/join table.

Model definitions also typically include a description of what the model/DB table represents.

##### Intermediary/Join Tables
Regular join tables with no join-table-specific data are fairly straightforward in SQLAlchemy although they are not declared as a class but instead as the name of the join table set to a SQLAlchemy Table object that specifies the table name, metadata to use, and the two columns of the join table and what field on another table they relate to.

**IMPORTANT:** Since we are using an older version of SQLAlchemy, working with join tables that store additional unique data besides just references to other tables is *quite* contrived if you want any clean ORM relationship handling in my experience. I would recommend not doing this if possible. If it can't be avoided, read through the "many-to-many" and "association object" section of the SQLAlchemy v1.4 docs and be sure to read the warning (https://docs.sqlalchemy.org/en/14/orm/basic_relationships.html#association-object).

I believe I did implement this at one point and you could possibly find a commit that has the code, I dont remember exactly but it was something related to part use and storing the count of parts used on the join table.

Even then, I'd recommend either upgrading SQLAlchemy to the newer version that has better support for this or avoiding it.

---
### Schemas
The schemas are essentially just used to validate the structure/type of incoming/outgoing data on the FastAPI endpoints and provide a fairly accurate idea of the data that should be passed in/expected to return when viewing the SwaggerUI.

---
### Security
The backend handles user authentication on login by checking if the provided credentials are valid, checking if the user is disabled, and then if both of these tests pass, creating a JWT for the user and sending back this JWT and some user information that's used in the frontend (see the login_for_access_token function in main.py). The credential validation and user info fetching is handled in security.py.

Note: the user table has all user information and by default SQLAlchemy will return all of this information when an endpoint returns anything with a User relationship. This is prevented by manually deferring the sensitive attributes on the User table, so in order to return any of this sensitive data, undefer() must be used (as seen in get_user).

**IMPORTANT:** This was an oversight on my part to not catch this sooner but in get_user (which is used by the login function and others), we use the username from the token to get the user, which is not a good idea because if multiple users have the same username, only the user whose username is first will be able to login.

##### Scoped Users
In enums.py there is an enum for various scoped users, this essentially just uses the scoped_user function to determine if the user that made a request has the scopes passed in as parameters. These enum values can be used on endpoints to ensure that the requesting user has the scopes specified in the enum.



