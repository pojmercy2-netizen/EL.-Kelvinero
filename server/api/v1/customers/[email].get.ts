import { createError } from 'h3'
import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const email = getRouterParam(event, 'email')
  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Email parameter is required' })
  }

  const res = await query(`
    SELECT 
      email,
      customer_name,
      phone,
      COUNT(id) AS total_orders,
      SUM(total_price) AS total_spent
    FROM orders
    WHERE email = ?
    GROUP BY email, customer_name, phone
  `, [email])

  const result = res.rows[0] as any

  if (!result) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Customer not found' })
  }

  return {
    email: result.email,
    customer_name: result.customer_name,
    phone: result.phone,
    total_orders: parseInt(result.total_orders, 10),
    total_spent: Math.round(parseFloat(result.total_spent || '0') * 100) / 100
  }
})
