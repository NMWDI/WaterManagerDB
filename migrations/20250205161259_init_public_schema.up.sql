CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';

CREATE TABLE public."ActivityTypeLU" (
    id integer NOT NULL,
    name character varying,
    description character varying,
    permission character varying
);

CREATE SEQUENCE public."ActivityTypeLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."ActivityTypeLU_id_seq" OWNED BY public."ActivityTypeLU".id;

CREATE TABLE public."Alerts" (
    id integer NOT NULL,
    alert character varying,
    open_timestamp timestamp without time zone,
    closed_timestamp timestamp without time zone,
    meter_id integer
);

CREATE SEQUENCE public."Alerts_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Alerts_id_seq" OWNED BY public."Alerts".id;

CREATE TABLE public."LandOwners" (
    id integer NOT NULL,
    contact_name character varying,
    organization character varying,
    address character varying,
    city character varying,
    state character varying,
    zip character varying,
    phone character varying,
    mobile character varying,
    email character varying,
    note character varying
);

CREATE SEQUENCE public."LandOwners_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."LandOwners_id_seq" OWNED BY public."LandOwners".id;

CREATE TABLE public."LocationTypeLU" (
    id integer NOT NULL,
    type_name character varying,
    description character varying
);

CREATE SEQUENCE public."LocationTypeLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."LocationTypeLU_id_seq" OWNED BY public."LocationTypeLU".id;

CREATE TABLE public."Locations" (
    id integer NOT NULL,
    name character varying,
    type_id integer NOT NULL,
    trss character varying,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    township integer,
    range integer,
    section integer,
    quarter integer,
    half_quarter integer,
    quarter_quarter integer,
    geom public.geometry (Point),
    land_owner_id integer
);

CREATE SEQUENCE public."Locations_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Locations_id_seq" OWNED BY public."Locations".id;

CREATE TABLE public."MeterActivities" (
    id integer NOT NULL,
    timestamp_start timestamp without time zone NOT NULL,
    timestamp_end timestamp without time zone NOT NULL,
    description character varying,
    submitting_user_id integer,
    meter_id integer NOT NULL,
    activity_type_id integer NOT NULL,
    location_id integer NOT NULL,
    ose_share boolean DEFAULT false NOT NULL,
    water_users character varying,
    work_order_id integer
);

CREATE SEQUENCE public."MeterActivities_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."MeterActivities_id_seq" OWNED BY public."MeterActivities".id;

CREATE TABLE public."MeterObservations" (
    id integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    value double precision NOT NULL,
    notes character varying,
    submitting_user_id integer,
    meter_id integer NOT NULL,
    observed_property_type_id integer NOT NULL,
    unit_id integer NOT NULL,
    location_id integer NOT NULL,
    ose_share boolean DEFAULT false NOT NULL
);

CREATE SEQUENCE public."MeterObservations_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."MeterObservations_id_seq" OWNED BY public."MeterObservations".id;

CREATE TABLE public."MeterStatusLU" (
    id integer NOT NULL,
    status_name character varying,
    description character varying
);

CREATE SEQUENCE public."MeterStatusLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."MeterStatusLU_id_seq" OWNED BY public."MeterStatusLU".id;

CREATE TABLE public."MeterTypeLU" (
    id integer NOT NULL,
    brand character varying,
    series character varying,
    model character varying,
    size double precision,
    description character varying,
    in_use boolean DEFAULT true NOT NULL
);

CREATE SEQUENCE public."MeterTypeLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."MeterTypeLU_id_seq" OWNED BY public."MeterTypeLU".id;

CREATE TABLE public."Meters" (
    id integer NOT NULL,
    serial_number character varying NOT NULL,
    contact_name character varying,
    contact_phone character varying,
    notes character varying,
    meter_type_id integer NOT NULL,
    status_id integer NOT NULL,
    well_id integer,
    location_id integer,
    water_users character varying,
    meter_owner character varying,
    register_id integer
);

CREATE SEQUENCE public."Meters_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Meters_id_seq" OWNED BY public."Meters".id;

CREATE TABLE public."NoteTypeLU" (
    id integer NOT NULL,
    note character varying,
    details character varying,
    slug character varying,
    commonly_used boolean DEFAULT false NOT NULL
);

CREATE SEQUENCE public."NoteTypeLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."NoteTypeLU_id_seq" OWNED BY public."NoteTypeLU".id;

