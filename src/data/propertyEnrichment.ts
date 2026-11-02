export interface BedroomDetail {
  id: string;
  roomLabel: string;
  title: string;
  description: string;
  bedConfig: string;
  bathroomAccess: string;
  image: string;
  facilities: string[];
}

export interface SeasonalPricingRule {
  id: string;
  label: string;
  startMonthDay: string; // MM-DD
  endMonthDay: string;   // MM-DD
  multiplier?: number;
  nightlyRateOverride?: number;
  appliesToExtended?: boolean;
  note?: string;
}

export interface BlockedDateRange {
  id: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  status: 'booked' | 'turnover' | 'reserved' | 'blocked';
  label?: string;
}

export interface NearbyPlaceItem {
  name: string;
  category: 'Dining' | 'Parks & Coastal' | 'Culture & Shopping' | 'Medical & Business';
  distance: string;
  description: string;
}

export interface PropertyLocationInfo {
  neighborhood: string;
  city: string;
  state: string;
  addressLine?: string;
  addressDisclosureRestricted: boolean;
  privacyNote?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  transitSummary?: string;
  directionsUrl?: string;
  nearbyAttractions: NearbyPlaceItem[];
}

export interface PropertyReviewRecord {
  id: string;
  propertyId: string;
  customerId?: string;
  authorName: string;
  authorRole?: string;
  stayContext?: string;
  rating: number;
  title?: string;
  content: string;
  verifiedBooking: boolean;
  createdAt: string;
}

export interface BookingAddonSelection {
  serviceId: string;
  title: string;
  category: string;
  unitPriceUsd: number;
  quantity: number;
  billingUnitLabel: string;
  lineTotalUsd: number;
}

export interface AvailabilityQuoteBreakdown {
  available: boolean;
  reason?: string;
  conflictingRange?: {
    start: string;
    end: string;
    label?: string;
  };
  propertyId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  infants: number;
  maxGuests: number;
  isExtendedTaxExempt: boolean;
  baseNightlyRateUsd: number;
  effectiveNightlyRateUsd: number;
  seasonalNote?: string;
  accommodationSubtotalUsd: number;
  addons: BookingAddonSelection[];
  addonsTotalUsd: number;
  serviceFeeUsd: number;
  taxRatePercent: number;
  taxUsd: number;
  subtotalBeforeTaxUsd: number;
  totalUsd: number;
  unitsRequired: number;
}

export const CONCIERGE_CATEGORIES = [
  'Airport Transportation',
  'Private Chauffeur',
  'Car Rentals',
  'Private Chef',
  'Housekeeping',
  'Grocery & Refrigerator Restocking',
  'Massage & Spa Treatments',
  'Yoga Sessions',
  'Wine Tasting',
  'Guided Hiking',
  'Surf Lessons',
  'Horseback Riding',
  'Additional Experiences',
] as const;

export type ConciergeCategoryName = (typeof CONCIERGE_CATEGORIES)[number];

interface EnrichablePropertyShape {
  id: string;
  code: string;
  unitNumber: string;
  slug: string;
  title: string;
  category?: string;
  shortDesc: string;
  fullDesc: string;
  bedrooms: number;
  bathrooms: number;
  floor: 'Downstairs' | 'Upstairs';
  location: string;
  images: string[];
  features: string[];
  amenities: string[];
  monthlyRate: number;
  startingRate: string;
  pricingNote?: string;
  status: 'Available' | 'Inquired' | 'Reserved';
  sqft?: string;
  liveUrl?: string;
  minimumStayDays?: number;
  maximumStayDays?: number;
  maxGuests?: number;
  propertyType?: string;
  verified?: boolean;
  facilities?: string[];
  videoTourUrl?: string;
  videoPosterUrl?: string;
  bedroomsDetail?: BedroomDetail[];
  seasonalPricing?: SeasonalPricingRule[];
  blockedDates?: BlockedDateRange[];
  locationInfo?: PropertyLocationInfo;
}

