import { sql } from "../../../db";

// List awaiting_approval_responsibilitys
export const get =
    async (req, res) => {

        const {user_id} = req.session.user;
        const {rows: awaiting_approval_responsibilitys} = await sql`
            select

            pending_responsibilitys.id_pending_responsibility as id_pending_responsibility,
            recurrent_responsibilitys.name as name,
            active_responsibilitys.id_user as id_user,
            recurrent_responsibilitys.description as description,
            recurrent_responsibilitys.importance as importance,
            recurrent_responsibilitys.days_to_repeat as days_to_repeat,
            time_frequencys.term as term,
            time_frequencys.term_label as term_label,
            deadline

            from awaiting_approval_responsibilitys

            right join pending_responsibilitys on awaiting_approval_responsibilitys.id_pending_responsibility = pending_responsibilitys.id_pending_responsibility
            join active_responsibilitys using(id_active_responsibility)
            join recurrent_responsibilitys using(id_recurrent_responsibility)
            join time_frequencys using(id_time_frequency)
            
            where id_user = ${user_id} AND awaiting_approval_responsibilitys.id_pending_responsibility is null
            ;`
        ;

        res.json({
            awaiting_approval_responsibilitys
        });
    }
