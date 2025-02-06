INSERT INTO
    public."water_sources" (id, name, description)
VALUES
    ('1', 'Artesian', 'Well source is artesian'),
    (
        '2',
        'Shallow Aquifer',
        'Well source shallow and not artesian'
    ),
    (
        '3',
        'Surface',
        'Water source is river or other surface water'
    ) ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."water_sources_id_seq"', 3, true);
