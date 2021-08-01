import { query } from "../../../db";

export const post = async (req, res) => {
    const { id_spendable_stock, id_account, amount, cost } = req.body;
    const {rows: result} = await query(
        `
            WITH _t as (
                UPDATE spendable_stocks
                SET amount = amount + $3
                WHERE id_spendable_stock = $1

            ), new_spendable_inv_odt_income as(
                INSERT INTO public.spendable_inv_odt_incomes
                    ( id_spendable_stock, id_account, amount, cost )
                    VALUES ($1::integer, $2::integer, $3::numeric, $4::numeric)
                    RETURNING id_spendable_inv_odt_income
            )

            SELECT alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                id_balance,
                -$4,
                id_spendable_inv_odt_income,
                'spendable_inv_odt_incomes'
            ) FROM balances, new_spendable_inv_odt_income
            WHERE id_account = $2 AND id_entity = 3
            ;
        `,
        [ id_spendable_stock, id_account, amount, cost ]
    );

    res.json({
        success:"Inventario repuesto exitosamente",
        result
    });
}

