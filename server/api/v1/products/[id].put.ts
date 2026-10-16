import { createError, readBody } from 'h3'
import { query } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const rawId = parseInt(event.context.params?.id as string, 10)
  if (isNaN(rawId)) {
    throw createError({ statusCode: 400, message: 'Invalid product ID' })
  }

  const body = await readBody(event)
  const { name, category, subcategory, price, stock, image, color, description, size, collection_id } = body || {}

  let categoryId = undefined
  if (category !== undefined) {
    const cleanCat = String(category).trim().toUpperCase()
    const catSlug = cleanCat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const catRes = await query('SELECT id FROM categories WHERE UPPER(name) = ? OR slug = ?', [cleanCat, catSlug])
    if (catRes.rows.length > 0) {
      categoryId = catRes.rows[0].id
    } else {
      const newCat = await query('INSERT INTO categories (name, slug) VALUES (?, ?) RETURNING id', [cleanCat, catSlug])
      categoryId = newCat.rows[0].id
    }
  }

  const updates: string[] = []
  const values: any[] = []

  if (name !== undefined) {
    updates.push('name = ?')
    values.push(name)
  }
  if (subcategory !== undefined) {
    updates.push('subcategory = ?')
    values.push(subcategory ? String(subcategory).trim() : null)
  }
  if (price !== undefined) {
    updates.push('price = ?')
    values.push(parseFloat(price))
  }
  if (stock !== undefined) {
    updates.push('stock = ?')
    values.push(parseInt(stock, 10))
  }
  if (image !== undefined) {
    updates.push('image = ?')
    values.push(image)
  }
  if (color !== undefined) {
    updates.push('color = ?')
    values.push(Array.isArray(color) ? JSON.stringify(color) : color)
  }
  if (description !== undefined) {
    updates.push('description = ?')
    values.push(description)
  }
  if (size !== undefined) {
    updates.push('size = ?')
    values.push(Array.isArray(size) ? (size[0] || 'Standard') : size)
  }
  if (categoryId !== undefined) {
    updates.push('category_id = ?')
    values.push(categoryId)
  }
  if (collection_id !== undefined) {
    updates.push('collection_id = ?')
    values.push(collection_id ? parseInt(collection_id, 10) : null)
  }

  if (updates.length === 0) {
    throw createError({ statusCode: 400, message: 'No fields provided to update' })
  }

  values.push(rawId)
  const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ? RETURNING *`
  const res = await query(sql, values)

  if (res.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  const updated = res.rows[0]
  return {
    ...updated,
    cat_name: category ? String(category).trim().toUpperCase() : undefined,
    category: category ? String(category).trim().toUpperCase() : undefined,
    subcategory: updated.subcategory || ''
  }
})

