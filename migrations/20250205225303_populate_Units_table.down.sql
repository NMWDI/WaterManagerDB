DELETE FROM public."Units"
WHERE id BETWEEN 1 AND 13;

SELECT
    setval(
        'public."Units_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM public."Units"
            ),
            1
        ),
        FALSE
    );
