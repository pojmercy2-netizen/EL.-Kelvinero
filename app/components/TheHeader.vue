<template>
  <header :class="['header', { 'header--scrolled': isScrolled, 'header--mobile-open': mobileMenuOpen }]" :style="{ top: headerTop }">
    <div class="container header__container">
      <!-- Hamburger (mobile left slot) -->
      <button class="header__mobile-toggle" aria-label="Toggle Menu" @click="toggleMobileMenu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <!-- Logo (desktop left / mobile centre) -->
      <NuxtLink to="/" class="header__logo-link">
        <img src="/logo.png" alt="EL. Kelvinero Logo" class="header__logo" />
      </NuxtLink>

      <!-- Nav Links (Desktop) -->
      <nav class="header__nav">
        <ul class="header__nav-list">
          <li v-for="item in navItems" :key="item.label">
            <NuxtLink :to="item.href" class="header__nav-link hover-underline">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Icons / Actions -->
      <div class="header__actions">
        <!-- Search Trigger -->
        <button class="header__action-btn" aria-label="Search" @click="toggleSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <!-- Account Profile → navigates to /profile or opens AuthModal -->
        <a href="/profile" class="header__action-btn header__action-btn--desktop" aria-label="Account" @click.prevent="handleProfileClick" style="position:relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span v-if="currentUser?.isAdmin" class="header__admin-dot" title="Admin"></span>
        </a>
        <!-- Cart Button → navigates to /cart page -->
        <NuxtLink to="/cart" class="header__action-btn header__cart-btn" aria-label="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span class="header__cart-count" :class="{ 'header__cart-count--pop': animateCart }">{{ cartCount }}</span>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Mobile Navigation Slide-out -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-drawer__overlay" @click="closeMobileMenu"></div>
    </Transition>
    <div :class="['mobile-drawer', { 'mobile-drawer--open': mobileMenuOpen }]">
      <div class="mobile-drawer__content">
        <div class="mobile-drawer__header">
          <img src="/logo.png" alt="EL. Kelvinero Logo" class="mobile-drawer__logo" />
          <button class="mobile-drawer__close" @click="closeMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav class="mobile-drawer__nav">
          <ul class="mobile-drawer__list">
            <li
              v-for="(item, index) in navItems"
              :key="item.label"
              class="mobile-drawer__item"
              :style="{ animationDelay: mobileMenuOpen ? `${0.08 + index * 0.07}s` : '0s' }"
              :class="{ 'mobile-drawer__item--visible': mobileMenuOpen }"
            >
              <NuxtLink :to="item.href" class="mobile-drawer__link" @click="closeMobileMenu">{{ item.label }}</NuxtLink>
            </li>
            <li
              class="mobile-drawer__item"
              :style="{ animationDelay: mobileMenuOpen ? `${0.08 + navItems.length * 0.07}s` : '0s' }"
              :class="{ 'mobile-drawer__item--visible': mobileMenuOpen }"
            >
              <a href="/profile" class="mobile-drawer__link" @click.prevent="handleProfileClickMobile">ACCOUNT</a>
            </li>
            <li
              v-if="currentUser?.isAdmin"
              class="mobile-drawer__item"
              :style="{ animationDelay: mobileMenuOpen ? `${0.08 + (navItems.length + 1) * 0.07}s` : '0s' }"
              :class="{ 'mobile-drawer__item--visible': mobileMenuOpen }"
            >
              <NuxtLink to="/admin/dashboard" class="mobile-drawer__link mobile-drawer__link--admin" @click="closeMobileMenu">ADMIN CONSOLE</NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Social Links -->
        <div class="mobile-drawer__socials">
          <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener" aria-label="WhatsApp" class="mobile-drawer__social">
            <!-- WhatsApp -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@elkelvinero" target="_blank" rel="noopener" aria-label="TikTok" class="mobile-drawer__social">
            <!-- TikTok -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/elkelvinero" target="_blank" rel="noopener" aria-label="Instagram" class="mobile-drawer__social">
            <!-- Instagram -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://x.com/elkelvinero" target="_blank" rel="noopener" aria-label="X (Twitter)" class="mobile-drawer__social">
            <!-- X / Twitter -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733-16z"/>
              <path d="M4 20l6.768-6.768M20 4l-6.768 6.768"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Search Overlay -->
    <Transition name="fade-slide">
      <div v-if="searchOpen" class="search-overlay">
        <div class="container search-overlay__container">
          <div class="search-overlay__search-box">
            <input type="text" placeholder="Search our collection..." class="search-overlay__input" ref="searchInput" @keyup.enter="performSearch" />
            <button class="search-overlay__close" @click="toggleSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { handleProfileClick, currentUser } = useAuth()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const animateCart = ref(false)
