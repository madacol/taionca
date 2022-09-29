exports.up = pgm => {
    pgm.sql`
       
        create table balance_registers (
            id_balance_register serial primary key,
            id_balance int REFERENCES balances (id_balance) ON UPDATE CASCADE  ON DELETE CASCADE,
            balance decimal(30,10) default 0,
            created_at timestamp with time zone default current_timestamp
        );      

        CREATE OR REPLACE FUNCTION balance_registers_update()
            RETURNS trigger 
            AS $$
            BEGIN

            INSERT INTO balance_registers ( id_balance, balance)
                VALUES(OLD.id_balance, OLD.balance);

            RETURN NEW;
            END;
            $$
            LANGUAGE 'plpgsql';

        CREATE TRIGGER employee_insert_trigger
            BEFORE UPDATE ON balances
            FOR EACH ROW
            EXECUTE PROCEDURE balance_registers_update();
            
        `
};
exports.down = pgm => {
    pgm.sql`
         
        DROP TABLE IF EXISTS balance_registers;
        DROP TRIGGER IF EXISTS employee_insert_trigger ON balances;
        DROP FUNCTION IF EXISTS balance_registers_update;

        `
};