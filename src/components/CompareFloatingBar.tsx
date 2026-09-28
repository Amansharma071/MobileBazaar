import React from 'react';
import { GitCompare, X, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';
import { useCompare } from '../context/CompareContext.js';

interface CompareFloatingBarProps {
  onNavigate: (path: string) => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({ onNavigate }) => {
  const { compareList, removeFromCompare, clearCompare, compareToast, clearToast } = useCompare();

  // If there's a toast message, show toast notification
  return (
    <>
      {/* Toast Notification Banner */}
      {compareToast && (
        <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-slate-700/80 backdrop-blur-md pointer-events-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{compareToast}</span>
            <button
              onClick={clearToast}
              className="p-1 text-slate-400 hover:text-white ml-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Compare Tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-3.5 sm:p-4 shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
            
            {/* Left: Info */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-blue-600 text-white">
                <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Compare Phones
                </div>
                <div className="text-[11px] text-slate-400">
                  {compareList.length} of 4 selected
                </div>
              </div>
            </div>

            {/* Middle: Phone Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {compareList.map(phone => (
                <div
                  key={phone.id}
                  className="flex items-center gap-1.5 p-1.5 pr-2 rounded-2xl bg-slate-800 border border-slate-700 text-xs shrink-0"
                >
                  <img
                    src={phone.image}
                    alt={phone.model}
                    className="w-7 h-7 object-contain rounded-lg bg-white p-0.5"
                  />
                  <span className="font-bold text-[11px] max-w-[80px] sm:max-w-[100px] truncate text-slate-200">
                    {phone.model}
                  </span>
                  <button
                    onClick={() => removeFromCompare(phone.id)}
                    className="p-0.5 text-slate-400 hover:text-rose-400 transition-colors ml-0.5"
                    title="Remove phone"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={clearCompare}
                className="hidden sm:flex items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  const phoneIds = compareList.map(p => p.id).join(',');
                  onNavigate(`/compare?phones=${phoneIds}`);
                }}
                className="py-2 px-3.5 sm:px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <span>Compare</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
