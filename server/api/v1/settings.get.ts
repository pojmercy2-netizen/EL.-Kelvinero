import { query } from '../../utils/db'

export default defineEventHandler(async () => {
  const defaults: Record<string, any> = {
    storeName: 'TZORAH EMPORIUM',
    tagline: 'The Alchemy of Scents, Pure Oils & Intimate Luxuries',
    supportEmail: 'concierge@tzorahemporium.com',
    telephone: '+234 (0) 800 TZORAH',
    whatsappNumber: '+2348000000000',
    businessHours: 'Mon – Sat, 9am – 8pm',
    contactAddress: 'Victoria Island / Lekki, Lagos, Nigeria',
    responseTime: 'Quick response within 2 hours',
    freeShippingThreshold: 50000,
    standardShippingFee: 3500,
    expressShippingFee: 7500,
    currency: 'NGN',
    autoApproveOrders: true,
    announcementEnabled: true,
    announcementText: 'FREE EXPRESS NATIONWIDE SHIPPING ON ORDERS OVER ₦50,000 • 100% AUTHENTIC GUARANTEE',
    announcementBg: '#111111',
    bankAccounts: [
      {
        id: '1',
        bankName: 'Guaranty Trust Bank (GTBank)',
        accountNumber: '0812345678',
        accountName: 'TZORAH EMPORIUM ENTERPRISES',
        instructions: 'Please use your Order Reference Code as the transaction description.'
      }
    ]
  }

  try {
    const res = await query('SELECT key, value FROM settings')
    const dbSettings: Record<string, any> = {}
    for (const row of res.rows as any[]) {
      try {
        dbSettings[row.key] = JSON.parse(row.value)
      } catch {
        dbSettings[row.key] = row.value
      }
    }

    return {
      ...defaults,
      ...dbSettings
    }
  } catch (err) {
    console.error('Error fetching settings from DB:', err)
    return defaults
  }
})
