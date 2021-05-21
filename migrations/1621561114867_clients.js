exports.up = pgm => {
    pgm.sql`
        alter table clients
            add column phone_number1 varchar(20);

        alter table clients
            add column phone_number2 varchar(20);

        alter table clients
            add column email varchar(64);

        alter table clients
            add column address varchar(128);

        alter table clients
            add column description varchar(512);

        alter table clients
            add column legal_id varchar(128);
        `
};
exports.down = pgm => {
    pgm.sql`
            alter table clients drop column legal_id;
            alter table clients drop column description;
            alter table clients drop column address;
            alter table clients drop column email;
            alter table clients drop column phone_number2;
            alter table clients drop column phone_number1;
        ` 
};
