import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { id_recurrent_responsibility, id_user_who_made, description_evidence, id_pending_responsibility, id_awaiting_approval_responsibility, created_at } = req.body;
        const { user_id } = req.session.user;
        const {rows: completed_responsibilitys} = await res.sql`

        WITH _t as (
            INSERT INTO public.completed_responsibilitys
                ( id_recurrent_responsibility, id_user_who_made, id_user_who_approved, description_evidence, created_at)
                VALUES ( ${id_recurrent_responsibility}::integer, ${id_user_who_made}::integer, ${user_id}::integer, ${description_evidence}::character varying, ${created_at}::timestamp )
                RETURNING id_completed_responsibility
        ), _t2 as (
            DELETE FROM pending_responsibilitys WHERE id_pending_responsibility = ${id_pending_responsibility}
        )
            DELETE FROM awaiting_approval_responsibilitys WHERE id_awaiting_approval_responsibility = ${id_awaiting_approval_responsibility}
        ;`;

        const completed_responsibility = completed_responsibilitys[0];
        res.json({
            success: `Responsabilidad aprobada.`,
            completed_responsibility
        });
    }
     