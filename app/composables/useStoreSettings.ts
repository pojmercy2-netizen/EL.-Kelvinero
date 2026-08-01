import { ref } from 'vue'

export const useStoreSettings = () => {
  const storeSettings = useState('storeSettings', () => ({
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
    bankAccounts: [
      {
        id: '1',
        bankName: 'Guaranty Trust Bank (GTBank)',
        accountNumber: '0123456789',
        accountName: 'EL. KELVINERO NIGERIA LTD',
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
