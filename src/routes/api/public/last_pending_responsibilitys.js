import { sql } from "../../../db";

// List pending_responsibilitys
export const get =
    async (req, res) => {

        const {rows: pending_responsibilitys} = await sql`

            select pending_responsibilitys.*, term, days_to_repeat from (select max(id_pending_responsibility) as id_pending_responsibility from pending_responsibilitys 
            group by id_active_responsibility) as last_pending_responsibilitys
            join pending_responsibilitys using (id_pending_responsibility)
            join active_responsibilitys using (id_active_responsibility)
            join recurrent_responsibilitys using (id_recurrent_responsibility)
            join time_frequencys using (id_time_frequency)
            ;

            `
        ;

        res.json({
            pending_responsibilitys
        });
    }
