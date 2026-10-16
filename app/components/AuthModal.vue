<template>
  <Transition name="fade">
    <div v-if="authModalOpen" class="auth-modal__overlay" @click="closeModal">
      <div class="auth-modal" @click.stop>
        <!-- Close Button -->
        <button class="auth-modal__close" @click="closeModal" aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Brand Logo/Header -->
        <div class="auth-modal__header">
          <img src="/logo.png" alt="TZORAH EMPORIUM Logo" class="auth-modal__logo" />
          <h2 class="auth-modal__title">TZORAH EMPORIUM</h2>
          <p class="auth-modal__subtitle">LUXURY PERFUMES, BOTANICAL OILS & BOUDOIR</p>
        </div>

        <!-- Mode Selector Tabs -->
        <div class="auth-modal__tabs">
          <button 
            :class="['auth-modal__tab', { 'auth-modal__tab--active': authModalMode === 'login' }]"
            @click="authModalMode = 'login'"
          >
            SIGN IN
          </button>
          <button 
            :class="['auth-modal__tab', { 'auth-modal__tab--active': authModalMode === 'signup' }]"
            @click="authModalMode = 'signup'"
          >
            SIGN UP
          </button>
          <div class="auth-modal__tab-indicator" :class="{ 'auth-modal__tab-indicator--right': authModalMode === 'signup' }"></div>
        </div>

        <!-- Forms Container -->
        <div class="auth-modal__body">
          <Transition name="fade-slide" mode="out-in">
            <!-- Sign In Form -->
            <form v-if="authModalMode === 'login'" key="login" @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label for="login-email">EMAIL ADDRESS</label>
                <input 
                  id="login-email" 
                  v-model="loginForm.email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="login-password">PASSWORD</label>
                <input 
                  id="login-password" 
                  v-model="loginForm.password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  class="form-input"
                />
              </div>

              <div class="auth-modal__options">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="loginForm.remember" />
                  <span>Remember me</span>
                </label>
                <a href="#" class="forgot-link" @click.prevent="forgotPassword">Forgot password?</a>
              </div>

              <button type="submit" class="btn-auth" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                <span v-else>ENTER ACCOUNT</span>
              </button>
            </form>

            <!-- Sign Up Form -->
            <form v-else key="signup" @submit.prevent="handleSignup" class="auth-form">
              <div class="form-group">
                <label for="signup-name">FULL NAME</label>
                <input 
                  id="signup-name" 
                  v-model="signupForm.name" 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="signup-email">EMAIL ADDRESS</label>
                <input 
                  id="signup-email" 
                  v-model="signupForm.email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="signup-password">PASSWORD</label>
                <input 
                  id="signup-password" 
                  v-model="signupForm.password" 
                  type="password" 
                  placeholder="Minimum 6 characters" 
                  required 
                  minlength="6"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="signup-confirm-password">CONFIRM PASSWORD</label>
                <input 
                  id="signup-confirm-password" 
                  v-model="signupForm.confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  class="form-input"
                />
              </div>

              <p class="terms-text">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>

              <button type="submit" class="btn-auth" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                <span v-else>CREATE ACCOUNT</span>
              </button>
            </form>
          </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { authModalOpen, authModalMode, login, register, showToast } = useAuth()
const pendingRedirect = useState('pendingRedirect', () => null)

const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  remember: true
})

const signupForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const closeModal = () => {
  authModalOpen.value = false
}

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await login(loginForm.email, loginForm.password)
    if (res.success) {
      loginForm.email = ''
      loginForm.password = ''
      closeModal()
      const dest = pendingRedirect.value || '/profile'
      pendingRedirect.value = null
      navigateTo(dest)
    }
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  if (signupForm.password !== signupForm.confirmPassword) {
    showToast('Passwords do not match.')
    return
  }

  loading.value = true
  try {
    const res = await register(signupForm.name, signupForm.email, signupForm.password)
    if (res.success) {
      signupForm.name = ''
      signupForm.email = ''
      signupForm.password = ''
      signupForm.confirmPassword = ''
      closeModal()
      const dest = pendingRedirect.value || '/profile'
      pendingRedirect.value = null
      navigateTo(dest)
    }
  } finally {
    loading.value = false
  }
}

const forgotPassword = () => {
  showToast('Password reset link sent to your email.')
}
</script>

<style scoped>
.auth-modal__overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  z-index: 999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1.5rem;
  overflow-y: auto;
}

.auth-modal {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 440px;
  padding: 3rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  flex-direction: column;
  margin: auto;
}

.auth-modal__close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: var(--color-text-dark);
  opacity: 0.6;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.auth-modal__close:hover {
  opacity: 1;
  transform: rotate(90deg);
}

.auth-modal__header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-modal__logo {
  width: 44px;
  height: auto;
  margin-bottom: 1rem;
}

.auth-modal__title {
  font-family: var(--font-serif, serif);
  font-size: 1.8rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  color: var(--color-text-dark, #000);
  margin-bottom: 0.25rem;
}

.auth-modal__subtitle {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-accent, #c8973a);
}

/* Tabs Bar */
.auth-modal__tabs {
  display: flex;
  background-color: #f5f1eb;
  padding: 0.25rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  position: relative;
}

.auth-modal__tab {
  flex: 1;
  border: none;
  background: none;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-text-muted, #777);
  padding: 0.75rem 0;
  cursor: pointer;
  z-index: 2;
  transition: color 0.3s ease;
}

.auth-modal__tab--active {
  color: #000000;
}

.auth-modal__tab-indicator {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  bottom: 0.25rem;
  width: calc(50% - 0.25rem);
  background-color: #ffffff;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.auth-modal__tab-indicator--right {
  transform: translateX(100%);
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--color-text-muted, #777);
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1.5px solid #d8d3cc;
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--color-text-dark, #000);
  background-color: #faf9f7;
  outline: none;
  transition: border-color 0.25s ease;
}

.form-input:focus {
  border-color: var(--color-text-dark, #000);
  background-color: #ffffff;
}

.auth-modal__options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  color: var(--color-text-muted, #777);
}

.forgot-link {
  color: var(--color-text-dark, #000);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: var(--color-accent, #c8973a);
}

.terms-text {
  font-size: 0.68rem;
  color: var(--color-text-muted, #777);
  line-height: 1.4;
  text-align: center;
}

.btn-auth {
  background-color: var(--color-text-dark, #000);
  color: #ffffff;
  border: none;
  padding: 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  cursor: pointer;
  border-radius: 4px;
  transition: opacity 0.2s, background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-auth:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-auth:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Vue Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

@media (max-width: 480px) {
  .auth-modal {
    padding: 2rem 1.5rem;
  }
}
</style>
