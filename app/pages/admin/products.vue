<template>
  <div class="admin-products">
    <!-- Header -->
    <div class="products-header animate-fade-in">
      <div>
        <h1 class="page-title">Catalog Inventory</h1>
        <p class="page-subtitle">Manage store products, pricing, categories and stock levels.</p>
      </div>
      <button class="btn-primary-admin" @click="openAddModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ADD NEW PRODUCT
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar animate-fade-in">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Search catalog by name, category..." class="search-input" />
      </div>

      <div class="filter-dropdowns">
        <select v-model="selectedCategory" class="filter-select">
          <option value="ALL">ALL CATEGORIES</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select v-model="selectedStockFilter" class="filter-select">
          <option value="ALL">ALL STOCK STATUS</option>
          <option value="IN_STOCK">IN STOCK</option>
          <option value="LOW_STOCK">LOW STOCK</option>
          <option value="OUT_OF_STOCK">OUT OF STOCK</option>
        </select>
      </div>
    </div>

    <!-- Products Table -->
    <div class="admin-card animate-fade-in">
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>PRODUCT NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>STATUS</th>
              <th>SALES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="8" class="text-center-cell">No products found matching the criteria.</td>
            </tr>
            <tr v-for="product in filteredProducts" :key="product.id" class="table-row">
              <td>
                <div class="product-thumb">
                  <img :src="product.image || '/images/product_tee.png'" :alt="product.name" />
                </div>
              </td>
              <td>
                <div class="product-info-cell">
                  <span class="product-name">{{ product.name }}</span>
                  <div class="product-colors-preview">
                    <span
                      v-for="color in product.colors"
                      :key="color"
                      class="color-dot"
                      :style="{ backgroundColor: getColorHex(color) }"
                      :title="color"
                    ></span>
                  </div>
                </div>
              </td>
              <td class="text-upper font-mono">{{ product.category }}</td>
              <td class="font-semibold text-white">${{ product.price.toFixed(2) }}</td>
              <td class="font-mono text-center-nums">{{ product.stock }} pcs</td>
              <td>
                <span :class="['badge-stock', getStockBadgeClass(product.stock)]">
                  {{ getStockStatusLabel(product.stock) }}
                </span>
              </td>
              <td class="font-mono text-center-nums">{{ product.salesCount || 0 }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action btn-edit" @click="editProduct(product)" title="Edit Item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="btn-action btn-delete" @click="confirmDelete(product)" title="Delete Item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Drawer Modal Overlay -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="drawer-modal animate-slide-in">
        <div class="drawer-header">
          <h2 class="drawer-title">{{ isEditing ? 'Edit Product Details' : 'Add New Catalogue Product' }}</h2>
          <button class="btn-close" @click="closeModal">&times;</button>
        </div>

        <form @submit.prevent="saveProduct" class="drawer-form">
          <div class="form-group">
            <label class="form-label">PRODUCT NAME</label>
            <input v-model="form.name" type="text" class="form-input" required placeholder="e.g. ULTRA CARGO PANTS" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">CATEGORY</label>
              <select v-model="form.category" class="form-input" required>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">PRICE ($)</label>
              <input v-model.number="form.price" type="number" step="0.01" min="0" class="form-input" required placeholder="89.00" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">STOCK QTY</label>
              <input v-model.number="form.stock" type="number" min="0" class="form-input" required placeholder="25" />
            </div>
            <div class="form-group">
              <label class="form-label">IMAGE URL</label>
              <input v-model="form.image" type="text" class="form-input" placeholder="/images/product_tee.png" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">COLORS AVAILABLE (Comma separated)</label>
            <input v-model="form.colorsInput" type="text" class="form-input" placeholder="black, cream, grey" />
            <p class="input-tip">Supported values: black, white, cream, tan, grey, navy, beige, brown, olive, camel</p>
          </div>

          <div class="drawer-footer">
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-save">
              {{ isEditing ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModalOpen" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="confirm-modal">
        <h3 class="confirm-title">Delete Product?</h3>
        <p class="confirm-desc">Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong>? This action cannot be undone.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="closeDeleteModal">Keep Item</button>
          <button class="btn-danger" @click="deleteProduct">Confirm Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Manage Products | EL. Kelvinero Admin',
  meta: [{ name: 'description', content: 'Catalogue inventory and stock management console.' }]
})

const adminToken = useCookie('adminToken')
const rawProducts = ref([])
const loading = ref(true)

const fetchProducts = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/v1/products')
    rawProducts.value = data || []
  } catch (err) {
    console.error('Failed to fetch admin products:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const adminProducts = computed(() => {
  return rawProducts.value.map(p => ({
    id: p.id,
    name: p.name,
    category: (p.cat_name || 'T-SHIRTS').toUpperCase(),
    price: parseFloat(p.price),
    stock: p.stock || 0,
    image: p.image || '/images/product_tee.png',
    colors: Array.isArray(p.color) ? p.color : (typeof p.color === 'string' && p.color.startsWith('[') ? JSON.parse(p.color) : ['black']),
    salesCount: 0,
    revenue: 0
  }))
})

