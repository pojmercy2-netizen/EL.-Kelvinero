import { createError, setResponseStatus } from 'h3'
import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const email = getRouterParam(event, 'email')
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Email parameter is required'
    })
  }

  const res = await query('SELECT id FROM orders WHERE email = ?', [email])
  if (res.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'No orders found for this customer'
    })
  }

  await query('DELETE FROM orders WHERE email = ?', [email])

  setResponseStatus(event, 204)
  return null
})