const searchInput = ref(null)

const handleProfileClickMobile = (e) => {
  closeMobileMenu()
  handleProfileClick(e)
}

const cartCount = useState('cartCount', () => 0)

const navItems = [
  { label: 'HOME', href: '/' },
  { label: 'COLLECTION', href: '/collection' },
  { label: 'SHOP', href: '/shop' },
  { label: 'LOOKBOOK', href: '/lookbook' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'JOURNAL', href: '/journal' }
]

// Listen to scroll to add background and shadow
const handleScroll = () => {
  if (window.scrollY > 20) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }
}

const performSearch = (e) => {
  showToast(`Searching for: "${e.target.value}"`)
  searchOpen.value = false
}

const toasts = useState('toasts', () => [])

const showToast = (message) => {
  toasts.value.push({
    id: Date.now(),
    message
  })
}

const toggleCartDrawer = () => {
  const cartDrawerOpen = useState('cartDrawerOpen', () => false)
  cartDrawerOpen.value = !cartDrawerOpen.value
}

const { storeSettings } = useStoreSettings()
const headerTop = computed(() => storeSettings.value.announcementEnabled ? '36px' : '0px')

// Watch cart count to trigger micro-animation
watch(cartCount, () => {
  animateCart.value = true
  setTimeout(() => {
    animateCart.value = false
  }, 300)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 36px; /* Sit just below the announcement bar */
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--color-bg-light);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  z-index: 100;
  transition: var(--transition-smooth);
  overflow: visible;
}

.header--scrolled {
  height: 70px;
  background-color: var(--color-bg-header);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(10px);
  border-bottom-color: rgba(0, 0, 0, 0.05);
}

.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__logo-link {
  display: flex;
  align-items: center;
}

.header__logo {
  height: 110px;
  width: auto;
  object-fit: contain;
  transition: var(--transition-smooth);
  position: relative;
}

.header--scrolled .header__logo {
  height: 90px;
}

/* Nav Styles */
.header__nav {
  display: block;
}

.header__nav-list {
  display: flex;
  list-style: none;
  gap: 2.5rem;
}

.header__nav-link {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--color-text-dark);
  padding: 0.5rem 0;
}

/* Actions Styles */
.header__actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Hide the account icon on mobile to keep the right slot clean */
@media (max-width: 992px) {
  .header__action-btn--desktop {
    display: none;
  }
}

.header__action-btn {
  color: var(--color-text-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
  position: relative;
}

.header__action-btn:hover {
  color: var(--color-accent);
}

.header__cart-btn {
  position: relative;
}

.header__cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--color-text-dark);
  color: var(--color-text-light);
  font-size: 0.65rem;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.header__cart-count--pop {
  transform: scale(1.3);
  background-color: var(--color-accent);
}

.header__admin-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: #b89874;
  border-radius: 50%;
  border: 1.5px solid #fff;
}

/* Hamburger — hidden on desktop, shown on mobile */
.header__mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 20px;
  height: 14px;
  flex-shrink: 0;
}

.hamburger-line {
  width: 100%;
  height: 1.5px;
  background-color: var(--color-text-dark);
  transition: var(--transition-smooth);
}

