import { sql } from "../../../db";

export const post =

    async (req, res) => {
        const { user_id } = req.session.user;
        const { entry_date, departure_date } = req.body;
        if( entry_date && departure_date ){
            const {rows: attendances} = await sql`
            
                WITH new_attendances as (
                    INSERT INTO public.attendances
                        (  id_user, entry_date, departure_date )
                        SELECT  ${user_id}::integer, ${entry_date}::timestamp, ${departure_date}::timestamp 
                        WHERE NOT EXISTS (SELECT * FROM attendances WHERE id_user = ${user_id} and departure_date is null)
                        RETURNING *
                )
                    INSERT INTO public.payroll_not_assign_hours
                        ( id_user, hours )
                        SELECT id_user, 
                            CASE
                                WHEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600) > 7 
                                    THEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600 -1)
                                WHEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600) <= 7 
                                    THEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600)
                            END
                        as hours_diff FROM new_attendances
                        ON CONFLICT (id_user) DO 
                        UPDATE
                        SET hours = (SELECT
                                        CASE
                                            WHEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600) > 7 
                                                THEN payroll_not_assign_hours.hours + (SELECT extract(epoch FROM age(departure_date, entry_date))/3600 as hours_diff FROM new_attendances) -1
                                            WHEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600) <= 7
                                                THEN payroll_not_assign_hours.hours + (SELECT extract(epoch FROM age(departure_date, entry_date))/3600 as hours_diff FROM new_attendances)
                                        END
                                    as hours_diff FROM new_attendances)
                    RETURNING *; 
                `
            ;
            let data=attendances[0]
            if(data){
                res.json({
                    success: "Asistencia registrada.",
                    data
                });
            }else{
                res.json({
                    error: "Existe un registro anterior abierto.",
                    data
                });
            }
        }else if( entry_date){
            const {rows: attendances} = await sql`

                    INSERT INTO public.attendances
                        (  id_user, entry_date )
                        SELECT  ${user_id}::integer, ${entry_date}::timestamp
                        WHERE NOT EXISTS (SELECT * FROM attendances WHERE id_user = ${user_id} and departure_date is null)
                        RETURNING *;
                
                `
            ;
            let data=attendances[0]
            if(data){
                res.json({
                    success: "Hora de llegada registrada.",
                    data
                });
            }else{
                res.json({
                    error: "Existe un registro anterior abierto.",
                    data
                });
            }
        }else if( departure_date){
            const {rows: attendances} = await sql`
            
            WITH new_attendances as (
                UPDATE public.attendances
                    SET departure_date = ${departure_date}::timestamp
                    WHERE id_user = ${user_id}::integer AND departure_date::date is null
                    RETURNING *
            )
                INSERT INTO public.payroll_not_assign_hours
                    ( id_user, hours )
                    SELECT id_user, 
                        CASE
                            WHEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600) > 7 
                                THEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600 -1)
                            WHEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600) <= 7 
                                THEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600)
                        END
                    as hours_diff FROM new_attendances
                    ON CONFLICT (id_user) DO 
                    UPDATE
                    SET hours = (SELECT
                                    CASE
                                        WHEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600) > 7 
                                            THEN payroll_not_assign_hours.hours + (SELECT extract(epoch FROM age(departure_date, entry_date))/3600 as hours_diff FROM new_attendances) -1
                                        WHEN (SELECT extract(epoch FROM age(departure_date, entry_date))/3600) <= 7
                                            THEN payroll_not_assign_hours.hours + (SELECT extract(epoch FROM age(departure_date, entry_date))/3600 as hours_diff FROM new_attendances)
                                    END
                                as hours_diff FROM new_attendances)
                    RETURNING *; 

                `
            ;
            let data=attendances[0]
            if(data){
                res.json({
                    success: "Hora de salida registrada.",
                    data
                });
            }else{
                res.json({
                    error: "No existe un registro anterior abierto.",
                    data
                });
            }
        }}