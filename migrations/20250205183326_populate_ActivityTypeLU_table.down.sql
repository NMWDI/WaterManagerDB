DELETE FROM public."ActivityTypeLU"
WHERE
    id IN (1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12);

SELECT
    setval (
        'public."ActivityTypeLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."ActivityTypeLU"
            ),
            1
        ),
        false
    );
