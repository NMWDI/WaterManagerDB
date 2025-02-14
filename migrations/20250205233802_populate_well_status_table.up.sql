WITH
    inserted_rows AS (
        INSERT INTO public."well_status"
            (id, status, description)
        VALUES
            ('1', 'active', 'Currently in use'),
            ('2', 'inactive', 'Well not in use'),
            ('3', 'collapsed', 'Well has collapsed'),
            ('4', 'plugged', 'Well has been intentionally plugged')
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT setval('public."well_status_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
