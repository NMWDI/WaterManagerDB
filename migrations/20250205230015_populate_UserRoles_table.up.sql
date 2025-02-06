INSERT INTO
    public."UserRoles" (id, name)
VALUES
    ('1', 'Technician'),
    ('2', 'Admin'),
    ('3', 'OSE') ON CONFLICT (id) DO NOTHING;

SELECT
    setval ('public."UserRoles_id_seq"', 3, true);
