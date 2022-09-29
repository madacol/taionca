/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql`
        alter table logs
        add column response_status_code integer,
        add column response_status_message varchar(256);
    `
};

exports.down = pgm => {
    pgm.sql`
        alter table logs
        drop column response_status_code,
        drop column response_status_message;
    `
};
