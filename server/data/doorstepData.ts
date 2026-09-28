import { CityHubInfo, RefurbishedPhone, RepairServiceItem, DoorstepBooking } from '../../src/types/index.js';

export const INITIAL_CITIES: CityHubInfo[] = [
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    status: 'live',
    launchDateText: 'Operational (City Launch HQ)',
    expressAvailable: true,
    inspectionHubs: [
      'Indiranagar Hub (100ft Rd)',
      'Koramangala 4th Block Hub',
      'Whitefield ITPL Hub',
      'HSR Layout Sector 1 Hub',
      'Electronic City Phase 1 Hub',
      'Jayanagar 4th Block Hub',
      'Malleshwaram 8th Cross Hub',
      'Marathahalli Bridge Hub',
      'Hebbal Esteem Hub',
      'Bellandur EcoSpace Hub',
      'JP Nagar Phase 2 Hub',
      'Yelahanka New Town Hub'
    ],
    supportedPincodes: [
      '560001', '560002', '560004', '560008', '560011', '560025', '560034',
      '560037', '560038', '560041', '560043', '560066', '560068', '560076',
      '560078', '560095', '560100', '560102', '560103'
    ],
    contactSupport: '+91 80 4719 3200 (Bengaluru Priority Helpdesk)'
  },
  {
    name: 'Agra',
    state: 'Uttar Pradesh',
    status: 'live',
    launchDateText: 'Operational (Taj City & Commercial Hubs Active)',
    expressAvailable: true,
    inspectionHubs: [
      'Sanjay Place Commercial Hub',
      'Taj Nagari Phase 1 & 2 Hub',
      'Kamla Nagar Central Market Hub',
      'Dayalbagh Educational Hub',
      'Sadar Bazaar / Agra Cantt Hub',
      'Sikandra Industrial & Tech Hub',
      'Fatehabad Road Hub',
      'Shahganj Bodla Hub'
    ],
    supportedPincodes: [
      '282001', '282002', '282003', '282004', '282005', '282006', '282007', '282009', '282010'
    ],
    contactSupport: '+91 562 258 4100 (Agra Doorstep Priority Support)'
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    status: 'launching_soon',
    launchDateText: 'Launching Next Month (Beta in Bandra & Powai)',
    expressAvailable: true,
    inspectionHubs: [
      'Bandra Kurla Complex (BKC) Hub',
      'Andheri West Lokhandwala Hub',
      'Powai Hiranandani Hub',
      'Lower Parel Phoenix Hub',
      'Navi Mumbai Vashi Hub'
    ],
    supportedPincodes: [
      '400001', '400050', '400051', '400053', '400058', '400076', '400703'
    ],
    contactSupport: '+91 22 6820 4400'
  },
  {
    name: 'Delhi-NCR',
    state: 'Delhi / Haryana / UP',
    status: 'launching_soon',
    launchDateText: 'Phase 2 Expansion (Q4 2026)',
    expressAvailable: true,
    inspectionHubs: [
      'Connaught Place Hub',
      'Gurgaon Cyber City Hub',
      'Noida Sector 18 Hub',
      'South Ext Part 2 Hub'
    ],
    supportedPincodes: [
      '110001', '110016', '110019', '110024', '122002', '201301'
    ],
    contactSupport: '+91 11 4980 1200'
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    status: 'planned',
    launchDateText: 'Phase 2 Expansion',
    expressAvailable: false,
    inspectionHubs: [
      'Hitec City Cyber Towers Hub',
      'Gachibowli Financial Dist Hub',
      'Banjara Hills Road No 1 Hub'
    ],
    supportedPincodes: [
      '500032', '500034', '500081', '500084'
    ],
    contactSupport: '+91 40 3512 8800'
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    status: 'planned',
    launchDateText: 'Phase 3 Waitlist',
    expressAvailable: false,
    inspectionHubs: [
      'Koregaon Park Hub',
      'Baner High Street Hub',
      'Hinjewadi Phase 1 Hub'
    ],
    supportedPincodes: [
      '411001', '411045', '411057'
    ],
    contactSupport: '+91 20 6710 3300'
  }
];

