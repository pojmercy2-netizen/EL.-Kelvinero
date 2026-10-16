import pg from 'pg'

let _pgPool: pg.Pool | null = null

export function getPgPool(): pg.Pool {
  if (_pgPool) return _pgPool

  const config = useRuntimeConfig()
  const connectionString =
    process.env.DATABASE_URL ||
    config.dbUrl ||
    'postgresql://postgres:Ebimene0812%3F%3F@localhost:5432/tzorah_emporium'

  _pgPool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

  _pgPool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err)
  })

  return _pgPool
}

export async function query(text: string, params?: any[]): Promise<{ rows: any[] }> {
  const pool = getPgPool()
  // Replace MySQL-style '?' placeholders with Postgres positional '$1, $2, ...'
  let paramIdx = 1
  const pgSql = text.replace(/\?/g, () => `$${paramIdx++}`)
  const res = await pool.query(pgSql, params || [])
  return { rows: res.rows }
}

export async function getConnection() {
  const pool = getPgPool()
  const client = await pool.connect()
  return {
    execute: async (sql: string, params?: any[]) => {
      let paramIdx = 1
      const pgSql = sql.replace(/\?/g, () => `$${paramIdx++}`)
      const res = await client.query(pgSql, params || [])
      return [res.rows, res.fields]
    },
    release: () => client.release()
  }
}

export function getPool() {
  return getPgPool()
}
