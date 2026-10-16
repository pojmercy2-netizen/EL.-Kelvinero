import { createError, readBody } from 'h3'
import { query } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const { name, category, subcategory, price, stock, image, color, description, size, collection_id } = body || {}

  if (!name || price === undefined) {
    throw createError({ statusCode: 400, message: 'Product name and price are required' })
  }

  // Find or create category
  let categoryId = null
  const cleanCat = category ? String(category).trim().toUpperCase() : 'PERFUMES'
  const catSlug = cleanCat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const catRes = await query('SELECT id FROM categories WHERE UPPER(name) = ? OR slug = ?', [cleanCat, catSlug])
  if (catRes.rows.length > 0) {
    categoryId = catRes.rows[0].id
  } else {
    const newCat = await query('INSERT INTO categories (name, slug) VALUES (?, ?) RETURNING id', [cleanCat, catSlug])
    categoryId = newCat.rows[0].id
  }

  const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString(36)}`
  const colorStr = Array.isArray(color) ? JSON.stringify(color) : (color || '["black"]')
  const sizeStr = Array.isArray(size) ? (size[0] || 'Standard') : (size || 'Standard')
  const subcategoryVal = subcategory ? String(subcategory).trim() : null

  const insertRes = await query(
    `INSERT INTO products (
      name, slug, description, price, category_id, collection_id, image, stock, size, color, subcategory
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    [
      name,
      slug,
      description || '',
      parseFloat(price),
      categoryId,
      collection_id ? parseInt(collection_id, 10) : null,
      image || '/images/products/perf_usa_1.png',
      parseInt(stock || '0', 10),
      sizeStr,
      colorStr,
      subcategoryVal
    ]
  )

  const inserted = insertRes.rows[0]
  return {
    ...inserted,
    cat_name: cleanCat,
    category: cleanCat,
    subcategory: subcategoryVal || ''
  }
})

