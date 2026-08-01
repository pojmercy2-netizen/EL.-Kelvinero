<template>
  <div class="about-page">

    <!-- ───────────────────────────────────────── -->
    <!-- SECTION 1: Hero – Split layout            -->
    <!-- ───────────────────────────────────────── -->
    <section class="about-hero">
      <!-- Left: Text column -->
      <div class="about-hero__text">
        <span class="about-hero__eyebrow">ABOUT US</span>
        <h1 class="about-hero__title">More Than<br />Clothing.<br />It's a Statement.</h1>
        <div class="about-hero__divider"></div>
        <p class="about-hero__desc">
          EL. Kelvinero is a modern lifestyle brand built on the belief that true style is timeless.
          We create pieces that speak confidence, class, and individuality.
        </p>
        <NuxtLink to="/" class="about-btn about-btn--solid">OUR STORY</NuxtLink>
      </div>

      <!-- Right: Hero model image -->
      <div class="about-hero__image">
        <img src="/images/about_hero_model.png" alt="EL. Kelvinero model wearing cream tee" />
        <!-- Logo watermark overlay on image -->
        <div class="img-logo-overlay img-logo-overlay--br">
          <img src="/logo.png" alt="EL. Kelvinero" />
        </div>
      </div>
    </section>

    <!-- ───────────────────────────────────────── -->
    <!-- SECTION 2: Our Values                     -->
    <!-- ───────────────────────────────────────── -->
    <section class="about-values">
      <div class="container">
        <h2 class="about-values__heading">OUR VALUES</h2>
        <div class="about-values__grid">
          <div v-for="val in values" :key="val.label" class="about-values__item">
            <!-- Icon -->
            <div class="about-values__icon-wrap" v-html="val.icon"></div>
            <h4 class="about-values__label">{{ val.label }}</h4>
            <p class="about-values__desc">{{ val.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────────────────────────────────── -->
    <!-- SECTION 3: Crafted to Last – Split layout -->
    <!-- ───────────────────────────────────────── -->
    <section class="about-craft">
      <!-- Left: text -->
      <div class="about-craft__text">
        <span class="about-craft__eyebrow">CRAFTED TO LAST</span>
        <h2 class="about-craft__title">Timeless by Design.<br />Made to Endure.</h2>
        <div class="about-craft__divider"></div>
        <p class="about-craft__desc">
          Every piece is thoughtfully designed and meticulously crafted to deliver lasting
          comfort, exceptional quality, and a fit that stands the test of time.
        </p>
        <button class="about-btn about-btn--outline">LEARN MORE</button>
      </div>

      <!-- Right: label/collar image -->
      <div class="about-craft__image">
        <img src="/images/about_label_collar.png" alt="EL. Kelvinero woven label detail" />
        <!-- Logo watermark overlay -->
        <div class="img-logo-overlay img-logo-overlay--br">
          <img src="/logo.png" alt="EL. Kelvinero" />
        </div>
      </div>
    </section>

    <!-- ───────────────────────────────────────── -->
    <!-- SECTION 4: Mission – Dark split section   -->
    <!-- ───────────────────────────────────────── -->
    <section class="about-mission">
      <!-- Left: dark background image panel -->
      <div class="about-mission__image">
        <img src="/images/brand_bg.png" alt="EL. Kelvinero wardrobe studio" />
        <div class="about-mission__image-overlay"></div>
        <!-- Logo centred on image panel -->
        <div class="about-mission__logo-wrap">
          <img src="/logo.png" alt="EL. Kelvinero" class="about-mission__logo" />
        </div>
      </div>

      <!-- Right: text panel (dark background) -->
      <div class="about-mission__text">
        <span class="about-mission__eyebrow">OUR MISSION</span>
        <h2 class="about-mission__title">Elevate Everyday.</h2>
        <p class="about-mission__desc">
          Our mission is simple: to elevate everyday style with timeless designs and unmatched
          quality—empowering you to be your best self, every day.
        </p>
        <button class="about-btn about-btn--outline-light">JOIN THE JOURNEY</button>
      </div>
    </section>

    <!-- ───────────────────────────────────────── -->
    <!-- SECTION 5: Footer feature pillars         -->
    <!-- ───────────────────────────────────────── -->
    <FooterFeatures />

  </div>
</template>

<script setup>
useHead({
  title: 'About Us | EL. Kelvinero',
  meta: [{ name: 'description', content: 'Learn about EL. Kelvinero — a modern lifestyle brand built on the belief that true style is timeless.' }]
})

const values = [
  {
    label: 'QUALITY',
    desc: 'We use premium materials and pay attention to every detail.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/></svg>`
  },
  {
    label: 'INTEGRITY',
    desc: 'Honest in our process. Transparent in our relationships.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/></svg>`
  },
  {
    label: 'INDIVIDUALITY',
    desc: 'Designed for those who lead, inspire, and stand out.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    label: 'IMPACT',
    desc: 'Creating with purpose and giving back to the community.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  }
]
</script>

<style scoped>
/* ─── Shared Tokens ───────────────────────────── */
.about-page {
  background-color: var(--color-bg-light);
}

.about-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.85rem 2rem;
}

.about-btn--solid {
  background-color: var(--color-text-dark);
  color: #ffffff;
  border: 1px solid var(--color-text-dark);
}
.about-btn--solid:hover {
  background-color: transparent;
  color: var(--color-text-dark);
}

.about-btn--outline {
  background-color: transparent;
  color: var(--color-text-dark);
  border: 1px solid rgba(0, 0, 0, 0.3);
}
.about-btn--outline:hover {
  background-color: var(--color-text-dark);
  color: #ffffff;
  border-color: var(--color-text-dark);
}

.about-btn--outline-light {
  background-color: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.about-btn--outline-light:hover {
  background-color: #ffffff;
  color: var(--color-text-dark);
}

/* ─── Section 1: Hero ─────────────────────────── */
.about-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 520px;
}

.about-hero__text {
  padding: 4rem 3rem 4rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--color-bg-light);
}

.about-hero__eyebrow {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
  display: block;
}

.about-hero__title {
  font-family: var(--font-serif);
  font-size: 2.6rem;
  font-weight: 400;
  line-height: 1.2;
  color: var(--color-text-dark);
  margin-bottom: 1.25rem;
}

.about-hero__divider {
  width: 36px;
  height: 2px;
  background-color: var(--color-accent);
  margin-bottom: 1.5rem;
}

.about-hero__desc {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  max-width: 340px;
}

.about-hero__image {
  position: relative;
  overflow: hidden;
  background-color: #d9cfc5;
}

.about-hero__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

/* ─── Shared: Logo watermark overlay (used on all clothing images) ── */
.img-logo-overlay {
  position: absolute;
  width: 80px;
  opacity: 0.55;
  pointer-events: none;
}

.img-logo-overlay img {
  width: 100%;
  height: auto;
  display: block;
  filter: brightness(0) invert(1);
}

/* Bottom-right corner variant */
.img-logo-overlay--br {
  bottom: 1.25rem;
  right: 1.25rem;
}

/* ─── Section 2: Values ───────────────────────── */
.about-values {
  padding: 4rem 0;
  background-color: var(--color-bg-light);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.about-values__heading {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--color-text-dark);
}

.about-values__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.about-values__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 1rem;
}

