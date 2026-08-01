<template>
  <div class="admin-app" :class="{ 'sidebar-collapsed': sidebarCollapsed, 'mobile-sidebar-open': mobileSidebarOpen }">

    <!-- Mobile Sidebar Backdrop Overlay -->
    <div v-if="mobileSidebarOpen" class="admin-sidebar-backdrop" @click="mobileSidebarOpen = false"></div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SIDEBAR                                     -->
    <!-- ═══════════════════════════════════════════ -->
    <aside class="admin-sidebar">
      <!-- Brand -->
      <div class="admin-sidebar__brand">
        <img src="/logo.png" alt="EL. Kelvinero" class="admin-sidebar__logo" />
        <div class="admin-sidebar__brand-text">
          <span class="admin-sidebar__brand-name">EL. KELVINERO</span>
          <span class="admin-sidebar__brand-sub">Admin Console</span>
        </div>
      </div>

      <!-- Nav Items -->
      <nav class="admin-sidebar__nav">
        <div v-for="item in navItems" :key="item.label" class="admin-nav-group">
          <!-- Direct Link -->
          <NuxtLink
            v-if="!item.children"
            :to="item.to"
            class="admin-nav-item"
            :class="{ 'admin-nav-item--active': isActive(item.to) }"
          >
            <span class="admin-nav-item__icon" v-html="item.icon"></span>
            <span class="admin-nav-item__label">{{ item.label }}</span>
            <span v-if="item.badge" class="admin-nav-item__badge">{{ item.badge }}</span>
          </NuxtLink>

          <!-- Dropdown Parent -->
          <div v-else class="admin-nav-dropdown" :class="{ 'admin-nav-dropdown--open': item.expanded }">
            <button class="admin-nav-item admin-nav-dropdown-toggle" @click="item.expanded = !item.expanded">
              <span class="admin-nav-item__icon" v-html="item.icon"></span>
              <span class="admin-nav-item__label">{{ item.label }}</span>
              <span class="admin-nav-dropdown-arrow" :class="{ 'admin-nav-dropdown-arrow--rotated': item.expanded }">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            <div class="admin-nav-dropdown-children" v-show="item.expanded">
              <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="admin-nav-child-item"
                :class="{ 'admin-nav-child-item--active': isActive(child.to) }"
              >
                <span class="admin-nav-child-dot"></span>
                <span class="admin-nav-item__label">{{ child.label }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="admin-sidebar__footer">
        <div class="admin-sidebar__user">
          <div class="admin-sidebar__avatar">{{ adminUserInitial }}</div>
          <div class="admin-sidebar__user-info">
            <span class="admin-sidebar__user-name">{{ adminUser?.name || 'Admin' }}</span>
            <span class="admin-sidebar__user-role">{{ adminUser?.email || 'Super Admin' }}</span>
          </div>
        </div>
        <button class="admin-sidebar__logout" @click="logout" title="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </aside>

    <!-- ═══════════════════════════════════════════ -->
    <!-- MAIN PANEL                                  -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="admin-main">
      <!-- Top Bar -->
      <header class="admin-topbar">
        <button class="admin-topbar__toggle" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="admin-topbar__breadcrumb">
          <span class="admin-topbar__page">{{ currentPageTitle }}</span>
        </div>
        <div class="admin-topbar__actions">
          <div class="admin-topbar__time">{{ currentTime }}</div>
          <NuxtLink to="/" target="_blank" class="admin-topbar__storefront" title="View Storefront">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Storefront
          </NuxtLink>
        </div>
      </header>

      <!-- Page Content -->
      <div class="admin-content">
        <slot />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const adminToken = useCookie('adminToken')
const adminUser = useState('adminUser', () => null)

const adminUserInitial = computed(() => {
  const name = adminUser.value?.name || 'A'
  return name.charAt(0).toUpperCase()
})

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)
const currentTime = ref('')

let clockInterval = null

