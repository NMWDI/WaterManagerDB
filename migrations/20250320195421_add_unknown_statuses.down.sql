-- Change use_type_id and wells_status_id to NULL where use_type_id = 12 and wells_status_id = 5
UPDATE "Wells" SET use_type_id = NULL WHERE use_type_id = 12;
UPDATE "Wells" SET well_status_id = NULL WHERE well_status_id = 5;

-- Remove 'unknown' status from the well_status and WellUseLU tables
DELETE FROM "WellUseLU" WHERE use_type = 'Unknown' AND code = 'UNK';
DELETE FROM "well_status" WHERE status = 'unknown';

