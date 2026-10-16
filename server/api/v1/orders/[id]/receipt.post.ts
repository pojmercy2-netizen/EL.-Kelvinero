import { createError, readMultipartFormData, readBody } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import { query } from '../../../../utils/db'

export default defineEventHandler(async (event) => {
  const rawId = parseInt(event.context.params?.id as string, 10)
  if (isNaN(rawId)) {
    throw createError({ statusCode: 400, message: 'Invalid order ID' })
  }

  // Ensure order exists
  const checkOrder = await query('SELECT id, email FROM orders WHERE id = ?', [rawId])
  if (checkOrder.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'receipts')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  let fileBuffer: Buffer | null = null
  let fileExt = 'png'

  // Try multipart form data first
  const multiPart = await readMultipartFormData(event).catch(() => null)

  if (multiPart && multiPart.length > 0) {
    const filePart = multiPart.find(part => part.name === 'receipt' || part.name === 'file' || part.type?.startsWith('image/'))
    if (filePart && filePart.data) {
      fileBuffer = filePart.data
      if (filePart.type?.includes('jpeg') || filePart.type?.includes('jpg')) fileExt = 'jpg'
      else if (filePart.type?.includes('webp')) fileExt = 'webp'
      else if (filePart.type?.includes('pdf')) fileExt = 'pdf'
      else if (filePart.filename) {
        const ext = path.extname(filePart.filename).replace('.', '').toLowerCase()
        if (ext) fileExt = ext
      }
    }
  }

  // If not multipart, check JSON body with base64 data
  if (!fileBuffer) {
    const body = await readBody(event).catch(() => null)
    if (body?.receipt_base64) {
      const base64Data = body.receipt_base64
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        const mimeType = matches[1]
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) fileExt = 'jpg'
        else if (mimeType.includes('webp')) fileExt = 'webp'
        else if (mimeType.includes('pdf')) fileExt = 'pdf'
        fileBuffer = Buffer.from(matches[2], 'base64')
      } else {
        fileBuffer = Buffer.from(base64Data, 'base64')
      }
    }
  }

  if (!fileBuffer || fileBuffer.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No receipt file or image provided. Please select an image of your payment confirmation.'
    })
  }

  const fileName = `receipt-order-${rawId}-${Date.now()}.${fileExt}`
  const filePath = path.join(uploadDir, fileName)
  fs.writeFileSync(filePath, fileBuffer)

  const publicUrl = `/uploads/receipts/${fileName}`

  // Update order with payment receipt URL
  await query('UPDATE orders SET payment_receipt = ? WHERE id = ?', [publicUrl, rawId])

  return {
    success: true,
    message: 'Payment receipt uploaded successfully',
    payment_receipt: publicUrl,
    orderId: rawId
  }
})
