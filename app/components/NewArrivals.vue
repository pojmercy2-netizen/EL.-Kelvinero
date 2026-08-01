<template>
  <section id="shop" class="new-arrivals section-padding">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">NEW ARRIVALS</h2>
        <NuxtLink to="/shop" class="section-link hover-underline">
          VIEW ALL
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </NuxtLink>
      </div>
      
      <!-- Product Grid (Always displays 8 items) -->
      <div class="product-grid">
        <div v-for="product in displayProducts" :key="product.id" class="product-card">
          <div class="product-card__image-container">
            <img :src="product.image" :alt="product.name" class="product-card__img" />
            
            <!-- Logo printed on the chest of the shirt/clothing -->
            <div v-if="product.logoColor" :class="['product-card__chest-logo', 'product-card__chest-logo--' + product.logoColor]">
              <img src="/logo.png" alt="EL. Kelvinero Logo" />
            </div>

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
            <h3 class="product-card__title">{{ product.name }}</h3>
            <p class="product-card__price">{{ product.priceFormatted }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const cartCount = useState('cartCount', () => 0)
const cartItems = useState('cartItems', () => [])
const { storeSettings } = useStoreSettings()

const currencySymbol = computed(() => storeSettings.value.currency === 'NGN' ? '₦' : '$')

// Initial fallback set of 8 products representing all shop categories
const defaultProducts = [
  { id: 'p1', name: 'SIGNATURE TEE', price: 59.00, image: '/images/product_tee.png', logoColor: 'light' },
  { id: 'p2', name: 'CLASSIC HOODIE', price: 89.00, image: '/images/product_hoodie.png', logoColor: 'dark' },
  { id: 'p3', name: 'OVERSIZE SWEATSHIRT', price: 79.00, image: '/images/product_sweatshirt.png', logoColor: 'light' },
  { id: 'p4', name: 'KNIT POLO', price: 89.00, image: '/images/product_polo.png', logoColor: 'dark' },
  { id: 'p5', name: 'HERITAGE JACKET', price: 120.00, image: '/images/about_heritage.png', logoColor: 'light' },
  { id: 'p6', name: 'EDITORIAL COAT', price: 140.00, image: '/images/lookbook_editorial_1.png', logoColor: 'dark' },
  { id: 'p7', name: 'REFINED SWEATSHIRT', price: 85.00, image: '/images/lookbook_editorial_2.png', logoColor: 'light' },
  { id: 'p8', name: 'ESSENTIAL HOODIE', price: 95.00, image: '/images/lookbook_editorial_3.png', logoColor: 'dark' }
]

const liveProducts = ref([])

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  price: parseFloat(p.price),
  priceFormatted: `${currencySymbol.value}${parseFloat(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
  image: p.image || '/images/product_tee.png',
  logoColor: p.logoColor || 'light'
})

// Async data fetch on server & client
const { data: fetchedProductsData } = await useAsyncData('homeNewArrivalsData', () => $fetch('/api/v1/products'))

if (fetchedProductsData.value && fetchedProductsData.value.length > 0) {
  liveProducts.value = fetchedProductsData.value.map(mapProduct)
}

const loadLiveProducts = async () => {
  try {
    const data = await $fetch('/api/v1/products')
    if (data && data.length > 0) {
      liveProducts.value = data.map(mapProduct)
    }
  } catch (err) {
    console.error('Failed to load home new arrivals:', err)
  }
}

onMounted(loadLiveProducts)

// Computed list always displaying 8 items
const displayProducts = computed(() => {
  let list = liveProducts.value.length > 0 ? liveProducts.value : defaultProducts.map(mapProduct)
  // If backend returns fewer than 8 products, pad with default items to ensure 8 items display
  if (list.length < 8) {
    const pad = defaultProducts.slice(list.length, 8).map(mapProduct)
    list = [...list, ...pad]
  }
  return list.slice(0, 8)
})

const addToCart = (product) => {
  cartCount.value++
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1
    })
  }

  const toasts = useState('toasts', () => [])
  toasts.value.push({
    id: Date.now(),
    message: `Added "${product.name}" to your bag.`
  })
}
</script>

<style scoped>
.new-arrivals {
  background-color: var(--color-bg-light);
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.section-link:hover .arrow-icon {
  transform: translateX(6px);
}

/* Product Grid (4 items per row on desktop) */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem 2rem;
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

.product-card__chest-logo {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
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
  transform: translate(-50%, -50%) scale(1.06);
}

.product-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.product-card:hover .product-card__img {
  transform: scale(1.06);
}

.product-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2rem;
  opacity: 0;
  transition: var(--transition-smooth);
}

.product-card:hover .product-card__overlay {
  opacity: 1;
}

.product-card__quick-add {
  background-color: var(--color-text-dark);
  color: var(--color-text-light);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 0.85rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(15px);
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
  margin-top: -2px;
}

/* Details */
.product-card__details {
  padding-top: 1.25rem;
  text-align: center;
}

.product-card__title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
  color: var(--color-text-dark);
  text-transform: uppercase;
}

.product-card__price {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-accent);
  font-weight: 500;
}

/* Responsive Grid */
@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem 1.25rem;
  }
  
  .product-card__overlay {
    opacity: 1;
    background-color: transparent;
    pointer-events: auto;
  }
  
  .product-card__quick-add {
    transform: translateY(0);
    padding: 0.75rem 1.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 576px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 0.75rem;
  }

  .product-card__title {
    font-size: 0.85rem;
  }

  .product-card__price {
    font-size: 0.78rem;
  }

  .product-card__quick-add {
    font-size: 0.6rem;
    padding: 0.6rem 0.85rem;
  }
}
</style>
