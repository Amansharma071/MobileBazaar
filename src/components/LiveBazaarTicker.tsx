import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Pause, 
  Play, 
  Gift, 
  ShieldCheck, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface TickerPulse {
  id: string;
  type: 'sale' | 'drop' | 'inspection' | 'bonus' | 'city';
  city: 'Agra' | 'Bengaluru' | 'All';
  text: string;
  highlight: string;
  timeAgo: string;
  actionText?: string;
  actionRoute?: string;
}

const LIVE_PULSES: TickerPulse[] = [
  {
    id: 'p-1',
    type: 'sale',
    city: 'Agra',
    text: 'Sanjay Place Hub: Instant UPI payout of ₹24,800 completed for iPhone 13',
    highlight: '₹24,800 Instant Payout',
    timeAgo: '2m ago',
    actionText: 'Value Your Phone',
    actionRoute: '/sell'
  },
  {
    id: 'p-2',
    type: 'drop',
    city: 'All',
    text: 'Samsung Galaxy S24 Ultra lowest price dropped by ₹4,000 on Amazon India',
    highlight: '₹4,000 Price Drop',
    timeAgo: '5m ago',
    actionText: 'View Deal',
    actionRoute: '/deals'
  },
  {
    id: 'p-3',
    type: 'inspection',
    city: 'Agra',
    text: 'Taj Nagari Hub: Specialist Vikas Verma en route (ETA 22 mins) for OnePlus 11 screen test',
    highlight: 'Agra Express Hub Active',
    timeAgo: '7m ago',
    actionText: 'Agra Hubs',
    actionRoute: '/cities'
  },
  {
    id: 'p-4',
    type: 'bonus',
    city: 'Bengaluru',
    text: 'Indiranagar Hub: ₹2,000 exchange upgrade bonus applied for iPhone 16 order',
    highlight: '+₹2,000 Bonus',
    timeAgo: '11m ago',
    actionText: 'Exchange & Upgrade',
    actionRoute: '/exchange'
  },
  {
    id: 'p-5',
    type: 'drop',
    city: 'All',
    text: 'OnePlus 12R 5G now at all-time low ₹39,999 with ₹2,000 ICICI card discount',
    highlight: 'All-Time Low',
    timeAgo: '14m ago',
    actionText: 'Compare Prices',
    actionRoute: '/phones/oneplus-12r'
  },
  {
    id: 'p-6',
    type: 'sale',
    city: 'Agra',
    text: 'Kamla Nagar, Agra: Certified refurbished iPhone 14 delivered in 75 mins with 1-year warranty',
    highlight: '75-Min Delivery in Agra',
    timeAgo: '18m ago',
    actionText: 'Refurbished Store',
    actionRoute: '/refurbished'
  }
];

interface LiveBazaarTickerProps {
  onNavigate: (path: string) => void;
  onOpenSpinModal: () => void;
  activeCity?: string;
}

export const LiveBazaarTicker: React.FC<LiveBazaarTickerProps> = ({ 
  onNavigate, 
  onOpenSpinModal,
  activeCity 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cityFilter, setCityFilter] = useState<'All' | 'Agra' | 'Bengaluru'>(
    activeCity === 'Agra' ? 'Agra' : activeCity === 'Bengaluru' ? 'Bengaluru' : 'All'
  );

  const filteredPulses = LIVE_PULSES.filter(p => {
    if (cityFilter === 'All') return true;
    return p.city === cityFilter || p.city === 'All';
  });

  useEffect(() => {
    if (isPaused || filteredPulses.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredPulses.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, filteredPulses.length]);

  const currentPulse = filteredPulses[currentIndex] || LIVE_PULSES[0];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900/40 text-white text-xs py-2 px-3 sm:px-6 relative overflow-hidden z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Live indicator & City quick switch */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE BAZAAR FEED</span>
          </div>

          <div className="hidden md:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-[10px] font-semibold">
            {(['All', 'Agra', 'Bengaluru'] as const).map(city => (
              <button
                key={city}
                onClick={() => {
                  setCityFilter(city);
                  setCurrentIndex(0);
                }}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  cityFilter === city
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {city === 'All' ? 'All Hubs' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Dynamic Animated Pulse Message */}
        <div className="flex-1 min-w-[240px] flex items-center justify-center sm:justify-start gap-2 overflow-hidden">
          <div 
            key={currentPulse.id}
            className="flex items-center gap-2 truncate animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {currentPulse.type === 'drop' && (
              <span className="p-1 rounded-md bg-rose-500/20 text-rose-400 shrink-0">
                <TrendingDown className="w-3.5 h-3.5" />
              </span>
            )}
            {currentPulse.type === 'sale' && (
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </span>
            )}
            {currentPulse.type === 'inspection' && (
              <span className="p-1 rounded-md bg-blue-500/20 text-blue-400 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </span>
            )}
            {currentPulse.type === 'bonus' && (
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            )}

            <span className="text-slate-300 truncate">
              {currentPulse.text}
            </span>

            <span className="text-[10px] text-slate-400 shrink-0 hidden lg:inline">
              ({currentPulse.timeAgo})
            </span>

            {currentPulse.actionRoute && (
              <button
                onClick={() => onNavigate(currentPulse.actionRoute!)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline decoration-amber-400/50 hover:decoration-amber-300 shrink-0 flex items-center gap-0.5 ml-1 cursor-pointer"
              >
                {currentPulse.actionText || 'View'}
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Gamified Spin & Win / Pause Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSpinModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-[11px] shadow-sm shadow-amber-500/20 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 animate-bounce" />
            <span>Spin & Win Perks</span>
          </button>

          <button
            onClick={() => setIsPaused(prev => !prev)}
            title={isPaused ? 'Resume live updates' : 'Pause live updates'}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
