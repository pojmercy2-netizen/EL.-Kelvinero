import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const res = await query(`
    SELECT 
      u.id,
      u.name,
      u.email,
      u.created_at,
      COALESCE(COUNT(o.id), 0) AS order_count,
      COALESCE(SUM(o.total_price), 0) AS total_spend
    FROM users u
    LEFT JOIN orders o ON LOWER(u.email) = LOWER(o.email)
    GROUP BY u.id, u.name, u.email, u.created_at
    ORDER BY u.created_at DESC
  `)

  return res.rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    joinDate: new Date(row.created_at).toISOString().split('T')[0],
    orderCount: parseInt(row.order_count, 10) || 0,
    totalSpend: Math.round(parseFloat(row.total_spend || '0') * 100) / 100
  }))
})
