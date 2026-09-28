export type MarketplaceName =
  | 'Amazon'
  | 'Flipkart'
  | 'Croma'
  | 'Reliance Digital'
  | 'Vijay Sales'
  | 'Meesho'
  | 'Tata CLiQ';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  phone?: string;
  passwordHash?: string;
  googleId?: string;
  role: 'user' | 'admin';
  accountStatus: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  ram: string;
  storage: string;
  color: string;
  sku: string;
}

export interface Marketplace {
  id: string;
  name: MarketplaceName;
  logo: string;
  website: string;
  apiStatus: 'active' | 'rate_limited' | 'maintenance' | 'demo_mode';
  affiliateEnabled: boolean;
  color: string;
}

export interface ProductOffer {
  id: string;
  productId: string;
  marketplaceId: string;
  marketplaceName: MarketplaceName;
  variantId?: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  availability: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  offerText?: string;
  productUrl: string;
  affiliateUrl: string;
  lastUpdated: string;
  source: 'Official Feed' | 'Affiliate API' | 'Direct Catalog' | 'DEMO DATA';
  deliveryEta?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  brand: string;
  model: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  gallery: string[];
  category: 'Flagship' | 'Mid-Range' | 'Budget' | 'Gaming' | 'Foldable';
  ram: string; // e.g. "8GB" or "12GB"
  storage: string; // e.g. "128GB", "256GB"
  processor: string;
  display: string;
  displayType: 'AMOLED' | 'OLED' | 'LCD' | 'Super Retina XDR';
  refreshRate: '60Hz' | '90Hz' | '120Hz' | '144Hz' | '165Hz';
  camera: string;
  rearCameraMP: number;
  frontCamera: string;
  battery: string;
  batteryCapacity: number;
  chargingSpeed: string;
  operatingSystem: 'Android 15' | 'Android 14' | 'iOS 18' | 'iOS 17' | 'Android 13';
  is5G: boolean;
  weight: string;
  rating: number;
  reviewCount: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  startingPrice: number;
  lowestPrice: number;
  highestPrice: number;
  bestOfferMarketplace: MarketplaceName;
  pros: string[];
  cons: string[];
  featured?: boolean;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistoryPoint {
  id: string;
  productId: string;
  marketplaceId: string;
  price: number;
  recordedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  targetPrice?: number;
  product?: Product;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  createdAt: string;
  active: boolean;
  productTitle?: string;
  productImage?: string;
  productSlug?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'price_drop' | 'deal' | 'new_phone' | 'sale_reminder' | 'system';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  meta?: Record<string, any>;
}

export interface UserLocation {
  id: string;
  userId: string;
  latitude?: number;
  longitude?: number;
  city: string;
  state: string;
  country: string;
  pincode?: string;
  permissionGranted: boolean;
  updatedAt: string;
}

export interface SaleEvent {
  id: string;
  name: string;
  category: 'Summer' | 'Winter' | 'Festival' | 'Marketplace Special';
  marketplace: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'concluded';
  isDateAnnounced: boolean;
  discountHighlight: string;
  bannerImage: string;
  featuredPhoneIds: string[];
  description: string;
}

export interface SyncStatus {
  marketplace: MarketplaceName;
  lastSyncTime: string;
  status: 'healthy' | 'warning' | 'error' | 'syncing';
  recordsSynced: number;
  errorCount: number;
  rateLimitUsagePercent: number;
  sourceType: string;
}

export interface FilterState {
  search: string;
  brands: string[];
  priceRange: [number, number];
  ram: string[];
  storage: string[];
  displayType: string[];
  refreshRate: string[];
  minCameraMP: number;
  minBattery: number;
  is5G: boolean | null;
  os: string[];
  category: string[];
  sortBy:
    | 'featured'
    | 'price_asc'
    | 'price_desc'
    | 'rating'
    | 'newest'
    | 'discount'
    | 'price_drop';
}

// ==========================================
// DOORSTEP MOBILE SERVICES & EXPANSION TYPES
// ==========================================

export type DoorstepServiceCategory =
  | 'sell'
  | 'exchange'
  | 'repair'
  | 'refurbished';

export type DeviceConditionGrade = 'Flawless' | 'Good' | 'Average' | 'Heavy Damage';

export interface DeviceValuationInput {
  brand: string;
  model: string;
  variant: string;
  ram: string;
  storage: string;
  screenCondition: 'flawless' | 'minor_scratches' | 'cracked_or_lines' | 'touch_issue';
  bodyCondition: 'like_new' | 'minor_scuffs' | 'dents_or_bent';
  functionalIssues: string[]; // e.g. ['camera_fault', 'face_id_fault', 'battery_degraded', 'mic_fault']
  accessories: {
    hasBox: boolean;
    hasOriginalBill: boolean;
    hasOriginalCharger: boolean;
  };
  deviceAgeMonths: number;
}

export interface DeviceValuationResult {
  id: string;
  brand: string;
  model: string;
  variant: string;
  baseMarketPrice: number;
  finalOfferedPrice: number;
  exchangeBonusPrice: number; // Extra bonus if used for exchange
  breakdown: {
    label: string;
    amount: number;
    type: 'base' | 'deduction' | 'bonus';
  }[];
  priceLockedForDays: number;
  priceLockToken: string;
  createdAt: string;
  expiresAt: string;
}

export interface CityHubInfo {
  name: string;
  state: string;
  status: 'live' | 'launching_soon' | 'planned';
  launchDateText?: string;
  expressAvailable: boolean; // e.g. 60-90 min doorstep
  inspectionHubs: string[];
  supportedPincodes: string[];
  contactSupport: string;
}

export interface DoorstepBooking {
  id: string;
  bookingNumber: string;
  userId: string;
  serviceCategory: DoorstepServiceCategory;
  deviceTitle: string;
  serviceDetails: string;
  city: string;
  pincode: string;
  address: string;
  landmark?: string;
  customerName: string;
  customerPhone: string;
  scheduledDate: string;
  timeSlot: string;
  payoutMethod?: 'UPI_GPAY' | 'UPI_PHONEPE' | 'BANK_IMPS' | 'STORE_CREDIT_BONUS';
  payoutUpiId?: string;
  estimatedAmount: number;
  exchangeTargetProduct?: {
    id: string;
    title: string;
    image: string;
    price: number;
    netPayable: number;
  };
  status:
    | 'booking_confirmed'
    | 'technician_assigned'
    | 'out_for_inspection'
    | 'diagnostic_in_progress'
    | 'payment_transferred'
    | 'completed'
    | 'cancelled';
  technician?: {
    name: string;
    phone: string;
    photo: string;
    idBadge: string;
    rating: number;
    inspectionsCompleted: number;
  };
  trackingUpdates: {
    title: string;
    timestamp: string;
    completed: boolean;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface RefurbishedPhone {
  id: string;
  brand: string;
  model: string;
  title: string;
  slug: string;
  conditionGrade: 'Superb (Like New)' | 'Very Good' | 'Good';
  color: string;
  ram: string;
  storage: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  batteryHealthPercent: number;
  warrantyMonths: number;
  image: string;
  gallery: string[];
  keySpecs: {
    processor: string;
    display: string;
    camera: string;
    battery: string;
    os: string;
    is5G: boolean;
  };
  inspectionReport: {
    screenDisplay: 'Passed (Original OEM)' | 'Certified Grade A';
    batteryHealth: 'Passed (>85% Capacity)';
    cameras: 'Passed (Front & Rear Dual/Triple)';
    biometrics: 'Passed (FaceID / Fingerprint tested)';
    chargingPort: 'Passed (Fast charging verified)';
    networkCalling: 'Passed (5G/4G/VoLTE tested)';
    bodyCondition: string;
  };
  inStock: boolean;
  featured?: boolean;
}

export interface RepairServiceItem {
  id: string;
  phoneBrand: string;
  phoneModel: string;
  issueCategory: 'Screen Display' | 'Battery Replacement' | 'Charging Port' | 'Back Glass' | 'Camera Lens' | 'Speaker & Mic';
  partQuality: 'Original OEM Spec' | 'Premium Compatible';
  estimatedCost: number;
  marketPrice: number;
  repairTimeMinutes: number;
  warrantyMonths: number;
  doorstepAvailable: boolean;
  popular?: boolean;
}
