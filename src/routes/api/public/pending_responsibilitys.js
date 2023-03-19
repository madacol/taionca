import { sql } from "../../../db";

// List pending_responsibilitys
export const get =
    async (req, res) => {

        const {user_id} = req.session.user;
        const {rows: pending_responsibilitys} = await sql`
            SELECT * FROM awaiting_approval_responsibilitys
                RIGHT JOIN pending_responsibilitys USING(id_pending_responsibility)
                JOIN active_responsibilitys USING(id_active_responsibility)
                JOIN recurrent_responsibilitys USING(id_recurrent_responsibility)
                JOIN time_frequencys USING(id_time_frequency)
                WHERE id_user = ${user_id} AND awaiting_approval_responsibilitys.id_pending_responsibility IS NULL;
            ;`
        ;

        res.json({
            pending_responsibilitys
        });
    }
