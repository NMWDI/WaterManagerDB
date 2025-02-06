INSERT INTO
    public."LocationTypeLU" (id, type_name, description)
VALUES
    (
        '1',
        'storage',
        'A storage location for equipment.'
    ),
    ('2', 'well', 'A well location.'),
    ('3', 'weather', 'A weather monitoring site') ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."LocationTypeLU_id_seq"', 3, true);