const DEFAULT_VIDEO_TOURS: Record<string, string> = {
  'unit-91': 'https://www.youtube.com/watch?v=X1BZWkGFV9c',
  'unit-173': 'https://www.youtube.com/watch?v=rOrM5xTcuU4',
  'unit-250': 'https://www.youtube.com/watch?v=46k-NuEegY0',
  'unit-333': 'https://www.youtube.com/watch?v=sekSKD_H2WM',
  'unit-335': 'https://www.youtube.com/watch?v=rOrM5xTcuU4',
};

const INITIAL_BLOCKED_SCHEDULES: Record<string, BlockedDateRange[]> = {
  'unit-91': [
    {
      id: 'blk_91_1',
      start: '2026-10-01',
      end: '2026-11-14',
      status: 'booked',
      label: 'Confirmed Guest Stay',
    },
    {
      id: 'blk_91_2',
      start: '2027-02-01',
      end: '2027-02-28',
      status: 'booked',
      label: 'Confirmed Extended Stay',
    },
  ],
  'unit-173': [
    {
      id: 'blk_173_1',
      start: '2027-01-11',
      end: '2027-03-31',
      status: 'booked',
      label: 'Confirmed Guest Stay',
    },
  ],
  'unit-250': [
    {
      id: 'blk_250_1',
      start: '2026-09-15',
      end: '2026-12-14',
      status: 'booked',
      label: 'Confirmed Guest Stay',
    },
    {
      id: 'blk_250_2',
      start: '2026-12-15',
      end: '2026-12-15',
      status: 'turnover',
      label: 'Residence Inspection & Refresh',
    },
  ],
  'unit-333': [
    {
      id: 'blk_333_1',
      start: '2026-09-01',
      end: '2026-11-30',
      status: 'booked',
      label: 'Confirmed Guest Stay',
    },
  ],
  'unit-335': [
    {
      id: 'blk_335_1',
      start: '2026-10-01',
      end: '2026-12-31',
      status: 'booked',
      label: 'Confirmed Guest Stay',
    },
    {
      id: 'blk_335_2',
      start: '2027-01-01',
      end: '2027-01-04',
      status: 'turnover',
      label: 'Turnover & Inspection',
    },
  ],
};

const EL_DORADO_HILLS_ATTRACTIONS: NearbyPlaceItem[] = [
  {
    name: 'Folsom Lake & American River Parkway Trails',
    category: 'Parks & Coastal',
    distance: '6 min drive',
    description: '32-mile paved cycling and walking corridor shaded by valley oaks, plus Folsom Lake & Lake Natoma kayaking nearby.',
  },
  {
    name: 'El Dorado Hills Town Center & Local Bistros',
    category: 'Dining',
    distance: '5–8 min drive',
    description: 'Waterfront Town Center dining favorites alongside Mimosa House brunch, Formaggio Taverna, and craft taprooms.',
  },
  {
    name: 'Folsom Historic District & Palladio Shopping',
    category: 'Culture & Shopping',
    distance: '12 min drive',
    description: 'Walkable Sutter Street dining, weekend farmers markets, live music venues, and open-air retail.',
  },
  {
    name: 'UC Davis Health, Kaiser Permanente & Business Parks',
    category: 'Medical & Business',
    distance: '10–20 min drive',
    description: 'Direct Highway 50 corridor access to El Dorado Hills, CA medical & corporate campuses, Folsom, and Rancho Cordova.',
  },
];

