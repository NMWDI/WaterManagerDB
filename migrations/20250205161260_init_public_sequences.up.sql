DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."ActivityTypeLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ActivityTypeLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."ActivityTypeLU_id_seq" OWNED BY public."ActivityTypeLU".id;

        ALTER TABLE public."ActivityTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ActivityTypeLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."Alerts"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Alerts_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."Alerts_id_seq" OWNED BY public."Alerts".id;

        ALTER TABLE public."Alerts" ALTER COLUMN id SET DEFAULT nextval('public."Alerts_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."LandOwners"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."LandOwners_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."LandOwners_id_seq" OWNED BY public."LandOwners".id;

        ALTER TABLE public."LandOwners" ALTER COLUMN id SET DEFAULT nextval('public."LandOwners_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."LocationTypeLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."LocationTypeLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."LocationTypeLU_id_seq" OWNED BY public."LocationTypeLU".id;

        ALTER TABLE public."LocationTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."LocationTypeLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."Locations"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Locations_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."Locations_id_seq" OWNED BY public."Locations".id;

        ALTER TABLE public."Locations" ALTER COLUMN id SET DEFAULT nextval('public."Locations_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."MeterActivities"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."MeterActivities_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."MeterActivities_id_seq" OWNED BY public."MeterActivities".id;

        ALTER TABLE public."MeterActivities" ALTER COLUMN id SET DEFAULT nextval('public."MeterActivities_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."MeterObservations"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."MeterObservations_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."MeterObservations_id_seq" OWNED BY public."MeterObservations".id;

        ALTER TABLE public."MeterObservations" ALTER COLUMN id SET DEFAULT nextval('public."MeterObservations_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."MeterStatusLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."MeterStatusLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."MeterStatusLU_id_seq" OWNED BY public."MeterStatusLU".id;

        ALTER TABLE public."MeterStatusLU" ALTER COLUMN id SET DEFAULT nextval('public."MeterStatusLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."MeterTypeLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."MeterTypeLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."MeterTypeLU_id_seq" OWNED BY public."MeterTypeLU".id;

        ALTER TABLE public."MeterTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."MeterTypeLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."Meters"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Meters_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."Meters_id_seq" OWNED BY public."Meters".id;

        ALTER TABLE public."Meters" ALTER COLUMN id SET DEFAULT nextval('public."Meters_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."NoteTypeLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."NoteTypeLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."NoteTypeLU_id_seq" OWNED BY public."NoteTypeLU".id;

        ALTER TABLE public."NoteTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."NoteTypeLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."Notes"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Notes_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."Notes_id_seq" OWNED BY public."Notes".id;

        ALTER TABLE public."Notes" ALTER COLUMN id SET DEFAULT nextval('public."Notes_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."ObservedPropertyTypeLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ObservedPropertyTypeLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."ObservedPropertyTypeLU_id_seq" OWNED BY public."ObservedPropertyTypeLU".id;

        ALTER TABLE public."ObservedPropertyTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ObservedPropertyTypeLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."PartAssociation"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."PartAssociation_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."PartAssociation_id_seq" OWNED BY public."PartAssociation".id;

        ALTER TABLE public."PartAssociation" ALTER COLUMN id SET DEFAULT nextval('public."PartAssociation_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."PartTypeLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."PartTypeLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."PartTypeLU_id_seq" OWNED BY public."PartTypeLU".id;

        ALTER TABLE public."PartTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."PartTypeLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."Parts"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Parts_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."Parts_id_seq" OWNED BY public."Parts".id;

        ALTER TABLE public."Parts" ALTER COLUMN id SET DEFAULT nextval('public."Parts_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."PartsUsed"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."PartsUsed_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."PartsUsed_id_seq" OWNED BY public."PartsUsed".id;

        ALTER TABLE public."PartsUsed" ALTER COLUMN id SET DEFAULT nextval('public."PartsUsed_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."PropertyUnits"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."PropertyUnits_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."PropertyUnits_id_seq" OWNED BY public."PropertyUnits".id;

        ALTER TABLE public."PropertyUnits" ALTER COLUMN id SET DEFAULT nextval('public."PropertyUnits_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."QC"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."QC_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."QC_id_seq" OWNED BY public."QC".id;

        ALTER TABLE public."QC" ALTER COLUMN id SET DEFAULT nextval('public."QC_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."ScopesRoles"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ScopesRoles_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."ScopesRoles_id_seq" OWNED BY public."ScopesRoles".id;

        ALTER TABLE public."ScopesRoles" ALTER COLUMN id SET DEFAULT nextval('public."ScopesRoles_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."ScreenIntervals"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ScreenIntervals_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."ScreenIntervals_id_seq" OWNED BY public."ScreenIntervals".id;

        ALTER TABLE public."ScreenIntervals" ALTER COLUMN id SET DEFAULT nextval('public."ScreenIntervals_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."SecurityScopes"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."SecurityScopes_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."SecurityScopes_id_seq" OWNED BY public."SecurityScopes".id;

        ALTER TABLE public."SecurityScopes" ALTER COLUMN id SET DEFAULT nextval('public."SecurityScopes_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."ServiceTypeLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ServiceTypeLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."ServiceTypeLU_id_seq" OWNED BY public."ServiceTypeLU".id;

        ALTER TABLE public."ServiceTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ServiceTypeLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."ServicesPerformed"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ServicesPerformed_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."ServicesPerformed_id_seq" OWNED BY public."ServicesPerformed".id;

        ALTER TABLE public."ServicesPerformed" ALTER COLUMN id SET DEFAULT nextval('public."ServicesPerformed_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."Units"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Units_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."Units_id_seq" OWNED BY public."Units".id;

        ALTER TABLE public."Units" ALTER COLUMN id SET DEFAULT nextval('public."Units_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."UserRoles"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."UserRoles_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."UserRoles_id_seq" OWNED BY public."UserRoles".id;

        ALTER TABLE public."UserRoles" ALTER COLUMN id SET DEFAULT nextval('public."UserRoles_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."Users"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Users_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;

        ALTER TABLE public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."WellConstructions"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."WellConstructions_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."WellConstructions_id_seq" OWNED BY public."WellConstructions".id;

        ALTER TABLE public."WellConstructions" ALTER COLUMN id SET DEFAULT nextval('public."WellConstructions_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."WellMeasurements"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."WellMeasurements_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."WellMeasurements_id_seq" OWNED BY public."WellMeasurements".id;

        ALTER TABLE public."WellMeasurements" ALTER COLUMN id SET DEFAULT nextval('public."WellMeasurements_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."WellRights"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."WellRights_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."WellRights_id_seq" OWNED BY public."WellRights".id;

        ALTER TABLE public."WellRights" ALTER COLUMN id SET DEFAULT nextval('public."WellRights_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."WellUseLU"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."WellUseLU_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."WellUseLU_id_seq" OWNED BY public."WellUseLU".id;

        ALTER TABLE public."WellUseLU" ALTER COLUMN id SET DEFAULT nextval('public."WellUseLU_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."Wells"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Wells_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."Wells_id_seq" OWNED BY public."Wells".id;

        ALTER TABLE public."Wells" ALTER COLUMN id SET DEFAULT nextval('public."Wells_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."meter_registers"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."meter_registers_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."meter_registers_id_seq" OWNED BY public."meter_registers".id;

        ALTER TABLE public."meter_registers" ALTER COLUMN id SET DEFAULT nextval('public."meter_registers_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."water_sources"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."water_sources_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."water_sources_id_seq" OWNED BY public."water_sources".id;

        ALTER TABLE public."water_sources" ALTER COLUMN id SET DEFAULT nextval('public."water_sources_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."well_status"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."well_status_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."well_status_id_seq" OWNED BY public."well_status".id;

        ALTER TABLE public."well_status" ALTER COLUMN id SET DEFAULT nextval('public."well_status_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."work_order_status_lu"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."work_order_status_lu_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."work_order_status_lu_id_seq" OWNED BY public."work_order_status_lu".id;

        ALTER TABLE public."work_order_status_lu" ALTER COLUMN id SET DEFAULT nextval('public."work_order_status_lu_id_seq"');
    END IF;
END $$;

DO $$
DECLARE existing_seq TEXT;
BEGIN
    SELECT pg_get_serial_sequence('public."work_orders"', 'id') INTO existing_seq;

    IF existing_seq IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."work_orders_id_seq" AS integer START
            WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

        ALTER SEQUENCE public."work_orders_id_seq" OWNED BY public."work_orders".id;

        ALTER TABLE public."work_orders" ALTER COLUMN id SET DEFAULT nextval('public."work_orders_id_seq"');
    END IF;
END $$;
