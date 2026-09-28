import React from 'react';
import { ShieldCheck, FileText, Lock, ExternalLink, Mail } from 'lucide-react';

interface LegalViewProps {
  tab?: 'terms' | 'privacy' | 'affiliate';
}

export const LegalView: React.FC<LegalViewProps> = ({ tab = 'terms' }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Trust & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Legal Policies & Affiliate Disclosure
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Transparency regarding price data ingestion, privacy standards, and referral links.
        </p>
      </div>

      {/* Affiliate Disclosure Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
          <FileText className="w-5 h-5" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Official Affiliate Disclosure
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          MobileBazaar is a specialized consumer smartphone discovery, price-comparison, and doorstep device service platform. We partner with authorized e-commerce marketplaces including Amazon India Associates Program, Flipkart Affiliate Platform, and verified retail distributor partner programs.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When users click through our outbound marketplace links to purchase a smartphone, MobileBazaar may earn an affiliate commission at zero additional cost to the consumer. This never impacts product pricing, algorithmic rankings, or price comparison integrity.
        </p>
      </div>

      {/* Anti-Scraping Commitment */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Anti-Scraping & Ethical Data Acquisition Guarantee
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          MobileBazaar strictly complies with the terms of service of third-party retail platforms and Indian IT regulations:
        </p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 pl-2">
          <li>We do <strong>NOT</strong> perform unauthorized bot scraping, headless web crawling, or HTML DOM extraction against Amazon India, Flipkart, or Meesho.</li>
          <li>All product listings and price points are ingested exclusively through official partner feeds, API integrations (such as Amazon PA-API 5.0), and licensed distributor feeds.</li>
          <li>In demo and testing environments, clearly designated realistic mock simulation feeds are operated to prevent unauthorized network requests.</li>
        </ul>
      </div>

      {/* Privacy Policy */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400">
          <Lock className="w-5 h-5" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Privacy Policy & User Data Protection
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          We collect only the minimal data required to deliver core functionality:
        </p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-2">
          <li><strong>Authentication:</strong> Google One-Tap/OAuth credentials or email addresses are stored securely to persist user wishlists and price alerts.</li>
          <li><strong>Location Data:</strong> Geolocation coordinates or PIN codes entered by users are strictly used client-side or session-based to compute localized retail availability and same-day delivery feasibility. We do not sell or track your movements.</li>
          <li><strong>Price Alerts:</strong> Email addresses provided for price drop notifications are only utilized for alert delivery.</li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-500">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Grievance Officer & Legal Contact</h3>
        <p>MobileBazaar Legal & Compliance Cell</p>
        <p>Email: legal@mobilebazaar.in | Bengaluru & Agra Hubs, India</p>
      </div>
    </div>
  );
};
