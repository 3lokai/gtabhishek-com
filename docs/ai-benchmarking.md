# AI Benchmark Dashboard - Single Page PRD
**URL**: gtabhishek.com/benchmarks  
**Purpose**: One beautiful page showcasing local AI model performance  
**Timeline**: 1 week to launch  

---

## 🎯 Product Vision

A single, scrollable page that tells the complete story of your AI benchmark lab. Think **Apple product page** meets **interactive data viz**. Beautiful, fast, mobile-perfect.

### Core Principles
1. **One Page, Complete Story**: Hero → Results → Methodology → Footer
2. **Scroll-Driven**: Each section reveals as you scroll
3. **Mobile First**: Perfect on phone, enhanced on desktop
4. **Interactive**: Click scores to see responses, filter data, explore
5. **Fast**: <2s load time, smooth 60fps scrolling

---

## 📱 Page Structure

### Section 1: Hero (Viewport 1)
```
[Full screen, animated gradient background]

Large heading: "AI Benchmark Lab"
Subheading: "Testing 6 local models × 9 professional roles on consumer hardware"

Live stats (animated counters):
┌─────────────┬─────────────┬─────────────┐
│ 120+ Tests  │  6 Models   │  9 Roles    │
└─────────────┴─────────────┴─────────────┘

Scroll indicator (animated arrow)
```

**Design Notes**:
- Gradient animates subtly
- Stats count up on load
- Parallax effect on scroll
- Clean, premium feel

---

### Section 2: Quick Winners (Scroll Section)
```
[3-card grid, glassmorphism style]

┌────────────────────────────────────────┐
│  🚀 Speed Champion                      │
│  phi:latest                            │
│  4.2s average response                 │
│  [View Results →]                      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  🏆 Quality Leader                      │
│  mistral:latest                        │
│  7.8/10 average score                  │
│  [View Results →]                      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  ⭐ Best Overall                        │
│  llama3.2:latest                       │
│  Balanced speed + quality              │
│  [View Results →]                      │
└────────────────────────────────────────┘
```

**Interaction**:
- Cards slide in on scroll
- Click "View Results" → Scroll to matrix, pre-filter that model

---

### Section 3: Performance Matrix (Main Content)
```
[Sticky filter bar at top]
Filters: [Model ▼] [Role ▼] [Score Range ——●——] [Reset]

[Responsive table]
┌─────────────┬──────┬──────┬──────┬──────┬──────┬─────┐
│ Model       │ Dev  │ Arch │ Logic│ Chat │ Agent│ ... │
├─────────────┼──────┼──────┼──────┼──────┼──────┼─────┤
│ phi:latest  │ 8.1  │ 5.9  │ 7.8  │ 9.2  │ 5.3  │ ... │
│ llama3.2    │ 5.6  │ 7.7  │ 7.5  │ 8.4  │ 6.6  │ ... │
│ mistral     │ 4.8  │ 8.4  │ 9.0  │ 7.4  │ 6.4  │ ... │
└─────────────┴──────┴──────┴──────┴──────┴──────┴─────┘

[Color-coded cells: Green (9+), Blue (7-9), Orange (5-7), Red (<5)]
```

**Interaction**:
- Click any cell → Modal with full response
- Hover cell → Tooltip with response time
- Mobile: Horizontal scroll, sticky left column
- Filter updates table + URL params

**Modal** (opens on cell click):
```
┌─────────────────────────────────────────┐
│  phi:latest → Senior Dev              × │
├─────────────────────────────────────────┤
│  Score: 8.1/10    Time: 4.5s            │
│                                         │
│  📋 Test Prompt                         │
│  [Code block with copy button]          │
│                                         │
│  💬 Model Response                      │
│  [Scrollable response with syntax       │
│   highlighting, copy button]            │
│                                         │
│  📊 Scoring Breakdown                   │
│  ✓ Syntax Valid     100%               │
│  ✓ Tests Pass       100%               │
│  ⚠ Code Quality      80%               │
│  ✗ Documentation      0%               │
└─────────────────────────────────────────┘
```

---

### Section 4: Visual Insights (Charts)
```
[2-column grid on desktop, stacked on mobile]

Chart 1: Response Time Comparison
[Bar chart: Models on X, Time on Y]
- Animated bars
- Interactive tooltips

Chart 2: Quality Distribution
[Radar chart: 5 dimensions]
- Top 3 models overlaid
- Toggle model visibility
```

**Design**:
- Charts animate in on scroll
- Clean, minimal axes
- Color-matched to brand

---

### Section 5: Methodology (Accordion)
```
[Expandable sections]

▼ What is this?
  Role-based testing of local LLMs on consumer hardware
  (RTX 3060 12GB). Real constraints, real performance.

▼ Testing Framework
  • 9 professional roles (coding, architecture, reasoning...)
  • Objective scoring (code execution, math verification)
  • 120+ tests run monthly

▼ Why This Matters
  Most benchmarks assume unlimited compute. This shows
  what's actually possible on $400 hardware.

▼ Tech Stack
  • Models: Ollama (local inference)
  • Infrastructure: Docker, Postgres, n8n
  • Automation: Scheduled tests, Slack alerts
  • Frontend: Next.js, React, Tailwind

▼ Open Source
  [GitHub links to relevant repos]
```

