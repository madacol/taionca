exports.up = pgm => {
    pgm.sql(
        `--Tabla de Clientes
        create table clients(
            id_client serial primary key,
            name varchar(64) not null,
            created_at timestamp with time zone default current_timestamp
        );
        
        --Tabla de Monedas
        create table currencies(
            id_currency serial primary key,
            name_singular varchar(32) not null,
            name_plural varchar(32),
            symbol varchar(5),
            code varchar(5)
        );
        
        --Tabla de Cuentas Bancarias
        create table accounts(
            id_account serial primary key,
            name varchar(100) not null,
            id_currency integer not null
        );
        
        alter table accounts
            add constraint FK_accounts_currencies
            foreign key (id_currency)
            references currencies(id_currency);
        
        --Tabla de ODTs
        create table odts(
            id_odt serial primary key,
            amount decimal(30,10),
            id_client integer not null,
            description varchar(512) not null,
            id_currency integer not null,
            created_at timestamp with time zone default current_timestamp
        );
        
        alter table odts
            add constraint FK_odts_clients
            foreign key (id_client)
            references clients(id_client);
        
        alter table odts
            add constraint FK_odts_currencies
            foreign key (id_currency)
            references currencies(id_currency);
        
        --Tabla de Pagos
        create table payments(
            id_payment serial primary key,
            id_odt integer not null,
            id_account integer not null,
            amount decimal(30,10) not null,
            dollar_exchange_rate decimal(30,10),
            created_at timestamp with time zone default current_timestamp
        );
        
        alter table payments
            add constraint FK_payments_odts
            foreign key (id_odt)
            references odts(id_odt);
        
        alter table payments
            add constraint FK_payments_accounts
            foreign key (id_account)
            references accounts(id_account);
        
        --Tabla de Gastos
        create table expenses(
            id_expense serial primary key,
            id_odt integer not null,
            id_account integer not null,
            amount decimal(30,10) not null,
            dollar_exchange_rate decimal(30,10),
            description varchar(512) not null,
            evidence varchar(256) not null,
            created_at timestamp with time zone default current_timestamp
        );
        
        alter table expenses
            add constraint FK_expenses_odts
            foreign key (id_odt)
            references odts(id_odt);
        
        alter table expenses
            add constraint FK_expenses_accounts
            foreign key (id_account)
            references accounts(id_account);
        `
    )
};

exports.down = pgm => {
    pgm.sql(
        `drop table payments;
        drop table expenses;
        drop table odts;
        drop table accounts;
        drop table currencies;
        drop table clients;`
    )
};
