import { 
  Product, 
  Marketplace, 
  SaleEvent, 
  Review, 
  WishlistItem, 
  PriceAlert, 
  NotificationItem, 
  UserLocation, 
  User,
  CityHubInfo,
  RefurbishedPhone,
  RepairServiceItem,
  DoorstepBooking,
  DeviceValuationInput,
  DeviceValuationResult
} from '../types/index.js';

const getUserId = () => {
  return localStorage.getItem('amazon_mobile_user_id') || 'usr-demo-1';
};

const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': getUserId(),
    ...(options?.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
};

export const api = {
  // Products
  getProducts: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    return fetcher<{ products: Product[]; total: number }>(`/api/products?${query.toString()}`);
  },

  getProductBySlug: (slug: string) => {
    return fetcher<Product & {
      offers: any[];
      variants: any[];
      reviews: Review[];
      priceHistory: any[];
      frequentlyCompared: Product[];
      similarPhones: Product[];
    }>(`/api/products/${slug}`);
  },

  getBrands: () => fetcher<{ name: string; count: number; minPrice: number; logoUrl: string }[]>('/api/brands'),

  getMarketplaces: () => fetcher<Marketplace[]>('/api/marketplaces'),

  getSales: () => fetcher<SaleEvent[]>('/api/sales'),

  getDeals: () => fetcher<{
    todayDeals: Product[];
    biggestDiscounts: Product[];
    priceDrops: Product[];
    bestValue: Product[];
  }>('/api/deals'),

  comparePhones: (ids: string[]) => fetcher<Product[]>('/api/compare', {
    method: 'POST',
    body: JSON.stringify({ ids })
  }),

  // Wishlist
  getWishlist: () => fetcher<(WishlistItem & { product: Product })[]>('/api/wishlist'),
  addToWishlist: (productId: string, targetPrice?: number) => fetcher<WishlistItem>('/api/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId, targetPrice })
  }),
  removeFromWishlist: (productId: string) => fetcher<{ success: boolean }>(`/api/wishlist/${productId}`, {
    method: 'DELETE'
  }),

  // Price Alerts
  getPriceAlerts: () => fetcher<PriceAlert[]>('/api/price-alerts'),
  createPriceAlert: (productId: string, targetPrice: number) => fetcher<PriceAlert>('/api/price-alerts', {
    method: 'POST',
    body: JSON.stringify({ productId, targetPrice })
  }),
  deletePriceAlert: (alertId: string) => fetcher<{ success: boolean }>(`/api/price-alerts/${alertId}`, {
    method: 'DELETE'
  }),

  // Notifications
  getNotifications: () => fetcher<NotificationItem[]>('/api/notifications'),
  markNotificationRead: (id: string) => fetcher<{ success: boolean }>(`/api/notifications/${id}/read`, {
    method: 'POST'
  }),
  markAllNotificationsRead: () => fetcher<{ success: boolean }>('/api/notifications/mark-all-read', {
    method: 'POST'
  }),

  // Location
  getLocation: () => fetcher<UserLocation>('/api/location'),
  setLocation: (data: Partial<UserLocation>) => fetcher<UserLocation>('/api/location', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteLocation: () => fetcher<{ success: boolean }>('/api/location', {
    method: 'DELETE'
  }),

  // Reviews
  addReview: (data: { productId: string; rating: number; title: string; comment: string; userName?: string }) => 
    fetcher<Review>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Auth
  login: (email: string, password: string) => fetcher<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (name: string, email: string, password: string) => fetcher<{ user: User; token: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  googleLogin: (data?: { email?: string; name?: string; picture?: string }) => fetcher<{ user: User; token: string }>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify(data || {})
  }),
  getMe: () => fetcher<User>('/api/auth/me'),

  // Admin
  getAdminAnalytics: () => fetcher<any>('/api/admin/analytics'),
  getSyncStatus: async () => {
    const data = await fetcher<any>('/api/admin/analytics');
    return data.syncStatuses || [];
  },
  runSync: (marketplace: string) => fetcher<any>('/api/admin/sync/run', {
    method: 'POST',
    body: JSON.stringify({ marketplace })
  }),
  triggerSync: (marketplace: string) => fetcher<any>('/api/admin/sync/run', {
    method: 'POST',
    body: JSON.stringify({ marketplace })
  }),

  // Doorstep Mobile Services
  getCities: () => fetcher<CityHubInfo[]>('/api/doorstep/cities'),
  checkPincode: (pincode: string) => fetcher<{
    pincode: string;
    isCovered: boolean;
    city?: string;
    state?: string;
    status?: 'live' | 'launching_soon' | 'planned';
    expressDoorstep: boolean;
    hubName?: string;
    message: string;
  }>('/api/doorstep/check-pincode', {
    method: 'POST',
    body: JSON.stringify({ pincode })
  }),
  calculateValuation: (data: DeviceValuationInput) => fetcher<DeviceValuationResult>('/api/doorstep/valuation', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getRefurbishedPhones: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
    }
    return fetcher<RefurbishedPhone[]>(`/api/doorstep/refurbished?${query.toString()}`);
  },
  getRefurbishedPhone: (slug: string) => fetcher<RefurbishedPhone>(`/api/doorstep/refurbished/${slug}`),
  getRepairServices: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
    }
    return fetcher<RepairServiceItem[]>(`/api/doorstep/repairs?${query.toString()}`);
  },
  getDoorstepBookings: () => fetcher<DoorstepBooking[]>('/api/doorstep/bookings'),
  createDoorstepBooking: (data: Partial<DoorstepBooking>) => fetcher<DoorstepBooking>('/api/doorstep/bookings', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getDoorstepBookingById: (id: string) => fetcher<DoorstepBooking>(`/api/doorstep/bookings/${id}`),
  cancelDoorstepBooking: (id: string) => fetcher<{ success: boolean; message: string }>(`/api/doorstep/bookings/${id}/cancel`, {
    method: 'POST'
  })
};
