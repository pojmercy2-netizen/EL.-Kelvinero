import { query } from '../../../utils/db'

export default defineEventHandler(async () => {
  const res = await query('SELECT * FROM categories ORDER BY name ASC')
  return res.rows
})
