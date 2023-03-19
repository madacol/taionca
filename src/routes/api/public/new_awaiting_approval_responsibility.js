import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { id_pending_responsibility, description_evidence } = req.body;
        console.log("HOLAAA", id_pending_responsibility, description_evidence);
        const {rows: awaiting_approval_responsibilitys} = await res.sql`

            INSERT INTO public.awaiting_approval_responsibilitys
                ( id_pending_responsibility, description_evidence )
                VALUES ( ${id_pending_responsibility}::integer, ${description_evidence}::character varying )
                RETURNING id_awaiting_approval_responsibility;
        `;

        res.json({
            success: `Responsabilidad enviada para su revisión.`,
            awaiting_approval_responsibilitys
        });
    }
     