DELETE FROM public."MeterTypeLU"
WHERE id BETWEEN 1 AND 43;

SELECT
    setval(
        'public."MeterTypeLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM public."MeterTypeLU"
            ),
            1
        ),
        FALSE
    );
