<template>
  <div class="coll-page">

    <!-- ═══════════════════════════════════════════ -->
    <!-- HERO HEADER                                 -->
    <!-- ═══════════════════════════════════════════ -->
    <header class="coll-hero">
      <img src="/images/brand_bg.png" alt="EL. Kelvinero Collections" class="coll-hero__bg" />
      <div class="coll-hero__overlay"></div>
      <div class="coll-hero__content">
        <span class="coll-hero__eyebrow">THE EDITS</span>
        <h1 class="coll-hero__title">Our Collections</h1>
        <p class="coll-hero__sub">Thoughtfully curated lines representing the heights of timeless styling.</p>
      </div>
      <div class="img-logo-overlay img-logo-overlay--br">
        <img src="/logo.png" alt="EL. Kelvinero" />
      </div>
    </header>

    <!-- ═══════════════════════════════════════════ -->
    <!-- GENDER SWITCHER (MEN / WOMEN / KIDS)        -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="coll-gender-bar">
      <div class="container">
        <div class="gender-tabs">
          <button
            v-for="gender in genders"
            :key="gender"
            :class="['gender-tab', { 'gender-tab--active': activeGender === gender }]"
            @click="selectGender(gender)"
          >
            {{ gender }}
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- CATEGORY FILTER BAR                         -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="coll-category-bar">
      <div class="container">
        <div class="category-filters">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="['cat-btn', { 'cat-btn--active': activeCategory === cat }]"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="coll-count">
          {{ activeProducts.length }} ITEMS
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- PRODUCT GRID                                -->
    <!-- ═══════════════════════════════════════════ -->
    <main class="container coll-main">
      <transition-group name="fade" tag="div" class="product-grid">
        <div v-for="product in activeProducts" :key="product.id" class="product-card">
          <div class="product-card__image-container">
            <img :src="product.image" :alt="product.name" class="product-card__img" />

            <!-- Brand Logo watermark -->
            <div class="img-logo-overlay img-logo-overlay--br">
              <img src="/logo.png" alt="EL. Kelvinero" />
            </div>

            <!-- Category Tag -->
            <span class="product-card__tag">{{ product.category }}</span>

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

            <!-- Quick Add Overlay -->
            <div class="product-card__overlay">
              <button class="product-card__quick-add" @click="addToCart(product)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                QUICK ADD
              </button>
            </div>
          </div>

          <div class="product-card__details">
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
      </transition-group>

      <!-- Empty State -->
      <div v-if="activeProducts.length === 0" class="coll-empty">
        <p>No items found in this category.</p>
      </div>
    </main>

    <FooterFeatures />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

useHead({
  title: 'Our Collections | EL. Kelvinero',
  meta: [{ name: 'description', content: 'Explore Men, Women, and Kids collections from EL. Kelvinero.' }]
})

const cartCount = useState('cartCount')
const cartItems = useState('cartItems', () => [])
const toasts = useState('toasts', () => [])

// ─── Gender & Category State ─────────────────────
const genders = ['MEN', 'WOMEN', 'KIDS']
const categories = ['ALL', 'T-SHIRTS', 'HOODIES', 'SWEATSHIRTS', 'POLOS', 'JACKETS', 'PANTS', 'ACCESSORIES']

const activeGender = ref('MEN')
const activeCategory = ref('ALL')

const selectGender = (gender) => {
  activeGender.value = gender
  activeCategory.value = 'ALL'
}

// ─── Wishlist ─────────────────────────────────────
const wishlisted = ref([])
const toggleWishlist = (id) => {
  if (wishlisted.value.includes(id)) {
    wishlisted.value = wishlisted.value.filter(i => i !== id)
    showToast('Removed from wishlist.')
  } else {
    wishlisted.value.push(id)
    showToast('Added to wishlist ♥')
  }
}

const showToast = (message) => {
  toasts.value.push({ id: Date.now(), message })
}

// ─── Color helper ─────────────────────────────────
const getColorHex = (name) => {
  const map = {
    black: '#121212', white: '#f8f9fa', cream: '#ebe7e0',
    tan: '#d2b48c', grey: '#8e8e93', navy: '#1a233d',
    beige: '#e1d5c2', brown: '#5c4033', olive: '#556b2f',
    camel: '#c19a6b', khaki: '#c8b87a', 'dusty-rose': '#cca4a4',
    burgundy: '#7d1f2a', teal: '#3d7a7a', charcoal: '#3a3a3a'
  }
  return map[name.toLowerCase()] || '#cccccc'
}

