DELETE FROM public."MeterActivities"
WHERE
    id BETWEEN 1 AND 29311;

SELECT
    setval (
        'public."MeterActivities_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."MeterActivities"
            ),
            1
        ),
        false
    );
