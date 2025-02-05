DELETE FROM public."Locations"
WHERE
    id BETWEEN 1 AND 2611;

SELECT
    setval (
        'public."Locations_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."Locations"
            ),
            1
        ),
        false
    );
