<template>
  <div class="admin-collection-manager">
    <!-- Header -->
    <div class="coll-header animate-fade-in">
      <div>
        <h1 class="page-title">{{ genderName }} Collection</h1>
        <p class="page-subtitle">Manage pieces, category tags, pricing and availability for {{ genderName }} fashion edit.</p>
      </div>
      <button class="btn-primary-admin" @click="openAddModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ADD TO COLLECTION
      </button>
    </div>

    <!-- Category Switcher (Arranged the way it is on the user side) -->
    <div class="coll-tabs-bar animate-fade-in">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['coll-tab', { 'coll-tab--active': activeCategory === cat }]"
        @click="activeCategory = cat"
      >
        {{ cat }}
        <span class="coll-tab-count">{{ getCategoryCount(cat) }}</span>
      </button>
    </div>

    <!-- Collection Items Table -->
    <div class="admin-card animate-fade-in">
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>PRODUCT NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>COLORS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="text-center-cell">No collection items found matching the selected category.</td>
            </tr>
            <tr v-for="product in filteredProducts" :key="product.id" class="table-row">
              <td>
                <div class="product-thumb">
                  <img :src="product.image || '/images/product_tee.png'" :alt="product.name" />
                </div>
              </td>
              <td>
                <span class="product-name">{{ product.name }}</span>
              </td>
              <td class="text-upper font-mono">{{ product.category }}</td>
              <td class="font-semibold text-white">₦{{ product.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
              <td>
                <div class="product-colors-preview">
                  <span
                    v-for="color in product.colors"
                    :key="color"
                    class="color-dot"
                    :style="{ backgroundColor: getColorHex(color) }"
                    :title="color"
                  ></span>
                </div>
              </td>
              <td>
                <div class="action-buttons">
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

    <!-- Add Item Modal Drawer Overlay -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="drawer-modal animate-slide-in">
        <div class="drawer-header">
          <h2 class="drawer-title">Add to {{ genderName }} Collection</h2>
          <button class="btn-close" @click="closeModal">&times;</button>
        </div>

        <form @submit.prevent="saveProduct" class="drawer-form">
          <div class="form-group">
            <label class="form-label">SELECT PRODUCT TYPE (KIND)</label>
            <select v-model="form.category" class="form-input" required>
              <option v-for="cat in allowedCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">PRODUCT NAME</label>
            <input v-model="form.name" type="text" class="form-input" required placeholder="e.g. CORE SWEATSHIRT" />
          </div>

          <div class="form-group">
            <label class="form-label">PRICE (₦)</label>
            <input v-model.number="form.price" type="number" step="0.01" min="0" class="form-input" required placeholder="79.00" />
          </div>

          <div class="form-group">
            <label class="form-label">PRODUCT IMAGE</label>
            <div
              class="img-upload-zone"
              :class="{ 'img-upload-zone--has-preview': imagePreview }"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleImageDrop"
            >
              <img v-if="imagePreview" :src="imagePreview" class="img-preview" alt="Preview" />
              <div v-else class="img-upload-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span class="img-upload-text">Click or drag to upload</span>
                <span class="img-upload-sub">PNG, JPG, WEBP — max 5MB</span>
              </div>
              <div v-if="imagePreview" class="img-change-overlay">
                <span>Change Image</span>
              </div>
            </div>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="img-file-input"
              @change="handleImageUpload"
            />
          </div>

          <div class="form-group">
            <label class="form-label">COLORS AVAILABLE (Comma separated)</label>
            <input v-model="form.colorsInput" type="text" class="form-input" placeholder="black, cream, olive" />
            <p class="input-tip">Supported values: black, white, cream, tan, grey, navy, beige, brown, olive, camel, charcoal, dusty-rose, burgundy, teal</p>
          </div>

          <div class="drawer-footer">
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-save" :disabled="saving">{{ saving ? 'Saving...' : 'Add Piece' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModalOpen" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="confirm-modal">
        <h3 class="confirm-title">Remove from Collection?</h3>
        <p class="confirm-desc">Are you sure you want to remove <strong>{{ productToDelete?.name }}</strong> from the {{ genderName }} collection? This action is permanent.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="closeDeleteModal">Keep Item</button>
          <button class="btn-danger" @click="deleteProduct">Confirm Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const router = useRouter()

// Get parameter gender and validate
const genderParam = computed(() => {
  return String(route.params.gender || '').toLowerCase()
})

const genderName = computed(() => {
  const map = { men: 'Men', women: 'Women', kids: 'Kids' }
  return map[genderParam.value] || ''
})

// Validation Guard
watch(genderName, (newVal) => {
  if (!newVal) {
    router.push('/admin/dashboard')
  }
}, { immediate: true })

useHead({
  title: computed(() => `${genderName.value} Collection | TZORAH EMPORIUM Admin`),
  meta: [{ name: 'description', content: 'Manage category specific collection items.' }]
})

// ── Live backend state ──────────────────────────────
const adminToken = useCookie('adminToken')
const collectionProducts = ref([])
const saving = ref(false)
const loadError = ref('')

// Map gender slug → collection slug in the DB
const collectionSlugMap = { men: 'men', women: 'women', kids: 'kids' }
let collectionId = ref(null)

// Ensure the gender collection exists in the DB and get its ID
const ensureCollection = async () => {
  const slug = collectionSlugMap[genderParam.value]
  if (!slug) return null
  try {
    const cols = await $fetch('/api/v1/collections')
    const existing = cols.find(c => c.slug === slug)
    if (existing) {
      collectionId.value = existing.id
      return existing.id
    }
    // Create collection if missing
    const created = await $fetch('/api/v1/collections', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken.value}` },
      body: { name: genderParam.value.charAt(0).toUpperCase() + genderParam.value.slice(1), slug }
    })
    collectionId.value = created.id
    return created.id
  } catch (err) {
    console.error('ensureCollection error:', err)
    return null
  }
}

// Load products for this gender's collection from the live API
const fetchProducts = async () => {
  loadError.value = ''
  try {
    const cid = collectionId.value
    const params = cid ? `?collection_id=${cid}` : ''
    const data = await $fetch(`/api/v1/products${params}`)
    if (Array.isArray(data)) {
      collectionProducts.value = data.map(p => {
        let colors = ['black']
        if (Array.isArray(p.color)) colors = p.color
        else if (typeof p.color === 'string' && p.color.startsWith('[')) {
          try { colors = JSON.parse(p.color) } catch {}
        }
        return {
          id: p.id,
          gender: genderParam.value.toUpperCase(),
          category: (p.category?.name || 'T-SHIRTS').toUpperCase(),
          name: p.name,
          price: parseFloat(p.price),
          priceFormatted: `₦${parseFloat(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          image: p.image || '/images/product_tee.png',
          colors
        }
      })
    }
  } catch (err) {
    loadError.value = 'Failed to load products.'
    console.error('fetchProducts error:', err)
  }
}

