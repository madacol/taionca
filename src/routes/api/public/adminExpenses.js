import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        console.log(req.body);
        const {description, expense} = req.body;
        const {rows: adminExpense} = await query(
           `
                WITH inserted_adminExpense as (
                    INSERT INTO public.adminExpenses
                        (description)
                        VALUES ($1::character varying)
                        RETURNING id_adminExpense
                ), inserted_expense as (
                    INSERT INTO public.expenses
                        (id_movement_category, id_account, amount, description, evidence, movement_category )
                        SELECT id_adminExpense, $2::integer, $3::decimal, $4::character varying, $5::character varying, 'adminExpenses'
                        FROM inserted_adminExpense
                        RETURNING id_expense
                )
                SELECT id_adminExpense, id_expense
                FROM inserted_adminExpense, inserted_expense;
            `, [
                description,
                expense.id_account, expense.amount, expense.description, expense.evidence,
            ]
        );

        res.json( adminExpense[0] );
    }