.about-values__icon-wrap {
  color: var(--color-text-dark);
  margin-bottom: 1rem;
  opacity: 0.8;
}

.about-values__label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin-bottom: 0.6rem;
  color: var(--color-text-dark);
}

.about-values__desc {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

/* ─── Section 3: Craft ────────────────────────── */
.about-craft {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: var(--color-bg-light);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.about-craft__text {
  padding: 4rem 3rem 4rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.about-craft__eyebrow {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
  display: block;
}

.about-craft__title {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 400;
  line-height: 1.25;
  color: var(--color-text-dark);
  margin-bottom: 1.25rem;
}

.about-craft__divider {
  width: 36px;
  height: 2px;
  background-color: var(--color-accent);
  margin-bottom: 1.5rem;
}

.about-craft__desc {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  max-width: 360px;
}

.about-craft__image {
  position: relative;
  overflow: hidden;
  background-color: #e8e0d6;
  min-height: 400px;
}

.about-craft__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ─── Section 4: Mission ──────────────────────── */
.about-mission {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 380px;
}

.about-mission__image {
  position: relative;
  overflow: hidden;
  background-color: #2a2520;
}

.about-mission__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.55;
}

.about-mission__image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(17, 17, 17, 0.35);
}

.about-mission__logo-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-mission__logo {
  width: 110px;
  filter: invert(1) brightness(2);
  opacity: 0.9;
}

.about-mission__text {
  background-color: #2e2a25;
  color: #ffffff;
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.about-mission__eyebrow {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  margin-bottom: 1.25rem;
  display: block;
}

.about-mission__title {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 400;
  line-height: 1.25;
  color: #ffffff;
  margin-bottom: 1.25rem;
}

.about-mission__desc {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 2rem;
  max-width: 340px;
}

/* ─── Responsive: stack on mobile (≤768px) ────── */
@media (max-width: 768px) {
  /* Section 1 */
  .about-hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }

  /* Image comes first on mobile (top) */
  .about-hero__image {
    order: -1;
    height: 60vw;
    min-height: 260px;
    max-height: 380px;
  }

  .about-hero__text {
    padding: 2.5rem 1.5rem;
  }

  .about-hero__title {
    font-size: 2rem;
  }

  .about-hero__desc {
    max-width: 100%;
  }

  /* Values: 2x2 grid */
  .about-values {
    padding: 3rem 0;
  }

  .about-values__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem 1rem;
  }

  /* Section 3 */
  .about-craft {
    grid-template-columns: 1fr;
  }

  /* image goes on top */
  .about-craft__image {
    order: -1;
    min-height: 55vw;
  }

  .about-craft__text {
    padding: 2.5rem 1.5rem;
  }

  .about-craft__title {
    font-size: 1.85rem;
  }

  .about-craft__desc {
    max-width: 100%;
  }

  /* Section 4 */
  .about-mission {
    grid-template-columns: 1fr;
    grid-template-rows: 260px auto;
  }

  .about-mission__text {
    padding: 2.5rem 1.5rem;
  }

  .about-mission__title {
    font-size: 1.85rem;
  }

  .about-mission__desc {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .about-hero__title {
    font-size: 1.75rem;
  }

  .about-values__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-craft__title {
    font-size: 1.6rem;
  }

  .about-mission__title {
    font-size: 1.6rem;
  }
}
</style>
