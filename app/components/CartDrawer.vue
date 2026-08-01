<template>
  <div>
    <!-- Overlay Backdrop -->
    <Transition name="fade">
      <div v-if="cartDrawerOpen" class="cart-drawer__overlay" @click="closeDrawer"></div>
    </Transition>

    <!-- Side Drawer -->
    <div :class="['cart-drawer', { 'cart-drawer--open': cartDrawerOpen }]">
      <div class="cart-drawer__content">
        <!-- Header -->
        <div class="cart-drawer__header">
          <h2 class="cart-drawer__title">SHOPPING BAG ({{ cartCount }})</h2>
          <button class="cart-drawer__close" aria-label="Close Bag" @click="closeDrawer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Cart Items List -->
        <div v-if="cartItems.length > 0" class="cart-drawer__body">
          <div v-for="item in cartItems" :key="item.id" class="cart-drawer__item">
            <img :src="item.image" :alt="item.name" class="cart-drawer__item-img" />
            <div class="cart-drawer__item-details">
              <div class="cart-drawer__item-meta">
                <h3 class="cart-drawer__item-title">{{ item.name }}</h3>
                <span class="cart-drawer__item-price">{{ currencySymbol }}{{ (item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="cart-drawer__item-actions">
                <!-- Quantity adjusters -->
                <div class="quantity-selector">
                  <button class="qty-btn" @click="decreaseQty(item)">-</button>
                  <span class="qty-num">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="increaseQty(item)">+</button>
                </div>
                <!-- Remove item -->
                <button class="remove-btn" @click="removeItem(item)">REMOVE</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Cart View -->
        <div v-else class="cart-drawer__empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p class="empty-text">Your bag is empty.</p>
          <button class="btn btn-primary empty-shop-btn" @click="closeDrawer">CONTINUE SHOPPING</button>
        </div>

        <!-- Summary & Checkout -->
        <div v-if="cartItems.length > 0" class="cart-drawer__footer">
          <div class="cart-drawer__summary-row">
            <span class="summary-label">SUBTOTAL</span>
            <span class="summary-value">{{ currencySymbol }}{{ subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
          </div>
          <p class="shipping-notice">Shipping and taxes calculated at checkout.</p>
          <button class="btn btn-primary checkout-btn" @click="checkout">PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const cartDrawerOpen = useState('cartDrawerOpen', () => false)
const cartCount = useState('cartCount', () => 0)
const cartItems = useState('cartItems', () => [])

const { storeSettings, fetchStoreSettings } = useStoreSettings()

onMounted(fetchStoreSettings)

const currencySymbol = computed(() => {
  const c = storeSettings.value?.currency || 'NGN'
  if (c === 'NGN') return '₦'
  if (c === 'EUR') return '€'
  if (c === 'GBP') return '£'
  return '$'
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const closeDrawer = () => {
  cartDrawerOpen.value = false
}

const increaseQty = (item) => {
  item.quantity++
  cartCount.value++
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    cartCount.value--
  } else {
    removeItem(item)
  }
}

const removeItem = (item) => {
  cartCount.value -= item.quantity
  cartItems.value = cartItems.value.filter(i => i.id !== item.id)
  
  const triggerToast = useState('toastTrigger')
  if (triggerToast.value) {
    triggerToast.value(`Removed "${item.name}" from your bag.`)
  }
}

const checkout = () => {
  closeDrawer()
  navigateTo('/checkout')
}
</script>

<style scoped>
.cart-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: 440px;
  height: 100vh;
  background-color: var(--color-bg-light);
  z-index: 180;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
  transition: right 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
}

.cart-drawer--open {
  right: 0;
}

.cart-drawer__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 170;
}

.cart-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem;
}

/* Header */
.cart-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 1rem;
}

.cart-drawer__title {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-text-dark);
}

.cart-drawer__close {
  color: var(--color-text-dark);
  transition: var(--transition-fast);
}

.cart-drawer__close:hover {
  color: var(--color-accent);
}

/* Body (Items List) */
.cart-drawer__body {
  flex: 1;
  overflow-y: auto;
  margin-right: -1rem;
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-drawer__item {
  display: flex;
  gap: 1.25rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.cart-drawer__item-img {
  width: 80px;
  aspect-ratio: 3/4;
  object-fit: cover;
  background-color: #ebe7e0;
}

.cart-drawer__item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-drawer__item-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.cart-drawer__item-title {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  color: var(--color-text-dark);
}

.cart-drawer__item-price {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
}

.cart-drawer__item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
}

.qty-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--color-text-dark);
}

.qty-btn:hover {
  background-color: var(--color-bg-light);
}

.qty-num {
  padding: 0 0.5rem;
  font-size: 0.85rem;
  font-family: var(--font-sans);
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  font-size: 0.75rem;
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.remove-btn:hover {
  color: #c93b2b;
}

/* Empty view */
.cart-drawer__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  text-align: center;
}

.empty-icon {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.empty-text {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--color-text-muted);
}

.empty-shop-btn {
  width: 100%;
}

/* Footer & Summary */
.cart-drawer__footer {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-drawer__summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.summary-value {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 600;
}

.shipping-notice {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.checkout-btn {
  width: 100%;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .cart-drawer {
    width: 100vw;
  }
}
</style>
