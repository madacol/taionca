exports.up = pgm => {
    pgm.sql`
        --Clients
        INSERT INTO public.clients (
            name) VALUES (
            'Gazprom'::character varying)
             returning id_client;

        INSERT INTO public.clients (
            name) VALUES (
            'ZIC'::character varying)
             returning id_client;

        INSERT INTO public.clients (
            name) VALUES (
            'PDVSA'::character varying)
             returning id_client;

        INSERT INTO public.clients (
            name) VALUES (
            'Particular'::character varying)
             returning id_client;

        --Entitys
        INSERT INTO public.entitys (
            id_entity, name) VALUES (
            1::integer ,'Taionca'::character varying)
             returning id_entity;
        
        INSERT INTO public.entitys (
            id_entity, name) VALUES (
            2::integer ,'Administración'::character varying)
             returning id_entity;

        INSERT INTO public.entitys (
            id_entity, name) VALUES (
            3::integer ,'Inventario'::character varying)
             returning id_entity;

        --Currencys
        INSERT INTO public.currencys (
            name_singular, name_plural, symbol, code) VALUES (
            'dólar'::character varying, 'dólares'::character varying, '$'::character varying, 'usd'::character varying)
             returning id_currency;

        INSERT INTO public.currencys (
            name_singular, name_plural, symbol, code) VALUES (
            'bolívar'::character varying, 'bolívares'::character varying, 'Bs'::character varying, 'ves'::character varying)
             returning id_currency;

        INSERT INTO public.currencys (
            name_singular, name_plural, symbol, code) VALUES (
            'peso'::character varying, 'pesos'::character varying, 'COP'::character varying, 'cop'::character varying)
             returning id_currency;

        INSERT INTO public.currencys (
            name_singular, name_plural, symbol, code) VALUES (
            'euro'::character varying, 'euros'::character varying, '€'::character varying, 'eur'::character varying)
             returning id_currency;

        INSERT INTO public.currencys (
            name_singular, name_plural, symbol, code) VALUES (
            'bitcoin'::character varying, 'bitcoins'::character varying, '₿'::character varying, 'btc'::character varying)
             returning id_currency;

        --Accounts
        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '1'::integer, 'Caja Chica'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '1'::integer, 'Chase'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '1'::integer, 'Revolut'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '2'::integer, 'Caja Chica'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '2'::integer, 'Bod'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '2'::integer, 'Venezuela'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '2'::integer, 'Provincial'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '2'::integer, 'Banesco'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '2'::integer, 'Mercantil'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '3'::integer, 'Caja Chica'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '3'::integer, 'Davivienda'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '4'::integer, 'Caja Chica'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '4'::integer, 'Revolut'::character varying)
             returning id_account;

        INSERT INTO public.accounts (
            id_currency, name) VALUES (
            '5'::integer, 'Bitcoin'::character varying)
             returning id_account;

        --Balance
        INSERT INTO balances (id_account, id_entity)
            SELECT id_account, id_entity FROM accounts, entitys;
        `
    
};
exports.down = pgm => {
    pgm.sql`

        ALTER SEQUENCE accounts_id_account_seq RESTART WITH 1;
        ALTER SEQUENCE general_expenses_id_general_expense_seq RESTART WITH 1;
        ALTER SEQUENCE balances_id_balance_seq RESTART WITH 1;
        ALTER SEQUENCE currencys_id_currency_seq RESTART WITH 1;
        ALTER SEQUENCE clients_id_client_seq RESTART WITH 1;
        ALTER SEQUENCE entitys_id_entity_seq RESTART WITH 1;

        DELETE FROM balance_movements;
        DELETE FROM spendable_inv_odt_expenses;
        DELETE FROM no_spendable_inv_odt_expenses;
        DELETE FROM balances;
        DELETE FROM general_expenses;
        DELETE FROM odts;
        DELETE FROM clients;
        DELETE FROM entitys;
        DELETE FROM spendable_inv_odt_incomes;
        DELETE FROM no_spendable_inv_odt_incomes;
        DELETE FROM admin_expenses;
        DELETE FROM accounts;
        DELETE FROM currencys;
        `
};