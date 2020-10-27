import { compose } from "compose-middleware";
import { ROLES_CREATE, ROLES_DELETE, ROLES_READ, ROLES_UPDATE } from "../../constants/PERMISSIONS";
import { query } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

// Create role
export const post = compose(
    checkPermissionsMW(ROLES_CREATE),
    async (req, res) => {
        const {name, permissions} = req.body;
        if (!name) return res.json({error: "Debe enviar un nombre válido"})

        const {rows: [{role_id}]} = await query(
            `WITH inserted_roles AS (INSERT INTO roles (name) VALUES ($1) RETURNING role_id)
            INSERT INTO join_roles_permissions (role_id, permission_id)
            SELECT role_id, permission_id
            FROM inserted_roles
            CROSS JOIN unnest($2::int[]) permission_id
            RETURNING role_id;`,
            [name, permissions]
        );

        res.json({
            success: 'Rol creado exitosamente',
            data: {role_id}
        })
    }
)

// List roles
export const get = compose(
    checkPermissionsMW(ROLES_READ),
    async (req, res) => {

        const {rows: roles} = await query(
            `SELECT
                role_id,
                roles.name,
                roles.created_at,
                array_agg(jsonb_build_object(
                    'permission_id', permission_id,
                    'name', permissions.name)
                ) permissions
            FROM roles, permissions
            GROUP BY role_id;`
        );

        res.json({
            data: {roles}
        });
    }
)

// Update role
export const patch = compose(
    checkPermissionsMW(ROLES_UPDATE),
    async (req, res) => {
        const {role_id, name, permissions: {add, remove}} = req.body;
        if (!role_id) return res.json({error: "No se recibió el id del rol para poder actualizarlo"})

        const promises = [];
        if (name) {
            promises.push(query(
                `UPDATE roles SET name = $2 WHERE role_id = $1;`,
                [role_id, name]
            ))
        }
        if (add) {
            promises.push(query(
                `INSERT INTO join_roles_permissions (role_id, permission_id) VALUES ($1, unnest($2::int[]));`,
                [role_id, add]
            ))
        }
        if (remove) {
            promises.push(query(
                `DELETE FROM join_roles_permissions WHERE role_id = $1 and permission_id = ANY($2);`,
                [role_id, remove]
            ))
        }

        await Promise.all(promises);

        res.json({
            success: 'Rol actualizado exitosamente',
        })
    }
)

// Delete role
export const del = compose(
    checkPermissionsMW(ROLES_DELETE),
    async (req, res) => {
        const {role_id} = req.body;

        await query(
            `DELETE FROM roles WHERE role_id = $1;`,
            [role_id]
        );

        res.json({
            success: 'Rol eliminado exitosamente',
        });
    }
)
