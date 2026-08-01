<template>
  <div class="toast-container">
    <TransitionGroup name="toast-slide">
      <div v-for="toast in toasts" :key="toast.id" class="toast-item">
        <div class="toast-item__content">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="toast-item__icon">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 8 12 12 16 14"></polyline>
          </svg>
          <span class="toast-item__message">{{ toast.message }}</span>
        </div>
        <button class="toast-item__close" aria-label="Close Notification" @click="removeToast(toast.id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const toasts = useState('toasts', () => [])

const removeToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

// Watch toasts and remove each after a timeout
watch(toasts, (newToasts) => {
  if (newToasts.length > 0) {
    const latestToast = newToasts[newToasts.length - 1]
    setTimeout(() => {
      removeToast(latestToast.id)
    }, 3500)
  }
}, { deep: true })
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 380px;
  width: calc(100vw - 4rem);
  pointer-events: none;
}

.toast-item {
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  border: 1px solid var(--border-color-dark);
  padding: 1rem 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  pointer-events: auto;
  backdrop-filter: blur(10px);
}

.toast-item__content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-item__icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.toast-item__message {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.toast-item__close {
  color: var(--color-text-muted-light);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
  flex-shrink: 0;
}

.toast-item__close:hover {
  color: var(--color-text-light);
}

/* Toast Transition Animations */
.toast-slide-enter-active, .toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
