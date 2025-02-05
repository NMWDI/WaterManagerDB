INSERT INTO public."NoteTypeLU" (id, note, details, slug, commonly_used) VALUES
    ('4', 'Pumping Sand', 'Pumping sand. Meter may need a sand trap.', 'null', 'f'),
    ('5', 'Variable Speed Control', 'Meter is attached to a pump with a variable speed controller', 'null', 'f'),
    ('7', 'Register Needle Broken', 'Register needle has been broken.', 'null', 'f'),
    ('8', 'Not pumping', 'Not pumping despite pump being on.', 'null', 'f'),
    ('9', 'Weeds', 'Weeds Obstructing Meter', 'null', 'f'),
    ('10', 'Back Pressure', 'Back Pressure', 'null', 'f'),
    ('11', 'Valve Pinched', 'Valve Pinched Down', 'null', 'f'),
    ('13', 'Canopy Moisture', 'Moisture in Canopy', 'null', 'f'),
    ('14', 'Working on Arrival', 'Meter was working when technician arrived', 'working', 'f'),
    ('15', 'Not Working on Arrival', 'Meter was not working when technician arrived', 'not-working', 'f'),
    ('16', 'Working Status Not Checked', 'not-checked', 'not-checked', 'f'),
    ('17', 'Pipe obstruction', 'Pipe is obstructed and water flow is either low or non-existent', 'null', 'f'),
    ('18', 'Customer Owned Meter', 'Meter has been sold to a customer.', NULL, 'f'),
    ('19', 'No Meter Found at Location', 'No Meter Found at Location', NULL, 'f'),
    ('20', 'Well Surging', NULL, NULL, 'f'),
    ('21', 'Sulfur Well', NULL, NULL, 'f'),
    ('22', 'Straightening Veins', NULL, NULL, 'f'),
    ('23', 'Canopy Boot', NULL, NULL, 'f'),
    ('1', 'Meter Damaged', 'Meter Damaged', 'null', 't'),
    ('3', 'Low Flow', 'Water flow is low and may be too low for meter', 'null', 't'),
    ('6', 'Pump off', 'Pump is shut off.', 'null', 'f'),
    ('25', 'Seal Missing', 'Seal on meter is missing.', NULL, 'f'),
    ('26', 'New discharge needed', 'Well needs a new discharge pipe', NULL, 't'),
    ('27', 'Check valve not holding', 'Check value not holding.', NULL, 't'),
    ('28', 'Backflow', 'Water flowing backward in pipe.', NULL, 't'),
    ('29', 'OSE letter needed', 'Water user needs to be alerted to a problem by OSE.', NULL, 't'),
    ('2', 'Vibration', 'Meter has unusual vibration.', 'null', 'f'),
    ('24', 'Verified Register Ratio', 'Verify that the meter has a register with the correct ratio for site, typically gallons to AF.', NULL, 't'),
    ('30', 'Discharge size changed', 'Irrigator has changed the well discharge size.', NULL, 'f')
    ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."NoteTypeLU_id_seq"', 30, true);