// ─── Product Catalog (MEN + WOMEN + KIDS) ─────────
const products = ref([
  // ══════════════ MEN ══════════════
  { id: 'm-ts1', gender: 'MEN', category: 'T-SHIRTS', name: 'SIGNATURE TEE', price: 59, priceFormatted: '$59.00', image: '/images/product_tee.png', colors: ['black', 'cream', 'grey'] },
  { id: 'm-h1', gender: 'MEN', category: 'HOODIES', name: 'CLASSIC HOODIE', price: 89, priceFormatted: '$89.00', image: '/images/product_hoodie.png', colors: ['cream', 'black', 'brown'] },
  { id: 'm-sw1', gender: 'MEN', category: 'SWEATSHIRTS', name: 'MINIMAL CREWNECK SWEATSHIRT', price: 75, priceFormatted: '$75.00', image: '/images/product_sweatshirt.png', colors: ['grey', 'cream', 'navy'] },
  { id: 'm-p1', gender: 'MEN', category: 'POLOS', name: 'KNIT POLO', price: 89, priceFormatted: '$89.00', image: '/images/product_polo.png', colors: ['beige', 'navy', 'black'] },
  { id: 'm-pn1', gender: 'MEN', category: 'PANTS', name: 'CLASSIC CARGO PANTS', price: 99, priceFormatted: '$99.00', image: '/images/about_hero_model.png', colors: ['olive', 'black'] },
  { id: 'm-ac1', gender: 'MEN', category: 'ACCESSORIES', name: 'WOOL KNIT BEANIE', price: 35, priceFormatted: '$35.00', image: '/images/about_label_collar.png', colors: ['black', 'cream', 'grey'] },
  // ══════════════ WOMEN ══════════════
  { id: 'w-ts1', gender: 'WOMEN', category: 'T-SHIRTS', name: 'FITTED SIGNATURE TEE', price: 55, priceFormatted: '$55.00', image: '/images/product_tee.png', colors: ['white', 'black', 'dusty-rose'] },
  { id: 'w-h1', gender: 'WOMEN', category: 'HOODIES', name: 'RELAXED FIT HOODIE', price: 89, priceFormatted: '$89.00', image: '/images/product_hoodie.png', colors: ['cream', 'dusty-rose', 'grey'] },
  { id: 'w-sw1', gender: 'WOMEN', category: 'SWEATSHIRTS', name: 'OVERSIZED CREWNECK', price: 75, priceFormatted: '$75.00', image: '/images/product_sweatshirt.png', colors: ['grey', 'cream', 'burgundy'] },
  { id: 'w-p1', gender: 'WOMEN', category: 'POLOS', name: 'KNIT POLO SHIRT', price: 85, priceFormatted: '$85.00', image: '/images/product_polo.png', colors: ['beige', 'teal', 'black'] },
  { id: 'w-pn1', gender: 'WOMEN', category: 'PANTS', name: 'TAILORED WIDE-LEG TROUSERS', price: 99, priceFormatted: '$99.00', image: '/images/lookbook_lifestyle.png', colors: ['grey', 'black', 'tan'] },
  { id: 'w-ac1', gender: 'WOMEN', category: 'ACCESSORIES', name: 'MINIMAL HOBO BAG', price: 189, priceFormatted: '$189.00', image: '/images/brand_bg.png', colors: ['black', 'camel'] },
  // ══════════════ KIDS ══════════════
  { id: 'k-ts1', gender: 'KIDS', category: 'T-SHIRTS', name: 'MINI SIGNATURE TEE', price: 35, priceFormatted: '$35.00', image: '/images/product_tee.png', colors: ['black', 'white', 'grey'] },
  { id: 'k-h1', gender: 'KIDS', category: 'HOODIES', name: 'MINI SIGNATURE HOODIE', price: 59, priceFormatted: '$59.00', image: '/images/product_hoodie.png', colors: ['cream', 'black', 'grey'] },
  { id: 'k-sw1', gender: 'KIDS', category: 'SWEATSHIRTS', name: 'KIDS CREWNECK SWEATER', price: 49, priceFormatted: '$49.00', image: '/images/product_sweatshirt.png', colors: ['grey', 'beige', 'navy'] },
  { id: 'k-p1', gender: 'KIDS', category: 'POLOS', name: 'KIDS PIQUE POLO', price: 45, priceFormatted: '$45.00', image: '/images/product_polo.png', colors: ['white', 'navy', 'cream'] },
  { id: 'k-pn1', gender: 'KIDS', category: 'PANTS', name: 'KIDS ESSENTIAL JOGGERS', price: 49, priceFormatted: '$49.00', image: '/images/lookbook_lifestyle.png', colors: ['grey', 'black', 'beige'] },
  { id: 'k-ac1', gender: 'KIDS', category: 'ACCESSORIES', name: 'KIDS KNIT BEANIE', price: 25, priceFormatted: '$25.00', image: '/images/about_label_collar.png', colors: ['black', 'beige', 'grey'] }
])

