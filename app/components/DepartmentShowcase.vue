<template>
  <section class="departments section-padding">
    <div class="container">
      <div class="section-header">
        <div>
          <span class="section-eyebrow">OUR CURATED DEPARTMENTS</span>
          <h2 class="section-title">THE TZORAH EMPORIUM CATALOGUE</h2>
        </div>
        <NuxtLink to="/shop" class="section-link hover-underline">
          VIEW ALL DEPARTMENTS
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </NuxtLink>
      </div>

      <!-- Categories Grid Showcase -->
      <div class="departments-grid">
        <!-- 1. PERFUMES & SCENTS -->
        <div class="dept-card dept-card--featured">
          <div class="dept-card__bg">
            <img src="/images/or_hero.png" alt="Perfumes &amp; Scents" />
            <div class="dept-card__overlay"></div>
          </div>
          <div class="dept-card__content">
            <span class="dept-card__badge">SIGNATURE OLFACTORY</span>
            <h3 class="dept-card__title">PERFUMES &amp; ATTARS</h3>
            <p class="dept-card__desc">
              USA undiluted oil perfumes, royal Middle Eastern ouds &amp; authentic designer originals.
            </p>
            <div class="dept-card__sublinks">
              <NuxtLink to="/shop?cat=PERFUMES&sub=USA%20Oil%20Perfumes" class="sublink-pill">USA Oil Perfumes</NuxtLink>
              <NuxtLink to="/shop?cat=PERFUMES&sub=Middle%20Eastern%20Perfumes" class="sublink-pill">Middle Eastern</NuxtLink>
              <NuxtLink to="/shop?cat=PERFUMES&sub=Authentic%20Designer%20Perfumes" class="sublink-pill">Designer Scents</NuxtLink>
              <NuxtLink to="/shop?cat=PERFUMES&sub=Niche%20Products" class="sublink-pill">Niche Products</NuxtLink>
            </div>
            <NuxtLink to="/shop?cat=PERFUMES" class="btn btn-secondary dept-btn">SHOP PERFUMES</NuxtLink>
          </div>
        </div>

        <!-- 2. THE OILS BAR (All Oils under One Category with Subcategories) -->
        <div class="dept-card dept-card--featured">
          <div class="dept-card__bg">
            <img src="/images/or_oils.png" alt="The Oils Bar" />
            <div class="dept-card__overlay"></div>
          </div>
          <div class="dept-card__content">
            <span class="dept-card__badge">ALL IN ONE SPOT</span>
            <h3 class="dept-card__title">THE OILS BAR</h3>
            <p class="dept-card__desc">
              All therapeutic and cosmetic oils under one house, categorized into dedicated purity classes.
            </p>
            <div class="dept-card__sublinks">
              <NuxtLink to="/shop?cat=OILS&sub=Fragrance%20Oils" class="sublink-pill">Fragrance Oils</NuxtLink>
              <NuxtLink to="/shop?cat=OILS&sub=Essential%20Oils" class="sublink-pill">Essential Oils</NuxtLink>
              <NuxtLink to="/shop?cat=OILS&sub=Natural%20Oils" class="sublink-pill">Natural Carrier Oils</NuxtLink>
            </div>
            <NuxtLink to="/shop?cat=OILS" class="btn btn-secondary dept-btn">EXPLORE ALL OILS</NuxtLink>
          </div>
        </div>

        <!-- 3. CANDLE MAKING ACCESSORIES -->
        <div class="dept-card">
          <div class="dept-card__bg">
            <img src="/images/products/candle_1.png" alt="Candle Making Accessories" />
            <div class="dept-card__overlay"></div>
          </div>
          <div class="dept-card__content">
            <span class="dept-card__badge">ARTISAN CRAFT</span>
            <h3 class="dept-card__title">CANDLE MAKING</h3>
            <p class="dept-card__desc">
              100% natural soy wax flakes, cotton wick kits, and precision stainless pouring pitchers.
            </p>
            <NuxtLink to="/shop?cat=CANDLE%20MAKING%20ACCESSORIES" class="btn btn-secondary dept-btn">SHOP CANDLE SUPPLIES</NuxtLink>
          </div>
        </div>

        <!-- 4. UNSCENTED PRODUCTS -->
        <div class="dept-card">
          <div class="dept-card__bg">
            <img src="/images/products/unscented_1.png" alt="Unscented Products" />
            <div class="dept-card__overlay"></div>
          </div>
          <div class="dept-card__content">
            <span class="dept-card__badge">SENSITIVE CARE</span>
            <h3 class="dept-card__title">UNSCENTED CARE</h3>
            <p class="dept-card__desc">
              Fragrance-free whipped shea butters, hypoallergenic moisturizers &amp; gentle artisan bases.
            </p>
            <NuxtLink to="/shop?cat=UNSCENTED%20PRODUCTS" class="btn btn-secondary dept-btn">SHOP UNSCENTED</NuxtLink>
          </div>
        </div>

        <!-- 5. PET BODY CARE -->
        <div class="dept-card">
          <div class="dept-card__bg">
            <img src="/images/products/pet_1.png" alt="Pet Body Care Products" />
            <div class="dept-card__overlay"></div>
          </div>
          <div class="dept-card__content">
            <span class="dept-card__badge">GENTLE WELLNESS</span>
            <h3 class="dept-card__title">PET BODY CARE</h3>
            <p class="dept-card__desc">
              Soothing oatmeal shampoos, coat mists &amp; lick-safe organic paw &amp; nose balms.
            </p>
            <NuxtLink to="/shop?cat=PET%20BODY%20CARE%20PRODUCTS" class="btn btn-secondary dept-btn">SHOP PET CARE</NuxtLink>
          </div>
        </div>

        <!-- 6. ADULT SECTION (18+) -->
        <div class="dept-card dept-card--adult">
          <div class="dept-card__bg">
            <img src="/images/or_adult.png" alt="Adult Section 18+" />
            <div class="dept-card__overlay dept-card__overlay--adult"></div>
          </div>
          <div class="dept-card__content">
            <span class="dept-card__badge dept-card__badge--adult">PRIVATE SANCTUARY · 18+</span>
            <h3 class="dept-card__title">ADULT SECTION</h3>
            <p class="dept-card__desc">
              Body-safe silicone wellness toys &amp; fine Mulberry silk lingerie. 100% discreet packaging.
            </p>
            <div class="dept-card__sublinks">
              <NuxtLink to="/shop?cat=ADULT%20SECTION&sub=Adult%20Toys" class="sublink-pill sublink-pill--adult">Adult Toys</NuxtLink>
              <NuxtLink to="/shop?cat=ADULT%20SECTION&sub=Lingeries" class="sublink-pill sublink-pill--adult">Lingeries</NuxtLink>
            </div>
            <NuxtLink to="/shop?cat=ADULT%20SECTION" class="btn btn-primary dept-btn">ENTER BOUDOIR</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.departments {
  background-color: #f5f2ed;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.section-eyebrow {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  font-weight: 700;
  display: block;
  margin-bottom: 0.35rem;
}

