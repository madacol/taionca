import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { sql } from "../../../db";
import { getRate } from "../../../functions";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

// Rate based in quotation's currency

export const post =
    async (req, res) => {
        const { general_expenses, inv_expenses, currency, id_client } = req.body;
        const admin_percent = 0.2;
        const rate_usd = await getRate(currency.code, 'usd');
        const rate_ves = await getRate(currency.code, 'ves');
        const rate_cop = await getRate(currency.code, 'cop');
        const rate_eur = await getRate(currency.code, 'eur');
        const rate_btc = await getRate(currency.code, 'btc');
        const usd_currency = 1;
        const ves_currency = 2;
        const cop_currency = 3;
        const eur_currency = 4;
        const btc_currency = 5;
        console.log("rate_usd:",rate_usd);
        console.log("rate_ves:",rate_ves);
        console.log("rate_cop:",rate_cop);
        console.log("rate_eur:",rate_eur);
        console.log("rate_btc:",rate_btc);
        console.log(general_expenses, inv_expenses, currency, id_client);

        if (id_client){
            const {rows: odts} = await sql`
                
            INSERT INTO public.odts
                ( id_client,  id_user, id_currency, id_entity, amount, description)
                VALUES (${id_client}::integer,
                        ${id_user}::integer, 
                        ${id_currency}::integer, 
                        ${id_entity}::integer, 
                        ${amount}::decimal(30,10), 
                        ${description}:: character varying)
                RETURNING id_admin_expense;
            
            `;
            let data = odts[0];
            let id_odt = "jajajaja";
            res.json({
                success: `ODT ingresada con el id: ${id_odt}`,
                data
            });
        } else{
            let total_general_expenses = 0; //Same currency of quotation
            for (let i = 0; i < general_expenses.length; i++) {
                if (general_expenses[i].currency.id_currency === currency.id_currency){
                    
                    total_general_expenses += Number(general_expenses[i].amount);

                }else if (general_expenses[i].currency.id_currency === usd_currency && general_expenses[i].currency.id_currency !== currency.id_currency){

                    total_general_expenses += Number(general_expenses[i].amount) * rate_usd;

                }else if (general_expenses[i].currency.id_currency === ves_currency && general_expenses[i].currency.id_currency !== currency.id_currency){

                    total_general_expenses += Number(general_expenses[i].amount) * rate_ves;

                }else if (general_expenses[i].currency.id_currency === cop_currency && general_expenses[i].currency.id_currency !== currency.id_currency){

                    total_general_expenses += Number(general_expenses[i].amount) * rate_cop;

                }else if (general_expenses[i].currency.id_currency === eur_currency && general_expenses[i].currency.id_currency !== currency.id_currency){

                    total_general_expenses += Number(general_expenses[i].amount) * rate_eur;

                }else if (general_expenses[i].currency.id_currency === btc_currency && general_expenses[i].currency.id_currency !== currency.id_currency){

                    total_general_expenses += Number(general_expenses[i].amount) * rate_btc;

                }
            }

            let total_inv_expenses = 0;
            for (let i = 0; i < inv_expenses.length; i++) {
                    
                total_inv_expenses += Number(inv_expenses[i].amount) * Number(inv_expenses[i].quantity);

            }
            total_inv_expenses = total_inv_expenses * rate_usd;

            let contract_amount = (total_general_expenses + total_inv_expenses) / (1-admin_percent);

            console.log("total_general_expenses:",total_general_expenses);
            console.log("total_inv_expenses:",total_inv_expenses);
        
            res.json({
                success: `Cotización calculada`,
                total_general_expenses,
                total_inv_expenses,
                contract_amount,
                admin_percent
            });
        }
    }