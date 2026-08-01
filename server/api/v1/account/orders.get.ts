import { getQuery } from 'h3'
import { query } from '../../../utils/db'
import { getCurrentUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)

  const q = getQuery(event)
  const skip = q.skip ? parseInt(q.skip as string, 10) : 0
  const limit = q.limit ? parseInt(q.limit as string, 10) : 50

  const res = await query(`
    SELECT * FROM orders
    WHERE LOWER(email) = LOWER(?)
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `, [user.email, limit, skip])

  const orders = res.rows as any[]
  const result = []

  for (const order of orders) {
    const itemsRes = await query(`
      SELECT oi.*, p.name, p.slug, p.image, p.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id])

    result.push({
      id: order.id,
      customer_name: order.customer_name,
      email: order.email,
      phone: order.phone,
      shipping_address: order.shipping_address,
      total_price: parseFloat(order.total_price),
      status: order.status,
      payment_status: order.payment_status,
      payment_reference: order.payment_reference,
      created_at: order.created_at,
      items: (itemsRes.rows as any[]).map(item => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        product: {
          id: item.product_id,
          name: item.name,
          slug: item.slug,
          image: item.image,
          price: parseFloat(item.price),
        }
      }))
    })
  }

  return result
})
