import { query } from "../../../db";

export const post = async (req, res) => {
    const {id_spendable_stock, amount, id_odt, description} = req.body;
    const {rows: result} = await query(
        `
            WITH _t as (
                UPDATE no_spendable_stocks
                SET amount = amount - $1
                WHERE id_no_spendable_stock = $2
            )
            INSERT INTO public.no_spendable_inv_odt_expenses
                (id_no_spendable_stock, id_odt, amount, description)
                VALUES ($2::integer, $3::integer, $1::numeric, $4::character varying)
                RETURNING id_no_spendable_inv_odt_expense
            ;
        `,
        [amount, id_spendable_stock, id_odt, description]
    );

    res.json(result);
}

