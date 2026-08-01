<template>
  <div class="lb-page">

    <!-- ═══════════════════════════════════════════ -->
    <!-- HERO — Full-viewport cinematic opening      -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="lb-hero">
      <img
        src="/images/lookbook_hero.png"
        alt="EL. Kelvinero Lookbook Hero"
        class="lb-hero__img"
      />
      <div class="lb-hero__overlay"></div>

      <div class="lb-hero__content">
        <span class="lb-hero__season">SS 2025 · THE EDIT</span>
        <h1 class="lb-hero__title">The Lookbook</h1>
        <p class="lb-hero__sub">Timeless Style. Made to Stand Out.</p>
        <div class="lb-hero__scroll">
          <span>Scroll</span>
          <div class="lb-hero__scroll-line"></div>
        </div>
      </div>

      <!-- Brand logo watermark -->
      <div class="img-logo-overlay img-logo-overlay--br">
        <img src="/logo.png" alt="EL. Kelvinero" />
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- INTRO TEXT                                  -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="lb-intro">
      <div class="lb-intro__inner">
        <span class="lb-eyebrow">THE COLLECTION</span>
        <h2 class="lb-intro__title">More Than Clothing.<br />It's a Statement.</h2>
        <p class="lb-intro__body">
          Every piece in this edit was crafted with intention — for the man who carries himself
          with quiet confidence and dresses with purpose. This is EL. Kelvinero.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- DYNAMIC LOOKS LIST                         -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="lb-looks-container">
      <section
        v-for="(item, index) in looks"
        :key="item.id"
        :class="['lb-story', { 'lb-story--reverse': index % 2 === 1 }]"
      >
        <div class="lb-story__image">
          <img :src="item.image" :alt="item.title" />
          <div class="img-logo-overlay img-logo-overlay--br">
            <img src="/logo.png" alt="EL. Kelvinero" />
          </div>
        </div>

        <div class="lb-story__text">
          <span class="lb-eyebrow">{{ item.lookNumber || ('LOOK 0' + (index + 1)) }}</span>
          <h2 class="lb-story__title">{{ item.title }}</h2>
          <div class="lb-story__divider"></div>
          <p class="lb-story__body" v-if="item.description">
            {{ item.description }}
          </p>
          <NuxtLink :to="item.link || '/shop'" class="lb-btn lb-btn--solid">EXPLORE LOOK</NuxtLink>
        </div>
      </section>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- PULL QUOTE — Dark editorial panel           -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="lb-quote">
      <div class="lb-quote__inner">
        <div class="lb-quote__mark">"</div>
        <blockquote class="lb-quote__text">
          Dress how you want to be addressed.
        </blockquote>
        <cite class="lb-quote__cite">— EL. Kelvinero</cite>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- FULL BLEED — Wide editorial banner          -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="lb-bleed">
      <img src="/images/lookbook_lifestyle.png" alt="EL. Kelvinero Lifestyle" class="lb-bleed__img" />
      <div class="lb-bleed__overlay"></div>
      <div class="img-logo-overlay img-logo-overlay--br">
        <img src="/logo.png" alt="EL. Kelvinero" />
      </div>
      <div class="lb-bleed__text">
        <span class="lb-eyebrow lb-eyebrow--light">THE LIFESTYLE</span>
        <p class="lb-bleed__body">
          Style is not just what you wear.<br />It's how you carry yourself.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SHOP CTA                                    -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="lb-cta">
      <span class="lb-eyebrow">READY TO WEAR</span>
      <h2 class="lb-cta__title">Shop the Collection</h2>
      <p class="lb-cta__body">
        Every look from this edit is available now. Limited quantities — built to last.
      </p>
      <NuxtLink to="/collection" class="lb-btn lb-btn--solid">SHOP NOW</NuxtLink>
    </section>

    <!-- Footer features bar -->
    <FooterFeatures />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

useHead({
  title: 'Lookbook | EL. Kelvinero',
  meta: [{
    name: 'description',
    content: 'Browse the EL. Kelvinero Lookbook — timeless editorial style made to stand out.'
  }]
})

const defaultLooks = [
  { id: 'l1', title: 'The Classic', lookNumber: 'LOOK 01', description: 'A refined staple for the modern silhouette.', image: '/images/lookbook_editorial_1.png', link: '/collection' },
  { id: 'l2', title: 'The Statement', lookNumber: 'LOOK 02', description: 'Bold tailoring engineered to stand out.', image: '/images/lookbook_editorial_2.png', link: '/collection' },
  { id: 'l3', title: 'The Everyday', lookNumber: 'LOOK 03', description: 'Elevated everyday essentials.', image: '/images/lookbook_lifestyle.png', link: '/shop' },
  { id: 'l4', title: 'The After Dark', lookNumber: 'LOOK 04', description: 'All-black essentials engineered for effortless confidence.', image: '/images/lookbook_editorial_3.png', link: '/collection' }
]

const looks = ref(defaultLooks)

