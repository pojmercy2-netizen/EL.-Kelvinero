import { query, getConnection } from '../../../utils/db'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async () => {
  try {
    // MySQL: INT AUTO_INCREMENT instead of SERIAL
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

    let res = await query('SELECT * FROM lookbook ORDER BY id ASC')

    // If table is newly created and empty, seed initial editorial looks
    if (res.rows.length === 0) {
      const initialLooks = [
        { title: 'The Classic', look_number: 'LOOK 01', description: 'A refined staple for modern silhouette.', image: '/images/lookbook_editorial_1.png', link: '/collection' },
        { title: 'The Statement', look_number: 'LOOK 02', description: 'Bold tailoring engineered to stand out.', image: '/images/lookbook_editorial_2.png', link: '/collection' },
        { title: 'The Everyday', look_number: 'LOOK 03', description: 'Elevated everyday essentials.', image: '/images/lookbook_lifestyle.png', link: '/shop' },
        { title: 'The After Dark', look_number: 'LOOK 04', description: 'All-black essentials engineered for effortless confidence.', image: '/images/lookbook_editorial_3.png', link: '/collection' },
        { title: 'The Refined Casual', look_number: 'LOOK 05', description: 'Between the boardroom and the weekend.', image: '/images/about_hero_model.png', link: '/shop' }
      ]

      for (const item of initialLooks) {
        await query(
          'INSERT INTO lookbook (title, look_number, description, image, link) VALUES (?, ?, ?, ?, ?)',
          [item.title, item.look_number, item.description, item.image, item.link]
        )
      }

      res = await query('SELECT * FROM lookbook ORDER BY id ASC')
    }

    return (res.rows as any[]).map(row => ({
      id: row.id,
      title: row.title,
      lookNumber: row.look_number || `LOOK ${row.id}`,
      description: row.description || '',
      image: row.image,
      link: row.link || '/shop',
      createdAt: row.created_at
    }))
  } catch (err) {
    console.error('Error fetching lookbook:', err)
    return []
  }
})
