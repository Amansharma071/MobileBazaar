import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { LocationProvider } from './context/LocationContext.js';
import { WishlistProvider } from './context/WishlistContext.js';
import { CompareProvider } from './context/CompareContext.js';
import { NotificationProvider } from './context/NotificationContext.js';

import { Navbar } from './components/Navbar.js';
import { BottomNav } from './components/BottomNav.js';
import { Footer } from './components/Footer.js';
import { DemoModeBanner } from './components/DemoModeBanner.js';
import { LocationModal } from './components/LocationModal.js';
import { AuthModal } from './components/AuthModal.js';
import { LiveBazaarTicker } from './components/LiveBazaarTicker.js';
import { BazaarSpinModal } from './components/BazaarSpinModal.js';
import { CompareFloatingBar } from './components/CompareFloatingBar.js';

import { HomeView } from './views/HomeView.js';
import { CatalogView } from './views/CatalogView.js';
import { ProductDetailView } from './views/ProductDetailView.js';
import { CompareView } from './views/CompareView.js';
import { DealsView } from './views/DealsView.js';
import { WishlistView } from './views/WishlistView.js';
import { ProfileView } from './views/ProfileView.js';
import { AdminView } from './views/AdminView.js';
import { LegalView } from './views/LegalView.js';
import { DoorstepServiceView } from './views/DoorstepServiceView.js';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [currentQuery, setCurrentQuery] = useState<string>(() => {
    return window.location.search || '';
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentQuery(window.location.search || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (fullUrl: string) => {
    const [pathPart, queryPart] = fullUrl.split('?');
    const newPath = pathPart || '/';
    const newQuery = queryPart ? `?${queryPart}` : '';

    if (window.location.pathname !== newPath || window.location.search !== newQuery) {
      window.history.pushState({}, '', fullUrl);
    }

    setCurrentPath(newPath);
    setCurrentQuery(newQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine which page view to render
  const renderCurrentView = () => {
    // Check for product detail route: /phones/:slug
    if (currentPath.startsWith('/phones/') && currentPath.length > 8) {
      const slug = currentPath.substring(8).split('/')[0];
      return <ProductDetailView slug={slug} onNavigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
        return <HomeView onNavigate={navigate} />;
      case '/phones':
        return <CatalogView currentQueryString={currentQuery} onNavigate={navigate} />;
      case '/compare':
        return <CompareView currentQueryString={currentQuery} onNavigate={navigate} />;
      case '/deals':
      case '/sales':
        return <DealsView onNavigate={navigate} />;
      case '/doorstep':
        return <DoorstepServiceView initialTab="sell" onNavigate={navigate} />;
      case '/sell':
        return <DoorstepServiceView initialTab="sell" onNavigate={navigate} />;
      case '/exchange':
        return <DoorstepServiceView initialTab="exchange" onNavigate={navigate} />;
      case '/repair':
        return <DoorstepServiceView initialTab="repair" onNavigate={navigate} />;
      case '/refurbished':
        return <DoorstepServiceView initialTab="refurbished" onNavigate={navigate} />;
      case '/cities':
        return <DoorstepServiceView initialTab="cities" onNavigate={navigate} />;
      case '/track-doorstep':
        return <DoorstepServiceView initialTab="track" onNavigate={navigate} />;
      case '/wishlist':
        return <WishlistView onNavigate={navigate} />;
      case '/profile':
        return (
          <ProfileView
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        );
      case '/admin':
        return <AdminView />;
      case '/legal':
      case '/privacy':
      case '/terms':
        return <LegalView />;
      default:
        // Default fallback to catalog or home
        return <HomeView onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Demo Mode & Anti-Scraping Compliance Banner */}
      <DemoModeBanner onOpenAdmin={() => navigate('/admin')} />

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 2b. Live Bazaar Interactive Ticker */}
      <LiveBazaarTicker
        onNavigate={navigate}
        onOpenSpinModal={() => setIsSpinModalOpen(true)}
      />

      {/* 3. Main Body */}
      <main className="flex-1 pb-16 sm:pb-0">
        {renderCurrentView()}
      </main>

      {/* 4. Footer */}
      <Footer onNavigate={navigate} />

      {/* 5. Mobile Bottom Navigation Bar */}
      <BottomNav
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Interactive Floating Compare Bar */}
      <CompareFloatingBar onNavigate={navigate} />

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <BazaarSpinModal
        isOpen={isSpinModalOpen}
        onClose={() => setIsSpinModalOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <WishlistProvider>
            <CompareProvider>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
            </CompareProvider>
          </WishlistProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
