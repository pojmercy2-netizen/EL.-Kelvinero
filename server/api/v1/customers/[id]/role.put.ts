import { createError, readBody } from 'h3'
import { query } from '../../../../utils/db'
import { requireAdmin } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  const currentAdmin = await requireAdmin(event)
  const targetId = parseInt(event.context.params?.id as string, 10)
  
  if (isNaN(targetId)) {
    throw createError({ statusCode: 400, message: 'Invalid customer ID' })
  }

  const body = await readBody(event)
  const { is_admin } = body || {}

  if (typeof is_admin !== 'boolean') {
    throw createError({ statusCode: 400, message: 'is_admin boolean is required' })
  }

  // Prevent admin from removing their own admin status accidentally
  if (currentAdmin.id === targetId && !is_admin) {
    throw createError({ statusCode: 400, message: 'You cannot revoke your own administrator status.' })
  }

  const res = await query(
    'UPDATE users SET is_admin = ? WHERE id = ? RETURNING id, name, email, is_admin',
    [is_admin, targetId]
  )

  if (res.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return {
    success: true,
    user: res.rows[0]
  }
})
