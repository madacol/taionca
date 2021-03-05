import { query } from "../../../db";

export const post = async (req, res) => {
    const {id_spendable_stock, amount, id_odt, description} = req.body;
    const {rows: result} = await query(
        `
            WITH updated_spendable_stocks as (
                UPDATE spendable_stocks
                SET amount = amount - $1
                WHERE id_spendable_stock = $2
                RETURNING id_spendable_stock, id_spendable_item
            ), new_spendable_inv_odt_expense as (
                INSERT INTO public.spendable_inv_odt_expenses
                    (id_spendable_stock, id_odt, amount, description)
                    SELECT $2::integer, $3::integer, $1::numeric, $4::character varying
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
            SELECT alter_balance(
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
        [Math.abs(amount), id_spendable_stock, id_odt, description]
    );

    console.log(result);

    res.json(result);
}