import { createError, readBody } from 'h3'
import { query, getConnection } from '../../../utils/db'
import { hashPassword } from '../../../utils/auth'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password } = body || {}

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Name, email, and password are required'
    })
  }

  // Check if email already exists
  const existingRes = await query('SELECT id FROM users WHERE email = ?', [email])
  if (existingRes.rows.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Email is already registered'
    })
  }

  // First registered user becomes admin automatically
  const countRes = await query('SELECT COUNT(*) as count FROM users')
  const userCount = parseInt((countRes.rows[0] as any).count, 10)
  const isFirstUser = userCount === 0

  const hashedPassword = hashPassword(password)

  const conn = await getConnection()
  try {
    const [result] = await conn.execute(
      'INSERT INTO users (name, email, hashed_password, is_admin) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, isFirstUser ? 1 : 0]
    )
    const newId = (result as ResultSetHeader).insertId

    const newUserRes = await query(
      'SELECT id, name, email, is_admin, created_at FROM users WHERE id = ?',
      [newId]
    )
    const newUser = newUserRes.rows[0] as any

    return {
      ...newUser,
      is_admin: Boolean(newUser.is_admin)
    }
  } finally {
    conn.release()
  }
})
