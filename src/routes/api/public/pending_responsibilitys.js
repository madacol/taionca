import { query } from "../../../db";

// List active_responsibilitys
export const get =
    async (req, res) => {

        const {user_id} = req.session.user;
        const {rows: active_responsibilitys} = await query(
            `select 
            id_active_responsibility,
            id_recurrent_responsibility,
            id_user,
            times_remaining,
            active_responsibilitys.created_at as created_at,
            recurrent_responsibilitys.name as name,
            recurrent_responsibilitys.description as description,
            recurrent_responsibilitys.importance as importance, 
            recurrent_responsibilitys.days_to_repeat as days_to_repeat,
            time_frequencys.term as term,
            time_frequencys.term_label as term_label

            from active_responsibilitys

            join recurrent_responsibilitys using(id_recurrent_responsibility)
            join time_frequencys using(id_time_frequency)
            
            where id_user = ${user_id}
            ;`
        );

        res.json({
            active_responsibilitys
        });
    }
