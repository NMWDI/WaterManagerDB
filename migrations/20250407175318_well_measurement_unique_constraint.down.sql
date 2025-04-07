-- Remove unique_well_measurement constraint from the well_measurement table
ALTER TABLE "WellMeasurements"
DROP CONSTRAINT unique_well_measurement;
