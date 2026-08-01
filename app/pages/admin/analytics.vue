<template>
  <div class="admin-analytics">
    <!-- Header -->
    <div class="analytics-header animate-fade-in">
      <div>
        <h1 class="page-title">Business Analytics</h1>
        <p class="page-subtitle">Granular store performance metrics, revenue logs, and sales ratios.</p>
      </div>
      <div class="analytics-filters">
        <select v-model="selectedTimeframe" class="filter-select">
          <option value="7d">LAST 7 DAYS</option>
          <option value="30d">LAST 30 DAYS</option>
          <option value="12m">LAST 12 MONTHS</option>
          <option value="ytd">YEAR TO DATE</option>
        </select>
      </div>
    </div>

    <!-- Analytics KPIs -->
    <div class="kpi-row animate-fade-in">
      <div v-for="stat in performanceStats" :key="stat.label" class="mini-stat-card">
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value font-mono">{{ stat.value }}</span>
        <span :class="['stat-change', stat.up ? 'change-up' : 'change-down']">
          {{ stat.change }}
        </span>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="dashboard-grid animate-fade-in">
      <!-- Main Revenue Over Time SVG Chart -->
      <div class="admin-card span-8">
        <div class="card-header-flex">
          <h2 class="admin-card-title">NET REVENUE INDEX</h2>
          <span class="badge-timeframe">{{ timeframeLabel }}</span>
        </div>

        <div class="chart-container">
          <svg viewBox="0 0 600 240" class="analytics-svg">
            <defs>
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#b89874" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#b89874" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Horizontal Grid lines -->
            <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.03)" />
            <line x1="40" y1="70" x2="580" y2="70" stroke="rgba(255,255,255,0.03)" />
            <line x1="40" y1="120" x2="580" y2="120" stroke="rgba(255,255,255,0.03)" />
            <line x1="40" y1="170" x2="580" y2="170" stroke="rgba(255,255,255,0.03)" />
            <line x1="40" y1="210" x2="580" y2="210" stroke="rgba(255,255,255,0.08)" />

            <!-- Y Axis labels -->
            <text x="15" y="24" class="axis-lbl">$50k</text>
            <text x="15" y="74" class="axis-lbl">$35k</text>
            <text x="15" y="124" class="axis-lbl">$20k</text>
            <text x="15" y="174" class="axis-lbl">$5k</text>

            <!-- Area under the curve -->
            <path
              :d="revenueAreaPath"
              fill="url(#area-gradient)"
            />

            <!-- Line Curve -->
            <path
              :d="revenueLinePath"
              fill="none"
              stroke="#b89874"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Points on peaks -->
            <circle cx="130" cy="140" r="4" fill="#b89874" stroke="#111111" stroke-width="1.5" />
            <circle cx="220" cy="90" r="4" fill="#b89874" stroke="#111111" stroke-width="1.5" />
            <circle cx="310" cy="130" r="4" fill="#b89874" stroke="#111111" stroke-width="1.5" />
            <circle cx="400" cy="60" r="4" fill="#b89874" stroke="#111111" stroke-width="1.5" />
            <circle cx="490" cy="80" r="4" fill="#b89874" stroke="#111111" stroke-width="1.5" />
            <circle cx="580" cy="30" r="4" fill="#b89874" stroke="#111111" stroke-width="1.5" />

            <!-- X Axis labels -->
            <text x="40" y="230" class="axis-lbl text-center">JAN</text>
            <text x="130" y="230" class="axis-lbl text-center">MAR</text>
            <text x="220" y="230" class="axis-lbl text-center">MAY</text>
            <text x="310" y="230" class="axis-lbl text-center">JUL</text>
            <text x="400" y="230" class="axis-lbl text-center">SEP</text>
            <text x="490" y="230" class="axis-lbl text-center">NOV</text>
            <text x="580" y="230" class="axis-lbl text-center">DEC</text>
          </svg>
        </div>
      </div>

      <!-- Categories Division SVG Donut / Segment -->
      <div class="admin-card span-4">
        <h2 class="admin-card-title">CATEGORY DEMAND SHARE</h2>
        <div class="donut-container">
          <svg viewBox="0 0 200 200" class="donut-svg">
            <!-- Background base circle -->
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="15" />

            <!-- Category Segments (styled in percentages) -->
            <!-- T-SHIRTS: 35% -> stroke-dasharray="153.9 439.8" stroke-dashoffset="0" -->
            <circle cx="100" cy="100" r="70" fill="none" stroke="#b89874" stroke-width="15" 
                    stroke-dasharray="153.9 439.8" stroke-dashoffset="0" stroke-linecap="round" />

            <!-- HOODIES: 25% -> stroke-dasharray="110 439.8" stroke-dashoffset="-153.9" -->
            <circle cx="100" cy="100" r="70" fill="none" stroke="#d4d4d8" stroke-width="15" 
                    stroke-dasharray="110 439.8" stroke-dashoffset="-153.9" stroke-linecap="round" />

            <!-- ACCESSORIES: 20% -> stroke-dasharray="88 439.8" stroke-dashoffset="-263.9" -->
            <circle cx="100" cy="100" r="70" fill="none" stroke="#4b5563" stroke-width="15" 
                    stroke-dasharray="88 439.8" stroke-dashoffset="-263.9" stroke-linecap="round" />

            <!-- PANTS/OTHERS: 20% -> stroke-dasharray="88 439.8" stroke-dashoffset="-351.9" -->
            <circle cx="100" cy="100" r="70" fill="none" stroke="#27272a" stroke-width="15" 
                    stroke-dasharray="88 439.8" stroke-dashoffset="-351.9" stroke-linecap="round" />

            <!-- Donut Hole Label -->
            <text x="100" y="98" text-anchor="middle" class="donut-mid-val font-mono">14.6K</text>
            <text x="100" y="115" text-anchor="middle" class="donut-mid-lbl">ITEMS SOLD</text>
          </svg>
        </div>

        <div class="legend-list">
          <div class="legend-row">
            <span class="legend-color-dot" style="background-color: #b89874"></span>
            <span class="legend-cat">T-Shirts</span>
            <span class="legend-pct font-mono">35%</span>
          </div>
          <div class="legend-row">
            <span class="legend-color-dot" style="background-color: #d4d4d8"></span>
            <span class="legend-cat">Hoodies</span>
            <span class="legend-pct font-mono">25%</span>
          </div>
          <div class="legend-row">
            <span class="legend-color-dot" style="background-color: #4b5563"></span>
            <span class="legend-cat">Accessories</span>
            <span class="legend-pct font-mono">20%</span>
          </div>
          <div class="legend-row">
            <span class="legend-color-dot" style="background-color: #27272a"></span>
            <span class="legend-cat">Others</span>
            <span class="legend-pct font-mono">20%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Traffic Channels & Detailed Performance logs -->
    <div class="dashboard-grid animate-fade-in pt-2">
      <!-- Traffic Sources -->
      <div class="admin-card span-5">
        <h2 class="admin-card-title">ACQUISITION SOURCE SHARES</h2>
        <div class="channels-list">
          <div v-for="channel in trafficChannels" :key="channel.source" class="channel-bar-row">
            <div class="channel-info-row">
              <span class="channel-name">{{ channel.source }}</span>
              <span class="channel-value font-mono">{{ channel.pct }}%</span>
            </div>
            <div class="channel-progress-track">
              <div class="channel-progress-fill" :style="{ width: channel.pct + '%', backgroundColor: channel.color }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Leaderboard -->
      <div class="admin-card span-7">
        <h2 class="admin-card-title">PRODUCT VOLUME PERFORMANCE LOG</h2>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>UNITS SOLD</th>
                <th>CONVERSION RATIO</th>
                <th>GROSS REVENUE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in sortedLeaderboard" :key="prod.id" class="table-row">
                <td class="product-leader-cell">
                  <span class="leader-name">{{ prod.name }}</span>
                  <span class="leader-cat">{{ prod.category }}</span>
                </td>
                <td class="font-mono">{{ prod.salesCount }} pcs</td>
                <td class="font-mono">{{ prod.conversion }}%</td>
                <td class="font-semibold text-white font-mono">${{ prod.revenue.toLocaleString() }}.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Reports & Analytics | EL. Kelvinero Admin',
  meta: [{ name: 'description', content: 'Detailed analysis reports, performance indexes, and sales charts.' }]
})

