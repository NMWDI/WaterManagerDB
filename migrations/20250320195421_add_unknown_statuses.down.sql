-- Remove 'unknown' status from the well_status and WellUseLU tables
DELETE FROM "WellUseLU" WHERE use_type = 'Unknown' AND code = 'UNK';
DELETE FROM "well_status" WHERE status = 'unknown';
