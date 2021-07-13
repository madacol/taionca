exports.up = pgm => {
    pgm.sql`

        create table time_frequencys (
            id_time_frequency serial primary key,
            term varchar(32),
            term_label varchar(32),
            created_at timestamp with time zone default current_timestamp
        );
        
        INSERT INTO public.time_frequencys
            ( term, term_label )
            VALUES 
                ('daily', 'Diario'), 
                ('weekly', 'Semanal'), 
                ('biweekly', 'Quincenal'), 
                ('monthly', 'Mensual'), 
                ('bimonthly', 'Bimestral'), 
                ('quarterly', 'Trimestral'), 
                ('biannual', 'Semestral'), 
                ('yearly', 'Anual'), 
                ('every x days', 'Cantidad determinada de días');
                
        create table recurrent_responsibilitys (
            id_recurrent_responsibility serial primary key,
            name varchar(64) unique not null,
            description varchar(4096) not null,
            importance int constraint importance_in_range check (importance >= 0 AND importance <= 100) not null,
            id_time_frequency int REFERENCES time_frequencys (id_time_frequency) ON UPDATE CASCADE ON DELETE CASCADE not null,
            days_to_repeat int default null,
            created_at timestamp with time zone default current_timestamp
        );

        create table active_responsibilitys (
            id_active_responsibility serial primary key,
            id_recurrent_responsibility int REFERENCES recurrent_responsibilitys (id_recurrent_responsibility) ON UPDATE CASCADE ON DELETE CASCADE not null,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE not null,
            unique (id_recurrent_responsibility, id_user),
            times_remaining integer check (times_remaining > 0 ) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table pending_responsibilitys (
            id_pending_responsibility serial primary key,
            id_active_responsibility int REFERENCES active_responsibilitys (id_active_responsibility) ON UPDATE CASCADE ON DELETE CASCADE not null,
            deadline timestamp with time zone not null,
            -- awaiting_approval boolean default FALSE not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table awaiting_approval_responsibilitys(
            id_awaiting_approval_responsibility serial primary key,
            id_pending_responsibility int REFERENCES pending_responsibilitys (id_pending_responsibility) ON UPDATE CASCADE ON DELETE CASCADE unique not null,
            description_evidence varchar(2048) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table completed_responsibilitys(
            id_completed_responsibility serial primary key,
            id_recurrent_responsibility int REFERENCES recurrent_responsibilitys (id_recurrent_responsibility) ON UPDATE CASCADE ON DELETE CASCADE not null,
            id_user_who_made int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE not null, --This user is who carried out the responsibility
            id_user_who_approved int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE not null, --This user is who approved the responsibility
            description_evidence varchar(2048) not null,
            created_at timestamp with time zone default current_timestamp
        );
        
        `
};
exports.down = pgm => {
    pgm.sql`
        drop table if exists completed_responsibilitys;
        drop table if exists awaiting_approval_responsibilitys;
        drop table if exists pending_responsibilitys;
        drop table if exists active_responsibilitys;
        drop table if exists recurrent_responsibilitys;
        drop table if exists time_frequencys;
        ` 
};
