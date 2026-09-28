import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { syncService } from './server/adapters/marketplaceAdapters.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), demoMode: process.env.DEMO_MODE !== 'false' });
  });

  // Get products catalog with search & filters
  app.get('/api/products', (req, res) => {
    const {
      search,
      brand,
      category,
      minPrice,
      maxPrice,
      is5G,
      sortBy,
      limit,
      offset
    } = req.query;

    const result = db.getProducts({
      search: search ? String(search) : undefined,
      brand: brand ? String(brand) : undefined,
      category: category ? String(category) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      is5G: is5G !== undefined ? is5G === 'true' : undefined,
      sortBy: sortBy ? String(sortBy) : undefined,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0
    });

    res.json(result);
  });

  // Product detail by slug
  app.get('/api/products/:slug', (req, res) => {
    const slug = req.params.slug;
    const product = db.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  });

  // Brands list
  app.get('/api/brands', (req, res) => {
    const brands = db.getBrands();
    res.json(brands);
  });

  // Marketplaces list
  app.get('/api/marketplaces', (req, res) => {
    res.json(db.getMarketplaces());
  });

  // Sales and promotional events
  app.get('/api/sales', (req, res) => {
    res.json(db.getSales());
  });

  // Deals page data (biggest discounts, price drops)
  app.get('/api/deals', (req, res) => {
    const all = db.getProducts({ limit: 50 }).products;

    const todayDeals = [...all]
      .sort((a, b) => (b.startingPrice - b.lowestPrice) - (a.startingPrice - a.lowestPrice))
      .slice(0, 8);

    const biggestDiscounts = [...all]
      .sort((a, b) => {
        const discA = (a.startingPrice - a.lowestPrice) / a.startingPrice;
        const discB = (b.startingPrice - b.lowestPrice) / b.startingPrice;
        return discB - discA;
      })
      .slice(0, 8);

    const priceDrops = [...all]
      .filter(p => p.lowestPrice < p.startingPrice)
      .slice(0, 8);

    const bestValue = [...all]
      .filter(p => p.rating >= 4.5 && p.lowestPrice < 35000)
      .slice(0, 8);

    res.json({
      todayDeals,
      biggestDiscounts,
      priceDrops,
      bestValue
    });
  });

  // Compare phones by IDs
  app.post('/api/compare', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids array required' });
    }
    const phones = db.getPhonesForComparison(ids);
    res.json(phones);
  });

  // Wishlist
  app.get('/api/wishlist', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const items = db.getWishlist(userId);
    res.json(items);
  });

  app.post('/api/wishlist', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const { productId, targetPrice } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const item = db.addToWishlist(userId, productId, targetPrice);
    res.json(item);
  });

  app.delete('/api/wishlist/:productId', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const productId = req.params.productId;
    db.removeFromWishlist(userId, productId);
    res.json({ success: true });
  });

  // Price Alerts
  app.get('/api/price-alerts', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    res.json(db.getPriceAlerts(userId));
  });

  app.post('/api/price-alerts', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const { productId, targetPrice } = req.body;
    if (!productId || !targetPrice) {
      return res.status(400).json({ error: 'productId and targetPrice required' });
    }

    const alert = db.createPriceAlert(userId, productId, Number(targetPrice));
    res.json(alert);
  });

  app.delete('/api/price-alerts/:alertId', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    db.deletePriceAlert(userId, req.params.alertId);
    res.json({ success: true });
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    res.json(db.getNotifications(userId));
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    db.markNotificationRead(userId, req.params.id);
    res.json({ success: true });
  });

  app.post('/api/notifications/mark-all-read', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    db.markAllNotificationsRead(userId);
    res.json({ success: true });
  });

  // User Location
  app.get('/api/location', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const location = db.getUserLocation(userId);
    res.json(location || { permissionGranted: false, city: 'Delhi', state: 'Delhi NCR', country: 'India' });
  });

  app.post('/api/location', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const updated = db.setUserLocation(userId, req.body);
    res.json(updated);
  });

  app.delete('/api/location', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    db.deleteUserLocation(userId);
    res.json({ success: true });
  });

  // Reviews
  app.post('/api/reviews', (req, res) => {
    const { productId, rating, title, comment, userName } = req.body;
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }

    const review = db.addReview(productId, {
      productId,
      userId,
      userName: userName || 'Verified Buyer',
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: true
    });

    res.json(review);
  });

  // --- DOORSTEP MOBILE SERVICES API ROUTES ---

  // Get all coverage cities & hubs
  app.get('/api/doorstep/cities', (req, res) => {
    res.json(db.getCities());
  });

  // Check pincode serviceability
  app.post('/api/doorstep/check-pincode', (req, res) => {
    const { pincode } = req.body;
    if (!pincode) return res.status(400).json({ error: 'Pincode is required' });
    const coverage = db.checkPincode(String(pincode));
    res.json(coverage);
  });

  // Calculate device valuation
  app.post('/api/doorstep/valuation', (req, res) => {
    const input = req.body;
    if (!input.brand || !input.model) {
      return res.status(400).json({ error: 'Brand and Model are required for valuation' });
    }
    const result = db.calculateValuation(input);
    res.json(result);
  });

  // Get refurbished phones catalog
  app.get('/api/doorstep/refurbished', (req, res) => {
    const { brand, grade, maxPrice, search } = req.query;
    const phones = db.getRefurbishedPhones({
      brand: brand ? String(brand) : undefined,
      grade: grade ? String(grade) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search ? String(search) : undefined
    });
    res.json(phones);
  });

  // Get single refurbished phone
  app.get('/api/doorstep/refurbished/:slug', (req, res) => {
    const item = db.getRefurbishedPhoneBySlug(req.params.slug);
    if (!item) return res.status(404).json({ error: 'Refurbished phone not found' });
    res.json(item);
  });

  // Get repair services catalog
  app.get('/api/doorstep/repairs', (req, res) => {
    const { brand, issue } = req.query;
    const repairs = db.getRepairServices({
      brand: brand ? String(brand) : undefined,
      issue: issue ? String(issue) : undefined
    });
    res.json(repairs);
  });

  // Get user's doorstep bookings
  app.get('/api/doorstep/bookings', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const bookings = db.getBookings(userId);
    res.json(bookings);
  });

  // Create new doorstep booking
  app.post('/api/doorstep/bookings', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const booking = db.createBooking({
      ...req.body,
      userId
    });

    // Also trigger a system notification to user
    res.json(booking);
  });

  // Get booking by id
  app.get('/api/doorstep/bookings/:id', (req, res) => {
    const booking = db.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  });

  // Cancel booking
  app.post('/api/doorstep/bookings/:id/cancel', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const success = db.cancelBooking(req.params.id, userId);
    if (!success) return res.status(400).json({ error: 'Unable to cancel booking' });
    res.json({ success: true, message: 'Booking cancelled successfully' });
  });

  // Auth: Email/Password & Google Login
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = db.createUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: '',
      role: 'user',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    });

    res.json({ user: newUser, token: `token-${newUser.id}` });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    let user = db.getUserByEmail(email);
    if (!user) {
      // For smooth demo experience, allow creating account if test login
      user = db.createUser({
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'user',
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
    }

    db.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
    res.json({ user, token: `token-${user.id}` });
  });

  app.post('/api/auth/google', (req, res) => {
    // Authenticate via Google OAuth payload or simulated Google token
    const { email, name, picture } = req.body;
    const userEmail = email || 'ishantpoptani5@gmail.com';
    const userName = name || 'Ishant Poptani';

    let user = db.getUserByEmail(userEmail);
    if (!user) {
      user = db.createUser({
        id: `usr-google-${Date.now()}`,
        name: userName,
        email: userEmail,
        profileImage: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        role: 'user',
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
    } else {
      db.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
    }

    res.json({ user, token: `token-google-${user.id}` });
  });

  app.get('/api/auth/me', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr-demo-1';
    const user = db.getUserById(userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    res.json(user);
  });

  // Admin Analytics & Sync Control
  app.get('/api/admin/analytics', (req, res) => {
    const analytics = db.getAnalytics();
    const syncStatuses = syncService.getSyncStatuses();
    res.json({ ...analytics, syncStatuses });
  });

  app.post('/api/admin/sync/run', async (req, res) => {
    const { marketplace } = req.body;
    if (!marketplace) return res.status(400).json({ error: 'marketplace name required' });
    try {
      const result = await syncService.runSyncForMarketplace(marketplace);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MobileBazaar Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
