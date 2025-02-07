DELETE FROM public."LocationTypeLU"
WHERE id IN (1, 2, 3);

SELECT
    setval(
        'public."LocationTypeLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM public."LocationTypeLU"
            ),
            1
        ),
        FALSE
    );
