-- Users -> UserRoles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_users_user_role'
    ) THEN
        ALTER TABLE public."Users"
        ADD CONSTRAINT fk_users_user_role FOREIGN KEY (user_role_id)
        REFERENCES public."UserRoles" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Meters -> MeterTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meters_meter_type'
    ) THEN
        ALTER TABLE public."Meters"
        ADD CONSTRAINT fk_meters_meter_type FOREIGN KEY (meter_type_id)
        REFERENCES public."MeterTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Meters -> MeterStatusLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meters_status'
    ) THEN
        ALTER TABLE public."Meters"
        ADD CONSTRAINT fk_meters_status FOREIGN KEY (status_id)
        REFERENCES public."MeterStatusLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Meters -> Locations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meters_location'
    ) THEN
        ALTER TABLE public."Meters"
        ADD CONSTRAINT fk_meters_location FOREIGN KEY (location_id)
        REFERENCES public."Locations" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Meters -> Wells
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meters_well'
    ) THEN
        ALTER TABLE public."Meters"
        ADD CONSTRAINT fk_meters_well FOREIGN KEY (well_id)
        REFERENCES public."Wells" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Meters -> MeterRegisters
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meters_register'
    ) THEN
        ALTER TABLE public."Meters"
        ADD CONSTRAINT fk_meters_register FOREIGN KEY (register_id)
        REFERENCES public.meter_registers (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Locations -> LocationTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_locations_type'
    ) THEN
        ALTER TABLE public."Locations"
        ADD CONSTRAINT fk_locations_type FOREIGN KEY (type_id)
        REFERENCES public."LocationTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Locations -> LandOwners
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_locations_land_owner'
    ) THEN
        ALTER TABLE public."Locations"
        ADD CONSTRAINT fk_locations_land_owner FOREIGN KEY (land_owner_id)
        REFERENCES public."LandOwners" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Alerts -> Meters
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_alerts_meter'
    ) THEN
        ALTER TABLE public."Alerts"
        ADD CONSTRAINT fk_alerts_meter FOREIGN KEY (meter_id)
        REFERENCES public."Meters" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterActivities -> Meters
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_activities_meter'
    ) THEN
        ALTER TABLE public."MeterActivities"
        ADD CONSTRAINT fk_meter_activities_meter FOREIGN KEY (meter_id)
        REFERENCES public."Meters" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterActivities -> ActivityTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_activities_activity_type'
    ) THEN
        ALTER TABLE public."MeterActivities"
        ADD CONSTRAINT fk_meter_activities_activity_type FOREIGN KEY (activity_type_id)
        REFERENCES public."ActivityTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterActivities -> Locations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_activities_location'
    ) THEN
        ALTER TABLE public."MeterActivities"
        ADD CONSTRAINT fk_meter_activities_location FOREIGN KEY (location_id)
        REFERENCES public."Locations" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterActivities -> Users (Submitting User)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_activities_submitting_user'
    ) THEN
        ALTER TABLE public."MeterActivities"
        ADD CONSTRAINT fk_meter_activities_submitting_user FOREIGN KEY (submitting_user_id)
        REFERENCES public."Users" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterActivities -> WorkOrders
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_activities_work_order'
    ) THEN
        ALTER TABLE public."MeterActivities"
        ADD CONSTRAINT fk_meter_activities_work_order FOREIGN KEY (work_order_id)
        REFERENCES public.work_orders (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterObservations -> Meters
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_observations_meter'
    ) THEN
        ALTER TABLE public."MeterObservations"
        ADD CONSTRAINT fk_meter_observations_meter FOREIGN KEY (meter_id)
        REFERENCES public."Meters" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterObservations -> ObservedPropertyTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_observations_property'
    ) THEN
        ALTER TABLE public."MeterObservations"
        ADD CONSTRAINT fk_meter_observations_property FOREIGN KEY (observed_property_type_id)
        REFERENCES public."ObservedPropertyTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterObservations -> Units
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_observations_unit'
    ) THEN
        ALTER TABLE public."MeterObservations"
        ADD CONSTRAINT fk_meter_observations_unit FOREIGN KEY (unit_id)
        REFERENCES public."Units" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterObservations -> Locations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_observations_location'
    ) THEN
        ALTER TABLE public."MeterObservations"
        ADD CONSTRAINT fk_meter_observations_location FOREIGN KEY (location_id)
        REFERENCES public."Locations" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterObservations -> Users (Submitting User)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_observations_submitting_user'
    ) THEN
        ALTER TABLE public."MeterObservations"
        ADD CONSTRAINT fk_meter_observations_submitting_user FOREIGN KEY (submitting_user_id)
        REFERENCES public."Users" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Notes -> MeterActivities
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_notes_meter_activity'
    ) THEN
        ALTER TABLE public."Notes"
        ADD CONSTRAINT fk_notes_meter_activity FOREIGN KEY (meter_activity_id)
        REFERENCES public."MeterActivities" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Notes -> NoteTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_notes_note_type'
    ) THEN
        ALTER TABLE public."Notes"
        ADD CONSTRAINT fk_notes_note_type FOREIGN KEY (note_type_id)
        REFERENCES public."NoteTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- PartAssociation -> MeterTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_part_association_meter_type'
    ) THEN
        ALTER TABLE public."PartAssociation"
        ADD CONSTRAINT fk_part_association_meter_type FOREIGN KEY (meter_type_id)
        REFERENCES public."MeterTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- PartAssociation -> Parts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_part_association_part'
    ) THEN
        ALTER TABLE public."PartAssociation"
        ADD CONSTRAINT fk_part_association_part FOREIGN KEY (part_id)
        REFERENCES public."Parts" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Parts -> PartTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_parts_part_type'
    ) THEN
        ALTER TABLE public."Parts"
        ADD CONSTRAINT fk_parts_part_type FOREIGN KEY (part_type_id)
        REFERENCES public."PartTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- PartsUsed -> MeterActivities
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_parts_used_meter_activity'
    ) THEN
        ALTER TABLE public."PartsUsed"
        ADD CONSTRAINT fk_parts_used_meter_activity FOREIGN KEY (meter_activity_id)
        REFERENCES public."MeterActivities" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- PartsUsed -> Parts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_parts_used_part'
    ) THEN
        ALTER TABLE public."PartsUsed"
        ADD CONSTRAINT fk_parts_used_part FOREIGN KEY (part_id)
        REFERENCES public."Parts" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- PropertyUnits -> Units
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_property_units_unit'
    ) THEN
        ALTER TABLE public."PropertyUnits"
        ADD CONSTRAINT fk_property_units_unit FOREIGN KEY (unit_id)
        REFERENCES public."Units" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- PropertyUnits -> ObservedPropertyTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_property_units_property'
    ) THEN
        ALTER TABLE public."PropertyUnits"
        ADD CONSTRAINT fk_property_units_property FOREIGN KEY (property_id)
        REFERENCES public."ObservedPropertyTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ScopesRoles -> SecurityScopes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_scopes_roles_scope'
    ) THEN
        ALTER TABLE public."ScopesRoles"
        ADD CONSTRAINT fk_scopes_roles_scope FOREIGN KEY (security_scope_id)
        REFERENCES public."SecurityScopes" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ScopesRoles -> UserRoles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_scopes_roles_role'
    ) THEN
        ALTER TABLE public."ScopesRoles"
        ADD CONSTRAINT fk_scopes_roles_role FOREIGN KEY (user_role_id)
        REFERENCES public."UserRoles" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ScreenIntervals -> WellConstructions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_screen_intervals_well_construction'
    ) THEN
        ALTER TABLE public."ScreenIntervals"
        ADD CONSTRAINT fk_screen_intervals_well_construction FOREIGN KEY (well_construction_id)
        REFERENCES public."WellConstructions" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ServicesPerformed -> MeterActivities
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_services_performed_meter_activity'
    ) THEN
        ALTER TABLE public."ServicesPerformed"
        ADD CONSTRAINT fk_services_performed_meter_activity FOREIGN KEY (meter_activity_id)
        REFERENCES public."MeterActivities" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ServicesPerformed -> ServiceTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_services_performed_service'
    ) THEN
        ALTER TABLE public."ServicesPerformed"
        ADD CONSTRAINT fk_services_performed_service FOREIGN KEY (service_type_id)
        REFERENCES public."ServiceTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- WellConstructions -> Wells
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_well_constructions_well'
    ) THEN
        ALTER TABLE public."WellConstructions"
        ADD CONSTRAINT fk_well_constructions_well FOREIGN KEY (well_id)
        REFERENCES public."Wells" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- WellMeasurements -> Wells
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_well_measurements_well'
    ) THEN
        ALTER TABLE public."WellMeasurements"
        ADD CONSTRAINT fk_well_measurements_well FOREIGN KEY (well_id)
        REFERENCES public."Wells" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- WellMeasurements -> Users (Submitting User)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_well_measurements_submitting_user'
    ) THEN
        ALTER TABLE public."WellMeasurements"
        ADD CONSTRAINT fk_well_measurements_submitting_user FOREIGN KEY (submitting_user_id)
        REFERENCES public."Users" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- WellMeasurements -> Units
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_well_measurements_unit'
    ) THEN
        ALTER TABLE public."WellMeasurements"
        ADD CONSTRAINT fk_well_measurements_unit FOREIGN KEY (unit_id)
        REFERENCES public."Units" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- WellMeasurements -> ObservedPropertyTypeLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_well_measurements_observed_property'
    ) THEN
        ALTER TABLE public."WellMeasurements"
        ADD CONSTRAINT fk_well_measurements_observed_property FOREIGN KEY (observed_property_id)
        REFERENCES public."ObservedPropertyTypeLU" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- WellRights -> Wells
