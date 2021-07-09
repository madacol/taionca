import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import { next_date } from "../../../functions";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { responsibility } = req.body;
        const {rows: pending_responsibilitys} = await res.sql`
        
            WITH new_id_pending_responsibility as (
                INSERT INTO public.pending_responsibilitys
                    ( id_active_responsibility, deadline )
                    VALUES ( ${responsibility.id_active_responsibility}::integer, ${next_date(responsibility.deadline, responsibility.term, responsibility.days_to_repeat)}::timestamp )
                    RETURNING id_pending_responsibility
            )
                UPDATE active_responsibilitys
                SET times_remaining = times_remaining - 1
                WHERE id_active_responsibility = ${responsibility.id_active_responsibility}
                
            ;
        `;

        let data = pending_responsibilitys[0]
        res.json( {
            data,
        });
    }