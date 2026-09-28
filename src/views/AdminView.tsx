import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Database, 
  TrendingUp, 
  Users, 
  Smartphone, 
  Bell, 
  Sparkles,
  Play
} from 'lucide-react';
import { api } from '../lib/api.js';

export const AdminView: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      const data = await api.getSyncStatus();
      setSyncStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleTriggerSync = async (marketplaceId: string) => {
    setSyncingId(marketplaceId);
    try {
      await api.triggerSync(marketplaceId);
      setSuccessMessage(`Sync completed successfully for ${marketplaceId.toUpperCase()}`);
      await loadStatus();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Server className="w-3.5 h-3.5" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Marketplace Ingestion & Sync Health
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor API endpoints, feed statuses, affiliate rates, and pricing synchronization schedules.
          </p>
        </div>

        <button
          onClick={loadStatus}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Stats
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Strict Data Policy Compliance Box (Section 2, 47) */}
      <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4">
        <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-amber-900 dark:text-amber-300">
            Strict Ethical Data Policy & Anti-Scraping Guarantee
          </h3>
          <p className="text-xs text-amber-800/90 dark:text-amber-400/90 leading-relaxed">
            MobileBazaar does NOT perform scraping or automated HTML harvesting against Amazon, Flipkart, Meesho, or any partner portal. In production, price data is ingested exclusively via official Product Advertising APIs (PA-API 5.0), affiliate data feeds, and direct retailer partner integrations. When external credentials are not set, realistic demo simulation feeds run to ensure full offline-safe functionality.
          </p>
        </div>
      </div>

      {/* System Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Smartphone className="w-4 h-4 text-blue-500" />
            <span>Catalog Phones</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">16 Models</div>
          <div className="text-[10px] text-emerald-500 font-semibold mt-1">100% with multi-seller offers</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Database className="w-4 h-4 text-purple-500" />
            <span>Active Price Quotes</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">64 Live Quotes</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1">Across 4 major retailers</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Price Drop Alerts</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Active Monitors</div>
          <div className="text-[10px] text-emerald-500 font-semibold mt-1">Hourly background poll</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Average Saving</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">₹3,450</div>
          <div className="text-[10px] text-emerald-500 font-semibold mt-1">Max price spread per phone</div>
        </div>
      </div>

      {/* Marketplaces Sync Health Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Retailer Feed Adapters & Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syncStatus.map(m => {
            const isSyncing = syncingId === m.marketplace;
            return (
              <div
                key={m.marketplace}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {m.name}
                    </h4>
                    <div className="text-xs text-slate-400">
                      Adapter: {m.marketplace.toUpperCase()}_ADAPTER
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    m.mode === 'DEMO'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  }`}>
                    {m.mode} MODE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Status:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {m.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Last Sync:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {new Date(m.lastSync).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-400">
                    Sync interval: Every 30 mins
                  </div>

                  <button
                    onClick={() => handleTriggerSync(m.marketplace)}
                    disabled={isSyncing}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing Feeds...' : 'Trigger Sync Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
