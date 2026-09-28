import React, { useState } from 'react';
import { MapPin, X, Check, Navigation, Trash2 } from 'lucide-react';
import { useLocation } from '../context/LocationContext.js';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_INDIAN_CITIES = [
  { city: 'Bengaluru', state: 'Karnataka (Doorstep Live)' },
  { city: 'Agra', state: 'Uttar Pradesh (Doorstep Live)' },
  { city: 'New Delhi', state: 'Delhi NCR' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Chandigarh', state: 'Punjab / Haryana' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Kochi', state: 'Kerala' }
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { location, requestBrowserLocation, setCityManually, disableLocation } = useLocation();
  const [detecting, setDetecting] = useState(false);
  const [customCity, setCustomCity] = useState('');

  if (!isOpen) return null;

  const handleDetect = async () => {
    setDetecting(true);
    const success = await requestBrowserLocation();
    setDetecting(false);
    if (success) {
      onClose();
    }
  };

  const handleSelectCity = async (city: string, state: string) => {
    await setCityManually(city, state);
    onClose();
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity.trim()) return;
    await setCityManually(customCity.trim(), 'India');
    setCustomCity('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose Delivery Location
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check stock availability and store pickup in your area
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status */}
        {location?.permissionGranted && (
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>
                Active City: <strong>{location.city}, {location.state}</strong>
              </span>
            </div>
            <button
              onClick={async () => {
                await disableLocation();
              }}
              title="Clear location"
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        )}

        {/* Auto Detect Button */}
        <button
          onClick={handleDetect}
          disabled={detecting}
          className="w-full mb-5 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
          {detecting ? 'Detecting GPS coordinates...' : 'Use My Current Location'}
        </button>

        {/* Manual City Search */}
        <form onSubmit={handleCustomSubmit} className="mb-5">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Or type city name / PIN code..."
              value={customCity}
              onChange={e => setCustomCity(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </form>

        {/* Popular Cities Grid */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Popular Cities
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {POPULAR_INDIAN_CITIES.map(c => {
              const isCurrent = location?.city === c.city;
              return (
                <button
                  key={c.city}
                  onClick={() => handleSelectCity(c.city, c.state)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500/40 text-blue-600 dark:text-blue-400 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate font-semibold">{c.city}</div>
                  <div className="text-[10px] text-slate-400 truncate">{c.state}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>We respect your privacy. Location is never shared with advertisers.</span>
        </div>
      </div>
    </div>
  );
};
