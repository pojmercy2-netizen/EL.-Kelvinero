import { createError, readMultipartFormData, readBody } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  let fileBuffer: Buffer | null = null
  let fileExt = 'png'

  const multiPart = await readMultipartFormData(event).catch(() => null)
  if (multiPart && multiPart.length > 0) {
    const filePart = multiPart.find(p => p.name === 'file' || p.name === 'image') || multiPart[0]
    if (filePart && filePart.data) {
      fileBuffer = filePart.data
      const type = filePart.type || ''
      if (type.includes('jpeg') || type.includes('jpg')) fileExt = 'jpg'
      else if (type.includes('webp')) fileExt = 'webp'
      else if (type.includes('png')) fileExt = 'png'
      else if (type.includes('gif')) fileExt = 'gif'
    }
  }

  if (!fileBuffer) {
    const body = await readBody(event).catch(() => null)
    if (body?.image || body?.base64) {
      const dataStr = body.image || body.base64
      const matches = dataStr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches) {
        const mime = matches[1]
        if (mime.includes('jpeg') || mime.includes('jpg')) fileExt = 'jpg'
        else if (mime.includes('webp')) fileExt = 'webp'
        else if (mime.includes('png')) fileExt = 'png'
        else if (mime.includes('gif')) fileExt = 'gif'
        fileBuffer = Buffer.from(matches[2], 'base64')
      } else {
        fileBuffer = Buffer.from(dataStr, 'base64')
      }
    }
  }

  if (!fileBuffer || fileBuffer.length === 0) {
    throw createError({ statusCode: 400, message: 'No image file uploaded' })
  }

  const fileName = `prod-${crypto.randomBytes(6).toString('hex')}-${Date.now()}.${fileExt}`
  const filePath = path.join(uploadDir, fileName)
  fs.writeFileSync(filePath, fileBuffer)

  const publicUrl = `/uploads/products/${fileName}`
  return {
    success: true,
    url: publicUrl
  }
})