const selectedTimeframe = ref('ytd')

const timeframeLabel = computed(() => {
  const map = {
    '7d': 'Last 7 Days Index',
    '30d': 'Last 30 Days Index',
    '12m': 'Fiscal 12-Month Curve',
    'ytd': 'Year To Date Metrics'
  }
  return map[selectedTimeframe.value]
})

// Mock Revenue Curve Data points (X, Y)
// X starts from 50 (JAN) to 580 (DEC) with steps of 88px
// Y starts from 210 (0 revenue) to 20 (high revenue)
const revenueAreaPath = computed(() => {
  if (selectedTimeframe.value === '7d') {
    return 'M 50,190 L 130,170 L 220,185 L 310,130 L 400,140 L 490,95 L 580,60 L 580,210 L 50,210 Z'
  }
  // Default YTD/12M curve
  return 'M 50,180 L 130,140 L 220,90 L 310,130 L 400,60 L 490,80 L 580,30 L 580,210 L 50,210 Z'
})

const revenueLinePath = computed(() => {
  if (selectedTimeframe.value === '7d') {
    return 'M 50,190 L 130,170 L 220,185 L 310,130 L 400,140 L 490,95 L 580,60'
  }
  return 'M 50,180 L 130,140 L 220,90 L 310,130 L 400,60 L 490,80 L 580,30'
})

