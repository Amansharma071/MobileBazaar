import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  Plus, 
  X, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  Trash2, 
  Cpu, 
  Battery, 
  Camera, 
  Layers,
  Award,
  Search
} from 'lucide-react';
import { Product } from '../types/index.js';
import { api } from '../lib/api.js';
import { useCompare } from '../context/CompareContext.js';

interface CompareViewProps {
  currentQueryString: string;
  onNavigate: (path: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ currentQueryString, onNavigate }) => {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allPhones, setAllPhones] = useState<Product[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // If URL has ?phones=id1,id2, sync them into compare list
  useEffect(() => {
    const params = new URLSearchParams(currentQueryString);
    const phoneIdsParam = params.get('phones');
    if (phoneIdsParam) {
      const ids = phoneIdsParam.split(',').filter(Boolean);
      api.comparePhones(ids).then(phones => {
        phones.forEach(p => addToCompare(p));
      }).catch(console.error);
    }
  }, [currentQueryString]);

  // Load catalog for search modal
  useEffect(() => {
    if (showAddModal && allPhones.length === 0) {
      setLoadingSearch(true);
      api.getProducts({ limit: 40 })
        .then(res => setAllPhones(res.products))
        .finally(() => setLoadingSearch(false));
    }
  }, [showAddModal]);

  const filteredCandidates = allPhones.filter(p => {
    const notInCompare = !compareList.some(c => c.id === p.id);
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return notInCompare && matchesSearch;
  });

  // Calculate winner recommendation if at least 2 phones
  const lowestPricePhone = compareList.length > 0 
    ? [...compareList].sort((a, b) => a.lowestPrice - b.lowestPrice)[0] 
    : null;

  const highestRatedPhone = compareList.length > 0
    ? [...compareList].sort((a, b) => b.rating - a.rating)[0]
    : null;

  const maxBatteryPhone = compareList.length > 0
    ? [...compareList].sort((a, b) => b.batteryCapacity - a.batteryCapacity)[0]
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <GitCompare className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Side-by-Side Smartphone Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare prices, processors, camera sensors, and battery performance across up to 4 models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length > 1 && (
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
              <input
                type="checkbox"
                checked={highlightDiff}
                onChange={e => setHighlightDiff(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              Highlight Differences
            </label>
          )}

          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {compareList.length === 0 ? (
        /* Empty State */
        <div className="p-12 sm:p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <GitCompare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No Smartphones Selected for Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Browse phones and click the comparison icon on any card to add models here, or select from popular phones below.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/phones')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              Explore All Phones
            </button>
            <button
              onClick={() => {
                onNavigate('/compare?phones=prod-apple-iphone-16,prod-samsung-galaxy-s24-ultra');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
            >
              Compare iPhone 16 vs Galaxy S24
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Winner Recommendation Banner */}
          {compareList.length >= 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lowestPricePhone && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider">
                      Most Budget-Friendly
                    </div>
                    <div className="font-black text-sm text-slate-900 dark:text-white">
                      {lowestPricePhone.model}
                    </div>
                    <div className="text-slate-500">
                      ₹{lowestPricePhone.lowestPrice.toLocaleString('en-IN')} on {lowestPricePhone.bestOfferMarketplace}
                    </div>
                  </div>
                </div>
              )}

              {highestRatedPhone && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] tracking-wider">
                      Highest Rated by Buyers
                    </div>
                    <div className="font-black text-sm text-slate-900 dark:text-white">
                      {highestRatedPhone.model}
                    </div>
                    <div className="text-slate-500">
                      ★ {highestRatedPhone.rating} / 5 ({highestRatedPhone.reviewCount} reviews)
                    </div>
                  </div>
                </div>
              )}

              {maxBatteryPhone && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-600 text-white font-bold">
                    <Battery className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-purple-600 dark:text-purple-400 uppercase text-[10px] tracking-wider">
                      Biggest Battery Life
                    </div>
                    <div className="font-black text-sm text-slate-900 dark:text-white">
                      {maxBatteryPhone.model}
                    </div>
                    <div className="text-slate-500">
                      {maxBatteryPhone.batteryCapacity}mAh ({maxBatteryPhone.fastChargingWatt}W Charge)
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 sm:p-6 w-48 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-850/50">
                    Smartphones ({compareList.length}/4)
                  </th>
                  {compareList.map(phone => (
                    <th key={phone.id} className="p-4 sm:p-6 text-center align-top min-w-[200px]">
                      <div className="relative flex flex-col items-center">
                        <button
                          onClick={() => removeFromCompare(phone.id)}
                          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Remove phone"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={phone.image}
                          alt={phone.title}
                          className="w-24 h-24 object-contain mb-3 cursor-pointer"
                          onClick={() => onNavigate(`/phones/${phone.slug}`)}
                        />
                        <span className="text-[11px] font-bold text-slate-400 uppercase">{phone.brand}</span>
                        <h4
                          onClick={() => onNavigate(`/phones/${phone.slug}`)}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1 cursor-pointer"
                        >
                          {phone.model}
                        </h4>
                        <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                          ₹{phone.lowestPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          on {phone.bestOfferMarketplace}
                        </div>
                        <button
                          onClick={() => onNavigate(`/phones/${phone.slug}#offers`)}
                          className="mt-3 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                        >
                          Check Deal
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}

                  {compareList.length < 4 && (
                    <th className="p-4 sm:p-6 text-center align-middle min-w-[180px]">
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-bold">Add Another Phone</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="text-xs sm:text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {/* Price & Savings */}
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <td colSpan={compareList.length + (compareList.length < 4 ? 2 : 1)} className="py-2.5 px-4 font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Pricing & Market Deals
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-500">Starting Retail Price</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                      ₹{p.startingPrice.toLocaleString('en-IN')}
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-500">Max Discount Savings</td>
                  {compareList.map(p => {
                    const save = p.startingPrice - p.lowestPrice;
                    return (
                      <td key={p.id} className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {save > 0 ? `Save ₹${save.toLocaleString('en-IN')}` : 'MRP'}
                      </td>
                    );
                  })}
                  {compareList.length < 4 && <td />}
                </tr>

                {/* Performance & Memory */}
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <td colSpan={compareList.length + (compareList.length < 4 ? 2 : 1)} className="py-2.5 px-4 font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Performance & Hardware
                  </td>
                </tr>
                <tr className={highlightDiff ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}>
                  <td className="py-3 px-4 font-semibold text-slate-500">Processor / SoC</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.processor}
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-500">RAM & Storage</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.ram} • {p.storage}
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>

                {/* Display & Screen */}
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <td colSpan={compareList.length + (compareList.length < 4 ? 2 : 1)} className="py-2.5 px-4 font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Display & Screen
                  </td>
                </tr>
                <tr className={highlightDiff ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}>
                  <td className="py-3 px-4 font-semibold text-slate-500">Screen Size</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.displaySize} inches
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-500">Panel Type & Hz</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.refreshRate}Hz {p.displayType}
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>

                {/* Cameras */}
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <td colSpan={compareList.length + (compareList.length < 4 ? 2 : 1)} className="py-2.5 px-4 font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Cameras
                  </td>
                </tr>
                <tr className={highlightDiff ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}>
                  <td className="py-3 px-4 font-semibold text-slate-500">Rear Primary Camera</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.rearCameraMP} MP
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-500">Front Selfie Camera</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.frontCameraMP} MP
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>

                {/* Battery & Charging */}
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <td colSpan={compareList.length + (compareList.length < 4 ? 2 : 1)} className="py-2.5 px-4 font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Battery & Charging
                  </td>
                </tr>
                <tr className={highlightDiff ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}>
                  <td className="py-3 px-4 font-semibold text-slate-500">Battery Capacity</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.batteryCapacity} mAh
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-500">Fast Charging Power</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.fastChargingWatt} Watts
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>

                {/* Connectivity & Weight */}
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <td colSpan={compareList.length + (compareList.length < 4 ? 2 : 1)} className="py-2.5 px-4 font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Connectivity & Weight
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-500">5G Support</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.is5G ? 'Yes (Multi-band)' : '4G LTE'}
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-500">Weight</td>
                  {compareList.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center font-semibold text-slate-900 dark:text-white">
                      {p.weightGrams}g
                    </td>
                  ))}
                  {compareList.length < 4 && <td />}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add Phone to Comparison Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Select Phone to Compare
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search smartphone model..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {loadingSearch ? (
                <div className="p-6 text-center text-xs text-slate-400">Loading catalog...</div>
              ) : filteredCandidates.length > 0 ? (
                filteredCandidates.map(phone => (
                  <div
                    key={phone.id}
                    onClick={() => {
                      addToCompare(phone);
                      setShowAddModal(false);
                    }}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={phone.image} alt={phone.title} className="w-10 h-10 object-contain" />
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{phone.model}</div>
                        <div className="text-[10px] text-slate-400">{phone.brand} • {phone.ram}</div>
                      </div>
                    </div>
                    <div className="font-black text-xs text-emerald-600">
                      ₹{phone.lowestPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No matching phones found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
