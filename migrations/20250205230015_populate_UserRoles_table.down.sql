DELETE FROM public."UserRoles"
WHERE id IN (1, 2, 3);

SELECT
    setval(
        'public."UserRoles_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM public."UserRoles"
            ),
            1
        ),
        FALSE
    );
