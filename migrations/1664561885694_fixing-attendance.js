exports.up = pgm => {
    pgm.sql`
       
       ALTER TABLE supervisor_attendances RENAME TO attendances; 
       ALTER TABLE attendances DROP COLUMN id_user_supervisor;
       ALTER TABLE attendances RENAME COLUMN id_supervisor_attendance TO id_attendance;
       ALTER TABLE attendances RENAME COLUMN id_user_employee TO id_user;

            
        `
};
exports.down = pgm => {
    pgm.sql`
         
        ALTER TABLE attendances RENAME TO supervisor_attendances; 
        ALTER TABLE supervisor_attendances ADD COLUMN id_user_supervisor integer; 
        ALTER TABLE supervisor_attendances RENAME COLUMN id_attendance TO id_supervisor_attendance;
        ALTER TABLE supervisor_attendances RENAME COLUMN id_user TO id_user_employee;
        `
};