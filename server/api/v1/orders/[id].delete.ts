import { createError, setResponseStatus } from 'h3'
import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const idStr = getRouterParam(event, 'id')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid order ID' })
  }

  const res = await query('SELECT id FROM orders WHERE id = ?', [id])
  if (res.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Order not found' })
  }

  await query('DELETE FROM orders WHERE id = ?', [id])

  setResponseStatus(event, 204)
  return null
})
