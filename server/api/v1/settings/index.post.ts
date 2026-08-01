import { createError, readBody } from 'h3'
import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid settings payload' })
  }

  // Ensure settings table exists
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(255) NOT NULL PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  for (const [key, value] of Object.entries(body)) {
    const jsonVal = JSON.stringify(value)
    // MySQL: ON DUPLICATE KEY UPDATE instead of PostgreSQL ON CONFLICT ... DO UPDATE
    await query(
      'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
      [key, jsonVal]
    )
  }

  return { success: true, message: 'Settings saved successfully' }
})
