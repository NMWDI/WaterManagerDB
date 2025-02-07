WITH
    inserted_rows AS (
        INSERT INTO public."LocationTypeLU"
            (id, type_name, description)
        VALUES
            ('1', 'storage', 'A storage location for equipment.'),
            ('2', 'well', 'A well location.'),
            ('3', 'weather', 'A weather monitoring site')
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT
    setval('public."ActivityTypeLU_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