CREATE TABLE public."Notes" (
    meter_activity_id integer NOT NULL,
    note_type_id integer NOT NULL,
    id integer NOT NULL
);

CREATE SEQUENCE public."Notes_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Notes_id_seq" OWNED BY public."Notes".id;

CREATE TABLE public."ObservedPropertyTypeLU" (
    id integer NOT NULL,
    name character varying,
    description character varying,
    context character varying
);

CREATE SEQUENCE public."ObservedPropertyTypeLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."ObservedPropertyTypeLU_id_seq" OWNED BY public."ObservedPropertyTypeLU".id;

CREATE TABLE public."PartAssociation" (
    id integer NOT NULL,
    meter_type_id integer NOT NULL,
    part_id integer NOT NULL,
    commonly_used boolean
);

CREATE SEQUENCE public."PartAssociation_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."PartAssociation_id_seq" OWNED BY public."PartAssociation".id;

CREATE TABLE public."PartTypeLU" (
    id integer NOT NULL,
    name character varying,
    description character varying
);

CREATE SEQUENCE public."PartTypeLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."PartTypeLU_id_seq" OWNED BY public."PartTypeLU".id;

CREATE TABLE public."Parts" (
    id integer NOT NULL,
    part_number character varying NOT NULL,
    part_type_id integer NOT NULL,
    description character varying,
    vendor character varying,
    count integer,
    note character varying,
    in_use boolean DEFAULT true NOT NULL,
    commonly_used boolean DEFAULT false NOT NULL
);

CREATE SEQUENCE public."Parts_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Parts_id_seq" OWNED BY public."Parts".id;

CREATE TABLE public."PartsUsed" (
    meter_activity_id integer NOT NULL,
    part_id integer NOT NULL,
    count integer,
    id integer NOT NULL
);

CREATE SEQUENCE public."PartsUsed_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."PartsUsed_id_seq" OWNED BY public."PartsUsed".id;

CREATE TABLE public."PropertyUnits" (
    property_id integer NOT NULL,
    unit_id integer NOT NULL,
    id integer NOT NULL
);

CREATE SEQUENCE public."PropertyUnits_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."PropertyUnits_id_seq" OWNED BY public."PropertyUnits".id;

CREATE TABLE public."QC" (
    id integer NOT NULL,
    "timestamp" timestamp without time zone,
    status boolean
);

CREATE SEQUENCE public."QC_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."QC_id_seq" OWNED BY public."QC".id;

CREATE TABLE public."ScopesRoles" (
    security_scope_id integer NOT NULL,
    user_role_id integer NOT NULL,
    id integer NOT NULL
);

CREATE SEQUENCE public."ScopesRoles_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."ScopesRoles_id_seq" OWNED BY public."ScopesRoles".id;

CREATE TABLE public."ScreenIntervals" (
    id integer NOT NULL,
    top double precision,
    bottom double precision,
    well_construction_id integer
);

CREATE SEQUENCE public."ScreenIntervals_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."ScreenIntervals_id_seq" OWNED BY public."ScreenIntervals".id;

CREATE TABLE public."SecurityScopes" (
    id integer NOT NULL,
    scope_string character varying NOT NULL,
    description character varying
);

CREATE SEQUENCE public."SecurityScopes_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."SecurityScopes_id_seq" OWNED BY public."SecurityScopes".id;

CREATE TABLE public."ServiceTypeLU" (
    id integer NOT NULL,
    service_name character varying,
    description character varying
);

CREATE SEQUENCE public."ServiceTypeLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."ServiceTypeLU_id_seq" OWNED BY public."ServiceTypeLU".id;

CREATE TABLE public."ServicesPerformed" (
    meter_activity_id integer NOT NULL,
    service_type_id integer NOT NULL,
    id integer NOT NULL
);

CREATE SEQUENCE public."ServicesPerformed_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."ServicesPerformed_id_seq" OWNED BY public."ServicesPerformed".id;

CREATE TABLE public."Units" (
    id integer NOT NULL,
    name character varying,
    name_short character varying,
    description character varying
);

CREATE SEQUENCE public."Units_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Units_id_seq" OWNED BY public."Units".id;

CREATE TABLE public."UserRoles" (
    id integer NOT NULL,
    name character varying NOT NULL
);

CREATE SEQUENCE public."UserRoles_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."UserRoles_id_seq" OWNED BY public."UserRoles".id;

CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying NOT NULL,
    full_name character varying,
    email character varying,
    hashed_password character varying NOT NULL,
    disabled boolean,
    user_role_id integer NOT NULL
);

