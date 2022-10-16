import { sql } from "../../../db";

// List attendances
export const get =
    async (req, res) => {

        const {rows: attendances} = await sql`
        
            SELECT 
                id_attendance, 
                attendances.id_user, 
                entry_date, 
                departure_date, 
                users.name, 
                users.lastname,
                users.user_id as id_user,
                attendances.created_at

            FROM attendances
            JOIN users ON users.user_id = attendances.id_user
            ORDER BY id_attendance DESC;
                
            `;

        res.json({
            attendances
        });
    }
