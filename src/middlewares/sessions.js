import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { session_options } from '../config';
import { pool } from '../db';
const PgStore = pgSession(session);
session_options.store = new PgStore({pool});

export default dev => {
    if (dev) {
        session_options.secret = "TRYLr8U0iPhkmzHO+HT+xHkdKovUMBxw0Q4LZp9F"
    } else {
        session_options.cookie.secure = true
        session_options.cookie.domain = "taionca.com"
    }

    return session(session_options);
}