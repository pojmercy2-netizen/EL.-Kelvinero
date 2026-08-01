<template>
  <div class="shop-page">

    <!-- ═══════════════════════════════════════════ -->
    <!-- HERO HEADER                                 -->
    <!-- ═══════════════════════════════════════════ -->
    <header class="shop-hero">
      <img src="/images/shop_hero_banner.png" alt="EL. Kelvinero Shop Banner" class="shop-hero__bg" />
      <div class="shop-hero__overlay"></div>
      <div class="shop-hero__content">
        <h1 class="shop-hero__title">The Shop</h1>
        <p class="shop-hero__sub">Elevated essentials designed for the modern wardrobe.</p>
      </div>
      <!-- Logo watermark overlay -->
      <div class="img-logo-overlay img-logo-overlay--br">
        <img src="/logo.png" alt="EL. Kelvinero" />
      </div>
    </header>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SHOP BODY & INTERACTIVE GRID                -->
    <!-- ═══════════════════════════════════════════ -->
    <main class="container shop-main">
      
      <!-- Filters and Toolbar -->
      <div class="shop-toolbar">
        <!-- Categories (Left) -->
        <div class="shop-filters__categories">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="['shop-filter-btn', { 'shop-filter-btn--active': activeCategory === cat }]"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Sorting (Right) -->
        <div class="shop-sort">
          <label for="sort-select" class="shop-sort__label">SORT BY</label>
          <select id="sort-select" v-model="sortBy" class="shop-sort__select">
            <option value="featured">FEATURED</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Summary -->
      <div class="shop-active-filters" v-if="activeCategory !== 'ALL'">
        <span class="shop-active-tag">
          {{ activeCategory }}
          <button class="shop-active-tag__close" @click="activeCategory = 'ALL'">&times;</button>
        </span>
        <button class="shop-clear-all" @click="activeCategory = 'ALL'">Clear All</button>
      </div>

      <!-- Product Count -->
      <p class="shop-results-count">Showing {{ filteredProducts.length }} products</p>

      <!-- Products Grid -->
      <div class="product-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="product-card__image-container">
            <img :src="product.image" :alt="product.name" class="product-card__img" />
            
            <!-- Chest Logo (Only for products carrying chest branding) -->
            <div
              v-if="product.logoColor"
              :class="['product-card__chest-logo', 'product-card__chest-logo--' + product.logoColor]"
            >
              <img src="/logo.png" alt="EL. Kelvinero Logo" />
            </div>

            <!-- Heart Wishlist Toggle -->
            <button
              class="product-card__wishlist"
              :class="{ 'product-card__wishlist--active': wishlisted.includes(product.id) }"
              @click="toggleWishlist(product.id)"
              aria-label="Add to Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            <!-- Quick Add Button -->
            <div class="product-card__overlay">
              <button class="product-card__quick-add" @click="addToCart(product)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="quick-add-icon">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                QUICK ADD
              </button>
            </div>
          </div>
          
          <div class="product-card__details">
            <!-- Swatches (Static visual decoration / Interactive switcher) -->
            <div class="product-card__swatches">
              <span
                v-for="color in product.colors"
                :key="color"
                :class="['swatch', { 'swatch--active': activeSwatches[product.id] === color }]"
                :style="{ backgroundColor: getColorHex(color) }"
                @click="activeSwatches[product.id] = color"
              ></span>
            </div>

            <h3 class="product-card__title">{{ product.name }}</h3>
            <p class="product-card__price">{{ product.priceFormatted }}</p>
          </div>
        </div>
      </div>

    </main>

    <!-- Footer feature pillars -->
    <FooterFeatures />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

useHead({
  title: 'Shop All | EL. Kelvinero',
  meta: [{ name: 'description', content: 'Shop the premium timeless essentials from EL. Kelvinero.' }]
})

const cartCount = useState('cartCount')
const cartItems = useState('cartItems', () => [])
const toasts = useState('toasts', () => [])

const categories = ['ALL', 'T-SHIRTS', 'HOODIES', 'SWEATSHIRTS', 'POLOS', 'JACKETS', 'PANTS', 'ACCESSORIES']
const activeCategory = ref('ALL')
const sortBy = ref('featured')

