WITH
    inserted_rows AS (
        INSERT INTO public."ServiceTypeLU"
            (id, service_name, description)
        VALUES
            ('3', 'Remove moisture', 'Removed moisture'),
            ('4', 'Grease Bearing', 'Grease Bearing'),
            ('5', 'Tighten Register', 'Tighten Register'),
            ('10', 'Remove Debris', NULL),
            ('11', 'Tighten U-bolts', NULL),
            ('1', 'Remove Sand', 'Remove sand')
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT setval('public."ServiceTypeLU_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
