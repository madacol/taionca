exports.up = pgm => {
    pgm.sql`
       
    CREATE TABLE limit_resources(
        id_limit_resource SERIAL PRIMARY KEY,
        id_odt INT NOT NULL REFERENCES odts (id_odt) ON UPDATE CASCADE ON DELETE CASCADE,
        id_account INT NOT NULL REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
        amount DECIMAL(30,10) DEFAULT 0 CONSTRAINT positive_limit CHECK (amount >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
        UNIQUE (id_odt, id_account)
       );

    ALTER TABLE odts 
        ADD COLUMN admin_percent decimal(5,5) DEFAULT 0.2,
        ALTER COLUMN id_client SET NOT NULL,
        ALTER COLUMN id_entity SET NOT NULL,
        ALTER COLUMN id_currency SET NOT NULL,
        ALTER COLUMN admin_percent SET NOT NULL;
    
    ALTER TABLE accounts
        ALTER COLUMN id_currency SET NOT NULL;
    
    ALTER TABLE admin_closure_odts
        ALTER COLUMN id_closure_odt SET NOT NULL;

    ALTER TABLE admin_expenses
        ADD COLUMN id_user INT DEFAULT 1 NOT NULL REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
        ALTER COLUMN id_account SET NOT NULL;

    ALTER TABLE balance_movements
        ALTER COLUMN id_balance SET NOT NULL;

    ALTER TABLE balance_registers
        ALTER COLUMN id_balance SET NOT NULL;

    ALTER TABLE balances
        ALTER COLUMN id_account SET NOT NULL,
        ALTER COLUMN id_entity SET NOT NULL;

    ALTER TABLE closure_odts
        ALTER COLUMN id_account SET NOT NULL,
        ALTER COLUMN id_odt SET NOT NULL;

    ALTER TABLE general_expenses
        ADD COLUMN id_user INT DEFAULT 1 NOT NULL REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
        ALTER COLUMN id_account SET NOT NULL,
        ALTER COLUMN id_measure SET NOT NULL,
        ALTER COLUMN id_odt SET NOT NULL;

    CREATE OR REPLACE FUNCTION set_odt_limit_resources()
        RETURNS trigger 
        AS $$
        BEGIN

        INSERT INTO limit_resources
            (id_odt, id_account, amount)
            SELECT
                NEW.id_odt,
                accounts.id_account,
                NEW.amount * 0.3
            FROM accounts
            WHERE id_currency = NEW.id_currency;

        RETURN NEW;
        END;
        $$
        LANGUAGE 'plpgsql';

    CREATE TRIGGER new_odt_insert_trigger
        AFTER INSERT ON odts
        FOR EACH ROW
        EXECUTE PROCEDURE set_odt_limit_resources();
        `
};
exports.down = pgm => {
    pgm.sql`
         
        ALTER TABLE odts DROP COLUMN admin_percent;
        ALTER TABLE admin_expenses DROP COLUMN id_user;
        ALTER TABLE general_expenses DROP COLUMN id_user;
        DROP TABLE IF EXISTS limit_resources;
        DROP TRIGGER IF EXISTS new_odt_insert_trigger ON balances;
        DROP FUNCTION IF EXISTS set_odt_limit_resources;

        `
};  