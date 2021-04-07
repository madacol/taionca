import { Client, Pool } from 'pg';
import { database as config } from './config';

export const pool = new Pool(config.pool);

/**
 * @param  { [ string, any[]? ] } args
 * check {@link https://node-postgres.com/api/client/#clientquery} for more options
 */
export async function query(...args) {
    { // Try to query with pool if possible
        const isPoolMaxed = (pool.totalCount === config.pool.max);
        const isAnyClientIdle = (pool.idleCount > 0);
        if (!isPoolMaxed || isAnyClientIdle) {
            return await pool.query(...args);
        }
    }
    // Otherwise create a disposable client
    const client = new Client(config.client);
    await client.connect();
    const result = await client.query(...args);
    client.end();
    return result;
}
