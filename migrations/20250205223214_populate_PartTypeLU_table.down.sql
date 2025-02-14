DELETE FROM public."PartTypeLU"
WHERE id BETWEEN 1 AND 18;

SELECT
    setval(
        'public."PartTypeLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM public."PartTypeLU"
            ),
            1
        ),
        FALSE
    );
