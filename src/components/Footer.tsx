import React from 'react';
import { Smartphone, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-amber-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-black text-xs tracking-tighter">
                  <span className="text-white">M</span>
                  <span className="text-amber-400">B</span>
                </div>
              </div>
              <span className="text-base font-black tracking-tight text-white uppercase">
                MOBILE<span className="text-amber-500">BAZAAR</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier independent smartphone discovery, price comparison, and city-focused doorstep device service platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Data Wipe Guarantee</span>
            </div>
          </div>

          {/* Doorstep Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-1.5">
              <span>Doorstep Services</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-black">BLR & AGR Hubs</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/sell')} className="hover:text-white transition-colors text-left">
                  Sell Old Phone (Instant UPI)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/exchange')} className="hover:text-white transition-colors text-left">
                  Exchange & Upgrade (+₹3,500)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/repair')} className="hover:text-white transition-colors text-left">
                  Doorstep Repair (45-Min Service)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/refurbished')} className="hover:text-white transition-colors text-left">
                  Certified Refurbished (1-Yr Warranty)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cities')} className="hover:text-white transition-colors text-left">
                  Bengaluru Hubs & Pincode Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/track-doorstep')} className="hover:text-white transition-colors text-left text-amber-300">
                  Track Doorstep Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Phones
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/phones')} className="hover:text-white transition-colors text-left">
                  All Smartphones Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/phones?category=Flagship')} className="hover:text-white transition-colors text-left">
                  Flagship Smartphones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/phones?category=Gaming')} className="hover:text-white transition-colors text-left">
                  Best Gaming Phones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/phones?maxPrice=30000')} className="hover:text-white transition-colors text-left">
                  Phones Under ₹30,000
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/phones?maxPrice=15000')} className="hover:text-white transition-colors text-left">
                  Budget Under ₹15,000
                </button>
              </li>
            </ul>
          </div>

          {/* Comparison & Deals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Tools & Savings
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/compare')} className="hover:text-white transition-colors text-left">
                  Side-by-Side Comparison
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/deals')} className="hover:text-white transition-colors text-left">
                  Deals & Price Drops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sales')} className="hover:text-white transition-colors text-left">
                  Festival Sales 2026
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/wishlist')} className="hover:text-white transition-colors text-left">
                  Tracked Price Drop Alerts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-white transition-colors text-left">
                  Admin & Sync Status
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Marketplaces */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors text-left">
                  Terms of Service & Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors text-left">
                  Privacy & Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/data-policy')} className="hover:text-white transition-colors text-left">
                  Ethical Data Policy
                </button>
              </li>
              <li className="pt-2">
                <span className="text-[11px] text-slate-500 block leading-tight">
                  MobileBazaar operates with certified local technician dispatch and official data APIs.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure & Trademarks */}
        <div className="pt-8 pb-4 text-[11px] text-slate-500 leading-relaxed space-y-3">
          <p>
            <strong>Affiliate Disclosure:</strong> MobileBazaar participates in affiliate marketing programs, including the Amazon Associates Program and Flipkart Affiliate network. We may earn a modest commission when you purchase products through qualifying affiliate links on our service, at no additional cost to you. Product prices, coupons, bank offers, and stock availability are updated periodically and reflect data reported at the time of last sync.
          </p>
          <p>
            <strong>Trademarks:</strong> All product names, logos, and brands (including Apple, Samsung, OnePlus, Google Pixel, Xiaomi, Realme, Vivo, Oppo, Motorola, Nothing, iQOO, and Poco) are property of their respective trademark holders. Use of these names does not imply any affiliation or endorsement.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} MobileBazaar. Built for informed smartphone shoppers.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Version 2.4.0 (Production Release)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
