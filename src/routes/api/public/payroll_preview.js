import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { getRate } from "../../../functions";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { payrolls } = req.body;

        // const v_hours_by_odt = await Promise.all( payrolls.map(async payroll=>{
        //     const rate = await getRate(payroll.payroll_code, payroll.odt_code)
        //     return {
        //         ...payroll,
        //         rate
        //     };
        // }));
        // console.log(v_hours_by_odt);
        const {rows: payroll} = await res.sql`

            SELECT * FROM payroll_preview(${JSON.stringify(payrolls)}::json);
        
        `;

        res.json({
            payroll
        });

    }
     