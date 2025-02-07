DELETE FROM public."WellUseLU"
WHERE id BETWEEN 1 AND 11;

SELECT
    setval(
        'public."WellUseLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM public."WellUseLU"
            ),
            1
        ),
        FALSE
    );
