export default defineNuxtRouteMiddleware(async (to) => {
  // Allow the login page itself to pass through
  if (to.path === '/admin') return

  const adminToken = useCookie('adminToken')
  const adminUser = useState('adminUser', () => null)

  // No token at all → redirect to admin login
  if (!adminToken.value) {
    return navigateTo('/admin')
  }

  // If we already have adminUser in state, no need to re-fetch
  if (adminUser.value?.isAdmin) return

  // Verify the token is still valid and user is still an admin
  try {
    const profile = await $fetch('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${adminToken.value}` }
    })

    if (!profile?.is_admin) {
      adminToken.value = null
      adminUser.value = null
      return navigateTo('/admin')
    }

    adminUser.value = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      isAdmin: true
    }
  } catch {
    // Token invalid/expired
    adminToken.value = null
    adminUser.value = null
    return navigateTo('/admin')
  }
})
