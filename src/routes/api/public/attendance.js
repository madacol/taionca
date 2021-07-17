import { query } from "../../../db";

// List supervisor_attendances
export const get =
    async (req, res) => {

        const {rows: supervisor_attendances} = await query(
            `select *
            from supervisor_attendances;`
        );

        res.json({
            supervisor_attendances
        });
    }
