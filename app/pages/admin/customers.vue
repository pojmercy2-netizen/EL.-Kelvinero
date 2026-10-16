<template>
  <div class="admin-customers">
    <!-- Header -->
    <div class="customers-header animate-fade-in">
      <div>
        <h1 class="page-title">Client Directory</h1>
        <p class="page-subtitle">View purchase profiles, account metrics and lifetime values.</p>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar animate-fade-in">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Search clients by name, email..." class="search-input" />
      </div>
    </div>

    <!-- Customers Grid / List -->
    <div class="dashboard-grid animate-fade-in">
      <!-- Directory Table -->
      <div class="admin-card span-8">
        <h2 class="admin-card-title">ELITE REGISTRY</h2>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>CLIENT</th>
                <th>MEMBER SINCE</th>
                <th>ORDERS</th>
                <th>TOTAL SPEND</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredCustomers.length === 0">
                <td colspan="5" class="text-center-cell">No clients found matching the search criteria.</td>
              </tr>
              <tr
                v-for="customer in filteredCustomers"
                :key="customer.id"
                :class="['table-row clickable-row', { 'row-selected': selectedCustomer?.id === customer.id }]"
                @click="selectCustomer(customer)"
              >
                <td>
                  <div class="client-cell">
                    <span class="client-avatar">{{ (customer.name || 'C').charAt(0).toUpperCase() }}</span>
                    <div class="client-details">
                      <div class="client-name-row">
                        <span class="client-name">{{ customer.name }}</span>
                        <span v-if="customer.is_admin" class="badge-role badge-role--admin">ADMIN</span>
                        <span v-else class="badge-role badge-role--client">CLIENT</span>
                      </div>
                      <span class="client-email">{{ customer.email }}</span>
                    </div>
                  </div>
                </td>
                <td class="font-mono">{{ customer.joinDate }}</td>
                <td class="font-mono">{{ customer.orderCount }}</td>
                <td class="font-semibold text-white">₦{{ customer.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
                <td>
                  <span :class="['badge-status', getStatusClass(customer.totalSpend)]">
                    {{ getVIPStatusLabel(customer.totalSpend) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Customer detail view card -->
      <div class="admin-card span-4 detail-sidebar-card">
        <h2 class="admin-card-title">CLIENT PROFILE CARD</h2>
        
        <div v-if="!selectedCustomer" class="empty-profile-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="profile-icon-placeholder"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <p>Select a client from the registry list to review their lifetime value history, transactions and profile metrics.</p>
        </div>

        <div v-else class="profile-card-content">
          <div class="profile-avatar-large">
            {{ (selectedCustomer.name || 'C').charAt(0).toUpperCase() }}
          </div>
          <h3 class="profile-name-title">{{ selectedCustomer.name }}</h3>
          <p class="profile-email-sub">{{ selectedCustomer.email }}</p>
          <div class="profile-badges-row">
            <span class="profile-badge-vip" :style="{ backgroundColor: getVIPBadgeBg(selectedCustomer.totalSpend) }">
              {{ getVIPStatusLabel(selectedCustomer.totalSpend) }}
            </span>
            <span v-if="selectedCustomer.is_admin" class="badge-role badge-role--admin">ADMIN ACCESS</span>
            <span v-else class="badge-role badge-role--client">STANDARD CLIENT</span>
          </div>

          <!-- Functional Actions -->
          <div class="customer-actions-group">
            <button
              class="btn-customer-action btn-customer-action--role"
              :class="{ 'btn-customer-action--revoke': selectedCustomer.is_admin }"
              :disabled="roleUpdating"
              @click="toggleAdminRole(selectedCustomer)"
            >
              <svg v-if="!selectedCustomer.is_admin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              {{ roleUpdating ? 'Updating...' : (selectedCustomer.is_admin ? 'Revoke Admin Privileges' : 'Promote to Admin') }}
            </button>
            <div class="action-buttons-inline">
              <a :href="`mailto:${selectedCustomer.email}`" class="btn-customer-action btn-customer-action--secondary" title="Email Client">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email
              </a>
              <NuxtLink to="/admin/orders" class="btn-customer-action btn-customer-action--secondary" title="Manage Orders">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Orders
              </NuxtLink>
            </div>
          </div>

          <div class="profile-divider"></div>

          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">LIFETIME ORDERS</span>
              <span class="metric-value font-mono">{{ selectedCustomer.orderCount }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">TOTAL SPENT</span>
              <span class="metric-value font-mono text-gold">₦{{ selectedCustomer.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">AVERAGE ORDER</span>
              <span class="metric-value font-mono">₦{{ (selectedCustomer.totalSpend / (selectedCustomer.orderCount || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">MEMBER SINCE</span>
              <span class="metric-value font-mono">{{ selectedCustomer.joinDate }}</span>
            </div>
          </div>

          <div class="profile-divider"></div>

          <div class="profile-extra-details">
            <h4 class="details-section-title">RECENT ACTIVITY &amp; ORDERS</h4>
            <div v-if="selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0" class="activity-timeline">
              <div v-for="order in selectedCustomer.recentOrders" :key="order.id" class="timeline-event">
                <span class="timeline-dot"></span>
                <div class="timeline-info">
                  <span class="event-title">Order #{{ order.id }} — ₦{{ order.total.toLocaleString() }}</span>
                  <span class="event-time">{{ order.date }} • {{ order.status }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-activity-note">
              <span>No orders registered under this client email yet.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast message -->
    <div v-if="toastMessage" class="toast-popup animate-fade-in">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Clients Directory | TZORAH EMPORIUM Admin',
  meta: [{ name: 'description', content: 'Customer relationship manager and account profiles directory.' }]
})

const adminToken = useCookie('adminToken')
const adminCustomers = ref([])
const loading = ref(true)

const searchQuery = ref('')
const selectedCustomer = ref(null)

const fetchCustomers = async () => {
  if (!adminToken.value) return
  loading.value = true
  try {
    const data = await $fetch('/api/v1/customers', {
      headers: { Authorization: `Bearer ${adminToken.value}` }
    })
    adminCustomers.value = data || []
    if (adminCustomers.value.length > 0) {
      selectedCustomer.value = adminCustomers.value[0]
    }
  } catch (err) {
    console.error('Failed to fetch customers:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCustomers)

const roleUpdating = ref(false)
const toastMessage = ref('')

const showToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const toggleAdminRole = async (customer) => {
  if (!customer || !adminToken.value) return
  const newRole = !customer.is_admin
  const actionText = newRole ? 'promote to Administrator' : 'revoke Administrator access for'
  if (!confirm(`Are you sure you want to ${actionText} ${customer.name || customer.email}?`)) {
    return
  }

  roleUpdating.value = true
  try {
    await $fetch(`/api/v1/customers/${customer.id}/role`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken.value}` },
      body: { is_admin: newRole }
    })
    customer.is_admin = newRole
    if (selectedCustomer.value && selectedCustomer.value.id === customer.id) {
      selectedCustomer.value.is_admin = newRole
    }
    showToast(`✓ Successfully updated privileges for ${customer.name || customer.email}!`)
  } catch (err) {
    console.error('Failed to update role:', err)
    showToast(`❌ ${err?.data?.message || err?.message || 'Failed to update role.'}`)
  } finally {
    roleUpdating.value = false
  }
}

const filteredCustomers = computed(() => {
  return adminCustomers.value.filter(c => {
    return (c.name || '').toLowerCase().includes(searchQuery.value.toLowerCase()) || 
           (c.email || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})
</script>

<style scoped>
.admin-customers {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.customers-header {
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

/* Grids */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.span-8 {
  grid-column: span 8;
}

.span-4 {
  grid-column: span 4;
}

/* Table spécifiques */
.text-center-cell {
  text-align: center;
  padding: 3rem 0 !important;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.clickable-row {
  cursor: pointer;
}

.row-selected {
  background-color: rgba(184, 152, 116, 0.05);
}

.row-selected:hover {
  background-color: rgba(184, 152, 116, 0.07) !important;
}

.client-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.client-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #242424;
  color: #b89874;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.client-details {
  display: flex;
  flex-direction: column;
}

.client-name {
  color: #ffffff;
  font-weight: 500;
}

.client-email {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
}

/* Lifetime Badges */
.badge-status {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  display: inline-block;
}

.status-vip-black {
  background-color: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.status-vip-plat {
  background-color: rgba(161, 161, 170, 0.1);
  color: #d4d4d8;
  border: 1px solid rgba(161, 161, 170, 0.2);
}

.status-vip-gold {
  background-color: rgba(184, 152, 116, 0.1);
  color: #b89874;
  border: 1px solid rgba(184, 152, 116, 0.25);
}

/* Detail Card Profile */
.detail-sidebar-card {
  display: flex;
  flex-direction: column;
}

.empty-profile-state {
  margin: auto;
  text-align: center;
  padding: 3rem 1.5rem;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.78rem;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-icon-placeholder {
  color: rgba(255, 255, 255, 0.15);
}

.profile-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 1rem;
}

.profile-avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b89874, #a1805c);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

.profile-name-title {
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.profile-email-sub {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.85rem;
}

.profile-badge-vip {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.06);
}

.profile-divider {
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.06);
  margin: 1.5rem 0;
}

.metrics-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  text-align: left;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.35);
}

.metric-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

.text-gold {
  color: #b89874;
}

.profile-extra-details {
  width: 100%;
  text-align: left;
}

.details-section-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1rem;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
}

.timeline-event {
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: calc(-1rem - 4.5px);
  top: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #b89874;
  border: 2px solid #111111;
}

.timeline-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.event-title {
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.event-time {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.35);
}

.client-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge-role {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  text-transform: uppercase;
}

.badge-role--admin {
  background: rgba(184, 152, 116, 0.2);
  color: #b89874;
  border: 1px solid rgba(184, 152, 116, 0.4);
}

.badge-role--client {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.6);
}

.profile-badges-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

.customer-actions-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
  margin-top: 1rem;
}

.action-buttons-inline {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.btn-customer-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  text-decoration: none;
}

.btn-customer-action--role {
  width: 100%;
  background: #b89874;
  color: #0b0b0b;
}

.btn-customer-action--role:hover:not(:disabled) {
  background: #d0b08c;
}

.btn-customer-action--revoke {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-customer-action--revoke:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.25);
}

.btn-customer-action--secondary {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-customer-action--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.empty-activity-note {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  padding: 0.5rem 0;
}

.toast-popup {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #181818;
  color: #ffffff;
  padding: 0.85rem 1.4rem;
  border-radius: 6px;
  border: 1px solid #b89874;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  font-size: 0.82rem;
  z-index: 9999;
}

@media (max-width: 1024px) {
  .span-8, .span-4 {
    grid-column: span 12;
  }
}

@media (max-width: 480px) {
  .customers-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .profile-card-content {
    padding-top: 0.5rem;
  }
}
</style>

