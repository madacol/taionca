export const database = {
  common: {
    connectionString: process.env.DATABASE_URL,
    query_timeout: 30000,
    connectionTimeoutMillis: 5000,
  },
  get pool(){return {
    ...this.common,
    max: 1,
    idleTimeoutMillis: 30000,
  }},
  get client(){return this.common},
}
