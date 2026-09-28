import React from 'react';
import { Heart, GitCompare, ExternalLink, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Product } from '../types/index.js';
import { StarRating } from './StarRating.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useCompare } from '../context/CompareContext.js';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, compact = false }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const savings = Math.max(0, product.startingPrice - product.lowestPrice);
  const discountPercent = product.startingPrice > 0 
    ? Math.round((savings / product.startingPrice) * 100) 
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Top Badges & Action Buttons */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.category === 'Flagship' && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm pointer-events-auto">
              Flagship
            </span>
          )}
          {discountPercent >= 10 && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-0.5 pointer-events-auto">
              <Tag className="w-2.5 h-2.5" />
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Compare Checkbox / Toggle */}
          <button
            onClick={e => {
              e.stopPropagation();
              addToCompare(product);
            }}
            title={isCompared ? 'Remove from comparison' : 'Compare up to 4 phones'}
            aria-label="Compare phone"
            className={`p-2 rounded-xl transition-all shadow-xs ${
              isCompared
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <GitCompare className="w-4 h-4" />
          </button>

          {/* Wishlist Toggle */}
          <button
            onClick={e => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            title={isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
            aria-label="Toggle wishlist"
            className={`p-2 rounded-xl transition-all shadow-xs ${
              isFavorited
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image Stage */}
      <div
        onClick={() => onNavigate(`/phones/${product.slug}`)}
        className="relative pt-12 pb-6 px-6 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800/60"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-44 sm:h-52 w-auto object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
        />
        {product.is5G && (
          <div className="absolute bottom-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            5G READY
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Key Specs */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <span>{product.brand}</span>
            <span>{product.ram} • {product.storage}</span>
          </div>

          {/* Model Title */}
          <h3
            onClick={() => onNavigate(`/phones/${product.slug}`)}
            className="font-bold text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.model}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
            {product.processor} • {product.rearCameraMP}MP Camera
          </p>

          {/* Star Rating */}
          <div className="mb-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          </div>

          {/* Marketplace Badges */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Available on:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Amazon</span>
            <span>•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Flipkart</span>
            <span>•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Croma</span>
          </div>
        </div>

        {/* Pricing & Deals Box */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Best Price
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ₹{product.lowestPrice.toLocaleString('en-IN')}
              </div>
            </div>

            {savings > 0 && (
              <div className="text-right">
                <div className="text-xs text-slate-400 line-through">
                  ₹{product.startingPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Save ₹{savings.toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
            <span>
              Best deal on <strong className="text-blue-600 dark:text-blue-400">{product.bestOfferMarketplace}</strong>
            </span>
            <span className="text-[10px] text-slate-400">Verified feed</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate(`/phones/${product.slug}`)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate(`/phones/${product.slug}#offers`)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              Check Deal
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
