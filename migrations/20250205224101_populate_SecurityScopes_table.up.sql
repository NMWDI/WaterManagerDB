WITH
    inserted_rows AS (
        INSERT INTO public."SecurityScopes"
            (id, scope_string, description)
        VALUES
            ('1', 'admin', 'Admin-specific scope.'),
            ('2', 'meter:write', 'Write meters'),
            ('3', 'activities:write', 'Write activities'),
            (
                '4',
                'well_measurement:write',
                'Write well measurements, i.e. Water Levels and Chlorides'
            ),
            ('5', 'reports:run', 'Run reports'),
            ('6', 'read', 'Read all data.'),
            ('7', 'ose', 'Scope given to the OSE'),
            ('8', 'well:write', 'Update well information')
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT setval('public."SecurityScopes_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
