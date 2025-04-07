-- Add a unique constraint to the well_measurement table based on timestamp, observed_property_id, and well_id
ALTER TABLE "WellMeasurements"
ADD CONSTRAINT unique_well_measurement
UNIQUE (timestamp, value, observed_property_id, well_id);
-- This ensures that there are no duplicate entries for the same timestamp, observed property, and well combination.
-- This is important for maintaining data integrity and ensuring that each measurement is unique.
