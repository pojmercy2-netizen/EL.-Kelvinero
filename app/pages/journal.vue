<template>
  <div class="jr-page">

    <!-- ═══════════════════════════════════════════ -->
    <!-- HERO HEADER                                 -->
    <!-- ═══════════════════════════════════════════ -->
    <header class="jr-hero">
      <div class="jr-hero__content">
        <span class="jr-hero__eyebrow">EDITORIALS & STORIES</span>
        <h1 class="jr-hero__title">The Journal</h1>
        <p class="jr-hero__sub">Perspectives on design, craft, and the art of timeless styling.</p>
        <div class="jr-hero__divider"></div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════ -->
    <!-- FEATURED ARTICLE (HERO POST)                 -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="container jr-featured" v-if="featuredPost">
      <div class="jr-featured__wrapper">
        <div class="jr-featured__image">
          <img :src="featuredPost.image" :alt="featuredPost.title" />
          <div class="img-logo-overlay img-logo-overlay--br">
            <img src="/logo.png" alt="TZORAH EMPORIUM" />
          </div>
        </div>

        <div class="jr-featured__content">
          <div class="jr-meta">
            <span class="jr-meta__category">{{ featuredPost.category }}</span>
            <span class="jr-meta__dot">&middot;</span>
            <span class="jr-meta__date">{{ featuredPost.date }}</span>
          </div>
          <h2 class="jr-featured__title">
            <NuxtLink :to="'/journal/' + featuredPost.slug">{{ featuredPost.title }}</NuxtLink>
          </h2>
          <p class="jr-featured__excerpt">{{ featuredPost.excerpt }}</p>
          <NuxtLink :to="'/journal/' + featuredPost.slug" class="jr-read-more hover-underline">
            READ THE ARTICLE
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- ARTICLES GRID                               -->
    <!-- ═══════════════════════════════════════════ -->
    <main class="container jr-main">
      <div class="jr-grid">
        <article v-for="post in gridPosts" :key="post.slug" class="jr-card">
          <div class="jr-card__image">
            <img :src="post.image" :alt="post.title" />
            <div class="img-logo-overlay img-logo-overlay--br">
              <img src="/logo.png" alt="TZORAH EMPORIUM" />
            </div>
          </div>

          <div class="jr-card__content">
            <div class="jr-meta">
              <span class="jr-meta__category">{{ post.category }}</span>
              <span class="jr-meta__dot">&middot;</span>
              <span class="jr-meta__date">{{ post.date }}</span>
            </div>
            <h3 class="jr-card__title">
              <NuxtLink :to="'/journal/' + post.slug">{{ post.title }}</NuxtLink>
            </h3>
            <p class="jr-card__excerpt">{{ post.excerpt }}</p>
            <NuxtLink :to="'/journal/' + post.slug" class="jr-read-more hover-underline">
              READ STORY
            </NuxtLink>
          </div>
        </article>
      </div>
    </main>

    <!-- Footer feature pillars -->
    <FooterFeatures />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'The Journal | TZORAH EMPORIUM',
  meta: [{ name: 'description', content: 'Explore editorial stories on the art of perfume oils, steam-distilled essences, candlecraft, and sensual wellness from TZORAH EMPORIUM.' }]
})

const posts = ref([
  {
    slug: 'the-alchemy-of-usa-oil-perfumes',
    title: 'The Alchemy of USA Oil Perfumes: Why Concentrated Oils Last Longer',
    category: 'OLFACTORY',
    date: 'August 12, 2026',
    excerpt: 'Exploring how unadulterated oil mediums bind to skin lipids, unlocking multifaceted scent projection that persists 24+ hours without alcohol drying.',
    image: '/images/or_hero.png',
    featured: true
  },
  {
    slug: 'guide-to-botanical-essential-oils',
    title: 'Steam Distillation & Therapeutic Botanical Oils',
    category: 'WELLNESS',
    date: 'August 04, 2026',
    excerpt: 'A comprehensive journey through French Lavender, Australian Tea Tree, and Royal Frankincense for aromatherapy and personal formulations.',
    image: '/images/or_oils.png',
    featured: false
  },
  {
    slug: 'crafting-luxury-scented-candles',
    title: 'The Artisan’s Guide to Soy Wax & Fragrance Load Ratios',
    category: 'CANDLECRAFT',
    date: 'July 28, 2026',
    excerpt: 'Mastering temperature control, cotton wick sustainers, and hot scent throw when pouring handcrafted home candles.',
    image: '/images/products/candle_1.png',
    featured: false
  }
])

