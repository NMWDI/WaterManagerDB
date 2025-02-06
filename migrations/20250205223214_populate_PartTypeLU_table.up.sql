INSERT INTO public."PartTypeLU" (id, name, description) VALUES
    ('1', 'Bearing', 'None given...'),
    ('2', 'Bolt', 'None given...'),
    ('3', 'Cable', 'None given...'),
    ('4', 'Canopy', 'None given...'),
    ('5', 'Chamber', 'None given...'),
    ('6', 'Clamp', 'None given...'),
    ('7', 'Connector', 'None given...'),
    ('8', 'Dry Pack', 'None given...'),
    ('9', 'FLANGE', 'None given...'),
    ('10', 'Gasket', 'None given...'),
    ('11', 'Glass', 'None given...'),
    ('12', 'Lid', 'None given...'),
    ('13', 'Nipple', 'None given...'),
    ('14', 'Piston', 'None given...'),
    ('15', 'Plate', 'None given...'),
    ('16', 'Propeller', 'Both propellers and reverse propellers'),
    ('17', 'Register', 'None given...'),
    ('18', 'VANES', 'None given...')
    ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."PartTypeLU_id_seq"', 18, true);