const { data: liveLookbookData } = await useAsyncData('userLookbookData', () => $fetch('/api/v1/lookbook'))

if (liveLookbookData.value && liveLookbookData.value.length > 0) {
  looks.value = liveLookbookData.value
}

const fetchLiveLooks = async () => {
  try {
    const data = await $fetch('/api/v1/lookbook')
    if (data && data.length > 0) {
      looks.value = data
    }
  } catch (err) {
    console.error('Failed to load lookbook from API:', err)
  }
}

onMounted(fetchLiveLooks)
</script>

<style scoped>
/* ─── Page base ─────────────────────────────────── */
.lb-page {
  background-color: var(--color-bg-light);
  overflow-x: hidden;
}

/* ─── Shared utilities ──────────────────────────── */
.lb-eyebrow {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--color-text-muted);
  display: block;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.lb-eyebrow--light {
  color: rgba(255, 255, 255, 0.6);
}

/* Logo overlay utility (reused from about page pattern) */
.img-logo-overlay {
  position: absolute;
  width: 80px;
  opacity: 0.6;
  pointer-events: none;
  z-index: 3;
}
.img-logo-overlay img {
  width: 100%;
  height: auto;
  display: block;
  filter: brightness(0) invert(1);
}
.img-logo-overlay--br {
  bottom: 1.25rem;
  right: 1.25rem;
}

@media (max-width: 480px) {
  .img-logo-overlay {
    width: 60px;
    bottom: 0.85rem;
    right: 0.85rem;
  }
}

/* ─── Buttons ───────────────────────────────────── */
.lb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  padding: 0.9rem 2.25rem;
  cursor: pointer;
  transition: all 0.28s ease;
  text-decoration: none;
}

.lb-btn--solid {
  background-color: var(--color-text-dark);
  color: #ffffff;
  border: 1px solid var(--color-text-dark);
}
.lb-btn--solid:hover {
  background-color: transparent;
  color: var(--color-text-dark);
}

.lb-btn--outline {
  background-color: transparent;
  color: var(--color-text-dark);
  border: 1px solid rgba(0, 0, 0, 0.3);
}
.lb-btn--outline:hover {
  background-color: var(--color-text-dark);
  color: #ffffff;
  border-color: var(--color-text-dark);
}

/* ═══════════════════════════════════════════════════
   SECTION: Hero
═══════════════════════════════════════════════════ */
.lb-hero {
  position: relative;
  height: 100vh;
  min-height: 560px;
  overflow: hidden;
}

.lb-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.lb-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25) 0%,
    rgba(0, 0, 0, 0.55) 60%,
    rgba(0, 0, 0, 0.75) 100%
  );
}

.lb-hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  padding: 2rem;
}

.lb-hero__season {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  opacity: 0.75;
  margin-bottom: 1.25rem;
  display: block;
  animation: fadeUp 0.9s ease both;
}

.lb-hero__title {
  font-family: var(--font-serif);
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.01em;
  margin-bottom: 1rem;
  animation: fadeUp 0.9s 0.15s ease both;
}

.lb-hero__sub {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  opacity: 0.7;
  animation: fadeUp 0.9s 0.25s ease both;
}

/* Scroll indicator */
.lb-hero__scroll {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.55);
  animation: fadeUp 1s 0.5s ease both;
}

.lb-hero__scroll-line {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.35);
  position: relative;
  overflow: hidden;
}

.lb-hero__scroll-line::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  animation: scrollLine 1.8s ease infinite;
}

/* Logo watermark on hero */
.lb-hero__logo-wrap {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 80px;
  opacity: 0.4;
  pointer-events: none;
}
.lb-hero__logo-wrap img {
  width: 100%;
  filter: brightness(0) invert(1);
}

/* ═══════════════════════════════════════════════════
   SECTION: Intro text
═══════════════════════════════════════════════════ */
.lb-intro {
  padding: 5rem 2rem;
  background-color: var(--color-bg-light);
  display: flex;
  justify-content: center;
}

.lb-intro__inner {
  max-width: 620px;
  text-align: center;
}

.lb-intro__title {
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 400;
  line-height: 1.2;
  color: var(--color-text-dark);
  margin-bottom: 1.5rem;
}

.lb-intro__body {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  line-height: 1.75;
  color: var(--color-text-muted);
}

/* ═══════════════════════════════════════════════════
   SECTION: Editorial Grid
═══════════════════════════════════════════════════ */
.lb-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 0 6px 6px;
  background-color: var(--color-bg-light);
}

/* The tall left item spans 2 rows */
.lb-grid__item {
  position: relative;
  overflow: hidden;
  background-color: #d9d0c6;
  cursor: pointer;
}

.lb-grid__item--tall {
  grid-row: span 2;
  min-height: 640px;
}

.lb-grid__col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lb-grid__col .lb-grid__item {
  flex: 1;
  min-height: 310px;
}

.lb-grid__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.lb-grid__item:hover img {
  transform: scale(1.04);
}