onMounted(async () => {
  await ensureCollection()
  await fetchProducts()
})

const categories = ['ALL', 'T-SHIRTS', 'HOODIES', 'SWEATSHIRTS', 'POLOS', 'JACKETS', 'PANTS', 'ACCESSORIES']
const allowedCategories = ['T-SHIRTS', 'HOODIES', 'SWEATSHIRTS', 'POLOS', 'JACKETS', 'PANTS', 'ACCESSORIES']
const activeCategory = ref('ALL')

// Filtered products list
const filteredProducts = computed(() => {
  return collectionProducts.value.filter(p => {
    const catMatch = activeCategory.value === 'ALL' || p.category === activeCategory.value
    return catMatch
  })
})

const getCategoryCount = (cat) => {
  return collectionProducts.value.filter(p => {
    return cat === 'ALL' || p.category === cat
  }).length
}

// Modal handling
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const productToDelete = ref(null)
const imagePreview = ref('')
const fileInputRef = ref(null)

const form = ref({
  category: 'T-SHIRTS',
  name: '',
  price: 59.00,
  image: '',
  colorsInput: 'black, cream, grey'
})

const openAddModal = () => {
  form.value = {
    category: 'T-SHIRTS',
    name: '',
    price: 59.00,
    image: '',
    colorsInput: 'black, cream, grey'
  }
  imagePreview.value = ''
  modalOpen.value = true
}

const closeModal = () => {
  imagePreview.value = ''
  modalOpen.value = false
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be under 5MB.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    form.value.image = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleImageDrop = (event) => {
  const file = event.dataTransfer.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be under 5MB.')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    form.value.image = e.target.result
  }
  reader.readAsDataURL(file)
}

const saveProduct = async () => {
  if (saving.value) return
  saving.value = true
  const finalColors = form.value.colorsInput
    ? form.value.colorsInput.split(',').map(c => c.trim().toLowerCase()).filter(Boolean)
    : ['black']

  try {
    await $fetch('/api/v1/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken.value}` },
      body: {
        name: form.value.name.toUpperCase(),
        category: form.value.category,
        price: Number(form.value.price),
        stock: 100,
        image: form.value.image || '/images/product_tee.png',
        color: finalColors,
        collection_id: collectionId.value || undefined
      }
    })
    await fetchProducts()
  } catch (err) {
    console.error('Failed to save product to collection:', err)
    alert('Error saving product. Check that you are logged in as admin.')
  } finally {
    saving.value = false
    closeModal()
  }
}

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
</script>

<style scoped>
.admin-collection-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.coll-header {
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

/* Category Tab bar */
.coll-tabs-bar {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  gap: 0.5rem;
  scrollbar-width: none;
}

.coll-tabs-bar::-webkit-scrollbar {
  display: none;
}

.coll-tab {
  white-space: nowrap;
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
  position: relative;
}

.coll-tab:hover {
  color: #ffffff;
}

.coll-tab--active {
  color: #b89874 !important;
}

.coll-tab--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #b89874;
}

.coll-tab-count {
  font-size: 0.65rem;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.1rem 0.4rem;
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.5);
}

.coll-tab--active .coll-tab-count {
  background-color: rgba(184, 152, 116, 0.12);
  color: #b89874;
}

/* Table */
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

.product-name {
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.text-upper {
  text-transform: uppercase;
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

/* Image Upload Zone */
.img-file-input {
  display: none;
}

.img-upload-zone {
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  background-color: #161616;
  height: 160px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: border-color 0.25s ease, background-color 0.25s ease;
}

.img-upload-zone:hover {
  border-color: rgba(184, 152, 116, 0.4);
  background-color: #1a1a1a;
}

.img-upload-zone--has-preview {
  border-style: solid;
  border-color: rgba(184, 152, 116, 0.3);
}

.img-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.25);
  user-select: none;
}

.img-upload-text {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
}

.img-upload-sub {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.25);
}

.img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-change-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.img-upload-zone:hover .img-change-overlay {
  opacity: 1;
}

.img-change-overlay span {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  background-color: rgba(184, 152, 116, 0.8);
  padding: 0.4rem 1rem;
  border-radius: 2px;
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
  .coll-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}
</style>
