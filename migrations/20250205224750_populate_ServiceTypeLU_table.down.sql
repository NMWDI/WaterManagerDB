DELETE FROM public."ServiceTypeLU"
WHERE id IN (1, 3, 4, 5, 10, 11);

SELECT
    setval(
        'public."ServiceTypeLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM public."ServiceTypeLU"
            ),
            1
        ),
        FALSE
    );
