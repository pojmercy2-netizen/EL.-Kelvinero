import { query } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  // 1. Total Revenue
  const revRes = await query('SELECT COALESCE(SUM(total_price), 0) AS total_revenue FROM orders')
  const totalRevenue = parseFloat(revRes.rows[0]?.total_revenue || '0')

  // 2. Total Orders
  const ordRes = await query('SELECT COUNT(*) AS total_orders FROM orders')
  const totalOrders = parseInt(ordRes.rows[0]?.total_orders || '0', 10)

  // 3. Total Products
  const prodRes = await query('SELECT COUNT(*) AS total_products FROM products')
  const totalProducts = parseInt(prodRes.rows[0]?.total_products || '0', 10)

  // 4. Total Customers (Registered users)
  const custRes = await query('SELECT COUNT(*) AS total_customers FROM users')
  const totalCustomers = parseInt(custRes.rows[0]?.total_customers || '0', 10)

  // 5. Latest 5 Orders
  const latestOrdersRes = await query(`
    SELECT * FROM orders
    ORDER BY created_at DESC
    LIMIT 5
  `)
  const latestOrders = []
  for (const order of latestOrdersRes.rows as any[]) {
    const itemsRes = await query(`
      SELECT oi.*, p.name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id])

    latestOrders.push({
      id: order.id,
      customer_name: order.customer_name || 'Customer',
      email: order.email,
      created_at: order.created_at,
      total_price: parseFloat(order.total_price || 0),
      status: order.status || 'Pending',
      items: itemsRes.rows
    })
  }

  // 6. Top Selling Products
  const topProdRes = await query(`
    SELECT 
      p.id,
      p.name,
      p.image,
      COALESCE(SUM(oi.quantity), 0) AS sales_count,
      COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id, p.name, p.image
    ORDER BY sales_count DESC
    LIMIT 4
  `)

  let topProducts = (topProdRes.rows as any[]).map(p => ({
    id: p.id,
    name: p.name,
    image: p.image || '/images/products/perf_usa_1.png',
    salesCount: parseInt(p.sales_count || '0', 10),
    revenue: parseFloat(p.revenue || '0')
  }))

  // If no order items yet, fallback to top products from products table
  if (topProducts.length === 0) {
    const fallbackProd = await query('SELECT id, name, image, price FROM products LIMIT 4')
    topProducts = (fallbackProd.rows as any[]).map(p => ({
      id: p.id,
      name: p.name,
      image: p.image || '/images/products/perf_usa_1.png',
      salesCount: 0,
      revenue: 0
    }))
  }

  return {
    total_revenue: totalRevenue,
    total_orders: totalOrders,
    total_products: totalProducts,
    total_customers: totalCustomers,
    latest_orders: latestOrders,
    top_products: topProducts
  }
})