CREATE SEQUENCE public."Users_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;

CREATE TABLE public."WellConstructions" (
    id integer NOT NULL,
    casing_diameter double precision,
    hole_depth double precision,
    well_depth double precision,
    well_id integer
);

CREATE SEQUENCE public."WellConstructions_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."WellConstructions_id_seq" OWNED BY public."WellConstructions".id;

CREATE TABLE public."WellMeasurements" (
    id integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    value double precision NOT NULL,
    observed_property_id integer NOT NULL,
    submitting_user_id integer,
    unit_id integer NOT NULL,
    well_id integer NOT NULL
);

CREATE SEQUENCE public."WellMeasurements_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."WellMeasurements_id_seq" OWNED BY public."WellMeasurements".id;

CREATE TABLE public."WellRights" (
    id integer NOT NULL,
    well_id integer NOT NULL,
    ra_number character varying NOT NULL
);

CREATE SEQUENCE public."WellRights_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."WellRights_id_seq" OWNED BY public."WellRights".id;

CREATE TABLE public."WellUseLU" (
    id integer NOT NULL,
    use_type character varying NOT NULL,
    code character varying,
    description character varying
);

CREATE SEQUENCE public."WellUseLU_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."WellUseLU_id_seq" OWNED BY public."WellUseLU".id;

CREATE TABLE public."Wells" (
    id integer NOT NULL,
    name character varying,
    use_type_id integer,
    location_id integer,
    ra_number character varying,
    owners character varying,
    comments character varying,
    osetag character varying,
    water_source_id integer,
    well_status_id integer,
    casing character varying(30),
    total_depth double precision,
    outside_recorder boolean
);

CREATE SEQUENCE public."Wells_id_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Wells_id_seq" OWNED BY public."Wells".id;

CREATE TABLE public.meter_registers (
    id integer NOT NULL,
    brand character varying(30) NOT NULL,
    meter_size numeric(3, 1) NOT NULL,
    part_id integer,
    ratio character varying(30),
    dial_units_id integer NOT NULL,
    totalizer_units_id integer NOT NULL,
    number_of_digits integer NOT NULL,
    multiplier double precision NOT NULL,
    notes character varying(100),
    decimal_digits integer
);

CREATE SEQUENCE public.meter_registers_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.meter_registers_id_seq OWNED BY public.meter_registers.id;

CREATE TABLE public.water_sources (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);

CREATE SEQUENCE public.water_sources_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.water_sources_id_seq OWNED BY public.water_sources.id;

CREATE TABLE public.well_status (
    id integer NOT NULL,
    status character varying(50) NOT NULL,
    description text
);

CREATE SEQUENCE public.well_status_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.well_status_id_seq OWNED BY public.well_status.id;

CREATE TABLE public.work_order_status_lu (
    id integer NOT NULL,
    name character varying(20) NOT NULL,
    description text
);

CREATE SEQUENCE public.work_order_status_lu_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.work_order_status_lu_id_seq OWNED BY public.work_order_status_lu.id;

CREATE TABLE public.work_orders (
    id integer NOT NULL,
    date_created date NOT NULL,
    creator character varying(30),
    title character varying(30) NOT NULL,
    description text,
    meter_id integer NOT NULL,
    status_id integer NOT NULL,
    notes text,
    assigned_user_id integer,
    ose_request_id integer,
    CONSTRAINT work_orders_title_check CHECK (((title)::text <> ''::text))
);

CREATE SEQUENCE public.work_orders_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.work_orders_id_seq OWNED BY public.work_orders.id;

ALTER TABLE ONLY public."ActivityTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ActivityTypeLU_id_seq"'::regclass);

ALTER TABLE ONLY public."Alerts" ALTER COLUMN id SET DEFAULT nextval('public."Alerts_id_seq"'::regclass);

ALTER TABLE ONLY public."LandOwners" ALTER COLUMN id SET DEFAULT nextval('public."LandOwners_id_seq"'::regclass);

ALTER TABLE ONLY public."LocationTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."LocationTypeLU_id_seq"'::regclass);

ALTER TABLE ONLY public."Locations" ALTER COLUMN id SET DEFAULT nextval('public."Locations_id_seq"'::regclass);

ALTER TABLE ONLY public."MeterActivities" ALTER COLUMN id SET DEFAULT nextval('public."MeterActivities_id_seq"'::regclass);

