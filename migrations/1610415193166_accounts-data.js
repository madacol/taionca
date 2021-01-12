exports.up = pgm => {
    pgm.sql(
        `
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '1'::integer, 'Caja chica'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '1'::integer, 'Chase'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '1'::integer, 'Revolut'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '2'::integer, 'Caja chica'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '2'::integer, 'Bod'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '2'::integer, 'Venezuela'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '2'::integer, 'Provincial'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '2'::integer, 'Banesco'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '2'::integer, 'Mercantil'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '3'::integer, 'Caja chica'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '3'::integer, 'Davivienda'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '4'::integer, 'Caja chica'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '4'::integer, 'Revolut'::character varying, '0'::numeric)
             returning id_account;
        INSERT INTO public.accounts (
            id_currency, name, balance) VALUES (
            '5'::integer, 'Bitcoin'::character varying, '0'::numeric)
             returning id_account;
        `
    )
};

exports.down = pgm => {
    pgm.sql(
        `DELETE FROM accounts;`
    )
};