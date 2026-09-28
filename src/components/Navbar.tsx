import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Search, 
  Heart, 
  GitCompare, 
  Bell, 
  MapPin, 
  User, 
  Sun, 
  Moon, 
  Laptop, 
  X, 
  ChevronDown, 
  Check, 
  Sparkles, 
  LogOut, 
  Shield, 
  SlidersHorizontal,
  Flame,
  Calendar,
  Truck,
  Wrench,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useCompare } from '../context/CompareContext.js';
import { useNotifications } from '../context/NotificationContext.js';
import { useLocation } from '../context/LocationContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { api } from '../lib/api.js';
import { Product } from '../types/index.js';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenLocationModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenLocationModal,
  onOpenAuthModal
}) => {
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { compareList } = useCompare();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { location } = useLocation();
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Popover menus
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Debounce search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.getProducts({ search: searchQuery, limit: 5 });
        setSuggestions(res.products);
      } catch (err) {
        console.error(err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search dismiss
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    onNavigate(`/phones?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Top Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo - Compact, Strong & Interactive */}
          <div
            onClick={() => onNavigate('/')}
            title="MOBILEBAZAAR - Return to Homepage"
            className="flex items-center gap-2 sm:gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 cursor-pointer shrink-0 group select-none transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
          >
            {/* High-Impact Monogram Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-sm shadow-amber-500/20 group-hover:shadow-md group-hover:shadow-amber-500/30 transition-all shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-black text-xs sm:text-sm tracking-tighter">
                <span className="text-white">M</span>
                <span className="text-amber-400">B</span>
              </div>
            </div>

            {/* Compact, Strong Wordmark with Reduced Length */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  MOBILE<span className="text-amber-500 font-black">BAZAAR</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" title="Live Hubs & Price Sync Active" />
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-tight text-slate-400 leading-tight mt-0.5">
                <span className="text-blue-600 dark:text-blue-400">Compare</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400">Doorstep</span>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400">Save</span>
              </div>
            </div>
          </div>

          {/* Delivery Location Quick Selector */}
          <button
            onClick={onOpenLocationModal}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="text-xs">
              <div className="text-[10px] text-slate-400 font-medium">Deliver to</div>
              <div className="font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
                {location?.city || 'Select City'}
              </div>
            </div>
          </button>

          {/* Main Global Search Box */}
          <div ref={searchRef} className="flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search phones (e.g. iPhone 16, Samsung S24, 5G under 25000)..."
                className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:bg-white dark:focus:bg-slate-850 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Instant Auto-complete Dropdown */}
            {showSuggestions && (suggestions.length > 0 || searchQuery.length >= 2) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Phone Matches</span>
                  <span>Direct Compare</span>
                </div>
                {suggestions.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {suggestions.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery('');
                          onNavigate(`/phones/${item.slug}`);
                        }}
                        className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-100 dark:bg-slate-800 p-1"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {item.brand} • {item.ram} • {item.storage}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                            ₹{item.lowestPrice.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            on {item.bestOfferMarketplace}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Press Enter to search all smartphones matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Compare Bar Button */}
            <button
              onClick={() => onNavigate('/compare')}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Compare Phones"
              aria-label="Compare phones"
            >
              <GitCompare className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('/wishlist')}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Saved Wishlist"
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.actionUrl) {
                              setShowNotifications(false);
                              onNavigate(n.actionUrl);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="font-bold text-xs text-slate-900 dark:text-white">
                              {n.title}
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications at this time.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${resolvedTheme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {resolvedTheme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden md:inline font-semibold text-xs text-slate-900 dark:text-white max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 p-1.5 text-xs">
                    <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {user.email}
                      </div>
                      {user.role === 'admin' && (
                        <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] font-black uppercase">
                          <Shield className="w-2.5 h-2.5" /> Admin Access
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('/profile');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Manage Profile & Alerts
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('/track-doorstep');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <Truck className="w-4 h-4 text-blue-500" />
                      Doorstep Bookings
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('/admin');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      Admin & Sync Dashboard
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Sub-Header Categories & Links */}
      <div className="bg-slate-50/80 dark:bg-slate-950/50 border-t border-slate-200/60 dark:border-slate-800/60 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('/doorstep')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-bold ${
              currentPath.startsWith('/doorstep') || currentPath === '/sell' || currentPath === '/exchange' || currentPath === '/repair' || currentPath === '/refurbished'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200/60 dark:border-blue-800/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            <span>Doorstep Services</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
              Sell • Repair • Refurbished
            </span>
          </button>

          <button
            onClick={() => onNavigate('/sell')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer font-bold ${
              currentPath === '/sell'
                ? 'bg-amber-500 text-slate-950'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            ⚡ Instant Sell Phone
          </button>

          <button
            onClick={() => onNavigate('/refurbished')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentPath === '/refurbished'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            Refurbished Store
          </button>

          <button
            onClick={() => onNavigate('/cities')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentPath === '/cities'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            📍 Agra & Bengaluru Hubs
          </button>

          <button
            onClick={() => onNavigate('/phones')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentPath === '/phones'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            All Smartphones
          </button>

          <button
            onClick={() => onNavigate('/deals')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              currentPath === '/deals'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            Deals & Price Drops
          </button>

          <button
            onClick={() => onNavigate('/compare')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              currentPath === '/compare'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare Phones
          </button>

          <button
            onClick={() => onNavigate('/sales')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              currentPath === '/sales'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Festival Sales 2026
          </button>

          <button
            onClick={() => onNavigate('/phones?category=Flagship')}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Flagship Phones
          </button>

          <button
            onClick={() => onNavigate('/phones?category=Gaming')}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Gaming Phones
          </button>

          <button
            onClick={() => onNavigate('/phones?maxPrice=25000')}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Under ₹25,000
          </button>

          <button
            onClick={() => onNavigate('/phones?maxPrice=15000')}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Under ₹15,000
          </button>
        </div>
      </div>
    </header>
  );
};
