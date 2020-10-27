import argon2 from "argon2";
import { argon as config } from "../../config";
import { query } from "../../db";

// List user
export async function get (req, res) {
    const {user_id} = req.session.user;
    const {rows: [user]} = await query(
        `SELECT
            user_id,
            users.name,
            users.created_at,
            array_agg(jsonb_build_object(
                'role_id', role_id,
                'name', roles.name)
            ) roles
        FROM users
        JOIN join_users_roles USING (user_id)
        JOIN roles USING (role_id)
        WHERE user_id = $1
        GROUP BY user_id;`,
        [user_id]
    );

    res.json({
        data: {user}
    });
}

// Update user's password
export async function patch (req, res) {
    const {user_id} = req.session.user;
    const {old_password, password} = req.body;

    const {rows: [user]} = await query(
        `SELECT
            users.name,
            password_hash
        FROM users
        WHERE user_id = $1;`,
        [user_id]
    );
    if (!password) return res.json({error: "Nueva contraseña no puede estar vacía"})

    const isPasswordValid = await argon2.verify(user.password_hash, old_password);
    if (!isPasswordValid) return res.json({error: "Contraseña incorrecta"})

    const hash = await argon2.hash(password, config);

    await query(
        `UPDATE users SET password_hash = $2 WHERE user_id = $1;`,
        [user_id, hash]
    );

    res.json({
        success: 'Contraseña actualizada exitosamente',
    })
}
