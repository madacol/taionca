import { query } from "../../../db";

export const get =
    async (req, res) => {

        // const { id_client, id_currency, id_entity, amount, description, id_quotation } = req.body;
        const {rows: payroll} = await res.sql`
            
            SELECT * FROM payroll();
        `;

        let current_date = Date.parse(new Date().toLocaleDateString); // Today but with out time
        let mid_day = Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 15)); // The 15 of each month
        let last_day = Date.parse(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)); // The last day of each month (28/29/30/31)
        if(current_date === mid_day || current_date === last_day){
            console.log("Entró");


        }else{
            console.log("No entró");
        }

        res.json({
            payroll
        });
    }
