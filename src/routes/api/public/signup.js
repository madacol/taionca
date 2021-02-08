import argon2 from "argon2";
import { argon as config } from "../../../config";
import { query } from "../../../db";

export async function post(req, res){
    const {username, password, name, email, lastname} = req.body;

    if (!username) return res.json({error: "Usuario no puede estar vacío"});
    if (!password) return res.json({error: "Contraseña no puede estar vacía"});
    if (!name)     return res.json({error: "Nombre no puede estar vacío"});
    if (!email)    return res.json({error: "Correo no puede estar vacío"});
    if (!lastname) return res.json({error: "Apellido no puede estar vacío"});

    const hash = await argon2.hash(password, config);

    await query(
        `INSERT INTO users (username, password_hash, name, email, lastname)
            VALUES ($1,$2,$3,$4,$5)`,
        [username, hash, name, email, lastname]
    );

    res.json({success: 'Usuario creado exitosamente'});
}