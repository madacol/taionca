exports.up = pgm => {
    pgm.sql(
        `WITH user_id as (
            INSERT INTO users (username, name, password_hash) VALUES ('master', 'master', '$argon2i$v=19$m=4096,t=10,p=1$l9mKHF/++OJO4Fzj5VvOxw$smezKrrynx74W2+7L4zyiKUXWFdQDqdKf2RBMU4p0JI') RETURNING user_id
        ), role_id as (
            INSERT INTO roles (name) VALUES ('master') RETURNING role_id
        ), t as (
            INSERT INTO join_users_roles (user_id, role_id)
            SELECT user_id, role_id FROM user_id, role_id
        )
        INSERT INTO join_roles_permissions (role_id, permission_id)
        SELECT role_id, permission_id FROM role_id, permissions;`
    )
};

exports.down = pgm => {
    pgm.sql(
        `DELETE FROM users WHERE username = 'master';
        DELETE FROM roles WHERE name = 'master';`
    )
};
