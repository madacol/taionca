exports.up = pgm => {
    pgm.sql`
        
        create table clients(
            id_client serial primary key,
            name varchar(64) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table entitys(
            id_entity serial primary key,
            name varchar(64) not null,
            created_at timestamp with time zone default current_timestamp
        );

        alter table users
            add special_user boolean default FALSE not null,
            add id_entity int REFERENCES entitys (id_entity) ON UPDATE CASCADE ON DELETE CASCADE
        ;
        update users
        set special_user = TRUE
        where username = 'master';

        create table currencys(
            id_currency serial primary key,
            name_singular varchar(32) not null,
            name_plural varchar(32),
            symbol varchar(5),
            code varchar(5),
            created_at timestamp with time zone default current_timestamp
        );

        create table accounts(
            id_account serial primary key,
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE  ON DELETE CASCADE,
            name varchar(50) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table odts(
            id_odt serial primary key,
            id_client int REFERENCES clients (id_client) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE not null,
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_entity int REFERENCES entitys (id_entity) ON UPDATE CASCADE  ON DELETE CASCADE,
            amount decimal(30,10) default 0 constraint positive_amount check (amount >= 0) not null,
            description varchar(512) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table general_expenses(
            id_general_expense serial primary key,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_odt int REFERENCES odts (id_odt) ON UPDATE CASCADE  ON DELETE CASCADE,
            amount decimal(30,10) not null,
            description varchar(512) not null,
            rate decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table admin_expenses(
            id_admin_expense serial primary key,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
            amount decimal(30,10) not null,
            description varchar(512) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table spendable_inv_odt_incomes(
            id_spendable_inv_odt_income serial primary key,
            id_spendable_stock int REFERENCES spendable_stocks (id_spendable_stock) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            cost decimal(30,10) constraint positive_cost check (cost >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table no_spendable_inv_odt_incomes(
            id_no_spendable_inv_odt_income serial primary key,
            id_no_spendable_stock int REFERENCES no_spendable_stocks (id_no_spendable_stock) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            cost decimal(30,10) constraint positive_cost check (cost >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table balances(
            id_balance serial primary key,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_entity  int REFERENCES entitys (id_entity) ON UPDATE CASCADE  ON DELETE CASCADE,
            balance decimal(30,10) default 0 constraint positive_balance check (balance >= 0) not null,
            created_at timestamp with time zone default current_timestamp,
            unique (id_account, id_entity)
        );
        
        create type movement_category as ENUM ('spendable_inv_odt_expenses', 'no_spendable_inv_odt_expenses','spendable_inv_odt_incomes', 'no_spendable_inv_odt_incomes', 'general_expenses', 'admin_expenses', 'exchange_currency', 'closure_odts');
        create table balance_movements(
            id_balance_movement serial primary key,
            id_balance int REFERENCES balances (id_balance) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_movement_category integer not null,
            type_movement_category movement_category not null,
            amount decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table exchange_currencys(
            id_exchange_currency serial primary key,
            description varchar(512) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table closure_odts(
            id_closure_odt serial primary key,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE not null,
            id_odt int unique REFERENCES odts (id_odt) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
            amount decimal(30,10) not null,
            admin_expense_percent decimal(5,5) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table admin_closure_odts(
            id_admin_closure_odt serial primary key,
            id_closure_odt int REFERENCES closure_odts (id_closure_odt) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE not null,
            profit_percent decimal(5,5) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table operative_closure_odts(
            id_operative_closure_odt serial primary key,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE not null,
            id_closure_odt int REFERENCES closure_odts (id_closure_odt) ON UPDATE CASCADE  ON DELETE CASCADE,
            profit_percent decimal(5,5) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table supervisor_closure_odts(
            id_supervisor_closure_odt serial primary key,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE not null,
            id_closure_odt int REFERENCES closure_odts (id_closure_odt) ON UPDATE CASCADE  ON DELETE CASCADE,
            profit_percent decimal(5,5) not null,
            created_at timestamp with time zone default current_timestamp
        );
        `
};
exports.down = pgm => {
    pgm.sql`
        alter table users drop id_entity;
        drop table if exists supervisor_closure_odts;
        drop table if exists operative_closure_odts;
        drop table if exists admin_closure_odts;
        drop table if exists closure_odts;
        drop table if exists exchange_currencys;
        drop table if exists balance_movements;
        drop type if exists movement_category;
        drop table if exists balances;
        drop table if exists no_spendable_inv_odt_incomes;
        drop table if exists spendable_inv_odt_incomes;
        drop table if exists admin_expenses;
        drop table if exists general_expenses;
        drop table if exists odts;
        drop table if exists accounts;
        drop table if exists currencys;
        drop table if exists entitys;
        drop table if exists clients;
        ` 
};
