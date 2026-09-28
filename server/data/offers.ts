import { ProductOffer, Review, PriceHistoryPoint, MarketplaceName } from '../../src/types/index.js';
import { INITIAL_PRODUCTS } from './products.js';

export function generateOffersForProducts(): ProductOffer[] {
  const marketplaces: { name: MarketplaceName; id: string; urlPrefix: string }[] = [
    { name: 'Amazon', id: 'mp-amazon', urlPrefix: 'https://www.amazon.in/dp/' },
    { name: 'Flipkart', id: 'mp-flipkart', urlPrefix: 'https://www.flipkart.com/p/' },
    { name: 'Croma', id: 'mp-croma', urlPrefix: 'https://www.croma.com/p/' },
    { name: 'Reliance Digital', id: 'mp-reliance', urlPrefix: 'https://www.reliancedigital.in/p/' },
    { name: 'Vijay Sales', id: 'mp-vijaysales', urlPrefix: 'https://www.vijaysales.com/p/' },
  ];

  const offers: ProductOffer[] = [];

  INITIAL_PRODUCTS.forEach((p, idx) => {
    // Generate 3 to 5 offers per phone
    const numOffers = 3 + (idx % 3);
    const shuffledMps = [...marketplaces].sort(() => 0.5 - ((idx * 7) % 10) / 10).slice(0, numOffers);

    shuffledMps.forEach((mp, mIdx) => {
      // Vary price realistically around startingPrice
      const varianceFactor = 1 - (0.02 * (mIdx + 1)) - (0.01 * (idx % 4));
      const calculatedPrice = Math.round((p.startingPrice * varianceFactor) / 50) * 50;
      const originalPrice = Math.round((p.startingPrice * 1.15) / 100) * 100;
      const discount = Math.round(((originalPrice - calculatedPrice) / originalPrice) * 100);

      const minutesAgo = (mIdx * 7 + (idx % 12) * 3) + 2;
      const updatedTime = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();

      offers.push({
        id: `offer-${p.id}-${mp.id}`,
        productId: p.id,
        marketplaceId: mp.id,
        marketplaceName: mp.name,
        price: calculatedPrice,
        originalPrice: originalPrice,
        discountPercentage: discount,
        availability: mIdx === 3 ? 'LOW_STOCK' : 'IN_STOCK',
        offerText: mIdx === 0 
          ? 'Flat ₹2,000 Instant Bank Discount on HDFC/ICICI Cards + No Cost EMI' 
          : mIdx === 1 
          ? 'Extra ₹1,500 Off with SuperCoins + Free 6-Month Screen Damage Protection'
          : 'Free Store Pickup in 3 Hours + ₹1,000 Exchange Bonus',
        productUrl: `${mp.urlPrefix}${p.slug}`,
        affiliateUrl: `${mp.urlPrefix}${p.slug}?tag=amazonmobile-21&subid=pricecomp`,
        lastUpdated: updatedTime,
        source: 'DEMO DATA',
        deliveryEta: mIdx % 2 === 0 ? 'Tomorrow, by 11 AM' : '2-3 Business Days'
      });
    });
  });

  return offers;
}

export function generatePriceHistoryForProduct(productId: string, currentPrice: number): PriceHistoryPoint[] {
  const points: PriceHistoryPoint[] = [];
  const now = new Date('2026-09-12T10:00:00Z');

  // Generate 12 historical monthly/weekly data points over 1 year
  const intervals = [360, 300, 240, 180, 120, 90, 60, 45, 30, 20, 10, 0];

  intervals.reverse().forEach((daysAgo, i) => {
    const recordedDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    // Price trend generally starts higher and drops
    const decayMultiplier = 1 + (daysAgo / 360) * 0.18 + Math.sin(i * 1.2) * 0.03;
    const histPrice = Math.round((currentPrice * decayMultiplier) / 100) * 100;

    points.push({
      id: `ph-${productId}-${daysAgo}`,
      productId,
      marketplaceId: 'mp-amazon',
      price: daysAgo === 0 ? currentPrice : histPrice,
      recordedAt: recordedDate.toISOString().split('T')[0]
    });
  });

  return points;
}

export function generateReviewsForProduct(productId: string, title: string): Review[] {
  return [
    {
      id: `rev-1-${productId}`,
      productId,
      userId: 'user-sample-1',
      userName: 'Aarav Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      title: 'Remarkable upgrade from my previous phone!',
      comment: `The build quality and ergonomics of the ${title} are exceptional. Battery easily lasts 1.5 days on heavy 5G usage. Highly recommend buying at this price point.`,
      verifiedPurchase: true,
      createdAt: '2026-08-14T09:20:00Z'
    },
    {
      id: `rev-2-${productId}`,
      productId,
      userId: 'user-sample-2',
      userName: 'Priya Iyer',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      title: 'Camera quality and outdoor brightness blew me away',
      comment: `Portraits in sunlight look studio-grade with authentic skin tones. The 120Hz display is silky smooth and legible even under harsh midday Indian summer sun.`,
      verifiedPurchase: true,
      createdAt: '2026-08-28T14:45:00Z'
    },
    {
      id: `rev-3-${productId}`,
      productId,
      userId: 'user-sample-3',
      userName: 'Vikram Malhotra',
      userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      rating: 4,
      title: 'Fast performance, just wish fast charger was bundled',
      comment: `Gaming and app switching are rock solid with zero heating throttles. Docked 1 star because in 2026 high-end manufacturers should really bundle the power brick.`,
      verifiedPurchase: true,
      createdAt: '2026-09-02T18:10:00Z'
    }
  ];
}