const MALIBU_ATTRACTIONS: NearbyPlaceItem[] = [
  {
    name: 'Zuma Beach, Broad Beach & Point Dume State Reserve',
    category: 'Parks & Coastal',
    distance: '2–8 min drive',
    description: 'Wide sandy Pacific shoreline, coastal bluff trails, tide pools, and seasonal whale-watching overlooks.',
  },
  {
    name: 'Nobu Malibu & Malibu Farm Pier Cafe',
    category: 'Dining',
    distance: '8–14 min drive',
    description: 'Oceanfront coastal dining along Pacific Coast Highway featuring local California produce and fresh seafood.',
  },
  {
    name: 'Malibu Country Mart & Getty Villa Museum',
    category: 'Culture & Shopping',
    distance: '10–22 min drive',
    description: 'Boutique coastal shopping, galleries, cafés, and classical coastal gardens along the Pacific Palisades border.',
  },
  {
    name: 'Santa Monica & LAX Private Aviation / Terminal Access',
    category: 'Medical & Business',
    distance: '28–45 min drive',
    description: 'Scenic Pacific Coast Highway connectivity to Santa Monica studios, UCLA Health, and Los Angeles International Airport.',
  },
];

const LOS_ANGELES_HILLS_ATTRACTIONS: NearbyPlaceItem[] = [
  {
    name: 'Sunset Strip, West Hollywood & Beverly Hills Dining',
    category: 'Dining',
    distance: '7–12 min drive',
    description: 'Acclaimed culinary destinations, rooftop lounges, and classic neighborhood cafés across Westside Los Angeles.',
  },
  {
    name: 'Runyon Canyon & Franklin Canyon Park Trails',
    category: 'Parks & Coastal',
    distance: '10–15 min drive',
    description: 'Scenic ridgeline hiking trails, reservoir nature walks, and panoramic overlooks spanning basin to ocean.',
  },
  {
    name: 'Rodeo Drive, Melrose Place & LACMA Museum Row',
    category: 'Culture & Shopping',
    distance: '12–18 min drive',
    description: 'Flagship fashion houses, design showrooms, contemporary galleries, and architectural landmarks.',
  },
  {
    name: 'Cedars-Sinai, UCLA Medical Center & Century City',
    category: 'Medical & Business',
    distance: '12–20 min drive',
    description: 'Convenient hillside access to major entertainment studios, Century City towers, and premier Westside hospitals.',
  },
];

function inferPropertyType(prop: EnrichablePropertyShape): string {
  if (prop.propertyType && prop.propertyType.trim()) return prop.propertyType.trim();
  const isSac = prop.id.startsWith('unit-');
  if (isSac) {
    return prop.floor === 'Downstairs'
      ? 'Ground-Floor Furnished Apartment'
      : 'Upper-Level Furnished Residence';
  }
  const locLower = prop.location.toLowerCase();
  if (locLower.includes('malibu') || prop.title.toLowerCase().includes('ocean')) {
    return 'Coastal Architectural Villa';
  }
  if (locLower.includes('bel-air') || locLower.includes('beverly')) {
    return 'Gated Executive Estate';
  }
  return 'Architectural Luxury Residence';
}

function inferMaxGuests(prop: EnrichablePropertyShape): number {
  if (typeof prop.maxGuests === 'number' && prop.maxGuests >= 1) {
    return prop.maxGuests;
  }
  if (prop.bedrooms <= 1) return 2;
  if (prop.bedrooms === 2) return 4;
  return Math.min(16, prop.bedrooms * 2);
}

