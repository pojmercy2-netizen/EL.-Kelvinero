<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { fetchUserProfile } = useAuth()

// Initialize shared Nuxt application states globally at root
const cartCount = useState('cartCount', () => 0)
const cartDrawerOpen = useState('cartDrawerOpen', () => false)
const cartItems = useState('cartItems', () => [])
const toasts = useState('toasts', () => [])

onMounted(async () => {
  // Clear any existing toasts on page load
  toasts.value = []
  
  // Restore user session if a token exists
  await fetchUserProfile()
})
</script>

<style>
/* Base fade transition for page routes */
.page-enter-active, .page-leave-active {
  transition: opacity 0.4s ease;
}
.page-enter-from, .page-leave-to {
  opacity: 0;
}
</style>
