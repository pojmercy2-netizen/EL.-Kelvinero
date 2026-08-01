import { createError } from 'h3'
import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid order ID' })
  }

  const res = await query('SELECT * FROM orders WHERE id = ?', [id])
  const order = res.rows[0] as any

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Order not found' })
  }

  const itemsRes = await query(`
    SELECT oi.*, p.name, p.slug, p.image, p.price
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [id])

  return {
    ...order,
    total_price: parseFloat(order.total_price),
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
