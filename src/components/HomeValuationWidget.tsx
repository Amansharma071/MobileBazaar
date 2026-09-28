import React, { useState, useMemo } from 'react';
import { 
  Smartphone, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Award,
  Sparkles
} from 'lucide-react';

interface HomeValuationWidgetProps {
  onNavigate: (path: string) => void;
  defaultCity?: string;
}

export const HomeValuationWidget: React.FC<HomeValuationWidgetProps> = ({ 
  onNavigate,
  defaultCity = 'Agra' 
}) => {
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [selectedModel, setSelectedModel] = useState('iPhone 13');
  const [storage, setStorage] = useState('128GB');
  const [condition, setCondition] = useState<'flawless' | 'good' | 'average' | 'broken'>('good');
  const [hasCharger, setHasCharger] = useState(true);
  const [hasBox, setHasBox] = useState(true);
  const [city, setCity] = useState<'Agra' | 'Bengaluru'>(
    defaultCity.toLowerCase().includes('agra') ? 'Agra' : 'Bengaluru'
  );

  const MODEL_OPTIONS: Record<string, string[]> = {
    Apple: ['iPhone 15 Pro Max', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11'],
    Samsung: ['Galaxy S24 Ultra', 'Galaxy S23 Ultra', 'Galaxy S23 FE', 'Galaxy S22', 'Galaxy A54 5G'],
    OnePlus: ['OnePlus 12', 'OnePlus 11 5G', 'OnePlus 10 Pro', 'OnePlus Nord 3', 'OnePlus 9 Pro'],
    Xiaomi: ['Xiaomi 14', 'Xiaomi 13 Pro', 'Redmi Note 13 Pro+', 'Redmi Note 12 Pro'],
    Google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro']
  };

  const currentModels = MODEL_OPTIONS[selectedBrand] || MODEL_OPTIONS['Apple'];

  // Calculate live estimate
  const estimatedValue = useMemo(() => {
    let base = 25000;
    if (selectedBrand === 'Apple') {
      if (selectedModel.includes('15 Pro')) base = 68000;
      else if (selectedModel.includes('15')) base = 48000;
      else if (selectedModel.includes('14 Pro')) base = 52000;
      else if (selectedModel.includes('14')) base = 36000;
      else if (selectedModel.includes('13')) base = 28000;
      else if (selectedModel.includes('12')) base = 20000;
      else base = 14000;
    } else if (selectedBrand === 'Samsung') {
      if (selectedModel.includes('S24 Ultra')) base = 65000;
      else if (selectedModel.includes('S23 Ultra')) base = 46000;
      else if (selectedModel.includes('S23')) base = 32000;
      else base = 18000;
    } else if (selectedBrand === 'OnePlus') {
      if (selectedModel.includes('12')) base = 39000;
      else if (selectedModel.includes('11')) base = 27000;
      else base = 18000;
    } else {
      base = 22000;
    }

    if (storage === '256GB') base += 2500;
    if (storage === '512GB') base += 5000;

    let multiplier = 1.0;
    if (condition === 'flawless') multiplier = 1.15;
    if (condition === 'good') multiplier = 1.0;
    if (condition === 'average') multiplier = 0.82;
    if (condition === 'broken') multiplier = 0.55;

    let total = Math.round(base * multiplier);
    if (hasCharger) total += 500;
    if (hasBox) total += 500;

    return total;
  }, [selectedBrand, selectedModel, storage, condition, hasCharger, hasBox]);

  const exchangeBonus = 2000;

  const handleBookNow = () => {
    const params = new URLSearchParams({
      brand: selectedBrand,
      model: selectedModel,
      storage,
      condition,
      city,
      estimated: String(estimatedValue)
    });
    onNavigate(`/sell?${params.toString()}`);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Instant Doorstep Phone Valuation
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live 60-90 Min Hubs
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Get maximum value with 32-point inspection & instant UPI transfer at your home or office.
            </p>
          </div>
        </div>

        {/* City Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setCity('Agra')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              city === 'Agra'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Agra Hub</span>
          </button>
          <button
            onClick={() => setCity('Bengaluru')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              city === 'Bengaluru'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Bengaluru Hub</span>
          </button>
        </div>
      </div>

      {/* Interactive Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Brand */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            1. Select Phone Brand
          </label>
          <select
            value={selectedBrand}
            onChange={e => {
              const b = e.target.value;
              setSelectedBrand(b);
              setSelectedModel(MODEL_OPTIONS[b]?.[0] || 'iPhone 13');
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs outline-none focus:border-amber-500"
          >
            {Object.keys(MODEL_OPTIONS).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            2. Exact Model
          </label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs outline-none focus:border-amber-500"
          >
            {currentModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Storage */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            3. Storage Variant
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['128GB', '256GB', '512GB'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStorage(s)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  storage === s
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Condition Pills */}
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
          4. Current Device Physical Condition
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'flawless', label: 'Flawless (Like New)', desc: 'Zero scratches or dents' },
            { id: 'good', label: 'Good Condition', desc: 'Minor daily wear & tear' },
            { id: 'average', label: 'Fair / Scratched', desc: 'Visible marks, works 100%' },
            { id: 'broken', label: 'Screen / Back Cracked', desc: 'Display touch works' }
          ].map(c => {
            const active = condition === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCondition(c.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-xs">{c.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{c.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessories Toggles */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasCharger}
            onChange={e => setHasCharger(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Have Original Box (+₹500)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasBox}
            onChange={e => setHasBox(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Have Original Charger & Cable (+₹500)</span>
        </label>
      </div>

      {/* Live Result Payout Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-700/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Guaranteed Doorstep Payout in {city}</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-white">
              ₹{estimatedValue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              +₹{exchangeBonus.toLocaleString('en-IN')} Exchange Bonus
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 pt-1">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>7-Day Price Lock Guarantee</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>
                {city === 'Agra' ? 'Sanjay Place / Taj Nagari Hub (28m ETA)' : 'Indiranagar / Koramangala Hub (34m ETA)'}
              </span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>100% Certified Data Wipe</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleBookNow}
          className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer transform hover:scale-[1.02] active:scale-95"
        >
          <span>Lock Price & Book Doorstep Visit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
