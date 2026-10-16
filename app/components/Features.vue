<template>
  <section class="features">
    <div class="container">
      <div class="features__grid">
        <div v-for="(feature, idx) in featureList" :key="idx" class="features__item">
          <div class="features__icon-wrapper">
            <!-- Render custom SVG dynamically based on feature key -->
            <component :is="feature.icon" class="features__icon" />
          </div>
          <div class="features__info">
            <h3 class="features__title">{{ feature.title }}</h3>
            <p class="features__desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

// Custom inline SVG icons as functional components to keep it lightweight
const TShirtIcon = () => h(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '28',
    height: '28',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.25',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  [
    h('path', { d: 'M20.38 3.46L16 6a2 2 0 0 1-2 0l-2-1.2-2 1.2a2 2 0 0 1-2 0L3.62 3.46a2 2 0 0 0-2.62.9L0 7.84A2 2 0 0 0 1.34 10.4L3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8l1.66-.6A2 2 0 0 0 24 7.84l-1-3.48a2 2 0 0 0-2.62-.9z' })
  ]
)

const HangerIcon = () => h(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '28',
    height: '28',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.25',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  [
    h('path', { d: 'M12 2a3 3 0 0 0-3 3h3a3 3 0 0 0 0-6z' }),
    h('path', { d: 'M12 5v3m0 0l-8.58 6.44a1.5 1.5 0 0 0-.42 2l1 1.5a1.5 1.5 0 0 0 2 .42L12 14.5l6 3.86a1.5 1.5 0 0 0 2-.42l1-1.5a1.5 1.5 0 0 0-.42-2z' })
  ]
)

const GlobeIcon = () => h(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '28',
    height: '28',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.25',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
    h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
  ]
)

const ShieldIcon = () => h(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '28',
    height: '28',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.25',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },
  [
    h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
    h('path', { d: 'M9 11l2 2 4-4' })
  ]
)

const featureList = [
  {
    icon: ShieldIcon,
    title: '100% AUTHENTIC PERFUMES',
    description: 'USA pure perfume oils, Middle Eastern attars, and genuine designer scents.'
  },
  {
    icon: GlobeIcon,
    title: 'THE OILS ALCHEMY BAR',
    description: 'Therapeutic essential oils, cosmetic fragrance oils & natural carrier oils.'
  },
  {
    icon: HangerIcon,
    title: 'CANDLECRAFT & PET CARE',
    description: 'Pure soy waxes, cotton wicks, unscented bases, and gentle pet body care.'
  },
  {
    icon: TShirtIcon,
    title: 'DISCREET ADULT LUXURIES',
    description: 'Body-safe adult toys & fine Mulberry silk lingeries with 100% discreet packaging.'
  }
]
</script>

<style scoped>
.features {
  position: relative;
  z-index: 5;
  margin-top: -5.5rem;
  background-color: var(--color-bg-light);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 2.5rem 0;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.features__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 1.5rem;
  position: relative;
}

/* Subtle separator lines between items for editorial feel */
.features__item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -1rem;
  top: 15%;
  height: 70%;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.06);
}

.features__icon-wrapper {
  color: var(--color-text-dark);
  margin-bottom: 1.5rem;
  opacity: 0.85;
  transition: var(--transition-smooth);
}

.features__item:hover .features__icon-wrapper {
  color: var(--color-accent);
  transform: translateY(-4px);
}

.features__title {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
  color: var(--color-text-dark);
}

.features__desc {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 300;
  color: var(--color-text-muted);
  line-height: 1.4;
  max-width: 240px;
  margin: 0 auto;
}

/* Responsive layouts */
@media (max-width: 992px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem 1.5rem;
  }

  .features__item::after {
    display: none;
  }
}

@media (max-width: 576px) {
  .features {
    margin-top: 0;
    padding: 2.25rem 0;
  }

  .features__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  .features__item {
    padding: 0.5rem 0.25rem;
  }

  .features__icon-wrapper svg {
    width: 20px;
    height: 20px;
  }

  .features__icon-wrapper {
    margin-bottom: 0.65rem;
  }

  .features__title {
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    margin-bottom: 0.35rem;
  }

  .features__desc {
    font-size: 0.72rem;
    max-width: 100%;
    line-height: 1.3;
  }
}

@media (max-width: 400px) {
  .features__title {
    font-size: 0.55rem;
    letter-spacing: 0.05em;
  }

  .features__desc {
    font-size: 0.65rem;
  }
}
</style>
