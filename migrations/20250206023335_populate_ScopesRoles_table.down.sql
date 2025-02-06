DELETE FROM public."ScopesRoles"
WHERE
    id BETWEEN 1 AND 16;

SELECT
    setval (
        'public."ScopesRoles_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."ScopesRoles"
            ),
            1
        ),
        false
    );
