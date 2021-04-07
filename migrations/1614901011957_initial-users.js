exports.up = pgm => {
    pgm.sql`
        WITH new_entity as (
            INSERT INTO public.entitys (id_entity, name)
                    VALUES (4::integer,'Presidente'::character varying)
                    RETURNING id_entity
        ), new_user as (
            INSERT INTO users (username, name, password_hash, email, lastname, id_entity, special_user)
            SELECT 'presidente', 'Mauro', '$argon2i$v=19$m=4096,t=10,p=1$WqJSbCkALZXn/b6azjtBxQ$jTgdpn7gZa3zosJCza/ACO6fGCI+ygO1wA3a2fb7XVU','un-def', 'D''Agostini', id_entity, TRUE
            FROM new_entity
            RETURNING user_id
        ), new_role as (
            INSERT INTO roles (name) VALUES ('presidencia') RETURNING role_id
        ), t as (
            INSERT INTO join_users_roles (user_id, role_id)
            SELECT user_id, role_id FROM new_user, new_role
        ), t1 as (
            INSERT INTO balances (id_account, id_entity)
            SELECT id_account, id_entity FROM accounts, new_entity
        )
        INSERT INTO join_roles_permissions (role_id, permission_id)
        SELECT role_id, permission_id FROM new_role, permissions
        WHERE permissions.name = 'president'
        ;

        ALTER SEQUENCE entitys_id_entity_seq RESTART WITH 5;
        
        WITH new_entity as (
            INSERT INTO public.entitys (name)
                    VALUES ('Rosalba'::character varying)
                    RETURNING id_entity
        ), new_user as (
            INSERT INTO users (username, name, password_hash, email, lastname, id_entity)
            SELECT 'rosalba', 'Rosalba', '$argon2i$v=19$m=4096,t=10,p=1$WqJSbCkALZXn/b6azjtBxQ$jTgdpn7gZa3zosJCza/ACO6fGCI+ygO1wA3a2fb7XVU','undefined', 'D''Agostini', id_entity
            FROM new_entity
            RETURNING user_id
        ), new_role as (
            INSERT INTO roles (name) VALUES ('cambio de moneda') RETURNING role_id
        ), t as (
            INSERT INTO join_users_roles (user_id, role_id)
            SELECT user_id, role_id FROM new_user, new_role
        ), t1 as (
            INSERT INTO balances (id_account, id_entity)
            SELECT id_account, id_entity FROM accounts, new_entity
        )
        INSERT INTO join_roles_permissions (role_id, permission_id)
        SELECT role_id, permission_id FROM new_role, permissions
        WHERE permissions.name = 'exchange_currency_create'
        ;
        
        WITH new_entity as (
            INSERT INTO public.entitys (name)
                    VALUES ('Ramon'::character varying)
                    RETURNING id_entity
        ), new_user as (
            INSERT INTO users (username, name, password_hash, email, lastname, id_entity)
            SELECT 'ramon', 'Ramón', '$argon2i$v=19$m=4096,t=10,p=1$WqJSbCkALZXn/b6azjtBxQ$jTgdpn7gZa3zosJCza/ACO6fGCI+ygO1wA3a2fb7XVU','null', 'Guaricuco', id_entity
            FROM new_entity
            RETURNING user_id
        ), new_role as (
            INSERT INTO roles (name) VALUES ('supervisor') RETURNING role_id
        ), t as (
            INSERT INTO join_users_roles (user_id, role_id)
            SELECT user_id, role_id FROM new_user, new_role
        ), t1 as (
            INSERT INTO balances (id_account, id_entity)
            SELECT id_account, id_entity FROM accounts, new_entity
        )
        INSERT INTO join_roles_permissions (role_id, permission_id)
        SELECT role_id, permission_id FROM new_role, permissions
        WHERE permissions.name IN ( 
                                    'storages_create', 
                                    'stocks_read', 
                                    'inv_purchases_create', 
                                    'new_odt_create', 
                                    'general_expenses_create', 
                                    'admin_expenses_create', 
                                    'inv_odt_expenses_create'
                                    );

        -- WITH new_user as (
        --     INSERT INTO users (username, name, password_hash, email, lastname) VALUES ('ramon', 'Ramón', '$argon2i$v=19$m=4096,t=10,p=1$WqJSbCkALZXn/b6azjtBxQ$jTgdpn7gZa3zosJCza/ACO6fGCI+ygO1wA3a2fb7XVU','null', 'Guaricuco') RETURNING user_id
        -- ), new_role as (
        --     INSERT INTO roles (name) VALUES ('supervisor') RETURNING role_id
        -- ), t as (
        --     INSERT INTO join_users_roles (user_id, role_id)
        --     SELECT user_id, role_id FROM new_user, new_role
        -- ), _t as(
        -- INSERT INTO public.entitys (name)
        --         VALUES ('ramon'::character varying)
        --         RETURNING id_entity;
        -- )

        -- INSERT INTO join_roles_permissions (role_id, permission_id)
        -- SELECT role_id, permission_id FROM new_role, permissions
        -- WHERE permissions.name IN ( 
        --                             'storages_create', 
        --                             'stocks_read', 
        --                             'inv_purchases_create', 
        --                             'new_odt_create', 
        --                             'general_expenses_create', 
        --                             'admin_expenses_create', 
        --                             'inv_odt_expenses_create'
        --                             );

        `
};

exports.down = pgm => {
    pgm.sql`

        DELETE FROM general_expenses;
        DELETE FROM balance_movements;
        DELETE FROM balances;
        DELETE FROM supervisor_closure_odts;
        DELETE FROM operative_closure_odts;
        DELETE FROM admin_closure_odts;
        DELETE FROM closure_odts;
        DELETE FROM odts;
        DELETE FROM users WHERE username IN ('rosalba', 'ramon');
        DELETE FROM entitys WHERE name IN ('rosalba', 'ramon');
        DELETE FROM roles WHERE name IN ('cambio de moneda', 'supervisor');

        `
    
};
