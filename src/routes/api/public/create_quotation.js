import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { sql } from "../../../db";
import { getRate } from "../../../functions";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

// Rate based in quotation's currency

export const post =
    async (req, res) => {

        const { general_expenses, inv_expenses, currency, id_client, description } = req.body;
        const admin_percent = 0.2;

        let ratesPromises = {};
        async function getRatesCached (...args) {
            const key = args.join("");
            if (!ratesPromises[key]) ratesPromises[key] = getRate(...args);
            return await ratesPromises[key];
        }

    //
        async function create_quotation(){
            let total_general_expenses = 0; //Same currency of quotation
            const expensePromise = Promise.all(general_expenses.map(async general_expense => {
                const rate = await getRatesCached(currency.code, general_expense.currency.code);
                const amount = Number(general_expense.amount) * rate
                total_general_expenses += amount;
                general_expense.rate = rate;
            }));

            let total_inv_expenses = 0;
            for (let i = 0; i < inv_expenses.length; i++) {
                total_inv_expenses += Number(inv_expenses[i].amount) * Number(inv_expenses[i].quantity);
                const rate_usd = await getRatesCached(currency.code, 'usd');
                total_inv_expenses = total_inv_expenses * rate_usd;
                inv_expenses[i].rate = rate_usd;
            }

            await expensePromise;

            let contract_amount = (total_general_expenses + total_inv_expenses) / (1-admin_percent);
        
            let quotation_data = [total_general_expenses, total_inv_expenses, contract_amount, admin_percent];

            return quotation_data;
        }

        // inv_expense splitted into spendable_expenses and no_spendable_expenses
        let spendable_expenses = [];
        let no_spendable_expenses = [];
        inv_expenses.forEach(inv_expense => {
            if (inv_expense.item.id_spendable_item)
                spendable_expenses.push(inv_expense)
            else
                no_spendable_expenses.push(inv_expense)
        });

        // flatten `id_currency` attribute
        // general_expenses.forEach(general_expense => {
            
        // });

    //
        const { user_id } = req.session.user;
        const quotation_data = await create_quotation();
        const id_currency = currency.id_currency;
        const {rows: [{id_quotation}]} = await sql`
            SELECT new_create_quotation(
                ${user_id},
                ${JSON.stringify(general_expenses)},
                ${JSON.stringify(spendable_expenses)},
                ${JSON.stringify(no_spendable_expenses)},
                ${currency.id_currency},
                ${id_client},
                ${admin_percent},
                ${description},
                ${quotation_data[2]}
            ) AS id_quotation;
        `;
        res.json({
            success: `Cotización realizada con el id ${id_quotation}`,
            total_general_expenses: quotation_data[0],
            total_inv_expenses: quotation_data[1],
            contract_amount: quotation_data[2],
            admin_percent: quotation_data[3],
            id_quotation
        });
    }