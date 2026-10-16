<template>
  <section id="home" class="hero">
    <div class="hero__bg-container">
      <img src="/hero_fragrances.jpg" alt="TZORAH EMPORIUM Perfumes, Oils and Lifestyle" class="hero__bg-img" />
      <div class="hero__overlay"></div>
    </div>
    
    <div class="container hero__container">
      <div class="hero__content animate-fade-in">
        <span class="hero__subtitle">TZORAH EMPORIUM</span>
        <h1 class="hero__title">THE ALCHEMY OF<br />SCENTS & OILS.</h1>
        <div class="hero__divider"></div>
        <p class="hero__description">
          Imported USA perfume oils, royal Arabian attars, pure essential & natural carrier oils, artisan candle crafting, and discreet adult luxuries.
        </p>
        <div class="hero__actions">
          <NuxtLink to="/shop" class="btn btn-primary">EXPLORE STORE</NuxtLink>
          <NuxtLink to="/shop?cat=OILS" class="btn btn-secondary">THE OILS BAR</NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- Subtle Scroll Down Indicator -->
    <div class="hero__scroll-indicator">
      <span class="scroll-text">SCROLL</span>
      <span class="scroll-line"></span>
    </div>
  </section>
</template>

<script setup>
// Hero Section is stateless and relies purely on standard styling and animations
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 85vh;
  min-height: 580px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-bg-dark);
  padding: 2rem 0 3.5rem 0;
}

.hero__bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  transform: scale(1.05);
  animation: slowZoom 20s ease-out forwards;
}

.hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(17, 17, 17, 0.52);
}

.hero__container {
  position: relative;
  z-index: 2;
  transform: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero__content {
  max-width: 620px;
  width: 100%;
  color: var(--color-text-light);
  text-align: center;
}

.hero__subtitle {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
  display: inline-block;
  text-transform: uppercase;
}

.hero__title {
  font-size: 3.4rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  line-height: 1.1;
  margin-bottom: 1rem;
  text-transform: uppercase;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.hero__divider {
  width: 50px;
  height: 2px;
  background-color: var(--color-accent);
  margin: 0 auto 1.25rem auto;
}

.hero__description {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.5rem;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.hero__actions {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.hero__actions .btn {
  min-width: 160px;
  padding: 0.7rem 1.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

/* Scroll down indicator */
.hero__scroll-indicator {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.7;
}

.scroll-text {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--color-text-light);
  font-weight: 500;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--color-text-light), transparent);
  animation: scrollDown 2s ease-in-out infinite;
}

/* Animations */
@keyframes slowZoom {
  to {
    transform: scale(1);
  }
}

@keyframes scrollDown {
  0% {
    transform: scaleY(0);
    transform-origin: top;
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
  }
  51% {
    transform: scaleY(1);
    transform-origin: bottom;
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
  }
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .hero {
    height: 68vh;
    min-height: 440px;
    padding-top: 1.5rem;
  }

  .hero__container {
    transform: none;
  }

  .hero__subtitle {
    font-size: 0.72rem;
  }

  .hero__title {
    font-size: 2.8rem;
  }

  .hero__description {
    font-size: 1rem;
    max-width: 380px;
  }

  .hero__actions .btn {
    min-width: 145px;
    padding: 0.72rem 1.2rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 576px) {
  .hero {
    height: 62vh;
    min-height: 380px;
    padding-top: 1rem;
  }

  .hero__container {
    transform: translateY(0);
  }

  .hero__subtitle {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
  }

  .hero__title {
    font-size: 2.1rem;
    margin-bottom: 0.85rem;
  }

  .hero__description {
    font-size: 0.9rem;
    line-height: 1.55;
    margin-bottom: 1.25rem;
  }

  .hero__actions {
    flex-direction: column;
    width: 100%;
    gap: 0.85rem;
  }

  .hero__actions .btn {
    width: 100%;
    font-size: 0.7rem;
  }

  .hero__scroll-indicator {
    display: none;
  }
}

@media (max-width: 400px) {
  .hero {
    height: 52vh;
    min-height: 320px;
  }

  .hero__title {
    font-size: 1.75rem;
  }

  .hero__description {
    font-size: 0.82rem;
  }
}
</style>
