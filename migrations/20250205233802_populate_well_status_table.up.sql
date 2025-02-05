INSERT INTO
    public."well_status" (id, status, description)
VALUES
    ('1', 'active', 'Currently in use'),
    ('2', 'inactive', 'Well not in use'),
    ('3', 'collapsed', 'Well has collapsed'),
    (
        '4',
        'plugged',
        'Well has been intentionally plugged'
    ) ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."well_status_id_seq"', 4, true);
