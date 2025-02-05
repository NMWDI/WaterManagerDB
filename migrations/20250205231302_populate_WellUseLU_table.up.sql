INSERT INTO
    public."WellUseLU" (id, use_type, code, description)
VALUES
    (
        '1',
        'Commercial',
        'COM-Commercial',
        'Commercial use of water.'
    ),
    (
        '2',
        'Dairy',
        'DAI-Dairy Operation',
        'Dairy use of water.'
    ),
    (
        '3',
        'Domestic',
        'DOM-Domestic',
        'Domestic use of water.'
    ),
    (
        '4',
        'Fish and Game',
        'FGP-Fish & Game Prop',
        'Water used by department of Fish and Game.'
    ),
    (
        '5',
        'Irrigation',
        'IRR-Irrigation',
        'Water used for irrigation.'
    ),
    (
        '6',
        'Unused',
        'NOT-No Use of Right',
        'Water right not used.'
    ),
    (
        '7',
        'Municipal',
        'MUN-Municipal',
        'Water used for municipal purposes.'
    ),
    (
        '8',
        'Oil Production',
        'OIL-Oil Production',
        'Water used for oil production.'
    ),
    (
        '9',
        'Recreation',
        'REC-Recreation',
        'Water used for recreation.'
    ),
    (
        '10',
        'School',
        'SCH-School Use',
        'Water used for school purposes.'
    ),
    (
        '11',
        'Monitoring',
        'MON-Monitoring',
        'Well used for groundwater monitoring.'
    ) ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."WellUseLU_id_seq"', 11, true);
