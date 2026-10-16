import { query } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const ordersRes = await query(`
    SELECT * FROM orders
    ORDER BY created_at DESC
  `)

  const orders = ordersRes.rows as any[]
  const result = []

  for (const order of orders) {
    const itemsRes = await query(`
      SELECT oi.*, p.name, p.slug, p.image, p.price
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id])

    result.push({
      id: order.id,
      customer_name: order.customer_name || 'Customer',
      email: order.email,
      phone: order.phone,
      shipping_address: order.shipping_address,
      total_price: parseFloat(order.total_price || 0),
      status: order.status || 'Pending',
      payment_status: order.payment_status || 'Unpaid',
      payment_reference: order.payment_reference,
      payment_channel: order.payment_channel,
      payment_receipt: order.payment_receipt || null,
      created_at: order.created_at,
      items: (itemsRes.rows as any[]).map(item => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price || 0),
        product: {
          id: item.product_id,
          name: item.name || `Item #${item.product_id}`,
          slug: item.slug || '',
          image: item.image || '/images/products/perf_usa_1.png',
          price: item.price ? parseFloat(item.price) : parseFloat(item.unit_price)
        }
      }))
    })
  }

  return result
})
