import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  TrendingDown, 
  Percent, 
  Calendar, 
  Clock, 
  Bell, 
  CheckCircle2, 
  ArrowRight,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { Product, SaleEvent } from '../types/index.js';
import { api } from '../lib/api.js';
import { ProductCard } from '../components/ProductCard.js';

interface DealsViewProps {
  onNavigate: (path: string) => void;
}

export const DealsView: React.FC<DealsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'drops' | 'discounts' | 'sales'>('today');
  const [deals, setDeals] = useState<{
    todayDeals: Product[];
    biggestDiscounts: Product[];
    priceDrops: Product[];
    bestValue: Product[];
  }>({
    todayDeals: [],
    biggestDiscounts: [],
    priceDrops: [],
    bestValue: []
  });
  const [sales, setSales] = useState<SaleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribedSaleId, setSubscribedSaleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dealsRes, salesRes] = await Promise.all([
          api.getDeals(),
          api.getSales()
        ]);
        setDeals(dealsRes);
        setSales(salesRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribeSale = (saleId: string) => {
    setSubscribedSaleId(saleId);
    setTimeout(() => setSubscribedSaleId(null), 3000);
  };

  const getSaleTimeRemaining = (startDateStr: string) => {
    const diff = new Date(startDateStr).getTime() - Date.now();
    if (diff <= 0) return 'Live Now!';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `Starts in ${days} days`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Flame className="w-4 h-4 fill-current" />
            <span>Verified Bargain Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Live Deals, Price Cuts & Upcoming Sales
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Real-time feed tracking of Indian marketplace price cuts. Compare bank offers, exchange bonuses, and festive discounts before buying.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'today'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          Today's Top Deals ({deals.todayDeals.length})
        </button>

        <button
          onClick={() => setActiveTab('drops')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'drops'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Recent Price Drops ({deals.priceDrops.length})
        </button>

        <button
          onClick={() => setActiveTab('discounts')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'discounts'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Percent className="w-4 h-4" />
          Highest % Discounts ({deals.biggestDiscounts.length})
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'sales'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Festival Sales Calendar ({sales.length})
        </button>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'sales' ? (
        /* Upcoming Festival Sales Schedule (Section 22, 23) */
        <div className="space-y-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Major Indian E-Commerce Sale Calendar (2026-2027)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Plan your smartphone purchase around verified marketplace festival windows for maximum exchange and credit card discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sales.map(sale => {
              const isSubscribed = subscribedSaleId === sale.id;
              const timeLabel = getSaleTimeRemaining(sale.startDate);

              return (
                <div
                  key={sale.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                        {sale.type} SALE
                      </span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {timeLabel}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      {sale.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {sale.description}
                    </p>

                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
                      📅 {new Date(sale.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – {new Date(sale.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-2">
                      <span className="text-[11px] text-slate-400">Participating:</span>
                      {sale.marketplaces.map(m => (
                        <span key={m} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleSubscribeSale(sale.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                        isSubscribed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                      }`}
                    >
                      {isSubscribed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Subscribed to Alerts
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5" />
                          Notify Me When Live
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onNavigate('/phones')}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      Browse Eligible Phones
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Deals Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {(activeTab === 'today'
            ? deals.todayDeals
            : activeTab === 'drops'
            ? deals.priceDrops
            : deals.biggestDiscounts
          ).map(product => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
};
