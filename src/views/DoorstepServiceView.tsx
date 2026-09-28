import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Wrench, 
  RefreshCw, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  BadgePercent, 
  Truck, 
  Search, 
  Sparkles, 
  Check, 
  X, 
  ChevronRight, 
  PhoneCall, 
  CreditCard,
  Lock,
  Layers,
  HelpCircle,
  TrendingDown,
  Info,
  Activity,
  Gauge,
  BatteryCharging,
  Radio
} from 'lucide-react';
import { api } from '../lib/api.js';
import { 
  CityHubInfo, 
  RefurbishedPhone, 
  RepairServiceItem, 
  DoorstepBooking, 
  DeviceValuationInput, 
  DeviceValuationResult,
  Product
} from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useLocation } from '../context/LocationContext.js';

interface DoorstepServiceViewProps {
  initialTab?: 'sell' | 'exchange' | 'repair' | 'refurbished' | 'cities' | 'track';
  onNavigate: (path: string) => void;
}

export const DoorstepServiceView: React.FC<DoorstepServiceViewProps> = ({ 
  initialTab = 'sell',
  onNavigate 
}) => {
  const { user } = useAuth();
  const { location } = useLocation();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'sell' | 'exchange' | 'repair' | 'refurbished' | 'cities' | 'track'>(initialTab);

  // Cities & Pincode State
  const [cities, setCities] = useState<CityHubInfo[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [pincodeInput, setPincodeInput] = useState<string>('560038');
  const [pincodeResult, setPincodeResult] = useState<{
    isCovered: boolean;
    city?: string;
    expressDoorstep: boolean;
    hubName?: string;
    message: string;
  } | null>(null);
  const [checkingPin, setCheckingPin] = useState(false);

  // Valuation Form State
  const [valBrand, setValBrand] = useState('Apple');
  const [valModel, setValModel] = useState('iPhone 13');
  const [valStorage, setValStorage] = useState('128GB');
  const [valRam, setValRam] = useState('4GB');
  const [valScreen, setValScreen] = useState<'flawless' | 'minor_scratches' | 'cracked_or_lines' | 'touch_issue'>('flawless');
  const [valBody, setValBody] = useState<'like_new' | 'minor_scuffs' | 'dents_or_bent'>('like_new');
  const [valFunctional, setValFunctional] = useState<string[]>([]);
  const [valAccessories, setValAccessories] = useState({
    hasBox: true,
    hasOriginalBill: true,
    hasOriginalCharger: true
  });
  const [valAgeMonths, setValAgeMonths] = useState(14);
  const [valResult, setValResult] = useState<DeviceValuationResult | null>(null);
  const [calculatingVal, setCalculatingVal] = useState(false);

  // Refurbished phones
  const [refurbishedList, setRefurbishedList] = useState<RefurbishedPhone[]>([]);
  const [refurbBrandFilter, setRefurbBrandFilter] = useState('All');
  const [refurbGradeFilter, setRefurbGradeFilter] = useState('All');

  // Repair catalog
  const [repairCatalog, setRepairCatalog] = useState<RepairServiceItem[]>([]);
  const [repairBrandFilter, setRepairBrandFilter] = useState('All');
  const [repairIssueFilter, setRepairIssueFilter] = useState('All');

  // User Bookings
  const [userBookings, setUserBookings] = useState<DoorstepBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Booking Modal / Drawer State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingServiceType, setBookingServiceType] = useState<'sell' | 'exchange' | 'repair' | 'refurbished'>('sell');
  const [bookingDeviceTitle, setBookingDeviceTitle] = useState('');
  const [bookingAmount, setBookingAmount] = useState(0);
  const [bookingAddress, setBookingAddress] = useState('Flat 402, Green Glen Layout, Indiranagar');
  const [bookingLandmark, setBookingLandmark] = useState('Near BDA Complex 100ft Road');
  const [bookingDate, setBookingDate] = useState('Today (Express 90-Min Slot)');
  const [bookingSlot, setBookingSlot] = useState('04:30 PM - 06:00 PM');
  const [payoutMethod, setPayoutMethod] = useState<'UPI_GPAY' | 'UPI_PHONEPE' | 'BANK_IMPS' | 'STORE_CREDIT_BONUS'>('UPI_GPAY');
  const [payoutUpiId, setPayoutUpiId] = useState('ishant@okhdfcbank');
  const [customerName, setCustomerName] = useState(user?.name || 'Ishant Poptani');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<DoorstepBooking | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Exchange Target Phone Selection
  const [exchangeTargetPhone, setExchangeTargetPhone] = useState<RefurbishedPhone | null>(null);

  // Interactive Diagnostics Simulator
  const [showTouchTestModal, setShowTouchTestModal] = useState(false);
  const [touchedGrid, setTouchedGrid] = useState<boolean[]>(new Array(12).fill(false));
  const [touchTestPassed, setTouchTestPassed] = useState(false);

  // Interactive Battery Slider (60 to 100)
  const [batteryHealth, setBatteryHealth] = useState(91);

  // Interactive Live Tech Ping
  const [techPingActive, setTechPingActive] = useState(false);
  const [pingedTechDetails, setPingedTechDetails] = useState<{
    name: string;
    hub: string;
    etaMinutes: number;
    distanceKm: number;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [citiesData, refurbData, repairsData] = await Promise.all([
          api.getCities(),
          api.getRefurbishedPhones(),
          api.getRepairServices()
        ]);
        setCities(citiesData);
        setRefurbishedList(refurbData);
        setRepairCatalog(repairsData);
        if (refurbData.length > 0) {
          setExchangeTargetPhone(refurbData[0]);
        }
      } catch (err) {
        console.error('Failed to load doorstep services metadata', err);
      }
    };
    loadInitialData();
  }, []);

  // Load bookings when track tab is activated
  useEffect(() => {
    if (activeTab === 'track') {
      loadBookings();
    }
  }, [activeTab]);

  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const data = await api.getDoorstepBookings();
      setUserBookings(data);
    } catch (err) {
      console.error('Failed to load user doorstep bookings', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Re-run valuation whenever input conditions change (instant reactive experience)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRunValuation();
    }, 120);
    return () => clearTimeout(timer);
  }, [
    valBrand, 
    valModel, 
    valStorage, 
    valRam, 
    valScreen, 
    valBody, 
    valFunctional, 
    valAccessories, 
    valAgeMonths,
    batteryHealth
  ]);

  const handleRunValuation = async () => {
    setCalculatingVal(true);
    try {
      // If battery is < 80, ensure battery_degraded is registered
      const activeIssues = [...valFunctional];
      if (batteryHealth < 80 && !activeIssues.includes('battery_degraded')) {
        activeIssues.push('battery_degraded');
      } else if (batteryHealth >= 80) {
        const idx = activeIssues.indexOf('battery_degraded');
        if (idx !== -1) activeIssues.splice(idx, 1);
      }

      const result = await api.calculateValuation({
        brand: valBrand,
        model: valModel,
        variant: `${valRam} • ${valStorage}`,
        ram: valRam,
        storage: valStorage,
        screenCondition: valScreen,
        bodyCondition: valBody,
        functionalIssues: activeIssues,
        accessories: valAccessories,
        deviceAgeMonths: valAgeMonths
      });
      setValResult(result);
    } catch (err) {
      console.error('Failed to calculate valuation', err);
    } finally {
      setCalculatingVal(false);
    }
  };

  const handleTileTouch = (index: number) => {
    setTouchedGrid(prev => {
      const next = [...prev];
      next[index] = true;
      const allTouched = next.every(Boolean);
      if (allTouched) {
        setTouchTestPassed(true);
        setValScreen('flawless');
      }
      return next;
    });
  };

  const resetTouchTest = () => {
    setTouchedGrid(new Array(12).fill(false));
    setTouchTestPassed(false);
  };

  const handlePingTechnician = () => {
    setTechPingActive(true);
    setPingedTechDetails(null);
    setTimeout(() => {
      setTechPingActive(false);
      setPingedTechDetails({
        name: selectedCity === 'Agra' ? 'Vikas Verma (Agra Hub Specialist #AG-14)' : 'Rahul Sharma (Senior Specialist #BLR-48)',
        hub: selectedCity === 'Agra' ? 'Sanjay Place / Taj Nagari Standby Hub' : 'Indiranagar 100ft Road Hub',
        etaMinutes: selectedCity === 'Agra' ? 28 : 34,
        distanceKm: selectedCity === 'Agra' ? 2.4 : 3.8
      });
    }, 1100);
  };

  const handleCheckPincode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pincodeInput.trim()) return;
    setCheckingPin(true);
    try {
      const res = await api.checkPincode(pincodeInput.trim());
      setPincodeResult(res);
      if (res.city) {
        setSelectedCity(res.city);
      }
    } catch (err) {
      console.error('Pincode check error', err);
    } finally {
      setCheckingPin(false);
    }
  };

  const toggleFunctionalIssue = (issueKey: string) => {
    setValFunctional(prev => 
      prev.includes(issueKey) ? prev.filter(i => i !== issueKey) : [...prev, issueKey]
    );
  };

  const openBookingForValuation = () => {
    if (!valResult) return;
    setBookingServiceType('sell');
    setBookingDeviceTitle(`${valResult.brand} ${valResult.model} (${valResult.variant})`);
    setBookingAmount(valResult.finalOfferedPrice);
    setShowBookingModal(true);
  };

  const openBookingForExchange = () => {
    if (!valResult || !exchangeTargetPhone) return;
    setBookingServiceType('exchange');
    setBookingDeviceTitle(`Exchange: ${valResult.brand} ${valResult.model} -> ${exchangeTargetPhone.title}`);
    const net = Math.max(exchangeTargetPhone.price - valResult.finalOfferedPrice - valResult.exchangeBonusPrice, 0);
    setBookingAmount(net);
    setShowBookingModal(true);
  };

  const openBookingForRepair = (item: RepairServiceItem) => {
    setBookingServiceType('repair');
    setBookingDeviceTitle(`${item.phoneBrand} ${item.phoneModel} - ${item.issueCategory} (${item.partQuality})`);
    setBookingAmount(item.estimatedCost);
    setShowBookingModal(true);
  };

  const openBookingForRefurbished = (item: RefurbishedPhone) => {
    setBookingServiceType('refurbished');
    setBookingDeviceTitle(`Buy Certified: ${item.title} [Grade: ${item.conditionGrade}]`);
    setBookingAmount(item.price);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBooking(true);
    try {
      const newBooking = await api.createDoorstepBooking({
        serviceCategory: bookingServiceType,
        deviceTitle: bookingDeviceTitle,
        serviceDetails: `City Doorstep inspection & fulfillment at ${selectedCity}`,
        city: selectedCity,
        pincode: pincodeInput,
        address: bookingAddress,
        landmark: bookingLandmark,
        customerName,
        customerPhone,
        scheduledDate: bookingDate,
        timeSlot: bookingSlot,
        payoutMethod,
        payoutUpiId: payoutMethod.startsWith('UPI') ? payoutUpiId : undefined,
        estimatedAmount: bookingAmount,
        exchangeTargetProduct: bookingServiceType === 'exchange' && exchangeTargetPhone ? {
          id: exchangeTargetPhone.id,
          title: exchangeTargetPhone.title,
          image: exchangeTargetPhone.image,
          price: exchangeTargetPhone.price,
          netPayable: bookingAmount
        } : undefined
      });

      setBookingSuccessData(newBooking);
      setShowBookingModal(false);
      setBookingError(null);
      // Switch to tracking view
      setActiveTab('track');
      loadBookings();
    } catch (err: any) {
      setBookingError(err.message || 'Booking failed. Please verify your address and contact details.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Filter refurbished
  const filteredRefurbished = refurbishedList.filter(item => {
    if (refurbBrandFilter !== 'All' && item.brand.toLowerCase() !== refurbBrandFilter.toLowerCase()) return false;
    if (refurbGradeFilter !== 'All' && !item.conditionGrade.toLowerCase().includes(refurbGradeFilter.toLowerCase())) return false;
    return true;
  });

  // Filter repairs
  const filteredRepairs = repairCatalog.filter(item => {
    if (repairBrandFilter !== 'All' && !item.phoneBrand.toLowerCase().includes(repairBrandFilter.toLowerCase()) && !item.phoneBrand.includes('Universal')) return false;
    if (repairIssueFilter !== 'All' && item.issueCategory !== repairIssueFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-20">
      
      {/* Top City & Express Notice Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white border-b border-indigo-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-tight">
                Doorstep Hubs Active in <strong className="underline decoration-amber-400 font-black text-amber-300">Bengaluru</strong> & <strong className="underline decoration-amber-400 font-black text-amber-300">Agra</strong> (60–90 min visit)
              </span>
              <span className="hidden lg:inline text-indigo-200">
                • Sanjay Place, Taj Nagari, Indiranagar, Koramangala • Free Data Wipe Certificate
              </span>
            </div>

            {/* Quick Pincode Checker */}
            <form onSubmit={handleCheckPincode} className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <MapPin className="w-3.5 h-3.5 text-indigo-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pincodeInput}
                  onChange={e => setPincodeInput(e.target.value)}
                  placeholder="Enter PIN code (e.g. 282002, 560038)"
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-400/30 text-white placeholder:text-indigo-300 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                disabled={checkingPin}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 transition-colors cursor-pointer"
              >
                {checkingPin ? 'Checking...' : 'Check Coverage'}
              </button>
            </form>
          </div>

          {/* Feedback banner if pincode checked */}
          {pincodeResult && (
            <div className={`mt-2.5 p-2 px-3 rounded-lg text-xs flex items-center justify-between ${
              pincodeResult.isCovered ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200' : 'bg-amber-950/80 border border-amber-500/40 text-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                {pincodeResult.isCovered ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                <span>{pincodeResult.message}</span>
              </div>
              {pincodeResult.hubName && (
                <span className="font-semibold text-emerald-300 text-[11px] hidden sm:inline">
                  Assigned Hub: {pincodeResult.hubName}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hero Presentation */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Doorstep Mobile Convenience • Zero Hassle</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Sell, Exchange, Repair or Buy Refurbished Phones <span className="text-blue-600 dark:text-blue-400">Right at Your Doorstep</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Get an instant online quote, book a 15-minute doorstep inspection, and receive safe UPI payment on the spot. Professional technicians with ID badges, calibrated tools, and 100% data wipe guarantees.
              </p>

              {/* Guarantees Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    Instant UPI Transfer
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    Certified 100% Data Wipe
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    60-90 Min Express Slot
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <Lock className="w-4 h-4 text-purple-500 shrink-0" />
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    7-Day Price Lock
                  </div>
                </div>
              </div>
            </div>

            {/* Right Mini City Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl border border-indigo-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold">
                    Active City:
                  </span>
                  <select
                    value={selectedCity}
                    onChange={e => {
                      const c = e.target.value;
                      setSelectedCity(c);
                      if (c === 'Agra') {
                        setPincodeInput('282002');
                        setBookingAddress('House 12, Kamla Nagar Market, Agra');
                        setBookingLandmark('Near Sanjay Place Commercial Centre');
                      } else {
                        setPincodeInput('560038');
                        setBookingAddress('Flat 402, Green Glen Layout, Indiranagar');
                        setBookingLandmark('Near BDA Complex 100ft Road');
                      }
                    }}
                    className="bg-indigo-950/80 border border-indigo-500/40 rounded-lg px-2 py-0.5 text-xs font-bold text-amber-300 outline-none"
                  >
                    <option value="Bengaluru">Bengaluru (KA)</option>
                    <option value="Agra">Agra (UP)</option>
                  </select>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Operations
                </span>
              </div>

              <div className="text-2xl font-black text-white mb-1">
                {selectedCity === 'Agra' ? 'Agra Central Hub' : 'Bengaluru Central Hub'}
              </div>
              <p className="text-xs text-indigo-200 mb-4 leading-relaxed">
                {selectedCity === 'Agra'
                  ? 'Operating across 8 inspection hubs in Sanjay Place, Taj Nagari, Kamla Nagar, Dayalbagh, Sadar Bazaar & Sikandra.'
                  : 'Operating across 12 inspection hubs in Indiranagar, Koramangala, Whitefield, HSR, Electronic City & Jayanagar.'}
              </p>

              <div className="space-y-2 text-xs border-t border-indigo-800/60 pt-3">
                <div className="flex justify-between text-indigo-200">
                  <span>Average Doorstep ETA:</span>
                  <span className="font-bold text-white">{selectedCity === 'Agra' ? '38 Minutes' : '42 Minutes'}</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>Inspections Done This Week:</span>
                  <span className="font-bold text-emerald-300">{selectedCity === 'Agra' ? '684 Verified' : '1,248 Verified'}</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>Customer Satisfaction:</span>
                  <span className="font-bold text-amber-400">4.94 / 5.0 ★</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('cities')}
                className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View All Hubs & Expansion Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Core Vertical Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'sell'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Sell Old Phone</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'sell' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                Instant Cash
              </span>
            </button>

            <button
              onClick={() => setActiveTab('exchange')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'exchange'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Exchange & Upgrade</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'exchange' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                +₹3,500 Bonus
              </span>
            </button>

            <button
              onClick={() => setActiveTab('repair')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'repair'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Doorstep Repair</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'repair' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                At-Home 45-Min
              </span>
            </button>

            <button
              onClick={() => setActiveTab('refurbished')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'refurbished'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Refurbished</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'refurbished' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
              }`}>
                1-Yr Warranty
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cities')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'cities'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>City Coverage</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Track Bookings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: SELL OLD PHONE - VALUATION CALCULATOR & BOOKING */}
        {/* ======================================================== */}
        {activeTab === 'sell' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Device Assessment Form */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span>Instant Old Phone Valuation Engine</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Select your device model and condition for an accurate, guaranteed fair price quote.
                  </p>
                </div>

                {/* Step 1: Select Brand & Model */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Step 1: Select Brand & Model
                  </label>
                  
                  {/* Brand Pills */}
                  <div className="flex flex-wrap gap-2">
                    {['Apple', 'Samsung', 'OnePlus', 'Google Pixel', 'Xiaomi', 'Vivo', 'Realme', 'Nothing'].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setValBrand(b);
                          if (b === 'Apple') setValModel('iPhone 13');
                          else if (b === 'Samsung') setValModel('Galaxy S23');
                          else if (b === 'OnePlus') setValModel('OnePlus 11');
                          else if (b === 'Google Pixel') setValModel('Pixel 7 Pro');
                          else setValModel('Standard 5G Model');
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          valBrand === b 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1">Model Name</span>
                      <input
                        type="text"
                        value={valModel}
                        onChange={e => setValModel(e.target.value)}
                        placeholder="e.g. iPhone 13 Pro"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1">RAM</span>
                      <select
                        value={valRam}
                        onChange={e => setValRam(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                      >
                        <option value="4GB">4GB RAM</option>
                        <option value="6GB">6GB RAM</option>
                        <option value="8GB">8GB RAM</option>
                        <option value="12GB">12GB RAM</option>
                        <option value="16GB">16GB RAM</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1">Storage</span>
                      <select
                        value={valStorage}
                        onChange={e => setValStorage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                      >
                        <option value="64GB">64GB</option>
                        <option value="128GB">128GB</option>
                        <option value="256GB">256GB</option>
                        <option value="512GB">512GB</option>
                        <option value="1TB">1TB</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Step 2: Screen Condition */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 2: Screen & Display Condition
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        resetTouchTest();
                        setShowTouchTestModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60"
                    >
                      <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                      <span>{touchTestPassed ? '✓ 12/12 Touch Matrix Verified' : 'Run Interactive Touch Screen Test'}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { key: 'flawless', title: 'Flawless (No scratches)', desc: 'Zero scratches, perfectly original' },
                      { key: 'minor_scratches', title: 'Minor Surface Scratches', desc: 'Light scratches visible only under light' },
                      { key: 'cracked_or_lines', title: 'Cracked Glass / Lines', desc: 'Visible crack or color line' },
                      { key: 'touch_issue', title: 'Touch Fault / Dead Spot', desc: 'Touch unresponsive in parts' }
                    ].map(s => (
                      <div
                        key={s.key}
                        onClick={() => setValScreen(s.key as any)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          valScreen === s.key 
                            ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-bold ring-2 ring-blue-500/20' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{s.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3: Body & Frame */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Step 3: Body / Back Panel Condition
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: 'like_new', title: 'Like New', desc: 'No dents, mint frame' },
                      { key: 'minor_scuffs', title: 'Normal Wear', desc: 'Pocket scuffs, minor paint wear' },
                      { key: 'dents_or_bent', title: 'Heavy Dents', desc: 'Chassis dents or cracked back' }
                    ].map(b => (
                      <div
                        key={b.key}
                        onClick={() => setValBody(b.key as any)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          valBody === b.key 
                            ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-bold ring-2 ring-blue-500/20' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{b.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 4: Interactive Battery Health & Functional Checks */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 4: Battery Health & Functional Status
                    </label>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span>{batteryHealth}% Capacity ({batteryHealth >= 85 ? 'Peak Performance' : 'Service Recommended'})</span>
                    </span>
                  </div>

                  {/* Interactive Battery Slider */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>Adjust Battery Health %</span>
                      <span className="font-bold text-amber-500">{batteryHealth}%</span>
                    </div>
                    <input
                      type="range"
                      min={65}
                      max={100}
                      value={batteryHealth}
                      onChange={e => setBatteryHealth(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>65% (Deduction applies)</span>
                      <span>80% (Threshold)</span>
                      <span>100% (Maximum Value)</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {[
                      { key: 'camera_fault', label: 'Camera Blurry/Fault' },
                      { key: 'battery_degraded', label: 'Battery Health <80%' },
                      { key: 'face_id_fault', label: 'FaceID / Fingerprint' },
                      { key: 'mic_fault', label: 'Mic / Speaker Issue' }
                    ].map(item => {
                      const selected = valFunctional.includes(item.key) || (item.key === 'battery_degraded' && batteryHealth < 80);
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            if (item.key === 'battery_degraded') {
                              setBatteryHealth(batteryHealth < 80 ? 88 : 74);
                            } else {
                              toggleFunctionalIssue(item.key);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                            selected 
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300' 
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 5: Original Accessories Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 5: Available Accessories (+Bonus Value)
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      valAccessories.hasOriginalBill ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-200 dark:border-slate-800'
                    }`}>
                      <input
                        type="checkbox"
                        checked={valAccessories.hasOriginalBill}
                        onChange={e => setValAccessories({ ...valAccessories, hasOriginalBill: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Original Invoice</div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+₹800 Value</div>
                      </div>
                    </label>

                    <label className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      valAccessories.hasBox ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-200 dark:border-slate-800'
                    }`}>
                      <input
                        type="checkbox"
                        checked={valAccessories.hasBox}
                        onChange={e => setValAccessories({ ...valAccessories, hasBox: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Original Box</div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+₹500 Value</div>
                      </div>
                    </label>

                    <label className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      valAccessories.hasOriginalCharger ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-200 dark:border-slate-800'
                    }`}>
                      <input
                        type="checkbox"
                        checked={valAccessories.hasOriginalCharger}
                        onChange={e => setValAccessories({ ...valAccessories, hasOriginalCharger: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Original Charger</div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+₹400 Value</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Recalculate Button */}
                <button
                  type="button"
                  onClick={handleRunValuation}
                  disabled={calculatingVal}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${calculatingVal ? 'animate-spin' : ''}`} />
                  <span>{calculatingVal ? 'Calculating Transparent Fair Value...' : 'Update Valuation'}</span>
                </button>
              </div>

              {/* Right Column: Instant Valuation Quote Card */}
              <div className="lg:col-span-5 space-y-6">
                
                {valResult ? (
                  <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-700/40 space-y-6">
                    
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase">
                        <Lock className="w-3.5 h-3.5" />
                        <span>7-Day Price Guarantee</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-300">
                        {valResult.priceLockToken}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs text-indigo-300 font-medium">Estimated Doorstep Cash Offer</div>
                      <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                        <span>₹{valResult.finalOfferedPrice.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-emerald-400 font-bold">Instant UPI</span>
                      </div>
                      <div className="text-xs text-indigo-200 mt-2 flex items-center gap-1.5">
                        <BadgePercent className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          Or get <strong className="text-amber-300 font-bold">₹{(valResult.finalOfferedPrice + valResult.exchangeBonusPrice).toLocaleString('en-IN')}</strong> if upgraded towards a new smartphone!
                        </span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5 text-xs">
                      <div className="font-bold text-slate-200 border-b border-white/10 pb-2 flex justify-between">
                        <span>Valuation Breakdown</span>
                        <span>Amount</span>
                      </div>
                      {valResult.breakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-300">
                          <span className="truncate pr-2">{item.label}</span>
                          <span className={`font-mono font-bold shrink-0 ${
                            item.type === 'bonus' ? 'text-emerald-400' : item.type === 'deduction' ? 'text-rose-400' : 'text-white'
                          }`}>
                            {item.amount > 0 ? `+₹${item.amount.toLocaleString('en-IN')}` : item.amount < 0 ? `-₹${Math.abs(item.amount).toLocaleString('en-IN')}` : '₹0'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Book Inspection CTAs */}
                    <div className="space-y-3 pt-2">
                      <button
                        onClick={openBookingForValuation}
                        className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Book Free Doorstep Inspection</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('exchange');
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Exchange for an Upgraded Phone (+Bonus)</span>
                      </button>
                    </div>

                    {/* Trust badges */}
                    <div className="border-t border-indigo-800/60 pt-4 grid grid-cols-2 gap-2 text-[11px] text-indigo-200">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Zero Visit Fee</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Safe UPI Transfer</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>15-Min Quick Check</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Data Erasure Paper</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Calculating real-time valuation...
                    </p>
                  </div>
                )}

                {/* How It Works Quick Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                    How Doorstep Selling Works
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-black flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Check Guaranteed Value</div>
                        <div className="text-slate-500">Answer 4 quick condition questions and get instant price.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-black flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Technician Arrives at Doorstep</div>
                        <div className="text-slate-500">Within 60-90 mins or your preferred slot with official ID badge.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-black flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Instant UPI Payment Handover</div>
                        <div className="text-slate-500">Money credited to your bank account before phone leaves your hands.</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: EXCHANGE & UPGRADE - SMART TRADE-IN */}
        {/* ======================================================== */}
        {activeTab === 'exchange' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <RefreshCw className="w-6 h-6 text-amber-500" />
                  <span>Doorstep Phone Exchange & Upgrade Calculator</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Trade in your old device for an instant discount + extra exchange bonus towards any smartphone. Handover happens right at your home!
                </p>
              </div>

              {/* Exchange Comparison Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Old Phone Trade-in Box */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-slate-500">Step 1: Your Old Phone</span>
                    <button
                      onClick={() => setActiveTab('sell')}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Change Condition
                    </button>
                  </div>
                  
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {valBrand} {valModel} ({valStorage})
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Base Trade-in Value:</span>
                      <span className="font-bold">₹{(valResult?.finalOfferedPrice || 24000).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Doorstep Exchange Bonus:</span>
                      <span>+₹{(valResult?.exchangeBonusPrice || 2500).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-slate-900 dark:text-white text-sm">
                      <span>Total Trade-in Credit:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        ₹{((valResult?.finalOfferedPrice || 24000) + (valResult?.exchangeBonusPrice || 2500)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Swap Arrow */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold mt-1 text-slate-500">Swap at Doorstep</span>
                </div>

                {/* Target Phone Box */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-blue-700 dark:text-blue-300">
                      Step 2: Choose Upgrade Phone
                    </span>
                    <span className="text-[11px] text-slate-500">Pick below</span>
                  </div>

                  {exchangeTargetPhone ? (
                    <div>
                      <div className="font-bold text-base text-slate-900 dark:text-white truncate">
                        {exchangeTargetPhone.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Certified Refurbished • Grade: {exchangeTargetPhone.conditionGrade}
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-slate-600 dark:text-slate-300">Phone Price:</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          ₹{exchangeTargetPhone.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">Select a phone from below list to calculate upgrade price</div>
                  )}
                </div>

              </div>

              {/* Net Payable Banner */}
              {exchangeTargetPhone && valResult && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                      Calculated Net Doorstep Payable
                    </span>
                    <div className="text-2xl sm:text-4xl font-black text-amber-300 mt-0.5">
                      ₹{Math.max(exchangeTargetPhone.price - valResult.finalOfferedPrice - valResult.exchangeBonusPrice, 0).toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-indigo-200 mt-1">
                      You save ₹{(valResult.finalOfferedPrice + valResult.exchangeBonusPrice).toLocaleString('en-IN')} via doorstep trade-in!
                    </div>
                  </div>

                  <button
                    onClick={openBookingForExchange}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Book Doorstep Exchange Handover</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Select Upgrade Smartphone Grid */}
              <div className="space-y-4 pt-4">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Choose Phone to Upgrade To:
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {refurbishedList.map(phone => {
                    const isSelected = exchangeTargetPhone?.id === phone.id;
                    const netPrice = valResult 
                      ? Math.max(phone.price - valResult.finalOfferedPrice - valResult.exchangeBonusPrice, 0)
                      : phone.price;

                    return (
                      <div
                        key={phone.id}
                        onClick={() => setExchangeTargetPhone(phone)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20' 
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={phone.image}
                            alt={phone.title}
                            className="w-16 h-16 object-contain rounded-xl bg-slate-100 dark:bg-slate-800 p-1 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {phone.title}
                            </div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                              {phone.conditionGrade}
                            </span>
                            <div className="mt-2 text-xs font-black text-slate-900 dark:text-white">
                              ₹{phone.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-slate-500">Net with Exchange:</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">
                            ₹{netPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DOORSTEP MOBILE REPAIR */}
        {/* ======================================================== */}
        {activeTab === 'repair' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span>Doorstep Mobile Repair at Your Home</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Certified specialists fix your cracked screen, degraded battery, or charging port right in front of you in 45 minutes.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3.5 py-2 rounded-xl border border-emerald-500/20 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>6-12 Months Doorstep Warranty on All Parts</span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 self-center mr-2">Brand:</span>
                {['All', 'Apple', 'Samsung', 'OnePlus'].map(b => (
                  <button
                    key={b}
                    onClick={() => setRepairBrandFilter(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      repairBrandFilter === b
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}

                <span className="text-xs font-bold text-slate-400 self-center ml-4 mr-2">Issue:</span>
                {['All', 'Screen Display', 'Battery Replacement', 'Charging Port', 'Back Glass'].map(issue => (
                  <button
                    key={issue}
                    onClick={() => setRepairIssueFilter(issue)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      repairIssueFilter === issue
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {issue}
                  </button>
                ))}
              </div>

              {/* Repair Services Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRepairs.map(item => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {item.issueCategory}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {item.warrantyMonths} Mo. Warranty
                        </span>
                      </div>

                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.phoneModel}
                      </div>

                      <div className="text-xs text-slate-500">
                        Part Grade: <strong className="text-slate-700 dark:text-slate-300">{item.partQuality}</strong>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Repair Duration: ~{item.repairTimeMinutes} Minutes at your location</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-black text-slate-900 dark:text-white">
                          ₹{item.estimatedCost.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400 line-through">
                          Market: ₹{item.marketPrice.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={() => openBookingForRepair(item)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Book Repair
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Repair Trust Process */}
              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Fixed in Front of You</span>
                  </div>
                  <p className="text-slate-500">No taking your device away. Technicians carry ESD mats and repair right at your table.</p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-purple-500" />
                    <span>Zero Data Risk</span>
                  </div>
                  <p className="text-slate-500">No passwords or pattern unlocks required for hardware screen or battery replacement.</p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Post-Repair Testing</span>
                  </div>
                  <p className="text-slate-500">Full 18-point diagnostic done with you before payment is accepted.</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CERTIFIED REFURBISHED SMARTPHONES */}
        {/* ======================================================== */}
        {activeTab === 'refurbished' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <span>Certified Refurbished Smartphones</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    32-Point Quality Inspected • Battery Health Guaranteed &gt;85% • 12 Months Warranty • 7-Day Replacement
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-3.5 py-2 rounded-xl border border-purple-500/20 shrink-0">
                  <Truck className="w-4 h-4 text-purple-500" />
                  <span>Open-Box Doorstep Verification: Inspect Before Paying</span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 self-center mr-2">Brand:</span>
                {['All', 'Apple', 'Samsung', 'OnePlus', 'Google Pixel', 'Nothing'].map(b => (
                  <button
                    key={b}
                    onClick={() => setRefurbBrandFilter(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      refurbBrandFilter === b
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}

                <span className="text-xs font-bold text-slate-400 self-center ml-4 mr-2">Grade:</span>
                {['All', 'Superb', 'Very Good'].map(grade => (
                  <button
                    key={grade}
                    onClick={() => setRefurbGradeFilter(grade)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      refurbGradeFilter === grade
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>

              {/* Refurbished Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRefurbished.map(item => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-4/3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full object-contain hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-purple-600 text-white shadow-xs">
                            {item.conditionGrade}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                            {item.discountPercentage}% OFF
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400 font-semibold">{item.brand} • {item.ram} / {item.storage}</div>
                        <div className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                          {item.title}
                        </div>
                      </div>

                      {/* Diagnostic badges */}
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Battery Capacity:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.batteryHealthPercent}% Health</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Doorstep Warranty:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{item.warrantyMonths} Months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">32-Pt Diagnostic:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Certified Passed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-slate-400 line-through">
                          MRP: ₹{item.originalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={() => openBookingForRefurbished(item)}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Buy Doorstep
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CITY COVERAGE & PHYSICAL INSPECTION HUBS */}
        {/* ======================================================== */}
        {activeTab === 'cities' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>City-Focused Footprint & Expansion Roadmap</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  We build deep local operations live in Bengaluru & Agra before scaling city by city to ensure unbeatable customer trust, verified local technicians, and guaranteed 60-90 minute service.
                </p>
              </div>

              {/* Cities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cities.map(city => (
                  <div
                    key={city.name}
                    className={`p-6 rounded-3xl border transition-all ${
                      city.status === 'live'
                        ? 'border-blue-500/40 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{city.name}</span>
                          <span className="text-xs font-normal text-slate-500">({city.state})</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{city.launchDateText}</div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        city.status === 'live' 
                          ? 'bg-emerald-500 text-white' 
                          : city.status === 'launching_soon'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {city.status === 'live' ? 'Live (60-Min Express)' : city.status === 'launching_soon' ? 'Launching Soon' : 'Waitlist Open'}
                      </span>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Operational Inspection Hubs ({city.inspectionHubs.length}):
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {city.inspectionHubs.map((hub, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">{hub}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
                        <span>Local Helpdesk: <strong className="text-slate-700 dark:text-slate-300">{city.contactSupport}</strong></span>
                        {city.status === 'live' ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Technicians on Standby</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">Join Launch Priority</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: TRACK ACTIVE DOORSTEP BOOKINGS */}
        {/* ======================================================== */}
        {activeTab === 'track' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span>Your Doorstep Service Bookings</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Live timeline updates, assigned technician details, and digital receipt tracking.
                  </p>
                </div>

                <button
                  onClick={loadBookings}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingBookings ? 'animate-spin' : ''}`} />
                  <span>Refresh Status</span>
                </button>
              </div>

              {userBookings.length > 0 ? (
                <div className="space-y-6">
                  {userBookings.map(b => (
                    <div
                      key={b.id}
                      className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-6"
                    >
                      {/* Booking Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">
                              #{b.bookingNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              {b.serviceCategory}
                            </span>
                          </div>
                          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                            {b.deviceTitle}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{b.scheduledDate}</span> • <span>{b.timeSlot}</span>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <div className="text-xs text-slate-500">Value / Estimated Payout</div>
                          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                            ₹{b.estimatedAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Via {b.payoutMethod || 'Direct Handover'}
                          </div>
                        </div>
                      </div>

                      {/* Assigned Technician Card */}
                      {b.technician && (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={b.technician.photo}
                              alt={b.technician.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div>
                              <div className="text-xs text-slate-400 font-medium">Assigned Doorstep Specialist</div>
                              <div className="font-bold text-sm text-slate-900 dark:text-white">
                                {b.technician.name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Badge: <strong className="text-slate-700 dark:text-slate-300">{b.technician.idBadge}</strong> • {b.technician.rating} ★ ({b.technician.inspectionsCompleted} visits)
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${b.technician.phone}`}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Call Technician</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Live Diagnostic Timeline */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Live Doorstep Progress
                        </div>

                        <div className="space-y-3">
                          {b.trackingUpdates.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                                step.completed 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                              }`}>
                                {step.completed ? <Check className="w-3 h-3" /> : idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className={`font-bold ${step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                    {step.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{step.timestamp}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address & Instructions */}
                      <div className="text-xs text-slate-500 bg-white/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/40 dark:border-slate-700/40 flex justify-between items-center">
                        <div>
                          <strong>Inspection Address:</strong> {b.address}, {b.landmark}, {b.city} - {b.pincode}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
                    No active bookings found.
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Check your phone's value in the Sell tab or book an on-site repair to schedule your first doorstep appointment!
                  </p>
                  <button
                    onClick={() => setActiveTab('sell')}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer hover:bg-blue-700"
                  >
                    Check Old Phone Value
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* DOORSTEP INSPECTION BOOKING MODAL */}
      {/* ======================================================== */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {selectedCity} Doorstep Hub
                </span>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  Schedule Doorstep Appointment
                </h3>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {bookingError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200">
                <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400">Service:</div>
                <div className="font-bold text-sm mt-0.5">{bookingDeviceTitle}</div>
                <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  Guaranteed Amount: ₹{bookingAmount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Service City
                </label>
                <select
                  value={selectedCity}
                  onChange={e => {
                    const c = e.target.value;
                    setSelectedCity(c);
                    if (c === 'Agra') {
                      setPincodeInput('282002');
                      setBookingAddress('House 12, Kamla Nagar Market, Agra');
                      setBookingLandmark('Near Sanjay Place Commercial Centre');
                    } else if (c === 'Bengaluru') {
                      setPincodeInput('560038');
                      setBookingAddress('Flat 402, Green Glen Layout, Indiranagar');
                      setBookingLandmark('Near BDA Complex 100ft Road');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-bold"
                >
                  <option value="Agra">Agra (Uttar Pradesh) • Live Express 60-Min Hub</option>
                  <option value="Bengaluru">Bengaluru (Karnataka) • Live Express 60-Min Hub</option>
                  <option value="Mumbai">Mumbai (Maharashtra) • Launching Next Month</option>
                  <option value="Delhi-NCR">Delhi-NCR • Phase 2 Expansion</option>
                  <option value="Hyderabad">Hyderabad • Expansion</option>
                  <option value="Pune">Pune • Waitlist</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Inspection Address in {selectedCity}
                </label>
                <input
                  type="text"
                  required
                  value={bookingAddress}
                  onChange={e => setBookingAddress(e.target.value)}
                  placeholder="Flat/House No., Street, Building, Locality"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Landmark</label>
                  <input
                    type="text"
                    value={bookingLandmark}
                    onChange={e => setBookingLandmark(e.target.value)}
                    placeholder="Near metro, park..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincodeInput}
                    onChange={e => setPincodeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>
              </div>

              {/* Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Preferred Date</label>
                  <select
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-medium"
                  >
                    <option value="Today (Express 90-Min Slot)">Today (Express 90-Min Slot)</option>
                    <option value="Tomorrow Morning">Tomorrow Morning</option>
                    <option value="Tomorrow Afternoon">Tomorrow Afternoon</option>
                    <option value="This Weekend">This Weekend</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Window</label>
                  <select
                    value={bookingSlot}
                    onChange={e => setBookingSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-medium"
                  >
                    <option value="04:30 PM - 06:00 PM">04:30 PM - 06:00 PM</option>
                    <option value="06:00 PM - 07:30 PM">06:00 PM - 07:30 PM</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Payout Method */}
              {bookingServiceType === 'sell' && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Instant Payout Method (Transferred on Spot)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('UPI_GPAY')}
                      className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        payoutMethod === 'UPI_GPAY' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Google Pay (UPI)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('UPI_PHONEPE')}
                      className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        payoutMethod === 'UPI_PHONEPE' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      PhonePe (UPI)
                    </button>
                  </div>

                  <input
                    type="text"
                    value={payoutUpiId}
                    onChange={e => setPayoutUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. mobile@okhdfcbank)"
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{submittingBooking ? 'Confirming Appointment...' : 'Confirm Doorstep Appointment'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
