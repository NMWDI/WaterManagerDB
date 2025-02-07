WITH
    inserted_rows AS (
        INSERT INTO public."ObservedPropertyTypeLU"
            (id, name, description, context)
        VALUES
            ('1', 'Meter reading', 'The current meter value', 'meter'),
            (
                '2',
                'Energy reading',
                'The current value of the device powering the meter',
                'meter'
            ),
            (
                '3',
                'Pipe condition',
                'The condition of the discharge pipe from 0 to 100 with 0 needing replacement.',
                'meter'
            ),
            (
                '4',
                'Depth to water',
                'Depth to water below ground surface',
                'well'
            ),
            (
                '5',
                'Chloride Concentration',
                'The amount of chlorides present in a sample of water',
                'well'
            ),
            (
                '7',
                'Well distance',
                'The distance of the meter from the well head.',
                'meter'
            )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT
    setval('public."ObservedPropertyTypeLU_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
