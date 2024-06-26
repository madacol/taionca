import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const {user_id} = req.session.user;
        const {
                id_account,
                id_odt,
                amount,
                // admin_profit_percent,
                // operative_profit_percent,
                // supervisor_profit_percent,
                admin_users,
                operative_users,
                supervisor_users
        } = req.body;
        
        const admin_users_json = JSON.stringify(admin_users);
        const operative_users_json = JSON.stringify(operative_users);
        const supervisor_users_json = JSON.stringify(supervisor_users);
        const {rows: payroll} = await query(
            `
                SELECT id_odt FROM payroll_odt_hours
                WHERE id_odt = $1 AND is_paid = FALSE;
                
            `, [id_odt]
        );

        // if(payroll.length > 0){
        //     res.json({
        //         error: "No se puede cerrar la ODT, hay nómina pendiente"
        //     });
        // }else{
            console.log({id_account,
                id_odt,
                user_id,
                amount,
                admin_users_json,
                operative_users_json,
                supervisor_users_json});
            const {rows: currencyChange} = await query(
                `
                    SELECT closure_odt($1,$2,$3,$4,$5,$6,$7,$8,$9);
                    
                `, [
                    id_account,
                    id_odt,
                    user_id,
                    amount,
                    // admin_profit_percent,
                    // operative_profit_percent,
                    // supervisor_profit_percent,
                    admin_users_json,
                    operative_users_json,
                    supervisor_users_json,
                    0.1, // admin_expense_percent,
                    0.10 //president_profit_percent
                ]
            );
            let data=currencyChange[0];
            res.json({
                success: "ODT cerrada exitosamente",
                data
            });
        }
    // }