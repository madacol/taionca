import { sql } from "../../../db";

// List payroll_odt_hours
export const get =
    async (req, res) => {

        const {rows: payroll_odt_hours} = await sql`
        
            SELECT 
            
            id_payroll_odt_hour,
            payroll_odt_hours.id_odt, 
            payroll_odt_hours.id_user, 
            users.name, 
            users.lastname, 
            payroll_odt_hours.hours_spent, 
            odts.amount,
            currencys.symbol,
            currencys.code
            
            FROM payroll_odt_hours 

            JOIN users ON (user_id = id_user)
            JOIN odts using (id_odt)
            JOIN currencys using (id_currency)

            WHERE is_paid = FALSE;
        
        `
        ;

        res.json({
            payroll_odt_hours
        });
    }
