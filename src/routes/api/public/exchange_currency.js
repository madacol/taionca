import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const {description, income, expense, id_entity} = req.body;
        const {rows: currencyChange} = await query(
            `
                WITH new_exchange_currencys as (
                    INSERT INTO exchange_currencys
                        (description)
                        VALUES ($1::character varying)
                        RETURNING id_exchange_currency
                )
                SELECT alter_balance(
                    id_balance,
                    CASE WHEN id_account=$2 THEN -$3::numeric ELSE $5::numeric END,
                    id_exchange_currency,
                    'exchange_currency' 
                ) FROM balances, new_exchange_currencys
                WHERE id_account IN ($2::integer, $4::integer) AND id_entity = $6
                ;
            `, [
                description,
                expense.id_account, 
                expense.amount,
                income.id_account, 
                income.amount,
                id_entity
            ]
        );
        let data = currencyChange[0]
        res.json({
            success:"Cambio de moneda realizado",
            data
        });
    }