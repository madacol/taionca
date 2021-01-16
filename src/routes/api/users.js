import { compose } from "compose-middleware";
import { USERS_READ } from "../../constants/PERMISSIONS";
import { query } from "../../db";
import checkPermissionsMW from "../../middlewares/checkPermissionsMW";

// List users
export const get = compose(
    checkPermissionsMW(USERS_READ),
    async (req, res) => {

        const {rows: users} = await query(
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
            GROUP BY user_id;`
        );

        res.json({
            data: {users}
        });
    }
)