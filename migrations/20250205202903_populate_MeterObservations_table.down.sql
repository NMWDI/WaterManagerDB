DELETE FROM public."MeterObservations"
WHERE
    id BETWEEN 1 AND 55267;

SELECT
    setval (
        'public."MeterObservations_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."MeterObservations"
            ),
            1
        ),
        false
    );