const featuredPost = computed(() => {
  return posts.value.find(p => p.featured)
})

const gridPosts = computed(() => {
  return posts.value.filter(p => !p.featured)
})
</script>

<style scoped>
.jr-page {
  background-color: var(--color-bg-light);
  min-height: 100vh;
}

/* ─── Hero Header ─────────────────────────────── */
.jr-hero {
  padding: 5rem 1.5rem 3.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
}

.jr-hero__eyebrow {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: block;
}

.jr-hero__title {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: var(--color-text-dark);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.jr-hero__sub {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  color: var(--color-text-muted);
  max-width: 480px;
  margin: 0 auto 1.5rem;
  line-height: 1.5;
}

.jr-hero__divider {
  width: 40px;
  height: 2px;
  background-color: var(--color-accent);
  margin: 0 auto;
}

/* Watermark */
.img-logo-overlay {
  position: absolute;
  width: 70px;
  opacity: 0.5;
  pointer-events: none;
  z-index: 2;
}
.img-logo-overlay img {
  width: 100%;
  height: auto;
  filter: brightness(0) invert(1);
}
.img-logo-overlay--br {
  bottom: 1.25rem;
  right: 1.25rem;
}

/* ─── Featured Post (Hero) ────────────────────── */
.jr-featured {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.jr-featured__wrapper {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.jr-featured__image {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background-color: #ebe7e0;
}

.jr-featured__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.jr-featured__image:hover img {
  transform: scale(1.03);
}

.jr-featured__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.jr-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.jr-meta__category {
  color: var(--color-accent);
  text-transform: uppercase;
}

.jr-meta__date {
  color: var(--color-text-muted);
}

.jr-meta__dot {
  color: var(--color-text-muted);
}

.jr-featured__title {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}

.jr-featured__title a {
  color: var(--color-text-dark);
  text-decoration: none;
  transition: color 0.25s ease;
}

.jr-featured__title a:hover {
  color: var(--color-accent);
}

.jr-featured__excerpt {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.jr-read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--color-text-dark);
  text-decoration: none;
  width: fit-content;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.jr-read-more:hover .arrow-icon {
  transform: translateX(4px);
}

/* ─── Grid section ────────────────────────────── */
.jr-main {
  padding-bottom: 6rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 5rem;
}

.jr-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3.5rem 2rem;
}

.jr-card {
  display: flex;
  flex-direction: column;
}

.jr-card__image {
  position: relative;
  aspect-ratio: 3/2;
  overflow: hidden;
  background-color: #ebe7e0;
  margin-bottom: 1.5rem;
}

.jr-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.jr-card:hover .jr-card__image img {
  transform: scale(1.03);
}

.jr-card__title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 0.8rem;
}

.jr-card__title a {
  color: var(--color-text-dark);
  text-decoration: none;
  transition: color 0.25s ease;
}

.jr-card__title a:hover {
  color: var(--color-accent);
}

.jr-card__excerpt {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

/* ─── Responsive ──────────────────────────────── */
@media (max-width: 992px) {
  .jr-featured__wrapper {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .jr-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .jr-hero {
    padding: 3rem 1rem 2rem;
  }
  .jr-hero__title {
    font-size: 2.2rem;
  }
  .jr-hero__sub {
    font-size: 0.8rem;
  }
  .jr-featured {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .jr-featured__title {
    font-size: 1.65rem;
  }
  .jr-main {
    padding-top: 2.5rem;
    padding-bottom: 3.5rem;
  }
  .jr-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 480px) {
  .jr-hero__title {
    font-size: 1.75rem;
  }
  .jr-featured__title {
    font-size: 1.4rem;
  }
  .jr-featured__excerpt {
    font-size: 0.84rem;
    line-height: 1.55;
    margin-bottom: 1.25rem;
  }
  .jr-card__title {
    font-size: 1.15rem;
  }
  .jr-card__excerpt {
    font-size: 0.82rem;
    line-height: 1.55;
  }
}
</style>
