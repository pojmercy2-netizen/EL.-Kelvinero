import { query } from '../../../utils/db'

export default defineEventHandler(async () => {
  try {
    // Create table if not exists — MySQL syntax
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        \`key\` VARCHAR(255) NOT NULL PRIMARY KEY,
        value TEXT NOT NULL
      )
    `)

    const res = await query('SELECT * FROM settings')
    const settingsObj: Record<string, any> = {
      storeName: 'EL. KELVINERO',
      tagline: 'Timeless Style. Made to Stand Out.',
      supportEmail: 'concierge@elkelvinero.com',
      telephone: '+234 (0) 800 KELVINERO',
      whatsappNumber: '',
      businessHours: 'Mon – Fri, 9am – 6pm',
      contactAddress: 'Lagos, Nigeria',
      responseTime: 'Response within 24 hours',
      freeShippingThreshold: 50000,
      standardShippingFee: 3500,
      currency: 'NGN',
      autoApproveOrders: false,
      announcementEnabled: true,
      announcementText: 'FREE SHIPPING ON ORDERS OVER ₦50,000',
      announcementBg: '#1a1a1a',
      passcode: 'elkelvinero2025',
      bankAccounts: [
        {
          id: '1',
          bankName: 'Guaranty Trust Bank (GTBank)',
          accountNumber: '0123456789',
          accountName: 'EL. KELVINERO NIGERIA LTD',
          instructions: 'Please use your Order ID as the transfer description/reference.'
        }
      ]
    }

    for (const row of res.rows as any[]) {
      try {
        settingsObj[row.key] = JSON.parse(row.value)
      } catch {
        settingsObj[row.key] = row.value
      }
    }

    return settingsObj
  } catch (err) {
    console.error('Error fetching settings:', err)
    return {
      storeName: 'EL. KELVINERO',
      tagline: 'Timeless Style. Made to Stand Out.',
      supportEmail: 'concierge@elkelvinero.com',
      telephone: '+234 (0) 800 KELVINERO',
      freeShippingThreshold: 50000,
      standardShippingFee: 3500,
      currency: 'NGN',
      autoApproveOrders: false,
      announcementEnabled: true,
      announcementText: 'FREE SHIPPING ON ORDERS OVER ₦50,000',
      announcementBg: '#1a1a1a',
      passcode: 'elkelvinero2025'
    }
  }
})
