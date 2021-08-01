import { sql } from "../../../db";

// List payroll_variables
export const get =
    async (req, res) => {

        const {rows: payroll_variables} = await sql`
            SELECT * 
            FROM (SELECT MAX(id_payroll_variable) as id_payroll_variable FROM payroll_variables) as last_payroll_variables
            JOIN payroll_variables USING (id_payroll_variable);
            `
        ;

        res.json({
            payroll_variables
        });
    }