const categories = ['T-SHIRTS', 'HOODIES', 'SWEATSHIRTS', 'POLOS', 'JACKETS', 'PANTS', 'ACCESSORIES']

// Search and filters
const searchQuery = ref('')
const selectedCategory = ref('ALL')
const selectedStockFilter = ref('ALL')

// Modals
const modalOpen = ref(false)
const isEditing = ref(false)
const deleteModalOpen = ref(false)
const productToDelete = ref(null)

// Forms
const form = ref({
  id: '',
  name: '',
  category: 'T-SHIRTS',
  price: 0,
  stock: 0,
  image: '',
  colorsInput: ''
})

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

// Stock states helper
const getStockStatusLabel = (stock) => {
  if (stock === 0) return 'OUT OF STOCK'
  if (stock <= 10) return 'LOW STOCK'
  return 'IN STOCK'
}

const getStockBadgeClass = (stock) => {
  if (stock === 0) return 'stock-out'
  if (stock <= 10) return 'stock-low'
  return 'stock-in'
}

// Computed Filtered List
const filteredProducts = computed(() => {
  return adminProducts.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'ALL' || p.category === selectedCategory.value

    let matchesStock = true
    if (selectedStockFilter.value === 'OUT_OF_STOCK') matchesStock = p.stock === 0
    else if (selectedStockFilter.value === 'LOW_STOCK') matchesStock = p.stock > 0 && p.stock <= 10
    else if (selectedStockFilter.value === 'IN_STOCK') matchesStock = p.stock > 10

    return matchesSearch && matchesCategory && matchesStock
  })
})

// Add/Edit Actions
const openAddModal = () => {
  isEditing.value = false
  form.value = {
    id: '',
    name: '',
    category: 'T-SHIRTS',
    price: 59.00,
    stock: 20,
    image: '',
    colorsInput: 'black, white, cream'
  }
  modalOpen.value = true
}

const editProduct = (product) => {
  isEditing.value = true
  form.value = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    image: product.image,
    colorsInput: product.colors ? product.colors.join(', ') : ''
  }
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
}

const saving = ref(false)

const saveProduct = async () => {
  if (saving.value) return
  saving.value = true

  const finalColors = form.value.colorsInput
    ? form.value.colorsInput.split(',').map(c => c.trim().toLowerCase()).filter(Boolean)
    : ['black']

  const payload = {
    name: form.value.name.toUpperCase(),
    category: form.value.category,
    price: Number(form.value.price),
    stock: Number(form.value.stock),
    image: form.value.image || '/images/product_tee.png',
    color: finalColors
  }

  try {
    if (isEditing.value && form.value.id) {
      await $fetch(`/api/v1/products/${form.value.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken.value}` },
        body: payload
      })
    } else {
      await $fetch('/api/v1/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken.value}` },
        body: payload
      })
    }
    await fetchProducts()
    closeModal()
  } catch (err) {
    console.error('Failed to save product:', err)
    alert(err?.data?.message || err?.message || 'Failed to save product. Make sure you are logged in as admin.')
  } finally {
    saving.value = false
  }
}

