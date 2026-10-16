import { readBody } from 'h3'
import { query } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event) || {}

  for (const [key, value] of Object.entries(body)) {
    const valString = typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value)
    await query(
      `INSERT INTO settings (key, value)
       VALUES (?, ?)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, valString]
    )
  }

  return { success: true, message: 'Settings saved successfully' }
})
