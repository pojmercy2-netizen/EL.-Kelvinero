import { getQuery } from 'h3'
import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const q = getQuery(event)
  const statusFilter = q.status_filter ? (q.status_filter as string) : null
  const skip = q.skip ? parseInt(q.skip as string, 10) : 0
  const limit = q.limit ? parseInt(q.limit as string, 10) : 50

  let sql = 'SELECT * FROM orders WHERE 1=1'
  const params: any[] = []

  if (statusFilter) {
    params.push(statusFilter)
    sql += ` AND status = ?`
  }

  params.push(limit)
  params.push(skip)
  sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`

  const res = await query(sql, params)
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

  return result
})
