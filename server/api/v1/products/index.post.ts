import { createError, readBody } from 'h3'
import { query, getConnection } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  let { name, slug, description, price, category, category_id, collection, collection_id, image, stock, size, color } = body || {}

  if (!name || price === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Name and price are required'
    })
  }

  if (!slug) {
    slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  if (price < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Price cannot be negative'
    })
  }

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
      } finally {
        conn.release()
      }
    } else {
      category_id = (catRes.rows[0] as any).id
    }
  }

  // Auto resolve collection_id from collection name
  if (!collection_id && collection) {
    const collName = String(collection).trim()
    const collSlug = collName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    let collRes = await query('SELECT id FROM collections WHERE LOWER(name) = LOWER(?) OR slug = ?', [collName, collSlug])
    if (collRes.rows.length === 0) {
      const conn = await getConnection()
      try {
        const [r] = await conn.execute('INSERT INTO collections (name, slug) VALUES (?, ?)', [collName, collSlug])
        collection_id = (r as ResultSetHeader).insertId
      } finally {
        conn.release()
      }
    } else {
      collection_id = (collRes.rows[0] as any).id
    }
  }

  const existingRes = await query('SELECT id FROM products WHERE slug = ?', [slug])
  if (existingRes.rows.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`
  }

  const sizeStr = size ? (typeof size === 'string' ? size : JSON.stringify(size)) : JSON.stringify(['S', 'M', 'L', 'XL'])
  const colorStr = color ? (typeof color === 'string' ? color : JSON.stringify(color)) : JSON.stringify(['Black', 'Cream'])

  const conn = await getConnection()
  try {
    const [insertResult] = await conn.execute(
      `INSERT INTO products (name, slug, description, price, category_id, collection_id, image, stock, size, color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        description || `${name} - Premium product from EL. Kelvinero.`,
        parseFloat(price),
        category_id || null,
        collection_id || null,
        image || '/logo.png',
        stock !== undefined ? parseInt(stock, 10) : 50,
        sizeStr,
        colorStr
      ]
    )
    const newId = (insertResult as ResultSetHeader).insertId

    const createdRes = await query(`
      SELECT 
        p.*,
        cat.name AS cat_name, cat.slug AS cat_slug, cat.description AS cat_description, cat.created_at AS cat_created_at,
        coll.name AS coll_name, coll.slug AS coll_slug, coll.description AS coll_description, coll.created_at AS coll_created_at
      FROM products p
      LEFT JOIN categories cat ON p.category_id = cat.id
      LEFT JOIN collections coll ON p.collection_id = coll.id
      WHERE p.id = ?
    `, [newId])
    const prod = createdRes.rows[0] as any

    let sizeParsed = null
    let colorParsed = null
    try { sizeParsed = prod.size ? JSON.parse(prod.size) : null } catch { sizeParsed = prod.size }
    try { colorParsed = prod.color ? JSON.parse(prod.color) : null } catch { colorParsed = prod.color }

    return {
      ...prod,
      price: parseFloat(prod.price),
      size: sizeParsed,
      color: colorParsed,
      category: prod.category_id ? {
        id: prod.category_id,
        name: prod.cat_name,
        slug: prod.cat_slug,
        description: prod.cat_description,
        created_at: prod.cat_created_at
      } : null,
      collection: prod.collection_id ? {
        id: prod.collection_id,
        name: prod.coll_name,
        slug: prod.coll_slug,
        description: prod.coll_description,
        created_at: prod.coll_created_at
      } : null
    }
  } finally {
    conn.release()
  }
})
