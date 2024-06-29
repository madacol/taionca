exports.up = pgm => {
    pgm.sql`

        alter type movement_category add value 'incomes' after 'loans';
        alter type movement_category add value 'investments' after 'incomes';

        CREATE TABLE incomes(
            id_income serial primary key,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE not null,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE not null,
            id_entity int REFERENCES entitys (id_entity) ON UPDATE CASCADE not null,
            amount decimal(30,10) not null,
            description varchar(512),
            created_at timestamp with time zone default current_timestamp
        );

        CREATE TABLE investments(
            id_investment serial primary key,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE not null,
            id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE not null,
            id_entity int REFERENCES entitys (id_entity) ON UPDATE CASCADE not null,
            amount decimal(30,10) not null,
            description varchar(512),
            created_at timestamp with time zone default current_timestamp
        );


        `
};
exports.down = pgm => {
    pgm.sql`    
         
        DROP TABLE IF EXISTS incomes;
        DROP TABLE IF EXISTS investments;

        `
};