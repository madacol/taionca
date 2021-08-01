import { query } from "../../../db";

// List payroll_not_assign_hours
export const get =
    async (req, res) => {

        const {rows: payroll_not_assign_hours} = await query(
            `select id_user, hours, name, lastname from payroll_not_assign_hours
            join users ON (user_id = id_user);
            `
        );

        res.json({
            payroll_not_assign_hours
        });
    }
