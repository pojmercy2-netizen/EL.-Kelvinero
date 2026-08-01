<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="dashboard-header animate-fade-in">
      <div>
        <h1 class="page-title">Executive Summary</h1>
        <p class="page-subtitle">Real-time store performance and key indicators.</p>
      </div>
      <div class="header-actions">
        <button class="btn-refresh" @click="refreshData" :class="{ 'refreshing': refreshing }">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="refresh-icon"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Sync Data
        </button>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid animate-fade-in">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
        <div class="kpi-card__header">
          <span class="kpi-card__label">{{ kpi.label }}</span>
          <span class="kpi-card__icon" v-html="kpi.icon" :style="{ color: kpi.color }"></span>
        </div>
        <div class="kpi-card__value">{{ kpi.value }}</div>
        <div class="kpi-card__footer">
          <span class="kpi-card__trend" :class="kpi.trendUp ? 'trend-up' : 'trend-down'">
            <svg v-if="kpi.trendUp" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            {{ kpi.change }}
          </span>
          <span class="kpi-card__period">vs last month</span>
        </div>
      </div>
    </div>

    <!-- Charts and Quick Insights -->
    <div class="dashboard-grid animate-fade-in">
      <!-- Revenue Chart Card -->
      <div class="admin-card span-8">
        <div class="card-header-flex">
          <h2 class="admin-card-title">REVENUE PERFORMANCE OVERVIEW</h2>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot bg-gold"></span>This Year</span>
            <span class="legend-item"><span class="legend-dot bg-muted"></span>Last Year</span>
          </div>
        </div>
        
        <!-- Interactive Chart Visual (Pure SVG) -->
        <div class="revenue-chart-container">
          <svg viewBox="0 0 600 200" class="revenue-svg">
            <defs>
              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#b89874" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#b89874" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <!-- Grid Lines -->
            <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4" />
            <line x1="40" y1="65" x2="580" y2="65" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4" />
            <line x1="40" y1="110" x2="580" y2="110" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4" />
            <line x1="40" y1="155" x2="580" y2="155" stroke="rgba(255,255,255,0.03)" stroke-dasharray="4" />
            <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(255,255,255,0.08)" />

            <!-- Y-Axis Labels -->
            <text x="15" y="25" class="chart-text">$30k</text>
            <text x="15" y="70" class="chart-text">$20k</text>
            <text x="15" y="115" class="chart-text">$10k</text>
            <text x="15" y="158" class="chart-text">$0k</text>

            <!-- Line Last Year (Muted Grey) -->
            <path
              d="M 50,150 L 100,140 L 150,130 L 200,145 L 250,110 L 300,115 L 350,90 L 400,110 L 450,85 L 500,80 L 550,60 L 580,45"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              stroke-width="1.5"
              stroke-dasharray="5 3"
            />

            <!-- Area Glow (Under Gold Line) -->
            <path
              d="M 50,130 L 100,105 L 150,120 L 200,95 L 250,75 L 300,60 L 350,80 L 400,50 L 450,30 L 500,45 L 550,20 L 580,15 L 580,170 L 50,170 Z"
              fill="url(#chart-glow)"
            />

            <!-- Line This Year (Gold Line) -->
            <path
              d="M 50,130 L 100,105 L 150,120 L 200,95 L 250,75 L 300,60 L 350,80 L 400,50 L 450,30 L 500,45 L 550,20 L 580,15"
              fill="none"
              stroke="#b89874"
              stroke-width="2.5"
              stroke-linecap="round"
            />

            <!-- Interactive Points -->
            <circle cx="450" cy="30" r="5" fill="#b89874" stroke="#111111" stroke-width="2" />
            <circle cx="550" cy="20" r="5" fill="#b89874" stroke="#111111" stroke-width="2" />

            <!-- X-Axis Labels -->
            <text x="50" y="190" class="chart-text text-center">JAN</text>
            <text x="150" y="190" class="chart-text text-center">MAR</text>
            <text x="250" y="190" class="chart-text text-center">MAY</text>
            <text x="350" y="190" class="chart-text text-center">JUL</text>
            <text x="450" y="190" class="chart-text text-center">SEP</text>
            <text x="550" y="190" class="chart-text text-center">NOV</text>
          </svg>
        </div>
      </div>

      <!-- Quick Actions / Brand Stats -->
      <div class="admin-card span-4">
        <h2 class="admin-card-title">QUICK OPERATIONS</h2>
        <div class="quick-actions-list">
          <NuxtLink to="/admin/products" class="quick-action-btn">
            <span class="action-icon bg-gold-low">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b89874" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </span>
            <div class="action-details">
              <span class="action-title">Create New Product</span>
              <span class="action-desc">Add a item to storefront catalogue</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/admin/orders" class="quick-action-btn">
            <span class="action-icon bg-blue-low">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
            <div class="action-details">
              <span class="action-title">Manage Live Orders</span>
              <span class="action-desc">Review, process & ship orders</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/admin/lookbook" class="quick-action-btn">
            <span class="action-icon bg-gold-low">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b89874" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5L16 10 4 20"/></svg>
            </span>
            <div class="action-details">
              <span class="action-title">Manage Lookbook</span>
              <span class="action-desc">Add or remove lookbook entries</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/admin/settings" class="quick-action-btn">
            <span class="action-icon bg-grey-low">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </span>
            <div class="action-details">
              <span class="action-title">Adjust Store Settings</span>
              <span class="action-desc">Update headers, delivery, info</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Recent Orders & Top Selling Products -->
    <div class="dashboard-grid animate-fade-in pt-2">
      <!-- Recent Orders Table -->
      <div class="admin-card span-8">
        <div class="card-header-flex">
          <h2 class="admin-card-title">RECENT SALES ORDERS</h2>
          <NuxtLink to="/admin/orders" class="view-all-link">View All Orders →</NuxtLink>
        </div>

        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="table-row">
                <td class="font-mono text-gold">{{ order.id }}</td>
                <td>
                  <div class="customer-cell">
                    <span class="customer-avatar">{{ order.customer.charAt(0) }}</span>
                    <div class="customer-details">
                      <span class="customer-name">{{ order.customer }}</span>
                      <span class="customer-email">{{ order.email }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ order.date }}</td>
                <td>{{ order.itemCount }} items</td>
                <td class="font-semibold text-white">${{ order.total.toFixed(2) }}</td>
                <td>
                  <span :class="['badge-status', 'badge-' + order.status.toLowerCase()]">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Selling Products -->
      <div class="admin-card span-4">
        <div class="card-header-flex">
          <h2 class="admin-card-title">TOP SELLING PRODUCTS</h2>
        </div>

        <div class="top-products-list">
          <div v-for="(product, idx) in topProducts" :key="product.id" class="top-product-item">
            <span class="rank-badge">{{ idx + 1 }}</span>
            <div class="product-item-img">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-item-info">
              <span class="product-item-name">{{ product.name }}</span>
              <span class="product-item-sales">{{ product.salesCount }} Sold</span>
            </div>
            <div class="product-item-revenue">${{ product.revenue.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Executive Dashboard | EL. Kelvinero Admin',
  meta: [{ name: 'description', content: 'EL. Kelvinero administrative panel dashboard overview.' }]
})

