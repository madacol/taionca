import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { sql } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =

    async (req, res) => {
        const { user_id } = req.session.user;
        const { id_user_employee, entry_date, departure_date } = req.body;
        console.log(entry_date); // Hora de llegada
        console.log(departure_date); // Hora de salida
        if( entry_date && departure_date ){
            const {rows: supervisor_attendances} = await sql`
            
                INSERT INTO public.supervisor_attendances
                    ( id_user_supervisor, id_user_employee, entry_date, departure_date )
                    VALUES ( ${user_id}::integer, ${id_user_employee}::integer, ${entry_date}::timestamp, ${departure_date}::timestamp )
                    RETURNING id_supervisor_attendance;
                
                `
            ;
            let data=supervisor_attendances[0]
            res.json({
                success: "Asistencia registrada.",
                data
            });
        }else if(entry_date){
            const {rows: supervisor_attendances} = await sql`
            
                INSERT INTO public.supervisor_attendances
                    ( id_user_supervisor, id_user_employee, entry_date )
                    VALUES ( ${user_id}::integer, ${id_user_employee}::integer, ${entry_date}::timestamp )
                    RETURNING id_supervisor_attendance;
                
                `
            ;
            let data=supervisor_attendances[0]
            res.json({
                success: "Hora de llegada registrada.",
                data
            });
        }else if(departure_date){
            const {rows: supervisor_attendances} = await sql`
            
                UPDATE public.supervisor_attendances
                    SET departure_date = ${departure_date}::timestamp
                    WHERE id_user_employee = ${id_user_employee}::integer AND created_at::date = CURRENT_DATE;
                
                `
            ;
            let data=supervisor_attendances[0]
            res.json({
                success: "Hora de llegada registrada.",
                data
            });
        }
    }