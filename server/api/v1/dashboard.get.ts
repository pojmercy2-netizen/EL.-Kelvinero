import { query } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const prodRes = await query('SELECT COUNT(id) as count FROM products')
  const totalProducts = parseInt((prodRes.rows[0] as any)?.count || '0', 10)

  const ordersRes = await query('SELECT COUNT(id) as count FROM orders')
  const totalOrders = parseInt((ordersRes.rows[0] as any)?.count || '0', 10)

  const custRes = await query('SELECT COUNT(id) as count FROM users')
  const totalCustomers = parseInt((custRes.rows[0] as any)?.count || '0', 10)

  const revRes = await query('SELECT SUM(total_price) as sum FROM orders')
  const totalRevenue = parseFloat((revRes.rows[0] as any)?.sum || '0')

  const latestRes = await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 10')
  const latestOrders = latestRes.rows as any[]

  const ordersWithItems = []
  for (const order of latestOrders) {
    const itemsRes = await query(`
      SELECT oi.*, p.name, p.slug, p.image, p.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id])

    ordersWithItems.push({
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
    })
  }

  return {
    total_products: totalProducts,
    total_orders: totalOrders,
    total_customers: totalCustomers,
    total_revenue: Math.round(totalRevenue * 100) / 100,
    latest_orders: ordersWithItems
  }
})
