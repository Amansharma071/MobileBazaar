import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  GitCompare, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  Cpu, 
  Battery, 
  Camera, 
  Layers, 
  Smartphone, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Star,
  MessageSquarePlus,
  ArrowLeft
} from 'lucide-react';
import { Product, ProductOffer, ProductVariant, Review, PriceHistoryPoint } from '../types/index.js';
import { api } from '../lib/api.js';
import { StarRating } from '../components/StarRating.js';
import { PriceComparisonTable } from '../components/PriceComparisonTable.js';
import { PriceHistoryChart } from '../components/PriceHistoryChart.js';
import { ProductCard } from '../components/ProductCard.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useCompare } from '../context/CompareContext.js';

interface ProductDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ slug, onNavigate }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  const [product, setProduct] = useState<(Product & {
    offers: ProductOffer[];
    variants: ProductVariant[];
    reviews: Review[];
    priceHistory: PriceHistoryPoint[];
    frequentlyCompared: Product[];
    similarPhones: Product[];
  }) | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await api.getProductBySlug(slug);
        setProduct(data);
        if (data) setSelectedImage(data.image);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading verified marketplace data...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Smartphone Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested phone model could not be found or has been delisted.</p>
        <button
          onClick={() => onNavigate('/phones')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Back to Phones Catalog
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const savings = Math.max(0, product.startingPrice - product.lowestPrice);
  const discountPercent = product.startingPrice > 0 
    ? Math.round((savings / product.startingPrice) * 100) 
    : 0;

  // Best offer
  const lowestOffer = product.offers.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), product.offers[0]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.title} Best Price on MobileBazaar`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const added = await api.addReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        userName: reviewAuthor.trim() || 'Verified Tech Buyer'
      });

      setProduct(prev => prev ? {
        ...prev,
        reviews: [added, ...prev.reviews],
        reviewCount: prev.reviewCount + 1
      } : null);

      setShowReviewForm(false);
      setReviewTitle('');
      setReviewComment('');
      setReviewAuthor('');
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <button onClick={() => onNavigate('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('/phones')} className="hover:text-blue-600">Smartphones</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate(`/phones?brand=${encodeURIComponent(product.brand)}`)} className="hover:text-blue-600">
          {product.brand}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">{product.model}</span>
      </div>

      {/* Main Product Showcase Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-xs">
            <img
              src={selectedImage || product.image}
              alt={product.title}
              className="max-h-80 sm:max-h-96 w-auto object-contain drop-shadow-xl transition-all duration-300"
            />
            {product.is5G && (
              <span className="absolute top-4 left-4 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                5G Dual VoLTE
              </span>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                title="Share deal"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                title={isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
                className={`p-2.5 rounded-xl transition-colors ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
            {copiedLink && (
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-lg">
                Link copied to clipboard!
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedImage(product.image)}
              className={`w-16 h-16 rounded-xl p-1 bg-white dark:bg-slate-900 border-2 transition-all flex items-center justify-center shrink-0 ${
                selectedImage === product.image ? 'border-blue-600 shadow-md' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
            </button>
          </div>
        </div>

        {/* Right Info & Pricing Highlights */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>{product.brand}</span>
              <span>•</span>
              <span>Released {new Date(product.releaseDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{product.category} Series</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Ratings Bar */}
            <div className="mt-3 flex items-center gap-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
              <button
                onClick={() => addToCompare(product)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  isCompared
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                {isCompared ? 'In Compare List' : 'Add to Compare'}
              </button>
            </div>
          </div>

          {/* Pricing Highlight Hero Card */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Lowest Marketplace Price
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  ₹{product.lowestPrice.toLocaleString('en-IN')}
                </div>
              </div>

              {savings > 0 && (
                <div className="text-right">
                  <div className="text-sm text-slate-400 line-through">
                    ₹{product.startingPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Save ₹{savings.toLocaleString('en-IN')} ({discountPercent}% OFF)
                  </div>
                </div>
              )}
            </div>

            {lowestOffer && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Best verified deal currently on <strong>{lowestOffer.marketplaceName}</strong> with free delivery.
                  </span>
                </div>
                <a
                  href={lowestOffer.affiliateUrl || lowestOffer.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                >
                  Buy Now
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Marketplace quick jump */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Compare {product.offers.length} sellers below</span>
              <a href="#offers" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                View All Marketplace Offers ↓
              </a>
            </div>
          </div>

          {/* Quick Specifications Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span>Processor</span>
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                {product.processor}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>Display</span>
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                {product.displaySize}" {product.refreshRate}Hz {product.displayType}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Camera className="w-4 h-4 text-rose-500" />
                <span>Rear Camera</span>
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                {product.rearCameraMP}MP Main + OIS
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Battery className="w-4 h-4 text-emerald-500" />
                <span>Battery</span>
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                {product.batteryCapacity}mAh ({product.fastChargingWatt}W)
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Official 1-Year Brand Warranty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-blue-500" />
              <span>7-Day Replacement Policy</span>
            </div>
          </div>
        </div>

      </div>

      {/* 1. Price Comparison Across Marketplaces Table */}
      <section className="pt-6">
        <PriceComparisonTable offers={product.offers} productTitle={product.title} />
      </section>

      {/* 2. Interactive Price History Tracker */}
      <section className="pt-6">
        <PriceHistoryChart
          productId={product.id}
          productTitle={product.title}
          currentPrice={product.lowestPrice}
          historyData={product.priceHistory}
        />
      </section>

      {/* 3. Detailed Specifications Accordion / Tables */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
            Complete Technical Specifications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hardware architecture, optics, cellular bands, and dimensions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-1 border-b border-slate-200 dark:border-slate-800">
              Display & Body
            </h4>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Screen Size</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.displaySize} inches</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Display Technology</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.displayType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Refresh Rate</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.refreshRate} Hz Dynamic</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Weight</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.weightGrams} grams</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-1 border-b border-slate-200 dark:border-slate-800">
              Performance & Cameras
            </h4>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Chipset / Processor</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.processor}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Memory & Storage</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.ram} RAM • {product.storage} Storage</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Rear Camera</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.rearCameraMP} MP with 4K Video</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Front Camera</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.frontCameraMP} MP HDR Selfie</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Battery & Charging</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.batteryCapacity} mAh ({product.fastChargingWatt}W Fast Charge)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Operating System</span>
              <span className="font-semibold text-slate-900 dark:text-white">{product.os}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verified User Reviews & Rating Distribution */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Customer Ratings & Reviews
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified customer opinions and unvarnished feedback
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            {showReviewForm ? 'Close Form' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form Drawer */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Share Your Experience with {product.title}
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Rating
              </label>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                  {reviewRating} out of 5 stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent display and stellar battery life"
                  value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rohit K."
                  value={reviewAuthor}
                  onChange={e => setReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Review
              </label>
              <textarea
                required
                rows={3}
                placeholder="Write about battery backup, camera performance, gaming experience, and thermals..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
            >
              {reviewSubmitting ? 'Posting...' : 'Submit Verified Review'}
            </button>
          </form>
        )}

        {/* Rating Breakdown & Reviews List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="lg"
              distribution={{
                5: 82,
                4: 12,
                3: 4,
                2: 1,
                1: 1
              }}
            />
          </div>

          <div className="lg:col-span-8 space-y-4">
            {product.reviews.map(r => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {r.userAvatar ? (
                      <img src={r.userAvatar} alt={r.userName} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {r.userName.charAt(0)}
                      </div>
                    )}
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{r.userName}</span>
                    {r.verifiedPurchase && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{r.title}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Frequently Compared Phones */}
      {product.frequentlyCompared && product.frequentlyCompared.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Frequently Compared With
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alternative models in the same price tier
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {product.frequentlyCompared.map(comp => (
              <div
                key={comp.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={comp.image} alt={comp.title} className="w-14 h-14 object-contain" />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{comp.model}</div>
                    <div className="text-xs font-black text-emerald-600">₹{comp.lowestPrice.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate(`/compare?phones=${product.id},${comp.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition-colors"
                >
                  Compare
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Similar Phones Recommendations */}
      {product.similarPhones && product.similarPhones.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Similar Smartphones You Might Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.similarPhones.map(sim => (
              <ProductCard key={sim.id} product={sim} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