/* Logo watermark per grid item */
.lb-grid__logo {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 60px;
  opacity: 0.45;
  pointer-events: none;
}
.lb-grid__logo img {
  width: 100%;
  filter: brightness(0) invert(1);
  transition: none;
}
.lb-grid__item:hover .lb-grid__logo img {
  transform: none;
}

/* Caption chip */
.lb-grid__caption {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  padding: 0.35rem 0.75rem;
  border-radius: 2px;
}

.lb-grid__look-num {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.12em;
}

.lb-grid__look-label {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ═══════════════════════════════════════════════════
   SECTION: Story Splits
═══════════════════════════════════════════════════ */
.lb-story {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 520px;
}

.lb-story__image {
  position: relative;
  overflow: hidden;
  background-color: #d9d0c6;
}

.lb-story__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.7s ease;
}

.lb-story__image:hover img {
  transform: scale(1.03);
}

.lb-story__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 3.5rem;
  background-color: var(--color-bg-light);
}

.lb-story--reverse .lb-story__image {
  order: 1;
}
.lb-story--reverse .lb-story__text {
  order: 0;
}

.lb-story__title {
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 400;
  line-height: 1.2;
  color: var(--color-text-dark);
  margin-bottom: 1.25rem;
}

.lb-story__divider {
  width: 36px;
  height: 2px;
  background-color: var(--color-accent);
  margin-bottom: 1.5rem;
}

.lb-story__body {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  line-height: 1.75;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  max-width: 380px;
}

/* ═══════════════════════════════════════════════════
   SECTION: Pull Quote
═══════════════════════════════════════════════════ */
.lb-quote {
  background-color: #1e1b17;
  padding: 5rem 2rem;
  display: flex;
  justify-content: center;
}

.lb-quote__inner {
  max-width: 700px;
  text-align: center;
}

.lb-quote__mark {
  font-family: var(--font-serif);
  font-size: 5rem;
  line-height: 0.5;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
  display: block;
}

.lb-quote__text {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.35;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.lb-quote__cite {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
}

/* ═══════════════════════════════════════════════════
   SECTION: Full-bleed editorial banner
═══════════════════════════════════════════════════ */
.lb-bleed {
  position: relative;
  height: 480px;
  overflow: hidden;
}

.lb-bleed__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  display: block;
}

.lb-bleed__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.2) 60%,
    transparent 100%
  );
}

.lb-bleed__logo {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 80px;
  opacity: 0.45;
  pointer-events: none;
}
.lb-bleed__logo img {
  width: 100%;
  filter: brightness(0) invert(1);
}

.lb-bleed__text {
  position: absolute;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
  color: #ffffff;
}

.lb-bleed__body {
  font-family: var(--font-serif);
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 400;
  line-height: 1.4;
  color: #ffffff;
}

/* ═══════════════════════════════════════════════════
   SECTION: Shop CTA
═══════════════════════════════════════════════════ */
.lb-cta {
  padding: 6rem 2rem;
  text-align: center;
  background-color: var(--color-bg-light);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.lb-cta__title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--color-text-dark);
  margin-bottom: 1.25rem;
}

.lb-cta__body {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 480px;
  margin: 0 auto 2.5rem;
}

/* ═══════════════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════════════ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scrollLine {
  0%   { top: -100%; }
  100% { top: 100%; }
}

/* ═══════════════════════════════════════════════════
   RESPONSIVE — Mobile (≤ 768px)
═══════════════════════════════════════════════════ */
@media (max-width: 768px) {
  /* Hero */
  .lb-hero {
    height: 90vh;
  }

  .lb-hero__title {
    font-size: 3rem;
  }

  /* Intro */
  .lb-intro {
    padding: 3.5rem 1.5rem;
  }

  /* Grid: single column on mobile */
  .lb-grid {
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 0 4px 4px;
  }

  .lb-grid__item--tall {
    grid-row: auto;
    min-height: 380px;
  }

  .lb-grid__col {
    gap: 4px;
  }

  .lb-grid__col .lb-grid__item {
    min-height: 280px;
  }

  /* Story splits: stack */
  .lb-story {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .lb-story__image {
    height: 65vw;
    min-height: 280px;
    order: -1 !important;
  }

  .lb-story__text {
    order: 1 !important;
    padding: 2.5rem 1.5rem;
  }

  .lb-story__body {
    max-width: 100%;
  }

  /* Pull quote */
  .lb-quote {
    padding: 3.5rem 1.5rem;
  }

  /* Full bleed */
  .lb-bleed {
    height: 320px;
  }

  .lb-bleed__text {
    left: 1.5rem;
    right: 1.5rem;
  }

  /* CTA */
  .lb-cta {
    padding: 4rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .lb-hero__title {
    font-size: 2.4rem;
  }

  .lb-grid__item--tall {
    min-height: 300px;
  }

  .lb-bleed {
    height: 260px;
  }
}
</style>
