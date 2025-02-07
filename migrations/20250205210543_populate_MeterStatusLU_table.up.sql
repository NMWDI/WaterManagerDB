WITH
    inserted_rows AS (
        INSERT INTO public."MeterStatusLU" (id, status_name, description)
        VALUES
            (1, 'Installed', 'Meter is installed and is active'),
            (2, 'Warehouse', 'Meter is in storage in warehouse'),
            (3, 'Scrapped', 'Meter has been dismantled'),
            (4, 'Returned', 'Meter returned to manufacturer'),
            (5, 'Sold', 'Meter has been sold'),
            (6, 'Unknown', 'Status unknown'),
            (
                8,
                'On Hold',
                'Meter is on hold and will be re-installed at previous site.'
            )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT setval('public."MeterStatusLU_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
