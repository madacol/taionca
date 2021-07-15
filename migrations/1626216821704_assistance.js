exports.up = pgm => {
    pgm.sql`
        create table supervisor_attendances(
            id_supervisor_attendance serial primary key,
            id_user_supervisor integer not null REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE, --User who record the attendance
            id_user_employee integer not null REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE, --User owner of this record
            entry_date timestamp with time zone default null,
            departure_date timestamp with time zone default null,
            -- constraint supervisor_attendances_users_supervisor_fk FOREIGN KEY (id_user) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
            -- constraint supervisor_attendances_users_employee_fk FOREIGN KEY (id_user) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
            -- unique(entry_date, id_user_employee),
            -- unique(departure_date, id_user_employee),
            created_at timestamp with time zone default current_timestamp
        );
        
        create unique index entry_date_user_constraint on supervisor_attendances (id_user_employee, DATE_TRUNC('day', entry_date AT TIME ZONE 'UTC' ));
        create unique index departure_date_user_constraint on supervisor_attendances (id_user_employee, DATE_TRUNC('day', departure_date AT TIME ZONE 'UTC'));
        `
};
exports.down = pgm => {
    pgm.sql`
         
         drop index if exists departure_date_user_constraint;
         drop index if exists entry_date_user_constraint;
         drop table if exists supervisor_attendances;
        ` 
};