export const INITIAL_REFURBISHED_PHONES: RefurbishedPhone[] = [
  {
    id: 'refurb-iphone-14-pro',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    title: 'Apple iPhone 14 Pro (128GB, Space Black)',
    slug: 'apple-iphone-14-pro-refurbished',
    conditionGrade: 'Superb (Like New)',
    color: 'Space Black',
    ram: '6GB',
    storage: '128GB',
    price: 64999,
    originalPrice: 129900,
    discountPercentage: 50,
    batteryHealthPercent: 92,
    warrantyMonths: 12,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80'
    ],
    keySpecs: {
      processor: 'A16 Bionic Chip',
      display: '6.1" Super Retina XDR OLED, 120Hz ProMotion',
      camera: '48MP + 12MP + 12MP with LiDAR & Photonic Engine',
      battery: '3200 mAh, All-day life',
      os: 'iOS 18 Supported',
      is5G: true
    },
    inspectionReport: {
      screenDisplay: 'Passed (Original OEM)',
      batteryHealth: 'Passed (>85% Capacity)',
      cameras: 'Passed (Front & Rear Dual/Triple)',
      biometrics: 'Passed (FaceID / Fingerprint tested)',
      chargingPort: 'Passed (Fast charging verified)',
      networkCalling: 'Passed (5G/4G/VoLTE tested)',
      bodyCondition: 'Zero scratches on frame and back glass. Factory grade polish.'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'refurb-samsung-s23-ultra',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    title: 'Samsung Galaxy S23 Ultra 5G (12GB/256GB, Phantom Black)',
    slug: 'samsung-galaxy-s23-ultra-refurbished',
    conditionGrade: 'Superb (Like New)',
    color: 'Phantom Black',
    ram: '12GB',
    storage: '256GB',
    price: 59999,
    originalPrice: 124999,
    discountPercentage: 52,
    batteryHealthPercent: 94,
    warrantyMonths: 12,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80'
    ],
    keySpecs: {
      processor: 'Snapdragon 8 Gen 2 for Galaxy',
      display: '6.8" Dynamic AMOLED 2X, 120Hz, S-Pen Integrated',
      camera: '200MP + 12MP + 10MP + 10MP (100x Space Zoom)',
      battery: '5000 mAh, 45W Fast Charging',
      os: 'Android 15 / One UI 7',
      is5G: true
    },
    inspectionReport: {
      screenDisplay: 'Passed (Original OEM)',
      batteryHealth: 'Passed (>85% Capacity)',
      cameras: 'Passed (Front & Rear Dual/Triple)',
      biometrics: 'Passed (FaceID / Fingerprint tested)',
      chargingPort: 'Passed (Fast charging verified)',
      networkCalling: 'Passed (5G/4G/VoLTE tested)',
      bodyCondition: 'Flawless condition. S-Pen latency and pressure sensitivity tested 100%.'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'refurb-iphone-13',
    brand: 'Apple',
    model: 'iPhone 13',
    title: 'Apple iPhone 13 (128GB, Midnight Blue)',
    slug: 'apple-iphone-13-refurbished',
    conditionGrade: 'Very Good',
    color: 'Midnight',
    ram: '4GB',
    storage: '128GB',
    price: 36999,
    originalPrice: 69900,
    discountPercentage: 47,
    batteryHealthPercent: 89,
    warrantyMonths: 6,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80'
    ],
    keySpecs: {
      processor: 'A15 Bionic Chip',
      display: '6.1" Super Retina XDR OLED',
      camera: '12MP + 12MP with Cinematic Mode',
      battery: '3227 mAh',
      os: 'iOS 18 Supported',
      is5G: true
    },
    inspectionReport: {
      screenDisplay: 'Passed (Original OEM)',
      batteryHealth: 'Passed (>85% Capacity)',
      cameras: 'Passed (Front & Rear Dual/Triple)',
      biometrics: 'Passed (FaceID / Fingerprint tested)',
      chargingPort: 'Passed (Fast charging verified)',
      networkCalling: 'Passed (5G/4G/VoLTE tested)',
      bodyCondition: 'Minor hairline micro-abrasion on bottom speaker rim, invisible with case. Screen 100% pristine.'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'refurb-oneplus-11',
    brand: 'OnePlus',
    model: 'OnePlus 11 5G',
    title: 'OnePlus 11 5G (16GB/256GB, Titan Black)',
    slug: 'oneplus-11-5g-refurbished',
    conditionGrade: 'Superb (Like New)',
    color: 'Titan Black',
    ram: '16GB',
    storage: '256GB',
    price: 31999,
    originalPrice: 61999,
    discountPercentage: 48,
    batteryHealthPercent: 93,
    warrantyMonths: 6,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'
    ],
    keySpecs: {
      processor: 'Snapdragon 8 Gen 2',
      display: '6.7" 2K 120Hz Super Fluid AMOLED',
      camera: '50MP Sony IMX890 + 48MP Ultra-wide + 32MP Telephoto',
      battery: '5000 mAh, 100W SUPERVOOC',
      os: 'OxygenOS 15',
      is5G: true
    },
    inspectionReport: {
      screenDisplay: 'Passed (Original OEM)',
      batteryHealth: 'Passed (>85% Capacity)',
      cameras: 'Passed (Front & Rear Dual/Triple)',
      biometrics: 'Passed (FaceID / Fingerprint tested)',
      chargingPort: 'Passed (Fast charging verified)',
      networkCalling: 'Passed (5G/4G/VoLTE tested)',
      bodyCondition: 'Excellent condition. Hasselblad optics calibration verified.'
    },
    inStock: true,
    featured: false
  },
  {
    id: 'refurb-google-pixel-7-pro',
    brand: 'Google Pixel',
    model: 'Pixel 7 Pro',
    title: 'Google Pixel 7 Pro (12GB/128GB, Hazel)',
    slug: 'google-pixel-7-pro-refurbished',
    conditionGrade: 'Very Good',
    color: 'Hazel',
    ram: '12GB',
    storage: '128GB',
    price: 28999,
    originalPrice: 84999,
    discountPercentage: 65,
    batteryHealthPercent: 90,
    warrantyMonths: 6,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80'
    ],
    keySpecs: {
      processor: 'Google Tensor G2 with Titan M2',
      display: '6.7" QHD+ LTPO OLED 120Hz',
      camera: '50MP + 48MP 5x Telephoto + 12MP Ultra-wide',
      battery: '5000 mAh, Qi Wireless Charging',
      os: 'Pure Android 15 with Feature Drops',
      is5G: true
    },
    inspectionReport: {
      screenDisplay: 'Passed (Original OEM)',
      batteryHealth: 'Passed (>85% Capacity)',
      cameras: 'Passed (Front & Rear Dual/Triple)',
      biometrics: 'Passed (FaceID / Fingerprint tested)',
      chargingPort: 'Passed (Fast charging verified)',
      networkCalling: 'Passed (5G/4G/VoLTE tested)',
      bodyCondition: 'Minor polish wear on camera visor aluminium. Screen flawless.'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'refurb-nothing-phone-2',
    brand: 'Nothing',
    model: 'Phone (2)',
    title: 'Nothing Phone (2) (12GB/256GB, Dark Grey)',
    slug: 'nothing-phone-2-refurbished',
    conditionGrade: 'Superb (Like New)',
    color: 'Dark Grey',
    ram: '12GB',
    storage: '256GB',
    price: 26999,
    originalPrice: 44999,
    discountPercentage: 40,
    batteryHealthPercent: 95,
    warrantyMonths: 6,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80'
    ],
    keySpecs: {
      processor: 'Snapdragon 8+ Gen 1',
      display: '6.7" Flexible LTPO OLED, 120Hz',
      camera: '50MP Sony IMX890 + 50MP Samsung JN1',
      battery: '4700 mAh, Glyph Interface 2.0',
      os: 'Nothing OS 2.6',
      is5G: true
    },
    inspectionReport: {
      screenDisplay: 'Passed (Original OEM)',
      batteryHealth: 'Passed (>85% Capacity)',
      cameras: 'Passed (Front & Rear Dual/Triple)',
      biometrics: 'Passed (FaceID / Fingerprint tested)',
      chargingPort: 'Passed (Fast charging verified)',
      networkCalling: 'Passed (5G/4G/VoLTE tested)',
      bodyCondition: 'All 33 Glyph LED zones individually tested and fully working.'
    },
    inStock: true,
    featured: false
  }
];

