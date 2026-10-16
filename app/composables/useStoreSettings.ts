import { ref } from 'vue'

export const useStoreSettings = () => {
  const storeSettings = useState('storeSettings', () => ({
    storeName: 'TZORAH EMPORIUM',
    tagline: 'The Alchemy of Scents, Pure Oils & Intimate Luxuries',
    supportEmail: 'concierge@tzorahemporium.com',
    telephone: '+234 (0) 800 TZORAH',
    whatsappNumber: '',
    businessHours: 'Mon – Sat, 9am – 8pm',
    contactAddress: 'Victoria Island / Lekki, Lagos, Nigeria',
    responseTime: 'Response within 2 hours',
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
        instructions: 'Please use your Order ID as the transfer description/reference.'
      }
    ]
  }))

  const fetchStoreSettings = async () => {
    try {
      const data = await $fetch('/api/v1/settings')
      if (data) {
        storeSettings.value = { ...storeSettings.value, ...data }
      }
    } catch (err) {
      console.error('Failed to load store settings:', err)
    }
  }

  return {
    storeSettings,
    fetchStoreSettings
  }
}
