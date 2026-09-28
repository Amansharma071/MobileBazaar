import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  Search, 
  Check, 
  ChevronDown, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Product } from '../types/index.js';
import { api } from '../lib/api.js';
import { ProductCard } from '../components/ProductCard.js';

interface CatalogViewProps {
  currentQueryString: string;
  onNavigate: (path: string) => void;
}

const PRICE_PRESETS = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: 'Under ₹15,000', min: 0, max: 15000 },
  { label: '₹15,000 - ₹25,000', min: 15000, max: 25000 },
  { label: '₹25,000 - ₹40,000', min: 25000, max: 40000 },
  { label: '₹40,000 - ₹60,000', min: 40000, max: 60000 },
  { label: 'Above ₹60,000', min: 60000, max: undefined },
];

const RAM_OPTIONS = ['6 GB', '8 GB', '12 GB', '16 GB'];
const STORAGE_OPTIONS = ['128 GB', '256 GB', '512 GB', '1 TB'];
const CATEGORY_OPTIONS = ['All', 'Flagship', 'Mid-Range', 'Budget', 'Gaming'];

export const CatalogView: React.FC<CatalogViewProps> = ({ currentQueryString, onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableBrands, setAvailableBrands] = useState<{ name: string; count: number }[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse URL query params
  const queryParams = useMemo(() => {
    return new URLSearchParams(currentQueryString);
  }, [currentQueryString]);

  const [search, setSearch] = useState(queryParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(queryParams.get('brand') || '');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || '');
  const [selectedPricePreset, setSelectedPricePreset] = useState<number>(() => {
    const max = queryParams.get('maxPrice');
    if (max === '15000') return 1;
    if (max === '25000') return 2;
    if (max === '40000') return 3;
    if (max === '60000') return 4;
    return 0;
  });
  const [only5G, setOnly5G] = useState<boolean>(queryParams.get('is5G') === 'true');
  const [selectedRam, setSelectedRam] = useState(queryParams.get('ram') || '');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || 'featured');

  // Load brands list on mount
  useEffect(() => {
    api.getBrands().then(setAvailableBrands).catch(console.error);
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const preset = PRICE_PRESETS[selectedPricePreset];
        const res = await api.getProducts({
          search: search || undefined,
          brand: selectedBrand || undefined,
          category: selectedCategory && selectedCategory !== 'All' ? selectedCategory : undefined,
          minPrice: preset?.min,
          maxPrice: preset?.max,
          is5G: only5G ? true : undefined,
          sortBy
        });

        let filtered = res.products;
        if (selectedRam) {
          filtered = filtered.filter(p => p.ram.toLowerCase().includes(selectedRam.toLowerCase()));
        }

        setProducts(filtered);
        setTotal(filtered.length);
      } catch (err) {
        console.error('Failed to fetch catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [search, selectedBrand, selectedCategory, selectedPricePreset, only5G, selectedRam, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedPricePreset(0);
    setOnly5G(false);
    setSelectedRam('');
    setSortBy('featured');
    onNavigate('/phones');
  };

  const activeFiltersCount = 
    (search ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (selectedCategory && selectedCategory !== 'All' ? 1 : 0) +
    (selectedPricePreset !== 0 ? 1 : 0) +
    (only5G ? 1 : 0) +
    (selectedRam ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Smartphone Discovery & Price Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare specs and live deals across verified Indian marketplaces
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured / Best Deals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Releases</option>
              <option value="discount">Biggest Discount (%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Active Filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              Search: "{search}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch('')} />
            </span>
          )}
          {selectedBrand && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              Brand: {selectedBrand}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('')} />
            </span>
          )}
          {selectedCategory && selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
            </span>
          )}
          {selectedPricePreset !== 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              Price: {PRICE_PRESETS[selectedPricePreset].label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedPricePreset(0)} />
            </span>
          )}
          {only5G && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              5G Only
              <X className="w-3 h-3 cursor-pointer" onClick={() => setOnly5G(false)} />
            </span>
          )}
          {selectedRam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              RAM: {selectedRam}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedRam('')} />
            </span>
          )}
          <button
            onClick={resetFilters}
            className="ml-auto text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filter Catalog
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear all
              </button>
            )}
          </div>

          {/* 5G Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">5G Smartphones Only</span>
            <input
              type="checkbox"
              checked={only5G}
              onChange={e => setOnly5G(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Price Range
            </h4>
            <div className="space-y-1.5 text-xs">
              {PRICE_PRESETS.map((p, idx) => (
                <label
                  key={p.label}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                    selectedPricePreset === idx
                      ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{p.label}</span>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPricePreset === idx}
                    onChange={() => setSelectedPricePreset(idx)}
                    className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Brand
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 text-xs">
              <button
                onClick={() => setSelectedBrand('')}
                className={`w-full text-left p-2 rounded-xl transition-colors cursor-pointer ${
                  selectedBrand === ''
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                All Brands
              </button>
              {availableBrands.map(b => (
                <button
                  key={b.name}
                  onClick={() => setSelectedBrand(selectedBrand === b.name ? '' : b.name)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                    selectedBrand === b.name
                      ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({b.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Category
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                  className={`p-2 rounded-xl text-center transition-colors cursor-pointer font-semibold ${
                    (cat === 'All' && !selectedCategory) || selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* RAM Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              RAM Capacity
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {RAM_OPTIONS.map(ram => (
                <button
                  key={ram}
                  onClick={() => setSelectedRam(selectedRam === ram ? '' : ram)}
                  className={`p-2 rounded-xl text-center transition-colors cursor-pointer font-semibold ${
                    selectedRam === ram
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {ram}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Filter Smartphones
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Filters Body */}
            <div className="space-y-6 flex-1 text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200">5G Only</span>
                <input
                  type="checkbox"
                  checked={only5G}
                  onChange={e => setOnly5G(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600"
                />
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase text-xs mb-2">Price Presets</h4>
                <div className="space-y-2">
                  {PRICE_PRESETS.map((p, idx) => (
                    <label key={p.label} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span>{p.label}</span>
                      <input
                        type="radio"
                        checked={selectedPricePreset === idx}
                        onChange={() => setSelectedPricePreset(idx)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase text-xs mb-2">Brands</h4>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableBrands.map(b => (
                    <button
                      key={b.name}
                      onClick={() => setSelectedBrand(selectedBrand === b.name ? '' : b.name)}
                      className={`p-2.5 rounded-xl text-left border ${
                        selectedBrand === b.name ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {b.name} ({b.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 mt-6">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Show {total} Results
              </button>
            </div>
          </div>
        )}

        {/* Product Cards Grid Area */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Showing <strong>{products.length}</strong> smartphones
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Smartphones Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No phones match your active filters. Try clearing some filters or searching for another model.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
