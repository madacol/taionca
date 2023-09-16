exports.up = pgm => {
    pgm.sql`

        CREATE TABLE loans (
            id_loan serial primary key,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE not null,
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE  ON DELETE CASCADE not null,
            UNIQUE(id_user, id_currency),
            amount decimal(30,10) default 0 constraint positive_amount check (amount >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );         

        INSERT INTO loans (id_user, id_currency)
            SELECT user_id, id_currency FROM users, currencys;

        CREATE OR REPLACE FUNCTION add_users_loans()
            RETURNS trigger 
            AS $$
            BEGIN
                INSERT INTO loans (id_user, id_currency)
                SELECT NEW.user_id, id_currency FROM currencys;

                RETURN NEW;
            END;
        $$
        LANGUAGE 'plpgsql';

        CREATE OR REPLACE FUNCTION add_currencys_loans()
            RETURNS trigger 
            AS $$
            BEGIN

                INSERT INTO loans (id_user, id_currency)
                SELECT user_id, NEW.id_currency FROM users;

                RETURN NEW;
            END;
        $$
        LANGUAGE 'plpgsql';

        CREATE TRIGGER users_trigger_after
            AFTER INSERT ON users
            FOR EACH ROW
            EXECUTE PROCEDURE add_users_loans();

        CREATE TRIGGER currencys_trigger_after
            AFTER INSERT ON currencys
            FOR EACH ROW
            EXECUTE PROCEDURE add_currencys_loans();  

        CREATE TABLE loans_registers (
            id_loans_register serial primary key,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE not null,
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE  ON DELETE CASCADE not null,
            amount decimal(30,10) not null,
            description varchar(512),
            created_at timestamp with time zone default current_timestamp
        );

        alter type movement_category add value 'loans' after 'transfer_entities';

        `
};
exports.down = pgm => {
    pgm.sql`    
         
        DROP TABLE IF EXISTS loans;
        DROP FUNCTION IF EXISTS add_users_currencys_loans CASCADE;
        DROP TRIGGER IF EXISTS users_trigger_after ON users;
        DROP FUNCTION IF EXISTS add_currencys_loans CASCADE;
        DROP TRIGGER IF EXISTS currencys_trigger_after ON currencys;
        DROP TABLE IF EXISTS loans_registers;
        `
};