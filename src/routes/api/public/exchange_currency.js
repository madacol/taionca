import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        console.log(req.body);
        const {description, income, expense} = req.body;
        const {rows: currencyChange} = await query(
            `
                WITH inserted_currencyChange as (
                    INSERT INTO public.currencyChanges
                        (description)
                        VALUES ($1::character varying)
                        RETURNING id_currencyChange
                ), inserted_expense as (
                    INSERT INTO public.expenses
                        (id_movement_category, id_account, amount, description, evidence, movement_category )
                        SELECT id_currencyChange, $2::integer, $3::decimal, $4::character varying, $5::character varying, 'currencyChanges'
                        FROM inserted_currencyChange
                        RETURNING id_expense
                ), inserted_income as (
                    INSERT INTO public.incomes
                        (id_movement_category, id_account, amount, description, movement_category )
                        SELECT id_currencyChange, $6::integer, $7::decimal, $8::character varying, 'currencyChanges'
                        FROM inserted_currencyChange
                        RETURNING id_income
                )
                SELECT id_currencyChange, id_expense, id_income
                FROM inserted_currencyChange, inserted_expense, inserted_income;
            `, [
                description,
                expense.id_account, expense.amount, expense.description, expense.evidence,
                income.id_account, income.amount, income.description,
            ]
        );

        res.json( currencyChange[0] );
    }