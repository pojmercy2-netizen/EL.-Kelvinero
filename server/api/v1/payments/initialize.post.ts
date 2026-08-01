import { createError, readBody } from 'h3'
import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { order_id } = body || {}

  if (!order_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'order_id is required'
    })
  }

  const res = await query('SELECT * FROM orders WHERE id = ?', [order_id])
  const order = res.rows[0]

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Order not found'
    })
  }

  if (order.payment_status === 'Paid') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'This order has already been paid'
    })
  }

  const config = useRuntimeConfig()
  const secretKey = config.paystackSecretKey
  const callbackUrl = config.paystackCallbackUrl

  if (!secretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Paystack secret key is not configured'
    })
  }

  const amountInKobo = Math.round(parseFloat(order.total_price) * 100)

  const paystackPayload = {
    email: order.email,
    amount: amountInKobo,
    callback_url: callbackUrl,
    metadata: {
      order_id: order.id,
      customer_name: order.customer_name
    },
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
  }

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paystackPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw createError({
        statusCode: 502,
        statusMessage: 'Bad Gateway',
        message: `Paystack error: ${errorText}`
      })
    }

    const resData = await response.json() as any
    if (!resData.status) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Bad Gateway',
        message: `Paystack initialization failed: ${resData.message || 'Unknown error'}`
      })
    }

    const paystackData = resData.data
    const reference = paystackData.reference

    await query('UPDATE orders SET payment_reference = ? WHERE id = ?', [reference, order.id])

    return {
      authorization_url: paystackData.authorization_url,
      access_code: paystackData.access_code,
      reference,
      order_id: order.id
    }

  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: err.message || 'Failed to initialize payment'
    })
  }
})