// Stats row metrics
const performanceStats = ref([
  { label: 'GROSS MERCHANDISE VALUE', value: '$84,650.00', change: '+14.2%', up: true },
  { label: 'AVERAGE BASKET SIZE', value: '$135.50', change: '+2.1%', up: true },
  { label: 'STORE SESSIONS', value: '42,192', change: '-4.6%', up: false },
  { label: 'CHECKOUT CONVERSION', value: '3.12%', change: '+0.4%', up: true }
])

// Acquisition channels
const trafficChannels = ref([
  { source: 'Direct Access', pct: 42, color: '#b89874' },
  { source: 'Instagram / Organic Social', pct: 31, color: '#a1805c' },
  { source: 'Newsletter Campaign', pct: 15, color: '#4b5563' },
  { source: 'Search Referrals (Google)', pct: 12, color: '#27272a' }
])

// Leaderboard products
const leaderboardProducts = ref([
  { id: 'p1', name: 'SIGNATURE TEE', category: 'T-SHIRTS', salesCount: 142, revenue: 8378, conversion: 4.2 },
  { id: 'p2', name: 'CLASSIC HOODIE', category: 'HOODIES', salesCount: 98, revenue: 8722, conversion: 3.8 },
  { id: 'p5', name: 'HERITAGE TEE', category: 'T-SHIRTS', salesCount: 110, revenue: 7150, conversion: 3.5 },
  { id: 'p4', name: 'KNIT POLO', category: 'POLOS', salesCount: 76, revenue: 6764, conversion: 2.9 },
  { id: 'p3', name: 'OVERSIZE SWEATSHIRT', category: 'HOODIES', salesCount: 84, revenue: 6636, conversion: 3.1 }
])

const sortedLeaderboard = computed(() => {
  return [...leaderboardProducts.value].sort((a, b) => b.revenue - a.revenue)
})
</script>

<style scoped>
.admin-analytics {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.page-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.filter-select {
  background-color: #141414;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #ffffff;
  padding: 0.55rem 1.5rem 0.55rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  outline: none;
  cursor: pointer;
  text-transform: uppercase;
  border-radius: 2px;
}

/* Stat row cards */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.mini-stat-card {
  background-color: #141414;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.25rem;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.stat-change {
  font-size: 0.68rem;
  font-weight: 600;
}

.change-up {
  color: #10b981;
}

.change-down {
  color: #e25c5c;
}

/* Grid Layouts */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.span-8 {
  grid-column: span 8;
}

.span-7 {
  grid-column: span 7;
}

.span-5 {
  grid-column: span 5;
}

.span-4 {
  grid-column: span 4;
}

.pt-2 {
  padding-top: 0.5rem;
}

/* Card Header Flex */
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.badge-timeframe {
  font-size: 0.65rem;
  background-color: rgba(184, 152, 116, 0.1);
  color: #b89874;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* SVG Chart Container */
.chart-container {
  width: 100%;
}

.analytics-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.axis-lbl {
  font-size: 8px;
  fill: rgba(255, 255, 255, 0.35);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.text-center {
  text-anchor: middle;
}

/* Donut Chart visual */
.donut-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
  margin-bottom: 1rem;
}

.donut-svg {
  width: 170px;
  height: 170px;
  transform: rotate(-90deg); /* align top start */
}

.donut-mid-val {
  font-size: 16px;
  font-weight: 700;
  fill: #ffffff;
  transform: rotate(90deg);
  transform-origin: 100px 100px;
}

.donut-mid-lbl {
  font-size: 6px;
  font-weight: 700;
  fill: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.1em;
  transform: rotate(90deg);
  transform-origin: 100px 100px;
}

/* Legend items */
.legend-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-row {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}

.legend-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.legend-cat {
  color: rgba(255, 255, 255, 0.6);
  flex: 1;
}

.legend-pct {
  color: #ffffff;
  font-weight: 600;
}

/* Acquisition source logs */
.channels-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem 0;
}

.channel-bar-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.channel-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
}

.channel-name {
  color: rgba(255, 255, 255, 0.7);
}

.channel-value {
  color: #ffffff;
  font-weight: 600;
}

.channel-progress-track {
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.channel-progress-fill {
  height: 100%;
  border-radius: 2px;
}

/* Leaderboard Cells specific */
.product-leader-cell {
  display: flex;
  flex-direction: column;
}

.leader-name {
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.leader-cat {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.1rem;
}

@media (max-width: 1024px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .span-8, .span-7, .span-5, .span-4 {
    grid-column: span 12;
  }
}

@media (max-width: 640px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }
  .analytics-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .analytics-filters {
    width: 100%;
  }
  .analytics-filters select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .card-header-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .donut-container {
    height: 150px;
  }
  .donut-svg {
    width: 140px;
    height: 140px;
  }
}
</style>

