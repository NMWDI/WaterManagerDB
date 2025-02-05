DELETE FROM public."Notes"
WHERE
    id BETWEEN 1 AND 24751;

SELECT
    setval (
        'public."Notes_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."Notes"
            ),
            1
        ),
        false
    );
