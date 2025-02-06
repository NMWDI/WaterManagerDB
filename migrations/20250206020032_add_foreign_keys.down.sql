ALTER TABLE public."Users"
DROP CONSTRAINT fk_users_user_role;

ALTER TABLE public."Meters"
DROP CONSTRAINT fk_meters_meter_type;

ALTER TABLE public."Meters"
DROP CONSTRAINT fk_meters_status;

ALTER TABLE public."Meters"
DROP CONSTRAINT fk_meters_location;

ALTER TABLE public."Locations"
DROP CONSTRAINT fk_locations_type;

ALTER TABLE public."Locations"
DROP CONSTRAINT fk_locations_land_owner;

ALTER TABLE public."Alerts"
DROP CONSTRAINT fk_alerts_meter;

ALTER TABLE public."MeterActivities"
DROP CONSTRAINT fk_meter_activities_meter;

ALTER TABLE public."MeterActivities"
DROP CONSTRAINT fk_meter_activities_activity_type;

ALTER TABLE public."MeterActivities"
DROP CONSTRAINT fk_meter_activities_location;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT fk_meter_observations_meter;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT fk_meter_observations_property;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT fk_meter_observations_unit;

ALTER TABLE public."MeterObservations"
DROP CONSTRAINT fk_meter_observations_location;

ALTER TABLE public."Notes"
DROP CONSTRAINT fk_notes_meter_activity;

ALTER TABLE public."Notes"
DROP CONSTRAINT fk_notes_note_type;

ALTER TABLE public."PartAssociation"
DROP CONSTRAINT fk_part_association_meter_type;

ALTER TABLE public."PartAssociation"
DROP CONSTRAINT fk_part_association_part;

ALTER TABLE public."Parts"
DROP CONSTRAINT fk_parts_part_type;

ALTER TABLE public."PartsUsed"
DROP CONSTRAINT fk_parts_used_meter_activity;

ALTER TABLE public."PartsUsed"
DROP CONSTRAINT fk_parts_used_part;

ALTER TABLE public."PropertyUnits"
DROP CONSTRAINT fk_property_units_unit;

ALTER TABLE public."ScopesRoles"
DROP CONSTRAINT fk_scopes_roles_scope;

ALTER TABLE public."ScopesRoles"
DROP CONSTRAINT fk_scopes_roles_role;

ALTER TABLE public."ServicesPerformed"
DROP CONSTRAINT fk_services_performed_meter_activity;

ALTER TABLE public."ServicesPerformed"
DROP CONSTRAINT fk_services_performed_service;

ALTER TABLE public."WellConstructions"
DROP CONSTRAINT fk_well_constructions_well;

ALTER TABLE public."WellMeasurements"
DROP CONSTRAINT fk_well_measurements_well;

ALTER TABLE public."WellRights"
DROP CONSTRAINT fk_well_rights_well;

ALTER TABLE public.work_orders
DROP CONSTRAINT fk_work_orders_meter;

ALTER TABLE public.work_orders
DROP CONSTRAINT fk_work_orders_status;

ALTER TABLE public.work_orders
DROP CONSTRAINT fk_work_orders_assigned_user;

ALTER TABLE public."Wells"
DROP CONSTRAINT fk_wells_use_type;

ALTER TABLE public."Wells"
DROP CONSTRAINT fk_wells_location;

ALTER TABLE public."Wells"
DROP CONSTRAINT fk_wells_water_source;

ALTER TABLE public."Wells"
DROP CONSTRAINT fk_wells_well_status;
