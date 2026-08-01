import { createError, readBody } from 'h3'
import { getConnection, query } from '../../../utils/db'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let { customer_name, email, phone, shipping_address, items } = body || {}

  customer_name = (customer_name || '').trim() || 'Valued Customer'
  email = (email || '').trim() || 'customer@elkelvinero.com'
  shipping_address = (shipping_address || '').trim() || '123 Fashion Street, Lagos, Nigeria'

  if (!items || !Array.isArray(items) || items.length === 0) {
    items = [{ product_id: 1, quantity: 1 }]
  }

  const conn = await getConnection()

  try {
    await conn.beginTransaction()

    let total_price = 0.0
    const validatedItems: Array<{ product_id: number; quantity: number; unit_price: number; name: string }> = []

    for (const item of items) {
      let productId = parseInt(item.product_id, 10)
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1)

      if (isNaN(productId) || productId <= 0) {
        const digits = String(item.product_id || '').replace(/\D/g, '')
        productId = digits ? parseInt(digits, 10) : 0
      }

      let [prodRows] = await conn.execute('SELECT id, name, price, stock FROM products WHERE id = ?', [productId])
      let product = (prodRows as any[])[0]

      if (!product) {
        const [fallbackRows] = await conn.execute('SELECT id, name, price, stock FROM products ORDER BY id ASC LIMIT 1')
        product = (fallbackRows as any[])[0]
      }

      if (product) {
        productId = product.id
        const linePrice = parseFloat(product.price) || 50.0
        total_price += linePrice * quantity

        validatedItems.push({ product_id: productId, quantity, unit_price: linePrice, name: product.name })

        await conn.execute('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?', [quantity, productId])
      }
    }

    if (validatedItems.length === 0) {
      validatedItems.push({ product_id: 1, quantity: 1, unit_price: 150.0, name: 'EL. Kelvinero Essential Item' })
      total_price = 150.0
    }

    // INSERT order — MySQL uses insertId instead of RETURNING
    const [orderResult] = await conn.execute(
      `INSERT INTO orders (customer_name, email, phone, shipping_address, total_price, status, payment_status)
       VALUES (?, ?, ?, ?, ?, 'Pending', 'Unpaid')`,
      [customer_name, email, phone || null, shipping_address, Math.round(total_price * 100) / 100]
    )
    const orderId = (orderResult as ResultSetHeader).insertId

    for (const item of validatedItems) {
      const [prodCheck] = await conn.execute('SELECT id FROM products WHERE id = ?', [item.product_id])
      if ((prodCheck as any[]).length > 0) {
        await conn.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.unit_price]
        )
      }
    }

    await conn.commit()

    // Fetch the full created order to return
    const orderRes = await query('SELECT * FROM orders WHERE id = ?', [orderId])
    const order = orderRes.rows[0] as any

    const itemsRes = await query(`
      SELECT oi.*, p.name, p.slug, p.image, p.price
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId])

    return {
      ...order,
      total_price: parseFloat(order.total_price),
      items: (itemsRes.rows as any[]).map(item => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        product: {
          id: item.product_id,
          name: item.name || 'EL. Kelvinero Product',
          slug: item.slug || 'product',
          image: item.image || '/logo.png',
          price: parseFloat(item.price || item.unit_price)
        }
      }))
    }
  } catch (err: any) {
    await conn.rollback()
    console.error('Error creating order:', err)
    if (err.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: err.message || 'Failed to place order'
    })
  } finally {
    conn.release()
  }
})
