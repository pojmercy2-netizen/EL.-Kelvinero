<template>
  <div class="admin-orders">
    <!-- Header -->
    <div class="orders-header animate-fade-in">
      <div>
        <h1 class="page-title">Sales Orders</h1>
        <p class="page-subtitle">Process incoming customer transactions and track dispatch states.</p>
      </div>
    </div>

    <!-- Status Navigation Tabs -->
    <div class="status-tabs-bar animate-fade-in">
      <button
        v-for="status in statusTabs"
        :key="status"
        :class="['status-tab', { 'status-tab--active': activeStatusTab === status }]"
        @click="activeStatusTab = status"
      >
        {{ status }}
        <span class="status-count">{{ getStatusCount(status) }}</span>
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar animate-fade-in">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Search orders by ID, customer name..." class="search-input" />
      </div>
    </div>

    <!-- Orders Table / List -->
    <div class="admin-card animate-fade-in">
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th width="40"></th>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>ITEMS</th>
              <th>TOTAL</th>
              <th>FULFILMENT</th>
              <th>PAYMENT STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="9" class="text-center-cell">No orders found matching the filter criteria.</td>
            </tr>
            <template v-for="order in filteredOrders" :key="order.id">
              <!-- Summary Row -->
              <tr class="table-row summary-row" :class="{ 'row-expanded': expandedOrderId === order.id }" @click="toggleRow(order.id)">
                <td>
                  <button class="btn-expand" :class="{ 'btn-expand--rotated': expandedOrderId === order.id }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </td>
                <td class="font-mono text-gold">{{ order.id }}</td>
                <td>
                  <div class="customer-info">
                    <span class="customer-name">{{ order.customer }}</span>
                    <span class="customer-email">{{ order.email }}</span>
                  </div>
                </td>
                <td class="font-mono">{{ order.date }}</td>
                <td>{{ order.itemCount }} pcs</td>
                <td class="font-semibold text-white">{{ currencySymbol }}{{ order.total.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
                <td>
                  <span :class="['badge-status', 'badge-' + order.status.toLowerCase()]">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <span :class="['badge-payment', order.paymentStatus === 'Paid' ? 'badge-paid' : 'badge-unpaid']">
                    {{ order.paymentStatus === 'Paid' ? '✓ PAID' : '⏳ UNPAID / PENDING' }}
                  </span>
                </td>
                <td @click.stop>
                  <div class="action-buttons">
                    <button
                      v-if="order.paymentStatus !== 'Paid'"
                      class="btn-confirm-pay"
                      @click="confirmPayment(order.rawId)"
                      title="Confirm received bank transfer"
                    >
                      ✓ CONFIRM PAYMENT
                    </button>
                    <select :value="order.status" @change="updateOrderStatus(order.id, $event.target.value)" class="table-select">
                      <option value="Pending">PENDING</option>
                      <option value="Processing">PROCESSING</option>
                      <option value="Shipped">SHIPPED</option>
                      <option value="Delivered">DELIVERED</option>
                      <option value="Cancelled">CANCELLED</option>
                    </select>
                  </div>
                </td>
              </tr>

              <!-- Expanded Details Row -->
              <tr v-if="expandedOrderId === order.id" class="details-row">
                <td colspan="8" class="details-cell">
                  <div class="order-details-grid">
                    <!-- Delivery Details -->
                    <div class="details-section">
                      <h4 class="details-title">DELIVERY INFORMATION</h4>
                      <p class="details-p"><span class="label">Client:</span> {{ order.customer }}</p>
                      <p class="details-p"><span class="label">Email:</span> {{ order.email }}</p>
                      <p class="details-p"><span class="label">Shipping Address:</span> {{ order.address }}</p>
                      <p class="details-p"><span class="label">Order Date:</span> {{ order.date }}</p>
                    </div>

                    <!-- Items Summary -->
                    <div class="details-section span-2">
                      <h4 class="details-title">PURCHASED PIECES</h4>
                      <div class="details-items-list">
                        <div v-for="item in order.items" :key="item.name" class="details-item">
                          <div class="item-img-placeholder">
                            <!-- Visual box representing the product color -->
                            <span class="color-indicator" :style="{ backgroundColor: getColorHex(item.color || 'black') }"></span>
                          </div>
                          <div class="item-details">
                            <span class="item-name">{{ item.name }}</span>
                            <span class="item-meta">Color: {{ item.color || 'N/A' }} | Qty: {{ item.qty }}</span>
                          </div>
                          <div class="item-pricing">
                            <span class="item-qty-price">{{ item.qty }} &times; ${{ item.price.toFixed(2) }}</span>
                            <span class="item-total-price">${{ (item.qty * item.price).toFixed(2) }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="order-total-bar">
                        <span class="total-label">SUBTOTAL</span>
                        <span class="total-val">${{ order.total.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Track Orders | EL. Kelvinero Admin',
  meta: [{ name: 'description', content: 'Order fulfilment, delivery tracking, and transactional record log.' }]
})

const adminToken = useCookie('adminToken')
const rawOrders = ref([])
const loading = ref(true)
const toasts = useState('toasts', () => [])

const showToast = (message) => {
  toasts.value.push({ id: Date.now(), message })
}

const { storeSettings, fetchStoreSettings } = useStoreSettings()

const currencySymbol = computed(() => {
  const c = storeSettings.value?.currency || 'NGN'
  if (c === 'NGN') return '₦'
  if (c === 'EUR') return '€'
  if (c === 'GBP') return '£'
  return '$'
})

const fetchOrders = async () => {
  if (!adminToken.value) return
  loading.value = true
  try {
    await fetchStoreSettings()
    const data = await $fetch('/api/v1/orders', {
      headers: { Authorization: `Bearer ${adminToken.value}` }
    })
    rawOrders.value = data || []
  } catch (err) {
    console.error('Failed to fetch admin orders:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

const adminOrders = computed(() => {
  return rawOrders.value.map(o => ({
    id: `EK-${o.id}`,
    rawId: o.id,
    customer: o.customer_name || 'Customer',
    email: o.email,
    date: new Date(o.created_at).toISOString().split('T')[0],
    itemCount: o.items?.length || 0,
    total: parseFloat(o.total_price || 0),
    status: o.status || 'Pending',
    paymentStatus: o.payment_status || 'Unpaid',
    address: o.shipping_address || 'N/A',
    items: (o.items || []).map(i => ({
      name: i.product?.name || 'Product Item',
      qty: i.quantity,
      price: parseFloat(i.unit_price || 0),
      color: 'Standard'
    }))
  }))
})

const statusTabs = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const activeStatusTab = ref('ALL')
const searchQuery = ref('')
const expandedOrderId = ref(null)

const getStatusCount = (status) => {
  if (status === 'ALL') return adminOrders.value.length
  return adminOrders.value.filter(o => o.status.toUpperCase() === status).length
}

const toggleRow = (orderId) => {
  if (expandedOrderId.value === orderId) {
    expandedOrderId.value = null
  } else {
    expandedOrderId.value = orderId
  }
}

const confirmPayment = async (rawId) => {
  try {
    await $fetch(`/api/v1/orders/${rawId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken.value}` },
      body: { payment_status: 'Paid', status: 'Processing' }
    })
    const target = rawOrders.value.find(o => o.id === rawId)
    if (target) {
      target.payment_status = 'Paid'
      target.status = 'Processing'
    }
    showToast(`🎉 Payment for Order #EK-${rawId} confirmed! Order is now Processing.`)
  } catch (err) {
    console.error('Failed to confirm payment:', err)
    showToast('Failed to confirm payment.')
  }
}

const updateOrderStatus = async (displayId, newStatus) => {
  const order = adminOrders.value.find(o => o.id === displayId)
  if (!order) return

  const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase()

  try {
    await $fetch(`/api/v1/orders/${order.rawId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken.value}` },
      body: { status: formattedStatus }
    })
    const target = rawOrders.value.find(o => o.id === order.rawId)
    if (target) target.status = formattedStatus
  } catch (err) {
    console.error('Failed to update status:', err)
  }
}

const getColorHex = (name) => {
  const colors = {
    'black': '#121212',
    'white': '#f8f9fa',
    'cream': '#ebe7e0',
    'tan': '#d2b48c',
    'grey': '#8e8e93',
    'navy': '#1a233d',
    'beige': '#e1d5c2',
    'brown': '#5c4033',
    'olive': '#556b2f',
    'camel': '#c19a6b'
  }
  return colors[name.toLowerCase()] || '#cccccc'
}

const filteredOrders = computed(() => {
  return adminOrders.value.filter(o => {
    // Search match
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          o.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          o.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Status tab match
    const matchesStatus = activeStatusTab.value === 'ALL' || o.status.toUpperCase() === activeStatusTab.value

    return matchesSearch && matchesStatus
  })
})
</script>

<style scoped>
.admin-orders {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.page-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Status tabs */
.status-tabs-bar {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  gap: 0.5rem;
  scrollbar-width: none;
}

.status-tabs-bar::-webkit-scrollbar {
  display: none;
}

.status-tab {
  white-space: nowrap;
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
  position: relative;
}

.status-tab:hover {
  color: #ffffff;
}

.status-tab--active {
  color: #b89874 !important;
}

.status-tab--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #b89874;
}

.status-count {
  font-size: 0.65rem;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.1rem 0.4rem;
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.status-tab--active .status-count {
  background-color: rgba(184, 152, 116, 0.12);
  color: #b89874;
}

/* Filters */
.filters-bar {
  display: flex;
  align-items: center;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.3);
}

.search-input {
  width: 100%;
  background-color: #141414;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #ffffff;
  padding: 0.55rem 1rem 0.55rem 2.5rem;
  font-size: 0.8rem;
  outline: none;
  border-radius: 2px;
  transition: all 0.25s ease;
}

.search-input:focus {
  border-color: rgba(184, 152, 116, 0.4);
  background-color: #161616;
}

/* Table Override */
.text-center-cell {
  text-align: center;
  padding: 3rem 0 !important;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.summary-row {
  cursor: pointer;
}

.summary-row.row-expanded {
  background-color: rgba(255, 255, 255, 0.02);
}

.btn-expand {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  transition: transform 0.25s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-expand--rotated {
  transform: rotate(90deg);
  color: #b89874;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  color: #ffffff;
  font-weight: 500;
}

.customer-email {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
}

/* Status Badges */
.badge-status {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  text-transform: uppercase;
  border-radius: 2px;
  display: inline-block;
}

.badge-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.badge-processing {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.badge-shipped {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.badge-delivered {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.badge-cancelled {
  background-color: rgba(226, 92, 92, 0.1);
  color: #e25c5c;
  border: 1px solid rgba(226, 92, 92, 0.25);
}

.table-select {
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  padding: 0.35rem 0.5rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  outline: none;
  cursor: pointer;
  border-radius: 2px;
}

.table-select:focus {
  border-color: rgba(184, 152, 116, 0.4);
}

/* Details row styling */
.details-row {
  background-color: rgba(255, 255, 255, 0.005);
}

.details-cell {
  padding: 1.5rem 2rem !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.order-details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.span-2 {
  grid-column: span 2;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.details-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
}

.details-p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.details-p .label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  margin-right: 0.25rem;
}

.details-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.details-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.details-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-img-placeholder {
  width: 24px;
  height: 32px;
  background-color: #1a1a1a;
  border-radius: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
}

.item-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.item-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: #ffffff;
}

.item-meta {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
}

.item-pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.item-qty-price {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
}

.item-total-price {
  font-size: 0.78rem;
  font-weight: 600;
  color: #ffffff;
}

.order-total-bar {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.75rem;
  margin-top: 0.5rem;
}

.total-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
}

.total-val {
  font-size: 0.85rem;
  font-weight: 700;
  color: #b89874;
}

@media (max-width: 900px) {
  .order-details-grid {
    grid-template-columns: 1fr;
  }
  .span-2 {
    grid-column: span 1;
  }
}

@media (max-width: 480px) {
  .details-cell {
    padding: 1rem !important;
  }
  .order-details-grid {
    gap: 1.25rem;
  }
  .orders-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

/* Payment Status Badges & Confirm Payment Button */
.badge-payment {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.6rem;
  border-radius: 2px;
  display: inline-block;
  white-space: nowrap;
}

.badge-paid {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.badge-unpaid {
  background: rgba(241, 196, 15, 0.15);
  color: #f1c40f;
  border: 1px solid rgba(241, 196, 15, 0.3);
}

.btn-confirm-pay {
  background: #2ecc71;
  color: #111;
  border: none;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.45rem 0.85rem;
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}
.btn-confirm-pay:hover {
  opacity: 0.9;
}
</style>

