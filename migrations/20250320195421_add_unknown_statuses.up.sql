-- Add 'unknown' status to the well_status and WellUseLU tables
INSERT INTO "WellUseLU" (id, use_type, code, description) VALUES (12, 'Unknown', 'UNK', 'Use type is unknown');
INSERT INTO "well_status" (id, status, description) VALUES (5, 'unknown', 'Well status is unknown');

