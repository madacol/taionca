import { sql } from "../../../db";

// List awaiting_approval_responsibilitys
export const get =
    async (req, res) => {

        const {rows: awaiting_approval_responsibilitys} = await sql`
            select 

            users.name as responsable_name,
            users.lastname as responsable_last_name,
            users.user_id as id_user,
            recurrent_responsibilitys.name as name,
            recurrent_responsibilitys.description as description,
            awaiting_approval_responsibilitys.description_evidence as evidence,
            awaiting_approval_responsibilitys.created_at as created_at,
            awaiting_approval_responsibilitys.id_awaiting_approval_responsibility as id_awaiting_approval_responsibility,
            pending_responsibilitys.id_pending_responsibility as id_pending_responsibility,
            recurrent_responsibilitys.id_recurrent_responsibility as id_recurrent_responsibility

            from awaiting_approval_responsibilitys

            join pending_responsibilitys using(id_pending_responsibility)
            join active_responsibilitys using(id_active_responsibility)
            join recurrent_responsibilitys using(id_recurrent_responsibility)
            join users on users.user_id = active_responsibilitys.id_user

            order by created_at
            ;`
        ;

        res.json({
            awaiting_approval_responsibilitys
        });
    }
