exports.up = pgm => {
    pgm.sql`   
        DROP TRIGGER IF EXISTS employee_insert_trigger ON balances;
        DROP FUNCTION IF EXISTS balance_registers_update; 
        CREATE OR REPLACE FUNCTION balance_registers_update()
            RETURNS trigger 
            AS $$
            BEGIN

            INSERT INTO balance_registers ( id_balance, balance)
                VALUES(NEW.id_balance, NEW.balance);

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
         
        DROP TRIGGER IF EXISTS employee_insert_trigger ON balances;
        DROP FUNCTION IF EXISTS balance_registers_update;

        `
};