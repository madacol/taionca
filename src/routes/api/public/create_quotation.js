import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { sql } from "../../../db";
import { getRate } from "../../../functions";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

// Rate based in quotation's currency

export const post =
    async (req, res) => {
        const { general_expenses, inv_expenses, currency, id_client, create_odt, description } = req.body;
        if (!res.validateDescription(description)) return;
        const admin_percent = 0.2;

        let ratesPromises = {};
        async function getRatesCached (...args) {
            const key = args.join("");
            if (!ratesPromises[key]) ratesPromises[key] = getRate(...args);
            return await ratesPromises[key];
        }

    //
    async function create_quoation(){
        let total_general_expenses = 0; //Same currency of quotation
            const expensePromise = Promise.all(general_expenses.map(async general_expense => {
                const rate = await getRatesCached(currency.code, general_expense.currency.code);
                const amount = Number(general_expense.amount) * rate
                console.log({amount});
                total_general_expenses += amount;
            }));

            let total_inv_expenses = 0;
            for (let i = 0; i < inv_expenses.length; i++) {
                    
                total_inv_expenses += Number(inv_expenses[i].amount) * Number(inv_expenses[i].quantity);
                const rate_usd = await getRatesCached(currency.code, 'usd');
                total_inv_expenses = total_inv_expenses * rate_usd;
            }

            await expensePromise;

            let contract_amount = (total_general_expenses + total_inv_expenses) / (1-admin_percent);
        
            let quotation_data = [total_general_expenses, total_inv_expenses, contract_amount, admin_percent];

            return quotation_data;
    }

    //
        if (create_odt){
            const { user_id } = req.session.user;
            const quotation_data = await create_quoation();
            const id_currency = currency.id_currency;
            const id_entity = 1;
            const amount = quotation_data[2];
            const {rows: odts} = await sql`
                
                INSERT INTO public.odts
                    ( id_client, id_user, id_currency, id_entity, amount, description )
                    VALUES (
                        ${id_client}::integer, 
                        ${user_id}::integer, 
                        ${id_currency}::integer, 
                        ${id_entity}::integer, 
                        ${amount}::numeric, 
                        ${description}::character varying)
                    RETURNING id_odt;
            
            `;
            const odt = odts[0];
            res.json({
                success: `ODT creada con el id ${odt.id_odt}`,
                total_general_expenses: quotation_data[0],
                total_inv_expenses: quotation_data[1],
                contract_amount: quotation_data[2],
                admin_percent: quotation_data[3]
            });
        } else{
            const quotation_data = await create_quoation();

            res.json({
                success: `Cotización calculada`,
                total_general_expenses: quotation_data[0],
                total_inv_expenses: quotation_data[1],
                contract_amount: quotation_data[2],
                admin_percent: quotation_data[3]
            });
        }
    }