ALTER TABLE ONLY public."MeterObservations" ALTER COLUMN id SET DEFAULT nextval('public."MeterObservations_id_seq"'::regclass);

ALTER TABLE ONLY public."MeterStatusLU" ALTER COLUMN id SET DEFAULT nextval('public."MeterStatusLU_id_seq"'::regclass);

ALTER TABLE ONLY public."MeterTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."MeterTypeLU_id_seq"'::regclass);

ALTER TABLE ONLY public."Meters" ALTER COLUMN id SET DEFAULT nextval('public."Meters_id_seq"'::regclass);

ALTER TABLE ONLY public."NoteTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."NoteTypeLU_id_seq"'::regclass);

ALTER TABLE ONLY public."Notes" ALTER COLUMN id SET DEFAULT nextval('public."Notes_id_seq"'::regclass);

ALTER TABLE ONLY public."ObservedPropertyTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ObservedPropertyTypeLU_id_seq"'::regclass);

ALTER TABLE ONLY public."PartAssociation" ALTER COLUMN id SET DEFAULT nextval('public."PartAssociation_id_seq"'::regclass);

ALTER TABLE ONLY public."PartTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."PartTypeLU_id_seq"'::regclass);

ALTER TABLE ONLY public."Parts" ALTER COLUMN id SET DEFAULT nextval('public."Parts_id_seq"'::regclass);

ALTER TABLE ONLY public."PartsUsed" ALTER COLUMN id SET DEFAULT nextval('public."PartsUsed_id_seq"'::regclass);

ALTER TABLE ONLY public."PropertyUnits" ALTER COLUMN id SET DEFAULT nextval('public."PropertyUnits_id_seq"'::regclass);

ALTER TABLE ONLY public."QC" ALTER COLUMN id SET DEFAULT nextval('public."QC_id_seq"'::regclass);

ALTER TABLE ONLY public."ScopesRoles" ALTER COLUMN id SET DEFAULT nextval('public."ScopesRoles_id_seq"'::regclass);

ALTER TABLE ONLY public."ScreenIntervals" ALTER COLUMN id SET DEFAULT nextval('public."ScreenIntervals_id_seq"'::regclass);

ALTER TABLE ONLY public."SecurityScopes" ALTER COLUMN id SET DEFAULT nextval('public."SecurityScopes_id_seq"'::regclass);

ALTER TABLE ONLY public."ServiceTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ServiceTypeLU_id_seq"'::regclass);

ALTER TABLE ONLY public."ServicesPerformed" ALTER COLUMN id SET DEFAULT nextval('public."ServicesPerformed_id_seq"'::regclass);

ALTER TABLE ONLY public."Units" ALTER COLUMN id SET DEFAULT nextval('public."Units_id_seq"'::regclass);

ALTER TABLE ONLY public."UserRoles" ALTER COLUMN id SET DEFAULT nextval('public."UserRoles_id_seq"'::regclass);

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);

ALTER TABLE ONLY public."WellConstructions" ALTER COLUMN id SET DEFAULT nextval('public."WellConstructions_id_seq"'::regclass);

ALTER TABLE ONLY public."WellMeasurements" ALTER COLUMN id SET DEFAULT nextval('public."WellMeasurements_id_seq"'::regclass);

ALTER TABLE ONLY public."WellRights" ALTER COLUMN id SET DEFAULT nextval('public."WellRights_id_seq"'::regclass);

ALTER TABLE ONLY public."WellUseLU" ALTER COLUMN id SET DEFAULT nextval('public."WellUseLU_id_seq"'::regclass);

ALTER TABLE ONLY public."Wells" ALTER COLUMN id SET DEFAULT nextval('public."Wells_id_seq"'::regclass);

ALTER TABLE ONLY public.meter_registers ALTER COLUMN id SET DEFAULT nextval('public.meter_registers_id_seq'::regclass);

ALTER TABLE ONLY public.water_sources ALTER COLUMN id SET DEFAULT nextval('public.water_sources_id_seq'::regclass);

ALTER TABLE ONLY public.well_status ALTER COLUMN id SET DEFAULT nextval('public.well_status_id_seq'::regclass);

ALTER TABLE ONLY public.work_order_status_lu ALTER COLUMN id SET DEFAULT nextval('public.work_order_status_lu_id_seq'::regclass);

ALTER TABLE ONLY public.work_orders ALTER COLUMN id SET DEFAULT nextval('public.work_orders_id_seq'::regclass);
