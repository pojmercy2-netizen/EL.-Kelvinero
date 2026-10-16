<template>
  <div class="mobile-bottom-nav">
    <div class="mobile-bottom-nav__container">
      <!-- Home -->
      <NuxtLink to="/" class="mobile-bottom-nav__item" active-class="mobile-bottom-nav__item--active">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span class="mobile-bottom-nav__label">HOME</span>
      </NuxtLink>

      <!-- Shop -->
      <NuxtLink to="/shop" class="mobile-bottom-nav__item" active-class="mobile-bottom-nav__item--active">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span class="mobile-bottom-nav__label">SHOP</span>
      </NuxtLink>

      <!-- Center Logo / Collection Button -->
      <NuxtLink to="/shop" class="mobile-bottom-nav__item mobile-bottom-nav__item--center">
        <div class="mobile-bottom-nav__center-btn">
          <img src="/logo.png" alt="TZORAH EMPORIUM" class="mobile-bottom-nav__center-logo" />
        </div>
      </NuxtLink>

      <!-- Cart Trigger -->
      <button class="mobile-bottom-nav__item mobile-bottom-nav__item--btn" @click="toggleCart">
        <div class="mobile-bottom-nav__cart-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span v-if="cartCount > 0" class="mobile-bottom-nav__cart-badge">{{ cartCount }}</span>
        </div>
        <span class="mobile-bottom-nav__label">CART</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const cartCount = useState('cartCount')
const cartDrawerOpen = useState('cartDrawerOpen')

const toggleCart = () => {
  cartDrawerOpen.value = !cartDrawerOpen.value
}
</script>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 150;
  display: none;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.04);
}

.mobile-bottom-nav__container {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-around;
  padding: 0 0.5rem;
  position: relative;
}

.mobile-bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  text-decoration: none;
  height: 100%;
  flex: 1;
  gap: 0.3rem;
  transition: color 0.25s ease;
}

.mobile-bottom-nav__item--btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.mobile-bottom-nav__item:hover,
.mobile-bottom-nav__item--active {
  color: var(--color-text-dark);
}

.mobile-bottom-nav__label {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

/* Center circle button */
.mobile-bottom-nav__item--center {
  position: relative;
  height: auto;
  overflow: visible;
  top: -10px;
}

.mobile-bottom-nav__center-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-text-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}

.mobile-bottom-nav__center-btn:hover {
  transform: scale(1.08);
}

.mobile-bottom-nav__center-logo {
  width: 26px;
  height: auto;
  filter: brightness(0) invert(1);
}

/* Cart badge */
.mobile-bottom-nav__cart-icon-wrap {
  position: relative;
}

.mobile-bottom-nav__cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: var(--color-accent);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 0.55rem;
  font-weight: 700;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive visibility */
@media (max-width: 768px) {
  .mobile-bottom-nav {
    display: block;
  }
}
</style>
