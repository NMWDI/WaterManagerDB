ALTER TABLE public."Users"
DROP CONSTRAINT IF EXISTS fk_users_user_role;

ALTER TABLE public."Meters"
DROP CONSTRAINT IF EXISTS fk_meters_meter_type;

ALTER TABLE public."Meters"
DROP CONSTRAINT IF EXISTS fk_meters_status;

ALTER TABLE public."Meters"
DROP CONSTRAINT IF EXISTS fk_meters_location;

ALTER TABLE public."Meters"
DROP CONSTRAINT IF EXISTS fk_meters_well;

ALTER TABLE public."Meters"
DROP CONSTRAINT IF EXISTS fk_meters_register;

ALTER TABLE public."Locations"
DROP CONSTRAINT IF EXISTS fk_locations_type;

ALTER TABLE public."Locations"
DROP CONSTRAINT IF EXISTS fk_locations_land_owner;

ALTER TABLE public."Alerts"
DROP CONSTRAINT IF EXISTS fk_alerts_meter;

ALTER TABLE public."MeterActivities"
DROP CONSTRAINT IF EXISTS fk_meter_activities_meter;

ALTER TABLE public."MeterActivities"
DROP CONSTRAINT IF EXISTS fk_meter_activities_activity_type;

ALTER TABLE public."MeterActivities"
DROP CONSTRAINT IF EXISTS fk_meter_activities_location;

ALTER TABLE public."MeterActivities"
DROP CONSTRAINT IF EXISTS fk_meter_activities_submitting_user;

ALTER TABLE public."MeterActivities"
DROP CONSTRAINT IF EXISTS fk_meter_activities_work_order;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT IF EXISTS fk_meter_observations_meter;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT IF EXISTS fk_meter_observations_property;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT IF EXISTS fk_meter_observations_unit;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT IF EXISTS fk_meter_observations_location;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT IF EXISTS fk_meter_observations_submitting_user;

ALTER TABLE public."Notes"
DROP CONSTRAINT IF EXISTS fk_notes_meter_activity;

ALTER TABLE public."Notes"
DROP CONSTRAINT IF EXISTS fk_notes_note_type;

ALTER TABLE public."PartAssociation"
DROP CONSTRAINT IF EXISTS fk_part_association_meter_type;

ALTER TABLE public."PartAssociation"
DROP CONSTRAINT IF EXISTS fk_part_association_part;

ALTER TABLE public."Parts"
DROP CONSTRAINT IF EXISTS fk_parts_part_type;

ALTER TABLE public."PartsUsed"
DROP CONSTRAINT IF EXISTS fk_parts_used_meter_activity;

ALTER TABLE public."PartsUsed"
DROP CONSTRAINT IF EXISTS fk_parts_used_part;

ALTER TABLE public."PropertyUnits"
DROP CONSTRAINT IF EXISTS fk_property_units_unit;

ALTER TABLE public."PropertyUnits"
DROP CONSTRAINT IF EXISTS fk_property_units_property;

ALTER TABLE public."ScopesRoles"
DROP CONSTRAINT IF EXISTS fk_scopes_roles_scope;

ALTER TABLE public."ScopesRoles"
DROP CONSTRAINT IF EXISTS fk_scopes_roles_role;

ALTER TABLE public."ScreenIntervals"
DROP CONSTRAINT IF EXISTS fk_screen_intervals_well_construction;

ALTER TABLE public."ServicesPerformed"
DROP CONSTRAINT IF EXISTS fk_services_performed_meter_activity;

ALTER TABLE public."ServicesPerformed"
DROP CONSTRAINT IF EXISTS fk_services_performed_service;

ALTER TABLE public."WellConstructions"
DROP CONSTRAINT IF EXISTS fk_well_constructions_well;

ALTER TABLE public."WellMeasurements"
DROP CONSTRAINT IF EXISTS fk_well_measurements_well;

ALTER TABLE public."WellMeasurements"
DROP CONSTRAINT IF EXISTS fk_well_measurements_submitting_user;

ALTER TABLE public."WellMeasurements"
DROP CONSTRAINT IF EXISTS fk_well_measurements_unit;

ALTER TABLE public."WellMeasurements"
DROP CONSTRAINT IF EXISTS fk_well_measurements_observed_property;

ALTER TABLE public."WellRights"
DROP CONSTRAINT IF EXISTS fk_well_rights_well;

ALTER TABLE public.work_orders
DROP CONSTRAINT IF EXISTS fk_work_orders_meter;

ALTER TABLE public.work_orders
DROP CONSTRAINT IF EXISTS fk_work_orders_status;

ALTER TABLE public.work_orders
DROP CONSTRAINT IF EXISTS fk_work_orders_assigned_user;

ALTER TABLE public."Wells"
DROP CONSTRAINT IF EXISTS fk_wells_use_type;

ALTER TABLE public."Wells"
DROP CONSTRAINT IF EXISTS fk_wells_location;

ALTER TABLE public."Wells"
DROP CONSTRAINT IF EXISTS fk_wells_water_source;

ALTER TABLE public."Wells"
DROP CONSTRAINT IF EXISTS fk_wells_well_status;

ALTER TABLE public.meter_registers
DROP CONSTRAINT IF EXISTS fk_meter_registers_part;

ALTER TABLE public.meter_registers
DROP CONSTRAINT IF EXISTS fk_meter_registers_dial_units;

ALTER TABLE public.meter_registers
DROP CONSTRAINT IF EXISTS fk_meter_registers_totalizer_units;
