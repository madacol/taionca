import { query } from "../../../db";

// List responsibilitys
export const get =
    async (req, res) => {

        const {rows: responsibilitys} = await query(
            `select * from recurrent_responsibilitys
            
            join time_frequencys using (id_time_frequency)
            ;`
        );

        res.json({
            responsibilitys
        });
    }