function buildDefaultFacilities(prop: EnrichablePropertyShape): string[] {
  if (Array.isArray(prop.facilities) && prop.facilities.length > 0) {
    return prop.facilities;
  }
  const isSac = prop.id.startsWith('unit-');
  if (isSac) {
    const base = [
      'Reserved Covered Parking',
      'High-Speed 400+ Mbps Wi-Fi',
      'Full-Size Equipped Kitchen',
      'In-Unit Washer & Dryer',
      'Keyless Smart-Lock Entry',
      'Central Heating & Air Conditioning',
      'Wood-Burning Indoor Fireplace',
      prop.floor === 'Downstairs' ? 'Private Ground-Level Patio' : 'Private Sunlit Balcony',
    ];
    if (prop.id === 'unit-91') {
      base.push('Step-Free Ground-Floor Access');
    }
    if (prop.id === 'unit-173') {
      base.push('Pet-Friendly Option (On Approval)');
    }
    if (prop.id === 'unit-250' || prop.id === 'unit-335') {
      base.push('Community Pools, Heated Spa & Fitness Center');
    }
    return base;
  }

  const villaFacilities = [
    'Gated Private Driveway Parking',
    'Gigabit Fiber Wi-Fi',
    'Chef Kitchen with Professional Appliances',
    'In-Unit High-Capacity Laundry',
    'Keyless Smart-Lock Security Entry',
    'Multi-Zone Climate Control',
  ];
  const combinedText = `${prop.shortDesc} ${prop.fullDesc} ${prop.amenities.join(' ')}`.toLowerCase();
  if (combinedText.includes('pool') || combinedText.includes('spa')) {
    villaFacilities.push('Private Heated Pool & Whirlpool Spa');
  }
  if (combinedText.includes('beach') || combinedText.includes('ocean')) {
    villaFacilities.push('Coastal Terrace & Ocean Views');
  } else {
    villaFacilities.push('Outdoor Dining Terrace & Fire Feature');
  }
  return villaFacilities;
}

function buildDefaultBedrooms(prop: EnrichablePropertyShape): BedroomDetail[] {
  if (Array.isArray(prop.bedroomsDetail) && prop.bedroomsDetail.length > 0) {
    return prop.bedroomsDetail;
  }
  const imgs = Array.isArray(prop.images) && prop.images.length > 0 ? prop.images : [''];
  const count = Math.max(1, Math.round(prop.bedrooms || 1));
  const isSac = prop.id.startsWith('unit-');
  const rooms: BedroomDetail[] = [];

  for (let i = 0; i < count; i++) {
    const roomNum = i + 1;
    // Choose distinct interior photos from the actual property image array
    const preferredIdx =
      imgs.length > count + 2
        ? Math.min(imgs.length - 1, 2 + i * 2)
        : i % imgs.length;
    const roomImage = imgs[preferredIdx] || imgs[0] || '';

    if (isSac) {
      if (i === 0) {
        rooms.push({
          id: `${prop.id}-bed-1`,
          roomLabel: 'Bedroom 1',
          title: count === 1 ? 'Primary Queen Suite' : 'Primary Queen Bedroom Suite',
          description:
            count === 1
              ? 'Quiet residential bedroom dressed with 400–600 thread count cotton linens, blackout window treatments, and generous closet storage.'
              : 'Spacious primary suite separated from the main living area with a hotel-grade queen mattress, crisp cotton linens, Smart TV, and direct bathroom access.',
          bedConfig: '1 Queen Bed (Hotel-Grade Mattress)',
          bathroomAccess: count > 1 ? 'Private En-Suite Full Bathroom' : 'Adjacent Full Private Bathroom',
          image: roomImage,
          facilities: [
            '400–600 Thread Count Linens',
            'Blackout Curtains',
            'Full Closet & Hangers',
            prop.id === 'unit-333' || prop.id === 'unit-173' ? '43-inch Smart TV' : 'Bedside Reading Lamps & Charging',
            'Central Climate Vents',
          ],
        });
      } else {
        rooms.push({
          id: `${prop.id}-bed-${roomNum}`,
          roomLabel: `Bedroom ${roomNum}`,
          title: 'Second Queen Guest Suite & Workspace',
          description:
            'Well-separated second bedroom ideal for family members, visiting colleagues, or dual-purpose guest sleeping and quiet remote work.',
          bedConfig: '1 Queen Bed',
          bathroomAccess: 'Dedicated Hallway Full Bathroom',
          image: roomImage,
          facilities: [
            '400–600 Thread Count Linens',
            'Generous Closet Storage',
            prop.id === 'unit-333' ? 'Dedicated 43-inch Smart TV' : 'Quiet Courtyard Orientation',
            'High-Speed Wi-Fi Coverage',
          ],
        });
      }
    } else {
      const isPrimary = i === 0;
      const isSecondaryKing = i === 1 || i === 2;
      rooms.push({
        id: `${prop.id}-bed-${roomNum}`,
        roomLabel: `Bedroom ${roomNum}`,
        title: isPrimary
          ? 'Primary Architectural King Suite'
          : isSecondaryKing
          ? `Guest King Suite ${roomNum}`
          : `Queen Guest Suite ${roomNum}`,
        description: isPrimary
          ? 'Expansive primary retreat featuring custom millwork, lounge seating, motorized privacy shades, and a spa-inspired en-suite bath.'
          : 'Private guest bedroom suite appointed with luxury linens, dedicated climate zone control, Smart TV, and ample wardrobe space.',
        bedConfig: isPrimary || isSecondaryKing ? '1 California King Bed' : '1 Queen Bed',
        bathroomAccess:
          roomNum <= Math.floor(prop.bathrooms) ? 'Private En-Suite Bathroom' : 'Shared Designer Full Bathroom',
        image: roomImage,
        facilities: isPrimary
          ? [
              'Spa Soaking Tub & Walk-In Shower',
              'Motorized Blackout Shades',
              'Walk-In Wardrobe',
              'Smart TV & Sonos Audio',
              'Private Terrace or Garden Outlook',
            ]
          : [
              'Luxury Cotton Bedding',
              'Dedicated Climate Zone',
              'Smart TV',
              'Wardrobe Storage',
            ],
      });
    }
  }

  return rooms;
}