-- DO $$
-- BEGIN
--     IF NOT EXISTS (
--         SELECT 1 FROM information_schema.table_constraints
--         WHERE constraint_name = 'fk_well_rights_well'
--     ) THEN
--         ALTER TABLE public."WellRights"
--         ADD CONSTRAINT fk_well_rights_well FOREIGN KEY (well_id)
--         REFERENCES public."Wells" (id)
--         ON DELETE CASCADE ON UPDATE CASCADE;
--     END IF;
-- END $$;

-- WorkOrders -> Meters
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_work_orders_meter'
    ) THEN
        ALTER TABLE public.work_orders
        ADD CONSTRAINT fk_work_orders_meter FOREIGN KEY (meter_id)
        REFERENCES public."Meters" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- WorkOrders -> WorkOrderStatusLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_work_orders_status'
    ) THEN
        ALTER TABLE public.work_orders
        ADD CONSTRAINT fk_work_orders_status FOREIGN KEY (status_id)
        REFERENCES public.work_order_status_lu (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- WorkOrders -> Users (Assigned User)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_work_orders_assigned_user'
    ) THEN
        ALTER TABLE public.work_orders
        ADD CONSTRAINT fk_work_orders_assigned_user FOREIGN KEY (assigned_user_id)
        REFERENCES public."Users" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Wells -> WellUseLU
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_wells_use_type'
    ) THEN
        ALTER TABLE public."Wells"
        ADD CONSTRAINT fk_wells_use_type FOREIGN KEY (use_type_id)
        REFERENCES public."WellUseLU" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Wells -> Locations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_wells_location'
    ) THEN
        ALTER TABLE public."Wells"
        ADD CONSTRAINT fk_wells_location FOREIGN KEY (location_id)
        REFERENCES public."Locations" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Wells -> WaterSources
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_wells_water_source'
    ) THEN
        ALTER TABLE public."Wells"
        ADD CONSTRAINT fk_wells_water_source FOREIGN KEY (water_source_id)
        REFERENCES public.water_sources (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Wells -> WellStatus
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_wells_well_status'
    ) THEN
        ALTER TABLE public."Wells"
        ADD CONSTRAINT fk_wells_well_status FOREIGN KEY (well_status_id)
        REFERENCES public.well_status (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterRegisters -> Parts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_registers_part'
    ) THEN
        ALTER TABLE public.meter_registers
        ADD CONSTRAINT fk_meter_registers_part FOREIGN KEY (part_id)
        REFERENCES public."Parts" (id)
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterRegisters -> Units (Dial Units)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_registers_dial_units'
    ) THEN
        ALTER TABLE public.meter_registers
        ADD CONSTRAINT fk_meter_registers_dial_units FOREIGN KEY (dial_units_id)
        REFERENCES public."Units" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- MeterRegisters -> Units (Totalizer Units)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_meter_registers_totalizer_units'
    ) THEN
        ALTER TABLE public.meter_registers
        ADD CONSTRAINT fk_meter_registers_totalizer_units FOREIGN KEY (totalizer_units_id)
        REFERENCES public."Units" (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