// Delete Actions
const confirmDelete = (product) => {
  productToDelete.value = product
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
  productToDelete.value = null
}

const deleteProduct = async () => {
  if (productToDelete.value) {
    try {
      await $fetch(`/api/v1/products/${productToDelete.value.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken.value}` }
      })
      await fetchProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }
  closeDeleteModal()
}
</script>

<style scoped>
.admin-products {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.page-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.btn-primary-admin {
  background-color: #b89874;
  color: #000000;
  border: none;
  padding: 0.65rem 1.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 2px;
}

.btn-primary-admin:hover {
  background-color: #ffffff;
}

/* Filters Bar */
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.3);
}

.search-input {
  width: 100%;
  background-color: #141414;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #ffffff;
  padding: 0.55rem 1rem 0.55rem 2.5rem;
  font-size: 0.8rem;
  outline: none;
  border-radius: 2px;
  transition: all 0.25s ease;
}

.search-input:focus {
  border-color: rgba(184, 152, 116, 0.4);
  background-color: #161616;
}

.filter-dropdowns {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  background-color: #141414;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #ffffff;
  padding: 0.55rem 1.5rem 0.55rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  border-radius: 2px;
}

/* Table overrides/specifics */
.text-center-cell {
  text-align: center;
  padding: 3rem 0 !important;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.product-thumb {
  width: 38px;
  height: 48px;
  background-color: #242424;
  overflow: hidden;
  border-radius: 1px;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info-cell {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.product-name {
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.product-colors-preview {
  display: flex;
  gap: 0.25rem;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.text-upper {
  text-transform: uppercase;
}

.text-center-nums {
  font-variant-numeric: tabular-nums;
}

/* Stock Badges */
.badge-stock {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  display: inline-block;
}

.stock-in {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.stock-low {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.stock-out {
  background-color: rgba(226, 92, 92, 0.1);
  color: #e25c5c;
  border: 1px solid rgba(226, 92, 92, 0.25);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 28px;
  height: 28px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background-color: rgba(184, 152, 116, 0.1);
  color: #b89874;
  border-color: rgba(184, 152, 116, 0.3);
}

.btn-delete:hover {
  background-color: rgba(226, 92, 92, 0.1);
  color: #e25c5c;
  border-color: rgba(226, 92, 92, 0.3);
}

/* Modals & Drawers */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.drawer-modal {
  width: 100%;
  max-width: 460px;
  height: 100vh;
  background-color: #111111;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.btn-close {
  font-size: 1.75rem;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  line-height: 1;
}

.btn-close:hover {
  color: #ffffff;
}

.drawer-form {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
}

.form-input {
  background-color: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  padding: 0.75rem 1rem;
  font-size: 0.82rem;
  outline: none;
  border-radius: 2px;
  transition: all 0.25s ease;
}

.form-input:focus {
  border-color: rgba(184, 152, 116, 0.4);
  background-color: #1c1c1c;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-tip {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1.4;
}

.drawer-footer {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.5rem 0 0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  padding: 0.65rem 1.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
}

.btn-cancel:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.btn-save {
  background-color: #b89874;
  color: #000000;
  border: none;
  padding: 0.65rem 1.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
}

.btn-save:hover {
  background-color: #ffffff;
}

/* Delete Confirm Modal Specifics */
.confirm-modal {
  background-color: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  margin: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: modalPop 0.25s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes modalPop {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.confirm-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.75rem;
  letter-spacing: 0.02em;
}

.confirm-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-danger {
  background-color: #e25c5c;
  color: #ffffff;
  border: none;
  padding: 0.65rem 1.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
}

.btn-danger:hover {
  background-color: #ef4444;
}

@media (max-width: 768px) {
  .products-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .search-wrapper {
    max-width: none;
  }
  .filter-dropdowns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .drawer-form {
    padding: 1.5rem;
  }
  .drawer-header {
    padding: 1.25rem 1.5rem;
  }
}
</style>