const { storeSettings, fetchStoreSettings } = useStoreSettings()

const currencySymbol = computed(() => {
  const c = storeSettings.value?.currency || 'NGN'
  if (c === 'NGN') return '₦'
  if (c === 'EUR') return '€'
  if (c === 'GBP') return '£'
  return '$'
})

const mapCollectionProducts = (dataList) => {
  if (!Array.isArray(dataList) || dataList.length === 0) return null
  return dataList.map(p => {
    let colors = ['black']
    if (Array.isArray(p.color)) colors = p.color
    else if (typeof p.color === 'string' && p.color.startsWith('[')) {
      try { colors = JSON.parse(p.color) } catch {}
    }

    let gender = 'MEN'
    const collSlug = (p.collection?.slug || p.coll_slug || '').toLowerCase()
    const collName = (p.collection?.name || p.coll_name || '').toLowerCase()
    if (collSlug.includes('women') || collName.includes('women')) gender = 'WOMEN'
    else if (collSlug.includes('kid') || collName.includes('kid')) gender = 'KIDS'

    const priceVal = parseFloat(p.price)
    return {
      id: p.id,
      gender,
      category: (p.category?.name || p.cat_name || 'T-SHIRTS').toUpperCase(),
      name: p.name,
      price: priceVal,
      priceFormatted: `${currencySymbol.value}${priceVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      image: p.image || '/images/product_tee.png',
      colors
    }
  })
}

// Fetch live products during SSR and client render
const { data: liveCollData } = await useAsyncData('collectionPageProducts', () => $fetch('/api/v1/products'))

if (liveCollData.value) {
  const mapped = mapCollectionProducts(liveCollData.value)
  if (mapped) products.value = mapped
}

const fetchLiveCollProducts = async () => {
  try {
    await fetchStoreSettings()
    const data = await $fetch('/api/v1/products')
    const mapped = mapCollectionProducts(data)
    if (mapped) products.value = mapped
  } catch (err) {
    console.error('Failed to load collection products from API:', err)
  }
}

onMounted(fetchLiveCollProducts)

// ─── Active Swatches per product ─────────────────
const activeSwatches = ref({})
watch(products, (newProds) => {
  newProds.forEach(p => {
    if (!activeSwatches.value[p.id]) {
      activeSwatches.value[p.id] = p.colors?.[0] || 'black'
    }
  })
}, { immediate: true })

// ─── Filtered Products ────────────────────────────
const activeProducts = computed(() => {
  return products.value.filter(p => {
    const genderMatch = !p.gender || p.gender === activeGender.value
    const categoryMatch = activeCategory.value === 'ALL' || p.category === activeCategory.value
    return genderMatch && categoryMatch
  })
})


// ─── Add to Cart ─────────────────────────────────
const addToCart = (product) => {
  cartCount.value++
  const selectedColor = activeSwatches.value[product.id] || product.colors[0]
  const existing = cartItems.value.find(i => i.id === product.id && i.selectedColor === selectedColor)
  if (existing) {
    existing.quantity++
  } else {
    cartItems.value.push({ ...product, quantity: 1, selectedColor })
  }
  showToast(`"${product.name}" added to bag.`)
}
</script>

<style scoped>
.coll-page {
  background-color: var(--color-bg-light);
  min-height: 100vh;
}

/* ─── Hero ─────────────────────────────────────── */
.coll-hero {
  position: relative;
  height: 300px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}
.coll-hero__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}
.coll-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
}
.coll-hero__content {
  position: relative;
  z-index: 1;
  padding: 0 1.5rem;
}
.coll-hero__eyebrow {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  opacity: 0.8;
  display: block;
  margin-bottom: 0.75rem;
}
.coll-hero__title {
  font-family: var(--font-serif);
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400;
  margin-bottom: 0.5rem;
}
.coll-hero__sub {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  opacity: 0.85;
  max-width: 480px;
  margin: 0 auto;
}

/* Watermark */
.img-logo-overlay {
  position: absolute;
  width: 68px;
  opacity: 0.45;
  pointer-events: none;
  z-index: 3;
}
.img-logo-overlay img {
  width: 100%;
  height: auto;
  filter: brightness(0) invert(1);
}
.img-logo-overlay--br { bottom: 1rem; right: 1rem; }

/* ─── Gender Bar ───────────────────────────────── */
.coll-gender-bar {
  background: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.07);
}
.gender-tabs {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
}
.gender-tab {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 1.4rem 0.25rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  position: relative;
  transition: color 0.25s ease;
}
.gender-tab:hover { color: var(--color-text-dark); }
.gender-tab--active { color: var(--color-text-dark); }
.gender-tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-accent);
}

/* ─── Category Filter Bar ──────────────────────── */
.coll-category-bar {
  background: #faf9f7;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  position: sticky;
  top: calc(var(--header-height) + 36px);
  z-index: 20;
}
.coll-category-bar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0;
  padding-bottom: 0;
}
.category-filters {
  display: flex;
  gap: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.category-filters::-webkit-scrollbar { display: none; }
.cat-btn {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 1.1rem 1.25rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: color 0.2s ease;
}
.cat-btn:hover { color: var(--color-text-dark); }
.cat-btn--active {
  color: var(--color-text-dark);
  font-weight: 700;
}
.cat-btn--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-accent);
}
.coll-count {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  white-space: nowrap;
  padding: 0 0 0 1rem;
}

/* ─── Product Grid ─────────────────────────────── */
.coll-main {
  padding: 3rem var(--spacing-md) 6rem;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem 1.75rem;
}

/* Transition group animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.product-card {
  display: flex;
  flex-direction: column;
}
.product-card__image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: #ebe7e0;
}
.product-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}
.product-card:hover .product-card__img { transform: scale(1.05); }

/* Category Tag */
.product-card__tag {
  position: absolute;
  top: 0.85rem;
  left: 0.85rem;
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: rgba(255,255,255,0.92);
  color: var(--color-text-dark);
  padding: 0.25rem 0.6rem;
  z-index: 2;
  text-transform: uppercase;
}

/* Wishlist Heart */
.product-card__wishlist {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  background: #fff;
  color: var(--color-text-dark);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 3;
  transition: all 0.25s ease;
}
.product-card__wishlist:hover { transform: scale(1.1); }
.product-card__wishlist--active { background: #e25c5c !important; color: #fff !important; }

/* Hover Overlay & Quick Add */
.product-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}
.product-card:hover .product-card__overlay { opacity: 1; }
.product-card__quick-add {
  background: var(--color-text-dark);
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.7rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--color-text-dark);
  cursor: pointer;
  transform: translateY(10px);
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
}
.product-card__quick-add:hover { background: #fff; color: var(--color-text-dark); }
.product-card:hover .product-card__quick-add { transform: translateY(0); }

/* Card details */
.product-card__details { padding-top: 1.1rem; text-align: center; }
.product-card__swatches { display: flex; justify-content: center; gap: 0.4rem; margin-bottom: 0.6rem; }
.swatch {
  width: 13px; height: 13px; border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.12);
  cursor: pointer; position: relative;
  transition: all 0.2s ease;
}
.swatch--active::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1.5px solid var(--color-text-dark);
  border-radius: 50%;
}
.product-card__title {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-dark);
  margin-bottom: 0.3rem;
}
.product-card__price {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  color: var(--color-accent);
  font-weight: 500;
}

/* Empty State */
.coll-empty {
  text-align: center;
  padding: 5rem 0;
  font-family: var(--font-sans);
  color: var(--color-text-muted);
  font-size: 0.92rem;
  letter-spacing: 0.05em;
}

/* ─── Responsive ───────────────────────────────── */

/* Tablet */
@media (max-width: 1100px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem 1.25rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .coll-main {
    padding: 2rem 0 4rem;
  }

  .gender-tabs {
    gap: 0;
  }

  .gender-tab {
    font-size: 0.72rem;
    padding: 1rem 0.5rem;
    flex: 1;
    text-align: center;
  }

  .coll-category-bar {
    padding: 0.75rem 0;
  }

  .category-filters {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 4px;
    gap: 0;
  }
  .category-filters::-webkit-scrollbar { display: none; }

  .cat-btn {
    white-space: nowrap;
    flex-shrink: 0;
    padding: 0.85rem 1rem;
    font-size: 0.64rem;
  }

  .coll-count {
    display: none;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem 0.85rem;
  }

  .product-card__overlay {
    opacity: 1;
  }

  .product-card__quick-add {
    transform: translateY(0);
    font-size: 0.6rem;
    padding: 0.6rem 0.85rem;
    letter-spacing: 0.06em;
  }

  .product-card__title {
    font-size: 0.88rem;
  }

  .product-card__price {
    font-size: 0.78rem;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 0.65rem;
  }

  .product-card__title {
    font-size: 0.78rem;
    letter-spacing: 0.02em;
  }

  .product-card__price {
    font-size: 0.7rem;
  }

  .product-card__quick-add {
    font-size: 0.55rem;
    padding: 0.5rem 0.6rem;
  }

  .product-card__details {
    padding-top: 0.75rem;
  }

  .img-logo-overlay {
    width: 36px;
  }
}
</style>
