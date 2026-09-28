import React from 'react';
import { Home, Search, GitCompare, Heart, User, Flame, Truck } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.js';
import { useCompare } from '../context/CompareContext.js';
import { useAuth } from '../context/AuthContext.js';

interface BottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAuthModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPath, onNavigate, onOpenAuthModal }) => {
  const { items } = useWishlist();
  const { compareList } = useCompare();
  const { user } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1 px-3 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onNavigate('/')}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-colors ${
          currentPath === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Home className="w-5 h-5" />
        Home
      </button>

      <button
        onClick={() => onNavigate('/phones')}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-colors ${
          currentPath === '/phones' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Search className="w-5 h-5" />
        Explore
      </button>

      <button
        onClick={() => onNavigate('/doorstep')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 text-[10px] font-bold transition-colors ${
          currentPath.startsWith('/doorstep') || currentPath === '/sell' || currentPath === '/exchange' || currentPath === '/repair' || currentPath === '/refurbished'
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Truck className="w-5 h-5 text-amber-500" />
        Doorstep
      </button>

      <button
        onClick={() => onNavigate('/deals')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 text-[10px] font-bold transition-colors ${
          currentPath === '/deals' ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Flame className="w-5 h-5" />
        Deals
      </button>

      <button
        onClick={() => onNavigate('/compare')}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-colors ${
          currentPath === '/compare' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <GitCompare className="w-5 h-5" />
        Compare
        {compareList.length > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
            {compareList.length}
          </span>
        )}
      </button>

      <button
        onClick={() => onNavigate('/wishlist')}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-colors ${
          currentPath === '/wishlist' ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Heart className="w-5 h-5" />
        Wishlist
        {items.length > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      <button
        onClick={() => {
          if (user) {
            onNavigate('/profile');
          } else {
            onOpenAuthModal();
          }
        }}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-colors ${
          currentPath === '/profile' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <User className="w-5 h-5" />
        {user ? 'Account' : 'Sign In'}
      </button>
    </div>
  );
};
