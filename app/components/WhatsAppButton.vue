<template>
  <Transition name="wa-fade">
    <a
      v-if="whatsappNumber"
      :href="whatsappLink"
      target="_blank"
      rel="noopener noreferrer"
      class="wa-fab"
      :class="{ 'wa-fab--pulsing': showPulse }"
      aria-label="Chat with us on WhatsApp"
      @mouseenter="showPulse = false"
    >
      <!-- WhatsApp SVG Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="wa-icon"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
        />
      </svg>

      <!-- Tooltip label -->
      <span class="wa-tooltip">Chat with us</span>
    </a>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const { storeSettings, fetchStoreSettings } = useStoreSettings()

const showPulse = ref(true)

// Remove pulse ring after 6 seconds; also refresh settings client-side
onMounted(async () => {
  await fetchStoreSettings()
  setTimeout(() => { showPulse.value = false }, 6000)
})

const whatsappNumber = computed(() => {
  // Strip all non-digits from the stored number
  const raw = storeSettings.value?.whatsappNumber || ''
  return raw.replace(/\D/g, '')
})

const whatsappLink = computed(() => {
  const msg = encodeURIComponent("Hello! I'd like to inquire about a product.")
  return `https://wa.me/${whatsappNumber.value}?text=${msg}`
})
</script>

<style scoped>
.wa-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25d366;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.45);
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wa-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(37, 211, 102, 0.6);
}

.wa-fab:hover .wa-tooltip {
  opacity: 1;
  transform: translateX(0);
}

/* Pulse ring animation */
.wa-fab--pulsing::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 3px solid rgba(37, 211, 102, 0.5);
  animation: wa-pulse 1.8s ease-out infinite;
}

@keyframes wa-pulse {
  0%   { opacity: 1; transform: scale(1); }
  80%  { opacity: 0; transform: scale(1.6); }
  100% { opacity: 0; transform: scale(1.6); }
}

.wa-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}

/* Tooltip */
.wa-tooltip {
  position: absolute;
  right: calc(100% + 12px);
  background: #1a1a1a;
  color: #fff;
  font-size: 0.75rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  pointer-events: none;
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.wa-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: #1a1a1a;
}

/* Mount transition */
.wa-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.wa-fade-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
</style>
