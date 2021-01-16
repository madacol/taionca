exports.up = pgm => {
    pgm.sql`
        --Tabla de Cambios de Moneda
create table currencyChanges(
    id_currencyChange serial primary key,
    description varchar(512) not null,
    id_responsable integer,
    created_at timestamp with time zone default current_timestamp
);

--Tabla de Gastos Recurrentes
create table usualExpenses(
    id_usualExpense serial primary key,
    name varchar(50) not null,
    amount decimal(30,10) not null,
    id_account integer not null,
    cycle varchar(20) not null,
    description varchar(512) not null,
    created_at timestamp with time zone default current_timestamp
);

alter table usualExpenses
    add constraint FK_usualExpenses_accounts
    foreign key (id_account)
    references accounts(id_account);
        `
};

exports.down = pgm => {
    pgm.sql(
        `
        drop table currencyChanges;
        drop table usualExpenses;
        `
    )
};
