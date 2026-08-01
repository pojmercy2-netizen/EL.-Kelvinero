<template>
  <div class="app-layout" :style="layoutPaddingStyle">
    <!-- Announcement Bar -->
    <div
      v-if="storeSettings.announcementEnabled"
      class="announcement-bar"
      :style="{ backgroundColor: storeSettings.announcementBg || '#1a1a1a' }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
      {{ storeSettings.announcementText || 'FREE SHIPPING ON ORDERS OVER $150' }}
    </div>

    <!-- Navigation Bar -->
    <TheHeader />

    <!-- Main Content Page Slot -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <TheFooter />

    <!-- Interactive E-Commerce Drawers / Overlays -->
    <CartDrawer />
    
    <!-- Micro-Interaction Notifications -->
    <ToastSystem />

    <!-- Authentication Modal -->
    <AuthModal />

    <!-- Floating WhatsApp Button -->
    <WhatsAppButton />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const { storeSettings, fetchStoreSettings } = useStoreSettings()

// Fetch live settings during SSR and client mount
const { data: liveSettings } = await useAsyncData('appLayoutSettingsData', () => $fetch('/api/v1/settings'))
if (liveSettings.value) {
  storeSettings.value = { ...storeSettings.value, ...liveSettings.value }
}

onMounted(fetchStoreSettings)

const layoutPaddingStyle = computed(() => {
  const barHeight = storeSettings.value.announcementEnabled ? 36 : 0
  return {
    paddingTop: `calc(var(--header-height) + ${barHeight}px)`
  }
})
</script>

<style>
/* App Layout Container styles */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* Page fade transition */
.page-enter-active, .page-leave-active {
  transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.page-enter-from, .page-leave-to {
  opacity: 0;
}
</style>
