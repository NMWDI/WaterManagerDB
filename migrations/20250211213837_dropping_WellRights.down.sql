CREATE TABLE IF NOT EXISTS public."WellRights" (
    id integer PRIMARY KEY,
    well_id integer NOT NULL,
    ra_number character varying NOT NULL
);