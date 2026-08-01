import { query } from '../../../utils/db'

export default defineEventHandler(async () => {
  const res = await query('SELECT * FROM collections ORDER BY name ASC')
  return res.rows
})
