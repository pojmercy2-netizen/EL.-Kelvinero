import { createError, readBody } from 'h3'
import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const idStr = getRouterParam(event, 'id')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid collection ID' })
  }

  const body = await readBody(event)
  const { name, slug, description } = body || {}

  const checkRes = await query('SELECT * FROM collections WHERE id = ?', [id])
  if (checkRes.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Collection not found' })
  }

  const updates: string[] = []
  const params: any[] = []

  if (name !== undefined)        { updates.push('name = ?');        params.push(name) }
  if (slug !== undefined) {
    const slugRes = await query('SELECT id FROM collections WHERE slug = ? AND id != ?', [slug, id])
    if (slugRes.rows.length > 0) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: `A collection with slug '${slug}' already exists` })
    }
    updates.push('slug = ?'); params.push(slug)
  }
  if (description !== undefined) { updates.push('description = ?'); params.push(description) }

  if (updates.length > 0) {
    params.push(id)
    await query(`UPDATE collections SET ${updates.join(', ')} WHERE id = ?`, params)
  }

  const updatedRes = await query('SELECT * FROM collections WHERE id = ?', [id])
  return updatedRes.rows[0]
})
