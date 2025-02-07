DO $$
BEGIN
    IF pg_get_serial_sequence('public."ActivityTypeLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ActivityTypeLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."ActivityTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ActivityTypeLU_id_seq"');
        ALTER SEQUENCE public."ActivityTypeLU_id_seq" OWNED BY public."ActivityTypeLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."Alerts"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Alerts_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."Alerts" ALTER COLUMN id SET DEFAULT nextval('public."Alerts_id_seq"');
        ALTER SEQUENCE public."Alerts_id_seq" OWNED BY public."Alerts".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."LandOwners"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."LandOwners_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."LandOwners" ALTER COLUMN id SET DEFAULT nextval('public."LandOwners_id_seq"');
        ALTER SEQUENCE public."LandOwners_id_seq" OWNED BY public."LandOwners".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."LocationTypeLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."LocationTypeLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."LocationTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."LocationTypeLU_id_seq"');
        ALTER SEQUENCE public."LocationTypeLU_id_seq" OWNED BY public."LocationTypeLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."Locations"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Locations_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."Locations" ALTER COLUMN id SET DEFAULT nextval('public."Locations_id_seq"');
        ALTER SEQUENCE public."Locations_id_seq" OWNED BY public."Locations".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."MeterActivities"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."MeterActivities_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."MeterActivities" ALTER COLUMN id SET DEFAULT nextval('public."MeterActivities_id_seq"');
        ALTER SEQUENCE public."MeterActivities_id_seq" OWNED BY public."MeterActivities".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."MeterObservations"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."MeterObservations_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."MeterObservations" ALTER COLUMN id SET DEFAULT nextval('public."MeterObservations_id_seq"');
        ALTER SEQUENCE public."MeterObservations_id_seq" OWNED BY public."MeterObservations".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."MeterStatusLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."MeterStatusLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."MeterStatusLU" ALTER COLUMN id SET DEFAULT nextval('public."MeterStatusLU_id_seq"');
        ALTER SEQUENCE public."MeterStatusLU_id_seq" OWNED BY public."MeterStatusLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."MeterTypeLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."MeterTypeLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."MeterTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."MeterTypeLU_id_seq"');
        ALTER SEQUENCE public."MeterTypeLU_id_seq" OWNED BY public."MeterTypeLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."Meters"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Meters_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."Meters" ALTER COLUMN id SET DEFAULT nextval('public."Meters_id_seq"');
        ALTER SEQUENCE public."Meters_id_seq" OWNED BY public."Meters".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."NoteTypeLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."NoteTypeLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."NoteTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."NoteTypeLU_id_seq"');
        ALTER SEQUENCE public."NoteTypeLU_id_seq" OWNED BY public."NoteTypeLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."Notes"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Notes_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."Notes" ALTER COLUMN id SET DEFAULT nextval('public."Notes_id_seq"');
        ALTER SEQUENCE public."Notes_id_seq" OWNED BY public."Notes".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."ObservedPropertyTypeLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ObservedPropertyTypeLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."ObservedPropertyTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ObservedPropertyTypeLU_id_seq"');
        ALTER SEQUENCE public."ObservedPropertyTypeLU_id_seq" OWNED BY public."ObservedPropertyTypeLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."PartAssociation"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."PartAssociation_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."PartAssociation" ALTER COLUMN id SET DEFAULT nextval('public."PartAssociation_id_seq"');
        ALTER SEQUENCE public."PartAssociation_id_seq" OWNED BY public."PartAssociation".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."PartTypeLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."PartTypeLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."PartTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."PartTypeLU_id_seq"');
        ALTER SEQUENCE public."PartTypeLU_id_seq" OWNED BY public."PartTypeLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."Parts"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Parts_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."Parts" ALTER COLUMN id SET DEFAULT nextval('public."Parts_id_seq"');
        ALTER SEQUENCE public."Parts_id_seq" OWNED BY public."Parts".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."PartsUsed"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."PartsUsed_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."PartsUsed" ALTER COLUMN id SET DEFAULT nextval('public."PartsUsed_id_seq"');
        ALTER SEQUENCE public."PartsUsed_id_seq" OWNED BY public."PartsUsed".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."PropertyUnits"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."PropertyUnits_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."PropertyUnits" ALTER COLUMN id SET DEFAULT nextval('public."PropertyUnits_id_seq"');
        ALTER SEQUENCE public."PropertyUnits_id_seq" OWNED BY public."PropertyUnits".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."QC"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."QC_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."QC" ALTER COLUMN id SET DEFAULT nextval('public."QC_id_seq"');
        ALTER SEQUENCE public."QC_id_seq" OWNED BY public."QC".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."ScopesRoles"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ScopesRoles_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."ScopesRoles" ALTER COLUMN id SET DEFAULT nextval('public."ScopesRoles_id_seq"');
        ALTER SEQUENCE public."ScopesRoles_id_seq" OWNED BY public."ScopesRoles".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."ScreenIntervals"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ScreenIntervals_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."ScreenIntervals" ALTER COLUMN id SET DEFAULT nextval('public."ScreenIntervals_id_seq"');
        ALTER SEQUENCE public."ScreenIntervals_id_seq" OWNED BY public."ScreenIntervals".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."SecurityScopes"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."SecurityScopes_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."SecurityScopes" ALTER COLUMN id SET DEFAULT nextval('public."SecurityScopes_id_seq"');
        ALTER SEQUENCE public."SecurityScopes_id_seq" OWNED BY public."SecurityScopes".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."ServiceTypeLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ServiceTypeLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."ServiceTypeLU" ALTER COLUMN id SET DEFAULT nextval('public."ServiceTypeLU_id_seq"');
        ALTER SEQUENCE public."ServiceTypeLU_id_seq" OWNED BY public."ServiceTypeLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."ServicesPerformed"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."ServicesPerformed_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."ServicesPerformed" ALTER COLUMN id SET DEFAULT nextval('public."ServicesPerformed_id_seq"');
        ALTER SEQUENCE public."ServicesPerformed_id_seq" OWNED BY public."ServicesPerformed".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."Units"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Units_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."Units" ALTER COLUMN id SET DEFAULT nextval('public."Units_id_seq"');
        ALTER SEQUENCE public."Units_id_seq" OWNED BY public."Units".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."UserRoles"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."UserRoles_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."UserRoles" ALTER COLUMN id SET DEFAULT nextval('public."UserRoles_id_seq"');
        ALTER SEQUENCE public."UserRoles_id_seq" OWNED BY public."UserRoles".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."Users"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Users_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"');
        ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."WellConstructions"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."WellConstructions_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."WellConstructions" ALTER COLUMN id SET DEFAULT nextval('public."WellConstructions_id_seq"');
        ALTER SEQUENCE public."WellConstructions_id_seq" OWNED BY public."WellConstructions".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."WellMeasurements"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."WellMeasurements_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."WellMeasurements" ALTER COLUMN id SET DEFAULT nextval('public."WellMeasurements_id_seq"');
        ALTER SEQUENCE public."WellMeasurements_id_seq" OWNED BY public."WellMeasurements".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."WellRights"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."WellRights_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."WellRights" ALTER COLUMN id SET DEFAULT nextval('public."WellRights_id_seq"');
        ALTER SEQUENCE public."WellRights_id_seq" OWNED BY public."WellRights".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."WellUseLU"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."WellUseLU_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."WellUseLU" ALTER COLUMN id SET DEFAULT nextval('public."WellUseLU_id_seq"');
        ALTER SEQUENCE public."WellUseLU_id_seq" OWNED BY public."WellUseLU".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."Wells"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."Wells_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."Wells" ALTER COLUMN id SET DEFAULT nextval('public."Wells_id_seq"');
        ALTER SEQUENCE public."Wells_id_seq" OWNED BY public."Wells".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."meter_registers"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."meter_registers_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."meter_registers" ALTER COLUMN id SET DEFAULT nextval('public."meter_registers_id_seq"');
        ALTER SEQUENCE public."meter_registers_id_seq" OWNED BY public."meter_registers".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."water_sources"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."water_sources_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."water_sources" ALTER COLUMN id SET DEFAULT nextval('public."water_sources_id_seq"');
        ALTER SEQUENCE public."water_sources_id_seq" OWNED BY public."water_sources".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."well_status"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."well_status_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."well_status" ALTER COLUMN id SET DEFAULT nextval('public."well_status_id_seq"');
        ALTER SEQUENCE public."well_status_id_seq" OWNED BY public."well_status".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."work_order_status_lu"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."work_order_status_lu_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."work_order_status_lu" ALTER COLUMN id SET DEFAULT nextval('public."work_order_status_lu_id_seq"');
        ALTER SEQUENCE public."work_order_status_lu_id_seq" OWNED BY public."work_order_status_lu".id;
    END IF;
END $$;

DO $$
BEGIN
    IF pg_get_serial_sequence('public."work_orders"', 'id') IS NULL THEN
        CREATE SEQUENCE IF NOT EXISTS public."work_orders_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
        ALTER TABLE public."work_orders" ALTER COLUMN id SET DEFAULT nextval('public."work_orders_id_seq"');
        ALTER SEQUENCE public."work_orders_id_seq" OWNED BY public."work_orders".id;
    END IF;
END $$;
