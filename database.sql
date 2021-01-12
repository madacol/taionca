drop table if exists incomes;
drop table if exists expenses;
drop table if exists odts;
drop table if exists accounts;
drop table if exists currencies;
drop table if exists clients;

--Tabla de Clientes
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
    id_currency integer not null,
    name varchar(50) not null,
    balance decimal(30,10),
    created_at timestamp with time zone default current_timestamp
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
create table incomes(
    id_income serial primary key,
    id_odt integer not null,
    id_account integer not null,
    amount decimal(30,10) not null,
    dollar_exchange_rate decimal(30,10),
    category varchar(50) not null,
    created_at timestamp with time zone default current_timestamp
);

alter table incomes
    add constraint FK_incomes_odts
    foreign key (id_odt)
    references odts(id_odt);

alter table incomes
    add constraint FK_incomes_accounts
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
    category varchar(50) not null, -- enum o tabla referencia
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

------------------------------------------------------------------------------
--Tabla de Cambios de Moneda
create table currencyChanges(
    id_currencyChange serial primary key,
    id_expense integer not null,
    id_income integer not null,
    description varchar(512) not null,
    responsable varchar (50) not null,
    created_at timestamp with time zone default current_timestamp
);

alter table currencyChanges
    add constraint FK_currencyChanges_expenses
    foreign key (id_expense)
    references expenses(id_expense);

alter table currencyChanges
    add constraint FK_currencyChanges_incomes
    foreign key (id_income)
    references incomes(id_income);
    
alter table currencyChanges
    add constraint FK_currencyChanges_accounts
    foreign key (id_account_out)
    references accounts(id_account);

alter table currencyChanges
    add constraint FK_currencyChanges_accounts
    foreign key (id_account_in)
    references accounts(id_account);

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

--Tabla de Gastos Inventariados

-----------------------------------------------------------------------
 -- Agregamos una restricción "foreign key" a la tabla "libros":
 alter table libros
   add constraint FK_libros_codigoeditorial
   foreign key (codigoeditorial)
   references editoriales(codigo);

 -- Ingresamos un libro con un código de editorial existente:
 insert into libros(titulo,autor,codigoeditorial) values('Aprenda ASP.Net','Jose Paez',2);

 -- Ingresamos un libro con un código de editorial inexistente:
 insert into libros(titulo,autor,codigoeditorial) values('JSP basico','Tornado Luis',7);
 --Aparece un mensaje de error y no se ejecuta la inserción.