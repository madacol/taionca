exports.up = pgm => {
    pgm.sql`
        WITH inserted_user as (
            INSERT INTO users (username, name, password_hash, email, lastname) VALUES ('rosalba', 'Rosalba', '$argon2i$v=19$m=4096,t=10,p=1$WqJSbCkALZXn/b6azjtBxQ$jTgdpn7gZa3zosJCza/ACO6fGCI+ygO1wA3a2fb7XVU','undefined', 'D''Agostini') RETURNING user_id
        ), inserted_role as (
            INSERT INTO roles (name) VALUES ('cambio de moneda') RETURNING role_id
        ), t as (
            INSERT INTO join_users_roles (user_id, role_id)
            SELECT user_id, role_id FROM inserted_user, inserted_role
        )
        INSERT INTO join_roles_permissions (role_id, permission_id)
        SELECT role_id, permission_id FROM inserted_role, permissions
        WHERE permissions.name = 'exchange_currency_create';

        WITH inserted_user as (
            INSERT INTO users (username, name, password_hash, email, lastname) VALUES ('ramon', 'Ramón', '$argon2i$v=19$m=4096,t=10,p=1$WqJSbCkALZXn/b6azjtBxQ$jTgdpn7gZa3zosJCza/ACO6fGCI+ygO1wA3a2fb7XVU','null', 'Guaricuco') RETURNING user_id
        ), inserted_role as (
            INSERT INTO roles (name) VALUES ('supervisor') RETURNING role_id
        ), t as (
            INSERT INTO join_users_roles (user_id, role_id)
            SELECT user_id, role_id FROM inserted_user, inserted_role
        )
        INSERT INTO join_roles_permissions (role_id, permission_id)
        SELECT role_id, permission_id FROM inserted_role, permissions
        WHERE permissions.name IN ( 
                                    'storages_create', 
                                    'stocks_read', 
                                    'inv_purchases_create', 
                                    'new_odt_create', 
                                    'general_expenses_create', 
                                    'admin_expenses_create', 
                                    'inv_odt_expenses_create'
                                    );
        `
};

exports.down = pgm => {
    pgm.sql`
    
        DELETE FROM users WHERE username = 'rosalba';
        DELETE FROM roles WHERE name = 'cambio de moneda';
        DELETE FROM users WHERE username = 'ramon';
        DELETE FROM roles WHERE name = 'supervisor';
        
        `
    
};