function buildDefaultSeasonalPricing(prop: EnrichablePropertyShape): SeasonalPricingRule[] {
  if (Array.isArray(prop.seasonalPricing)) {
    return prop.seasonalPricing;
  }
  return [
    {
      id: `${prop.id}-season-summer`,
      label: 'Summer Peak Travel (Jun – Aug)',
      startMonthDay: '06-01',
      endMonthDay: '08-31',
      multiplier: 1.12,
      appliesToExtended: false,
      note: 'Applies to short stays under 30 nights; 30+ day extended leases lock in standard monthly pricing.',
    },
    {
      id: `${prop.id}-season-holiday`,
      label: 'Year-End Holiday Window (Dec 18 – Jan 03)',
      startMonthDay: '12-18',
      endMonthDay: '01-03',
      multiplier: 1.15,
      appliesToExtended: false,
      note: 'Holiday short-stay adjustment; 30+ day residential stays remain tax-exempt at monthly base rate.',
    },
  ];
}

function extractExactAddress(prop: EnrichablePropertyShape): string | undefined {
  for (const feat of prop.features || []) {
    if (feat.toLowerCase().startsWith('exact address:')) {
      return feat.slice('exact address:'.length).trim();
    }
  }
  if (prop.location.includes('·')) {
    const parts = prop.location.split('·').map((s) => s.trim());
    if (parts[1]) return parts[1];
  }
  return undefined;
}

