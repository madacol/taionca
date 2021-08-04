exports.up = pgm => {
    pgm.sql`

        DELETE FROM join_roles_permissions
        WHERE role_id = 4 AND permission_id = 6;
       
       INSERT INTO public.join_roles_permissions
        ( role_id, permission_id )
        VALUES ( '4'::integer, '6'::integer);
  
        `
};
exports.down = pgm => {
    pgm.sql`
         
         
        DELETE FROM join_roles_permissions
        WHERE role_id = 4 AND permission_id = 6;
        `
};