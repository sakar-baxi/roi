# 🎯 ROI Calculator Template & Architecture Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Core Logic Patterns](#core-logic-patterns)
4. [UI/UX Design System](#uiux-design-system)
5. [Implementation Checklist](#implementation-checklist)
6. [Customization Guide](#customization-guide)
7. [Deployment Strategy](#deployment-strategy)

---

## 1. Project Overview

### Purpose
Create interactive ROI calculators that help businesses quantify the financial impact of automation/software solutions by comparing manual processes vs. automated solutions.

### Target Audience
- **Primary**: Business decision-makers (CFOs, COOs, VPs)
- **Secondary**: HR leaders, Operations managers
- **Tertiary**: Sales teams (as a demo tool)

### Key Success Metrics
- **Self-Explanatory**: User can understand without sales rep
- **Credible**: Math is transparent and defensible
- **Actionable**: Generates executive-ready reports
- **Customizable**: Sales can brand for each client

---

## 2. Technical Architecture

### Tech Stack
```json
{
  "framework": "Next.js 16.0.4",
  "language": "TypeScript",
  "styling": "Tailwind CSS 4.0",
  "charts": "Recharts 3.5.0",
  "icons": "Lucide React 0.554.0",
  "deployment": "Vercel (Static Generation)"
}
```

### File Structure
```
project/
├── app/
│   ├── layout.tsx          # Metadata, fonts, global config
│   ├── page.tsx            # Main calculator (single-page app)
│   └── globals.css         # Global styles, animations
├── public/                 # Static assets (optional)
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind customization
└── package.json            # Dependencies
```

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^16.0.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.5.0",
    "lucide-react": "^0.554.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "typescript": "^5",
    "tailwindcss": "^4.0",
    "postcss": "^8",
    "eslint": "^9"
  }
}
```

---

## 3. Core Logic Patterns

### A. Data Flow Architecture

```typescript
// 1. INPUT LAYER
interface Inputs {
  yearlyIntegrationCost: number;  // Cost of automation (yearly)
  monthlySalary: number;          // Employee cost
  hoursPerWeek: number;           // Manual work time
  errorCorrectionHours: number;   // Error fixing time
}

// 2. CALCULATION LAYER
useEffect(() => {
  // Sanitize inputs (enforce min/max)
  const sanitized = {
    yearlyIntegrationCost: Math.max(0, Math.min(15000, inputs.yearlyIntegrationCost)),
    monthlySalary: Math.max(10000, Math.min(500000, inputs.monthlySalary)),
    // ... etc
  };

  // Derive hourly rate
  const hourlyRate = sanitized.monthlySalary / 160;

  // Calculate annual manual cost
  const annualHours = (sanitized.hoursPerWeek * 52) + (sanitized.errorCorrectionHours * 12);
  const manualAnnualCost = annualHours * hourlyRate;

  // Calculate savings (ALWAYS NON-NEGATIVE)
  const year1Returns = Math.max(0, manualAnnualCost - sanitized.yearlyIntegrationCost);
  const savings3Year = Math.max(0, (manualAnnualCost * 3) - (sanitized.yearlyIntegrationCost * 3));

  // Calculate ROI (ALWAYS NON-NEGATIVE)
  const roiPercent = sanitized.yearlyIntegrationCost > 0 
    ? Math.max(0, (year1Returns / sanitized.yearlyIntegrationCost) * 100) 
    : 0;

  // Update results
  setResults({ manualAnnualCost, year1Returns, savings3Year, roiPercent });
}, [inputs]);

// 3. OUTPUT LAYER
interface Results {
  manualAnnualCost: number;
  apiFirstYearCost: number;
  savings3Year: number;
  breakevenMonths: number;
  roiPercent: number;
}
```

### B. Key Calculation Patterns

#### Pattern 1: Hourly Rate Conversion
```typescript
// Always convert monthly salary to hourly
// Assumption: 160 working hours/month (8 hrs/day × 20 days)
const hourlyRate = monthlySalary / 160;
```

#### Pattern 2: Annual Hours Calculation
```typescript
// Combine regular work + error correction
const annualHours = (weeklyHours * 52) + (monthlyErrorHours * 12);
```

#### Pattern 3: Non-Negative Results
```typescript
// CRITICAL: Always use Math.max(0, ...) for user-facing metrics
const savings = Math.max(0, manualCost - automationCost);
const roi = automationCost > 0 ? Math.max(0, (savings / automationCost) * 100) : 0;
```

#### Pattern 4: Inflation Modeling (for charts)
```typescript
// Apply realistic inflation to manual costs
const inflationRate = 1.08; // 8% annual
const manualY1 = manualAnnualCost;
const manualY2 = manualY1 * inflationRate;
const manualY3 = manualY2 * inflationRate;

// Cumulative costs
const cumulativeManualY3 = manualY1 + manualY2 + manualY3;
const cumulativeApiY3 = yearlyIntegrationCost * 3; // Flat
```

### C. State Management Pattern

```typescript
// 1. Local State
const [inputs, setInputs] = useState<Inputs>({ /* defaults */ });
const [results, setResults] = useState<Results>({ /* zeros */ });
const [config, setConfig] = useState<Config>({ /* branding */ });

// 2. Persistence (localStorage)
useEffect(() => {
  const saved = localStorage.getItem('roi-calculator-state');
  if (saved) {
    const { inputs, config } = JSON.parse(saved);
    setInputs(inputs);
    setConfig(config);
  }
}, []);

useEffect(() => {
  localStorage.setItem('roi-calculator-state', JSON.stringify({ inputs, config }));
}, [inputs, config]);

// 3. Reactive Calculations
useEffect(() => {
  // Recalculate whenever inputs change
  const newResults = calculateROI(inputs);
  setResults(newResults);
}, [inputs]);
```

---

## 4. UI/UX Design System

### A. Color Palette

```css
/* Primary (Dynamic - from config.themeColor) */
--primary: #3b6ff7;              /* Base color */
--primary-light: rgba(59,111,247,0.1);
--primary-lighter: rgba(59,111,247,0.05);
--primary-hover: rgba(59,111,247,0.85);
--primary-shadow: rgba(59,111,247,0.4);

/* Semantic Colors */
--success: #10b981;              /* Emerald-500 */
--success-bg: #ecfdf5;           /* Emerald-50 */
--warning: #f59e0b;              /* Amber-500 */
--error: #ef4444;                /* Red-500 */
--neutral: #94a3b8;              /* Slate-400 */
--background: #f8fafc;           /* Slate-50 */
```

### B. Typography

```css
/* Font Family */
font-family: 'Plus Jakarta Sans', sans-serif;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;

/* Font Sizes (Tailwind scale) */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-7xl: 4.5rem;      /* 72px */
```

### C. Component Patterns

#### InputGroup Component
```tsx
<InputGroup
  label="Metric Name"
  value={inputs.metric}
  onChange={(val) => setInputs({ ...inputs, metric: val })}
  currency={config.currency}  // Optional
  unit="hrs"                  // Optional
  min={0}
  max={100}
  step={1}
  isCurrency={true}           // Shows currency symbol
  delay="delay-300"           // Stagger animation
  description="Short explanation of what this measures."
  infoText="Detailed tooltip explaining WHY this matters and HOW to calculate it."
/>
```

#### KPICard Component
```tsx
<KPICard
  title="Metric Name"
  value={results.metric}
  unit="%"                    // or " Mo" or ""
  icon={Zap}                  // Lucide icon
  color="success"             // Optional: changes color scheme
  delay="delay-400"
  description="What this number means."
  infoText="Why this metric matters for decision-making."
/>
```

#### InfoTooltip Component
```tsx
<InfoTooltip text="Explanation that appears on hover/click" />
```

### D. Animation System

```css
/* Fade-up animation */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.6s ease-out;
}

/* Stagger delays */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
/* ... up to delay-700 */
```

### E. Layout Structure

```tsx
<div className="min-h-screen bg-slate-50">
  {/* Navbar */}
  <nav className="fixed top-0 w-full z-50 bg-white shadow">
    {/* Logo, Company Name, Customize Button */}
  </nav>

  {/* Hero Section */}
  <div className="pt-20 pb-40 px-4 hero-background">
    <h1>Compelling Value Proposition</h1>
    <p>Explain the problem and solution</p>
  </div>

  {/* Quick Navigation (Desktop only) */}
  <QuickNav />

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4">
    {/* Section 1: Inputs */}
    <section id="inputs" className="min-h-[90vh]">
      {/* Input sliders + KPI cards */}
    </section>

    {/* Section 2: Visuals */}
    <section id="visual" className="min-h-[90vh]">
      {/* Chart + Table + Explanations */}
    </section>

    {/* Section 3: CTA */}
    <section id="cta" className="min-h-[80vh]">
      {/* Summary + Benefits + Download Report */}
    </section>
  </main>
</div>
```

---

## 5. Implementation Checklist

### Phase 1: Setup (Day 1)
- [ ] Create Next.js project: `npx create-next-app@latest`
- [ ] Install dependencies: `npm install recharts lucide-react`
- [ ] Configure Tailwind CSS
- [ ] Set up TypeScript interfaces
- [ ] Add Google Fonts (Plus Jakarta Sans)

### Phase 2: Core Logic (Day 2)
- [ ] Define `Inputs` interface
- [ ] Define `Results` interface
- [ ] Define `Config` interface
- [ ] Implement calculation logic in `useEffect`
- [ ] Add input sanitization (min/max)
- [ ] Ensure non-negative results with `Math.max(0, ...)`
- [ ] Test calculations with edge cases

### Phase 3: Components (Day 3)
- [ ] Create `InputGroup` component
- [ ] Create `KPICard` component
- [ ] Create `InfoTooltip` component
- [ ] Add 3D hover effects to KPI cards
- [ ] Implement `CountUp` animation component
- [ ] Create `QuickNav` component

### Phase 4: Sections (Day 4)
- [ ] Build Hero section
- [ ] Build Inputs section (sliders + KPIs)
- [ ] Build Chart section (Recharts bar chart)
- [ ] Build Table section (comparison table)
- [ ] Build CTA section (benefits + download)
- [ ] Add cost divergence explanation boxes

### Phase 5: Customization (Day 5)
- [ ] Add configuration modal
- [ ] Implement logo upload
- [ ] Add theme color picker
- [ ] Add currency selector
- [ ] Implement localStorage persistence
- [ ] Add print stylesheet

### Phase 6: Polish (Day 6)
- [ ] Add all InfoTooltips
- [ ] Implement smooth scrolling
- [ ] Add loading states
- [ ] Test mobile responsiveness
- [ ] Add SEO meta tags
- [ ] Optimize performance

### Phase 7: Testing & Deployment (Day 7)
- [ ] Test all calculations
- [ ] Test edge cases (zero values, max values)
- [ ] Test on mobile devices
- [ ] Run production build
- [ ] Deploy to Vercel
- [ ] Test live URL

---

## 6. Customization Guide

### For Different Industries

#### Example 1: HR/Payroll Automation
```typescript
interface Inputs {
  yearlyIntegrationCost: number;  // API subscription
  monthlySalary: number;          // HR employee CTC
  hoursPerWeek: number;           // Manual HRMS work
  errorCorrectionHours: number;   // Data fixing time
}
```

#### Example 2: Sales Automation
```typescript
interface Inputs {
  yearlyIntegrationCost: number;  // CRM subscription
  avgDealSize: number;            // Average contract value
  manualLeadsPerWeek: number;     // Manual lead entry
  automatedConversionRate: number; // % improvement
}
```

#### Example 3: Inventory Management
```typescript
interface Inputs {
  yearlyIntegrationCost: number;  // Software cost
  inventoryValue: number;         // Total inventory
  manualStockcheckHours: number;  // Weekly manual checks
  shrinkageRate: number;          // % loss from errors
}
```

### Calculation Logic Templates

#### Template 1: Time-Based Savings
```typescript
const annualHours = weeklyHours * 52;
const manualCost = annualHours * hourlyRate;
const savings = manualCost - automationCost;
const roi = (savings / automationCost) * 100;
```

#### Template 2: Revenue-Based ROI
```typescript
const additionalRevenue = (leadIncrease * conversionRate * avgDealSize);
const netBenefit = additionalRevenue - automationCost;
const roi = (netBenefit / automationCost) * 100;
```

#### Template 3: Error-Reduction ROI
```typescript
const errorCost = inventoryValue * errorRate;
const savings = errorCost - automationCost;
const roi = (savings / automationCost) * 100;
```

---

## 7. Deployment Strategy

### Pre-Deployment Checklist
```bash
# 1. Build locally
npm run build

# 2. Check for errors
npm run lint

# 3. Test production build
npm run start

# 4. Verify calculations
# Test with: zero values, max values, negative scenarios
```

### Vercel Deployment
```bash
# Option 1: CLI
vercel --prod

# Option 2: GitHub Integration
# Push to GitHub → Import to Vercel → Auto-deploy
```

### Environment Variables (if needed)
```env
# Usually not needed for pure client-side calculators
# But if you add analytics or backend:
NEXT_PUBLIC_ANALYTICS_ID=your_id
```

### Performance Optimization
```typescript
// 1. Use React.memo for expensive components
const ExpensiveChart = React.memo(({ data }) => {
  return <BarChart data={data} />;
});

// 2. Debounce slider inputs
const debouncedSetInputs = useMemo(
  () => debounce((val) => setInputs(val), 300),
  []
);

// 3. Lazy load heavy components
const Chart = dynamic(() => import('./Chart'), { ssr: false });
```

---

## 8. Best Practices & Lessons Learned

### ✅ DO's

1. **Always use Math.max(0, ...) for user-facing metrics**
   - Prevents confusing negative ROI/savings
   - Makes the tool more credible

2. **Use realistic default values**
   - Based on industry averages
   - Should show positive ROI immediately

3. **Add InfoTooltips everywhere**
   - Makes the tool self-explanatory
   - Reduces dependency on sales reps

4. **Use familiar terminology**
   - "Monthly Salary" not "Hourly Cost"
   - "CTC" for Indian audiences
   - "Subscription" not "License Fee"

5. **Show cumulative costs in charts**
   - More impactful than annual costs
   - Shows the "gap widening" effect

6. **Add inflation to manual costs**
   - Makes projections more realistic
   - 8-10% for salaries is standard

7. **Persist state in localStorage**
   - Sales can customize before meetings
   - Settings survive page refresh

8. **Make it print-friendly**
   - Add print stylesheet
   - Hide navigation/buttons
   - Ensure charts render

### ❌ DON'Ts

1. **Don't show negative ROI**
   - Use Math.max(0, ...)
   - Or show "N/A" if automation costs more

2. **Don't use technical jargon**
   - "API" → "Integration"
   - "CapEx" → "One-time Cost"

3. **Don't hide the math**
   - Show formulas in tooltips
   - Make calculations transparent

4. **Don't use unrealistic defaults**
   - Avoid showing 1000% ROI
   - Use conservative estimates

5. **Don't forget mobile**
   - Test on actual devices
   - Sliders must work on touch

6. **Don't skip error handling**
   - Validate all inputs
   - Handle division by zero

7. **Don't make it too complex**
   - Max 4-5 input fields
   - Focus on key metrics only

8. **Don't forget accessibility**
   - Add aria-labels
   - Ensure keyboard navigation

---

## 9. Example Prompt for Cursor

### Prompt Template
```
Create a ROI Calculator for [INDUSTRY/USE CASE] using Next.js, TypeScript, and Tailwind CSS.

INPUTS:
1. [Input 1 Name]: [Range] - [Description]
2. [Input 2 Name]: [Range] - [Description]
3. [Input 3 Name]: [Range] - [Description]
4. [Input 4 Name]: [Range] - [Description]

CALCULATIONS:
- Manual Annual Cost = [Formula]
- Automation Cost = [Formula]
- Year 1 Savings = Math.max(0, Manual Cost - Automation Cost)
- 3-Year Savings = Math.max(0, (Manual Cost × 3) - (Automation Cost × 3))
- ROI% = Automation Cost > 0 ? Math.max(0, (Year 1 Savings / Automation Cost) × 100) : 0

OUTPUTS (KPI Cards):
1. One Year Returns: ₹[Year 1 Savings]
2. 3-Year Savings: ₹[3-Year Savings]
3. ROI: [ROI%]%

DESIGN:
- Use Plus Jakarta Sans font
- Primary color: #3b6ff7 (customizable)
- Glassmorphism design
- Smooth animations (fade-up)
- 3D hover effects on KPI cards
- InfoTooltips on all metrics

FEATURES:
- Real-time calculation
- localStorage persistence
- Customizable branding (logo, color, currency)
- Print-ready executive report
- Mobile responsive
- Chart showing cost divergence (with 8% inflation on manual costs)
- Comparison table (Manual vs Automated)

TECHNICAL:
- Next.js 16.0.4
- TypeScript
- Tailwind CSS 4.0
- Recharts for charts
- Lucide React for icons
- Static generation (no backend)
- Deploy to Vercel

ENSURE:
- All results are non-negative (use Math.max(0, ...))
- Calculations are transparent (show in tooltips)
- Self-explanatory (works without sales rep)
- Indian business context (use CTC, ₹, etc.)
```

---

## 10. File Templates

### layout.tsx Template
```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "[Your Product] ROI Calculator",
  description: "Calculate your ROI from [automation/solution]",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-jakarta">{children}</body>
    </html>
  );
}
```

### globals.css Template
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-fade-up {
    animation: fade-up 0.6s ease-out;
  }
  
  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
  .delay-600 { animation-delay: 600ms; }
  .delay-700 { animation-delay: 700ms; }

  .text-shine {
    background: linear-gradient(135deg, var(--primary) 0%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media print {
    .no-print {
      display: none !important;
    }
    nav {
      display: none !important;
    }
  }
}
```

---

## 11. Success Metrics

### For Sales Teams
- [ ] Can customize in < 2 minutes
- [ ] Works without internet (after first load)
- [ ] Generates print-ready report
- [ ] Shows positive ROI with realistic inputs

### For End Users
- [ ] Understands value proposition in < 30 seconds
- [ ] Can adjust inputs without confusion
- [ ] Trusts the calculations (transparent math)
- [ ] Can share/print results

### Technical
- [ ] Lighthouse score > 90
- [ ] Build time < 1 minute
- [ ] No runtime errors
- [ ] Works on mobile

---

**🎉 You now have everything needed to build a production-ready ROI Calculator!**

Use this template as a reference when creating new calculators for different use cases.
