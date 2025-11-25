'use client';

/**
 * Premium ROI Analysis Calculator
 * 
 * BRANDING CUSTOMIZATION GUIDE:
 * =============================
 * 
 * To customize this calculator for your brand, update the `config` state below (line ~211):
 * 
 * const [config, setConfig] = useState<Config>({
 *   vendorName: "Your Brand Name",    // e.g., "Acme Solutions"
 *   currency: "$",                     // e.g., "$", "€", "£", "₹"
 *   themeColor: "#0070f3",            // Your primary brand color (HEX)
 *   logoUrl: null                      // URL or base64 of your company logo
 * });
 * 
 * COLOR PALETTE (Auto-generated from themeColor):
 * -----------------------------------------------
 * Default: #3b6ff7 (Vibrant Blue) → RGB(59, 111, 247)
 * 
 * CSS Variables created:
 * - --primary:         #3b6ff7           (Primary text, buttons, charts)
 * - --primary-rgb:     59, 111, 247      (For transparent variations)
 * - --primary-light:   rgba(59,111,247,0.1)   (Icon backgrounds, badges)
 * - --primary-lighter: rgba(59,111,247,0.05)  (Hero section, CTA card)
 * - --primary-hover:   rgba(59,111,247,0.85)  (Button hover, gradients)
 * - --primary-shadow:  rgba(59,111,247,0.4)   (Shadows on buttons, cards)
 * 
 * FONT:
 * -----
 * Plus Jakarta Sans (Modern geometric sans-serif)
 * Weights: 300, 400, 500, 600, 700, 800
 * 
 * UI COLOR SCHEME:
 * ---------------
 * - Primary Actions: var(--primary) with white text
 * - Success/Positive: Emerald (#10b981, bg: #ecfdf5)
 * - Warning/Risk: Red (#ef4444)
 * - Manual Process: Slate-400 (#94a3b8)
 * - Background: Slate-50 (#f8fafc)
 */


import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  Clock,
  Server,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Download,
  X,
  Zap,
  Upload,
  Palette,
  EyeOff,
  Database,
  RefreshCw,
  DollarSign,
  BriefcaseBusiness,
  Coins,
  Send,
  Users,
  Briefcase,
  LucideIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// --- Types ---
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isVisible: boolean;
}

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  delay: string;
  isCurrency?: boolean;
  description: string;
}

interface KPICardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color?: string;
  delay: string;
  description: string;
}

interface Config {
  vendorName: string;
  currency: string;
  themeColor: string;
  logoUrl: string | null;
  ctaLink: string; // Custom CTA URL for the download button
}

interface Inputs {
  apiCost: number;
  adminWage: number;
  hoursPerWeek: number;
  errorCorrectionHours: number;
}

interface Results {
  manualAnnualCost: number;
  apiFirstYearCost: number;
  savings3Year: number;
  annualSavings: number;
  hoursSavedAnnually: number;
  roiPercent: number;
}

// --- Helpers ---

// Convert Hex to RGB for transparency calculations
const hexToRgb = (hex: string): RGB => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 111, b: 247 }; // Default: #3b6ff7 (Vibrant Blue)
};

// Animated Number Component
const CountUp: React.FC<CountUpProps> = ({ end, duration = 2000, prefix = "", suffix = "", decimals = 0, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    const animate = (currentTime: number): void => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCount(easeOutQuart * end);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [end, duration, isVisible]);

  const formattedCount = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(count);

  // Insert a space before alphabetic suffixes (e.g., "Mo") but not before symbols like "%".
  const needsSpace = suffix && /[A-Za-z]/.test(suffix);
  return (
    <span className="tabular-nums font-jakarta">
      {prefix}
      {formattedCount}
      {suffix ? (needsSpace ? ` ${suffix}` : suffix) : ''}
    </span>
  );
};

// Component for a single Input/Slider group
const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, currency, unit, min, max, step, delay, isCurrency, description }) => {
  const formatValue = (val: number): string => {
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: isCurrency && val < 1000 ? 0 : 0,
      maximumFractionDigits: isCurrency ? 0 : 1
    }).format(val);

    if (isCurrency) return `${currency}${formatted}`;
    return `${formatted} ${unit}`;
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      const constrainedVal = Math.max(min, Math.min(max, val));
      onChange(constrainedVal);
    }
  };

  const range = max - min;
  const percentage = ((value - min) / range) * 100;

  return (
    <div className={`animate-fade-up ${delay} p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-semibold text-slate-700 font-jakarta">{label}</label>
        <div className="text-base font-bold theme-text bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 flex items-center min-w-[100px] justify-end whitespace-nowrap tabular-nums font-jakarta">
          {formatValue(value)}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative rounded-full transition-all duration-300">
          <input
            type="range" min={min} max={max} step={step}
            value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
            style={{
              '--track-fill-percent': `${percentage}%`,
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) var(--track-fill-percent), #e2e8f0 var(--track-fill-percent), #e2e8f0 100%)`
            } as React.CSSProperties}
            className="w-full h-2 rounded-full appearance-none cursor-pointer relative z-10 transition-colors custom-range-input"
          />
        </div>
        <input
          type="number" min={min} max={max} step={step}
          value={value} onChange={handleManualChange}
          className="w-20 text-center border border-slate-200 rounded-xl p-2 text-sm font-semibold focus:ring-2 theme-ring-focus outline-none transition-shadow appearance-none font-jakarta"
        />
      </div>
      <p className="text-xs text-slate-500 mt-2 ml-1 font-jakarta">{description}</p>
    </div>
  );
};

