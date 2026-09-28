import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Bell, 
  Trash2, 
  ExternalLink, 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.js';
import { api } from '../lib/api.js';
import { PriceAlert } from '../types/index.js';

interface WishlistViewProps {
  onNavigate: (path: string) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ onNavigate }) => {
  const { items, removeFromWishlist, setTargetPrice } = useWishlist();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [newTarget, setNewTarget] = useState<string>('');

  const loadAlerts = async () => {
    try {
      const data = await api.getPriceAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [items]);

  const handleDeleteAlert = async (alertId: string) => {
    await api.deletePriceAlert(alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleUpdateTarget = async (productId: string) => {
    const num = Number(newTarget);
    if (!num || num <= 0) return;
    await setTargetPrice(productId, num);
    setEditingAlertId(null);
    setNewTarget('');
    loadAlerts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            Your Saved Wishlist & Price Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track price movements and receive instant email/browser notifications when targets are met.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/phones')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Explore More Phones
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Active Price Alerts Card Matrix */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Active Price Drop Alerts ({alerts.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map(a => {
              const reached = a.currentPrice <= a.targetPrice;
              return (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {a.productImage && (
                      <img src={a.productImage} alt={a.productTitle} className="w-12 h-12 object-contain" />
                    )}
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {a.productTitle}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Target: <strong className="text-blue-600 dark:text-blue-400">₹{a.targetPrice.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Current best: ₹{a.currentPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {reached ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold">
                        Target Hit!
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                        Monitoring
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteAlert(a.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Delete alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Wishlist Items List */}
      {items.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Save phones you are considering to easily compare deals and monitor price fluctuations.
          </p>
          <button
            onClick={() => onNavigate('/phones')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Start Discovering Phones
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Saved Phones ({items.length})
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {items.map(({ product, targetPrice }) => (
              <div
                key={product.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(`/phones/${product.slug}`)}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-2"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">{product.brand}</span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                      {product.title}
                    </h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {product.ram} • {product.storage} • {product.processor}
                    </div>
                  </div>
                </div>

                {/* Price & Target Alert */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-left sm:text-right">
                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      ₹{product.lowestPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-slate-400">
                      Best on <strong className="text-blue-600 dark:text-blue-400">{product.bestOfferMarketplace}</strong>
                    </div>

                    {targetPrice ? (
                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                        Alert set: ₹{targetPrice.toLocaleString('en-IN')}
                      </div>
                    ) : (
                      editingAlertId === product.id ? (
                        <div className="mt-2 flex items-center gap-1">
                          <input
                            type="number"
                            placeholder="Target ₹"
                            value={newTarget}
                            onChange={e => setNewTarget(e.target.value)}
                            className="w-24 px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleUpdateTarget(product.id)}
                            className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingAlertId(product.id);
                            setNewTarget(String(Math.round((product.lowestPrice * 0.95) / 500) * 500));
                          }}
                          className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline mt-1"
                        >
                          + Set Price Alert
                        </button>
                      )
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate(`/phones/${product.slug}#offers`)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      Check Deal
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
