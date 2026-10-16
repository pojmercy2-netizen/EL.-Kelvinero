import { query } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Ensure admin privileges
  await requireAdmin(event)

  // Fetch all registered users and aggregate order statistics
  const usersRes = await query(`
    SELECT 
      u.id,
      u.name,
      u.email,
      u.is_admin,
      u.created_at,
      COUNT(o.id) AS order_count,
      COALESCE(SUM(CASE WHEN o.total_price IS NOT NULL THEN o.total_price ELSE 0 END), 0) AS total_spend
    FROM users u
    LEFT JOIN orders o ON LOWER(u.email) = LOWER(o.email)
    GROUP BY u.id, u.name, u.email, u.is_admin, u.created_at
    ORDER BY u.created_at DESC
  `)

  // For each customer, also fetch their latest order/activity
  const customers = []
  for (const row of usersRes.rows as any[]) {
    const ordersRes = await query(`
      SELECT id, total_price, status, created_at
      FROM orders
      WHERE LOWER(email) = LOWER(?)
      ORDER BY created_at DESC
      LIMIT 5
    `, [row.email])

    const recentOrders = (ordersRes.rows as any[]).map(o => ({
      id: `EK-${o.id}`,
      rawId: o.id,
      total: parseFloat(o.total_price || 0),
      status: o.status || 'Pending',
      date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }))

    const joinDate = row.created_at 
      ? new Date(row.created_at).toISOString().split('T')[0]
      : '2026-01-01'

    customers.push({
      id: row.id,
      name: row.name || 'Valued Client',
      email: row.email,
      isAdmin: Boolean(row.is_admin),
      is_admin: Boolean(row.is_admin),
      joinDate,
      orderCount: parseInt(row.order_count || '0', 10),
      totalSpend: parseFloat(row.total_spend || '0'),
      recentOrders
    })
  }

  return customers
})
