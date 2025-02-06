DELETE FROM public."work_order_status_lu"
WHERE
    id IN (1, 2, 3);

SELECT
    setval (
        'public."work_order_status_lu_id_seq"',
        COALESCE(
            (
                SELECT
                    MAX(id)
                FROM
                    public."work_order_status_lu"
            ),
            1
        ),
        false
    );
