import { getQuery } from 'h3'
import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const categoryId = q.category_id ? parseInt(q.category_id as string, 10) : null
  const collectionId = q.collection_id ? parseInt(q.collection_id as string, 10) : null
  const search = q.search ? (q.search as string).trim() : null
  const skip = q.skip ? parseInt(q.skip as string, 10) : 0
  const limit = q.limit ? parseInt(q.limit as string, 10) : 50

  let sql = `
    SELECT 
      p.id, p.name, p.slug, p.description, p.price, p.category_id, p.collection_id, p.image, p.stock, p.size, p.color, p.created_at,
      cat.name AS cat_name, cat.slug AS cat_slug, cat.description AS cat_description, cat.created_at AS cat_created_at,
      coll.name AS coll_name, coll.slug AS coll_slug, coll.description AS coll_description, coll.created_at AS coll_created_at
    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.id
    LEFT JOIN collections coll ON p.collection_id = coll.id
    WHERE 1=1
  `
  const params: any[] = []

  if (categoryId) {
    params.push(categoryId)
    sql += ` AND p.category_id = ?`
  }

  if (collectionId) {
    params.push(collectionId)
    sql += ` AND p.collection_id = ?`
  }

  if (search) {
    params.push(`%${search}%`)
    sql += ` AND p.name LIKE ?`   // MySQL LIKE is case-insensitive by default
  }

  params.push(limit)
  params.push(skip)
  sql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`

  const res = await query(sql, params)

  return (res.rows as any[]).map(row => {
    let sizeParsed = null
    let colorParsed = null
    try {
      sizeParsed = row.size ? JSON.parse(row.size) : null
    } catch {
      sizeParsed = row.size
    }
    try {
      colorParsed = row.color ? JSON.parse(row.color) : null
    } catch {
      colorParsed = row.color
    }

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: parseFloat(row.price),
      category_id: row.category_id,
      collection_id: row.collection_id,
      image: row.image,
      stock: row.stock,
      size: sizeParsed,
      color: colorParsed,
      created_at: row.created_at,
      category: row.category_id ? {
        id: row.category_id,
        name: row.cat_name,
        slug: row.cat_slug,
        description: row.cat_description,
        created_at: row.cat_created_at
      } : null,
      collection: row.collection_id ? {
        id: row.collection_id,
        name: row.coll_name,
        slug: row.coll_slug,
        description: row.coll_description,
        created_at: row.coll_created_at
      } : null
    }
  })
})