const adminToken = useCookie('adminToken')
const dashboardData = ref(null)
const loading = ref(true)
const refreshing = ref(false)

const kpis = ref([
  { label: 'TOTAL REVENUE', value: '₦0.00', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', change: '+14.2%', trendUp: true, color: '#b89874' },
  { label: 'TOTAL ORDERS', value: '0', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', change: '+8.4%', trendUp: true, color: '#3b82f6' },
  { label: 'ACTIVE PRODUCTS', value: '0', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>', change: '0.0%', trendUp: true, color: '#10b981' },
  { label: 'REGISTERED CLIENTS', value: '0', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', change: '+18.7%', trendUp: true, color: '#8b5cf6' }
])

const fetchDashboard = async () => {
  if (!adminToken.value) return
  loading.value = true
  try {
    const data = await $fetch('/api/v1/dashboard', {
      headers: { Authorization: `Bearer ${adminToken.value}` }
    })
    dashboardData.value = data
    if (data) {
      kpis.value[0].value = `₦${(data.total_revenue || 0).toLocaleString()}`
      kpis.value[1].value = String(data.total_orders || 0)
      kpis.value[2].value = String(data.total_products || 0)
      kpis.value[3].value = String(data.total_customers || 0)
    }
  } catch (err) {
    console.error('Failed to fetch dashboard metrics:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboard)

const recentOrders = computed(() => {
  if (!dashboardData.value?.latest_orders) return []
  return dashboardData.value.latest_orders.map(o => ({
    id: `EK-${o.id}`,
    customer: o.customer_name || 'Customer',
    email: o.email,
    date: new Date(o.created_at).toISOString().split('T')[0],
    itemCount: o.items?.length || 0,
    total: parseFloat(o.total_price || 0),
    status: o.status || 'Pending'
  }))
})

const topProducts = computed(() => [])

const refreshData = async () => {
  refreshing.value = true
  await fetchDashboard()
  refreshing.value = false
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
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

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e8e4df;
  padding: 0.5rem 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-refresh:hover {
  background-color: #1a1a1a;
  border-color: rgba(184, 152, 116, 0.4);
  color: #b89874;
}

.refresh-icon {
  transition: transform 0.5s ease;
}

.refreshing .refresh-icon {
  animation: spin 1s linear infinite;
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.kpi-card {
  background-color: #141414;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: rgba(184, 152, 116, 0.2);
}

.kpi-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-card__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
}

.kpi-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
}

.kpi-card__value {
  font-size: 1.75rem;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.kpi-card__footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
}

.kpi-card__trend {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-weight: 600;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #e25c5c;
}

.kpi-card__period {
  color: rgba(255, 255, 255, 0.3);
}

/* Dashboard Grids */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.pt-2 {
  padding-top: 0.5rem;
}

.span-8 {
  grid-column: span 8;
}

.span-4 {
  grid-column: span 4;
}

/* Card Header Flex */
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.bg-gold {
  background-color: #b89874;
  box-shadow: 0 0 6px rgba(184, 152, 116, 0.6);
}

.bg-muted {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Revenue Chart (SVG style) */
.revenue-chart-container {
  width: 100%;
  padding: 0.5rem 0;
}

.revenue-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.chart-text {
  font-size: 8px;
  fill: rgba(255, 255, 255, 0.3);
  font-weight: 500;
  letter-spacing: 0.05em;
}

.text-center {
  text-anchor: middle;
}

/* Quick Actions List */
.quick-actions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 2px;
  transition: all 0.25s ease;
  text-decoration: none;
  color: inherit;
}

.quick-action-btn:hover {
  background-color: #222222;
  border-color: rgba(184, 152, 116, 0.2);
  transform: translateX(3px);
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-gold-low {
  background-color: rgba(184, 152, 116, 0.12);
}

.bg-blue-low {
  background-color: rgba(59, 130, 246, 0.12);
}

.bg-grey-low {
  background-color: rgba(161, 161, 170, 0.12);
}

.action-details {
  display: flex;
  flex-direction: column;
}

.action-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
}

.action-desc {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
}

/* Table styling */
.view-all-link {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #b89874;
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  padding: 0.75rem 1rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-table td {
  padding: 0.85rem 1rem;
  font-size: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.7);
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(255, 255, 255, 0.015);
}

.font-mono {
  font-family: monospace;
}

.text-gold {
  color: #b89874;
  font-weight: 600;
}

.font-semibold {
  font-weight: 600;
}

.text-white {
  color: #ffffff;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customer-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #242424;
  color: #b89874;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.customer-details {
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
  border-radius: 20px;
  display: inline-block;
}

.badge-pending {
  background-color: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.badge-processing {
  background-color: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.badge-shipped {
  background-color: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}

.badge-delivered {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.badge-cancelled {
  background-color: rgba(226, 92, 92, 0.12);
  color: #e25c5c;
}

/* Top Products list styles */
.top-products-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.top-product-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.top-product-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.rank-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  width: 14px;
}

.product-item-img {
  width: 32px;
  height: 40px;
  background-color: #242424;
  overflow: hidden;
  border-radius: 1px;
}

.product-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-item-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-item-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.02em;
}

.product-item-sales {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
}

.product-item-revenue {
  font-size: 0.82rem;
  font-weight: 600;
  color: #e8e4df;
  font-variant-numeric: tabular-nums;
}

/* Animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .span-8, .span-4 {
    grid-column: span 12;
  }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .admin-card {
    padding: 1rem;
  }
  .kpi-card {
    padding: 1rem;
  }
  .page-title {
    font-size: 1.25rem;
  }
  .kpi-card__value {
    font-size: 1.5rem;
  }
  .card-header-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

