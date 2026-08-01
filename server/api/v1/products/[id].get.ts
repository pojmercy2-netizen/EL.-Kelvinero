import { createError } from 'h3'
import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid product ID' })
  }

  const res = await query(`
    SELECT 
      p.*,
      cat.name AS cat_name, cat.slug AS cat_slug, cat.description AS cat_description, cat.created_at AS cat_created_at,
      coll.name AS coll_name, coll.slug AS coll_slug, coll.description AS coll_description, coll.created_at AS coll_created_at
    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.id
    LEFT JOIN collections coll ON p.collection_id = coll.id
    WHERE p.id = ?
  `, [id])

  const product = res.rows[0] as any

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Product not found' })
  }

  let sizeParsed = null, colorParsed = null
  try { sizeParsed = product.size ? JSON.parse(product.size) : null } catch { sizeParsed = product.size }
  try { colorParsed = product.color ? JSON.parse(product.color) : null } catch { colorParsed = product.color }

  return {
    ...product,
    price: parseFloat(product.price),
    size: sizeParsed,
    color: colorParsed,
    category: product.category_id ? { id: product.category_id, name: product.cat_name, slug: product.cat_slug, description: product.cat_description, created_at: product.cat_created_at } : null,
    collection: product.collection_id ? { id: product.collection_id, name: product.coll_name, slug: product.coll_slug, description: product.coll_description, created_at: product.coll_created_at } : null
  }
})