export const INITIAL_REPAIR_SERVICES: RepairServiceItem[] = [
  {
    id: 'rep-iphone-13-screen',
    phoneBrand: 'Apple',
    phoneModel: 'iPhone 13 / 13 Pro',
    issueCategory: 'Screen Display',
    partQuality: 'Original OEM Spec',
    estimatedCost: 3899,
    marketPrice: 6500,
    repairTimeMinutes: 35,
    warrantyMonths: 6,
    doorstepAvailable: true,
    popular: true
  },
  {
    id: 'rep-iphone-14-battery',
    phoneBrand: 'Apple',
    phoneModel: 'iPhone 14 / 14 Plus',
    issueCategory: 'Battery Replacement',
    partQuality: 'Original OEM Spec',
    estimatedCost: 2499,
    marketPrice: 4200,
    repairTimeMinutes: 25,
    warrantyMonths: 12,
    doorstepAvailable: true,
    popular: true
  },
  {
    id: 'rep-samsung-s23-screen',
    phoneBrand: 'Samsung',
    phoneModel: 'Galaxy S23 / S22 Series',
    issueCategory: 'Screen Display',
    partQuality: 'Original OEM Spec',
    estimatedCost: 4999,
    marketPrice: 8500,
    repairTimeMinutes: 40,
    warrantyMonths: 6,
    doorstepAvailable: true,
    popular: true
  },
  {
    id: 'rep-oneplus-battery',
    phoneBrand: 'OnePlus',
    phoneModel: 'OnePlus 9 / 10 / 11 Series',
    issueCategory: 'Battery Replacement',
    partQuality: 'Original OEM Spec',
    estimatedCost: 1899,
    marketPrice: 3200,
    repairTimeMinutes: 20,
    warrantyMonths: 12,
    doorstepAvailable: true,
    popular: true
  },
  {
    id: 'rep-charging-port-gen',
    phoneBrand: 'Universal / All Brands',
    phoneModel: 'Type-C Fast Charging Port (Any Model)',
    issueCategory: 'Charging Port',
    partQuality: 'Premium Compatible',
    estimatedCost: 1199,
    marketPrice: 2000,
    repairTimeMinutes: 30,
    warrantyMonths: 6,
    doorstepAvailable: true,
    popular: true
  },
  {
    id: 'rep-back-glass-apple',
    phoneBrand: 'Apple',
    phoneModel: 'iPhone 12 / 13 / 14 / 15',
    issueCategory: 'Back Glass',
    partQuality: 'Original OEM Spec',
    estimatedCost: 2299,
    marketPrice: 3800,
    repairTimeMinutes: 45,
    warrantyMonths: 6,
    doorstepAvailable: true,
    popular: false
  },
  {
    id: 'rep-camera-lens-gen',
    phoneBrand: 'Universal / All Brands',
    phoneModel: 'Rear Camera Lens Glass Cracking',
    issueCategory: 'Camera Lens',
    partQuality: 'Original OEM Spec',
    estimatedCost: 899,
    marketPrice: 1500,
    repairTimeMinutes: 20,
    warrantyMonths: 6,
    doorstepAvailable: true,
    popular: false
  }
];

