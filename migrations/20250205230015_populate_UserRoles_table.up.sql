WITH
    inserted_rows AS (
        INSERT INTO public."UserRoles"
            (id, name)
        VALUES
            ('1', 'Technician'),
            ('2', 'Admin'),
            ('3', 'OSE')
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT setval('public."UserRoles_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
