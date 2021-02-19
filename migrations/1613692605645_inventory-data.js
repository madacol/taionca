exports.up = pgm => {
    pgm.sql(
        `
        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Unidad'::character varying, 'und'::character varying)
             returning id_measure;

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Kilogramo'::character varying, 'kg'::character varying)
             returning id_measure;

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Metro'::character varying, 'm'::character varying)
             returning id_measure;        
        
        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Centímetro'::character varying, 'cm'::character varying)
             returning id_measure;

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Galón'::character varying, 'gal'::character varying)
             returning id_measure;

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Litro'::character varying, 'l'::character varying)
             returning id_measure;

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Metro cuadrado'::character varying, 'm²'::character varying)
             returning id_measure;

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Metro cúbico'::character varying, 'm³'::character varying)
             returning id_measure;

        INSERT INTO public.measures 
            ( name, unit ) 
            VALUES ( 'Hora'::character varying, 'h'::character varying)
             returning id_measure;
        `
    )
};

exports.down = pgm => {
    pgm.sql(
        `
        ALTER SEQUENCE measures_id_measure_seq RESTART WITH 1;

        DELETE FROM expenses;
        `
    )
};