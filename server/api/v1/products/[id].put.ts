import { createError, readBody } from 'h3'
import { query, getConnection } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const idStr = getRouterParam(event, 'id')
  const id = idStr ? parseInt(idStr, 10) : NaN

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid product ID' })
  }

  const body = await readBody(event)
  let { name, slug, description, price, category, category_id, collection, collection_id, image, stock, size, color } = body || {}

  // Auto resolve category_id from category name
  if (!category_id && category) {
    const catName = String(category).trim().toUpperCase()
    const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    let catRes = await query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) OR slug = ?', [catName, catSlug])
    if (catRes.rows.length === 0) {
      const conn = await getConnection()
      try {
        const [r] = await conn.execute('INSERT INTO categories (name, slug) VALUES (?, ?)', [catName, catSlug])
        category_id = (r as ResultSetHeader).insertId
      } finally { conn.release() }
    } else {
      category_id = (catRes.rows[0] as any).id
    }
  }

  if (price !== undefined && price < 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Price cannot be negative' })
  }
  if (stock !== undefined && stock < 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Stock cannot be negative' })
  }

  const checkRes = await query('SELECT * FROM products WHERE id = ?', [id])
  if (checkRes.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Product not found' })
  }

  if (category_id) {
    const catRes = await query('SELECT id FROM categories WHERE id = ?', [category_id])
    if (catRes.rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Category not found' })
    }
  }

  if (collection_id) {
    const collRes = await query('SELECT id FROM collections WHERE id = ?', [collection_id])
    if (collRes.rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Collection not found' })
    }
  }

  // Build dynamic UPDATE
  const updates: string[] = []
  const params: any[] = []

  if (name !== undefined)        { updates.push('name = ?');        params.push(name) }
  if (slug !== undefined) {
    const slugRes = await query('SELECT id FROM products WHERE slug = ? AND id != ?', [slug, id])
    if (slugRes.rows.length > 0) {
      throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: `Slug '${slug}' already exists` })
    }
    updates.push('slug = ?'); params.push(slug)
  }
  if (description !== undefined) { updates.push('description = ?'); params.push(description) }
  if (price !== undefined)       { updates.push('price = ?');       params.push(price) }
  if (category_id !== undefined) { updates.push('category_id = ?');   params.push(category_id || null) }
  if (collection_id !== undefined) { updates.push('collection_id = ?'); params.push(collection_id || null) }
  if (image !== undefined)       { updates.push('image = ?');       params.push(image) }
  if (stock !== undefined)       { updates.push('stock = ?');       params.push(stock) }
  if (size !== undefined)        { updates.push('size = ?');        params.push(size ? JSON.stringify(size) : null) }
  if (color !== undefined)       { updates.push('color = ?');       params.push(color ? JSON.stringify(color) : null) }

  if (updates.length > 0) {
    params.push(id)
    await query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params)
  }

  const updatedRes = await query(`
    SELECT 
      p.*,
      cat.name AS cat_name, cat.slug AS cat_slug, cat.description AS cat_description, cat.created_at AS cat_created_at,
      coll.name AS coll_name, coll.slug AS coll_slug, coll.description AS coll_description, coll.created_at AS coll_created_at
    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.id
    LEFT JOIN collections coll ON p.collection_id = coll.id
    WHERE p.id = ?
  `, [id])

  const p = updatedRes.rows[0] as any
  let sizeParsed = null, colorParsed = null
  try { sizeParsed = p.size ? JSON.parse(p.size) : null } catch { sizeParsed = p.size }
  try { colorParsed = p.color ? JSON.parse(p.color) : null } catch { colorParsed = p.color }

  return {
    ...p,
    price: parseFloat(p.price),
    size: sizeParsed,
    color: colorParsed,
    category: p.category_id ? { id: p.category_id, name: p.cat_name, slug: p.cat_slug, description: p.cat_description, created_at: p.cat_created_at } : null,
    collection: p.collection_id ? { id: p.collection_id, name: p.coll_name, slug: p.coll_slug, description: p.coll_description, created_at: p.coll_created_at } : null
  }
})
