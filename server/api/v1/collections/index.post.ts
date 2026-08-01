import { createError, readBody } from 'h3'
import { query, getConnection } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { name, slug, description } = body || {}

  if (!name || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Name and slug are required' })
  }

  const existingRes = await query('SELECT id FROM collections WHERE slug = ?', [slug])
  if (existingRes.rows.length > 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: `A collection with slug '${slug}' already exists` })
  }

  const conn = await getConnection()
  try {
    const [result] = await conn.execute(
      'INSERT INTO collections (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || null]
    )
    const newId = (result as ResultSetHeader).insertId
    const newRes = await query('SELECT * FROM collections WHERE id = ?', [newId])
    return newRes.rows[0]
  } finally {
    conn.release()
  }
})
