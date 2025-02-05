DELETE FROM public."MeterStatusLU"
WHERE
    id IN (1, 2, 3, 4, 5, 6, 7, 8);

SELECT
    setval (
        'public."MeterStatusLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."MeterStatusLU"
            ),
            1
        ),
        false
    );
