import React from 'react';
import { ExternalLink, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Award } from 'lucide-react';
import { ProductOffer } from '../types/index.js';

interface PriceComparisonTableProps {
  offers: ProductOffer[];
  productTitle: string;
}

export const PriceComparisonTable: React.FC<PriceComparisonTableProps> = ({ offers, productTitle }) => {
  if (!offers || offers.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        No active marketplace offers currently listed for this smartphone model.
      </div>
    );
  }

  // Sort by lowest price first
  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedOffers[0]?.price;

  const getMarketplaceLogo = (name: string) => {
    switch (name) {
      case 'Amazon':
        return {
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
          btn: 'bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-bold',
          tag: 'Prime Eligible'
        };
      case 'Flipkart':
        return {
          bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
          btn: 'bg-[#2874F0] hover:bg-[#1a5bc4] text-white font-bold',
          tag: 'Plus Assured'
        };
      case 'Croma':
        return {
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
          btn: 'bg-[#00E9BF] hover:bg-[#00c9a5] text-slate-950 font-bold',
          tag: 'Tata Retail Guarantee'
        };
      case 'Reliance Digital':
        return {
          bg: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
          btn: 'bg-[#E42529] hover:bg-[#c71e22] text-white font-bold',
          tag: 'Express Delivery'
        };
      default:
        return {
          bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
          btn: 'bg-slate-900 hover:bg-slate-800 text-white font-bold',
          tag: 'Authorized Partner'
        };
    }
  };

  return (
    <div id="offers" className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Compare Live Marketplace Prices
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold">
              {offers.length} verified sellers
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time feed pricing. Prices include taxes. Click to buy on official merchant site.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Affiliate Protected Links</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4">Marketplace</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Bank & Exchange Offer</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
            {sortedOffers.map(offer => {
              const isBestPrice = offer.price === lowestPrice;
              const mpStyle = getMarketplaceLogo(offer.marketplaceName);

              return (
                <tr
                  key={offer.id}
                  className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                    isBestPrice ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                  }`}
                >
                  {/* Marketplace Name & Badge */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${mpStyle.bg}`}
                      >
                        {offer.marketplaceName}
                      </div>
                      {isBestPrice && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                          <Award className="w-3 h-3" />
                          Best Price
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-lg font-black ${isBestPrice ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                          ₹{offer.price.toLocaleString('en-IN')}
                        </span>
                        {offer.originalPrice > offer.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{offer.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {offer.discountPercentage > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {offer.discountPercentage}% off
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Offer Description */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-tight">
                      {offer.offerText}
                    </div>
                    {offer.deliveryEta && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        ETA: {offer.deliveryEta}
                      </div>
                    )}
                  </td>

                  {/* Availability */}
                  <td className="py-4 px-4">
                    {offer.availability === 'IN_STOCK' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        In Stock
                      </span>
                    ) : offer.availability === 'LOW_STOCK' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Few Left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                        Out of Stock
                      </span>
                    )}
                  </td>

                  {/* Last Updated */}
                  <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    Updated recently
                    <div className="text-[10px] text-slate-400">
                      {offer.source}
                    </div>
                  </td>

                  {/* Buy Now Button */}
                  <td className="py-4 px-4 text-right">
                    <a
                      href={offer.affiliateUrl || offer.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs shadow-xs transition-transform active:scale-95 ${mpStyle.btn}`}
                    >
                      Buy on {offer.marketplaceName}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
        *Disclaimer: Prices, bank instant discounts, and stock availability are subject to change by respective marketplace merchants. When you purchase through links on Amazon Mobile, we may earn an affiliate commission.
      </p>
    </div>
  );
};
