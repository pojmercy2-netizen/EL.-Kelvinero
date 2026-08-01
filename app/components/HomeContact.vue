<template>
  <section class="contact section-padding">
    <div class="container">
      <div class="contact__inner">

        <!-- Left: Info -->
        <div class="contact__info">
          <span class="contact__label">GET IN TOUCH</span>
          <h2 class="contact__title">We'd Love<br />To Hear From You</h2>
          <div class="contact__divider"></div>
          <p class="contact__desc">
            Whether you have a question about sizing, an order, or just want to say hello — our team is here and ready to help.
          </p>

          <div class="contact__details">
            <div class="contact__detail-item">
              <span class="contact__detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <span>{{ storeSettings.supportEmail }}</span>
            </div>
            <div class="contact__detail-item">
              <span class="contact__detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.55 6.55l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <span>{{ storeSettings.telephone }}</span>
            </div>
            <div class="contact__detail-item">
              <span class="contact__detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <span>{{ storeSettings.businessHours }}</span>
            </div>
            <div v-if="storeSettings.contactAddress" class="contact__detail-item">
              <span class="contact__detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              <span>{{ storeSettings.contactAddress }}</span>
            </div>
            <div v-if="storeSettings.responseTime" class="contact__detail-item">
              <span class="contact__detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <span>{{ storeSettings.responseTime }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="contact__form-wrapper">
          <form class="contact__form" @submit.prevent="submitForm">
            <div class="contact__field-row">
              <div class="contact__field">
                <label for="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>
              <div class="contact__field">
                <label for="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div class="contact__field">
              <label for="contact-subject">Subject</label>
              <input
                id="contact-subject"
                v-model="form.subject"
                type="text"
                placeholder="What's this about?"
              />
            </div>
            <div class="contact__field">
              <label for="contact-message">Message</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="5"
                placeholder="Tell us how we can help..."
                required
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary contact__submit" :disabled="sending">
              {{ sending ? 'SENDING...' : 'SEND MESSAGE' }}
            </button>
            <p v-if="sent" class="contact__success">✓ Your message has been sent. We'll be in touch shortly.</p>
          </form>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const { storeSettings, fetchStoreSettings } = useStoreSettings()

// Refresh settings client-side (already loaded by layout on SSR)
onMounted(fetchStoreSettings)

const sending = ref(false)
const sent = ref(false)

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = async () => {
  sending.value = true
  await new Promise(resolve => setTimeout(resolve, 1200))
  sending.value = false
  sent.value = true
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  setTimeout(() => { sent.value = false }, 5000)
}
</script>

<style scoped>
.contact {
  background-color: #111;
  padding: 6rem 0;
}

.contact__inner {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 5rem;
  align-items: flex-start;
}

.contact__label {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  text-transform: uppercase;
  display: block;
  margin-bottom: 1.25rem;
}

.contact__title {
  font-family: var(--font-sans);
  font-size: 2.4rem;
  font-weight: 300;
  letter-spacing: 0.03em;
  line-height: 1.2;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.contact__divider {
  width: 45px;
  height: 2px;
  background-color: var(--color-accent);
  margin-bottom: 1.75rem;
}

.contact__desc {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2.5rem;
  max-width: 380px;
}

.contact__details {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.contact__detail-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.6);
}

.contact__detail-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

/* Form */
.contact__form-wrapper {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 2.5rem;
  border-radius: 2px;
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact__field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.contact__field label {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.contact__field input,
.contact__field textarea {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0.85rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  border-radius: 1px;
  outline: none;
  transition: border-color 0.2s ease;
  resize: none;
}

.contact__field input::placeholder,
.contact__field textarea::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.contact__field input:focus,
.contact__field textarea:focus {
  border-color: var(--color-accent);
}

.contact__submit {
  align-self: flex-start;
  padding: 0.9rem 2rem;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  cursor: pointer;
}

.contact__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact__success {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: #6fcf97;
  margin-top: 0.25rem;
}

@media (max-width: 960px) {
  .contact__inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .contact__title {
    font-size: 1.8rem;
  }
}

@media (max-width: 576px) {
  .contact {
    padding: 4rem 0;
  }

  .contact__form-wrapper {
    padding: 1.5rem;
  }

  .contact__field-row {
    grid-template-columns: 1fr;
  }
}
</style>
