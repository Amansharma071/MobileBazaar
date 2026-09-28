import React, { useState } from 'react';
import { Info, X, ExternalLink, ShieldCheck } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const [closed, setClosed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (closed) return null;

  return (
    <>
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs md:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-600 text-white tracking-wide uppercase">
              Demo Data Mode
            </span>
            <span className="hidden sm:inline">
              Marketplace prices are currently simulated using modular adapters for Amazon, Flipkart, Croma, and Reliance Digital.
            </span>
            <span className="sm:hidden">
              Simulated marketplace feeds active.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowDetails(true)}
              className="underline hover:text-amber-700 dark:hover:text-amber-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              API Status
            </button>
            <button
              onClick={() => setClosed(true)}
              aria-label="Dismiss banner"
              className="text-amber-700 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Data Policy & API Adapters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent pricing architecture
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              <p>
                <strong>No Illegal Scraping:</strong> MobileBazaar strictly adheres to web standards and robots.txt. We do not scrape, bypass CAPTCHA, or breach marketplace rate limits.
              </p>
              <p>
                <strong>Live Adapter Ready:</strong> In production, prices are synchronized via Amazon Product Advertising API (PA-API 5.0), Flipkart Affiliate APIs, and verified retail catalog feeds.
              </p>
              <p>
                <strong>Current Status:</strong> Environment variables for marketplace API keys are currently unset in this development sandbox, so the system is utilizing the verified demo fallback feed marked as <code>DEMO DATA</code>.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
