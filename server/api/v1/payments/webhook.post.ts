import { createError, readRawBody, getHeader } from 'h3'
import crypto from 'node:crypto'
import { query } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event, 'utf-8')
  if (!rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Body is empty'
    })
  }

  const config = useRuntimeConfig()
  const webhookSecret = config.paystackWebhookSecret
  const paystackSignature = getHeader(event, 'x-paystack-signature') || ''

  if (webhookSecret) {
    const hash = crypto
      .createHmac('sha512', webhookSecret)
      .update(rawBody)
      .digest('hex')

    const bufferSignature = Buffer.from(paystackSignature, 'utf-8')
    const bufferHash = Buffer.from(hash, 'utf-8')

    if (bufferSignature.length !== bufferHash.length || !crypto.timingSafeEqual(bufferSignature, bufferHash)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid webhook signature'
      })
    }
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid JSON payload'
    })
  }

  const eventType = payload.event
  const eventData = payload.data || {}

  if (eventType === 'charge.success') {
    const reference = eventData.reference
    if (reference) {
      const res = await query('SELECT id, status, payment_status FROM orders WHERE payment_reference = ?', [reference])
      const order = res.rows[0]

      if (order && order.payment_status !== 'Paid') {
        const channel = eventData.channel
        const newOrderStatus = order.status === 'Pending' ? 'Processing' : order.status

        await query(`
          UPDATE orders 
          SET payment_status = 'Paid', payment_channel = ?, status = ?
          WHERE id = ?
        `, [channel, newOrderStatus, order.id])
      }
    }
  }

  return { status: 'ok' }
})
