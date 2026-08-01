<template>
  <section class="faq section-padding">
    <div class="container">
      <div class="faq__inner">
        <!-- Header -->
        <div class="faq__header">
          <span class="faq__label">NEED HELP?</span>
          <h2 class="faq__title">Frequently Asked<br />Questions</h2>
          <div class="faq__divider"></div>
        </div>

        <!-- Accordion Items -->
        <div class="faq__list">
          <div
            v-for="(item, idx) in faqs"
            :key="idx"
            class="faq__item"
            :class="{ 'faq__item--open': openIndex === idx }"
            @click="toggle(idx)"
          >
            <div class="faq__question">
              <span>{{ item.q }}</span>
              <span class="faq__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18" height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" class="faq__plus-v" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </div>
            <div class="faq__answer">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

const toggle = (idx) => {
  openIndex.value = openIndex.value === idx ? null : idx
}

const faqs = [
  {
    q: 'What materials do you use in your garments?',
    a: 'We use only premium, responsibly sourced fabrics — including brushed French terry, Pima cotton, and heavyweight fleece. Every piece is crafted for durability, comfort, and timeless style.'
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3–7 business days. Express delivery (1–2 business days) is available at checkout. International orders may take 7–14 business days depending on location.'
  },
  {
    q: 'Can I return or exchange an item?',
    a: 'Yes. We accept returns and exchanges within 30 days of delivery, provided items are unworn, unwashed, and in original packaging. Visit our returns page or contact us to initiate a return.'
  },
  {
    q: 'How do I find the right size?',
    a: 'Each product page includes a full size guide with chest, waist, and length measurements. If you\'re between sizes, we generally recommend sizing up for a relaxed fit.'
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship worldwide. Shipping rates and estimated delivery times are calculated at checkout based on your location.'
  },
  {
    q: 'How do I care for my EL. Kelvinero pieces?',
    a: 'Machine wash cold with like colours, gentle cycle. Tumble dry low or lay flat to dry. Avoid ironing directly on any printed logos or graphics. Full care instructions are on each garment tag.'
  }
]
</script>

<style scoped>
.faq {
  background-color: #0f0f0f;
  padding: 6rem 0;
}

.faq__inner {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 5rem;
  align-items: flex-start;
}

.faq__label {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  text-transform: uppercase;
  display: block;
  margin-bottom: 1.25rem;
}

.faq__title {
  font-family: var(--font-sans);
  font-size: 2.4rem;
  font-weight: 300;
  letter-spacing: 0.03em;
  line-height: 1.2;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.faq__divider {
  width: 45px;
  height: 2px;
  background-color: var(--color-accent);
}

.faq__list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.faq__item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  overflow: hidden;
  transition: background 0.25s ease;
}

.faq__item:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.faq__question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  user-select: none;
  gap: 1rem;
}

.faq__icon {
  flex-shrink: 0;
  color: var(--color-accent);
  transition: transform 0.3s ease;
}

.faq__item--open .faq__icon {
  transform: rotate(45deg);
}

.faq__plus-v {
  transition: opacity 0.3s ease;
}

.faq__item--open .faq__plus-v {
  opacity: 0;
}

.faq__answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.3s ease;
  padding: 0 0.5rem;
}

.faq__item--open .faq__answer {
  max-height: 300px;
  padding: 0 0.5rem 1.5rem;
}

.faq__answer p {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
}

@media (max-width: 900px) {
  .faq__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .faq__title {
    font-size: 1.8rem;
  }
}

@media (max-width: 576px) {
  .faq {
    padding: 4rem 0;
  }
}
</style>