export const INITIAL_SAMPLE_BOOKINGS: DoorstepBooking[] = [
  {
    id: 'book-ds-8821',
    bookingNumber: 'MS-BLR-8821',
    userId: 'usr-demo-1',
    serviceCategory: 'sell',
    deviceTitle: 'Apple iPhone 13 (128GB, Midnight)',
    serviceDetails: 'Doorstep device physical inspection & instant UPI transfer. 32-point hardware scan.',
    city: 'Bengaluru',
    pincode: '560038',
    address: 'Flat 402, Green Glen Layout, Indiranagar',
    landmark: 'Near BDA Complex 100ft Road',
    customerName: 'Ishant Poptani',
    customerPhone: '+91 98765 43210',
    scheduledDate: 'Today (Express 90-Min Slot)',
    timeSlot: '04:30 PM - 06:00 PM',
    payoutMethod: 'UPI_GPAY',
    payoutUpiId: 'ishant@okhdfcbank',
    estimatedAmount: 26800,
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
        timestamp: 'Today, 03:15 PM',
        completed: true,
        description: 'Doorstep pickup request logged with guaranteed price lock of ₹26,800.'
      },
      {
        title: 'Technician Assigned',
        timestamp: 'Today, 03:22 PM',
        completed: true,
        description: 'Senior Field Specialist Rahul Sharma (#MS-TECH-BLR-048) allocated from Indiranagar Hub.'
      },
      {
        title: 'Technician En Route',
        timestamp: 'Estimated 04:45 PM',
        completed: false,
        description: 'Technician is carrying ESD testing kit and military-grade data wipe tool.'
      },
      {
        title: 'Doorstep 32-Point Diagnostic',
        timestamp: 'Pending Doorstep Arrival',
        completed: false,
        description: '15-minute quick testing: screen touch, battery health, cameras, calling.'
      },
      {
        title: 'Instant Payment Transfer',
        timestamp: 'Post Diagnostic',
        completed: false,
        description: 'Instant UPI transfer of ₹26,800 directly into your GPay account.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
