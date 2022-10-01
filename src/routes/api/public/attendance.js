import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { sql } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =

    async (req, res) => {
        const { user_id } = req.session.user;
        const { entry_date, departure_date } = req.body;
        console.log(entry_date); // Hora de llegada
        console.log(departure_date); // Hora de salida
        if( entry_date && departure_date ){
            const {rows: attendances} = await sql`
            
                WITH new_attendances as (
                    INSERT INTO public.attendances
                        (  id_user, entry_date, departure_date )
                        VALUES ( ${user_id}::integer, ${entry_date}::timestamp, ${departure_date}::timestamp )
                        RETURNING *
                )
                    INSERT INTO public.payroll_not_assign_hours
                        ( id_user, hours )
                        SELECT id_user, (extract(epoch FROM age(departure_date, entry_date))/3600 -1) as hours_diff FROM new_attendances
                        ON CONFLICT (id_user) DO UPDATE SET hours = (payroll_not_assign_hours.hours -1) + (SELECT extract(epoch FROM age(departure_date, entry_date))/3600 as hours_diff FROM new_attendances);
                `
            ;
            let data=attendances[0]
            res.json({
                success: "Asistencia registrada.",
                data
            });
        }else if(entry_date){
            const {rows: attendances} = await sql`
            
                INSERT INTO public.attendances
                    (  id_user, entry_date )
                    VALUES ( ${user_id}::integer, ${entry_date}::timestamp )
                    RETURNING id_attendance;
                
                `
            ;
            let data=attendances[0]
            res.json({
                success: "Hora de llegada registrada.",
                data
            });
        }else if(departure_date){
            const {rows: attendances} = await sql`
            
            WITH new_attendances as (
                UPDATE public.attendances
                    SET departure_date = ${departure_date}::timestamp
                    WHERE id_user = ${user_id}::integer AND created_at::date = CURRENT_DATE
                    RETURNING *
            )
                INSERT INTO public.payroll_not_assign_hours
                    ( id_user, hours )
                    SELECT id_user, (extract(epoch FROM age(departure_date, entry_date))/3600 -1) as hours_diff FROM new_attendances
                    ON CONFLICT (id_user) DO UPDATE SET hours = (payroll_not_assign_hours.hours -1) + (SELECT extract(epoch FROM age(departure_date, entry_date))/3600 as hours_diff FROM new_attendances); -- -1h Due to lunch time

                `
            ;
            let data=attendances[0]
            res.json({
                success: "Hora de salida registrada.",
                data
            });
        }
    }