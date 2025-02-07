DELETE FROM public."ObservedPropertyTypeLU"
WHERE id IN (1, 2, 3, 4, 5, 7);

SELECT
    setval(
        'public."ObservedPropertyTypeLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM public."ObservedPropertyTypeLU"
            ),
            1
        ),
        FALSE
    );