.departments-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.dept-card--featured {
  grid-column: span 1;
}

.dept-card {
  position: relative;
  min-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2.25rem 2rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.dept-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
}

.dept-card__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.dept-card__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.dept-card:hover .dept-card__bg img {
  transform: scale(1.06);
}

.dept-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(14, 14, 14, 0.95) 0%, rgba(14, 14, 14, 0.6) 50%, rgba(14, 14, 14, 0.25) 100%);
}

.dept-card__overlay--adult {
  background: linear-gradient(to top, rgba(22, 10, 18, 0.96) 0%, rgba(22, 10, 18, 0.65) 50%, rgba(22, 10, 18, 0.3) 100%);
}

.dept-card__content {
  position: relative;
  z-index: 2;
  color: #ffffff;
}

.dept-card__badge {
  display: inline-block;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.dept-card__badge--adult {
  color: #f2a7be;
}

.dept-card__title {
  font-size: 1.85rem;
  font-weight: 300;
  letter-spacing: 0.06em;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.dept-card__desc {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.45;
  margin-bottom: 1.25rem;
}

.dept-card__sublinks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.sublink-pill {
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 500;
  padding: 0.3rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(4px);
  color: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.sublink-pill:hover {
  background-color: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

.sublink-pill--adult:hover {
  background-color: #d86888;
  border-color: #d86888;
}

.dept-btn {
  padding: 0.75rem 1.4rem;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  width: 100%;
  text-align: center;
}

@media (max-width: 1024px) {
  .departments-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .departments-grid {
    grid-template-columns: 1fr;
  }
  .dept-card {
    min-height: 360px;
  }
}
</style>
