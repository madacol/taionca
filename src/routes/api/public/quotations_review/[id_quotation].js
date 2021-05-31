import { sql } from "../../../../db";

// List quotation_expenses
export const get =
    async (req, res) => {
        const {id_quotation} = req.params;

        let {rows: quotation_general_expenses} = await sql`

            select 

            id_quotation_general_expense,
            quotation_general_expenses.id_currency,
            id_quotation,
            amount,
            quotation_general_expenses.description as description,
            rate,
            quotation_general_expenses.id_measure,
            quantity,
            currencys.name_singular as currency_name_singular,
            currencys.name_plural as currency_name_plural,
            currencys.symbol as currency_symbol,
            currencys.code as currency_code,
            measures.name as measure_name,
            measures.unit as measure_unit
            
            from quotation_general_expenses
            join currencys using(id_currency)
            join measures using(id_measure)

            WHERE id_quotation = ${id_quotation}

            ORDER BY quotation_general_expenses.created_at;
            `
        ;

        let {rows: quotation_spendable_inv_expenses} = await sql`

            select 

            id_quotation_spendable_inv_expense,
            id_spendable_item,
            id_quotation,
            quantity,
            amount,
            quotation_spendable_inv_expenses.description as description,
            rate,
            id_brand,
            brands.name as brand_name
            
            from quotation_spendable_inv_expenses
            join spendable_items using(id_spendable_item)
            join brands using(id_brand)

            WHERE id_quotation = ${id_quotation}

            ORDER BY quotation_spendable_inv_expenses.created_at;
            `
        ;

        let {rows: quotation_no_spendable_inv_expenses} = await sql`

            select 

            id_quotation_no_spendable_inv_expense,
            id_no_spendable_item,
            id_quotation,
            quantity,
            amount,
            quotation_no_spendable_inv_expenses.description as description,
            rate,
            id_brand,
            brands.name as brand_name
            
            from quotation_no_spendable_inv_expenses
            join no_spendable_items using(id_no_spendable_item)
            join brands using(id_brand)

            WHERE id_quotation = ${id_quotation}

            ORDER BY quotation_no_spendable_inv_expenses.created_at;
            `
        ;

        // const {rows: quotations} = await sql`

        //     select 

        //     id_quotation,
        //     id_client,
        //     id_currency,
        //     admin_percent,
        //     quotations.description as description,
        //     amount,
        //     id_user,
        //     users.name as user_name,
        //     clients.name as client_name,
        //     currencys.name_singular as currency_name_singular,
        //     currencys.name_plural as currency_name_plural,
        //     currencys.symbol as currency_symbol,
        //     currencys.code as currency_code
            
        //     from quotations
        //     join clients using(id_client)
        //     join users on users.user_id = quotations.id_user
        //     join currencys using(id_currency)

        //     WHERE id_quotation = ${id_quotation}

        //     ORDER BY quotations.created_at;
        //     `
        // ;

        quotation_general_expenses.forEach(expense => {
            expense.kind = "Gasto general"
        });

        quotation_spendable_inv_expenses.forEach(expense => {
            expense.kind = "Gasto de inventario consumible"
        });

        quotation_no_spendable_inv_expenses.forEach(expense => {
            expense.kind = "Gasto de inventario no consumible"
        });

        res.json({
            success: "Datos de la cotización cargados exitosamente.",
            quotation_general_expenses,
            quotation_spendable_inv_expenses,
            quotation_no_spendable_inv_expenses
        });
    }
