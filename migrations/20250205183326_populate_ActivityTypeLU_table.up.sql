WITH
    inserted_rows AS (
        INSERT INTO public."ActivityTypeLU"
            (id, name, description, permission)
        VALUES
            (1, 'Install', 'Install meter at a location', 'technician'),
            (2, 'Uninstall', 'Remove meter from a location', 'technician'),
            (
                4,
                'Preventative Maintenance',
                'Annual preventative maintenance',
                'technician'
            ),
            (5, 'Repair', 'Repair meter', 'technician'),
            (6, 'Rate Meter', 'Test meter with known flow rate', 'technician'),
            (7, 'Sell', 'Sell meter', 'admin'),
            (8, 'Scrap', 'Scrap meter', 'admin'),
            (
                9,
                'Location Only',
                'A visit to a site for a meter and electrical reading.',
                'technician'
            ),
            (
                10,
                'Change Water Users',
                'Change what water users are associated with meter',
                'admin'
            ),
            (
                11,
                'Re-install',
                'Reinstall meter that has been moved by irrigator or contractor.',
                'technician'
            ),
            (
                12,
                'Uninstall and Hold',
                'Uninstall meter with plans for future re-installation at the same site.',
                'technician'
            )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT
    setval('public."ActivityTypeLU_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
