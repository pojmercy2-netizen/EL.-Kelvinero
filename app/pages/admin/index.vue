<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/logo.png" alt="TZORAH EMPORIUM Logo" class="login-logo" />
          <h1 class="login-title">TZORAH EMPORIUM</h1>
          <p class="login-subtitle">ADMIN CONSOLE PORTAL</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">EMAIL ADDRESS</label>
            <div class="input-wrapper">
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="admin@tzorahemporium.com"
                class="form-input"
                required
                autocomplete="email"
              />
              <span class="input-focus-line"></span>
            </div>
          </div>

          <div class="form-group" :class="{ 'has-error': error }">
            <label for="password" class="form-label">PASSWORD</label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••••••"
                class="form-input"
                required
                autocomplete="current-password"
                ref="passwordInput"
              />
              <span class="input-focus-line"></span>
            </div>
            <p v-if="error" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ error }}
            </p>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>AUTHENTICATE SECURELY</span>
          </button>
        </form>
      </div>

      <div class="login-footer">
        <p>&copy; 2026 TZORAH EMPORIUM. All rights reserved.</p>
        <p class="demo-credential-tip">Sign in with your registered admin account.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

useHead({
  title: 'Admin Access Gate | TZORAH EMPORIUM',
  meta: [{ name: 'description', content: 'Secure gateway portal for TZORAH EMPORIUM administration console.' }]
})

const router = useRouter()
const adminToken = useCookie('adminToken', { maxAge: 60 * 60 * 24 * 7 })
const adminUser = useState('adminUser', () => null)

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const passwordInput = ref(null)

onMounted(() => {
  // Already authenticated — go straight to dashboard
  if (adminToken.value && adminUser.value?.isAdmin) {
    router.push('/admin/dashboard')
  }
})

const handleLogin = async () => {
  if (!email.value || !password.value) return

  error.value = ''
  loading.value = true

  try {
    // 1. Login to get JWT token
    const data = await $fetch('/api/v1/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    if (!data?.access_token) throw new Error('No token returned')

    // 2. Fetch user profile to verify is_admin
    const profile = await $fetch('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${data.access_token}` }
    })

    if (!profile?.is_admin) {
      error.value = 'ACCESS DENIED. This account does not have admin privileges.'
      loading.value = false
      return
    }

    // 3. Store token & user, redirect to dashboard
    adminToken.value = data.access_token
    adminUser.value = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      isAdmin: true
    }

    router.push('/admin/dashboard')
  } catch (err) {
    const msg = err?.data?.message || err?.message || 'Authentication failed.'
    error.value = msg.toUpperCase()
    password.value = ''
    passwordInput.value?.focus()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-page {
  background-color: #080808;
  background-image: 
    radial-gradient(at 0% 0%, rgba(184, 152, 116, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(0, 0, 0, 0.8) 0px, transparent 50%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: #e8e4df;
}

.login-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.login-card {
  background-color: #111111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 3rem 2.5rem;
  border-radius: 4px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #b89874, transparent);
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-logo {
  width: 48px;
  height: auto;
  filter: brightness(0) invert(1);
  margin-bottom: 1.25rem;
  opacity: 0.95;
}

.login-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.login-subtitle {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #b89874;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  background-color: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
  letter-spacing: 0.04em;
  transition: all 0.3s ease;
  border-radius: 2px;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: rgba(184, 152, 116, 0.5);
  background-color: #1a1a1a;
}

.input-focus-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background-color: #b89874;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.form-input:focus ~ .input-focus-line {
  width: 100%;
}

.has-error .form-input {
  border-color: #e25c5c;
  background-color: rgba(226, 92, 92, 0.03);
}

.error-message {
  font-size: 0.68rem;
  color: #e25c5c;
  font-weight: 600;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.error-icon {
  margin-top: -1px;
  flex-shrink: 0;
}

.btn-login {
  background-color: #b89874;
  color: #000000;
  border: none;
  padding: 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  margin-top: 0.25rem;
}

.btn-login:hover:not(:disabled) {
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0 0 15px rgba(184, 152, 116, 0.3);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: #000000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-footer p {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.05em;
}

.demo-credential-tip {
  color: rgba(184, 152, 116, 0.5) !important;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
  .login-title {
    font-size: 1.8rem;
  }
}
</style>
