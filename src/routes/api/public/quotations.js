import { query } from "../../../db";

// List active quotations
export const get =
    async (req, res) => {

        const {rows: quotations} = await query(
            `select currencys.*, clients.*, users.name as user_name, quotations.* , quotations.created_at as created_at
            from quotations
            join users on users.user_id = quotations.id_user
            join currencys using(id_currency)
            join clients using(id_client)
            `
        );
        res.json({
            quotations
        });
    }
