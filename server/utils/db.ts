/**
 * server/utils/db.ts
 *
 * MySQL + Drizzle ORM database connection singleton.
 * Provides:
 *   - getDb()   → Drizzle ORM instance (typed, query builder)
 *   - query()   → Raw SQL helper (pg-compatible API: { rows: [...] })
 *   - getConnection() → Raw mysql2 PoolConnection for manual transactions
 */

import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'
import * as schema from '../db/schema'

let _pool: mysql.Pool | null = null
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

// ─── Pool Singleton ───────────────────────────────────────────────────────────
function getMysqlPool(): mysql.Pool {
  if (_pool) return _pool

  const connectionString =
    process.env.DATABASE_URL ||
    (process.env.MYSQL_HOST
      ? undefined
      : undefined)

  if (connectionString && connectionString.startsWith('mysql')) {
    _pool = mysql.createPool(connectionString)
  } else {
    _pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'elkelvinero',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '+00:00',
    })
  }

  return _pool
}

// ─── Drizzle ORM Instance ─────────────────────────────────────────────────────
export function getDb() {
  if (!_db) {
    _db = drizzle(getMysqlPool(), { schema, mode: 'default' })
  }
  return _db
}

// ─── Raw SQL Helper (pg-compatible) ──────────────────────────────────────────
// Converts PostgreSQL $1,$2 positional params to MySQL ? placeholders,
// then executes via the mysql2 pool and returns { rows: [...] }.
export async function query(text: string, params?: any[]) {
  const pool = getMysqlPool()
  // Replace $1, $2, ... → ?
  const mysqlSql = text.replace(/\$\d+/g, '?')
  const [rows] = await pool.execute(mysqlSql, params || [])
  return { rows: Array.isArray(rows) ? rows as any[] : [rows as any] }
}

// ─── Raw Connection (for transactions) ───────────────────────────────────────
export async function getConnection(): Promise<mysql.PoolConnection> {
  return getMysqlPool().getConnection()
}

// ─── Legacy compat ───────────────────────────────────────────────────────────
export function getPool() {
  return getMysqlPool()
}
