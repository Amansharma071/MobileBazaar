import { 
  User, 
  Product, 
  Marketplace, 
  ProductOffer, 
  Review, 
  WishlistItem, 
  PriceAlert, 
  NotificationItem, 
  UserLocation, 
  SaleEvent,
  ProductVariant,
  PriceHistoryPoint,
  CityHubInfo,
  RefurbishedPhone,
  RepairServiceItem,
  DoorstepBooking,
  DeviceValuationInput,
  DeviceValuationResult
} from '../src/types/index.js';
import { INITIAL_PRODUCTS } from './data/products.js';
import { INITIAL_MARKETPLACES, INITIAL_SALES } from './data/marketplaces.js';
import { generateOffersForProducts, generatePriceHistoryForProduct, generateReviewsForProduct } from './data/offers.js';
import { 
  INITIAL_CITIES, 
  INITIAL_REFURBISHED_PHONES, 
  INITIAL_REPAIR_SERVICES, 
  INITIAL_SAMPLE_BOOKINGS 
} from './data/doorstepData.js';

class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private marketplaces: Map<string, Marketplace> = new Map();
  private offers: Map<string, ProductOffer[]> = new Map(); // productId -> offers
  private variants: Map<string, ProductVariant[]> = new Map();
  private reviews: Map<string, Review[]> = new Map();
  private priceHistories: Map<string, PriceHistoryPoint[]> = new Map();
  private wishlists: Map<string, WishlistItem[]> = new Map(); // userId -> wishlists
  private priceAlerts: Map<string, PriceAlert[]> = new Map(); // userId -> alerts
  private notifications: Map<string, NotificationItem[]> = new Map(); // userId -> notifications
  private locations: Map<string, UserLocation> = new Map(); // userId -> location
  private sales: SaleEvent[] = [];
  private searchLogs: { query: string; timestamp: string }[] = [];
  private productViews: Map<string, number> = new Map();

  // Doorstep Service Entities
  private cities: CityHubInfo[] = [];
  private refurbishedPhones: Map<string, RefurbishedPhone> = new Map();
  private repairServices: Map<string, RepairServiceItem> = new Map();
  private doorstepBookings: Map<string, DoorstepBooking[]> = new Map(); // userId -> bookings

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // 1. Seed Marketplaces
    INITIAL_MARKETPLACES.forEach(mp => this.marketplaces.set(mp.id, mp));

    // 2. Seed Sales
    this.sales = [...INITIAL_SALES];

    // 3. Seed Products & update lowest/highest prices from offers
    const generatedOffers = generateOffersForProducts();

    INITIAL_PRODUCTS.forEach(product => {
      const productOffers = generatedOffers.filter(o => o.productId === product.id);
      this.offers.set(product.id, productOffers);

      if (productOffers.length > 0) {
        const prices = productOffers.map(o => o.price);
        product.lowestPrice = Math.min(...prices);
        product.highestPrice = Math.max(...prices);
        const lowestOffer = productOffers.find(o => o.price === product.lowestPrice);
        if (lowestOffer) {
          product.bestOfferMarketplace = lowestOffer.marketplaceName;
        }
      }

      this.products.set(product.id, product);

      // Seed Reviews
      this.reviews.set(product.id, generateReviewsForProduct(product.id, product.title));

      // Seed Price History
      this.priceHistories.set(product.id, generatePriceHistoryForProduct(product.id, product.lowestPrice));

      // Seed Variants
      this.variants.set(product.id, [
        {
          id: `var-${product.id}-1`,
          productId: product.id,
          ram: product.ram,
          storage: product.storage,
          color: 'Standard Edition',
          sku: `SKU-${product.brand.substring(0, 3).toUpperCase()}-${product.id.slice(-4)}`
        }
      ]);
    });

    // 4. Seed Default Users (Admin + Demo User)
    const demoUser: User = {
      id: 'usr-demo-1',
      name: 'Ishant Poptani',
      email: 'ishantpoptani5@gmail.com',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      phone: '+91 98765 43210',
      role: 'user',
      accountStatus: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-09-12T00:00:00Z',
      lastLoginAt: new Date().toISOString()
    };
    this.users.set(demoUser.id, demoUser);

    const adminUser: User = {
      id: 'usr-admin-1',
      name: 'System Administrator',
      email: 'admin@amazonmobile.in',
      phone: '+91 90000 00000',
      role: 'admin',
      accountStatus: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2026-09-12T00:00:00Z',
      lastLoginAt: new Date().toISOString()
    };
    this.users.set(adminUser.id, adminUser);

    // Seed sample wishlist & notifications for demo user
    this.wishlists.set(demoUser.id, [
      {
        id: 'wish-1',
        userId: demoUser.id,
        productId: 'prod-apple-iphone-16',
        createdAt: '2026-09-01T10:00:00Z',
        targetPrice: 69999
      },
      {
        id: 'wish-2',
        userId: demoUser.id,
        productId: 'prod-oneplus-12r',
        createdAt: '2026-09-05T12:00:00Z',
        targetPrice: 34999
      }
    ]);

    this.priceAlerts.set(demoUser.id, [
      {
        id: 'alert-1',
        userId: demoUser.id,
        productId: 'prod-apple-iphone-16',
        targetPrice: 69999,
        currentPrice: 73990,
        createdAt: '2026-09-01T10:00:00Z',
        active: true,
        productTitle: 'Apple iPhone 16 (128 GB, Ultramarine)',
        productImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
        productSlug: 'apple-iphone-16'
      }
    ]);

    this.notifications.set(demoUser.id, [
      {
        id: 'notif-1',
        userId: demoUser.id,
        title: 'Price Drop Alert',
        message: 'OnePlus 12R 5G price dropped by ₹4,000 on Amazon India!',
        type: 'price_drop',
        read: false,
        createdAt: '2026-09-11T14:30:00Z',
        actionUrl: '/phones/oneplus-12r'
      },
      {
        id: 'notif-2',
        userId: demoUser.id,
        title: 'Upcoming Sale Announcement',
        message: 'Diwali Mega Festive Sale 2026 starts in 36 days. Prepare your wishlist!',
        type: 'sale_reminder',
        read: false,
        createdAt: '2026-09-10T09:00:00Z',
        actionUrl: '/sales'
      },
      {
        id: 'notif-3',
        userId: demoUser.id,
        title: 'New Phone Launched',
        message: 'Lava Agni 3 5G with Dual AMOLED screen is now available in India.',
        type: 'new_phone',
        read: true,
        createdAt: '2026-09-08T11:20:00Z',
        actionUrl: '/phones/lava-agni-3-5g'
      }
    ]);

    // Initial search analytics queries
    ['iPhone 16', 'Samsung S24 Ultra', '5G phone under 20000', 'OnePlus 12', 'Best gaming phone'].forEach(q => {
      this.searchLogs.push({ query: q, timestamp: new Date().toISOString() });
    });

    // 5. Seed Doorstep Service Entities
    this.cities = [...INITIAL_CITIES];
    INITIAL_REFURBISHED_PHONES.forEach(p => this.refurbishedPhones.set(p.id, p));
    INITIAL_REPAIR_SERVICES.forEach(r => this.repairServices.set(r.id, r));
    this.doorstepBookings.set(demoUser.id, [...INITIAL_SAMPLE_BOOKINGS]);
  }

  // --- Products ---
  public getProducts(params?: {
    search?: string;
    brand?: string;
    category?: string;
    ram?: string;
    minPrice?: number;
    maxPrice?: number;
    is5G?: boolean;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): { products: Product[]; total: number } {
    let list = Array.from(this.products.values());

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      this.searchLogs.push({ query: params.search, timestamp: new Date().toISOString() });

      // Intelligent spec/keyword parser: e.g. "under 30000", "5g", "samsung"
      const underMatch = q.match(/under\s+(\d+)/);
      const parsedMaxPrice = underMatch ? parseInt(underMatch[1], 10) : null;

      list = list.filter(p => {
        const matchesText = 
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.processor.toLowerCase().includes(q) ||
          p.displayType.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (q.includes('5g') && p.is5G) ||
          (q.includes('gaming') && p.category === 'Gaming') ||
          (q.includes('amoled') && p.displayType === 'AMOLED');

        if (parsedMaxPrice) {
          return p.lowestPrice <= parsedMaxPrice;
        }

        return matchesText;
      });
    }

    if (params?.brand) {
      const b = params.brand.toLowerCase();
      list = list.filter(p => p.brand.toLowerCase() === b);
    }

    if (params?.category) {
      list = list.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
    }

    if (params?.minPrice !== undefined) {
      list = list.filter(p => p.lowestPrice >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      list = list.filter(p => p.lowestPrice <= params.maxPrice!);
    }

    if (params?.is5G !== undefined) {
      list = list.filter(p => p.is5G === params.is5G);
    }

    // Sorting
    switch (params?.sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.lowestPrice - b.lowestPrice);
        break;
      case 'price_desc':
        list.sort((a, b) => b.lowestPrice - a.lowestPrice);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'discount':
        list.sort((a, b) => {
          const discA = ((a.startingPrice - a.lowestPrice) / a.startingPrice) || 0;
          const discB = ((b.startingPrice - b.lowestPrice) / b.startingPrice) || 0;
          return discB - discA;
        });
        break;
      default:
        // Featured
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
        break;
    }

    const total = list.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 50;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  public getProductBySlug(slug: string): (Product & {
    offers: ProductOffer[];
    variants: ProductVariant[];
    reviews: Review[];
    priceHistory: PriceHistoryPoint[];
    frequentlyCompared: Product[];
    similarPhones: Product[];
  }) | null {
    const product = Array.from(this.products.values()).find(p => p.slug === slug);
    if (!product) return null;

    // Increment views
    const currentViews = this.productViews.get(product.id) || 0;
    this.productViews.set(product.id, currentViews + 1);

    const offers = this.offers.get(product.id) || [];
    const variants = this.variants.get(product.id) || [];
    const reviews = this.reviews.get(product.id) || [];
    const priceHistory = this.priceHistories.get(product.id) || [];

    // Find similar phones (same category or price +/- 25%)
    const similarPhones = Array.from(this.products.values())
      .filter(p => p.id !== product.id && (p.category === product.category || Math.abs(p.lowestPrice - product.lowestPrice) < product.lowestPrice * 0.3))
      .slice(0, 4);

    // Frequently compared
    const frequentlyCompared = Array.from(this.products.values())
      .filter(p => p.id !== product.id && p.brand !== product.brand && Math.abs(p.lowestPrice - product.lowestPrice) < product.lowestPrice * 0.4)
      .slice(0, 3);

    return {
      ...product,
      offers,
      variants,
      reviews,
      priceHistory,
      frequentlyCompared,
      similarPhones
    };
  }

  public getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  public addProduct(product: Product): Product {
    this.products.set(product.id, product);
    return product;
  }

  public deleteProduct(id: string): boolean {
    return this.products.delete(id);
  }

  // --- Brands ---
  public getBrands(): { name: string; count: number; minPrice: number; logoUrl: string }[] {
    const brandMap = new Map<string, { count: number; minPrice: number }>();

    for (const p of this.products.values()) {
      const existing = brandMap.get(p.brand) || { count: 0, minPrice: Infinity };
      existing.count += 1;
      existing.minPrice = Math.min(existing.minPrice, p.lowestPrice);
      brandMap.set(p.brand, existing);
    }

    return Array.from(brandMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      minPrice: data.minPrice === Infinity ? 0 : data.minPrice,
      logoUrl: this.getBrandLogo(name)
    })).sort((a, b) => b.count - a.count);
  }

  private getBrandLogo(brand: string): string {
    const logos: Record<string, string> = {
      Apple: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&auto=format&fit=crop&q=80',
      Samsung: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&auto=format&fit=crop&q=80',
      OnePlus: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&auto=format&fit=crop&q=80',
      'Google Pixel': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&auto=format&fit=crop&q=80',
      Xiaomi: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80',
      Redmi: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop&q=80',
      Realme: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=100&auto=format&fit=crop&q=80',
      Vivo: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&auto=format&fit=crop&q=80',
      Oppo: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=100&auto=format&fit=crop&q=80',
      Motorola: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=100&auto=format&fit=crop&q=80',
      Nothing: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80',
      iQOO: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&auto=format&fit=crop&q=80',
      Poco: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&auto=format&fit=crop&q=80',
      Asus: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&auto=format&fit=crop&q=80',
      Sony: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80',
      Honor: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=100&auto=format&fit=crop&q=80',
      Lava: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&auto=format&fit=crop&q=80',
      Nokia: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=100&auto=format&fit=crop&q=80'
    };
    return logos[brand] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80';
  }

  // --- Marketplaces ---
  public getMarketplaces(): Marketplace[] {
    return Array.from(this.marketplaces.values());
  }

  // --- Sales ---
  public getSales(): SaleEvent[] {
    return this.sales;
  }

  // --- Comparison ---
  public getPhonesForComparison(ids: string[]): Product[] {
    return ids.map(id => this.products.get(id)).filter(Boolean) as Product[];
  }

  // --- Wishlist ---
  public getWishlist(userId: string): (WishlistItem & { product: Product })[] {
    const items = this.wishlists.get(userId) || [];
    return items
      .map(item => ({
        ...item,
        product: this.products.get(item.productId)!
      }))
      .filter(item => Boolean(item.product));
  }

  public addToWishlist(userId: string, productId: string, targetPrice?: number): WishlistItem {
    const list = this.wishlists.get(userId) || [];
    const existing = list.find(i => i.productId === productId);
    if (existing) {
      if (targetPrice !== undefined) existing.targetPrice = targetPrice;
      return existing;
    }

    const newItem: WishlistItem = {
      id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      productId,
      createdAt: new Date().toISOString(),
      targetPrice
    };
    list.push(newItem);
    this.wishlists.set(userId, list);
    return newItem;
  }

  public removeFromWishlist(userId: string, productId: string): boolean {
    const list = this.wishlists.get(userId) || [];
    const filtered = list.filter(i => i.productId !== productId);
    this.wishlists.set(userId, filtered);
    return true;
  }

  // --- Price Alerts ---
  public getPriceAlerts(userId: string): PriceAlert[] {
    return this.priceAlerts.get(userId) || [];
  }

  public createPriceAlert(userId: string, productId: string, targetPrice: number): PriceAlert {
    const product = this.products.get(productId);
    const alert: PriceAlert = {
      id: `alert-${Date.now()}`,
      userId,
      productId,
      targetPrice,
      currentPrice: product ? product.lowestPrice : targetPrice,
      createdAt: new Date().toISOString(),
      active: true,
      productTitle: product?.title,
      productImage: product?.image,
      productSlug: product?.slug
    };

    const alerts = this.priceAlerts.get(userId) || [];
    alerts.push(alert);
    this.priceAlerts.set(userId, alerts);

    // Also link target price in wishlist
    this.addToWishlist(userId, productId, targetPrice);

    return alert;
  }

  public deletePriceAlert(userId: string, alertId: string): boolean {
    const alerts = this.priceAlerts.get(userId) || [];
    this.priceAlerts.set(userId, alerts.filter(a => a.id !== alertId));
    return true;
  }

  // --- Notifications ---
  public getNotifications(userId: string): NotificationItem[] {
    return this.notifications.get(userId) || [];
  }

  public markNotificationRead(userId: string, id: string): boolean {
    const list = this.notifications.get(userId) || [];
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(userId: string): boolean {
    const list = this.notifications.get(userId) || [];
    list.forEach(n => (n.read = true));
    return true;
  }

  public addNotification(userId: string, notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
    const newItem: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}`,
      userId,
      read: false,
      createdAt: new Date().toISOString()
    };
    const list = this.notifications.get(userId) || [];
    list.unshift(newItem);
    this.notifications.set(userId, list);
    return newItem;
  }

  // --- Location ---
  public getUserLocation(userId: string): UserLocation | null {
    return this.locations.get(userId) || null;
  }

  public setUserLocation(userId: string, data: Partial<UserLocation>): UserLocation {
    const existing = this.locations.get(userId) || {
      id: `loc-${userId}`,
      userId,
      city: 'Delhi',
      state: 'Delhi NCR',
      country: 'India',
      permissionGranted: false,
      updatedAt: new Date().toISOString()
    };

    const updated: UserLocation = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.locations.set(userId, updated);
    return updated;
  }

  public deleteUserLocation(userId: string): boolean {
    return this.locations.delete(userId);
  }

  // --- Reviews ---
  public addReview(productId: string, review: Omit<Review, 'id' | 'createdAt'>): Review {
    const list = this.reviews.get(productId) || [];
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newReview);
    this.reviews.set(productId, list);

    // Recalculate product rating
    const product = this.products.get(productId);
    if (product) {
      const ratings = list.map(r => r.rating);
      const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      product.rating = parseFloat(avg.toFixed(1));
      product.reviewCount = list.length;
    }

    return newReview;
  }

  // --- Users & Auth ---
  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    this.users.set(id, updated);
    return updated;
  }

  // --- Admin Analytics ---
  public getAnalytics() {
    const totalUsers = this.users.size;
    const totalProducts = this.products.size;
    let activeOffersCount = 0;
    this.offers.forEach(o => (activeOffersCount += o.length));

    // Top searched queries
    const queryCounts: Record<string, number> = {};
    this.searchLogs.forEach(s => {
      queryCounts[s.query] = (queryCounts[s.query] || 0) + 1;
    });
    const topSearches = Object.entries(queryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }));

    // Most viewed
    const mostViewed = Array.from(this.productViews.entries())
      .map(([id, views]) => {
        const prod = this.products.get(id);
        return {
          title: prod?.title || id,
          slug: prod?.slug || '',
          views
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      totalUsers,
      totalProducts,
      activeOffersCount,
      totalMarketplaces: this.marketplaces.size,
      topSearches,
      mostViewed,
      syncHealth: 'Optimal (DEMO_MODE active)'
    };
  }

  // --- Doorstep Services: Cities & Pincode Coverage ---
  public getCities(): CityHubInfo[] {
    return this.cities;
  }

  public checkPincode(pincode: string): {
    pincode: string;
    isCovered: boolean;
    city?: string;
    state?: string;
    status?: 'live' | 'launching_soon' | 'planned';
    expressDoorstep: boolean;
    hubName?: string;
    message: string;
  } {
    const cleanPin = pincode.trim();
    for (const city of this.cities) {
      if (city.supportedPincodes.includes(cleanPin)) {
        return {
          pincode: cleanPin,
          isCovered: city.status === 'live',
          city: city.name,
          state: city.state,
          status: city.status,
          expressDoorstep: city.expressAvailable,
          hubName: city.inspectionHubs[0] || 'Central Diagnostic Hub',
          message: city.status === 'live'
            ? `Doorstep inspection available in ${city.name}! 60-90 min express pickup active.`
            : `Doorstep service launching soon in ${city.name} (${cleanPin}). Register for priority slot.`
        };
      }
    }

    // Default response if not directly listed in explicit array
    // Check if pincode begins with 560 (Bengaluru)
    if (cleanPin.startsWith('560')) {
      return {
        pincode: cleanPin,
        isCovered: true,
        city: 'Bengaluru',
        state: 'Karnataka',
        status: 'live',
        expressDoorstep: true,
        hubName: 'Bengaluru Metro Area Hub',
        message: 'Doorstep inspection active across Bengaluru! Guaranteed same-day inspection.'
      };
    }

    if (cleanPin.startsWith('282')) {
      return {
        pincode: cleanPin,
        isCovered: true,
        city: 'Agra',
        state: 'Uttar Pradesh',
        status: 'live',
        expressDoorstep: true,
        hubName: 'Agra Sanjay Place / Taj Nagari Hub',
        message: 'Doorstep inspection active across Agra! Express 60-90 min technician visit available.'
      };
    }

    return {
      pincode: cleanPin,
      isCovered: false,
      expressDoorstep: false,
      message: 'Doorstep service is currently expanding. Join the waitlist for priority launch in your area!'
    };
  }

  // --- Doorstep Services: Device Valuation Algorithm ---
  public calculateValuation(input: DeviceValuationInput): DeviceValuationResult {
    // Determine baseline market estimation based on brand and storage
    let base = 35000;
    const b = input.brand.toLowerCase();
    const m = input.model.toLowerCase();

    if (b.includes('apple') || m.includes('iphone')) {
      if (m.includes('15') || m.includes('16')) base = 58000;
      else if (m.includes('14')) base = 44000;
      else if (m.includes('13')) base = 34000;
      else if (m.includes('12')) base = 25000;
      else base = 18000;
    } else if (b.includes('samsung')) {
      if (m.includes('ultra') || m.includes('fold') || m.includes('flip')) base = 55000;
      else if (m.includes('s24') || m.includes('s23')) base = 42000;
      else if (m.includes('s22') || m.includes('s21')) base = 26000;
      else base = 16000;
    } else if (b.includes('oneplus')) {
      if (m.includes('12') || m.includes('11')) base = 32000;
      else if (m.includes('10') || m.includes('9')) base = 22000;
      else base = 15000;
    } else if (b.includes('pixel')) {
      if (m.includes('8') || m.includes('9')) base = 40000;
      else if (m.includes('7')) base = 26000;
      else base = 17000;
    } else {
      base = 18000;
    }

    // Storage tier multiplier
    if (input.storage.includes('512') || input.storage.includes('1TB')) base += 5000;
    else if (input.storage.includes('256')) base += 2500;

    // Age depreciation (approx 1.5% per month)
    const ageMonths = Math.min(input.deviceAgeMonths || 12, 48);
    const ageDeduction = Math.round(base * (ageMonths * 0.012));

    const breakdown: { label: string; amount: number; type: 'base' | 'deduction' | 'bonus' }[] = [
      { label: `Baseline Market Benchmark (${input.brand} ${input.model})`, amount: base, type: 'base' }
    ];

    let currentVal = base - ageDeduction;
    if (ageDeduction > 0) {
      breakdown.push({
        label: `Usage Depreciation (${ageMonths} months active life)`,
        amount: -ageDeduction,
        type: 'deduction'
      });
    }

    // Screen Condition
    if (input.screenCondition === 'minor_scratches') {
      const ded = Math.round(currentVal * 0.08);
      currentVal -= ded;
      breakdown.push({ label: 'Screen: Light surface hairline marks', amount: -ded, type: 'deduction' });
    } else if (input.screenCondition === 'cracked_or_lines') {
      const ded = Math.round(currentVal * 0.28);
      currentVal -= ded;
      breakdown.push({ label: 'Screen: Glass cracks / display lines', amount: -ded, type: 'deduction' });
    } else if (input.screenCondition === 'touch_issue') {
      const ded = Math.round(currentVal * 0.38);
      currentVal -= ded;
      breakdown.push({ label: 'Screen: Touch sensor / dead zone replacement needed', amount: -ded, type: 'deduction' });
    } else {
      breakdown.push({ label: 'Screen: Pristine & Flawless (+0% deduction)', amount: 0, type: 'bonus' });
    }

    // Body Condition
    if (input.bodyCondition === 'minor_scuffs') {
      const ded = Math.round(currentVal * 0.06);
      currentVal -= ded;
      breakdown.push({ label: 'Body: Normal pocket wear & minor bezel scuffs', amount: -ded, type: 'deduction' });
    } else if (input.bodyCondition === 'dents_or_bent') {
      const ded = Math.round(currentVal * 0.20);
      currentVal -= ded;
      breakdown.push({ label: 'Body: Heavy corner dents / warped chassis', amount: -ded, type: 'deduction' });
    }

    // Functional Issues
    if (input.functionalIssues && input.functionalIssues.length > 0) {
      input.functionalIssues.forEach(issue => {
        let ded = 1200;
        let label = 'Functional issue';
        if (issue.includes('camera')) {
          ded = 1800;
          label = 'Camera sensor / focus calibration repair';
        } else if (issue.includes('battery')) {
          ded = 1500;
          label = 'Battery health degraded under 80%';
        } else if (issue.includes('face_id') || issue.includes('biometric')) {
          ded = 2000;
          label = 'FaceID / Fingerprint sensor repair';
        } else if (issue.includes('mic')) {
          ded = 900;
          label = 'Microphone / Speaker module repair';
        }
        currentVal -= ded;
        breakdown.push({ label, amount: -ded, type: 'deduction' });
      });
    }

    // Accessories Bonuses
    if (input.accessories.hasOriginalBill) {
      currentVal += 800;
      breakdown.push({ label: 'Original Invoice / Bill with matching IMEI', amount: 800, type: 'bonus' });
    }
    if (input.accessories.hasBox) {
      currentVal += 500;
      breakdown.push({ label: 'Original Retail Packaging Box', amount: 500, type: 'bonus' });
    }
    if (input.accessories.hasOriginalCharger) {
      currentVal += 400;
      breakdown.push({ label: 'Original Fast Charger & Cable', amount: 400, type: 'bonus' });
    }

    // Ensure floor minimum
    const finalPrice = Math.max(Math.round(currentVal / 100) * 100, 2500);

    // Exchange bonus is extra 8-10% (min ₹1,500, max ₹3,500)
    const exchangeBonus = Math.min(Math.max(Math.round(finalPrice * 0.1), 1500), 3500);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const token = `LOCK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return {
      id: `val-${Date.now()}`,
      brand: input.brand,
      model: input.model,
      variant: `${input.ram || 'Standard'} • ${input.storage || '128GB'}`,
      baseMarketPrice: base,
      finalOfferedPrice: finalPrice,
      exchangeBonusPrice: exchangeBonus,
      breakdown,
      priceLockedForDays: 7,
      priceLockToken: token,
      createdAt: new Date().toISOString(),
      expiresAt
    };
  }

  // --- Doorstep Services: Refurbished Store ---
  public getRefurbishedPhones(params?: {
    brand?: string;
    grade?: string;
    maxPrice?: number;
    search?: string;
  }): RefurbishedPhone[] {
    let list = Array.from(this.refurbishedPhones.values());

    if (params?.brand) {
      const b = params.brand.toLowerCase();
      list = list.filter(p => p.brand.toLowerCase() === b);
    }

    if (params?.grade) {
      list = list.filter(p => p.conditionGrade.toLowerCase().includes(params.grade!.toLowerCase()));
    }

    if (params?.maxPrice) {
      list = list.filter(p => p.price <= params.maxPrice!);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.model.toLowerCase().includes(q));
    }

    return list;
  }

  public getRefurbishedPhoneBySlug(slug: string): RefurbishedPhone | undefined {
    return Array.from(this.refurbishedPhones.values()).find(p => p.slug === slug || p.id === slug);
  }

  // --- Doorstep Services: Repair Catalog ---
  public getRepairServices(params?: { brand?: string; issue?: string }): RepairServiceItem[] {
    let list = Array.from(this.repairServices.values());

    if (params?.brand && params.brand !== 'All') {
      const b = params.brand.toLowerCase();
      list = list.filter(r => r.phoneBrand.toLowerCase().includes(b) || r.phoneBrand.includes('Universal'));
    }

    if (params?.issue && params.issue !== 'All') {
      list = list.filter(r => r.issueCategory.toLowerCase() === params.issue?.toLowerCase());
    }

    return list;
  }

  // --- Doorstep Services: Bookings Management ---
  public getBookings(userId: string): DoorstepBooking[] {
    return this.doorstepBookings.get(userId) || [];
  }

  public getBookingById(bookingId: string): DoorstepBooking | undefined {
    for (const list of this.doorstepBookings.values()) {
      const found = list.find(b => b.id === bookingId || b.bookingNumber === bookingId);
      if (found) return found;
    }
    return undefined;
  }

  public createBooking(data: Partial<DoorstepBooking> & { userId: string }): DoorstepBooking {
    const bookingNumber = `MS-${(data.city || 'BLR').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: DoorstepBooking = {
      id: `book-${Date.now()}`,
      bookingNumber,
      userId: data.userId,
      serviceCategory: data.serviceCategory || 'sell',
      deviceTitle: data.deviceTitle || 'Smartphone Diagnostic',
      serviceDetails: data.serviceDetails || 'Doorstep inspection & certification',
      city: data.city || 'Bengaluru',
      pincode: data.pincode || '560001',
      address: data.address || '',
      landmark: data.landmark || '',
      customerName: data.customerName || 'Customer',
      customerPhone: data.customerPhone || '',
      scheduledDate: data.scheduledDate || 'Today (Express 90-Min Slot)',
      timeSlot: data.timeSlot || '04:00 PM - 06:00 PM',
      payoutMethod: data.payoutMethod || 'UPI_GPAY',
      payoutUpiId: data.payoutUpiId || '',
      estimatedAmount: data.estimatedAmount || 0,
      exchangeTargetProduct: data.exchangeTargetProduct,
      status: 'technician_assigned',
      technician: {
        name: 'Rahul Sharma',
        phone: '+91 98450 12891',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        idBadge: 'MS-TECH-BLR-048',
        rating: 4.9,
        inspectionsCompleted: 342
      },
      trackingUpdates: [
        {
          title: 'Booking Confirmed',
          timestamp: 'Just now',
          completed: true,
          description: `Doorstep appointment registered under reference #${bookingNumber}.`
        },
        {
          title: 'Technician Assigned',
          timestamp: 'Just now',
          completed: true,
          description: 'Specialist Rahul Sharma assigned with mobile diagnostic kit.'
        },
        {
          title: 'En Route to Your Address',
          timestamp: 'Scheduled for selected slot',
          completed: false,
          description: 'Technician will arrive at your doorstep in a verified MobileBazaar uniform.'
        },
        {
          title: '32-Point Transparent Inspection',
          timestamp: 'At Doorstep',
          completed: false,
          description: 'Hardware, screen, camera and battery tests completed in 15 minutes.'
        },
        {
          title: 'Instant Payout / Device Handover',
          timestamp: 'At Doorstep',
          completed: false,
          description: 'Direct UPI transfer or new phone handover before technician departs.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const userBookings = this.doorstepBookings.get(data.userId) || [];
    userBookings.unshift(newBooking);
    this.doorstepBookings.set(data.userId, userBookings);

    return newBooking;
  }

  public cancelBooking(bookingId: string, userId: string): boolean {
    const list = this.doorstepBookings.get(userId);
    if (!list) return false;
    const booking = list.find(b => b.id === bookingId);
    if (!booking) return false;

    booking.status = 'cancelled';
    booking.updatedAt = new Date().toISOString();
    booking.trackingUpdates.push({
      title: 'Booking Cancelled',
      timestamp: 'Just now',
      completed: true,
      description: 'Doorstep appointment cancelled upon customer request.'
    });
    return true;
  }
}

export const db = new InMemoryDatabase();

