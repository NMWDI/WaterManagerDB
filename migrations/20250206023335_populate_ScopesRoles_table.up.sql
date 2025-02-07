WITH
    inserted_rows AS (
        INSERT INTO public."ScopesRoles"
            (security_scope_id, user_role_id, id)
        VALUES
            ('6', '2', '1'),
            ('2', '2', '2'),
            ('3', '2', '3'),
            ('4', '2', '4'),
            ('5', '2', '5'),
            ('7', '2', '6'),
            ('1', '2', '7'),
            ('7', '3', '9'),
            ('6', '1', '10'),
            ('2', '1', '11'),
            ('3', '1', '12'),
            ('4', '1', '13'),
            ('5', '1', '14'),
            ('8', '1', '15'),
            ('8', '2', '16')
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
SELECT setval('public."ScopesRoles_id_seq"', COALESCE(MAX(id), 1), TRUE)
FROM inserted_rows;
