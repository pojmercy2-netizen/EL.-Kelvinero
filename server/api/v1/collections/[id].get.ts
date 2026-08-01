import { createError } from 'h3'
import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid collection ID'
    })
  }

  const res = await query('SELECT * FROM collections WHERE id = ?', [id])
  const collection = res.rows[0]

  if (!collection) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Collection not found'
    })
  }

  return collection
})