// Track wishlist items
const wishlisted = ref([])
const toggleWishlist = (id) => {
  if (wishlisted.value.includes(id)) {
    wishlisted.value = wishlisted.value.filter(item => item !== id)
    showToast('Removed from wishlist.')
  } else {
    wishlisted.value.push(id)
    showToast('Added to wishlist.')
  }
}

const showToast = (message) => {
  toasts.value.push({
    id: Date.now(),
    message
  })
}

// Color switcher hex values
const getColorHex = (name) => {
  const colors = {
    'black': '#121212',
    'white': '#f8f9fa',
    'cream': '#ebe7e0',
    'tan': '#d2b48c',
    'grey': '#8e8e93',
    'navy': '#1a233d',
    'beige': '#e1d5c2',
    'brown': '#5c4033',
    'olive': '#556b2f',
    'camel': '#c19a6b'
  }
  return colors[name.toLowerCase()] || '#cccccc'
}

// Products list - initially empty, filled from live API
const products = ref([
  { id: 1, name: 'SIGNATURE TEE', category: 'T-SHIRTS', price: 59.00, priceFormatted: '$59.00', image: '/images/product_tee.png', colors: ['black', 'cream', 'grey'] },
  { id: 2, name: 'CLASSIC HOODIE', category: 'HOODIES', price: 89.00, priceFormatted: '$89.00', image: '/images/product_hoodie.png', colors: ['cream', 'black', 'brown'] },
  { id: 3, name: 'OVERSIZE SWEATSHIRT', category: 'HOODIES', price: 79.00, priceFormatted: '$79.00', image: '/images/product_sweatshirt.png', colors: ['black', 'grey', 'white'] },
  { id: 4, name: 'KNIT POLO', category: 'POLOS', price: 89.00, priceFormatted: '$89.00', image: '/images/product_polo.png', colors: ['beige', 'navy', 'black'] },
  { id: 5, name: 'HERITAGE TEE', category: 'T-SHIRTS', price: 65.00, priceFormatted: '$65.00', image: '/images/about_hero_model.png', colors: ['cream', 'white'] },
  { id: 6, name: 'CLASSIC UTILITY JACKET', category: 'JACKETS', price: 149.00, priceFormatted: '$149.00', image: '/images/brand_bg.png', colors: ['black', 'brown'] },
  { id: 7, name: 'BOMBER JACKET', category: 'JACKETS', price: 169.00, priceFormatted: '$169.00', image: '/images/hero_model.png', colors: ['navy', 'black'] },
  { id: 8, name: 'ESSENTIAL SWEATPANTS', category: 'PANTS', price: 79.00, priceFormatted: '$79.00', image: '/images/lookbook_lifestyle.png', colors: ['grey', 'black', 'beige'] }
])

const { storeSettings, fetchStoreSettings } = useStoreSettings()

const currencySymbol = computed(() => {
  const c = storeSettings.value?.currency || 'NGN'
  if (c === 'NGN') return '₦'
  if (c === 'EUR') return '€'
  if (c === 'GBP') return '£'
  return '$'
})

