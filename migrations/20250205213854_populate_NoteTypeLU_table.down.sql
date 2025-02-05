DELETE FROM public."NoteTypeLU"
WHERE
    id BETWEEN 1 AND 30;

SELECT
    setval (
        'public."NoteTypeLU_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."NoteTypeLU"
            ),
            1
        ),
        false
    );
