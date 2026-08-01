import { createError, readBody } from 'h3'
import { query } from '../../../utils/db'
import { verifyPassword, createAccessToken } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body || {}

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Email and password are required'
    })
  }

  const res = await query('SELECT * FROM users WHERE email = ?', [email])
  const user = res.rows[0]

  if (!user || !verifyPassword(password, user.hashed_password)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Incorrect email or password'
    })
  }

  const token = createAccessToken({ sub: user.email })

  return {
    access_token: token,
    token_type: 'bearer'
  }
})
