import argon2 from "argon2";
import { query } from "../db";

export async function post(req, res){
    const {username, password} = req.body;

    const result = await query(
        `SELECT "password_hash", array_agg(roles.name) as roles
            FROM users
            LEFT JOIN (
                join_users_roles
                JOIN roles USING ("role_id")
            ) USING ("user_id")
            WHERE username=$1
            GROUP BY "user_id"`,
        [username]
    )

    const {password_hash, roles} = result.rows[0];

    const isValid = await argon2.verify(password_hash, password);

    req.session.user = {roles}
    res.json({isValid})
}