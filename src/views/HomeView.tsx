import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  ChevronRight, 
  Percent, 
  Zap, 
  Smartphone,
  Calendar,
  Layers,
  Award,
  Truck,
  Wrench,
  RefreshCw,
  MapPin,
  Lock
} from 'lucide-react';
import { Product, SaleEvent } from '../types/index.js';
import { api } from '../lib/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { useLocation } from '../context/LocationContext.js';
import { InteractiveDeviceFinder } from '../components/InteractiveDeviceFinder.js';
import { HomeValuationWidget } from '../components/HomeValuationWidget.js';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { location } = useLocation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [priceDrops, setPriceDrops] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ name: string; count: number; minPrice: number; logoUrl: string }[]>([]);
  const [sales, setSales] = useState<SaleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, brandsRes, salesRes] = await Promise.all([
          api.getProducts({ limit: 12, sortBy: 'featured' }),
          api.getBrands(),
          api.getSales()
        ]);

        setFeaturedProducts(prodRes.products);
        setBrands(brandsRes);
        setSales(salesRes);

        // Find biggest price drops
        const drops = [...prodRes.products]
          .sort((a, b) => (b.startingPrice - b.lowestPrice) - (a.startingPrice - a.lowestPrice))
          .slice(0, 4);
        setPriceDrops(drops);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    onNavigate(`/phones?search=${encodeURIComponent(heroSearch.trim())}`);
  };

  const activeSale = sales.find(s => s.status === 'UPCOMING' || s.status === 'LIVE');

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:py-16 bg-gradient-to-b from-slate-100/80 via-white to-transparent dark:from-slate-900 dark:via-slate-950 dark:to-transparent border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>India's Smartest Smartphone Price Engine</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Never Overpay for Your Next <span className="text-blue-600 dark:text-blue-400">Smartphone</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Compare real-time prices across Amazon India, Flipkart, Croma, and Reliance Digital. Track price drops, uncover hidden bank offers, and buy at the true lowest price.
              </p>

              {/* Big Search Bar */}
              <form onSubmit={handleHeroSubmit} className="max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={e => setHeroSearch(e.target.value)}
                    placeholder="Search model, brand or budget (e.g., iPhone 16, under 25000)..."
                    className="w-full px-3 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    Compare
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Popular comparison chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Quick Compare:</span>
                <button
                  onClick={() => onNavigate('/compare?phones=prod-apple-iphone-16,prod-samsung-galaxy-s24-ultra')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors font-semibold"
                >
                  iPhone 16 vs S24 Ultra
                </button>
                <button
                  onClick={() => onNavigate('/compare?phones=prod-oneplus-12r,prod-xiaomi-14-civi')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors font-semibold"
                >
                  OnePlus 12R vs Xiaomi 14 Civi
                </button>
              </div>
            </div>

            {/* Right Hero Showcase Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Price Match</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Save up to 18%</span>
                </div>

                {featuredProducts.slice(0, 2).map((phone, idx) => (
                  <div
                    key={phone.id}
                    onClick={() => onNavigate(`/phones/${phone.slug}`)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                      idx === 0 ? 'mb-3 bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={phone.image}
                        alt={phone.title}
                        className="w-14 h-14 object-contain rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700/60"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {phone.model}
                        </div>
                        <div className="text-xs text-slate-500">
                          {phone.brand} • Best on {phone.bestOfferMarketplace}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ₹{phone.lowestPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-400 line-through">
                        ₹{phone.startingPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => onNavigate('/deals')}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                >
                  View All Price Drops Today
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Doorstep Mobile Services Hub (City-Focused: Sell, Exchange, Repair, Refurbished) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-10 text-white shadow-2xl border border-indigo-700/40 relative overflow-hidden">
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>City-Focused Doorstep Hub • Live in Bengaluru & Agra</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Doorstep Mobile Services: Sell, Exchange, Repair or Buy Refurbished
                </h2>
                <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl">
                  Check your old phone's guaranteed value, book a 15-minute doorstep inspection, and receive safe, instant UPI transfer before handing over your phone.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('/doorstep')}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                >
                  <span>Open Doorstep Hub</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Doorstep Vertical Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              
              {/* Card 1: Sell Old Phone */}
              <div
                onClick={() => onNavigate('/sell')}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base text-white">Sell Old Phone</div>
                  <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                    Check transparent value in 60s. Technician brings cash/UPI to your door with 100% data wipe certificate.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span>Instant Value & Cash</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Exchange & Upgrade */}
              <div
                onClick={() => onNavigate('/exchange')}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base text-white">Exchange & Upgrade</div>
                  <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                    Swap your old device for an upgraded phone with an extra ₹3,500 doorstep trade-in bonus.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span>+₹3,500 Extra Bonus</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Doorstep Repair */}
              <div
                onClick={() => onNavigate('/repair')}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base text-white">Doorstep Repair</div>
                  <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                    Cracked screen or failing battery? Fixed right in front of you in 45 mins with 12 months warranty.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300 font-bold">
                  <span>At-Home in 45 Mins</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Certified Refurbished */}
              <div
                onClick={() => onNavigate('/refurbished')}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-base text-white">Certified Refurbished</div>
                  <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                    32-point tested iPhones & Galaxy with &gt;85% battery, open-box inspection, and 1-year warranty.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-purple-300 font-bold">
                  <span>Open-Box Delivery</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {/* City Hub Quick Bar */}
            <div className="pt-4 border-t border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-indigo-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Doorstep Hubs:</strong> Bengaluru (Indiranagar, Koramangala, Whitefield) & Agra (Sanjay Place, Taj Nagari, Kamla Nagar)
                </span>
              </div>

              <button
                onClick={() => onNavigate('/cities')}
                className="text-xs font-bold text-amber-300 hover:text-white underline cursor-pointer"
              >
                Check Your Pincode / View Expansion Cities
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Quick Old Phone Valuation Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeValuationWidget 
          onNavigate={onNavigate} 
          defaultCity={location?.city || 'Agra'} 
        />
      </section>

      {/* Interactive Mobile Matcher & Budget Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveDeviceFinder
          products={featuredProducts}
          onNavigate={onNavigate}
          activeCity={location?.city || 'Agra'}
        />
      </section>

      {/* Brand Carousel / Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Shop by Leading Brands
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified warranty and official merchant partner catalog
            </p>
          </div>
          <button
            onClick={() => onNavigate('/phones')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All Brands
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {brands.slice(0, 12).map(b => (
            <div
              key={b.name}
              onClick={() => onNavigate(`/phones?brand=${encodeURIComponent(b.name)}`)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 overflow-hidden p-2 group-hover:scale-105 transition-transform">
                <img
                  src={b.logoUrl}
                  alt={b.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {b.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                From ₹{(b.minPrice || 9999).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Active / Upcoming Sale Event Banner */}
      {activeSale && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 p-6 sm:p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Upcoming Mega Event</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  {activeSale.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                  {activeSale.description} Starting {new Date(activeSale.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} across major Indian portals.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/sales')}
                className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-lg transition-transform active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
              >
                Browse Festival Sale Deals
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Top Today Price Drops Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Top Price Drops Today
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Significant discounts recorded in the last 24-48 hours
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/deals')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All Deals
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {priceDrops.map(product => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Featured Smartphones Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Trending & Most Compared Smartphones
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-performing models with top user ratings and multi-seller competition
            </p>
          </div>

          <button
            onClick={() => onNavigate('/phones')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Explore All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredProducts.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Trust & Transparency Feature Blocks (Anti-Slop Craft) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              Why Indian Smartphone Shoppers Trust MOBILEBAZAAR
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We operate an ethical comparison service designed to bring total transparency to mobile shopping in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Zero Illegal Scraping
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We only ingest verified feeds, official APIs, and affiliate partner channels. We respect web standards and marketplace terms.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                True Price Drop Alerts
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Set a target budget and receive instantaneous notifications the moment any verified merchant hits your target threshold.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Objective Phone Comparison
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Directly compare processors, display refresh rates, cameras, battery wattages, and total prices without biased algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
