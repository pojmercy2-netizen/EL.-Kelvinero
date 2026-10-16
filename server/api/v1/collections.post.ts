import { createError, readBody } from 'h3'
import { query } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { name, slug, description } = body || {}

  if (!name || !slug) {
    throw createError({ statusCode: 400, message: 'Collection name and slug are required' })
  }

  const existing = await query('SELECT * FROM collections WHERE slug = ?', [slug])
  if (existing.rows.length > 0) {
    return existing.rows[0]
  }

  const res = await query(
    'INSERT INTO collections (name, slug, description) VALUES (?, ?, ?) RETURNING *',
    [name, slug, description || null]
  )

  return res.rows[0]
})
