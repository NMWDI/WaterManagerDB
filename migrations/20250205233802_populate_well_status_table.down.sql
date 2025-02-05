DELETE FROM public."well_status"
WHERE
    id IN (1, 2, 3, 4);

SELECT
    setval (
        'public."well_status_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."well_status"
            ),
            1
        ),
        false
    );
