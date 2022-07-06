exports.up = pgm => {
    pgm.sql`
       
        create table logs (
            id_log serial primary key,
            path varchar(256), 
            body json, 
            method varchar(10), 
            params json,
            headers json,
            user_session json,
            created_at timestamp with time zone default current_timestamp
        );      

  
        `
};
exports.down = pgm => {
    pgm.sql`
         
        DROP TABLE IF EXISTS logs;
        `
};