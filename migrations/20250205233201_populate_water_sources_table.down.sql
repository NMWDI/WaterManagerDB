DELETE FROM public."water_sources"
WHERE
    id IN (1, 2, 3);

SELECT
    setval (
        'public."water_sources_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."water_sources"
            ),
            1
        ),
        false
    );