function buildDefaultLocationInfo(prop: EnrichablePropertyShape): PropertyLocationInfo {
  if (prop.locationInfo) {
    return prop.locationInfo;
  }
  const isEdh = prop.id.startsWith('unit-');
  if (isEdh) {
    const lat = 38.6857;
    const lng = -121.076;
    return {
      neighborhood: 'El Dorado Hills / Gold Country Foothills Corridor',
      city: 'El Dorado Hills',
      state: 'CA',
      addressLine: 'El Dorado Hills Residential Community, El Dorado Hills, CA 95762',
      addressDisclosureRestricted: true,
      privacyNote:
        'For resident security and community privacy, exact building number, gate code, and smart-lock instructions are released upon confirmed booking.',
      coordinates: { lat, lng },
      transitSummary:
        '3 minutes to US-50 • 5 minutes to El Dorado Hills, CA Town Center • 32 minutes to SMF International Airport.',
      directionsUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`,
      nearbyAttractions: EL_DORADO_HILLS_ATTRACTIONS,
    };
  }

  const locLower = prop.location.toLowerCase();
  const exactAddr = extractExactAddress(prop);
  const isMalibu = locLower.includes('malibu');
  const isBelAir = locLower.includes('bel-air');
  const isBeverly = locLower.includes('beverly');
  const isHollywood = locLower.includes('hollywood');

  const city = isMalibu
    ? 'Malibu'
    : isBeverly
    ? 'Beverly Hills'
    : 'Los Angeles';

  const neighborhood = isMalibu
    ? 'Malibu Coastal Corridor (PCH / Broad Beach & Colony)'
    : isBelAir
    ? 'Bel-Air Stone Gate Enclave'
    : isBeverly
    ? 'Beverly Hills Hillside Corridor'
    : isHollywood
    ? 'Hollywood Hills Skyline Enclave'
    : 'Westside & Hills Luxury Collection';

  const coords = isMalibu
    ? { lat: 34.0359, lng: -118.6923 }
    : isBelAir
    ? { lat: 34.0837, lng: -118.4478 }
    : isBeverly
    ? { lat: 34.0901, lng: -118.4065 }
    : { lat: 34.1066, lng: -118.3742 };

  return {
    neighborhood,
    city,
    state: 'CA',
    addressLine: exactAddr || `${neighborhood}, ${city}, CA`,
    addressDisclosureRestricted: true,
    privacyNote:
      'To protect guest privacy at our gated estates, arrival gate credentials and exact entry instructions are provided exclusively to confirmed guests prior to check-in.',
    coordinates: coords,
    transitSummary: isMalibu
      ? 'Direct Pacific Coast Highway access • 25 minutes to Santa Monica • 42 minutes to LAX & Van Nuys Private Aviation.'
      : '10 minutes to Sunset Boulevard • 20 minutes to Century City • 35 minutes to LAX & Burbank Bob Hope Airport.',
    directionsUrl: `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=13/${coords.lat}/${coords.lng}`,
    nearbyAttractions: isMalibu ? MALIBU_ATTRACTIONS : LOS_ANGELES_HILLS_ATTRACTIONS,
  };
}

export function enrichPropertyRecord<T extends EnrichablePropertyShape>(prop: T): T & {
  maxGuests: number;
  propertyType: string;
  verified: boolean;
  minimumStayDays: number;
  maximumStayDays: number;
  facilities: string[];
  bedroomsDetail: BedroomDetail[];
  seasonalPricing: SeasonalPricingRule[];
  blockedDates: BlockedDateRange[];
  locationInfo: PropertyLocationInfo;
} {
  const hasExplicitVideo = prop.videoTourUrl !== undefined;
  const videoTourUrl = hasExplicitVideo
    ? prop.videoTourUrl || undefined
    : DEFAULT_VIDEO_TOURS[prop.id];

  const videoPosterUrl =
    prop.videoPosterUrl !== undefined
      ? prop.videoPosterUrl || undefined
      : videoTourUrl
      ? prop.images?.[0]
      : undefined;

  return {
    ...prop,
    minimumStayDays: prop.minimumStayDays && prop.minimumStayDays >= 1 ? prop.minimumStayDays : 5,
    maximumStayDays: prop.maximumStayDays && prop.maximumStayDays >= 5 ? prop.maximumStayDays : 365,
    maxGuests: inferMaxGuests(prop),
    propertyType: inferPropertyType(prop),
    verified: prop.verified !== undefined ? Boolean(prop.verified) : true,
    facilities: buildDefaultFacilities(prop),
    videoTourUrl,
    videoPosterUrl,
    bedroomsDetail: buildDefaultBedrooms(prop),
    seasonalPricing: buildDefaultSeasonalPricing(prop),
    blockedDates: Array.isArray(prop.blockedDates)
      ? prop.blockedDates
      : INITIAL_BLOCKED_SCHEDULES[prop.id] || [],
    locationInfo: buildDefaultLocationInfo(prop),
  };
}