// Watch for route changes to auto-close mobile sidebar and manage dropdown state
watch(() => route.path, () => {
  mobileSidebarOpen.value = false
})

onMounted(() => {
  updateTime()
  clockInterval = setInterval(updateTime, 1000)

  // Expand parent if active path is sub-child
  navItems.value.forEach(item => {
    if (item.children && item.children.some(child => route.path === child.to)) {
      item.expanded = true
    }
  })
})

onUnmounted(() => {
  clearInterval(clockInterval)
})

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function toggleSidebar() {
  if (window.innerWidth <= 768) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

const navItems = ref([
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
  },
  {
    label: 'Collections',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5L4 4.9A2.5 2.5 0 0 1 6.5 2.4L20 2.4L20 17L6.5 17"/></svg>',
    expanded: false,
    children: [
      { to: '/admin/collections/men', label: 'Men' },
      { to: '/admin/collections/women', label: 'Women' },
      { to: '/admin/collections/kids', label: 'Kids' }
    ]
  },
  {
    to: '/admin/products',
    label: 'Products',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    badge: '14'
  },
  {
    to: '/admin/lookbook',
    label: 'Lookbook',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5L16 10 4 20"/></svg>'
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    badge: '3'
  },
  {
    to: '/admin/customers',
    label: 'Customers',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
  },
  {
    to: '/admin/settings',
    label: 'Settings',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
  }
])

const pageMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/lookbook': 'Lookbook',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
  '/admin/collections/men': "Men's Collection",
  '/admin/collections/women': "Women's Collection",
  '/admin/collections/kids': "Kids' Collection"
}

const currentPageTitle = computed(() => pageMap[route.path] || 'Admin')

function isActive(path) {
  return route.path.startsWith(path) && (path !== '/admin' || route.path === '/admin')
}

function logout() {
  adminToken.value = null
  adminUser.value = null
  router.push('/admin')
}
</script>

<style>
/* Reset admin body */
.admin-app {
  display: flex;
  min-height: 100vh;
  background-color: #0d0d0d;
  color: #e8e4df;
  font-family: 'Inter', system-ui, sans-serif;
  padding-top: 0 !important;
}

/* ─── Sidebar ─────────────────────────────────── */
.admin-sidebar {
  width: 240px;
  min-height: 100vh;
  background-color: #111111;
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
}

.admin-app.sidebar-collapsed .admin-sidebar {
  width: 64px;
}

.admin-app.sidebar-collapsed .admin-sidebar__brand-text,
.admin-app.sidebar-collapsed .admin-nav-item__label,
.admin-app.sidebar-collapsed .admin-nav-item__badge,
.admin-app.sidebar-collapsed .admin-sidebar__user-info {
  opacity: 0;
  pointer-events: none;
  width: 0;
  overflow: hidden;
}

.admin-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.admin-sidebar__logo {
  width: 32px;
  height: auto;
  filter: brightness(0) invert(1);
  flex-shrink: 0;
}

.admin-sidebar__brand-text {
  display: flex;
  flex-direction: column;
  transition: opacity 0.2s ease, width 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

.admin-sidebar__brand-name {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #ffffff;
}

.admin-sidebar__brand-sub {
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  color: #b89874;
  margin-top: 1px;
}

/* Nav */
.admin-sidebar__nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1.25rem;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.admin-nav-item:hover {
  color: #ffffff;
  background-color: rgba(255,255,255,0.04);
}

.admin-nav-item--active {
  color: #b89874 !important;
  background-color: rgba(184, 152, 116, 0.08) !important;
}

.admin-nav-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #b89874;
  border-radius: 0 2px 2px 0;
}

.admin-nav-dropdown-toggle {
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
}

.admin-nav-dropdown-arrow {
  margin-left: auto;
  display: flex;
  align-items: center;
  transition: transform 0.25s ease;
  color: rgba(255, 255, 255, 0.3);
}

.admin-nav-dropdown-arrow--rotated {
  transform: rotate(180deg);
  color: #b89874;
}

