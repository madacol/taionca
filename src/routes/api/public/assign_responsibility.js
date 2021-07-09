import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import { next_date } from "../../../functions";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { responsibility, user, deadline, times_remaining } = req.body;
        const {rows: active_responsibilitys} = await res.sql`

            WITH new_active_responsibilitys as (
                INSERT INTO public.active_responsibilitys
                    ( id_recurrent_responsibility, id_user, times_remaining )
                    VALUES ( ${responsibility.id_recurrent_responsibility}::integer, ${user.value}::integer, ${times_remaining}::integer )
                    RETURNING id_active_responsibility
            )

                INSERT INTO public.pending_responsibilitys
                    ( id_active_responsibility, deadline )
                    SELECT id_active_responsibility::integer,  ${next_date(deadline, responsibility.term, responsibility.days_to_repeat)}::timestamp
                    FROM new_active_responsibilitys
            ;
        `;

        let data = active_responsibilitys[0]
        res.json( {
            data,
            success:"Responsabilidad asignada"
        });
    }