**Design**:
- Smooth expand/collapse animations
- Icons for each section
- Links open in new tab

---

### Section 6: Footer
```
Built with Next.js + Postgres
Benchmarks run monthly on local hardware
Last updated: Oct 2025

[GitHub] [LinkedIn] [Back to gtabhishek.com]
```

---

## 🔌 API Design (Simplified)

### Single Endpoint Does Everything

**GET /api/benchmarks**
```typescript
Query params:
  - model?: string[]      // Filter by models
  - role?: string[]       // Filter by roles
  - minScore?: number     // Score range
  - maxScore?: number
  - summary?: boolean     // If true, return aggregated stats

Response:
{
  summary: {
    totalTests: 120,
    models: 6,
    roles: 9,
    speedChampion: { model: 'phi:latest', time: 4.2 },
    qualityChampion: { model: 'mistral:latest', score: 7.8 },
    lastUpdated: '2025-01-15'
  },
  matrix: [
    {
      model: 'phi:latest',
      scores: {
        senior_dev: { score: 8.1, time: 4.5, id: 123 },
        architect: { score: 5.9, time: 8.2, id: 124 },
        // ... all 9 roles
      }
    },
    // ... all 6 models
  ],
  chartData: {
    responseTimes: [...],
    qualityDistribution: [...]
  }
}
```

**GET /api/benchmarks/[id]**
```typescript
// Get single benchmark result for modal
Response:
{
  id: 123,
  model: 'phi:latest',
  role: 'senior_dev',
  score: 8.1,
  time: 4.5,
  prompt: '...',
  response: '...',
  breakdown: {
    syntax_valid: 1,
    tests_pass: 1,
    code_quality: 0.8,
    documentation: 0
  }
}
```

---

## 🛠️ Technical Stack

```json
{
  "frontend": {
    "framework": "Next.js 14",
    "language": "TypeScript",
    "styling": "Tailwind + shadcn/ui",
    "animations": "Framer Motion",
    "charts": "Recharts",
    "syntax": "Prism.js"
  },
  "backend": {
    "database": "PostgreSQL (existing)",
    "api": "Next.js API routes",
    "caching": "ISR (revalidate: 3600)"
  },
  "deployment": {
    "hosting": "Vercel",
    "domain": "gtabhishek.com/benchmarks"
  }
}
```

---

## 📦 Project Structure

```
ai-benchmark-page/
├── app/
│   └── benchmarks/
│       ├── page.tsx              # Single page component
│       └── layout.tsx            # Benchmark-specific layout
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── QuickWinners.tsx
│   │   ├── PerformanceMatrix.tsx
│   │   ├── Charts.tsx
│   │   ├── Methodology.tsx
│   │   └── Footer.tsx
│   ├── modals/
│   │   └── ResponseModal.tsx
│   └── ui/                       # shadcn components
├── lib/
│   ├── db.ts                     # Database connection
│   ├── queries.ts                # SQL queries
│   └── types.ts                  # TypeScript types
└── app/api/benchmarks/
    ├── route.ts                  # Main endpoint
    └── [id]/route.ts             # Detail endpoint
```

---

## 🎯 Implementation Priority

### Day 1: Setup + Data
- [ ] Next.js page at `/benchmarks`
- [ ] Database connection
- [ ] API endpoint working
- [ ] Data fetching logic

### Day 2-3: Core UI
- [ ] Hero section
- [ ] Quick winners cards
- [ ] Performance matrix
- [ ] Response modal

### Day 4: Charts + Polish
- [ ] Recharts integration
- [ ] Methodology accordion
- [ ] Mobile responsive
- [ ] Animations

### Day 5: Testing + Deploy
- [ ] Test all interactions
- [ ] Performance optimization
- [ ] Deploy to Vercel
- [ ] Update gtabhishek.com nav

---

## 🎬 Cursor Prompt

```
Create a single-page AI benchmark dashboard at /benchmarks route.

Requirements:
- Next.js 14 App Router page
- TypeScript + Tailwind CSS
- shadcn/ui components
- Framer Motion for scroll animations
- Recharts for data viz
- Mobile-first responsive

Page sections (vertical scroll):
1. Hero - Full viewport, animated gradient, live stats
2. Quick Winners - 3 glassmorphism cards
3. Performance Matrix - Filterable table with color-coded scores
4. Charts - 2 responsive charts (bar + radar)
5. Methodology - Expandable accordion sections
6. Footer

Key features:
- Click table cell → Modal with full benchmark details
- Filter bar (sticky): model, role, score range
- Smooth scroll animations (sections reveal)
- Dark mode with purple/pink gradients
- Loading states everywhere

API endpoint:
GET /api/benchmarks
- Returns: summary stats, matrix data, chart data
- Connects to existing Postgres (DATABASE_URL env)

Database schema:
interface BenchmarkResult {
  id: number;
  model_name: string;
  role_type: string;
  quality_score: number;
  response_time: number;
  prompt_text: string;
  full_response: string;
  scoring_breakdown: Record<string, number>;
}

Make it beautiful:
- Smooth page transitions
- Gradient backgrounds with subtle animation
- Glassmorphism cards with hover effects
- Color-coded scores (green 9+, blue 7-9, orange 5-7, red <5)
- Skeleton loading states
- 60fps scroll performance

Deploy target: Vercel
Performance goal: Lighthouse 90+
```

---
