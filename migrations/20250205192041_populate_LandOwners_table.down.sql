DELETE FROM public."LandOwners"
WHERE
    id BETWEEN 1 AND 239;

SELECT
    setval (
        'public."LandOwners_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."LandOwners"
            ),
            1
        ),
        false
    );
