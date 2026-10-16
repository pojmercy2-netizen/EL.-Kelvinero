import { createError, readBody } from 'h3'
import { query } from '../../../../utils/db'
import { requireAdmin } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const rawId = parseInt(event.context.params?.id as string, 10)
  if (isNaN(rawId)) {
    throw createError({ statusCode: 400, message: 'Invalid order ID' })
  }

  const body = await readBody(event)
  const { status, payment_status } = body || {}

  const updates: string[] = []
  const values: any[] = []

  if (status) {
    updates.push('status = ?')
    values.push(status)
  }

  if (payment_status) {
    updates.push('payment_status = ?')
    values.push(payment_status)
  }

  if (updates.length === 0) {
    throw createError({ statusCode: 400, message: 'No status or payment_status provided' })
  }

  values.push(rawId)
  const sql = `UPDATE orders SET ${updates.join(', ')} WHERE id = ? RETURNING *`
  const res = await query(sql, values)

  if (res.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  return {
    success: true,
    order: res.rows[0]
  }
})
