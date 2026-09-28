import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Bell, TrendingDown, ArrowDownRight, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { PriceHistoryPoint } from '../types/index.js';
import { api } from '../lib/api.js';

interface PriceHistoryChartProps {
  productId: string;
  productTitle: string;
  currentPrice: number;
  historyData: PriceHistoryPoint[];
}

type TimeRange = '30d' | '3m' | '6m' | '1y';

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  productId,
  productTitle,
  currentPrice,
  historyData
}) => {
  const [range, setRange] = useState<TimeRange>('6m');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState<string>(
    String(Math.round((currentPrice * 0.95) / 500) * 500)
  );
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Filter data points based on time range
  const filterCount = range === '30d' ? 4 : range === '3m' ? 6 : range === '6m' ? 8 : 12;
  const filteredData = (historyData && historyData.length > 0)
    ? historyData.slice(-filterCount)
    : [
        { recordedAt: '2026-03-01', price: currentPrice + 6000 },
        { recordedAt: '2026-05-01', price: currentPrice + 4000 },
        { recordedAt: '2026-07-01', price: currentPrice + 2000 },
        { recordedAt: '2026-09-01', price: currentPrice }
      ];

  const prices = filteredData.map(d => d.price);
  const highestPrice = Math.max(...prices, currentPrice);
  const lowestPrice = Math.min(...prices, currentPrice);
  const avgPrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
  const dropAmount = highestPrice - currentPrice;

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(targetPriceInput);
    if (!numPrice || numPrice <= 0) return;

    try {
      await api.createPriceAlert(productId, numPrice);
      setAlertSuccess(true);
      setTimeout(() => {
        setAlertSuccess(false);
        setShowAlertModal(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to create alert', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
      {/* Header & Range Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-500" />
            Price History & Fluctuation Tracker
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track historical pricing patterns across Indian marketplaces
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {(['30d', '3m', '6m', '1y'] as TimeRange[]).map(t => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase ${
                  range === t
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t === '30d' ? '30 Days' : t === '3m' ? '3 Months' : t === '6m' ? '6 Months' : '1 Year'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            Set Price Alert
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Current Best</div>
          <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
            ₹{currentPrice.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">All-Time Lowest</div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{lowestPrice.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Highest Price</div>
          <div className="text-lg sm:text-xl font-black text-slate-700 dark:text-slate-300">
            ₹{highestPrice.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Average Price</div>
          <div className="text-lg sm:text-xl font-black text-slate-700 dark:text-slate-300">
            ₹{avgPrice.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Price Drop Callout */}
      {dropAmount > 0 && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Good time to buy! Price is down by <strong>₹{dropAmount.toLocaleString('en-IN')}</strong> from its recent peak.
          </span>
        </div>
      )}

      {/* Recharts Area Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
            <XAxis
              dataKey="recordedAt"
              tickFormatter={(val: string) => {
                const parts = val.split('-');
                if (parts.length >= 3) {
                  return `${parts[1]}/${parts[2]}`;
                }
                return val;
              }}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tickFormatter={(val: number) => `₹${Math.round(val / 1000)}k`}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const price = payload[0].value as number;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700">
                      <div className="text-slate-400 mb-1">{label}</div>
                      <div className="font-bold text-sm text-blue-300">
                        ₹{price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Set Price Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Set Price Drop Alert
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Never overpay again
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {alertSuccess ? (
              <div className="py-6 text-center text-emerald-600 dark:text-emerald-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-10 h-10" />
                <p className="font-bold text-sm">Alert created successfully!</p>
                <p className="text-xs text-slate-500">We'll notify you as soon as the price drops.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Model
                  </label>
                  <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 font-medium">
                    {productTitle}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Current Best Price:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Notify Me When Price Drops Below (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={1000}
                      max={currentPrice}
                      value={targetPriceInput}
                      onChange={e => setTargetPriceInput(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Recommended target: ₹{Math.round((currentPrice * 0.95) / 500) * 500} (5% off)
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAlertModal(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  >
                    Set Price Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