export default function App() {
  // --- BRANDING CONFIGURATION ---
  // Customize these values to match your company's brand identity
  const [config, setConfig] = useState<Config>({
    vendorName: "YourCompany",  // Company name displayed in navbar and chart legend
    currency: "₹",              // Currency symbol for all monetary values (₹, $, €, £)
    themeColor: "#3b6ff7",      // Primary brand color (HEX) - generates all color variations
    logoUrl: null,              // Company logo URL or base64 string (null = default icon)
    ctaLink: ""                 // Custom CTA link (leave empty to use print)
  });

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<Inputs>({
    apiCost: 80000,
    adminWage: 45000,
    hoursPerWeek: 6,
    errorCorrectionHours: 3,
  });

  const [results, setResults] = useState<Results>({
    manualAnnualCost: 0, apiFirstYearCost: 0, savings3Year: 0, annualSavings: 0, hoursSavedAnnually: 0, roiPercent: 0
  });

  // --- Persistence ---
  // Load saved state on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('roi_config');
      const savedInputs = localStorage.getItem('roi_inputs');

      if (savedConfig) setConfig(JSON.parse(savedConfig));
      if (savedInputs) setInputs(JSON.parse(savedInputs));
    } catch (e) {
      console.error("Failed to load saved state", e);
    }
  }, []);

  // Save config on changes
  useEffect(() => {
    try {
      localStorage.setItem('roi_config', JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save config", e);
    }
  }, [config]);

  // Save inputs on changes
  useEffect(() => {
    try {
      localStorage.setItem('roi_inputs', JSON.stringify(inputs));
    } catch (e) {
      console.error("Failed to save inputs", e);
    }
  }, [inputs]);

  // --- Effects ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === chartRef.current) {
            if (entry.isIntersecting) setTimeout(() => setIsChartVisible(true), 100);
            else setIsChartVisible(false);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculations
  useEffect(() => {
    const sanitizedInputs = {
      apiCost: Math.max(50000, Math.min(80000, inputs.apiCost || 0)),
      adminWage: Math.max(30000, Math.min(500000, inputs.adminWage || 0)),
      hoursPerWeek: Math.max(8, Math.min(40, inputs.hoursPerWeek || 0)),
      errorCorrectionHours: Math.max(2, Math.min(20, inputs.errorCorrectionHours || 0)),
    };

    // Calculate annual manual cost based on monthly salary
    // Hours per week * 52 weeks + error correction hours * 12 months = total annual hours
    // Then divide by typical hours per month to get cost contribution
    const annualManualHours = (sanitizedInputs.hoursPerWeek * 52) + (sanitizedInputs.errorCorrectionHours * 12);
    const costPerHour = sanitizedInputs.adminWage / 160; // Assume 160 working hours per month
    const manualAnnualCost = annualManualHours * costPerHour;
    
    const apiFirstYearCost = sanitizedInputs.apiCost;
    const manual3Year = Math.max(0, manualAnnualCost * 3);
    const api3Year = apiFirstYearCost;
    const savings3Year = Math.max(0, manual3Year - api3Year); // Never negative
    const netBenefit = Math.max(0, manual3Year - api3Year);
    const roiPercent = api3Year > 0 ? Math.max(0, (netBenefit / api3Year) * 100) : 0;
    const annualSavings = Math.max(0, manualAnnualCost); // Full annual cost is saved every year
    const hoursSavedAnnually = Math.max(0, annualManualHours); // Total hours freed up

    setInputs(sanitizedInputs);
    setResults({ manualAnnualCost: Math.max(0, manualAnnualCost), apiFirstYearCost, savings3Year, annualSavings, hoursSavedAnnually, roiPercent });
  }, [inputs.apiCost, inputs.adminWage, inputs.hoursPerWeek, inputs.errorCorrectionHours]);

  // --- Dynamic Theme Styles ---
  // Auto-generates CSS variables from the primary theme color
  const rgb = hexToRgb(config.themeColor);
  const themeStyles = `
    /* Font Import */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    
    /* 
     * CSS Custom Properties - Auto-generated Color Palette
     * Based on Primary Theme Color: ${config.themeColor}
     * RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}
     */
    :root {
      --primary: ${config.themeColor};                              /* Primary brand color */
      --primary-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};                  /* RGB values for transparency */
      --primary-light: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1);     /* 10% opacity - Icon backgrounds */
      --primary-lighter: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05);  /* 5% opacity - Hero/CTA backgrounds */
      --primary-hover: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85);    /* 85% opacity - Hover states */
      --primary-shadow: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4);    /* 40% opacity - Shadows */
    }

  html { font-size: 16px; -webkit-text-size-adjust: 100%; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; line-height: 1.6; }
  .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* Readability overrides: increase small text, spacing and control sizes globally */
  .text-xs { font-size: 0.85rem; line-height: 1.4; }
  .text-sm { font-size: 0.95rem; line-height: 1.45; }
  .text-base { font-size: 1rem; line-height: 1.6; }

  /* Inputs, selects and buttons should be comfortably tappable */
  input, select, textarea, button { font-size: 0.97rem; line-height: 1.4; }
  input[type="number"] { padding: 0.5rem 0.625rem; }

  /* Improve table readability with generous spacing */
  table th, table td { font-size: 1rem; padding: 1.25rem 1.5rem; line-height: 1.7; }
  table th { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  /* Use a fixed table layout for stable column mapping */
  .table-fixed { table-layout: fixed; }
  /* Prevent cell content from wrapping and keep alignment intact */
  table td, table th { word-break: break-word; overflow-wrap: break-word; white-space: normal; }
  /* Prevent nested divs from breaking table cell alignment */
  table td > div { display: contents; }
  table td > div > div { display: inline; }
  /* Ensure flex items in table cells don't wrap and stay in column */
  table td.flex { flex-wrap: nowrap; }
  /* Force text content to stay inline and not wrap */
  table td div.font-semibold,
  table td div.text-sm { display: inline; }
  /* Add extra visual breathing room between rows */
  table tbody tr { min-height: 7.5rem; }
  /* Enhance dividers for cleaner separation */
  table tbody tr:not(:last-child) { border-bottom-width: 2px; border-bottom-color: #f1f5f9; }

  /* Slightly darken muted text for contrast */
  .text-slate-500 { color: #475569; }
  .text-slate-400 { color: #64748b; }

  /* Increase clickable area for small controls */
  .w-20 { min-width: 5.25rem; }

    .theme-text { color: var(--primary); }
    .theme-bg { background-color: var(--primary); }
    .theme-bg-light { background-color: var(--primary-light); }
    .theme-border { border-color: var(--primary); }
  /* Visible focus ring using generated primary color */
  .theme-ring-focus:focus { outline: none; box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.12); border-radius: 0.75rem; }
    .theme-shadow-lg:hover { box-shadow: 0 15px 30px -8px var(--primary-shadow); } 

    .btn-primary {
      background-color: var(--primary);
      color: white;
      transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .btn-primary:hover {
      background-color: var(--primary-hover);
      transform: translateY(-3px) scale(1.005);
      box-shadow: 0 18px 36px -8px var(--primary-shadow);
    }
    .btn-primary:active { transform: translateY(-1px); }

    .custom-range-input::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--primary); cursor: grab;
      border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); 
      transition: all 0.2s ease; margin-top: -6px;
    }
    .custom-range-input {
      -webkit-appearance: none; appearance: none;
      height: 8px; padding: 0; margin: 0;
    }
    .custom-range-input::-webkit-slider-runnable-track { height: 8px; border-radius: 9999px; }

    .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; opacity: 0; transform: translateY(20px); }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-500 { animation-delay: 0.5s; }
    .delay-600 { animation-delay: 0.6s; }
    .delay-700 { animation-delay: 0.7s; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .text-shine {
        background: linear-gradient(90deg, #333 0%, #333 40%, var(--primary) 50%, #333 60%, #333 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 6s linear infinite;
    }
    @keyframes shine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .hero-background {
        background-color: #f8fafc;
        background-image: radial-gradient(circle at 15% 50%, var(--primary-lighter), transparent 50%), radial-gradient(circle at 85% 50%, #e2e8f0, transparent 50%);
        background-size: 200% 200%;
        animation: gradientShift 25s ease infinite alternate;
    }
  /* Floating blurred color blob overlays for a more organic hero effect */
  /* Tunable CSS variables to control intensity and motion */
  :root {
    --hero-blob-opacity: 0.95; /* overall pseudo-element opacity */
    --hero-blob-blur: 60px;    /* blur radius for blobs */
    --hero-blob-scale: 1.02;   /* subtle scale during animation */
    --hero-blob-speed: 18s;    /* animation duration */
  }

  .hero-background { position: relative; overflow: hidden; }

  /* Primary, slow drifting blur layer (large soft blobs) */
  .hero-background::before {
    content: '';
    position: absolute;
    top: -30%; left: -20%;
    width: 160%; height: 160%;
    background:
      radial-gradient(circle at 18% 28%, rgba(var(--primary-rgb),0.18), transparent 15%),
      radial-gradient(circle at 82% 72%, rgba(16,185,129,0.12), transparent 20%),
      radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08), transparent 25%);
    filter: blur(var(--hero-blob-blur)) saturate(120%);
    opacity: var(--hero-blob-opacity);
    transform: translate3d(0,0,0) scale(1);
    pointer-events: none;
    animation: floatAround  calc(var(--hero-blob-speed)) linear infinite;
    z-index: 0;
    mix-blend-mode: normal;
  }

  /* Secondary, faster drifting layer to add movement complexity */
  .hero-background::after {
    content: '';
    position: absolute;
    right: -10%; bottom: -20%;
    width: 120%; height: 120%;
    background:
      radial-gradient(circle at 30% 40%, rgba(251,191,36,0.06), transparent 12%),
      radial-gradient(circle at 70% 60%, rgba(99,102,241,0.06), transparent 18%);
    filter: blur(calc(var(--hero-blob-blur) * 0.8)) saturate(110%);
    opacity: calc(var(--hero-blob-opacity) * 0.85);
    transform: translate3d(0,0,0) scale(1);
    pointer-events: none;
    animation: floatAround2 calc(var(--hero-blob-speed) * 0.65) ease-in-out infinite;
    z-index: 0;
    mix-blend-mode: screen;
  }

  /* Gentle float keyframe for the main layer */
  @keyframes floatAround {
    0% { transform: translate3d(-5%, -2%, 0) scale(1); }
    25% { transform: translate3d(6%, -6%, 0) scale(var(--hero-blob-scale)); }
    50% { transform: translate3d(12%, 4%, 0) scale(1); }
    75% { transform: translate3d(-8%, 8%, 0) scale(calc(var(--hero-blob-scale) + 0.01)); }
    100% { transform: translate3d(-5%, -2%, 0) scale(1); }
  }

  /* Slightly different path and timing for secondary layer to avoid sync */
  @keyframes floatAround2 {
    0% { transform: translate3d(6%, 4%, 0) scale(1); }
    20% { transform: translate3d(-6%, 8%, 0) scale(1.01); }
    50% { transform: translate3d(-12%, -6%, 0) scale(1); }
    80% { transform: translate3d(8%, -4%, 0) scale(1.02); }
    100% { transform: translate3d(6%, 4%, 0) scale(1); }
  }

  /* Accessibility: disable motion when user prefers reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .hero-background::before,
    .hero-background::after,
    .hero-background {
      animation: none !important;
      transition: none !important;
    }
  }
    @keyframes gradientShift { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
    
    .savings-gradient-text {
        background: linear-gradient(to right, var(--primary), var(--primary-hover));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1; display: inline-block;
    }
    .cta-background { background: linear-gradient(135deg, var(--primary-lighter) 0%, #ffffff 80%); }
    .tabular-nums { font-variant-numeric: tabular-nums; }

    /* Print Styles for Clean PDF/Report Generation */
    @media print {
      @page {
        size: A4;
        margin: 0.5cm;
      }

      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
        zoom: 0.75; /* Scale down to fit more content */
      }

      /* Reset min-heights for print to avoid gaps */
      section {
        min-height: 0 !important;
        padding-top: 1rem !important;
        padding-bottom: 1rem !important;
        height: auto !important;
      }

      /* Page breaks - prevent content from breaking across pages */
      .page-break-before {
        page-break-before: always;
        break-before: page;
      }

      .page-break-after {
        page-break-after: always;
        break-after: page;
      }

      .page-break-avoid {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* Ensure proper spacing */
      main {
        margin-top: 0 !important;
      }

      /* Remove shadows for cleaner print */
      * {
        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        transition: none !important;
        animation: none !important;
      }

      /* Ensure backgrounds print */
      .bg-white,
      .bg-emerald-50,
      .bg-gradient-to-br,
      .theme-bg-light,
      .cta-background {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      /* Compact spacing for print */
      .mb-8 {
        margin-bottom: 1rem !important;
      }

      /* Prevent cards from breaking across pages */
      .rounded-2xl,
      .rounded-\[2rem\] {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* Keep grid items together */
      [class*="grid"] > div {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* Adjust hero for print */
      .hero-background {
        padding-top: 1rem !important;
        padding-bottom: 1rem !important;
      }

      /* Ensure table doesn't break */
      table {
        page-break-inside: avoid;
      }

      /* Allow horizontal content to flow in print instead of being clipped */
      .overflow-x-auto { overflow-x: visible !important; }

      /* Adjust main container */
      main {
        margin-top: 1rem !important;
        padding-bottom: 0 !important;
      }

      /* Make sure navbar is compact */
      nav {
        padding-top: 0.5rem !important;
        padding-bottom: 0.5rem !important;
        display: none !important; /* Hide navbar for cleaner report */
      }
    }

    /* Smooth Scrolling for Slide Effect */
    html {
      scroll-behavior: smooth;
    }
    
    /* Hide scrollbar for cleaner look but allow scrolling */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;

  const chartData = [
    { name: 'Year 1', 'Manual Process': results.manualAnnualCost, 'API Automation': results.apiFirstYearCost },
    { name: 'Year 2', 'Manual Process': results.manualAnnualCost * 2, 'API Automation': results.apiFirstYearCost },
    { name: 'Year 3', 'Manual Process': results.manualAnnualCost * 3, 'API Automation': results.apiFirstYearCost },
  ];

  // --- Quick Navigation Component ---
  const QuickNav = () => (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 no-print">
      {[
        { id: 'inputs', label: 'Inputs', icon: Calculator },
        { id: 'visual', label: 'Visuals', icon: BarChart },
        { id: 'cta', label: 'Action', icon: Send }
      ].map((item, idx) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="group relative flex items-center justify-end"
          title={item.label}
          aria-label={item.label}
        >
          <span className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
            {item.label}
          </span>
          <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-slate-800 group-hover:scale-125 transition-all duration-300 border-2 border-transparent group-hover:border-white shadow-sm"></div>
        </a>
      ))}
    </div>
  );

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setConfig(prev => ({ ...prev, logoUrl: url }));
    }
  };

  const KPICard: React.FC<KPICardProps> = ({ title, value, unit, icon: Icon, color, delay, description }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const iconColorClass = color === 'success' ? 'bg-emerald-50 text-emerald-600' : 'theme-bg-light theme-text';
    const valueColorClass = color === 'success' ? 'text-emerald-600' : 'text-slate-900';
    const borderColorClass = color === 'success' ? 'border-emerald-200' : 'border-slate-100';

    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;
      const handleMouseMove = (e: MouseEvent): void => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.boxShadow = `0 40px 60px -15px var(--primary-shadow)`;
      };
      const handleMouseLeave = (): void => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        card.style.boxShadow = `0 10px 30px -5px rgba(0,0,0,0.1)`;
      };
      if (isHovering) {
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      } else {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [isHovering]);

    let decimals = 0;
    let prefix = config.currency;
    let suffix = "";
    if (unit.includes('%')) { suffix = unit; prefix = ""; }
    else if (unit.includes('Mo')) { decimals = 1; suffix = unit; prefix = ""; }
    else if (unit.includes('hrs') || unit.includes('Hours')) { suffix = unit; prefix = ""; }

    return (
      <div
        ref={cardRef}
        tabIndex={0}
        onFocus={() => setIsHovering(true)}
        onBlur={() => setIsHovering(false)}
        className={`bg-white p-8 rounded-[2rem] shadow-xl border ${borderColorClass} transition-all duration-500 will-change-transform animate-fade-up ${delay} font-jakarta focus:outline-none theme-ring-focus`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
      >
        <div className="flex justify-between items-start mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className={`${iconColorClass} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
            <Icon size={22} />
          </div>
        </div>
        <div className={`text-5xl font-black ${valueColorClass} mb-2 tabular-nums whitespace-nowrap overflow-hidden`}>
          <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} isVisible={true} />
        </div>
        <p className="text-xs text-slate-500 min-h-[40px]">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 overflow-x-visible font-jakarta">
      <style>{themeStyles}</style>

      {/* --- Navbar --- */}
      <nav className="bg-white/95 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Company Logo" className="h-10 w-auto object-contain max-h-10" />
            ) : (
              <div className="p-2 theme-bg-light theme-text rounded-full"><BriefcaseBusiness size={24} /></div>
            )}
          </div>
          <div className="flex items-center gap-3 no-print">
            <button aria-label="Customize theme" onClick={() => setIsEditingConfig(true)} className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all" title="Customize Theme"><Edit3 size={20} /></button>
            <button aria-label="Export report" onClick={() => window.print()} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-slate-300/50 flex items-center gap-2 transform hover:-translate-y-0.5">
              <Download size={18} /> <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- Config Modal --- */}
      {isEditingConfig && (
        <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg transform scale-100 transition-all relative overflow-hidden font-jakarta">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><Palette size={24} className="theme-text" /> Brand & Customization</h3>
              <button aria-label="Close customization" onClick={() => setIsEditingConfig(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Logo</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer theme-border hover:bg-slate-50 transition-all group">
                  <Upload size={24} className="theme-text group-hover:text-slate-600 mb-2" />
                  <span className="text-sm font-medium text-slate-500">Click to upload or drag & drop</span>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>
                    {config.logoUrl && (
                  <div className="mt-4 flex items-center justify-center">
                    <img src={config.logoUrl} alt="Preview" className="h-12 w-auto object-contain max-h-12 border border-slate-200 p-1 rounded-lg bg-white" />
                    <button aria-label="Remove logo" onClick={(e) => { e.stopPropagation(); setConfig(prev => ({ ...prev, logoUrl: null })); }} className="ml-3 text-red-500 hover:text-red-700"><X size={16} /></button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Theme Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={config.themeColor} onChange={(e) => setConfig({ ...config, themeColor: e.target.value })} className="h-10 w-10 rounded-lg cursor-pointer border-none bg-transparent p-0" />
                  <input type="text" value={config.themeColor} onChange={(e) => setConfig({ ...config, themeColor: e.target.value })} className="flex-1 border border-slate-200 rounded-xl p-3 font-mono text-sm uppercase focus:ring-2 theme-ring-focus outline-none" placeholder="#HEX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                  <input type="text" value={config.vendorName} onChange={(e) => setConfig({ ...config, vendorName: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 theme-ring-focus outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Currency</label>
                  <select value={config.currency} onChange={(e) => setConfig({ ...config, currency: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 theme-ring-focus outline-none bg-white font-medium">
                    <option value="₹">₹ INR</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                    <option value="£">£ GBP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Custom CTA Link (Optional)</label>
                <input type="url" value={config.ctaLink} onChange={(e) => setConfig({ ...config, ctaLink: e.target.value })} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 theme-ring-focus outline-none font-medium" placeholder="https://your-website.com/contact" />
                <p className="text-xs text-slate-500 mt-1">Leave blank to use print/download function. Or enter a URL to redirect users to your custom page.</p>
              </div>
            </div>
            <button onClick={() => setIsEditingConfig(false)} className="mt-10 w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-300/50">Save & Recalculate</button>
          </div>
        </div>
      )}

      {/* --- Hero --- */}
      <div className="relative pt-20 pb-40 px-4 hero-background">
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-up delay-100">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full theme-bg-light theme-text text-sm font-extrabold uppercase tracking-wide mb-8 border theme-border border-opacity-50 backdrop-blur-sm shadow-inner shadow-slate-100/50">
            <RefreshCw size={16} className="animate-spin-slow" /> Smart Automation for Enterprise
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Stop Wasting Time on <span className="text-shine">Manual Data Work</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Discover how modern API integration eliminates costly manual processes, reduces errors, and frees your team to focus on strategic priorities. See your financial impact in just a few clicks.
          </p>
        </div>
      </div>

      <QuickNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
        {/* Slide 1: Calculator Section */}
        <section id="inputs" className="min-h-[90vh] flex flex-col justify-center py-10 page-break-avoid">
          <div className="animate-fade-up delay-200">
            <div className="bg-white rounded-[2rem] shadow-3xl shadow-slate-400/20 p-8 lg:p-10 border-t-8 theme-border relative overflow-hidden group theme-shadow-lg mb-8 z-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 theme-bg-light theme-text rounded-2xl shadow-md"><Calculator size={24} /></div>
                <h2 className="font-extrabold text-2xl text-slate-800 font-jakarta">Business Impact Calculator</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputGroup label="Annual API Implementation Cost" value={inputs.apiCost} onChange={(val) => setInputs({ ...inputs, apiCost: val })} currency={config.currency} min={50000} max={80000} step={5000} isCurrency={true} delay="delay-300" description="One-time investment for API setup, integration, and deployment (₹50K-₹80K)." />
                <InputGroup label="Average Monthly Salary (Fully Loaded Cost)" value={inputs.adminWage} onChange={(val) => setInputs({ ...inputs, adminWage: val })} currency={config.currency} min={30000} max={500000} step={5000} isCurrency={true} delay="delay-400" description="Total monthly compensation including salary, benefits, taxes, and overhead (₹30K-₹60K typical for HR)." />
                <InputGroup label="Hours Per Week on Manual Data Tasks" value={inputs.hoursPerWeek} onChange={(val) => setInputs({ ...inputs, hoursPerWeek: val })} unit="hrs" min={8} max={40} step={0.5} delay="delay-500" description="Time spent handling manual file work, data entry, and monitoring (minimum ~2 days/week)." />
                <InputGroup label="Hours Per Month on Error Correction" value={inputs.errorCorrectionHours} onChange={(val) => setInputs({ ...inputs, errorCorrectionHours: val })} unit="hrs" min={2} max={20} step={1} delay="delay-600" description="Time spent fixing data errors, discrepancies, and investigation (at least 30 mins/week)." />
              </div>
            </div>
            {/* KPI Cards merged into Inputs slide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
              {/* Annual Savings Card */}
              <div className="animate-fade-up delay-300">
                <div className="bg-gradient-to-br from-emerald-50 via-white to-white p-8 rounded-[2rem] shadow-2xl border-2 border-emerald-100 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 h-full">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-100/30 to-transparent rounded-full blur-3xl -mr-24 -mt-24"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">💰 Annual Savings</p>
                      <div className="bg-emerald-100 p-3 rounded-xl"><DollarSign size={22} className="text-emerald-600" /></div>
                    </div>
                    <div className="text-5xl font-black text-emerald-600 mb-2 tabular-nums"><CountUp end={results.annualSavings} prefix={config.currency} suffix="" decimals={0} isVisible={true} duration={2500} /></div>
                    <p className="text-xs text-slate-500">Recurring cost reduction every year</p>
                  </div>
                </div>
              </div>

              {/* Hours Saved Card */}
              <div className="animate-fade-up delay-400">
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-500 h-full" style={{borderWidth: '2px', borderColor: 'rgba(var(--primary-rgb), 0.3)', background: `linear-gradient(to bottom right, rgba(var(--primary-rgb), 0.03), rgba(255,255,255,1))`}}>
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-24 -mt-24" style={{background: `radial-gradient(circle, rgba(var(--primary-rgb), 0.15), transparent)`}}></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-xs font-bold uppercase tracking-wider theme-text">⏱️ Hours Saved Annually</p>
                      <div className="theme-bg-light p-3 rounded-xl"><Clock size={22} className="theme-text" /></div>
                    </div>
                    <div className="text-5xl font-black mb-2 tabular-nums theme-text"><CountUp end={results.hoursSavedAnnually} prefix="" suffix=" hrs" decimals={0} isVisible={true} duration={2500} /></div>
                    <p className="text-xs text-slate-500">Employee capacity freed for strategic work</p>
                  </div>
                </div>
              </div>

              {/* 3-Year Savings Card */}
              <div className="animate-fade-up delay-500">
                <div className="bg-gradient-to-br from-blue-50 via-white to-white p-8 rounded-[2rem] shadow-2xl border-2 border-blue-100 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 h-full">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl -mr-24 -mt-24"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-xs font-bold theme-text uppercase tracking-wider">📊 3-Year Savings</p>
                      <div className="theme-bg-light p-3 rounded-xl"><Coins size={22} className="theme-text" /></div>
                    </div>
                    <div className="text-5xl font-black theme-text mb-2 tabular-nums"><CountUp end={results.savings3Year} prefix={config.currency} suffix="" decimals={0} isVisible={true} duration={2500} /></div>
                    <p className="text-xs text-slate-500">Total cumulative savings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: Chart Section */}
        <section id="chart" className="min-h-[90vh] flex flex-col justify-start py-10 page-break-before page-break-avoid">
          <div className="animate-fade-up delay-600">
            <div ref={chartRef} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-center mb-10 flex-wrap gap-4 border-b pb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-jakarta">3-Year Cost Comparison</h3>
                  <p className="text-slate-500 font-semibold mt-1 text-sm font-jakarta">Manual processes vs. automated API solution</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider font-jakarta">
                  <span className="flex items-center gap-2 text-slate-500"><span className="w-3 h-3 rounded-full bg-slate-300 shadow-inner"></span> Manual Process</span>
                  <span className="flex items-center gap-2 theme-text"><span className="w-3 h-3 rounded-full theme-bg shadow-lg shadow-blue-500/30"></span> API Solution</span>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `${config.currency}${value / 1000}k`} />
                    <Tooltip
                      cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', padding: '16px' }}
                      formatter={(value: number) => [`${config.currency}${value.toLocaleString()}`, '']}
                    />
                    <Bar dataKey="Manual Process" fill="#94a3b8" radius={[8, 8, 0, 0]} animationDuration={isChartVisible ? 2000 : 0} animationEasing="ease-out" />
                    <Bar dataKey="API Automation" fill="var(--primary)" radius={[8, 8, 0, 0]} animationDuration={isChartVisible ? 2500 : 0} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Table merged into Chart slide */}
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-fade-up delay-600 mt-12">
              {/* Mobile stacked cards (visible on small screens) */}
              <div className="md:hidden p-6 space-y-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-extrabold text-slate-700 mb-1">Annual Operational Cost (OpEx)</div>
                      <div className="text-xs text-slate-500 font-semibold">Legacy</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{config.currency}{results.manualAnnualCost.toLocaleString()}</div>
                      <div className="text-xs text-slate-500 mt-1">API: {config.currency}0</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-extrabold text-slate-700 mb-1">3-Year Total Cost of Ownership</div>
                      <div className="text-xs text-slate-500 font-semibold">Legacy</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{config.currency}{(results.manualAnnualCost * 3).toLocaleString()}</div>
                      <div className="text-xs text-slate-500 mt-1">API: {config.currency}{results.apiFirstYearCost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-1" aria-hidden />
                      <div>
                        <div className="text-sm font-extrabold text-slate-700 mb-1">Error Rate &amp; Risk</div>
                        <div className="text-xs text-slate-500 font-semibold">Legacy</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">High</div>
                      <div className="text-xs text-slate-500 mt-1">API: Near zero</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-slate-400 shrink-0 mt-1" aria-hidden />
                      <div>
                        <div className="text-sm font-extrabold text-slate-700 mb-1">Data Latency</div>
                        <div className="text-xs text-slate-500 font-semibold">Legacy</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">Days / Weeks</div>
                      <div className="text-xs text-slate-500 mt-1">API: Real-time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop / tablet table (hidden on small screens) */}
              <div className="hidden md:block overflow-x-auto" role="region" aria-label="Cost comparison table">
                <table className="w-full table-fixed text-left text-base leading-relaxed border-collapse font-jakarta mt-8 min-w-[1000px]" role="table">
                  <caption className="sr-only">Comparison of manual process vs API automation</caption>
                  <colgroup>
                    {/* More stable column widths: equal distribution across the three columns */}
                    <col style={{width: '33.33%'}} />
                    <col style={{width: '33.33%'}} />
                    <col style={{width: '33.33%'}} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-50 border-b-2 border-slate-200">
                      <th scope="col" className="p-6 font-extrabold text-slate-700 uppercase tracking-wide text-sm">Metric</th>
                      <th scope="col" className="p-6 font-extrabold text-slate-500 uppercase tracking-wide text-sm">Current Manual Process</th>
                      <th scope="col" className="p-6 font-extrabold theme-text uppercase tracking-wide text-sm">With API Solution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition-all duration-200 hover:shadow-inner">
                      <td className="p-8 font-bold text-slate-800 text-lg">Annual Operational Cost (OpEx)</td>
                      <td className="p-8 font-medium text-slate-700">
                        <div className="font-bold text-base">{config.currency}{results.manualAnnualCost.toLocaleString()}</div>
                      </td>
                      <td className="p-8 font-bold theme-text bg-blue-50/40">
                        <div className="text-base">{config.currency}0</div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-all duration-200 hover:shadow-inner">
                      <td className="p-8 font-bold text-slate-800 text-lg">3-Year Total Cost of Ownership</td>
                      <td className="p-8 font-medium text-slate-700">
                        <div className="font-bold text-base">{config.currency}{(results.manualAnnualCost * 3).toLocaleString()}</div>
                      </td>
                      <td className="p-8 font-bold theme-text bg-blue-50/40">
                        <div className="text-base">{config.currency}{results.apiFirstYearCost.toLocaleString()}</div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-all duration-200 hover:shadow-inner">
                      <td className="p-8 font-bold text-slate-800 text-lg">Error Rate &amp; Risk</td>
                      <td className="p-8 font-medium text-slate-700">
                        <div className="font-bold text-base">High</div>
                      </td>
                      <td className="p-8 font-medium theme-text bg-blue-50/40">
                        <div className="font-bold text-base">Near zero</div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-all duration-200 hover:shadow-inner">
                      <td className="p-8 font-bold text-slate-800 text-lg">Data Latency</td>
                      <td className="p-8 font-medium text-slate-700">
                        <div className="font-bold text-base">Days / Weeks</div>
                      </td>
                      <td className="p-8 font-medium theme-text bg-blue-50/40">
                        <div className="font-bold text-base">Real-time</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>


        {/* Slide 4: Comparison Table */}


        {/* Slide 5: CTA Section */}
        <section id="cta" className="min-h-[80vh] flex flex-col justify-center py-10 page-break-before page-break-avoid">
          <div className="cta-background p-8 sm:p-12 rounded-[2rem] shadow-2xl border theme-border border-opacity-30 flex flex-col items-center text-center gap-6 animate-fade-up delay-700 font-jakarta">
            <div className="flex items-center gap-3 theme-text font-extrabold uppercase tracking-widest text-sm">
              <Coins size={20} /> The Bottom Line: Business Impact
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight max-w-2xl">
              Eliminate Manual Work. <span className="savings-gradient-text">Unlock Profitability</span>.
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl font-medium leading-relaxed">
              By transitioning to our automated solution, you'll save <span className="font-bold text-emerald-600">{config.currency}{results.annualSavings.toLocaleString()}</span> annually and free up <span className="font-bold text-slate-900 underline decoration-wavy decoration-emerald-400">{results.hoursSavedAnnually.toLocaleString()} hours</span> of staff time—realizing <span className="font-bold text-emerald-600">{config.currency}{results.savings3Year.toLocaleString()}</span> in value over 3 years.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl pt-8 border-t border-slate-200">
              <div className="text-left p-8 border border-slate-100 rounded-2xl bg-white shadow-lg">
                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                  <Users size={20} className="text-pink-500" /> For Operations Leaders
                </h4>
                <ul className="text-slate-600 space-y-3 text-sm font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> <span><span className="font-bold">Reclaim {inputs.hoursPerWeek * 52} staff hours annually</span> from repetitive work.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> Dramatically reduce costly data errors and compliance risks.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> Reallocate talent to high-value, revenue-driving initiatives.</li>
                </ul>
              </div>
              <div className="text-left p-8 border border-slate-100 rounded-2xl bg-white shadow-lg">
                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                  <Briefcase size={20} className="theme-text" /> For Executive Decision-Makers
                </h4>
                <ul className="text-slate-600 space-y-3 text-sm font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> <span><span className="font-bold">Real-time visibility</span> into operations with instant data updates.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> Significantly reduce operational risk and security exposure.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> Build a modern, scalable, future-proof operating model.</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 w-full sm:w-auto">
              <button aria-label="Next steps" onClick={() => {
                if (config.ctaLink) {
                  window.open(config.ctaLink, '_blank');
                } else {
                  window.print();
                }
              }} className="btn-primary w-full sm:w-auto px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 group">
                <Download size={24} className="group-hover:animate-bounce" /> {config.ctaLink ? 'Learn More' : 'Download Report'}
              </button>
              <p className="text-xs text-slate-400 mt-4 font-semibold uppercase tracking-wider">Ready for your decision</p>
            </div>
          </div>
        </section>
      </main>
    </div >
  );
}