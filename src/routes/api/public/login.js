import argon2 from "argon2";
import { query } from "../../../db";

export async function post(req, res){
    const {username, password} = req.body;

    let user;
    {
        const result = await query(
            `SELECT user_id, users.name, password_hash, array_agg(roles.name) as roles
                FROM users
                LEFT JOIN (
                    join_users_roles
                    JOIN roles USING ("role_id")
                ) USING ("user_id")
                WHERE username=$1
                GROUP BY "user_id"`,
            [username]
        )
        user = result.rows[0];
    }
    if (!user) return res.json({error: `Usuario "${username}" no existe`})

    {
        const isPasswordValid = await argon2.verify(user.password_hash, password);
        if (!isPasswordValid) return res.json({error: "Contraseña incorrecta"})
    }

    { // Save user in session, and a cookie will be set in the client
        const {user_id, name, roles} = user;
        req.session.user = {user_id, name, roles, username};
    }

    res.json({
        success: "Inicio de sesión exitoso",
        session: req.session.user,
    });
}
