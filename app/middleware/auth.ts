import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, currentUser, fetchUserProfile, authModalOpen, authModalMode, showToast } = useAuth()
  const userToken = useCookie('userToken')

  // If token exists but user profile is not loaded yet (e.g. during SSR), load it now
  if (userToken.value && !currentUser.value) {
    await fetchUserProfile()
  }

  if (!isLoggedIn.value) {
    if (import.meta.client) {
      showToast('Please sign in or sign up to access this page.')
      authModalMode.value = 'login'
      authModalOpen.value = true
    }
    return navigateTo('/')
  }
})