.admin-nav-dropdown-children {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.15);
  padding: 0.25rem 0;
}

.admin-nav-child-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.55rem 1.25rem 0.55rem 2.25rem;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
}

.admin-nav-child-item:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.02);
}

.admin-nav-child-item--active {
  color: #b89874 !important;
  font-weight: 600;
}

.admin-nav-child-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
}

.admin-app.sidebar-collapsed .admin-nav-dropdown-children {
  display: none !important;
}


.admin-nav-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
}

.admin-nav-item__label {
  transition: opacity 0.2s ease, width 0.3s ease;
  overflow: hidden;
}

.admin-nav-item__badge {
  margin-left: auto;
  background-color: rgba(184, 152, 116, 0.15);
  color: #b89874;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  letter-spacing: 0.05em;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

/* Sidebar Footer */
.admin-sidebar__footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.admin-sidebar__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b89874, #a1805c);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.admin-sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.admin-sidebar__user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: opacity 0.2s ease;
  overflow: hidden;
  white-space: nowrap;
}

.admin-sidebar__user-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
}

.admin-sidebar__user-role {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.05em;
}

.admin-sidebar__logout {
  color: rgba(255,255,255,0.35);
  transition: color 0.2s ease;
  padding: 0.25rem;
  flex-shrink: 0;
}

.admin-sidebar__logout:hover {
  color: #e25c5c;
}

/* ─── Main Content ─────────────────────────────── */
.admin-main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.admin-app.sidebar-collapsed .admin-main {
  margin-left: 64px;
}

/* Top Bar */
.admin-topbar {
  height: 60px;
  background-color: #111111;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
  flex-shrink: 0;
}

.admin-topbar__toggle {
  color: rgba(255,255,255,0.5);
  transition: color 0.2s ease;
  padding: 0.25rem;
}

.admin-topbar__toggle:hover {
  color: #ffffff;
}

.admin-topbar__breadcrumb {
  flex: 1;
}

.admin-topbar__page {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
}

.admin-topbar__actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.admin-topbar__time {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.35);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

.admin-topbar__storefront {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #b89874;
  padding: 0.4rem 0.875rem;
  border: 1px solid rgba(184, 152, 116, 0.25);
  transition: all 0.2s ease;
}

.admin-topbar__storefront:hover {
  background-color: rgba(184, 152, 116, 0.1);
  border-color: rgba(184, 152, 116, 0.5);
  color: #b89874;
}

/* Page Content Area */
.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* ─── Shared Admin Card Styles ─────────────────── */
.admin-card {
  background-color: #141414;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 2px;
  padding: 1.5rem;
}

.admin-card-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.5rem;
}

.admin-card-subtitle {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.28);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

/* ─── Shared Table Styles ───────────────────────── */
.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.admin-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  white-space: nowrap;
}

.admin-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.65);
  vertical-align: middle;
}

.admin-table .table-row {
  transition: background-color 0.15s ease;
}

.admin-table .table-row:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

/* Utility classes shared across admin pages */
.font-mono {
  font-size: 0.76rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: rgba(255, 255, 255, 0.6);
}

.font-semibold {
  font-weight: 600;
}

.text-white {
  color: #ffffff !important;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
    width: 240px !important;
  }

  .admin-app.mobile-sidebar-open .admin-sidebar {
    transform: translateX(0);
  }

  .admin-sidebar-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 95;
  }

  .admin-main {
    margin-left: 0 !important;
    width: 100%;
  }

  .admin-content {
    padding: 1.25rem 1rem;
  }

  .admin-topbar__time {
    display: none;
  }

  .admin-topbar__storefront {
    font-size: 0.65rem;
    padding: 0.35rem 0.65rem;
  }
}

@media (max-width: 480px) {
  .admin-topbar {
    padding: 0 1rem;
  }
  .admin-topbar__page {
    font-size: 0.78rem;
  }
}

</style>
