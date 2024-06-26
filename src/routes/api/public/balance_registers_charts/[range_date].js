import { sql } from "../../../../db";

// List balance_registers
export const get =
    async (req, res) => {
        const {range_date} = req.params;
        const parsed_range_date = JSON.parse(range_date);
        const balance_registers1_promise = sql`


                select distinct on (id_balance) ${parsed_range_date.start_date} as created_at, balance_registers.balance, balance_registers.id_balance as id_balance, id_account, id_entity, accounts.name as account_name, id_currency, symbol, entitys.name as entity_name
                from balance_registers
                join balances using (id_balance)
                join accounts using (id_account)
                join currencys using (id_currency)
                join entitys using (id_entity)
                where balance_registers.created_at < ${parsed_range_date.start_date}
                ORDER BY id_balance, balance_registers.created_at DESC;

            `
        ;

        const balance_registers2_promise =  sql`

            select  balance_registers.created_at, balance_registers.balance, balance_registers.id_balance, id_account, id_entity, accounts.name as account_name, id_currency, symbol, entitys.name as entity_name
            from balance_registers
            join balances using (id_balance)
            join accounts using (id_account)
            join currencys using (id_currency)
            join entitys using (id_entity)
            where balance_registers.created_at >= ${parsed_range_date.start_date} AND balance_registers.created_at <= ${parsed_range_date.end_date}
            ORDER BY balance_registers.created_at ASC;
            `
        ;

        const {rows: balance_registers1} = await balance_registers1_promise;
        const {rows: balance_registers} = await balance_registers2_promise;

        res.json({
            balance_registers1,
            balance_registers
        }
        );
    }