-- Users -> UserRoles
ALTER TABLE public."Users" ADD CONSTRAINT fk_users_user_role FOREIGN KEY (user_role_id) REFERENCES public."UserRoles" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Meters -> MeterTypeLU
ALTER TABLE public."Meters" ADD CONSTRAINT fk_meters_meter_type FOREIGN KEY (meter_type_id) REFERENCES public."MeterTypeLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Meters -> MeterStatusLU
ALTER TABLE public."Meters" ADD CONSTRAINT fk_meters_status FOREIGN KEY (status_id) REFERENCES public."MeterStatusLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Meters -> Locations
ALTER TABLE public."Meters" ADD CONSTRAINT fk_meters_location FOREIGN KEY (location_id) REFERENCES public."Locations" (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Locations -> LocationTypeLU
ALTER TABLE public."Locations" ADD CONSTRAINT fk_locations_type FOREIGN KEY (type_id) REFERENCES public."LocationTypeLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Locations -> LandOwners
ALTER TABLE public."Locations" ADD CONSTRAINT fk_locations_land_owner FOREIGN KEY (land_owner_id) REFERENCES public."LandOwners" (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Alerts -> Meters
ALTER TABLE public."Alerts" ADD CONSTRAINT fk_alerts_meter FOREIGN KEY (meter_id) REFERENCES public."Meters" (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- MeterActivities -> Meters
ALTER TABLE public."MeterActivities" ADD CONSTRAINT fk_meter_activities_meter FOREIGN KEY (meter_id) REFERENCES public."Meters" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- MeterActivities -> ActivityTypeLU
ALTER TABLE public."MeterActivities" ADD CONSTRAINT fk_meter_activities_activity_type FOREIGN KEY (activity_type_id) REFERENCES public."ActivityTypeLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- MeterActivities -> Locations
ALTER TABLE public."MeterActivities" ADD CONSTRAINT fk_meter_activities_location FOREIGN KEY (location_id) REFERENCES public."Locations" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- MeterObservations -> Meters
ALTER TABLE public."MeterObservations" ADD CONSTRAINT fk_meter_observations_meter FOREIGN KEY (meter_id) REFERENCES public."Meters" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- MeterObservations -> ObservedPropertyTypeLU
ALTER TABLE public."MeterObservations" ADD CONSTRAINT fk_meter_observations_property FOREIGN KEY (observed_property_type_id) REFERENCES public."ObservedPropertyTypeLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- MeterObservations -> Units
ALTER TABLE public."MeterObservations" ADD CONSTRAINT fk_meter_observations_unit FOREIGN KEY (unit_id) REFERENCES public."Units" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- MeterObservations -> Locations
ALTER TABLE public."MeterObservations" ADD CONSTRAINT fk_meter_observations_location FOREIGN KEY (location_id) REFERENCES public."Locations" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Notes -> MeterActivities
ALTER TABLE public."Notes" ADD CONSTRAINT fk_notes_meter_activity FOREIGN KEY (meter_activity_id) REFERENCES public."MeterActivities" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Notes -> NoteTypeLU
ALTER TABLE public."Notes" ADD CONSTRAINT fk_notes_note_type FOREIGN KEY (note_type_id) REFERENCES public."NoteTypeLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- PartAssociation -> MeterTypeLU
ALTER TABLE public."PartAssociation" ADD CONSTRAINT fk_part_association_meter_type FOREIGN KEY (meter_type_id) REFERENCES public."MeterTypeLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- PartAssociation -> Parts
ALTER TABLE public."PartAssociation" ADD CONSTRAINT fk_part_association_part FOREIGN KEY (part_id) REFERENCES public."Parts" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Parts -> PartTypeLU
ALTER TABLE public."Parts" ADD CONSTRAINT fk_parts_part_type FOREIGN KEY (part_type_id) REFERENCES public."PartTypeLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- PartsUsed -> MeterActivities
ALTER TABLE public."PartsUsed" ADD CONSTRAINT fk_parts_used_meter_activity FOREIGN KEY (meter_activity_id) REFERENCES public."MeterActivities" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- PartsUsed -> Parts
ALTER TABLE public."PartsUsed" ADD CONSTRAINT fk_parts_used_part FOREIGN KEY (part_id) REFERENCES public."Parts" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- PropertyUnits -> Units
ALTER TABLE public."PropertyUnits" ADD CONSTRAINT fk_property_units_unit FOREIGN KEY (unit_id) REFERENCES public."Units" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- ScopesRoles -> SecurityScopes
ALTER TABLE public."ScopesRoles" ADD CONSTRAINT fk_scopes_roles_scope FOREIGN KEY (security_scope_id) REFERENCES public."SecurityScopes" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- ScopesRoles -> UserRoles
ALTER TABLE public."ScopesRoles" ADD CONSTRAINT fk_scopes_roles_role FOREIGN KEY (user_role_id) REFERENCES public."UserRoles" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- ServicesPerformed -> MeterActivities
ALTER TABLE public."ServicesPerformed" ADD CONSTRAINT fk_services_performed_meter_activity FOREIGN KEY (meter_activity_id) REFERENCES public."MeterActivities" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- ServicesPerformed -> ServiceTypeLU
ALTER TABLE public."ServicesPerformed" ADD CONSTRAINT fk_services_performed_service FOREIGN KEY (service_type_id) REFERENCES public."ServiceTypeLU" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- WellConstructions -> Wells
ALTER TABLE public."WellConstructions" ADD CONSTRAINT fk_well_constructions_well FOREIGN KEY (well_id) REFERENCES public."Wells" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- WellMeasurements -> Wells
ALTER TABLE public."WellMeasurements" ADD CONSTRAINT fk_well_measurements_well FOREIGN KEY (well_id) REFERENCES public."Wells" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- WellRights -> Wells
ALTER TABLE public."WellRights" ADD CONSTRAINT fk_well_rights_well FOREIGN KEY (well_id) REFERENCES public."Wells" (id) ON DELETE CASCADE ON UPDATE CASCADE;
