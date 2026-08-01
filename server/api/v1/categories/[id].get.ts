import { createError } from 'h3'
import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid category ID'
    })
  }

  const res = await query('SELECT * FROM categories WHERE id = ?', [id])
  const category = res.rows[0]

  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Category not found'
    })
  }

  return category
})
