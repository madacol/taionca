import fetch from "node-fetch";
import { query } from "../../../db";

export const post = async (req, res) => {
    const {id_spendable_stock, amount, id_odt, description, currency_code} = req.body;
    /**
     * currency_code should not be received from frontend, is a vulnerability
     * se debe hacer previamente un query para obtener la moneda de la ODT
     */
    let usd_currency_rate;
    if (currency_code !== 'usd') {
        const response = await fetch(`https://bolivarparalelo.com/api/rate/${currency_code}/usd`);
        const rate = await response.json();
        usd_currency_rate = (rate.buy + rate.sell) / 2;
    } else {
        usd_currency_rate = 1;
    }
    const {rows: result} = await query(
        `
            WITH updated_spendable_stocks as (
                UPDATE spendable_stocks
                SET amount = amount - $1
                WHERE id_spendable_stock = $2
                RETURNING id_spendable_stock, id_spendable_item
            ), new_spendable_inv_odt_expense as (
                INSERT INTO public.spendable_inv_odt_expenses
                    (id_spendable_stock, id_odt, amount, description, rate)
                    SELECT $2::integer, $3::integer, $1::numeric, $4::character varying, $5::numeric
                    RETURNING id_spendable_inv_odt_expense
            ), amount_de_verdad as (
                SELECT (($1::numeric) * price) AS amount
                FROM updated_spendable_stocks
                JOIN spendable_items USING (id_spendable_item)
                WHERE id_spendable_stock = $2
            ), selected_balance as (
                SELECT * FROM balances, amount_de_verdad
                WHERE id_balance = auto_select_balance(1, amount, 1)
            )
            SELECT alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                balances.id_balance,
                CASE WHEN balances.id_entity=1 THEN -amount ELSE amount END,
                id_spendable_inv_odt_expense,
                'spendable_inv_odt_expenses'
            ) FROM new_spendable_inv_odt_expense, selected_balance
            JOIN balances
                ON balances.id_account = selected_balance.id_account
                AND balances.id_entity IN (1,3)
            ;
        `,
        [Math.abs(amount), id_spendable_stock, id_odt, description, usd_currency_rate]
    );

    res.json({
        success:"Gasto realizado",
        result
    });
}