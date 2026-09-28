import React, { useState } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  Bell, 
  Mail, 
  Phone, 
  ShieldCheck, 
  LogOut, 
  Save, 
  CheckCircle2, 
  Edit3,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLocation } from '../context/LocationContext.js';

interface ProfileViewProps {
  onOpenAuthModal: () => void;
  onOpenLocationModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenAuthModal, onOpenLocationModal }) => {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const { location, disableLocation } = useLocation();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [saleAlerts, setSaleAlerts] = useState(true);
  const [browserPush, setBrowserPush] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Account Login Required
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Sign in with Google or your email to access saved price drop alerts, personalized regional offers, and account settings.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          Sign In or Create Account
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            User Account & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal profile, regional delivery city, and notifications.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes and notification settings updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: User Card */}
        <div className="md:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="relative inline-block">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-blue-600" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center text-2xl font-black">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" title="Active" />
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              {user.role} Member
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Google Verified Identity</span>
            </div>
          </div>
        </div>

        {/* Right: Preferences & Edit Form */}
        <div className="md:col-span-8 space-y-6">
          {/* Profile Details Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              Personal Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Regional Location Setting */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Delivery Location & Regional Offers
              </h3>
              <button
                onClick={onOpenLocationModal}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Change City
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {location ? `${location.city}, ${location.state} (${location.pincode})` : 'All India (Default)'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {location?.isSameDayAvailable
                    ? '⚡ Same-Day Delivery available in your pin code via Reliance Digital & Croma'
                    : 'Standard 2-3 day shipping across all verified sellers'}
                </div>
              </div>

              {location && (
                <button
                  onClick={disableLocation}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              Notification Settings
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Price Drop Notifications
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Receive email alerts immediately when wishlisted phones drop below your target price.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={priceDropAlerts}
                  onChange={e => setPriceDropAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Festival Sale Announcements
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Early-bird reminders for Great Indian Festival, Big Billion Days, and holiday sales.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={saleAlerts}
                  onChange={e => setSaleAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Browser Instant Push
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Show desktop notification toast on flash sales and lightning deals.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={browserPush}
                  onChange={e => setBrowserPush(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Doorstep Appointments & Trade-in Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-700/40 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Doorstep Mobile Services</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Bengaluru Hub
              </span>
            </div>

            <p className="text-xs text-indigo-200 leading-relaxed">
              Track your device inspection appointments, view active trade-in valuations, check assigned technician details, and download digital data wipe certificates.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="/doorstep"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/doorstep');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Check Phone Value / Sell</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="/track-doorstep"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/track-doorstep');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Track My Doorstep Bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
