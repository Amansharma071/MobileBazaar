import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  showNumber = true,
  reviewCount,
  distribution
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base font-bold' : 'text-sm font-semibold';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: maxStars }).map((_, i) => {
            const filled = i + 1 <= Math.floor(rating);
            const half = !filled && i < rating;
            return (
              <Star
                key={i}
                className={`${iconSize} ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : half
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            );
          })}
        </div>

        {showNumber && (
          <span className={`${textSize} text-slate-900 dark:text-slate-100`}>
            {rating.toFixed(1)}
            <span className="text-slate-400 font-normal text-xs">/5</span>
          </span>
        )}

        {reviewCount !== undefined && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            ({reviewCount.toLocaleString('en-IN')} reviews)
          </span>
        )}
      </div>

      {distribution && (
        <div className="mt-2 space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Verified Customer Ratings Breakdown
          </div>
          {[5, 4, 3, 2, 1].map(starNum => {
            const pct = distribution[starNum as 5 | 4 | 3 | 2 | 1] || 0;
            return (
              <div key={starNum} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-6 font-medium flex items-center gap-0.5">
                  {starNum} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-slate-500 dark:text-slate-400 text-[11px]">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
