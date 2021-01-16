import argon2 from "argon2";
import { argon as config } from "../../../config";
import { query } from "../../../db";

export async function post(req, res){
    const {username, password, name} = req.body;

    if (!username) return res.json({error: "Usuario no puede estar vacío"});
    if (!password) return res.json({error: "Contraseña no puede estar vacía"});
    if (!name)     return res.json({error: "Nombre no puede estar vacío"});

    const hash = await argon2.hash(password, config);

    await query(
        `INSERT INTO users (username, password_hash, name)
            VALUES ($1,$2,$3)`,
        [username, hash, name]
    );

    res.json({success: 'Usuario creado exitosamente'});
}