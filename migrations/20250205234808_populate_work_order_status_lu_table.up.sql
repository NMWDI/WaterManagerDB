INSERT INTO
    public."work_order_status_lu" (id, name, description)
VALUES
    ('1', 'Open', 'Work order needs addressing.'),
    ('2', 'Closed', 'Work order finished.'),
    (
        '3',
        'Review',
        'Work order ready for review by admin.'
    ) ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."work_order_status_lu_id_seq"', 3, true);
