import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Gift, 
  Check, 
  Copy, 
  ArrowRight, 
  Flame, 
  MapPin, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface Perk {
  code: string;
  title: string;
  description: string;
  category: 'sell' | 'refurbished' | 'repair' | 'all';
  color: string;
}

const PERKS: Perk[] = [
  {
    code: 'AGRA1500',
    title: '₹1,500 Extra Trade-in Bonus',
    description: 'Applicable on any phone selling/exchange booking in Agra & Bengaluru Hubs.',
    category: 'sell',
    color: '#f59e0b'
  },
  {
    code: 'REFURB750',
    title: '₹750 Off Refurbished Phone',
    description: 'Instant discount on certified refurbished iPhone, Samsung & OnePlus models.',
    category: 'refurbished',
    color: '#3b82f6'
  },
  {
    code: 'FREESHIELD',
    title: 'Free 9H Screen Guard',
    description: 'Complimentary premium screen protector with any doorstep mobile repair.',
    category: 'repair',
    color: '#10b981'
  },
  {
    code: 'BAZAAR1000',
    title: '₹1,000 Exchange Upgrade Credit',
    description: 'Extra credit when you trade in your old phone for a certified upgraded phone.',
    category: 'sell',
    color: '#8b5cf6'
  },
  {
    code: 'VIPEXPRESS',
    title: 'VIP 45-Min Express Dispatch',
    description: 'Priority doorstep technician assignment in Agra (Sanjay Place) & BLR hubs.',
    category: 'all',
    color: '#ec4899'
  },
  {
    code: 'CASHBACK500',
    title: '₹500 Marketplace Cashback Tip',
    description: 'Verified secret bank offer stack on Amazon India and Flipkart purchases.',
    category: 'all',
    color: '#06b6d4'
  }
];

interface BazaarSpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const BazaarSpinModal: React.FC<BazaarSpinModalProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate 
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPerk, setWonPerk] = useState<Perk | null>(() => {
    try {
      const saved = localStorage.getItem('mobilebazaar_active_coupon');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [copied, setCopied] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastSpun = localStorage.getItem('mobilebazaar_last_spin_date');
    if (lastSpun === today) {
      setHasSpunToday(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setCopied(false);

    // Random perk index
    const perkIndex = Math.floor(Math.random() * PERKS.length);
    const selectedPerk = PERKS[perkIndex];

    // Calculate rotation: 5 full spins (1800 deg) + segment angle
    const sliceAngle = 360 / PERKS.length;
    // Align wheel pointer at 0 deg (top)
    const targetDeg = 1800 + (360 - perkIndex * sliceAngle - sliceAngle / 2);

    setRotation(prev => prev + targetDeg);

    setTimeout(() => {
      setSpinning(false);
      setWonPerk(selectedPerk);
      setHasSpunToday(true);
      const today = new Date().toDateString();
      localStorage.setItem('mobilebazaar_last_spin_date', today);
      localStorage.setItem('mobilebazaar_active_coupon', JSON.stringify(selectedPerk));
    }, 4000);
  };

  const handleCopy = () => {
    if (!wonPerk) return;
    navigator.clipboard.writeText(wonPerk.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleApplyNow = () => {
    if (!wonPerk) return;
    localStorage.setItem('mobilebazaar_active_coupon', JSON.stringify(wonPerk));
    onClose();
    if (wonPerk.category === 'sell') {
      onNavigate('/sell');
    } else if (wonPerk.category === 'refurbished') {
      onNavigate('/refurbished');
    } else if (wonPerk.category === 'repair') {
      onNavigate('/repair');
    } else {
      onNavigate('/doorstep');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-white/20 text-white">
              <Gift className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
              MOBILEBAZAAR Daily Rewards
            </span>
          </div>
          
          <h2 className="text-xl font-black">
            Spin the MOBILEBAZAAR Wheel & Save
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Instant exchange bonuses & repair discounts valid in Agra & Bengaluru!
          </p>
        </div>

        {/* Wheel Stage */}
        <div className="p-6 flex flex-col items-center">
          
          <div className="relative w-64 h-64 my-2 flex items-center justify-center">
            
            {/* Wheel Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-500 drop-shadow-md" />
            </div>

            {/* Rotating Wheel Circle */}
            <div
              className="w-56 h-56 rounded-full border-4 border-slate-900 dark:border-white shadow-2xl relative overflow-hidden transition-transform ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: spinning ? '4000ms' : '0ms'
              }}
            >
              {PERKS.map((perk, index) => {
                const angle = (360 / PERKS.length) * index;
                return (
                  <div
                    key={perk.code}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '50% 50%'
                    }}
                  >
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 pt-2 text-center text-[10px] font-black text-white"
                      style={{
                        backgroundColor: perk.color,
                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                      }}
                    >
                      <div className="rotate-0 truncate px-1">
                        {perk.title.split(' ')[0]} {perk.title.split(' ')[1]}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Center Hub */}
              <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-900 text-amber-400 border-4 border-amber-400 flex items-center justify-center font-black text-[11px] shadow-lg">
                BAZAAR
              </div>
            </div>
          </div>

          {/* Spin Trigger Button */}
          {!wonPerk && (
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {spinning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Spinning MobileBazaar Wheel...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>SPIN NOW (FREE DAILY REWARD)</span>
                </>
              )}
            </button>
          )}

          {/* Won Perk Announcement Card */}
          {wonPerk && !spinning && (
            <div className="w-full mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  🎉 Congratulations! You Unlocked:
                </span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {wonPerk.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {wonPerk.description}
                </p>

                {/* Coupon Code Pill */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="px-4 py-1.5 rounded-xl bg-slate-900 text-amber-400 font-mono font-black text-sm tracking-widest border border-slate-700">
                    {wonPerk.code}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    title="Copy promo code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleSpin}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Spin Again
                </button>

                <button
                  onClick={handleApplyNow}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  Apply & Use Perk
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Guaranteed redemption at doorstep in Agra & Bengaluru Hubs</span>
          </div>

        </div>

      </div>
    </div>
  );
};