/* Animate to X when menu is open */
.header--mobile-open .header__mobile-toggle .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.header--mobile-open .header__mobile-toggle .hamburger-line:nth-child(2) {
  opacity: 0;
}

.header--mobile-open .header__mobile-toggle .hamburger-line:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* Mobile Drawer Styles */
.mobile-drawer {
  position: fixed;
  top: 0;
  left: -100%;
  width: 320px;
  height: 100vh;
  background-color: var(--color-bg-light);
  z-index: 150;
  box-shadow: 10px 0 30px rgba(0,0,0,0.05);
  transition: left 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
}

.mobile-drawer--open {
  left: 0;
}

.mobile-drawer__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  z-index: 140;
}

.mobile-drawer__content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.mobile-drawer__logo {
  height: 150px;
  width: auto;
  object-fit: contain;
}

.mobile-drawer__close {
  color: var(--color-text-dark);
}

.mobile-drawer__nav {
  margin-top: 0.5rem;
  flex: 1;
}

.mobile-drawer__list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
}

/* Each item starts hidden/shifted left, flies in when drawer opens */
.mobile-drawer__item {
  opacity: 0;
  transform: translateX(-30px);
  transition: none;
}

.mobile-drawer__item--visible {
  animation: flyIn 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes flyIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mobile-drawer__link {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-dark);
  display: block;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  position: relative;
  transition: color 0.3s ease, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Sliding gold underline — grows from left to right on hover */
.mobile-drawer__link::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-accent);
  transition: width 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.mobile-drawer__link:hover {
  color: var(--color-accent);
  transform: translateX(8px);
}

.mobile-drawer__link:hover::after {
  width: 100%;
}

.mobile-drawer__link--admin {
  color: #b89874 !important;
  font-weight: 600;
}
.mobile-drawer__link--admin:hover {
  color: #d4aa82 !important;
}

/* Social icons row */
.mobile-drawer__socials {
  display: flex;
  gap: 1.5rem;
  padding-top: 1.5rem;
  margin-top: auto;
  border-top: 1px solid rgba(0,0,0,0.07);
}

.mobile-drawer__social {
  color: var(--color-text-dark);
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
}

.mobile-drawer__social:hover {
  color: var(--color-accent);
  opacity: 1;
  transform: translateY(-3px);
}

/* Search Overlay Styles */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: var(--color-bg-light);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  z-index: 120;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.search-overlay__container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.search-overlay__search-box {
  display: flex;
  width: 100%;
  max-width: 800px;
  align-items: center;
  border-bottom: 1px solid var(--color-text-dark);
  padding: 0.5rem 0;
}

.search-overlay__input {
  flex: 1;
  background: none;
  border: none;
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-text-dark);
  outline: none;
}

.search-overlay__input::placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}

.search-overlay__close {
  color: var(--color-text-dark);
  margin-left: 1rem;
  transition: transform 0.2s ease;
}

.search-overlay__close:hover {
  transform: rotate(90deg);
}

/* Transitions */
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
  transform: translateY(-20px);
  opacity: 0;
}

/* ─── Mobile layout (≤992px) ─────────────────────────────────────────── */
@media (max-width: 992px) {
  /* Hide desktop nav */
  .header__nav {
    display: none;
  }

  /* Switch container to 3-column grid:
     left: hamburger  |  centre: logo  |  right: action icons */
  .header__container {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  /* Show the hamburger in the left slot */
  .header__mobile-toggle {
    display: flex;
    justify-self: start;
  }

  /* Logo sits in the auto (centre) column */
  .header__logo-link {
    justify-self: center;
  }

  /* Action icons pushed to the far right */
  .header__actions {
    justify-self: end;
    gap: 1rem;
  }

  .header__logo {
    height: 75px;
  }
}

@media (max-width: 576px) {
  .header__logo {
    height: 60px;
  }
}
</style>
