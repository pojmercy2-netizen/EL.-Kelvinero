import { createError } from 'h3'
import { query } from '../../../../utils/db'

export default defineEventHandler(async (event) => {
  const reference = getRouterParam(event, 'reference')

  if (!reference) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Transaction reference is required'
    })
  }

  const res = await query('SELECT * FROM orders WHERE payment_reference = ?', [reference])
  const order = res.rows[0]

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: `No order found with payment reference '${reference}'`
    })
  }

  if (order.payment_status === 'Paid') {
    return {
      order_id: order.id,
      reference,
      payment_status: 'Paid',
      order_status: order.status,
      amount: parseFloat(order.total_price),
      channel: order.payment_channel,
      message: 'Payment was already verified and confirmed.'
    }
  }

  const config = useRuntimeConfig()
  const secretKey = config.paystackSecretKey

  if (!secretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Paystack secret key is not configured'
    })
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
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
        message: `Paystack verification failed: ${resData.message || 'Unknown error'}`
      })
    }

    const transaction = resData.data
    const paystackStatus = transaction.status
    const channel = transaction.channel
    const amountNaira = (transaction.amount || 0) / 100

    if (paystackStatus === 'success') {
      const newOrderStatus = order.status === 'Pending' ? 'Processing' : order.status
      await query(`
        UPDATE orders 
        SET payment_status = 'Paid', payment_channel = ?, status = ?
        WHERE id = ?
      `, [channel, newOrderStatus, order.id])

      return {
        order_id: order.id,
        reference,
        payment_status: 'Paid',
        order_status: newOrderStatus,
        amount: amountNaira,
        channel,
        message: 'Payment verified successfully. Order is now being processed.'
      }
    } else {
      await query("UPDATE orders SET payment_status = 'Failed' WHERE id = ?", [order.id])

      return {
        order_id: order.id,
        reference,
        payment_status: 'Failed',
        order_status: order.status,
        amount: amountNaira,
        channel,
        message: `Payment ${paystackStatus}. Please try again.`
      }
    }

  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: err.message || 'Failed to verify payment'
    })
  }
})
