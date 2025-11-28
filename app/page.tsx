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
  Anchor,
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
  yearlyIntegrationCost: number;
  monthlySalary: number;
  companySize: number;
  hoursPerWeek: number;
  errorCorrectionHours: number;
}

interface Results {
  manualAnnualCost: number;
  apiFirstYearCost: number;
  savings3Year: number;
  breakevenMonths: number;
  roiPercent: number;
  hrCount: number;
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
          <label className="text-sm font-bold text-slate-700 font-jakarta">{label}</label>
          {infoText && (
            <div className="relative">
              <button
                className="text-slate-400 hover:text-blue-500 transition-colors focus:outline-none"
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info size={16} />
              </button>
              {showInfo && (
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                  {infoText}
                  <div className="absolute bottom-0 left-2 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-base font-bold theme-text bg-blue-50/50 px-4 py-1.5 rounded-lg border border-blue-100 flex items-center min-w-[100px] justify-end whitespace-nowrap tabular-nums font-jakarta shadow-sm">
          {formatValue(value)}
        </div>
      </div>

      <div className="flex gap-4 items-center group/slider">
        <div className="flex-1 relative rounded-full transition-all duration-300 h-3">
          <input
            type="range" min={min} max={max} step={step}
            value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
            style={{
              '--track-fill-percent': `${percentage}%`,
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) var(--track-fill-percent), #e2e8f0 var(--track-fill-percent), #e2e8f0 100%)`
            } as React.CSSProperties}
            className="w-full h-3 rounded-full appearance-none cursor-pointer relative z-10 transition-all custom-range-input hover:h-4"
          />
        </div>
        <input
          type="number" min={min} max={max} step={step}
          value={value} onChange={handleManualChange}
          className="w-24 text-center border border-slate-200 rounded-xl p-2 text-sm font-bold text-slate-700 focus:ring-2 theme-ring-focus outline-none transition-all shadow-sm hover:border-blue-300 focus:border-blue-500"
        />
      </div>
      <p className="text-xs text-slate-500 mt-3 ml-1 font-medium font-jakarta flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-slate-300"></span> {description}
      </p>
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
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<Inputs>({
    yearlyIntegrationCost: 5000,
    monthlySalary: 50000,
    companySize: 280,
    hoursPerWeek: 4,
    errorCorrectionHours: 2,
  });

  const [results, setResults] = useState<Results>({
    manualAnnualCost: 0, apiFirstYearCost: 0, savings3Year: 0, breakevenMonths: 0, roiPercent: 0, hrCount: 0
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
      yearlyIntegrationCost: Math.max(0, Math.min(25000, inputs.yearlyIntegrationCost || 0)),
      monthlySalary: Math.max(10000, Math.min(500000, inputs.monthlySalary || 0)),
      companySize: Math.max(70, Math.min(2000, inputs.companySize || 70)),
      hoursPerWeek: Math.max(1, Math.min(40, inputs.hoursPerWeek || 0)),
      errorCorrectionHours: Math.max(0, Math.min(20, inputs.errorCorrectionHours || 0)),
    };

    // Calculate HR Count (1 HR per 70 employees)
    const hrCount = Math.ceil(sanitizedInputs.companySize / 70);

    // Convert monthly salary to hourly rate (assuming 160 working hours per month)
    const hourlyRate = sanitizedInputs.monthlySalary / 160;

    // Total Annual Hours = (Hours per HR * 52 + Error Hours per HR * 12) * HR Count
    const annualHoursPerHR = (sanitizedInputs.hoursPerWeek * 52) + (sanitizedInputs.errorCorrectionHours * 12);
    const totalAnnualHours = annualHoursPerHR * hrCount;

    const manualAnnualCost = totalAnnualHours * hourlyRate;
    const apiFirstYearCost = sanitizedInputs.yearlyIntegrationCost;

    // Calculate 3-year costs
    const manual3Year = manualAnnualCost * 3;
    const api3Year = sanitizedInputs.yearlyIntegrationCost * 3;

    // Ensure no negative values - use Math.max(0, ...)
    const year1Returns = Math.max(0, manualAnnualCost - apiFirstYearCost);
    const savings3Year = Math.max(0, manual3Year - api3Year);

    // Calculate Year 1 ROI (ensure non-negative)
    const roiPercent = apiFirstYearCost > 0 ? Math.max(0, (year1Returns / apiFirstYearCost) * 100) : 0;

    const monthlyManualCost = manualAnnualCost / 12;
    const breakevenMonths = monthlyManualCost > 0 ? (sanitizedInputs.yearlyIntegrationCost / monthlyManualCost) : 0;

    setResults({ manualAnnualCost, apiFirstYearCost, savings3Year, breakevenMonths, roiPercent, hrCount });
  }, [inputs.yearlyIntegrationCost, inputs.monthlySalary, inputs.companySize, inputs.errorCorrectionHours, inputs.hoursPerWeek]);

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
        className={`animate-fade-up ${delay} bg-white rounded-[2rem] p-8 border ${borderColorClass} transition-all duration-300 relative overflow-hidden group`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
      >
        {/* Shine Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none"></div>

        {infoText && (
          <div className="absolute top-4 right-4 z-20">
            <button
              className="text-slate-300 hover:text-blue-500 transition-colors bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm hover:shadow-md"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
            >
              <Info size={16} />
            </button>
            {showInfo && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-left">
                {infoText}
                <div className="absolute top-0 right-3 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className={`${iconColorClass} p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-sm group-hover:shadow-md`}>
            <Icon size={24} />
          </div>
        </div>
        <div className={`text-4xl lg:text-5xl font-black ${valueColorClass} mb-3 tabular-nums whitespace-nowrap overflow-hidden tracking-tight relative z-10`}>
          <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} isVisible={true} />
        </div>
        <p className="text-sm text-slate-500 min-h-[40px] font-medium relative z-10 leading-snug">{description}</p>
      </div>
    );
  };

  const [scrollY, setScrollY] = useState(0);
  const parallax1Ref = useRef<HTMLDivElement>(null);
  const parallax2Ref = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setScrollY(scrolled);

      // Apply parallax transforms directly for performance
      if (parallax1Ref.current) {
        parallax1Ref.current.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
      if (parallax2Ref.current) {
        parallax2Ref.current.style.transform = `translateY(${scrolled * -0.1}px)`;
      }
      if (parallaxBgRef.current) {
        parallaxBgRef.current.style.transform = `translateY(${scrolled * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCompanySizeChange = (newSize: number) => {
    // Auto-calculate hours based on company size (1 HR per 70 employees)
    const newHours = Math.ceil(newSize / 70);
    setInputs(prev => ({
      ...prev,
      companySize: newSize,
      hoursPerWeek: newHours
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 overflow-x-hidden font-jakarta">
      <style>{themeStyles}</style>

      {/* --- Navbar --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 20 ? 'bg-white/90 backdrop-blur-lg shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Company Logo" className="h-10 w-auto object-contain max-h-10" />
            ) : (
              <div className="p-2 theme-bg-light theme-text rounded-full"><BriefcaseBusiness size={24} /></div>
            )}
          </div>
          <div className="flex items-center gap-3 no-print">
            <button onClick={() => setIsHowItWorksOpen(true)} className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all" title="How It Works">
              <Info size={20} />
            </button>
            <button onClick={() => setIsEditingConfig(true)} className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all" title="Customize Theme"><Edit3 size={20} /></button>
            <button onClick={() => window.print()} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-slate-300/50 flex items-center gap-2 transform hover:-translate-y-0.5">
              <Download size={18} /> <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- Config Modal --- */}
      {isEditingConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3 font-jakarta">
              <Palette className="text-purple-500" /> Customize Theme
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Brand Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <input
                      type="color"
                      value={config.themeColor}
                      onChange={(e) => setConfig({ ...config, themeColor: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden shadow-sm transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-xl border border-slate-200 pointer-events-none ring-2 ring-transparent group-hover:ring-slate-100 transition-all"></div>
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">#</span>
                    <input
                      type="text"
                      value={config.themeColor.replace('#', '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow only hex characters
                        if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                          setConfig({ ...config, themeColor: `#${val}` });
                        }
                      }}
                      className="w-full border border-slate-200 rounded-xl py-3 pl-7 pr-4 font-mono text-sm uppercase focus:ring-2 theme-ring-focus outline-none font-medium transition-shadow"
                      placeholder="HEX"
                      maxLength={6}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {['#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b', '#06b6d4'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setConfig({ ...config, themeColor: c })}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 shadow-sm border border-slate-100 ${config.themeColor === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Currency Symbol</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['₹', '$', '€', '£'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setConfig({ ...config, currency: curr })}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${config.currency === curr ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Logo</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer theme-border hover:bg-slate-50 transition-all group relative overflow-hidden"
                >
                  {config.logoUrl ? (
                    <div className="relative z-10 flex flex-col items-center">
                      <img src={config.logoUrl} alt="Logo Preview" className="h-12 w-auto object-contain mb-3" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:theme-text transition-colors">Click to Change</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:theme-text transition-colors">
                      <Upload size={32} className="mb-2" />
                      <span className="text-sm font-bold">Upload Logo</span>
                      <span className="text-xs opacity-70 mt-1">PNG, JPG, SVG up to 2MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setConfig({ ...config, logoUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                {config.logoUrl && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfig({ ...config, logoUrl: null }); }}
                    className="text-xs text-red-500 font-bold mt-2 hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Remove Logo
                  </button>
                )}
              </div>
            </div>

            <button onClick={() => setIsEditingConfig(false)} className="mt-10 w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-300/50">Save & Recalculate</button>
          </div>
        </div>
      )}

      {/* --- How It Works Modal --- */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-200 rounded-t-[2rem] flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-slate-900 font-jakarta flex items-center gap-3">
                <Calculator size={28} className="theme-text" />
                How the ROI Calculator Works
              </h2>
              <button onClick={() => setIsHowItWorksOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Step 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">1</span>
                  Company Size → HR Team Size
                </h3>
                <div className="bg-white p-4 rounded-xl mb-3 font-mono text-sm">
                  <div className="text-slate-600">HR Team Size = <span className="font-bold text-blue-600">Company Size ÷ 70</span></div>
                  <div className="text-xs text-slate-500 mt-2">Example: {inputs.companySize} employees ÷ 70 = <span className="font-bold text-blue-600">{results.hrCount} HR professionals</span></div>
                </div>
                <p className="text-sm text-slate-600">
                  <strong>Why 70?</strong> Industry standard: 1 HR professional typically manages data for ~70 employees. We use this to estimate your HR team size.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">2</span>
                  Hourly Rate Calculation
                </h3>
                <div className="bg-white p-4 rounded-xl mb-3 font-mono text-sm">
                  <div className="text-slate-600">Hourly Rate = <span className="font-bold text-emerald-600">Monthly Salary ÷ 160</span></div>
                  <div className="text-xs text-slate-500 mt-2">Example: {config.currency}{inputs.monthlySalary.toLocaleString()} ÷ 160 = <span className="font-bold text-emerald-600">{config.currency}{(inputs.monthlySalary / 160).toFixed(2)}/hour</span></div>
                </div>
                <p className="text-sm text-slate-600">
                  <strong>Why 160?</strong> Standard working hours per month (8 hours/day × 20 working days). This converts monthly CTC to hourly cost.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">3</span>
                  Total Annual Hours Calculation
                </h3>
                <div className="bg-white p-4 rounded-xl mb-3 font-mono text-sm">
                  <div className="text-slate-600">Total Hours = <span className="font-bold text-amber-600">[(Weekly Hours/HR × 52) + (Error Hours/HR × 12)] × HR Count</span></div>
                  <div className="text-xs text-slate-500 mt-2">
                    Example: [({inputs.hoursPerWeek} × 52) + ({inputs.errorCorrectionHours} × 12)] × {results.hrCount} = <span className="font-bold text-amber-600">{((inputs.hoursPerWeek * 52) + (inputs.errorCorrectionHours * 12)) * results.hrCount} hours/year</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  <strong>The Multiplier Effect:</strong> We calculate the manual work for ONE HR person and multiply it by your estimated HR team size to get the total organizational inefficiency.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">4</span>
                  Manual Annual Cost
                </h3>
                <div className="bg-white p-4 rounded-xl mb-3 font-mono text-sm">
                  <div className="text-slate-600">Manual Cost = <span className="font-bold text-purple-600">Annual Hours × Hourly Rate</span></div>
                  <div className="text-xs text-slate-500 mt-2">
                    Example: {(inputs.hoursPerWeek * 52) + (inputs.errorCorrectionHours * 12)} × {config.currency}{(inputs.monthlySalary / 160).toFixed(2)} = <span className="font-bold text-purple-600">{config.currency}{results.manualAnnualCost.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  <strong>This is the cost of doing nothing.</strong> The money you're already spending on manual data work every year.
                </p>
              </div>

              {/* Step 5 */}
              <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-2xl border border-rose-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">5</span>
                  Year 1 Savings & ROI
                </h3>
                <div className="bg-white p-4 rounded-xl mb-3 font-mono text-sm space-y-2">
                  <div className="text-slate-600">Year 1 Savings = <span className="font-bold text-rose-600">Manual Cost - Integration Cost</span></div>
                  <div className="text-xs text-slate-500">
                    Example: {config.currency}{results.manualAnnualCost.toLocaleString()} - {config.currency}{inputs.yearlyIntegrationCost.toLocaleString()} = <span className="font-bold text-rose-600">{config.currency}{Math.max(0, results.manualAnnualCost - inputs.yearlyIntegrationCost).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="text-slate-600">ROI % = <span className="font-bold text-rose-600">(Savings ÷ Integration Cost) × 100</span></div>
                    <div className="text-xs text-slate-500">
                      Example: ({config.currency}{Math.max(0, results.manualAnnualCost - inputs.yearlyIntegrationCost).toLocaleString()} ÷ {config.currency}{inputs.yearlyIntegrationCost.toLocaleString()}) × 100 = <span className="font-bold text-rose-600">{results.roiPercent.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  <strong>The bottom line:</strong> For every ₹1 you invest in automation, you get ₹{(results.roiPercent / 100 + 1).toFixed(2)} back in Year 1.
                </p>
              </div>

              {/* Interactive Test */}
              <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border-2 border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-yellow-500" />
                  Try It Yourself
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Close this modal and adjust the sliders to see how different company sizes and salaries affect your ROI. The calculations update in real-time!
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <div className="font-bold text-blue-900">Current Company Size</div>
                    <div className="text-2xl font-black text-blue-600">{inputs.companySize}</div>
                    <div className="text-xs text-blue-700">employees</div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl">
                    <div className="font-bold text-emerald-900">Current ROI</div>
                    <div className="text-2xl font-black text-emerald-600">{results.roiPercent.toFixed(0)}%</div>
                    <div className="text-xs text-emerald-700">return in Year 1</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 p-6 border-t border-slate-200 rounded-b-[2rem]">
              <button onClick={() => setIsHowItWorksOpen(false)} className="w-full btn-primary py-4 rounded-xl font-bold text-lg">
                Got It! Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Hero --- */}
      <div className="relative pt-32 pb-48 px-4 hero-background overflow-hidden">
        {/* Parallax Background Elements */}
        <div ref={parallaxBgRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[10%] w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Elements with Parallax */}
        <div ref={parallax1Ref} className="absolute top-20 left-10 hidden lg:block z-10">
          <div className="animate-float delay-100 opacity-80">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500"><AlertTriangle size={16} /></div>
                <div className="text-xs font-bold text-slate-700">Manual Error</div>
              </div>
              <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>

        <div ref={parallax2Ref} className="absolute bottom-40 right-10 hidden lg:block z-10">
          <div className="animate-float delay-700 opacity-80">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500"><CheckCircle2 size={16} /></div>
                <div className="text-xs font-bold text-slate-700">Auto-Synced</div>
              </div>
              <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-up delay-100">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md theme-text text-sm font-extrabold uppercase tracking-wide mb-8 border border-white/50 shadow-lg hover:scale-105 transition-transform duration-300">
            <RefreshCw size={16} className="animate-spin-slow" /> HRMS Integration ROI Calculator
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-tight drop-shadow-sm">
            Stop Manually Emailing <br className="hidden sm:block" />
            <span className="text-shine relative inline-block">
              Employee Data
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            Securely sync HRMS data with your vendors instantly. Eliminate the risk of emailing sensitive Excel sheets and save hundreds of hours in manual formatting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <button onClick={() => document.getElementById('inputs')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 flex items-center gap-3 hover:-translate-y-1 transition-transform">
              Calculate Your Savings <TrendingUp size={20} />
            </button>
            <button onClick={() => setIsHowItWorksOpen(true)} className="px-8 py-4 rounded-2xl text-lg font-bold bg-white text-slate-700 shadow-lg border border-slate-100 flex items-center gap-3 hover:bg-slate-50 hover:-translate-y-1 transition-transform">
              How It Works <Info size={20} />
            </button>
          </div>
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
                  label="Yearly Integration Cost"
                  value={inputs.yearlyIntegrationCost}
                  onChange={(val) => setInputs({ ...inputs, yearlyIntegrationCost: val })}
                  currency={config.currency}
                  min={0} max={25000} step={500} isCurrency={true}
                  delay="delay-300"
                  description="Annual recurring cost for API integration and maintenance."
                  infoText="This is the yearly subscription or license fee. Unlike one-time costs, this recurs annually but stays predictable."
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
                  label="Company Size (Employees)"
                  value={inputs.companySize}
                  onChange={handleCompanySizeChange}
                  unit="employees" min={70} max={2000} step={10}
                  delay="delay-500"
                  description={`Total employees. Est. HR Team: ${results.hrCount} person${results.hrCount !== 1 ? 's' : ''} (1:70 ratio).`}
                  infoText={`Based on a standard 1:70 ratio, we estimate you have ${results.hrCount} HR professionals handling this data.`}
                />
                <InputGroup
                  label="Manual Hours per HR (Weekly)"
                  value={inputs.hoursPerWeek}
                  onChange={(val) => setInputs({ ...inputs, hoursPerWeek: val })}
                  unit="hours/HR" min={1} max={40} step={1}
                  delay="delay-550"
                  description="Average hours each HR person spends on manual data work per week."
                  infoText={`This is the time ONE HR person spends. We multiply this by your HR team size (${results.hrCount}) to get total organizational hours.`}
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
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Annual Hours Saved
                        <InfoTooltip text="Time your HR team gets back to focus on strategic initiatives like talent development, employee engagement, and culture building instead of data entry." />
                      </td>
                      <td className="p-6 font-medium text-slate-500">0 hrs</td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30">{Math.round((inputs.hoursPerWeek * 52) + (inputs.errorCorrectionHours * 12))} hrs/year</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Compliance Risk (PF/ESI/PT)
                        <InfoTooltip text="Manual data sharing increases risk of non-compliance with PF, ESI, and PT regulations. Wrong data = penalties. Automated sync ensures vendor always has correct statutory data." />
                      </td>
                      <td className="p-6 font-medium text-slate-500"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> High Risk</div></td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> Compliant</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Data Security Level
                        <InfoTooltip text="Emailing Excel files = data breach waiting to happen. API integration uses encrypted channels with role-based access control. No more password-protected ZIPs floating in inboxes." />
                      </td>
                      <td className="p-6 font-medium text-slate-500"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> Email/File Sharing</div></td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> Encrypted API</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Audit Trail Availability
                        <InfoTooltip text="For ISO/SOC2 audits, you need to prove who accessed what data when. Manual processes have no trail. APIs log every transaction automatically." />
                      </td>
                      <td className="p-6 font-medium text-slate-500"><div className="flex items-center gap-2"><X size={16} className="text-red-500" /> No Trail</div></td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30"><div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Full Audit Log</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Statutory Reporting Readiness
                        <InfoTooltip text="Form 16, Form 24Q, Annual Returns - all require accurate employee data. Manual errors delay filings. Automated sync means your vendor data matches HRMS, reducing reconciliation time by 80%." />
                      </td>
                      <td className="p-6 font-medium text-slate-500"><div className="flex items-center gap-2"><Clock size={16} className="text-amber-500" /> Manual Reconciliation</div></td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30"><div className="flex items-center gap-2"><Zap size={16} className="text-emerald-500" /> Auto-Synced</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-bold text-slate-700">
                        Scalability (Growth Ready)
                        <InfoTooltip text="Hiring 100 new employees? Manual process means 100 new rows to format. API scales automatically. Whether you add 10 or 1000 employees, the integration cost stays the same." />
                      </td>
                      <td className="p-6 font-medium text-slate-500"><div className="flex items-center gap-2"><TrendingUp size={16} className="text-red-500" /> Cost Increases</div></td>
                      <td className="p-6 font-bold theme-text bg-blue-50/30"><div className="flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" /> Fixed Cost</div></td>
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
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" /> <span><span className="font-bold">Reclaim {Math.round(inputs.hoursPerWeek * 52 + inputs.errorCorrectionHours * 12)} annual hours</span> per HR.</span></li>
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