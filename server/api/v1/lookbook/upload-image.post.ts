import { readMultipartFormData, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const filePart = parts?.find(p => p.name === 'file')

  if (!filePart || !filePart.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'No image file uploaded'
    })
  }

  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
  if (!filePart.type || !allowedTypes.has(filePart.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Only JPEG, PNG, and WebP images are allowed'
    })
  }

  const uploadDir = path.resolve(process.cwd(), 'public/uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  let ext = 'jpg'
  if (filePart.filename && filePart.filename.includes('.')) {
    ext = filePart.filename.split('.').pop() || 'jpg'
  } else if (filePart.type) {
    ext = filePart.type.split('/').pop() || 'jpg'
  }

  const uniqueFilename = `lookbook-${crypto.randomUUID()}.${ext}`
  const filePath = path.join(uploadDir, uniqueFilename)

  fs.writeFileSync(filePath, filePart.data)

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const imageUrl = `/uploads/${uniqueFilename}`

  return {
    message: 'Image uploaded successfully',
    image_url: imageUrl,
    full_url: `${baseUrl}${imageUrl}`
  }
})
