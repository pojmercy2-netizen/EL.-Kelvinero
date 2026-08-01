import { createError, readBody } from 'h3'
import { query } from '../../../../utils/db'
import { requireAdmin } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const idStr = getRouterParam(event, 'id')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid order ID' })
  }

  const body = await readBody(event)
  const { status, payment_status } = body || {}

  const allowedStatuses = new Set(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
  const allowedPaymentStatuses = new Set(['Unpaid', 'Paid', 'Failed', 'Pending Verification'])

  const checkRes = await query('SELECT id, status, payment_status FROM orders WHERE id = ?', [id])
  if (checkRes.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Order not found' })
  }

  const currentOrder = checkRes.rows[0] as any
  let newStatus = currentOrder.status
  let newPaymentStatus = currentOrder.payment_status

  if (status && allowedStatuses.has(status)) {
    newStatus = status
    if (status === 'Processing' && newPaymentStatus !== 'Paid') {
      newPaymentStatus = 'Paid'
    }
  }

  if (payment_status && allowedPaymentStatuses.has(payment_status)) {
    newPaymentStatus = payment_status
    if (payment_status === 'Paid' && newStatus === 'Pending') {
      newStatus = 'Processing'
    }
  }

  await query('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?', [newStatus, newPaymentStatus, id])

  const updatedOrderRes = await query('SELECT * FROM orders WHERE id = ?', [id])
  const updatedOrder = updatedOrderRes.rows[0] as any

  const itemsRes = await query(`
    SELECT oi.*, p.name, p.slug, p.image, p.price
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [id])

  return {
    ...updatedOrder,
    total_price: parseFloat(updatedOrder.total_price),
    items: (itemsRes.rows as any[]).map(item => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price),
      product: {
        id: item.product_id,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: parseFloat(item.price)
      }
    }))
  }
})
