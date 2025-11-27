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
  Info,
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
  infoText?: string;
}

interface KPICardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color?: string;
  delay: string;
  description: string;
  infoText?: string;
}

interface Config {
  vendorName: string;
  currency: string;
  themeColor: string;
  logoUrl: string | null;
}

interface Inputs {
  apiCost: number;
  monthlySalary: number;
  hoursPerWeek: number;
  errorCorrectionHours: number;
}

interface Results {
  manualAnnualCost: number;
  apiFirstYearCost: number;
  savings3Year: number;
  breakevenMonths: number;
  roiPercent: number;
}

// --- Reusable Components ---

const InfoTooltip = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative inline-flex items-center ml-2 group/tooltip z-40 align-middle">
      <button
        className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => { e.stopPropagation(); setIsVisible(!isVisible); }}
        aria-label="More information"
      >
        <Info size={15} />
      </button>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 text-left font-normal normal-case leading-relaxed pointer-events-none">
          {text}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
        </div>
      )}
    </div>
  );
};

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

  return (
    <span className="tabular-nums font-jakarta">
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
};

// Component for a single Input/Slider group
const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, currency, unit, min, max, step, delay, isCurrency, description, infoText }) => {
  const [showInfo, setShowInfo] = useState(false);

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
    <div className={`animate-fade-up ${delay} p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md relative group/input`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 font-jakarta">{label}</label>
          {infoText && (
            <div className="relative">
              <button
                className="text-slate-400 hover:text-slate-600 transition-colors"
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info size={14} />
              </button>
              {showInfo && (
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                  {infoText}
                  <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
                </div>
              )}
            </div>
          )}
        </div>
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
    logoUrl: null               // Company logo URL or base64 string (null = default icon)
  });

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<Inputs>({
    apiCost: 0,
    monthlySalary: 50000,
    hoursPerWeek: 4,
    errorCorrectionHours: 2,
  });

  const [results, setResults] = useState<Results>({
    manualAnnualCost: 0, apiFirstYearCost: 0, savings3Year: 0, breakevenMonths: 0, roiPercent: 0
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
      apiCost: Math.max(0, Math.min(5000000, inputs.apiCost || 0)),
      monthlySalary: Math.max(10000, Math.min(500000, inputs.monthlySalary || 0)),
      hoursPerWeek: Math.max(1, Math.min(40, inputs.hoursPerWeek || 0)),
      errorCorrectionHours: Math.max(0, Math.min(20, inputs.errorCorrectionHours || 0)),
    };

    // Convert monthly salary to hourly rate (assuming 160 working hours per month)
    const hourlyRate = sanitizedInputs.monthlySalary / 160;

    const annualManualHours = (sanitizedInputs.hoursPerWeek * 52) + (sanitizedInputs.errorCorrectionHours * 12);
    const manualAnnualCost = annualManualHours * hourlyRate;
    const apiFirstYearCost = sanitizedInputs.apiCost;
    const manual3Year = manualAnnualCost * 3;
    const api3Year = apiFirstYearCost;
    const savings3Year = manual3Year - api3Year;

    // Calculate Year 1 ROI (not 3-year)
    const year1NetBenefit = manualAnnualCost - apiFirstYearCost;
    const roiPercent = apiFirstYearCost > 0 ? (year1NetBenefit / apiFirstYearCost) * 100 : 0;

    const monthlyManualCost = manualAnnualCost / 12;
    const breakevenMonths = monthlyManualCost > 0 ? (sanitizedInputs.apiCost / monthlyManualCost) : 0;

    setInputs(sanitizedInputs);
    setResults({ manualAnnualCost, apiFirstYearCost, savings3Year, breakevenMonths, roiPercent });
  }, [inputs.apiCost, inputs.monthlySalary, inputs.hoursPerWeek, inputs.errorCorrectionHours]);

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

    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

    .theme-text { color: var(--primary); }
    .theme-bg { background-color: var(--primary); }
    .theme-bg-light { background-color: var(--primary-light); }
    .theme-border { border-color: var(--primary); }
    .theme-ring-focus:focus { --tw-ring-color: var(--primary); }
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

  // --- Chart Data with Inflation Logic ---
  // Adding 8% annual salary inflation to make the manual cost projection realistic and defensible.
  const inflationRate = 1.08;

  const manualY1 = results.manualAnnualCost;
  const manualY2 = manualY1 * inflationRate;
  const manualY3 = manualY2 * inflationRate;

  const cumulativeManualY1 = manualY1;
  const cumulativeManualY2 = manualY1 + manualY2;
  const cumulativeManualY3 = manualY1 + manualY2 + manualY3;

  // Assuming API cost is front-loaded (CapEx) with minimal maintenance for this simplified view,
  // or we can treat the inputs as they are. 
  // For the chart to be "reasonable", we should compare CUMULATIVE spend.
  const cumulativeApiY1 = results.apiFirstYearCost;
  // Assuming 15% AMC (Annual Maintenance Cost) for API after Year 1 if not specified, 
  // but to stick to current inputs, we'll keep it flat or assume the "Setup" covers 3 years?
  // Actually, usually there's a subscription. Let's assume the "Setup Cost" is the main hurdle 
  // and maybe a small running cost. 
  // For now, let's keep API flat to highlight the CapEx vs OpEx, but the Manual curve should curve UP.

  const chartData = [
    {
      name: 'Year 1',
      'Manual Process': Math.round(cumulativeManualY1),
      'API Automation': Math.round(cumulativeApiY1)
    },
    {
      name: 'Year 2',
      'Manual Process': Math.round(cumulativeManualY2),
      'API Automation': Math.round(cumulativeApiY1) // CapEx model (paid once)
    },
    {
      name: 'Year 3',
      'Manual Process': Math.round(cumulativeManualY3),
      'API Automation': Math.round(cumulativeApiY1)
    },
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

  const KPICard: React.FC<KPICardProps> = ({ title, value, unit, icon: Icon, color, delay, description, infoText }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

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

    return (
      <div
        ref={cardRef}
        className={`bg-white p-8 rounded-[2rem] shadow-xl border ${borderColorClass} transition-all duration-500 will-change-transform animate-fade-up ${delay} hover:z-30 font-jakarta relative`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
      >
        {infoText && (
          <div className="absolute top-4 right-4 z-20">
            <button
              className="text-slate-300 hover:text-slate-500 transition-colors bg-white rounded-full p-1"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
            >
              <Info size={16} />
            </button>
            {showInfo && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-left">
                {infoText}
              </div>
            )}
          </div>
        )}
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
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 overflow-x-hidden font-jakarta">
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
            <button onClick={() => setIsEditingConfig(true)} className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all" title="Customize Theme"><Edit3 size={20} /></button>
            <button onClick={() => window.print()} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-slate-300/50 flex items-center gap-2 transform hover:-translate-y-0.5">
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
              <button onClick={() => setIsEditingConfig(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2"><X size={24} /></button>
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
                    <button onClick={(e) => { e.stopPropagation(); setConfig(prev => ({ ...prev, logoUrl: null })); }} className="ml-3 text-red-500 hover:text-red-700"><X size={16} /></button>
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
            </div>
            <button onClick={() => setIsEditingConfig(false)} className="mt-10 w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-300/50">Save & Recalculate</button>
          </div>
        </div>
      )}

      {/* --- Hero --- */}
      <div className="relative pt-20 pb-40 px-4 hero-background">
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-up delay-100">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full theme-bg-light theme-text text-sm font-extrabold uppercase tracking-wide mb-8 border theme-border border-opacity-50 backdrop-blur-sm shadow-inner shadow-slate-100/50">
            <RefreshCw size={16} className="animate-spin-slow" /> HRMS Integration ROI Calculator
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Stop Manually Emailing <span className="text-shine">Employee Data</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Securely sync HRMS data with your vendors instantly. Eliminate the risk of emailing sensitive Excel sheets and save hundreds of hours in manual formatting.
          </p>
        </div>
      </div>

      <QuickNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
        {/* Slide 1: Calculator Section */}
        <section id="inputs" className="min-h-[90vh] flex flex-col justify-center py-10 page-break-avoid">
          <div className="animate-fade-up delay-200">
            <div className="bg-white rounded-[2rem] shadow-3xl shadow-slate-400/20 p-8 lg:p-10 border-t-8 theme-border relative overflow-hidden group theme-shadow-lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 theme-bg-light theme-text rounded-2xl shadow-md"><Calculator size={24} /></div>
                <h2 className="font-extrabold text-2xl text-slate-800 font-jakarta">Input Metrics</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputGroup
                  label="One-time Setup Cost"
                  value={inputs.apiCost}
                  onChange={(val) => setInputs({ ...inputs, apiCost: val })}
                  currency={config.currency}
                  min={0} max={5000000} step={10000} isCurrency={true}
                  delay="delay-300"
                  description="The initial investment to automate your process (Software + Implementation)."
                  infoText="This is your 'CapEx'. It includes the software license, onboarding fee, and any initial engineering work required to get started."
                />
                <InputGroup
                  label="HR Employee Monthly Salary (CTC)"
                  value={inputs.monthlySalary}
                  onChange={(val) => setInputs({ ...inputs, monthlySalary: val })}
                  currency={config.currency}
                  min={10000} max={500000} step={5000} isCurrency={true}
                  delay="delay-400"
                  description="Total monthly cost to company (CTC) for the HR person handling this work."
                  infoText="Enter the full monthly CTC including base salary, PF, insurance, and benefits. We'll automatically calculate the hourly cost (CTC ÷ 160 hours)."
                />
                <InputGroup
                  label="HRMS Download & Formatting (Weekly)"
                  value={inputs.hoursPerWeek}
                  onChange={(val) => setInputs({ ...inputs, hoursPerWeek: val })}
                  unit="hrs" min={1} max={40} step={0.5}
                  delay="delay-500"
                  description="Time spent logging into HRMS, generating reports, cleaning columns in Excel, and emailing vendors."
                  infoText="This is the 'grunt work'. Downloading a CSV, deleting columns, formatting dates, and zipping it with a password takes time every single week."
                />
                <InputGroup
                  label="Data Correction & Re-sends (Monthly)"
                  value={inputs.errorCorrectionHours}
                  onChange={(val) => setInputs({ ...inputs, errorCorrectionHours: val })}
                  unit="hrs" min={0} max={20} step={1}
                  delay="delay-600"
                  description="Time lost when vendors reject files due to wrong formats or missing fields."
                  infoText="Manual files often have errors. This is the time spent going back and forth with the vendor to fix 'bad data' or re-sending lost emails."
                />
              </div>
            </div>
            {/* KPI Cards merged into Inputs slide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Breakeven Card */}
              <div className="animate-fade-up delay-300">
                <KPICard
                  title="One Year Returns"
                  value={results.manualAnnualCost - results.apiFirstYearCost}
                  unit=""
                  icon={Clock}
                  delay="delay-400"
                  description="Net savings in the first 12 months."
                  infoText="This is the actual cash you save in Year 1 after paying for the software. Positive means you're already profitable!"
                />
              </div>

              {/* Featured Savings Card */}
              <div className="animate-fade-up delay-400">
                <div className="bg-gradient-to-br from-emerald-50 via-white to-white p-8 rounded-[2rem] shadow-2xl border-2 border-emerald-100 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 h-full">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-100/30 to-transparent rounded-full blur-3xl -mr-24 -mt-24"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">💰 3-Year Net Savings</p>
                        <div className="group/tooltip relative">
                          <Info size={14} className="text-emerald-400 cursor-help" />
                          <div className="absolute left-0 bottom-full mb-2 w-48 bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                            Total money saved after subtracting the software cost.
                          </div>
                        </div>
                      </div>
                      <div className="bg-emerald-100 p-3 rounded-xl"><Coins size={22} className="text-emerald-600" /></div>
                    </div>
                    <div className="text-5xl font-black text-emerald-600 mb-2 tabular-nums"><CountUp end={results.savings3Year} prefix={config.currency} suffix="" decimals={0} isVisible={true} duration={2500} /></div>
                    <p className="text-xs text-slate-500">Pure profit retained by the company.</p>
                  </div>
                </div>
              </div>

              {/* ROI Card */}
              <div className="animate-fade-up delay-500">
                <KPICard
                  title="Return on Investment"
                  value={results.roiPercent}
                  unit="%"
                  icon={Zap}
                  color="success"
                  delay="delay-600"
                  description="First year ROI percentage."
                  infoText="For every ₹1 you invest, this is the percentage return you get in Year 1. Example: 100% ROI means you double your money in the first year."
                />
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
                  <h3 className="text-2xl font-extrabold text-slate-900 font-jakarta">
                    Cumulative Cost Comparison
                    <InfoTooltip text="This chart adds up the costs year over year. It shows the total amount of money leaving your bank account over time." />
                  </h3>
                  <p className="text-slate-500 font-semibold mt-1 text-sm font-jakarta">Visualizing OpEx vs. CapEx over 3 years.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider font-jakarta">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="w-3 h-3 rounded-full bg-slate-300 shadow-inner"></span>
                    Manual Process
                    <InfoTooltip text="This bar grows taller because salaries rise by ~8% every year, making the same work more expensive." />
                  </span>
                  <span className="flex items-center gap-2 theme-text">
                    <span className="w-3 h-3 rounded-full theme-bg shadow-lg shadow-blue-500/30"></span>
                    API Automation
                    <InfoTooltip text="This bar stays flat because software licenses don't ask for a raise. You pay a fixed cost." />
                  </span>
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

            {/* Explanation of Cost Divergence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-fade-up delay-600">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <TrendingUp size={18} className="text-red-500" /> Why Manual Costs Rise
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Manual processes are never static. They compound due to <strong>annual salary inflation (~8-10%)</strong> and increasing data volume. As your company grows, the "grunt work" of formatting Excel sheets grows linearly, creating a rising cost curve.
                </p>
              </div>
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold theme-text mb-2 flex items-center gap-2">
                  <ShieldCheck size={18} /> Why API Costs Stay Flat
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our pricing is based on a fixed technology license. Whether you sync 100 or 10,000 employee records, the software cost remains constant. This gives you <strong>"Zero Marginal Cost"</strong> scale—you grow without paying more.
                </p>
              </div>
            </div>

            {/* Table merged into Chart slide */}
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-fade-up delay-600 mt-8">
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-left text-sm border-collapse font-jakarta mt-8">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-6 font-extrabold text-slate-600 uppercase tracking-wider w-1/3">Metric</th>
                      <th className="p-6 font-extrabold text-slate-400 uppercase tracking-wider w-1/3">Legacy Manual Process</th>
                      <th className="p-6 font-extrabold theme-text uppercase tracking-wider w-1/3">API Automation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Annual Operational Cost (OpEx)
                        <InfoTooltip text="This is the recurring money you burn every year just to keep the lights on. Manual work burns cash forever; Automation stops the burn." />
                      </td>
                      <td className="p-6 font-medium text-slate-500">{config.currency}{results.manualAnnualCost.toLocaleString()}</td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30">{config.currency}0 <span className="text-xs font-normal text-slate-400 ml-1">(After Year 1)</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        3-Year Total Cost of Ownership
                        <InfoTooltip text="The big picture. It includes the setup fee plus all the running costs for 3 years. Notice how Manual ends up costing way more?" />
                      </td>
                      <td className="p-6 font-medium text-slate-500">{config.currency}{(results.manualAnnualCost * 3).toLocaleString()}</td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30">{config.currency}{results.apiFirstYearCost.toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Error Rate & Risk
                        <InfoTooltip text="Humans make mistakes when tired or distracted. APIs don't. One wrong digit in a payroll file can cost millions in compliance fines." />
                      </td>
                      <td className="p-6 font-medium text-slate-500"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> High (Human Error)</div></td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30"><div className="flex items-center gap-2"><ShieldCheck size={16} /> Near Zero (Automated)</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Data Latency
                        <InfoTooltip text="How old is your data? Manual reports are 'stale' by the time you get them. APIs give you live data, like a stock ticker." />
                      </td>
                      <td className="p-6 font-medium text-slate-500"><div className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /> Days/Weeks (Batch)</div></td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30"><div className="flex items-center gap-2"><Zap size={16} /> Real-time (Instant)</div></td>
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
              <Coins size={20} /> FINAL MANDATE: INVESTMENT & ACTION
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight max-w-2xl">
              Stop paying for <span className="text-shine">Manual Processes</span>. Start investing in <span className="savings-gradient-text">Growth</span>.
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl font-medium leading-relaxed">
              By switching to API automation, you save <span className="font-bold text-slate-900 underline decoration-wavy decoration-emerald-400">{config.currency}{(results.manualAnnualCost - results.apiFirstYearCost).toLocaleString()}</span> in the first year alone and generate <span className="font-bold text-emerald-600">{config.currency}{results.savings3Year.toLocaleString()}</span> in pure profit over 3 years.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-6 border-t border-slate-200">
              <div className="text-left p-6 border border-slate-100 rounded-2xl bg-white shadow-lg">
                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                  <Users size={20} className="text-pink-500" /> For HR & Admin Leaders
                </h4>
                <ul className="text-slate-600 space-y-2 text-sm font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> <span><span className="font-bold">Reclaim {Math.round(inputs.hoursPerWeek * 52 + inputs.errorCorrectionHours * 12)} annual hours</span> per employee.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> Reduce error-related stress and boost data quality.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> Reallocate talent to high-value strategic work.</li>
                </ul>
              </div>
              <div className="text-left p-6 border border-slate-100 rounded-2xl bg-white shadow-lg">
                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                  <Briefcase size={20} className="theme-text" /> For Business & Ops Leaders
                </h4>
                <ul className="text-slate-600 space-y-2 text-sm font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> <span><span className="font-bold">Achieve real-time business intelligence</span> (Zero Latency).</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> Mitigate security risks associated with file sharing.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> Establish a scalable, future-proof data pipeline.</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 w-full sm:w-auto">
              <button onClick={() => window.print()} className="btn-primary w-full sm:w-auto px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 group">
                <Download size={24} className="group-hover:animate-bounce" /> Download Executive Report
              </button>
              <p className="text-xs text-slate-400 mt-4 font-semibold uppercase tracking-wider">Ready for Board Presentation</p>
            </div>
          </div>
        </section>
      </main>
    </div >
  );
}