<template>
  <section id="lookbook" class="brand-statement">
    <div class="brand-statement__wrapper">
      <!-- Left Column (Brand philosophy) -->
      <div class="brand-statement__content">
        <h2 class="brand-statement__title">
          BEYOND TRENDS.<br />BEYOND SEASONS.
        </h2>
        <div class="brand-statement__divider"></div>
        <p class="brand-statement__text">
          EL. Kelvinero pieces are designed to move with you—every day, everywhere.
        </p>
        <button class="btn btn-secondary" @click="discoverMore">DISCOVER MORE</button>
      </div>
      
      <!-- Right Column (Visual asset and logo overlay) -->
      <div class="brand-statement__visual">
        <img src="/images/brand_bg.png" alt="Fabric details of EL. Kelvinero garments" class="brand-statement__bg-image" />
        <div class="brand-statement__visual-overlay"></div>
        <div class="brand-statement__logo-wrapper">
          <!-- Inverting the black logo using CSS filter to make it silver/white -->
          <img src="/logo.png" alt="EL. Kelvinero Logo Shield" class="brand-statement__brand-seal" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const discoverMore = () => {
  const toasts = useState('toasts', () => [])
  toasts.value.push({
    id: Date.now(),
    message: 'Lookbook collection release details coming soon!'
  })
}
</script>

<style scoped>
.brand-statement {
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  overflow: hidden;
  width: 100%;
}

.brand-statement__wrapper {
  display: flex;
  min-height: 520px;
}

/* Left Content Pane */
.brand-statement__content {
  flex: 1;
  width: 45%;
  background-color: #121212;
  padding: var(--spacing-xl) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
}

.brand-statement__title {
  font-size: 3.25rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.brand-statement__divider {
  width: 50px;
  height: 1px;
  background-color: var(--color-accent);
  margin-bottom: 2rem;
}

.brand-statement__text {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  max-width: 420px;
  margin-bottom: 3rem;
}

.brand-statement__content .btn {
  min-width: 180px;
}

/* Right Visual Pane */
.brand-statement__visual {
  flex: 1.2;
  width: 55%;
  position: relative;
  min-height: 400px;
  background-color: #0b0b0b;
}

.brand-statement__bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.75;
}

.brand-statement__visual-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(18, 18, 18, 1) 0%,
    rgba(18, 18, 18, 0.4) 30%,
    transparent 100%
  );
}

.brand-statement__logo-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.brand-statement__brand-seal {
  width: 250px;
  height: auto;
  opacity: 0.95;
  /* Convert black logo to white/silver */
  filter: brightness(0) invert(1);
  pointer-events: none;
}

/* Responsive configurations */
@media (max-width: 992px) {
  .brand-statement__wrapper {
    flex-direction: column;
  }
  
  .brand-statement__content {
    width: 100%;
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .brand-statement__visual {
    width: 100%;
    min-height: 350px;
  }
  
  .brand-statement__visual-overlay {
    background: linear-gradient(
      to bottom,
      rgba(18, 18, 18, 1) 0%,
      rgba(18, 18, 18, 0.3) 30%,
      transparent 100%
    );
  }
  
  .brand-statement__brand-seal {
    width: 180px;
  }
  
  .brand-statement__title {
    font-size: 2.5rem;
  }
}
</style>
