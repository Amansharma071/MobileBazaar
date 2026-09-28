import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Camera, 
  Zap, 
  BatteryCharging, 
  ArrowRight, 
  GitCompare, 
  Heart, 
  ExternalLink,
  Flame,
  Check,
  RefreshCw,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../types/index.js';
import { useCompare } from '../context/CompareContext.js';
import { useWishlist } from '../context/WishlistContext.js';

interface InteractiveDeviceFinderProps {
  products: Product[];
  onNavigate: (path: string) => void;
  activeCity?: string;
}

type PriorityType = 'all' | 'camera' | 'gaming' | 'battery' | 'discount';

export const InteractiveDeviceFinder: React.FC<InteractiveDeviceFinderProps> = ({
  products,
  onNavigate,
  activeCity = 'Agra'
}) => {
  const [maxBudget, setMaxBudget] = useState<number>(65000);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [priority, setPriority] = useState<PriorityType>('all');
  const [only5G, setOnly5G] = useState<boolean>(true);

  const { addToCompare, isInCompare } = useCompare();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Determine budget label tier
  const budgetTier = useMemo(() => {
    if (maxBudget < 20000) return { label: 'Budget Champion', color: 'text-emerald-500 bg-emerald-500/10' };
    if (maxBudget < 40000) return { label: 'Mid-Range Value King', color: 'text-blue-500 bg-blue-500/10' };
    if (maxBudget < 75000) return { label: 'Flagship Killer Tier', color: 'text-purple-500 bg-purple-500/10' };
    return { label: 'Ultra Premium Flagship', color: 'text-amber-500 bg-amber-500/10' };
  }, [maxBudget]);

  // Filtered recommendations
  const matchedPhones = useMemo(() => {
    return products.filter(phone => {
      // Budget check
      if (phone.lowestPrice > maxBudget) return false;

      // Brand check
      if (selectedBrand !== 'All' && phone.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // 5G check
      if (only5G && !phone.is5G) return false;

      // Priority check
      if (priority === 'camera') {
        return phone.rearCameraMP >= 50;
      }
      if (priority === 'battery') {
        return phone.batteryCapacity >= 5000;
      }
      if (priority === 'gaming') {
        const proc = phone.processor.toLowerCase();
        return proc.includes('snapdragon 8') || proc.includes('dimensity 9') || proc.includes('bionic') || proc.includes('a18') || proc.includes('a17');
      }
      if (priority === 'discount') {
        const discount = ((phone.startingPrice - phone.lowestPrice) / phone.startingPrice) * 100;
        return discount >= 8;
      }

      return true;
    }).slice(0, 4);
  }, [products, maxBudget, selectedBrand, priority, only5G]);

  const brands = ['All', 'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'Realme', 'Nothing'];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Mobile Matcher</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Find Your Perfect Smartphone & Trade-in Payout
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Slide your budget, pick your top priority, and discover verified lowest marketplace prices with instant doorstep exchange options in {activeCity || 'Agra'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMaxBudget(50000);
              setSelectedBrand('All');
              setPriority('all');
              setOnly5G(true);
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-8">
        
        {/* Budget Slider */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              Maximum Budget
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${budgetTier.color}`}>
                {budgetTier.label}
              </span>
              <span className="text-base font-black text-amber-400">
                ₹{maxBudget.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <input
            type="range"
            min={12000}
            max={150000}
            step={2000}
            value={maxBudget}
            onChange={e => setMaxBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>₹12,000</span>
            <span>₹50,000</span>
            <span>₹1,00,000</span>
            <span>₹1,50,000+</span>
          </div>
        </div>

        {/* Priority Focus */}
        <div className="lg:col-span-4 space-y-2">
          <span className="font-bold text-slate-300 text-xs block">
            What Matters Most?
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All-Rounder', icon: Sparkles },
              { id: 'camera', label: 'Top Cameras', icon: Camera },
              { id: 'gaming', label: 'High Performance', icon: Zap },
              { id: 'battery', label: '5000mAh+', icon: BatteryCharging },
              { id: 'discount', label: 'Big Discount', icon: Tag }
            ].map(item => {
              const Icon = item.icon;
              const active = priority === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPriority(item.id as PriorityType)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand Selector */}
        <div className="lg:col-span-3 space-y-2">
          <span className="font-bold text-slate-300 text-xs block">
            Brand Preference
          </span>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold outline-none focus:border-amber-400"
          >
            {brands.map(b => (
              <option key={b} value={b}>{b === 'All' ? 'Any Trusted Brand' : b}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Matched Product Cards Grid */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <span>Matches ({matchedPhones.length}):</span>
            <span className="text-amber-400 font-semibold">
              Live price comparison across Amazon, Flipkart, Croma & Reliance
            </span>
          </div>

          <button
            onClick={() => onNavigate('/phones')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View All Phones
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {matchedPhones.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10 p-6">
            <p className="text-slate-300 font-semibold text-sm">
              No smartphones found matching budget ₹{maxBudget.toLocaleString('en-IN')} with these specific filters.
            </p>
            <button
              onClick={() => {
                setMaxBudget(80000);
                setSelectedBrand('All');
                setPriority('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Expand Budget to ₹80,000
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {matchedPhones.map(phone => {
              const savings = Math.max(0, phone.startingPrice - phone.lowestPrice);
              const isCompared = isInCompare(phone.id);
              const isFavorited = isInWishlist(phone.id);

              return (
                <div
                  key={phone.id}
                  className="group rounded-2xl bg-slate-850/90 border border-slate-800 hover:border-blue-500/50 p-4 transition-all hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Top badges */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        {phone.brand}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => addToCompare(phone)}
                          title="Compare phone"
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isCompared ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(phone)}
                          title="Save to wishlist"
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isFavorited ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Image stage */}
                    <div 
                      onClick={() => onNavigate(`/phones/${phone.slug}`)}
                      className="h-32 flex items-center justify-center cursor-pointer my-2"
                    >
                      <img
                        src={phone.image}
                        alt={phone.model}
                        className="max-h-28 w-auto object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Title & key specs */}
                    <h4 
                      onClick={() => onNavigate(`/phones/${phone.slug}`)}
                      className="font-bold text-white text-sm line-clamp-1 hover:text-blue-400 cursor-pointer"
                    >
                      {phone.model}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {phone.processor} • {phone.ram}
                    </p>
                  </div>

                  {/* Pricing & Interactive Trade-in CTA */}
                  <div className="pt-3 border-t border-slate-800 mt-3">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <div className="text-[10px] text-slate-400">Best Price</div>
                        <div className="text-lg font-black text-amber-400">
                          ₹{phone.lowestPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                      {savings > 0 && (
                        <div className="text-right text-[10px] text-emerald-400 font-bold">
                          Save ₹{savings.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <button
                        onClick={() => onNavigate(`/phones/${phone.slug}`)}
                        className="w-full py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Compare {phone.bestOfferMarketplace} Deal
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onNavigate(`/exchange?target=${encodeURIComponent(phone.model)}`)}
                        className="w-full py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Flame className="w-3 h-3 text-amber-400" />
                        Doorstep Trade-in Bonus
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
