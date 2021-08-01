import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { user_id } = req.session.user;
        const { id_user, hours_available, hours_spent, id_odt } = req.body;
        
        if(hours_spent > hours_available || hours_spent <= 0){
            return res.json({
                error: "Error: horas ingresadas no válidas"
                });
        }else{
            const {rows: hours_asigned} = await res.sql`

            WITH _t as(
                UPDATE payroll_not_assign_hours
                SET hours = payroll_not_assign_hours.hours - ${hours_spent}
                WHERE id_user = ${id_user}
            )
                INSERT INTO public.payroll_odt_hours
                    ( id_supervisor, id_odt, id_user, hours_spent )
                    VALUES (${user_id}::integer, ${id_odt}::integer, ${id_user}::integer, ${hours_spent}::double precision);
            
            `;

            const hour_asigned = hours_asigned[0];
            res.json({
                success: `Horas asignadas`,
                hour_asigned
            });

        }
    }
     