exports.up = pgm => {
    pgm.sql`
       
       DROP INDEX IF EXISTS entry_date_user_constraint;
       DROP INDEX IF EXISTS departure_date_user_constraint;

       CREATE EXTENSION IF NOT EXISTS btree_gist;

        ALTER TABLE attendances ADD CONSTRAINT check_attendance_overlaps
        EXCLUDE USING gist (
            id_user WITH =,
            tstzrange(entry_date, departure_date) WITH &&);
       
        `
};
exports.down = pgm => {
    pgm.sql`
         
         ALTER TABLE attendances DROP CONSTRAINT check_attendance_overlaps;
        `
};  