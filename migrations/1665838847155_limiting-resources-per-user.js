exports.up = pgm => {
    pgm.sql`
       
       CREATE TABLE limit_resources(
        id_limit_resource serial primary key,
        id_user integer not null UNIQUE REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
        id_account int REFERENCES accounts (id_account) ON UPDATE CASCADE  ON DELETE CASCADE,
        amount decimal(30,10) default 0,
        created_at timestamp with time zone default current_timestamp
       );

       ALTER TABLE odts ADD COLUMN admin_percent decimal(5,5) DEFAULT 0.2;
       
        `
};
exports.down = pgm => {
    pgm.sql`
         
        
        ALTER TABLE odts DROP COLUMN admin_percent;
        DROP TABLE IF EXISTS limit_resources;

        `
};  