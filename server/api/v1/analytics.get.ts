import { query } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  // 1. Total revenue & orders
  const statsRes = await query(`
    SELECT 
      COALESCE(SUM(total_price), 0) AS total_revenue,
      COUNT(id) AS total_orders
    FROM orders
  `)
  const totalRevenue = parseFloat(statsRes.rows[0]?.total_revenue || '0')
  const totalOrders = parseInt(statsRes.rows[0]?.total_orders || '0', 10)
  const avgBasket = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // 2. Leaderboard from real products and sales
  const leaderRes = await query(`
    SELECT 
      p.id,
      p.name,
      COALESCE(c.name, 'PERFUMES') AS category,
      COALESCE(SUM(oi.quantity), 0) AS sales_count,
      COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id, p.name, c.name
    ORDER BY revenue DESC, sales_count DESC
    LIMIT 6
  `)

  const leaderboard = (leaderRes.rows as any[]).map(r => ({
    id: r.id,
    name: r.name,
    category: r.category,
    salesCount: parseInt(r.sales_count || '0', 10),
    revenue: parseFloat(r.revenue || '0'),
    conversion: 3.5
  }))

  // 3. Category distribution
  const catShareRes = await query(`
    SELECT 
      COALESCE(c.name, 'PERFUMES') AS category,
      COUNT(p.id) AS product_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    GROUP BY c.name
    ORDER BY product_count DESC
  `)

  const categoryDistribution = (catShareRes.rows as any[]).map(r => ({
    name: r.category,
    count: parseInt(r.product_count || '0', 10)
  }))

  return {
    totalRevenue,
    totalOrders,
    avgBasket,
    leaderboard,
    categoryDistribution
  }
})
