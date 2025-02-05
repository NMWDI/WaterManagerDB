DELETE FROM public."Meters"
WHERE
    id BETWEEN 1 AND 6193;

SELECT
    setval (
        'public."Meters_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."Meters"
            ),
            1
        ),
        false
    );
