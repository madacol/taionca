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
            name) VALUES (
            'Taionca'::character varying)
             returning id_entity;
        
        INSERT INTO public.entitys (
            name) VALUES (
            'Administración'::character varying)
             returning id_entity;

        INSERT INTO public.entitys (
            name) VALUES (
            'Inventario'::character varying)
             returning id_entity;

        --Currencies
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

        `
    
};
exports.down = pgm => {
    pgm.sql(
        `
        ALTER SEQUENCE currencys_id_currency_seq RESTART WITH 1;
        ALTER SEQUENCE clients_id_client_seq RESTART WITH 1;
        ALTER SEQUENCE entitys_id_entity_seq RESTART WITH 1;

        DELETE FROM clients;
        DELETE FROM entitys;
        DELETE FROM currencys;
        `
    )
};

