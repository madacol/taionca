exports.up = pgm => {
    pgm.sql`

        DELETE FROM join_roles_permissions
        WHERE role_id = 4 AND permission_id = 6;
       
        INSERT INTO public.join_roles_permissions
        ( role_id, permission_id )
        VALUES ( '4'::integer, '6'::integer);

        alter type movement_category add value 'transfer_entities' after 'closure_odts';

        CREATE TABLE transfer_entitys (
            id_transfer_entity serial primary key,
            description varchar(512),
            created_at timestamp with time zone default current_timestamp
        );            

  
        `
};
exports.down = pgm => {
    pgm.sql`
         
        DROP TABLE IF EXISTS transfer_entitys;
        DELETE FROM join_roles_permissions
        WHERE role_id = 4 AND permission_id = 6;
        `
};