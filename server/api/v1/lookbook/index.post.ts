import { getConnection, query } from '../../../utils/db'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, lookNumber, description, image, link } = body || {}

    if (!title || !image) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and Image URL are required'
      })
    }

    await query(`
      CREATE TABLE IF NOT EXISTS lookbook (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        look_number VARCHAR(50),
        description TEXT,
        image TEXT NOT NULL,
        link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const conn = await getConnection()
    try {
      const [result] = await conn.execute(
        'INSERT INTO lookbook (title, look_number, description, image, link) VALUES (?, ?, ?, ?, ?)',
        [title, lookNumber || 'LOOK', description || '', image, link || '/shop']
      )
      const newId = (result as ResultSetHeader).insertId

      const rowRes = await query('SELECT * FROM lookbook WHERE id = ?', [newId])
      const row = rowRes.rows[0] as any

      return {
        success: true,
        look: {
          id: row.id,
          title: row.title,
          lookNumber: row.look_number,
          description: row.description,
          image: row.image,
          link: row.link,
          createdAt: row.created_at
        }
      }
    } finally {
      conn.release()
    }
  } catch (err: any) {
    console.error('Error creating lookbook entry:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Failed to add lookbook entry'
    })
  }
})
