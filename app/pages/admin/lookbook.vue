<template>
  <div class="admin-lookbook">
    <!-- Header -->
    <div class="lookbook-header animate-fade-in">
      <div>
        <h1 class="page-title">Lookbook Management</h1>
        <p class="page-subtitle">Add, edit, and delete editorial lookbook items shown on your website.</p>
      </div>
      <button class="btn-primary-admin" @click="openAddModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        ADD NEW LOOK
      </button>
    </div>

    <!-- Filters / Stats Bar -->
    <div class="filters-bar animate-fade-in">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Search looks by title, look number..." class="search-input" />
      </div>
      <div class="count-badge">
        Total Looks: <strong>{{ looks.length }}</strong>
      </div>
    </div>

    <!-- Lookbook Grid / Table -->
    <div class="admin-card animate-fade-in">
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>LOOK #</th>
              <th>TITLE</th>
              <th>DESCRIPTION</th>
              <th>LINK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredLooks.length === 0">
              <td colspan="6" class="text-center-cell">No lookbook entries found.</td>
            </tr>
            <tr v-for="item in filteredLooks" :key="item.id" class="table-row">
              <td>
                <div class="look-thumb">
                  <img :src="item.image || '/images/lookbook_editorial_1.png'" :alt="item.title" />
                </div>
              </td>
              <td>
                <span class="look-tag">{{ item.lookNumber }}</span>
              </td>
              <td>
                <strong>{{ item.title }}</strong>
              </td>
              <td>
                <p class="desc-text">{{ item.description || '—' }}</p>
              </td>
              <td>
                <span class="link-text">{{ item.link }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-delete" @click="confirmDelete(item)" title="Delete Look">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- ADD LOOKBOOK MODAL                          -->
    <!-- ═══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Add New Lookbook Entry</h3>
            <button class="modal-close" @click="closeAddModal">&times;</button>
          </div>
          <form class="modal-form" @submit.prevent="saveLook">
            <div class="form-group">
              <label>Look Title *</label>
              <input v-model="form.title" type="text" placeholder="e.g. The Midnight Edit" required class="form-input" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Look Number</label>
                <input v-model="form.lookNumber" type="text" placeholder="e.g. LOOK 06" class="form-input" />
              </div>
              <div class="form-group">
                <label>Button Link</label>
                <input v-model="form.link" type="text" placeholder="e.g. /shop or /collection" class="form-input" />
              </div>
            </div>

            <!-- Image Upload -->
            <div class="form-group">
              <label>Look Image *</label>
              <div
                class="upload-zone"
                :class="{ 'upload-zone--dragover': isDragOver, 'upload-zone--has-image': imagePreviewUrl }"
                @click="triggerFileInput"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="onFileDrop"
              >
                <!-- Preview -->
                <img v-if="imagePreviewUrl" :src="imagePreviewUrl" class="upload-preview" alt="Preview" />

                <!-- Placeholder -->
                <div v-else class="upload-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>Click or drag & drop an image</p>
                  <span>JPEG, PNG, WebP — max 10MB</span>
                </div>

                <!-- Uploading overlay -->
                <div v-if="uploading" class="upload-overlay">
                  <span class="upload-spinner"></span>
                  <p>Uploading…</p>
                </div>

                <!-- Change badge -->
                <button v-if="imagePreviewUrl && !uploading" type="button" class="upload-change-btn" @click.stop="clearImage">✕ Remove</button>
              </div>
              <!-- hidden file input -->
              <input
                ref="fileInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style="display:none"
                @change="onFileSelected"
              />
              <p v-if="uploadError" class="upload-error">{{ uploadError }}</p>
            </div>

            <div class="form-group">
              <label>Description / Story</label>
              <textarea v-model="form.description" rows="3" placeholder="Brief editorial description for this look..." class="form-input"></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="closeAddModal">CANCEL</button>
              <button type="submit" class="btn-save" :disabled="saving">
                {{ saving ? 'SAVING...' : 'SAVE LOOK' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ═══════════════════════════════════════════ -->
    <!-- DELETE CONFIRMATION MODAL                   -->
    <!-- ═══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
        <div class="modal-card modal-card--small">
          <div class="modal-header">
            <h3>Delete Lookbook Entry</h3>
            <button class="modal-close" @click="showDeleteModal = false">&times;</button>
          </div>
          <p class="modal-body-text">
            Are you sure you want to delete <strong>"{{ itemToDelete?.title }}"</strong>? This action cannot be undone.
          </p>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="showDeleteModal = false">CANCEL</button>
            <button type="button" class="btn-delete-confirm" :disabled="deleting" @click="executeDelete">
              {{ deleting ? 'DELETING...' : 'DELETE LOOK' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const adminToken = useCookie('adminToken')

const searchQuery = ref('')
const looks = ref([])
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const saving = ref(false)
const deleting = ref(false)

// Image upload state
const fileInputRef = ref(null)
const imageFile = ref(null)
const imagePreviewUrl = ref('')
const uploading = ref(false)
const uploadError = ref('')
const isDragOver = ref(false)

const toasts = useState('toasts', () => [])
const showToast = (msg) => {
  toasts.value.push({ id: Date.now(), message: msg })
}

const form = ref({
  title: '',
  lookNumber: '',
  description: '',
  image: '/images/lookbook_editorial_1.png',
  link: '/shop'
})

// File upload helpers
const triggerFileInput = () => {
  if (!uploading.value) fileInputRef.value?.click()
}

const clearImage = () => {
  imageFile.value = null
  imagePreviewUrl.value = ''
  uploadError.value = ''
  form.value.image = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const handleFile = (file) => {
  if (!file) return
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (!allowed.includes(file.type)) {
    uploadError.value = 'Only JPEG, PNG, and WebP images are allowed.'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = 'Image must be under 10MB.'
    return
  }
  uploadError.value = ''
  imageFile.value = file
  imagePreviewUrl.value = URL.createObjectURL(file)
}

const onFileSelected = (e) => handleFile(e.target.files?.[0])
const onFileDrop = (e) => {
  isDragOver.value = false
  handleFile(e.dataTransfer?.files?.[0])
}

const uploadImageFile = async () => {
  if (!imageFile.value) return null
  uploading.value = true
  uploadError.value = ''
  try {
    const fd = new FormData()
    fd.append('file', imageFile.value)
    const res = await $fetch('/api/v1/lookbook/upload-image', {
      method: 'POST',
      body: fd,
      headers: { Authorization: `Bearer ${adminToken.value}` }
    })
    return res.image_url
  } catch (err) {
    uploadError.value = 'Image upload failed. Please try again.'
    console.error('Lookbook upload error:', err)
    return null
  } finally {
    uploading.value = false
  }
}

// Fetch looks from API
const fetchLooks = async () => {
  try {
    const data = await $fetch('/api/v1/lookbook')
    if (Array.isArray(data)) {
      looks.value = data
    }
  } catch (err) {
    console.error('Failed to fetch lookbook entries:', err)
  }
}

onMounted(fetchLooks)

const filteredLooks = computed(() => {
  if (!searchQuery.value) return looks.value
  const q = searchQuery.value.toLowerCase()
  return looks.value.filter(item =>
    item.title?.toLowerCase().includes(q) ||
    item.lookNumber?.toLowerCase().includes(q) ||
    item.description?.toLowerCase().includes(q)
  )
})

const openAddModal = () => {
  form.value = {
    title: '',
    lookNumber: `LOOK 0${looks.value.length + 1}`,
    description: '',
    image: '',
    link: '/shop'
  }
  imageFile.value = null
  imagePreviewUrl.value = ''
  uploadError.value = ''
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  clearImage()
}

const saveLook = async () => {
  // Must have a file selected
  if (!imageFile.value) {
    uploadError.value = 'Please select an image to upload.'
    return
  }

  saving.value = true
  try {
    // Step 1: upload the image file
    const imageUrl = await uploadImageFile()
    if (!imageUrl) {
      saving.value = false
      return
    }

    // Step 2: save the lookbook entry with the uploaded URL
    const res = await $fetch('/api/v1/lookbook', {
      method: 'POST',
      body: { ...form.value, image: imageUrl }
    })
    if (res && res.success) {
      showToast('New lookbook entry added successfully!')
      showAddModal.value = false
      clearImage()
      await fetchLooks()
    }
  } catch (err) {
    console.error('Failed to save lookbook entry:', err)
    showToast('Failed to add lookbook entry.')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`/api/v1/lookbook/${itemToDelete.value.id}`, {
      method: 'DELETE'
    })
    showToast(`Deleted "${itemToDelete.value.title}".`)
    showDeleteModal.value = false
    itemToDelete.value = null
    await fetchLooks()
  } catch (err) {
    console.error('Failed to delete lookbook item:', err)
    showToast('Failed to delete lookbook item.')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.admin-lookbook {
  padding: 1.5rem;
}

.lookbook-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.5);
}

.btn-primary-admin {
  background-color: var(--color-accent, #c9a96e);
  color: #111;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.7rem 1.25rem;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
}
.btn-primary-admin:hover { opacity: 0.9; }

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  gap: 1rem;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 380px;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0.65rem 0.85rem 0.65rem 2.4rem;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  border-radius: 2px;
  outline: none;
}
.search-input:focus { border-color: var(--color-accent); }

.count-badge {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.admin-card {
  background: #181818;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-family: var(--font-sans);
  font-size: 0.82rem;
}

.admin-table th {
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.admin-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.85);
  vertical-align: middle;
}

.look-thumb {
  width: 50px;
  height: 64px;
  border-radius: 2px;
  overflow: hidden;
  background: #252525;
}
.look-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.look-tag {
  background: rgba(201, 169, 110, 0.15);
  color: var(--color-accent, #c9a96e);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.6rem;
  border-radius: 2px;
}

.desc-text {
  max-width: 280px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
}

.link-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.text-center-cell {
  text-align: center;
  padding: 3rem !important;
  color: rgba(255, 255, 255, 0.4);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.4rem;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-delete:hover {
  background: rgba(226, 92, 92, 0.2);
  border-color: #e25c5c;
  color: #e25c5c;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  max-width: 540px;
  width: 100%;
  padding: 2rem;
}

.modal-card--small {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.modal-header h3 {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.05em;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-close:hover { color: #fff; }

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 0.75rem 0.85rem;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  border-radius: 2px;
  outline: none;
}
.form-input:focus { border-color: var(--color-accent); }

.image-presets {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

.preset-label {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.4);
}

.preset-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  cursor: pointer;
}
.preset-btn:hover { background: rgba(201, 169, 110, 0.2); color: var(--color-accent); }

.modal-body-text {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 1.75rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  padding: 0.7rem 1.25rem;
  border-radius: 2px;
  cursor: pointer;
}
.btn-cancel:hover { border-color: rgba(255, 255, 255, 0.5); }

.btn-save {
  background: var(--color-accent, #c9a96e);
  color: #111;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.btn-save:hover { opacity: 0.9; }

.btn-delete-confirm {
  background: #e25c5c;
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.7rem 1.25rem;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.btn-delete-confirm:hover { opacity: 0.9; }

/* ── Upload Zone ── */
.upload-zone {
  position: relative;
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
  background: rgba(255, 255, 255, 0.02);
}
.upload-zone:hover,
.upload-zone--dragover {
  border-color: var(--color-accent, #c9a96e);
  background: rgba(201, 169, 110, 0.06);
}
.upload-zone--has-image {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.1);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.35);
  pointer-events: none;
  padding: 1.5rem;
}
.upload-placeholder svg {
  opacity: 0.5;
}
.upload-placeholder p {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}
.upload-placeholder span {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
}

.upload-preview {
  width: 100%;
  height: 100%;
  min-height: 160px;
  max-height: 220px;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.8rem;
}

.upload-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--color-accent, #c9a96e);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.upload-change-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  font-size: 0.68rem;
  font-family: var(--font-sans);
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.upload-change-btn:hover {
  background: rgba(226, 92, 92, 0.7);
  border-color: #e25c5c;
}

.upload-error {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: #e25c5c;
  margin-top: 0.3rem;
}
</style>
