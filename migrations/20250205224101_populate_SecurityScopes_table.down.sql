DELETE FROM public."SecurityScopes"
WHERE
    id IN (1, 2, 3, 4, 5, 6, 7, 8);

SELECT
    setval (
        'public."SecurityScopes_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."SecurityScopes"
            ),
            1
        ),
        false
    );
