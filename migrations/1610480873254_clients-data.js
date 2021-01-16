exports.up = pgm => {
    pgm.sql(
        `
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
        `
    )
};

exports.down = pgm => {
    pgm.sql(
        `
        ALTER SEQUENCE clients_id_client_seq RESTART WITH 1;

        DELETE FROM expenses;
        DELETE FROM odts;
        DELETE FROM clients;
        `
    )
};

