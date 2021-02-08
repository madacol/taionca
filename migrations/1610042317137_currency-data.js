exports.up = pgm => {
    pgm.sql`
        INSERT INTO public.currencies (
            name_singular, name_plural, symbol, code) VALUES (
            'dólar'::character varying, 'dólares'::character varying, '$'::character varying, 'usd'::character varying)
             returning id_currency;
        INSERT INTO public.currencies (
            name_singular, name_plural, symbol, code) VALUES (
            'bolívar'::character varying, 'bolívares'::character varying, 'Bs'::character varying, 'ves'::character varying)
             returning id_currency;
        INSERT INTO public.currencies (
            name_singular, name_plural, symbol, code) VALUES (
            'peso'::character varying, 'pesos'::character varying, 'COP'::character varying, 'cop'::character varying)
             returning id_currency;
        INSERT INTO public.currencies (
            name_singular, name_plural, symbol, code) VALUES (
            'euro'::character varying, 'euros'::character varying, '€'::character varying, 'eur'::character varying)
             returning id_currency;
        INSERT INTO public.currencies (
            name_singular, name_plural, symbol, code) VALUES (
            'bitcoin'::character varying, 'bitcoins'::character varying, '₿'::character varying, 'btc'::character varying)
             returning id_currency;`
    
};

exports.down = pgm => {
    pgm.sql`
        ALTER SEQUENCE currencies_id_currency_seq RESTART WITH 1;

        `
    
};
