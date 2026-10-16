import { createError } from 'h3'
import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const rawId = parseInt(event.context.params?.id as string, 10)
  if (isNaN(rawId)) {
    throw createError({ statusCode: 400, message: 'Invalid product ID' })
  }

  // Delete references in order_items or keep them null
  await query('UPDATE order_items SET product_id = NULL WHERE product_id = ?', [rawId])

  const res = await query('DELETE FROM products WHERE id = ? RETURNING id', [rawId])

  if (res.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  return { success: true, id: rawId }
})