const mapProductData = (dataList) => {
  if (!Array.isArray(dataList) || dataList.length === 0) return null
  return dataList.map(p => {
    let parsedColors = ['black']
    if (Array.isArray(p.color)) parsedColors = p.color
    else if (typeof p.color === 'string' && p.color.startsWith('[')) {
      try { parsedColors = JSON.parse(p.color) } catch {}
    }
    const priceVal = parseFloat(p.price)
    return {
      id: p.id,
      name: p.name,
      category: (p.category?.name || p.cat_name || 'T-SHIRTS').toUpperCase(),
      price: priceVal,
      priceFormatted: `${currencySymbol.value}${priceVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      image: p.image || '/logo.png',
      colors: parsedColors
    }
  })
}

// Fetch live products during SSR and client render
const { data: liveProductsData } = await useAsyncData('shopProductsData', () => $fetch('/api/v1/products'))

if (liveProductsData.value) {
  const mapped = mapProductData(liveProductsData.value)
  if (mapped) products.value = mapped
}

const fetchLiveProducts = async () => {
  try {
    await fetchStoreSettings()
    const data = await $fetch('/api/v1/products')
    const mapped = mapProductData(data)
    if (mapped) products.value = mapped
  } catch (err) {
    console.error('Failed to load products from API:', err)
  }
}

onMounted(fetchLiveProducts)

// Swatch selection - reactive to products
const activeSwatches = ref({})
watch(products, (newProds) => {
  newProds.forEach(p => {
    if (!activeSwatches.value[p.id]) {
      activeSwatches.value[p.id] = p.colors?.[0] || 'black'
    }
  })
}, { immediate: true })

// Computed filtered products
const filteredProducts = computed(() => {
  let list = [...products.value]

  // Filter category
  if (activeCategory.value !== 'ALL') {
    list = list.filter(p => p.category === activeCategory.value)
  }

  // Sorting
  if (sortBy.value === 'price-low') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    list.sort((a, b) => b.price - a.price)
  }

  return list
})

const addToCart = (product) => {
  cartCount.value++
  
  const selectedColor = activeSwatches.value[product.id] || product.colors[0]
  
  const existingItem = cartItems.value.find(item => item.id === product.id && item.selectedColor === selectedColor)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1,
      selectedColor
    })
  }

  showToast(`Added "${product.name}" (${selectedColor.toUpperCase()}) to bag.`)
}
</script>

<style scoped>
.shop-page {
  background-color: var(--color-bg-light);
  min-height: 100vh;
}

/* ─── Hero Header ─────────────────────────────── */
.shop-hero {
  position: relative;
  height: 280px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
}

.shop-hero__bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.shop-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.shop-hero__content {
  position: relative;
  z-index: 1;
  padding: 0 1.5rem;
}

.shop-hero__title {
  font-family: var(--font-serif);
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.shop-hero__sub {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  opacity: 0.85;
  letter-spacing: 0.05em;
  max-width: 480px;
  margin: 0 auto;
}

/* Watermark */
.img-logo-overlay {
  position: absolute;
  width: 70px;
  opacity: 0.45;
  pointer-events: none;
  z-index: 2;
}

.img-logo-overlay img {
  width: 100%;
  height: auto;
  filter: brightness(0) invert(1);
}

.img-logo-overlay--br {
  bottom: 1rem;
  right: 1rem;
}

/* ─── Toolbar and Filters ──────────────────────── */
.shop-main {
  padding: 3rem var(--spacing-md) 5rem;
}

.shop-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  gap: 1.5rem;
}

.shop-filters__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.shop-filter-btn {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  padding: 0.5rem 1.25rem;
  background-color: transparent;
  color: var(--color-text-muted);
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.25s ease;
  text-transform: uppercase;
}

.shop-filter-btn:hover {
  color: var(--color-text-dark);
  border-color: rgba(0, 0, 0, 0.2);
}

.shop-filter-btn--active {
  background-color: var(--color-text-dark);
  color: #ffffff;
  border-color: var(--color-text-dark);
}

.shop-sort {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.shop-sort__label {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
}

.shop-sort__select {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.5rem 1.5rem 0.5rem 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  color: var(--color-text-dark);
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  border-radius: 0;
}

/* Active Tags */
.shop-active-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: -1rem;
  margin-bottom: 2rem;
}

.shop-active-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  background-color: #f0f0f0;
  color: var(--color-text-dark);
  padding: 0.35rem 0.75rem;
  text-transform: uppercase;
}

.shop-active-tag__close {
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  margin-top: -1px;
}

.shop-clear-all {
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-decoration: underline;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0;
}

.shop-clear-all:hover {
  color: var(--color-text-dark);
}

.shop-results-count {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

/* ─── Product Card & Grid ──────────────────────── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem 2rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  transition: var(--transition-smooth);
}

.product-card__image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background-color: #ebe7e0;
}

.product-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.product-card:hover .product-card__img {
  transform: scale(1.05);
}

/* Chest Logo style */
.product-card__chest-logo {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  opacity: 0.65;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.product-card__chest-logo img {
  width: 100%;
  height: auto;
  display: block;
}

.product-card__chest-logo--dark img {
  filter: brightness(0);
}

.product-card__chest-logo--light img {
  filter: brightness(0) invert(1);
}

.product-card:hover .product-card__chest-logo {
  transform: translate(-50%, -50%) scale(1.05);
}

/* Wishlist Heart Toggle */
.product-card__wishlist {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #ffffff;
  color: var(--color-text-dark);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  z-index: 3;
  transition: all 0.25s ease;
}

.product-card__wishlist:hover {
  transform: scale(1.1);
}

.product-card__wishlist--active {
  background-color: #e25c5c !important;
  color: #ffffff !important;
}

/* Overlay & Quick Add */
.product-card__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1.5rem;
  opacity: 0;
  transition: var(--transition-smooth);
  z-index: 2;
}

.product-card:hover .product-card__overlay {
  opacity: 1;
}

.product-card__quick-add {
  background-color: var(--color-text-dark);
  color: var(--color-text-light);
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(12px);
  transition: var(--transition-smooth);
  border: 1px solid var(--color-text-dark);
  cursor: pointer;
}

.product-card__quick-add:hover {
  background-color: var(--color-text-light);
  color: var(--color-text-dark);
}

.product-card:hover .product-card__quick-add {
  transform: translateY(0);
}

.quick-add-icon {
  margin-top: -1px;
}

/* Card details & Swatches */
.product-card__details {
  padding-top: 1.25rem;
  text-align: center;
}

.product-card__swatches {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.swatch--active::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1px solid var(--color-text-dark);
  border-radius: 50%;
}

.product-card__title {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  margin-bottom: 0.3rem;
  color: var(--color-text-dark);
  text-transform: uppercase;
}

.product-card__price {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  color: var(--color-accent);
  font-weight: 500;
}

/* ─── Responsive ──────────────────────────────── */

/* Tablet */
@media (max-width: 992px) {
  .shop-hero {
    height: 260px;
  }

  .shop-hero__title {
    font-size: 2.4rem;
  }

  .shop-hero__sub {
    font-size: 0.82rem;
  }

  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem 1.5rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .shop-hero {
    height: 210px;
  }

  .shop-hero__title {
    font-size: 1.9rem;
    margin-bottom: 0.35rem;
  }

  .shop-hero__sub {
    font-size: 0.75rem;
    max-width: 300px;
  }

  .shop-main {
    padding: 2rem 0 4rem;
  }

  .shop-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.85rem;
    padding-bottom: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .shop-filters__categories {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 4px;
  }
  .shop-filters__categories::-webkit-scrollbar { display: none; }

  .shop-filter-btn {
    white-space: nowrap;
    flex-shrink: 0;
    font-size: 0.65rem;
    padding: 0.45rem 0.9rem;
  }

  .shop-sort {
    align-self: flex-end;
    border-top: 1px solid rgba(0,0,0,0.06);
    padding-top: 0.75rem;
    width: 100%;
    justify-content: space-between;
  }

  .shop-sort__select {
    flex: 1;
    margin-left: 0.5rem;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem 0.85rem;
  }

  .product-card__overlay {
    opacity: 1;
    background-color: transparent;
  }

  .product-card__quick-add {
    transform: translateY(0);
    padding: 0.6rem 0.85rem;
    font-size: 0.62rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  .product-card__title {
    font-size: 0.88rem;
    letter-spacing: 0.03em;
  }

  .product-card__price {
    font-size: 0.78rem;
  }

  .shop-results-count {
    font-size: 0.72rem;
    margin-bottom: 1rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .shop-hero {
    height: 175px;
  }

  .shop-hero__title {
    font-size: 1.55rem;
  }

  .shop-hero__sub {
    font-size: 0.7rem;
    max-width: 240px;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 0.65rem;
  }

  .product-card__title {
    font-size: 0.8rem;
  }

  .product-card__price {
    font-size: 0.72rem;
  }

  .product-card__quick-add {
    font-size: 0.58rem;
    padding: 0.55rem 0.65rem;
    letter-spacing: 0.05em;
  }

  .img-logo-overlay {
    width: 40px;
  }
}
</style>
