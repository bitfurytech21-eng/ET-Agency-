import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashPassword } from '../auth.js';
import { defaultProperties } from '../data/seed.js';
import {
  AvailabilityQuoteBreakdown,
  BlockedDateRange,
  BookingAddonSelection,
  PropertyReviewRecord,
  SeasonalPricingRule,
  enrichPropertyRecord,
} from '../../src/data/propertyEnrichment.js';
import type {
  AuditLogRecord,
  BookingRecord,
  BookingStatus,
  CartItemMetadata,
  CartItemRecord,
  CartRecord,
  CatalogItemType,
  CatalogServiceItem,
  DatabaseState,
  InquiryRecord,
  ManualPaymentRecord,
  NotificationRecord,
  OrderRecord,
  PaymentAccountConfig,
  PaymentRecord,
  PromoCodeRecord,
  PropertyRecord,
  SupportTicketRecord,
  UserRecord,
  VehicleBookingRecord,
  VehicleBookingStatus,
  VehicleInventoryRecord,
  VehicleInventoryStatus,
} from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const canonicalDataDir = path.join(__dirname, '..', '..', 'data');
const canonicalDbFile = path.join(canonicalDataDir, 'db.json');
const legacyServerDbFile = path.join(__dirname, '..', 'data', 'db.json');

const defaultUsers: UserRecord[] = [
  {
    id: 'usr_admin_official',
    email: 'easytravelagency@trustagent.space',
    passwordHash: hashPassword('admin12345'),
    name: 'Bill Wheelock & Dr. Marlena Uhrik',
    role: 'admin',
    createdAt: '2026-01-15T16:00:00.000Z',
    isActive: true,
  },
  {
    id: 'usr_admin_01',
    email: 'admin@easytravellodging.com',
    passwordHash: hashPassword('admin12345'),
    name: 'Bill Wheelock & Dr. Marlena Uhrik',
    role: 'admin',
    createdAt: '2026-01-15T16:00:00.000Z',
    isActive: true,
  },
  {
    id: 'usr_staff_01',
    email: 'concierge@easytravellodging.com',
    passwordHash: hashPassword('staff12345'),
    name: 'Sacramento Housing Operations',
    role: 'staff',
    createdAt: '2026-02-01T16:00:00.000Z',
    isActive: true,
  },
  ...(process.env.ADMIN_EMAIL &&
  process.env.ADMIN_EMAIL.toLowerCase().trim() !== 'admin@easytravellodging.com'
    ? [
        {
          id: 'usr_admin_env',
          email: process.env.ADMIN_EMAIL.trim(),
          passwordHash: hashPassword('admin12345'),
          name: 'Platform Administrator',
          role: 'admin' as const,
          createdAt: '2026-01-15T16:00:00.000Z',
          isActive: true,
        },
      ]
    : []),
];

const defaultVehicles: VehicleInventoryRecord[] = [
  {
    id: 'nissan-terra-2020',
    name: 'Nissan Terra 2020',
    make: 'Nissan',
    category: '7-Passenger Rugged 4x4 SUV',
    year: 2020,
    licensePlate: '9ETL501',
    mileage: 18450,
    hubLocation: 'SMF Airport Concierge Terminal B',
    dailyRate: 125,
    weeklyRate: 740,
    monthlyRate: 2450,
    inventoryStatus: 'available',
    maintenanceLogs: [
      {
        id: 'mnt_101',
        serviceType: 'Multi-Point 4WD & Brake Inspection',
        notes: 'Transfer case fluid flushed, all-terrain tires inspected at 9mm tread.',
        costUsd: 195,
        date: '2026-10-15T18:00:00.000Z',
        performedBy: 'Sacramento Nissan Fleet Care',
      },
    ],
  },
  {
    id: 'skoda-karoq-2019',
    name: '2019 Skoda Karoq',
    make: 'Skoda',
    category: 'European Executive Compact Crossover',
    year: 2019,
    licensePlate: '9ETL882',
    mileage: 22100,
    hubLocation: 'Rancho Cordova Suite Delivery Hub',
    dailyRate: 95,
    weeklyRate: 560,
    monthlyRate: 1890,
    inventoryStatus: 'available',
    maintenanceLogs: [
      {
        id: 'mnt_102',
        serviceType: 'DSG Dual-Clutch & Cabin Filter Service',
        notes: 'Transmission recalibrated, AC allergen filter renewed.',
        costUsd: 165,
        date: '2026-10-18T17:30:00.000Z',
        performedBy: 'European Auto Specialists Sacramento',
      },
    ],
  },
  {
    id: 'audi-a3-2021',
    name: 'Audi A3 2021',
    make: 'Audi',
    category: 'Luxury Compact Executive Sport Sedan',
    year: 2021,
    licensePlate: '9ETL710',
    mileage: 14200,
    hubLocation: 'SMF Airport / Rancho Cordova Executive Hub',
    dailyRate: 115,
    weeklyRate: 680,
    monthlyRate: 2250,
    inventoryStatus: 'available',
    maintenanceLogs: [],
  },
  {
    id: 'vw-jetta-gli',
    name: 'Volkswagen Jetta GLI',
    make: 'Volkswagen',
    category: 'Sport Performance Turbocharged Sedan',
    year: 2022,
    licensePlate: '9ETL999',
    mileage: 11300,
    hubLocation: 'Sacramento Executive Chauffeur Bay',
    dailyRate: 105,
    weeklyRate: 620,
    monthlyRate: 2050,
    inventoryStatus: 'available',
    maintenanceLogs: [
      {
        id: 'mnt_103',
        serviceType: 'DCC Adaptive Suspension & Performance Alignment',
        notes: 'Full performance alignment and brake fluid flush.',
        costUsd: 210,
        date: '2026-10-22T15:00:00.000Z',
        performedBy: 'Niello Volkswagen Service Sacramento',
      },
    ],
  },
  {
    id: 'audi-rs5-2019',
    name: 'Audi RS5 2019',
    make: 'Audi',
    category: 'High-Performance Twin-Turbo Sportback',
    year: 2019,
    licensePlate: '9ETL404',
    mileage: 16800,
    hubLocation: 'Rancho Cordova Suite Delivery Hub',
    dailyRate: 175,
    weeklyRate: 1050,
    monthlyRate: 3600,
    inventoryStatus: 'available',
    maintenanceLogs: [],
  },
];

const defaultPaymentAccounts: PaymentAccountConfig = {
  bankName: process.env.PAYMENT_BANK_NAME || 'Associated Bank',
  accountName: process.env.PAYMENT_ACCOUNT_NAME || 'Heather Frederick',
  accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER || '2913762643',
  achRoutingNumber: process.env.PAYMENT_ROUTING_NUMBER || '075900575',
  wireRoutingNumber: '075900575',
  swiftCode: process.env.PAYMENT_WIRE_SWIFT || 'ASBDUS44',
  bankAddress: '400 S Chestnut Ave, Marshfield, WI 54449, USA',
  zelleEmail: process.env.PAYMENT_ZELLE || 'easytravelagency@trustagent.space',
  zelleRecipient: 'Heather Frederick — Associated Bank Checking Account',
  paymentInstructions:
    'Include your Registered Account Email or Reservation Reference Code in the wire/ACH memo field. Upload your transfer confirmation receipt so our treasury team can verify and credit your account within 2–4 business hours.',
  updatedAt: new Date().toISOString(),
};

function buildDefaultBookings(): BookingRecord[] {
  return [];
}

function buildDefaultVehicleBookings(): VehicleBookingRecord[] {
  return [];
}

function buildDefaultManualPayments(): ManualPaymentRecord[] {
  return [];
}

function buildDefaultPayments(): PaymentRecord[] {
  return [];
}

function buildDefaultNotifications(): NotificationRecord[] {
  return [];
}

function buildDefaultAuditLogs(): AuditLogRecord[] {
  return [];
}

export const VEHICLE_THUMBNAILS: Record<string, string> = {
  'nissan-terra-2020': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  'skoda-karoq-2019': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
  'audi-a3-2021': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
  'vw-jetta-gli': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
  'audi-rs5-2019': 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=80',
  'ford-mustang-gt': 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=80',
  'tesla-model-y': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
  'chevy-suburban': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  'cadillac-escalade': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
  'jeep-wrangler': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
};

const defaultCatalogItems: CatalogServiceItem[] = [
  {
    id: 'srv-airport-chauffeur',
    sku: 'ETL-SRV-AIRPORT',
    itemType: 'addon_service',
    category: 'Airport Transportation',
    title: 'Private Airport Meet-and-Greet & Residence Transfer',
    shortDesc:
      'Direct private pickup from SMF or LAX to your residence with flight tracking, luggage assistance, and smart-lock check-in.',
    fullDesc:
      'Skip rideshare queues after your flight. Our local concierge tracks your arrival, meets you curbside at the terminal, assists with luggage, and delivers you directly to your prepared residence.',
    priceUsd: 145,
    billingUnitLabel: 'per transfer',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4864.jpg',
    available: true,
    maxQuantity: 6,
    featured: true,
    highlights: [
      'Real-time flight tracking for terminal arrivals',
      'Direct drop-off at your residence with keycode walkthrough',
      'Accommodates up to 4 passengers and full luggage',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-private-chauffeur',
    sku: 'ETL-SRV-CHAUFFEUR',
    itemType: 'addon_service',
    category: 'Private Chauffeur',
    title: 'Dedicated Executive Chauffeur (4-Hour Charter)',
    shortDesc:
      'Private professional driver and executive sedan or SUV at your disposal for meetings, dining, or regional appointments.',
    fullDesc:
      'Travel effortlessly between appointments, dinners, or coastal excursions with a dedicated chauffeur familiar with Sacramento and Greater Los Angeles corridors.',
    priceUsd: 380,
    billingUnitLabel: 'per 4-hour block',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
    available: true,
    maxQuantity: 10,
    featured: true,
    highlights: [
      'Licensed executive driver with door-to-door itinerary coordination',
      'Complimentary chilled water and cabin Wi-Fi',
      'Flexible multi-stop scheduling',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-car-rental-valet',
    sku: 'ETL-SRV-FLEETVALET',
    itemType: 'addon_service',
    category: 'Car Rentals',
    title: 'Doorstep Rental Vehicle Delivery & Return Valet',
    shortDesc:
      'Have your reserved Easy Travel Lodging fleet vehicle delivered to your residence driveway prior to arrival and collected at checkout.',
    fullDesc:
      'Pair any vehicle from our fleet with white-glove doorstep delivery and post-stay retrieval so keys are waiting inside your residence upon check-in.',
    priceUsd: 95,
    billingUnitLabel: 'per round-trip delivery',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    available: true,
    maxQuantity: 4,
    featured: false,
    highlights: [
      'Vehicle staged in your reserved parking space before check-in',
      'Full tank / full charge inspection included',
      'Contactless return collection on departure morning',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-private-chef',
    sku: 'ETL-SRV-CHEF',
    itemType: 'addon_service',
    category: 'Private Chef',
    title: 'In-Residence Private Chef Seasonal Dinner (Up to 4 Guests)',
    shortDesc:
      'Custom three-course California market menu prepared in your residence kitchen, including table service and complete kitchen cleanup.',
    fullDesc:
      'Host an intimate family dinner or executive gathering without leaving home. Our partnered culinary team sources regional produce, prepares a tailored three-course menu, and leaves your kitchen spotless.',
    priceUsd: 340,
    billingUnitLabel: 'per dinner service',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-2_kitchen_sink.jpg',
    available: true,
    maxQuantity: 8,
    featured: true,
    highlights: [
      'Pre-arrival menu consultation for dietary preferences',
      'Fresh farmers-market ingredients, plating, and service',
      'Complete cookware and kitchen cleanup included',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-midstay-refresh',
    sku: 'ETL-SRV-CLEAN',
    itemType: 'addon_service',
    category: 'Housekeeping',
    title: 'Scheduled Mid-Stay Housekeeping & Linen Refresh',
    shortDesc:
      'Complete residence cleaning, fresh 400–600 thread count cotton linens, plush towel replacement, and bath/kitchen restocking.',
    fullDesc:
      'Keep your residence crisp throughout a multi-week or multi-month stay. Our local housekeeping team coordinates a convenient daytime window to clean living spaces and refresh all bedding and bath towels.',
    priceUsd: 165,
    billingUnitLabel: 'per session',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2936.jpg',
    available: true,
    maxQuantity: 12,
    featured: false,
    highlights: [
      'Full kitchen, bath, and living area detailing',
      'Freshly laundered sheet sets and bath towels',
      'Flexible daytime scheduling around household or work hours',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-kitchen-provisioning',
    sku: 'ETL-SRV-PANTRY',
    itemType: 'addon_service',
    category: 'Grocery & Refrigerator Restocking',
    title: 'Arrival Grocery & Refrigerator Pre-Stocking',
    shortDesc:
      'Arrive to a stocked refrigerator and pantry—local roast coffee, organic breakfast staples, seasonal fruit, sparkling water, and snacks.',
    fullDesc:
      'Settle in immediately without a first-night grocery run. Our concierge stocks fresh produce, dairy or plant-based staples, artisan bakery items, coffee, and beverages hours before you unlock the door.',
    priceUsd: 135,
    billingUnitLabel: 'per provisioning',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_103.jpg',
    available: true,
    maxQuantity: 6,
    featured: true,
    highlights: [
      'Local California roast coffee, teas, and chilled beverages',
      'Fresh seasonal produce, eggs, bread, and snacks',
      'Custom grocery list notes supported at booking',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-massage-spa',
    sku: 'ETL-SRV-SPA',
    itemType: 'addon_service',
    category: 'Massage & Spa Treatments',
    title: 'In-Residence Therapeutic Massage & Wellness Session',
    shortDesc:
      '75-minute licensed Swedish, deep-tissue, or recovery massage with portable spa table, heated linens, and organic botanical oils.',
    fullDesc:
      'Unwind after travel or long project days in the privacy of your residence. A licensed massage therapist arrives with a professional table, fresh spa linens, and calming aromatherapy.',
    priceUsd: 195,
    billingUnitLabel: 'per 75-min session',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc_bathroom.jpg',
    available: true,
    maxQuantity: 8,
    featured: false,
    highlights: [
      'Certified California massage practitioner',
      'Choice of Swedish relaxation or deep-tissue recovery',
      'All spa equipment and organic linens provided',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-yoga-session',
    sku: 'ETL-SRV-YOGA',
    itemType: 'addon_service',
    category: 'Yoga Sessions',
    title: 'Private Patio or Living Room Yoga & Mobility Session',
    shortDesc:
      '60-minute private Vinyasa, restorative yoga, or guided breathwork session tailored to 1–4 guests, mats and props included.',
    fullDesc:
      'Start your morning on the patio, terrace, or sunlit living room with a certified yoga instructor guiding a personalized flow suited to all experience levels.',
    priceUsd: 150,
    billingUnitLabel: 'per 60-min session',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2932.jpg',
    available: true,
    maxQuantity: 10,
    featured: false,
    highlights: [
      'Sanitized Manduka mats and cork blocks provided',
      'Tailored for solo guests, couples, or small groups',
      'Morning or sunset scheduling options',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-wine-tasting',
    sku: 'ETL-SRV-WINE',
    itemType: 'addon_service',
    category: 'Wine Tasting',
    title: 'Private California Vineyard Sommelier Tasting',
    shortDesc:
      'Guided tasting of four boutique Napa, Sonoma, Lodi, and Santa Barbara wines with artisanal cheese and charcuterie pairing.',
    fullDesc:
      'Explore California’s premier viticultural regions from your dining room or terrace. Includes stemware, four curated reserve pours, tasting notes, and a local artisan charcuterie board.',
    priceUsd: 240,
    billingUnitLabel: 'per tasting group',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_117.jpg',
    available: true,
    maxQuantity: 4,
    featured: false,
    highlights: [
      'Four small-lot California estate varietals',
      'Artisanal cheese, olive, and charcuterie accompaniment',
      'Crystal tasting stemware delivery and pickup',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-guided-hiking',
    sku: 'ETL-SRV-HIKE',
    itemType: 'addon_service',
    category: 'Guided Hiking',
    title: 'Private Guided Canyon, Bluff or Parkway Trail Excursion',
    shortDesc:
      'Half-day private guided hike along the Sierra foothills, American River bluffs, or Santa Monica Mountains with trail refreshments.',
    fullDesc:
      'Discover scenic local trails matched to your pace with an experienced outdoor naturalist guide, including trailhead coordination, hydration packs, and regional ecology insights.',
    priceUsd: 175,
    billingUnitLabel: 'per excursion',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1684.jpg',
    available: true,
    maxQuantity: 6,
    featured: false,
    highlights: [
      'Custom route difficulty from gentle riverside walk to ridge ascent',
      'Includes trail snacks, electrolyte hydration, and daypacks',
      'Private group for up to 4 guests',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-surf-lessons',
    sku: 'ETL-SRV-SURF',
    itemType: 'addon_service',
    category: 'Surf Lessons',
    title: 'Private Coastal Surf Lesson & Wetsuit Provisioning',
    shortDesc:
      '90-minute 1-on-1 or couples surf coaching session (Malibu coastline) or Lake Natoma paddleboard clinic with boards and wetsuits.',
    fullDesc:
      'Learn ocean wave reading and pop-up technique along Malibu’s iconic point breaks—or enjoy a calm flatwater stand-up paddleboard lesson in Northern California—all gear provided.',
    priceUsd: 185,
    billingUnitLabel: 'per 90-min lesson',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    available: true,
    maxQuantity: 6,
    featured: false,
    highlights: [
      'CPR-certified surf & water safety instructor',
      'Soft-top surfboard or paddleboard plus fitted wetsuit included',
      'Beginner through intermediate progression',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-horseback-riding',
    sku: 'ETL-SRV-EQUESTRIAN',
    itemType: 'addon_service',
    category: 'Horseback Riding',
    title: 'Guided Canyon or River Valley Equestrian Trail Ride',
    shortDesc:
      '90-minute small-group or private horseback trail ride through oak-studded foothills or coastal canyon overlooks.',
    fullDesc:
      'Enjoy a peaceful guided horseback ride suited to first-time and experienced riders alike, featuring gentle trail horses, safety helmets, and panoramic California vistas.',
    priceUsd: 210,
    billingUnitLabel: 'per rider session',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5339.jpg',
    available: true,
    maxQuantity: 6,
    featured: false,
    highlights: [
      'Matched trail horses and full riding tack provided',
      'Led by seasoned ranch wranglers',
      'Scenic morning and golden-hour departures',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-remote-workstation',
    sku: 'ETL-SRV-DESK',
    itemType: 'addon_service',
    category: 'Additional Experiences',
    title: 'Ergonomic Dual-Monitor Home Office Package',
    shortDesc:
      '27-inch QHD monitor, ergonomic task chair, USB-C docking station, wireless keyboard/mouse, and desk lamp installed before arrival.',
    fullDesc:
      'Turn your residence into a productive executive office from day one. Set up and cable-managed prior to check-in for remote professionals, consultants, and visiting faculty.',
    priceUsd: 180,
    billingUnitLabel: 'per stay',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_115.jpg',
    available: true,
    maxQuantity: 4,
    featured: true,
    highlights: [
      '27-inch QHD display with universal USB-C & HDMI hub',
      'Adjustable lumbar office chair & task lighting',
      'Pre-installed and tested prior to arrival',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-pet-comfort',
    sku: 'ETL-SRV-PET',
    itemType: 'addon_service',
    category: 'Additional Experiences',
    title: 'Approved Pet Welcome & Post-Stay Deep Sanitization',
    shortDesc:
      'Covers pet registration for approved residences, washable orthopedic pet bed, stainless bowls, and post-checkout allergen detailing.',
    fullDesc:
      'Bringing an approved pet along? Includes stainless food and water bowls, a clean orthopedic mat, neighborhood walk guide, and required post-stay HEPA allergen detailing.',
    priceUsd: 225,
    billingUnitLabel: 'per stay',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3271.jpg',
    available: true,
    maxQuantity: 2,
    featured: false,
    highlights: [
      'Valid for pre-approved pet-friendly residences',
      'Includes bowls, washable mat, and local park guide',
      'Covers comprehensive post-stay allergen sanitization',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'pkg-units-10',
    sku: 'ETL-UNITS-10',
    itemType: 'unit_package',
    category: 'Prepaid Lodging Units',
    title: '10 Lodging Units Flex Package ($1,000 Credit Value)',
    shortDesc:
      'Prepaid allotment of 10 Lodging Units ($1,000 USD value) redeemable toward any residence stay, fleet rental, or extension.',
    fullDesc:
      'Ideal for frequent regional visitors, families planning upcoming stays, or organizations managing travel budgets. Each Lodging Unit carries a fixed $100 USD redemption value in the Client Portal with no expiration fees.',
    priceUsd: 1000,
    billingUnitLabel: 'per 10-unit pack',
    unitsIncluded: 10,
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg',
    available: true,
    maxQuantity: 10,
    featured: true,
    highlights: [
      '10 Lodging Units ($1,000.00 USD direct booking value)',
      'Redeemable across furnished suites and 3D fleet rentals',
      'Credited automatically upon payment verification',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'pkg-units-25',
    sku: 'ETL-UNITS-25',
    itemType: 'unit_package',
    category: 'Prepaid Lodging Units',
    title: '25 Lodging Units Extended-Stay Package ($2,500 Credit Value)',
    shortDesc:
      'Full-month equivalent allotment of 25 Lodging Units ($2,500 USD value) for relocations, extended stays, or corporate housing accounts.',
    fullDesc:
      'Designed for full-month stays, insurance housing coordinators, and corporate travel departments. Purchase 25 Lodging Units ($2,500 USD credit) under a single consolidated invoice and allocate stays on demand.',
    priceUsd: 2500,
    billingUnitLabel: 'per 25-unit pack',
    unitsIncluded: 25,
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5342.jpg',
    available: true,
    maxQuantity: 10,
    featured: true,
    highlights: [
      '25 Lodging Units ($2,500.00 USD direct booking value)',
      'Covers a full month in a 1-bedroom residence or multi-week fleet use',
      'Consolidated receipt for personal, relocation, or employer reimbursement',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
];

const defaultReviews: PropertyReviewRecord[] = [
  {
    id: 'rev_seed_91_1',
    propertyId: 'unit-91',
    authorName: 'Stacy S.',
    authorRole: 'Traveling Healthcare Specialist',
    stayContext: 'Extended Healthcare Assignment',
    rating: 5,
    title: 'Spotless, quiet ground-floor suite after 12-hour shifts',
    content:
      'My stay with Easy Travel Lodging in Rancho Cordova was hands down the best experience I have had while traveling for work. Bill and Marlena made sure everything was ready for arrival, right down to the welcome basket and starter laundry supplies. Having an in-unit washer/dryer and reserved covered parking right outside made daily life effortless.',
    verifiedBooking: true,
    createdAt: '2026-08-14T18:20:00.000Z',
  },
  {
    id: 'rev_seed_173_1',
    propertyId: 'unit-173',
    authorName: 'Michael T.',
    authorRole: 'IT Systems Architect',
    stayContext: '4-Month Project Assignment',
    rating: 5,
    title: 'Fast Wi-Fi, comfortable workspace, and zero utility billing hassle',
    content:
      'Hotel rooms wear thin quickly on multi-month contracts. Residence B offered a calm living space, consistent 400+ Mbps internet for remote engineering calls, and a private fenced patio. The arrival starter kit saved me from running errands on night one.',
    verifiedBooking: true,
    createdAt: '2026-09-02T15:10:00.000Z',
  },
  {
    id: 'rev_seed_250_1',
    propertyId: 'unit-250',
    authorName: 'Jayda F.',
    authorRole: 'Relocating Homeowner',
    stayContext: '90-Day Closing Bridge Stay',
    rating: 5,
    title: 'Genuinely felt like home while waiting for our Sacramento closing',
    content:
      'Residence C gave our family breathing room while we waited for our new home to close. Having two separated bedrooms and two full baths with vaulted ceilings felt bright and uncrowded, and Bill was always responsive whenever we had a question.',
    verifiedBooking: true,
    createdAt: '2026-09-19T19:45:00.000Z',
  },
  {
    id: 'rev_seed_333_1',
    propertyId: 'unit-333',
    authorName: 'Joanne H.',
    authorRole: 'Visiting Consultant',
    stayContext: '60-Day Extended Stay',
    rating: 5,
    title: 'Thoughtful details from crisp cotton linens to a stocked kitchen',
    content:
      'The attention to detail in Unit 333 stood out immediately—from 400+ thread count sheets and Smart TVs in both bedrooms to the stone counters, Instant Pot, and Keurig in the kitchen. Quiet community hours and pool access made a two-month stay genuinely restful.',
    verifiedBooking: true,
    createdAt: '2026-10-04T17:05:00.000Z',
  },
];

const defaultPromoCodes: PromoCodeRecord[] = [
  {
    id: 'prm_welcome10',
    code: 'WELCOME10',
    description: '10% savings on reservations and service orders of $200+ (up to $350 max discount)',
    discountType: 'percentage',
    discountValue: 10,
    minSubtotalUsd: 200,
    maxDiscountUsd: 350,
    active: true,
    usageCount: 4,
    createdAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'prm_extended250',
    code: 'EXTENDED250',
    description: '$250 off extended-stay residence or multi-item bookings of $2,500+',
    discountType: 'fixed',
    discountValue: 250,
    minSubtotalUsd: 2500,
    active: true,
    usageCount: 2,
    createdAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'prm_fleet50',
    code: 'FLEET50',
    description: '$50 savings on vehicle rentals or add-on bundles of $500+',
    discountType: 'fixed',
    discountValue: 50,
    minSubtotalUsd: 500,
    active: true,
    usageCount: 3,
    createdAt: '2026-10-01T16:00:00.000Z',
  },
];

function buildDefaultOrders(): OrderRecord[] {
  return [];
}

function buildInitialState(): DatabaseState {
  return {
    users: defaultUsers,
    properties: defaultProperties,
    bookings: buildDefaultBookings(),
    payments: buildDefaultPayments(),
    vehicles: defaultVehicles,
    vehicleBookings: buildDefaultVehicleBookings(),
    manualPayments: buildDefaultManualPayments(),
    paymentAccounts: defaultPaymentAccounts,
    inquiries: [],
    notifications: buildDefaultNotifications(),
    auditLogs: buildDefaultAuditLogs(),
    catalogItems: defaultCatalogItems,
    promoCodes: defaultPromoCodes,
    carts: {},
    orders: buildDefaultOrders(),
    supportTickets: [],
    reviews: defaultReviews,
  };
}

async function ensureStorage() {
  await fs.mkdir(canonicalDataDir, { recursive: true });
  try {
    await fs.access(canonicalDbFile);
  } catch {
    const initial = buildInitialState();
    try {
      const legacyRaw = await fs.readFile(legacyServerDbFile, 'utf8');
      const legacy = JSON.parse(legacyRaw) as Partial<DatabaseState>;
      if (Array.isArray(legacy.bookings) && legacy.bookings.length > 0) {
        const existingIds = new Set(initial.bookings.map((b) => b.id));
        for (const b of legacy.bookings) {
          if (!existingIds.has(b.id)) initial.bookings.unshift(b);
        }
      }
      if (Array.isArray(legacy.payments) && legacy.payments.length > 0) {
        const existingPayIds = new Set(initial.payments.map((p) => p.id));
        for (const p of legacy.payments) {
          if (!existingPayIds.has(p.id)) initial.payments.push(p);
        }
      }
    } catch {
      // No legacy server db file to merge
    }
    await fs.writeFile(canonicalDbFile, JSON.stringify(initial, null, 2), 'utf8');
  }
}

export async function readPlatformDb(): Promise<DatabaseState> {
  await ensureStorage();
  const raw = await fs.readFile(canonicalDbFile, 'utf8');
  const parsed = JSON.parse(raw) as Partial<DatabaseState>;
  const defaults = buildInitialState();

  // Upgrade uninitialized legacy stub db.json files to full initial state
  if (!Array.isArray(parsed.users)) {
    await fs.writeFile(canonicalDbFile, JSON.stringify(defaults, null, 2), 'utf8');
    return defaults;
  }

  let needsMigrationSave = false;

  // Ensure default admin & staff accounts always exist
  const users = [...parsed.users];
  for (const defUser of defaultUsers) {
    if (!users.some((u) => u.email.toLowerCase() === defUser.email.toLowerCase())) {
      users.push(defUser);
      needsMigrationSave = true;
    }
  }

  // Upgrade unedited legacy property copy and backfill enriched specifications while preserving admin edits
  const properties = (parsed.properties?.length ? parsed.properties : defaultProperties).map((prop) => {
    const seeded = defaultProperties.find((d) => d.id === prop.id);
    if (
      seeded &&
      (prop.category === 'Holiday Apartment, Family Apartment' ||
        prop.pricingNote === 'May vary. Includes utilities and parking. Minimum stay 30 days.')
    ) {
      needsMigrationSave = true;
      return enrichPropertyRecord({
        ...seeded,
        status: prop.status,
        monthlyRate: prop.monthlyRate,
        startingRate:
          prop.monthlyRate !== seeded.monthlyRate
            ? `From $${prop.monthlyRate.toLocaleString()} / Month`
            : seeded.startingRate,
      });
    }
    return enrichPropertyRecord(prop);
  });

  // Backfill expanded 13-category concierge catalog once if upgrading from pre-concierge db.json
  let catalogItems = parsed.catalogItems?.length ? [...parsed.catalogItems] : [...defaultCatalogItems];
  const isPreConciergeDb = !Array.isArray(parsed.reviews);
  if (isPreConciergeDb) {
    needsMigrationSave = true;
    const legacyCategoryMap: Record<string, string> = {
      'srv-airport-chauffeur': 'Airport Transportation',
      'srv-midstay-refresh': 'Housekeeping',
      'srv-kitchen-provisioning': 'Grocery & Refrigerator Restocking',
      'srv-remote-workstation': 'Additional Experiences',
      'srv-pet-comfort': 'Additional Experiences',
    };
    catalogItems = catalogItems.map((item) =>
      legacyCategoryMap[item.id] ? { ...item, category: legacyCategoryMap[item.id] } : item,
    );
    const existingIds = new Set(catalogItems.map((c) => c.id));
    for (const defItem of defaultCatalogItems) {
      if (!existingIds.has(defItem.id)) {
        catalogItems.push(defItem);
      }
    }
  }

  const reviews = Array.isArray(parsed.reviews) ? parsed.reviews : defaultReviews;

  const state: DatabaseState = {
    users,
    properties,
    bookings: parsed.bookings ?? defaults.bookings,
    payments: parsed.payments ?? defaults.payments,
    vehicles: parsed.vehicles?.length ? parsed.vehicles : defaultVehicles,
    vehicleBookings: parsed.vehicleBookings ?? defaults.vehicleBookings,
    manualPayments: parsed.manualPayments ?? defaults.manualPayments,
    paymentAccounts: parsed.paymentAccounts ?? defaultPaymentAccounts,
    inquiries: parsed.inquiries ?? defaults.inquiries,
    notifications: parsed.notifications ?? defaults.notifications,
    auditLogs: parsed.auditLogs ?? defaults.auditLogs,
    catalogItems,
    promoCodes: parsed.promoCodes?.length ? parsed.promoCodes : defaultPromoCodes,
    carts: parsed.carts && typeof parsed.carts === 'object' ? parsed.carts : {},
    orders: Array.isArray(parsed.orders) ? parsed.orders : defaults.orders,
    supportTickets: Array.isArray(parsed.supportTickets) ? (parsed.supportTickets as SupportTicketRecord[]) : [],
    reviews,
  };

  if (needsMigrationSave) {
    await writePlatformDb(state);
  }

  return state;
}

export async function writePlatformDb(next: DatabaseState) {
  await fs.mkdir(canonicalDataDir, { recursive: true });
  await fs.writeFile(canonicalDbFile, JSON.stringify(next, null, 2), 'utf8');
}

export async function appendAuditLog(actorEmail: string, action: string, targetId: string, details: string) {
  const db = await readPlatformDb();
  const entry: AuditLogRecord = {
    id: `aud_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    actorEmail,
    action,
    targetId,
    details,
    createdAt: new Date().toISOString(),
  };
  db.auditLogs.unshift(entry);
  await writePlatformDb(db);
  return entry;
}

export async function createNotification(input: {
  customerId?: string;
  recipientEmail: string;
  title: string;
  message: string;
  category: NotificationRecord['category'];
}) {
  const db = await readPlatformDb();
  const item: NotificationRecord = {
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: input.customerId,
    recipientEmail: input.recipientEmail.toLowerCase().trim(),
    title: input.title,
    message: input.message,
    category: input.category,
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(item);
  await writePlatformDb(db);
  return item;
}

export async function listProperties(): Promise<PropertyRecord[]> {
  const db = await readPlatformDb();
  return db.properties;
}

export async function getPropertyById(id: string) {
  const db = await readPlatformDb();
  return db.properties.find((property) => property.id === id);
}

export async function listUsers(): Promise<UserRecord[]> {
  const db = await readPlatformDb();
  return db.users;
}

export async function createUser(user: UserRecord) {
  const db = await readPlatformDb();
  db.users.push(user);
  await writePlatformDb(db);
  return user;
}

export async function findUserByEmail(email: string) {
  const db = await readPlatformDb();
  return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase().trim());
}

function parseIsoDateOnly(iso: string): Date | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso.trim())) return null;
  const d = new Date(`${iso.trim()}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function shiftIsoDate(iso: string, deltaDays: number): string {
  const base = parseIsoDateOnly(iso) || new Date();
  const next = new Date(base.getTime() + deltaDays * 86400000);
  return next.toISOString().split('T')[0];
}

function isMonthDayInWindow(monthDay: string, startMd: string, endMd: string): boolean {
  if (!startMd || !endMd) return false;
  if (startMd <= endMd) {
    return monthDay >= startMd && monthDay <= endMd;
  }
  // Wrap-around window (e.g., 12-18 to 01-03)
  return monthDay >= startMd || monthDay <= endMd;
}

export function getCombinedBlockedRangesForProperty(
  db: DatabaseState,
  propertyId: string,
  excludeBookingId?: string,
): BlockedDateRange[] {
  const prop = db.properties.find((p) => p.id === propertyId);
  const ranges: BlockedDateRange[] = [];

  if (prop && Array.isArray(prop.blockedDates)) {
    for (const blk of prop.blockedDates) {
      if (blk.start && blk.end && blk.start <= blk.end) {
        ranges.push({
          id: blk.id || `blk_${blk.start}`,
          start: blk.start,
          end: blk.end,
          status: blk.status || 'blocked',
          label: blk.label || 'Unavailable Dates',
        });
      }
    }
  }

  for (const bk of db.bookings) {
    if (bk.propertyId !== propertyId) continue;
    if (excludeBookingId && bk.id === excludeBookingId) continue;
    if (['cancelled', 'refunded'].includes(bk.status)) continue;
    const inDate = parseIsoDateOnly(bk.checkIn);
    const outDate = parseIsoDateOnly(bk.checkOut);
    if (!inDate || !outDate || outDate <= inDate) continue;
    // Last occupied night is checkOut - 1 day so departure morning remains open for next check-in
    const inclusiveEnd = shiftIsoDate(bk.checkOut, -1);
    ranges.push({
      id: `bk_rng_${bk.id}`,
      start: bk.checkIn,
      end: inclusiveEnd < bk.checkIn ? bk.checkIn : inclusiveEnd,
      status: bk.status === 'confirmed' ? 'booked' : 'reserved',
      label: bk.status === 'confirmed' ? 'Reserved Stay' : 'Pending Reservation Hold',
    });
  }

  return ranges.sort((a, b) => a.start.localeCompare(b.start));
}

export function findOverlappingPropertyRange(
  db: DatabaseState,
  propertyId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string,
): BlockedDateRange | null {
  const inDate = parseIsoDateOnly(checkIn);
  const outDate = parseIsoDateOnly(checkOut);
  if (!inDate || !outDate || outDate <= inDate) return null;

  const lastOccupiedNight = shiftIsoDate(checkOut, -1);
  const ranges = getCombinedBlockedRangesForProperty(db, propertyId, excludeBookingId);
  for (const rng of ranges) {
    if (lastOccupiedNight >= rng.start && checkIn <= rng.end) {
      return rng;
    }
  }
  return null;
}

export function calculatePropertyStayQuote(
  db: DatabaseState,
  input: {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
    infants?: number;
    selectedAddons?: Array<{ serviceId: string; quantity?: number }>;
    excludeBookingId?: string;
  },
): AvailabilityQuoteBreakdown {
  const prop = db.properties.find((p) => p.id === input.propertyId);
  const adults = Math.max(1, Math.round(Number(input.adults) || 1));
  const children = Math.max(0, Math.round(Number(input.children) || 0));
  const infants = Math.max(0, Math.round(Number(input.infants) || 0));
  const maxGuests = prop?.maxGuests || Math.max(2, (prop?.bedrooms || 1) * 2);

  const emptyQuote = (reason: string, conflictingRange?: BlockedDateRange): AvailabilityQuoteBreakdown => ({
    available: false,
    reason,
    conflictingRange: conflictingRange
      ? { start: conflictingRange.start, end: conflictingRange.end, label: conflictingRange.label }
      : undefined,
    propertyId: input.propertyId,
    checkIn: input.checkIn || '',
    checkOut: input.checkOut || '',
    nights: 0,
    adults,
    children,
    infants,
    maxGuests,
    isExtendedTaxExempt: false,
    baseNightlyRateUsd: prop ? Math.round(prop.monthlyRate / 30) : 0,
    effectiveNightlyRateUsd: 0,
    accommodationSubtotalUsd: 0,
    addons: [],
    addonsTotalUsd: 0,
    serviceFeeUsd: 0,
    taxRatePercent: 0,
    taxUsd: 0,
    subtotalBeforeTaxUsd: 0,
    totalUsd: 0,
    unitsRequired: 0,
  });

  if (!prop) {
    return emptyQuote('Selected property was not found.');
  }
  if (prop.status === 'Reserved') {
    return emptyQuote(`${prop.unitNumber} is currently marked Reserved and closed to new bookings.`);
  }

  const start = parseIsoDateOnly(input.checkIn);
  const end = parseIsoDateOnly(input.checkOut);
  if (!start || !end) {
    return emptyQuote('Please select valid check-in and check-out dates.');
  }
  if (end <= start) {
    return emptyQuote('Check-out date must be after check-in date.');
  }

  const todayIso = new Date().toISOString().split('T')[0];
  if (input.checkIn < shiftIsoDate(todayIso, -1)) {
    return emptyQuote('Check-in date cannot be in the past.');
  }

  const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
  const minStay = Math.max(1, prop.minimumStayDays || 5);
  const maxStay = Math.max(minStay, prop.maximumStayDays || 365);

  if (nights < minStay) {
    return emptyQuote(`Minimum stay for ${prop.unitNumber} is ${minStay} nights (selected ${nights} night${nights === 1 ? '' : 's'}).`);
  }
  if (nights > maxStay) {
    return emptyQuote(`Maximum single online reservation length is ${maxStay} nights. Contact us for multi-year corporate leases.`);
  }

  const countedGuests = adults + children;
  if (countedGuests > maxGuests) {
    return emptyQuote(
      `This property accommodates up to ${maxGuests} guests (${adults} adults + ${children} children = ${countedGuests} selected).`,
    );
  }

  const conflict = findOverlappingPropertyRange(
    db,
    prop.id,
    input.checkIn,
    input.checkOut,
    input.excludeBookingId,
  );
  if (conflict) {
    return emptyQuote(
      `Selected dates overlap unavailable dates (${conflict.start} through ${conflict.end}). Please choose open dates on the calendar.`,
      conflict,
    );
  }

  const isExtendedTaxExempt = nights >= 30;
  const extendedDailyBase = prop.monthlyRate / 30;
  const shortStayNightlyBase = Math.round(extendedDailyBase * 1.12);
  const baseNightlyRateUsd = isExtendedTaxExempt ? Math.round(extendedDailyBase) : shortStayNightlyBase;

  const rules: SeasonalPricingRule[] = Array.isArray(prop.seasonalPricing) ? prop.seasonalPricing : [];
  let accommodationSubtotalUsd = 0;
  const matchedSeasonalLabels = new Set<string>();

  for (let d = 0; d < nights; d++) {
    const nightIso = shiftIsoDate(input.checkIn, d);
    const md = nightIso.slice(5); // MM-DD
    let nightRate = isExtendedTaxExempt ? extendedDailyBase : shortStayNightlyBase;

    for (const rule of rules) {
      if (isExtendedTaxExempt && !rule.appliesToExtended) continue;
      if (isMonthDayInWindow(md, rule.startMonthDay, rule.endMonthDay)) {
        if (typeof rule.nightlyRateOverride === 'number' && rule.nightlyRateOverride > 0) {
          nightRate = rule.nightlyRateOverride;
          matchedSeasonalLabels.add(rule.label);
        } else if (typeof rule.multiplier === 'number' && rule.multiplier > 0) {
          nightRate = nightRate * rule.multiplier;
          matchedSeasonalLabels.add(rule.label);
        }
        break;
      }
    }
    accommodationSubtotalUsd += nightRate;
  }

  accommodationSubtotalUsd = Math.round(accommodationSubtotalUsd);
  const effectiveNightlyRateUsd = Math.round(accommodationSubtotalUsd / nights);

  const resolvedAddons: BookingAddonSelection[] = [];
  if (Array.isArray(input.selectedAddons)) {
    for (const reqAddon of input.selectedAddons) {
      if (!reqAddon?.serviceId) continue;
      const qty = Math.max(1, Math.round(Number(reqAddon.quantity) || 1));
      const catItem = db.catalogItems.find(
        (c) => c.id === reqAddon.serviceId && c.itemType === 'addon_service' && c.available,
      );
      if (!catItem) continue;
      const clampedQty = Math.min(catItem.maxQuantity || 10, qty);
      const lineTotalUsd = Math.round(catItem.priceUsd * clampedQty * 100) / 100;
      resolvedAddons.push({
        serviceId: catItem.id,
        title: catItem.title,
        category: catItem.category,
        unitPriceUsd: catItem.priceUsd,
        quantity: clampedQty,
        billingUnitLabel: catItem.billingUnitLabel,
        lineTotalUsd,
      });
    }
  }

  const addonsTotalUsd = Math.round(
    resolvedAddons.reduce((sum, a) => sum + a.lineTotalUsd, 0) * 100,
  ) / 100;
  const serviceFeeUsd = 95;
  const taxRatePercent = isExtendedTaxExempt ? 0 : 8;
  const taxUsd = isExtendedTaxExempt
    ? 0
    : Math.round(accommodationSubtotalUsd * 0.08 * 100) / 100;
  const subtotalBeforeTaxUsd = Math.round((accommodationSubtotalUsd + addonsTotalUsd) * 100) / 100;
  const totalUsd = Math.round((subtotalBeforeTaxUsd + serviceFeeUsd + taxUsd) * 100) / 100;
  const unitsRequired = Math.max(1, Math.ceil(totalUsd / 100));

  return {
    available: true,
    propertyId: prop.id,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    nights,
    adults,
    children,
    infants,
    maxGuests,
    isExtendedTaxExempt,
    baseNightlyRateUsd,
    effectiveNightlyRateUsd,
    seasonalNote:
      matchedSeasonalLabels.size > 0
        ? Array.from(matchedSeasonalLabels).join(' • ')
        : isExtendedTaxExempt
        ? 'Extended 30+ Day Rate Applied (CA Occupancy Tax Exempt)'
        : undefined,
    accommodationSubtotalUsd,
    addons: resolvedAddons,
    addonsTotalUsd,
    serviceFeeUsd,
    taxRatePercent,
    taxUsd,
    subtotalBeforeTaxUsd,
    totalUsd,
    unitsRequired,
  };
}

export async function getPropertyAvailabilityPublic(propertyId: string) {
  const db = await readPlatformDb();
  const prop = db.properties.find((p) => p.id === propertyId);
  if (!prop) throw new Error('Property not found');
  const blockedRanges = getCombinedBlockedRangesForProperty(db, propertyId);
  return {
    propertyId: prop.id,
    status: prop.status,
    minimumStayDays: prop.minimumStayDays || 5,
    maximumStayDays: prop.maximumStayDays || 365,
    maxGuests: prop.maxGuests || Math.max(2, prop.bedrooms * 2),
    monthlyRate: prop.monthlyRate,
    seasonalPricing: prop.seasonalPricing || [],
    blockedRanges,
  };
}

export async function quotePropertyStayPublic(input: {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  infants?: number;
  selectedAddons?: Array<{ serviceId: string; quantity?: number }>;
}): Promise<AvailabilityQuoteBreakdown> {
  const db = await readPlatformDb();
  return calculatePropertyStayQuote(db, input);
}

export async function createBooking(input: {
  customerId?: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  infants?: number;
  selectedAddons?: Array<{ serviceId: string; quantity?: number }>;
  notes?: string;
  employer?: string;
  role?: string;
  specialRequests?: string;
  paymentProvider?: 'manual' | 'stripe' | 'paypal' | 'unit_balance';
}): Promise<BookingRecord> {
  const db = await readPlatformDb();
  const property = db.properties.find((entry) => entry.id === input.propertyId);
  if (!property) {
    throw new Error('Selected property was not found.');
  }

  const quote = calculatePropertyStayQuote(db, {
    propertyId: property.id,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: input.adults,
    children: input.children,
    infants: input.infants,
    selectedAddons: input.selectedAddons,
  });

  if (!quote.available) {
    throw new Error(quote.reason || 'Selected dates are unavailable for this property.');
  }

  const addonSummary =
    quote.addons.length > 0
      ? `Add-ons: ${quote.addons.map((a) => `${a.title} (x${a.quantity})`).join(', ')}`
      : '';
  const combinedNotes = [input.notes?.trim(), addonSummary].filter(Boolean).join(' • ') || undefined;

  const booking: BookingRecord = {
    id: `bk_${Date.now().toString().slice(-6)}`,
    customerId: input.customerId,
    propertyId: property.id,
    guestName: input.guestName.trim(),
    guestEmail: input.guestEmail.trim(),
    guestPhone: input.guestPhone.trim(),
    employer: input.employer?.trim() || undefined,
    role: input.role?.trim() || undefined,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: quote.adults,
    children: quote.children,
    infants: quote.infants,
    selectedAddons: quote.addons.length > 0 ? quote.addons : undefined,
    accommodationSubtotalUsd: quote.accommodationSubtotalUsd,
    addonsTotalUsd: quote.addonsTotalUsd,
    serviceFeeUsd: quote.serviceFeeUsd,
    taxUsd: quote.taxUsd,
    totalUsd: quote.totalUsd,
    status: 'awaiting_payment',
    notes: combinedNotes,
    specialRequests: input.specialRequests?.trim() || undefined,
    totalNights: quote.nights,
    unitCostUsd: quote.totalUsd,
    unitCostUnits: quote.unitsRequired,
    createdAt: new Date().toISOString(),
    paymentProvider: input.paymentProvider ?? 'manual',
  };

  db.bookings.unshift(booking);
  db.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: input.customerId,
    recipientEmail: booking.guestEmail.toLowerCase(),
    title: `Reservation Recorded — Pending Payment (${booking.id})`,
    message: `Your reservation for ${property.unitNumber} (${booking.checkIn} to ${booking.checkOut}, $${quote.totalUsd.toLocaleString()}) is recorded and awaiting payment verification.`,
    category: 'booking',
    read: false,
    createdAt: new Date().toISOString(),
  });
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: booking.guestEmail.toLowerCase(),
    action: 'HOUSING_BOOKING_CREATED',
    targetId: booking.id,
    details: `Created ${quote.nights}-night reservation for ${property.unitNumber} ($${quote.totalUsd.toLocaleString()}).`,
    createdAt: new Date().toISOString(),
  });

  await writePlatformDb(db);
  return booking;
}

export async function getBookings(): Promise<BookingRecord[]> {
  const db = await readPlatformDb();
  return db.bookings;
}

export async function updateHousingBookingAdmin(
  bookingId: string,
  updates: { status?: BookingStatus; notes?: string; paymentReference?: string },
  actorEmail: string,
) {
  const db = await readPlatformDb();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) throw new Error('Booking not found');

  if (updates.status) booking.status = updates.status;
  if (updates.notes !== undefined) booking.notes = updates.notes;
  if (updates.paymentReference !== undefined) booking.paymentReference = updates.paymentReference;

  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'HOUSING_BOOKING_UPDATED',
    targetId: bookingId,
    details: `Updated booking ${bookingId} status to ${booking.status}.`,
    createdAt: new Date().toISOString(),
  });

  await writePlatformDb(db);
  return booking;
}

export async function confirmManualPayment(bookingId: string, amount: number, reference?: string) {
  const db = await readPlatformDb();
  const booking = db.bookings.find((entry) => entry.id === bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  const payment = db.payments.find((entry) => entry.bookingId === bookingId && entry.provider === 'manual');
  if (!payment) {
    db.payments.push({
      id: `pay_${Date.now()}`,
      bookingId,
      amount,
      currency: 'USD',
      status: 'succeeded',
      provider: 'manual',
      reference,
      createdAt: new Date().toISOString(),
    });
  } else {
    payment.status = 'succeeded';
    payment.amount = amount;
    payment.reference = reference;
  }

  booking.status = 'confirmed';
  booking.paymentReference = reference ?? `manual-${Date.now()}`;

  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: 'admin@easytravellodging.com',
    action: 'BOOKING_MANUAL_PAYMENT_CONFIRMED',
    targetId: bookingId,
    details: `Confirmed $${amount.toLocaleString()} manual payment (${booking.paymentReference}).`,
    createdAt: new Date().toISOString(),
  });

  await writePlatformDb(db);
  return {
    booking,
    payment: db.payments.find((entry) => entry.bookingId === bookingId && entry.provider === 'manual'),
  };
}

export async function listVehicles(): Promise<VehicleInventoryRecord[]> {
  const db = await readPlatformDb();
  return db.vehicles;
}

export async function updateVehicleAdmin(
  vehicleId: string,
  updates: {
    inventoryStatus?: VehicleInventoryStatus;
    dailyRate?: number;
    weeklyRate?: number;
    monthlyRate?: number;
    hubLocation?: string;
    maintenanceNote?: { serviceType: string; notes: string; costUsd: number };
  },
  actorEmail: string,
) {
  const db = await readPlatformDb();
  const vehicle = db.vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) throw new Error('Vehicle not found');

  if (updates.inventoryStatus) vehicle.inventoryStatus = updates.inventoryStatus;
  if (typeof updates.dailyRate === 'number' && updates.dailyRate > 0) vehicle.dailyRate = updates.dailyRate;
  if (typeof updates.weeklyRate === 'number' && updates.weeklyRate > 0) vehicle.weeklyRate = updates.weeklyRate;
  if (typeof updates.monthlyRate === 'number' && updates.monthlyRate > 0) vehicle.monthlyRate = updates.monthlyRate;
  if (updates.hubLocation) vehicle.hubLocation = updates.hubLocation;

  if (updates.maintenanceNote?.serviceType) {
    vehicle.maintenanceLogs.unshift({
      id: `mnt_${Date.now()}`,
      serviceType: updates.maintenanceNote.serviceType,
      notes: updates.maintenanceNote.notes || '',
      costUsd: Number(updates.maintenanceNote.costUsd) || 0,
      date: new Date().toISOString(),
      performedBy: actorEmail,
    });
  }

  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'VEHICLE_FLEET_UPDATED',
    targetId: vehicleId,
    details: `Updated ${vehicle.name} status=${vehicle.inventoryStatus}, rates=$${vehicle.dailyRate}/d.`,
    createdAt: new Date().toISOString(),
  });

  await writePlatformDb(db);
  return vehicle;
}

export function calculateVehiclePricing(
  vehicle: { dailyRate: number; weeklyRate: number; monthlyRate: number },
  totalDays: number,
  protectionPlan: 'standard' | 'executive_shield',
) {
  let baseUsd = 0;
  let rateTier: 'daily' | 'weekly' | 'monthly' = 'daily';

  if (totalDays >= 30) {
    rateTier = 'monthly';
    baseUsd = Math.round((vehicle.monthlyRate / 30) * totalDays);
  } else if (totalDays >= 7) {
    rateTier = 'weekly';
    baseUsd = Math.round((vehicle.weeklyRate / 7) * totalDays);
  } else {
    rateTier = 'daily';
    baseUsd = vehicle.dailyRate * totalDays;
  }

  const protectionUsd = protectionPlan === 'executive_shield' ? totalDays * 18 : 0;
  const totalUsd = baseUsd + protectionUsd;
  const unitsRequired = Math.max(1, Math.ceil(totalUsd / 100));

  return { rateTier, baseUsd, protectionUsd, totalUsd, unitsRequired };
}

export async function createVehicleBooking(input: {
  customerId?: string;
  vehicleId: string;
  exteriorColorName: string;
  exteriorColorHex: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  employer?: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  protectionPlan?: 'standard' | 'executive_shield';
  paymentMethod?: 'manual_wire' | 'unit_balance';
  notes?: string;
}): Promise<VehicleBookingRecord> {
  const db = await readPlatformDb();
  const vehicle = db.vehicles.find((v) => v.id === input.vehicleId) || db.vehicles[0];

  const start = new Date(input.pickupDate);
  const end = new Date(input.returnDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    throw new Error('Return date must be after pickup date');
  }

  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
  const protectionPlan = input.protectionPlan === 'executive_shield' ? 'executive_shield' : 'standard';
  const pricing = calculateVehiclePricing(vehicle, totalDays, protectionPlan);

  const record: VehicleBookingRecord = {
    id: `vbk_${Date.now().toString().slice(-6)}`,
    customerId: input.customerId,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    exteriorColorName: input.exteriorColorName || 'Factory Metallic',
    exteriorColorHex: input.exteriorColorHex || '#1e40af',
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    customerPhone: input.customerPhone.trim(),
    employer: input.employer?.trim() || undefined,
    pickupDate: input.pickupDate,
    returnDate: input.returnDate,
    totalDays,
    pickupLocation: input.pickupLocation || 'SMF Sacramento Int’l Airport Concierge Delivery',
    protectionPlan,
    rateTier: pricing.rateTier,
    totalUsd: pricing.totalUsd,
    unitsRequired: pricing.unitsRequired,
    paymentMethod: input.paymentMethod ?? 'manual_wire',
    status: 'awaiting_payment',
    notes: input.notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  db.vehicleBookings.unshift(record);
  db.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: input.customerId,
    recipientEmail: record.customerEmail.toLowerCase(),
    title: `Car Rental Reservation Created (${record.id})`,
    message: `${record.vehicleName} reserved for ${record.pickupDate} → ${record.returnDate} ($${record.totalUsd.toLocaleString()} / ${record.unitsRequired} Units).`,
    category: 'fleet',
    read: false,
    createdAt: new Date().toISOString(),
  });
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: record.customerEmail.toLowerCase(),
    action: 'VEHICLE_BOOKING_CREATED',
    targetId: record.id,
    details: `Reserved ${record.vehicleName} (${totalDays} days, $${record.totalUsd.toLocaleString()}).`,
    createdAt: new Date().toISOString(),
  });

  await writePlatformDb(db);
  return record;
}

export async function updateVehicleBookingAdmin(
  bookingId: string,
  updates: { status?: VehicleBookingStatus; notes?: string },
  actorEmail: string,
) {
  const db = await readPlatformDb();
  const vbk = db.vehicleBookings.find((b) => b.id === bookingId);
  if (!vbk) throw new Error('Vehicle booking not found');

  if (updates.status) {
    vbk.status = updates.status;
    const vehicle = db.vehicles.find((v) => v.id === vbk.vehicleId);
    if (vehicle) {
      if (updates.status === 'active') vehicle.inventoryStatus = 'rented';
      else if (updates.status === 'completed' || updates.status === 'cancelled') vehicle.inventoryStatus = 'available';
    }
  }
  if (updates.notes !== undefined) vbk.notes = updates.notes;

  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'VEHICLE_BOOKING_UPDATED',
    targetId: bookingId,
    details: `Updated fleet booking ${bookingId} status to ${vbk.status}.`,
    createdAt: new Date().toISOString(),
  });

  await writePlatformDb(db);
  return vbk;
}

export async function getPaymentAccounts(): Promise<PaymentAccountConfig> {
  const db = await readPlatformDb();
  return db.paymentAccounts;
}

export async function updatePaymentAccounts(nextConfig: Partial<PaymentAccountConfig>, actorEmail: string) {
  const db = await readPlatformDb();
  db.paymentAccounts = {
    ...db.paymentAccounts,
    ...nextConfig,
    updatedAt: new Date().toISOString(),
  };
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'PAYMENT_ACCOUNTS_UPDATED',
    targetId: 'payment_accounts',
    details: `Updated official receiving bank (${db.paymentAccounts.bankName}) & Zelle (${db.paymentAccounts.zelleEmail}) instructions.`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return db.paymentAccounts;
}

export async function createInquiry(input: {
  customerId?: string;
  type: InquiryRecord['type'];
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  propertyId?: string;
  moveInDate?: string;
  duration?: string;
  message?: string;
}): Promise<InquiryRecord> {
  const db = await readPlatformDb();
  const ref = `ETL-${Math.floor(100000 + Math.random() * 900000)}`;
  const inquiry: InquiryRecord = {
    id: `inq_${Date.now().toString().slice(-6)}`,
    customerId: input.customerId,
    referenceCode: ref,
    type: input.type,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,
    company: input.company?.trim() || undefined,
    role: input.role?.trim() || undefined,
    propertyId: input.propertyId || undefined,
    moveInDate: input.moveInDate || undefined,
    duration: input.duration || undefined,
    message: input.message?.trim() || undefined,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  db.inquiries.unshift(inquiry);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: inquiry.email.toLowerCase(),
    action: `INQUIRY_${inquiry.type.toUpperCase()}`,
    targetId: inquiry.id,
    details: `New ${inquiry.type} submission from ${inquiry.name} (${inquiry.referenceCode}).`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return inquiry;
}

export async function updateInquiryStatusAdmin(
  id: string,
  status: InquiryRecord['status'],
  actorEmail: string,
) {
  const db = await readPlatformDb();
  const inquiry = db.inquiries.find((i) => i.id === id);
  if (!inquiry) throw new Error('Inquiry not found');
  inquiry.status = status;
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'INQUIRY_STATUS_UPDATED',
    targetId: id,
    details: `Marked inquiry ${inquiry.referenceCode} as ${status}.`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return inquiry;
}

function roundCurrency(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

function addDaysIso(startIso: string | undefined, days: number): string {
  const base = startIso ? new Date(`${startIso}T12:00:00Z`) : new Date(Date.now() + 3 * 86400000);
  const safeBase = Number.isNaN(base.getTime()) ? new Date(Date.now() + 3 * 86400000) : base;
  const end = new Date(safeBase.getTime() + Math.max(1, days) * 86400000);
  return end.toISOString().split('T')[0];
}

function defaultStartIso(daysAhead = 3): string {
  const d = new Date(Date.now() + daysAhead * 86400000);
  return d.toISOString().split('T')[0];
}

export function recomputeCart(db: DatabaseState, cart: CartRecord): CartRecord {
  const validationIssues: string[] = [];
  let subtotalUsd = 0;
  let hasAccommodation = false;
  let taxUsd = 0;

  const refreshedItems: CartItemRecord[] = cart.items.map((item) => {
    if (item.itemType === 'accommodation') {
      const prop = db.properties.find((p) => p.id === item.referenceId);
      if (!prop) {
        validationIssues.push(`Residence "${item.title}" is no longer listed and must be removed.`);
        return { ...item, available: false, unavailableReason: 'Listing removed' };
      }
      const isNotReservedStatus = prop.status !== 'Reserved';
      if (!isNotReservedStatus) {
        validationIssues.push(`${prop.unitNumber} (${prop.title}) is currently reserved and unavailable.`);
      }
      const billingUnit = item.metadata?.billingUnit === 'night' ? 'night' : 'month';
      const minQuantity = billingUnit === 'night' ? Math.max(1, prop.minimumStayDays || 5) : 1;
      const maxQuantity = billingUnit === 'night' ? 29 : 12;
      const quantity = Math.min(maxQuantity, Math.max(minQuantity, Math.round(item.quantity || minQuantity)));
      const checkIn = item.metadata?.checkIn || defaultStartIso(5);
      const stayDays = billingUnit === 'night' ? quantity : quantity * 30;
      const checkOut = item.metadata?.checkOut && billingUnit === 'night'
        ? addDaysIso(checkIn, stayDays)
        : addDaysIso(checkIn, stayDays);

      const dateOverlap = findOverlappingPropertyRange(db, prop.id, checkIn, checkOut);
      if (dateOverlap) {
        validationIssues.push(
          `${prop.unitNumber} has conflicting unavailable dates (${dateOverlap.start} to ${dateOverlap.end}). Please select open dates.`,
        );
      }

      const quote = calculatePropertyStayQuote(db, {
        propertyId: prop.id,
        checkIn,
        checkOut,
        adults: item.metadata?.adults || item.metadata?.guests || 1,
        children: item.metadata?.children || 0,
        infants: item.metadata?.infants || 0,
      });

      const isAvailable = isNotReservedStatus && !dateOverlap;
      const lineSubtotalUsd = quote.available
        ? roundCurrency(quote.accommodationSubtotalUsd)
        : roundCurrency(
            (billingUnit === 'night' ? Math.round((prop.monthlyRate / 30) * 1.12) : prop.monthlyRate) *
              quantity,
          );
      const unitPriceUsd = roundCurrency(lineSubtotalUsd / quantity);

      if (isAvailable) {
        subtotalUsd += lineSubtotalUsd;
        hasAccommodation = true;
        if (stayDays < 30) {
          // Local transient occupancy tax applies only to stays under 30 days
          taxUsd += roundCurrency(lineSubtotalUsd * 0.08);
        }
      }

      return {
        ...item,
        title: prop.title,
        subtitle:
          billingUnit === 'night'
            ? `${prop.unitNumber} • ${checkIn} → ${checkOut} (${quantity} nights)`
            : `${prop.unitNumber} • ${checkIn} → ${checkOut} (30+ Day Tax-Exempt)`,
        category: prop.category,
        image: prop.images[0] || item.image,
        unitPriceUsd,
        quantity,
        minQuantity,
        maxQuantity,
        quantityLabel: billingUnit === 'night' ? 'Nights' : 'Months (30-Day)',
        lineSubtotalUsd,
        available: isAvailable,
        unavailableReason: !isNotReservedStatus
          ? 'Currently Reserved'
          : dateOverlap
          ? `Unavailable ${dateOverlap.start}–${dateOverlap.end}`
          : undefined,
        metadata: {
          ...item.metadata,
          billingUnit,
          checkIn,
          checkOut,
        },
      };
    }

    if (item.itemType === 'vehicle') {
      const veh = db.vehicles.find((v) => v.id === item.referenceId);
      if (!veh) {
        validationIssues.push(`Vehicle "${item.title}" is no longer in fleet inventory.`);
        return { ...item, available: false, unavailableReason: 'Removed from fleet' };
      }
      const isAvailable = veh.inventoryStatus === 'available';
      if (!isAvailable) {
        validationIssues.push(`${veh.name} is currently ${veh.inventoryStatus} and cannot be booked right now.`);
      }
      const minQuantity = 1;
      const maxQuantity = 90;
      const quantity = Math.min(maxQuantity, Math.max(minQuantity, Math.round(item.quantity || 3)));
      const protectionPlan =
        item.metadata?.protectionPlan === 'executive_shield' ? 'executive_shield' : 'standard';
      const pricing = calculateVehiclePricing(veh, quantity, protectionPlan);
      const lineSubtotalUsd = roundCurrency(pricing.totalUsd);
      const unitPriceUsd = roundCurrency(lineSubtotalUsd / quantity);
      const pickupDate = item.metadata?.pickupDate || defaultStartIso(3);
      const returnDate = addDaysIso(pickupDate, quantity);
      const colorLabel = item.metadata?.exteriorColorName || 'Signature Finish';

      if (isAvailable) {
        subtotalUsd += lineSubtotalUsd;
        taxUsd += roundCurrency(lineSubtotalUsd * 0.0875);
      }

      return {
        ...item,
        title: `${veh.year} ${veh.name}`,
        subtitle: `${colorLabel} • ${pickupDate} → ${returnDate} (${pricing.rateTier} tier${
          protectionPlan === 'executive_shield' ? ' + Executive Shield' : ''
        })`,
        category: veh.category,
        image: VEHICLE_THUMBNAILS[veh.id] || item.image,
        unitPriceUsd,
        quantity,
        minQuantity,
        maxQuantity,
        quantityLabel: 'Rental Days',
        lineSubtotalUsd,
        available: isAvailable,
        unavailableReason: isAvailable ? undefined : `Status: ${veh.inventoryStatus}`,
        metadata: {
          ...item.metadata,
          billingUnit: 'day',
          pickupDate,
          returnDate,
          protectionPlan,
          pickupLocation: item.metadata?.pickupLocation || veh.hubLocation,
        },
      };
    }

    // addon_service or unit_package
    const cat = db.catalogItems.find((c) => c.id === item.referenceId);
    if (!cat) {
      validationIssues.push(`Item "${item.title}" is no longer offered.`);
      return { ...item, available: false, unavailableReason: 'No longer offered' };
    }
    if (!cat.available) {
      validationIssues.push(`"${cat.title}" is currently paused and unavailable for checkout.`);
    }
    const minQuantity = 1;
    const maxQuantity = Math.max(1, cat.maxQuantity || 10);
    const quantity = Math.min(maxQuantity, Math.max(minQuantity, Math.round(item.quantity || 1)));
    const unitPriceUsd = roundCurrency(cat.priceUsd);
    const lineSubtotalUsd = roundCurrency(unitPriceUsd * quantity);

    if (cat.available) {
      subtotalUsd += lineSubtotalUsd;
    }

    return {
      ...item,
      itemType: cat.itemType,
      title: cat.title,
      subtitle: `${cat.category} • ${cat.billingUnitLabel}`,
      category: cat.category,
      image: cat.image || item.image,
      unitPriceUsd,
      quantity,
      minQuantity,
      maxQuantity,
      quantityLabel: 'Qty',
      lineSubtotalUsd,
      available: cat.available,
      unavailableReason: cat.available ? undefined : 'Temporarily Unavailable',
      metadata: {
        ...item.metadata,
        billingUnit: 'item',
        unitsIncluded: cat.unitsIncluded,
      },
    };
  });

  subtotalUsd = roundCurrency(subtotalUsd);
  const serviceFeeUsd = hasAccommodation ? 95 : 0;
  taxUsd = roundCurrency(taxUsd);

  let discountUsd = 0;
  let promoCode = cart.promoCode?.trim().toUpperCase() || undefined;
  let promoDescription: string | undefined;

  if (promoCode) {
    const promo = db.promoCodes.find((p) => p.code.toUpperCase() === promoCode && p.active);
    if (!promo) {
      validationIssues.push(`Promo code "${promoCode}" is no longer active and was removed.`);
      promoCode = undefined;
    } else if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      validationIssues.push(`Promo code "${promoCode}" has expired.`);
      promoCode = undefined;
    } else if (subtotalUsd < promo.minSubtotalUsd) {
      promoDescription = `Add $${(promo.minSubtotalUsd - subtotalUsd).toLocaleString()} more to unlock ${promo.code} (${promo.description})`;
      discountUsd = 0;
    } else {
      promoDescription = promo.description;
      const rawDiscount =
        promo.discountType === 'percentage'
          ? subtotalUsd * (promo.discountValue / 100)
          : promo.discountValue;
      const capped =
        typeof promo.maxDiscountUsd === 'number' && promo.maxDiscountUsd > 0
          ? Math.min(rawDiscount, promo.maxDiscountUsd)
          : rawDiscount;
      discountUsd = roundCurrency(Math.min(subtotalUsd + serviceFeeUsd, capped));
    }
  }

  const totalUsd = roundCurrency(Math.max(0, subtotalUsd + serviceFeeUsd + taxUsd - discountUsd));
  const totalUnitsRequired = totalUsd > 0 ? Math.max(1, Math.ceil(totalUsd / 100)) : 0;
  const itemCount = refreshedItems.reduce((sum, entry) => sum + (entry.itemType === 'vehicle' ? 1 : entry.quantity), 0);

  return {
    cartId: cart.cartId,
    items: refreshedItems,
    promoCode,
    promoDescription,
    subtotalUsd,
    serviceFeeUsd,
    taxUsd,
    discountUsd,
    totalUsd,
    totalUnitsRequired,
    itemCount,
    validationIssues,
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeCartId(rawCartId: string): string {
  const cleaned = (rawCartId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return cleaned || `cart_${Date.now()}`;
}

export async function getPublicCatalog() {
  const db = await readPlatformDb();
  const vehiclesWithImages = db.vehicles.map((v) => ({
    ...v,
    image: VEHICLE_THUMBNAILS[v.id] || VEHICLE_THUMBNAILS['tesla-model-y'],
  }));
  const activePromos = db.promoCodes
    .filter((p) => p.active && (!p.expiresAt || new Date(p.expiresAt) > new Date()))
    .map((p) => ({
      code: p.code,
      description: p.description,
      discountType: p.discountType,
      discountValue: p.discountValue,
      minSubtotalUsd: p.minSubtotalUsd,
    }));

  return {
    properties: db.properties,
    vehicles: vehiclesWithImages,
    catalogItems: db.catalogItems,
    promoHints: activePromos,
  };
}

export async function getOrCreateCart(rawCartId: string): Promise<CartRecord> {
  const cartId = sanitizeCartId(rawCartId);
  const db = await readPlatformDb();
  const existing = db.carts[cartId] || {
    cartId,
    items: [],
    subtotalUsd: 0,
    serviceFeeUsd: 0,
    taxUsd: 0,
    discountUsd: 0,
    totalUsd: 0,
    totalUnitsRequired: 0,
    itemCount: 0,
    validationIssues: [],
    updatedAt: new Date().toISOString(),
  };
  const computed = recomputeCart(db, existing);
  db.carts[cartId] = computed;
  await writePlatformDb(db);
  return computed;
}

export async function addCartItem(
  rawCartId: string,
  input: {
    referenceId: string;
    itemType: CatalogItemType;
    quantity?: number;
    metadata?: CartItemMetadata;
  },
): Promise<CartRecord> {
  const cartId = sanitizeCartId(rawCartId);
  if (!input.referenceId || !input.itemType) {
    throw new Error('Item reference and type are required.');
  }
  const requestedQty = Number(input.quantity ?? 1);
  if (!Number.isFinite(requestedQty) || requestedQty < 1 || !Number.isInteger(requestedQty)) {
    throw new Error('Quantity must be a whole number of at least 1.');
  }

  const db = await readPlatformDb();
  const cart: CartRecord = db.carts[cartId] || {
    cartId,
    items: [],
    subtotalUsd: 0,
    serviceFeeUsd: 0,
    taxUsd: 0,
    discountUsd: 0,
    totalUsd: 0,
    totalUnitsRequired: 0,
    itemCount: 0,
    validationIssues: [],
    updatedAt: new Date().toISOString(),
  };

  if (input.itemType === 'accommodation') {
    const prop = db.properties.find((p) => p.id === input.referenceId);
    if (!prop) throw new Error('Selected residence was not found.');
    if (prop.status === 'Reserved') {
      throw new Error(`${prop.unitNumber} is currently reserved and cannot be added to cart.`);
    }
    const billingUnit = input.metadata?.billingUnit === 'night' ? 'night' : 'month';
    const minQty = billingUnit === 'night' ? Math.max(1, prop.minimumStayDays || 5) : 1;
    const maxQty = billingUnit === 'night' ? 29 : 12;
    if (requestedQty < minQty || requestedQty > maxQty) {
      throw new Error(
        billingUnit === 'night'
          ? `Short stays require between ${minQty} and ${maxQty} nights (choose Monthly for 30+ days).`
          : `Extended-stay months must be between ${minQty} and ${maxQty} months.`,
      );
    }

    const checkIn = input.metadata?.checkIn || defaultStartIso(5);
    const stayDays = billingUnit === 'night' ? requestedQty : requestedQty * 30;
    const checkOut = addDaysIso(checkIn, stayDays);
    if (input.metadata?.checkIn) {
      const overlap = findOverlappingPropertyRange(db, prop.id, checkIn, checkOut);
      if (overlap) {
        throw new Error(
          `${prop.unitNumber} is unavailable from ${overlap.start} through ${overlap.end}. Please select open dates.`,
        );
      }
    }
    const maxGuests = prop.maxGuests || Math.max(2, prop.bedrooms * 2);
    const totalCountedGuests =
      (Number(input.metadata?.adults) || Number(input.metadata?.guests) || 1) +
      (Number(input.metadata?.children) || 0);
    if (totalCountedGuests > maxGuests) {
      throw new Error(`${prop.unitNumber} accommodates up to ${maxGuests} guests.`);
    }

    const existingIdx = cart.items.findIndex(
      (i) => i.itemType === 'accommodation' && i.referenceId === prop.id,
    );
    const newItem: CartItemRecord = {
      id: existingIdx >= 0 ? cart.items[existingIdx].id : `ci_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`,
      referenceId: prop.id,
      itemType: 'accommodation',
      title: prop.title,
      subtitle: prop.unitNumber,
      category: prop.category,
      image: prop.images[0] || '',
      unitPriceUsd: prop.monthlyRate,
      quantity: requestedQty,
      minQuantity: minQty,
      maxQuantity: maxQty,
      quantityLabel: billingUnit === 'night' ? 'Nights' : 'Months (30-Day)',
      lineSubtotalUsd: prop.monthlyRate * requestedQty,
      available: true,
      metadata: {
        ...input.metadata,
        billingUnit,
        checkIn,
        checkOut,
      },
    };
    if (existingIdx >= 0) {
      cart.items[existingIdx] = newItem;
    } else {
      cart.items.push(newItem);
    }
  } else if (input.itemType === 'vehicle') {
    const veh = db.vehicles.find((v) => v.id === input.referenceId);
    if (!veh) throw new Error('Selected vehicle was not found.');
    if (veh.inventoryStatus !== 'available') {
      throw new Error(`${veh.name} is currently ${veh.inventoryStatus} and unavailable for booking.`);
    }
    if (requestedQty < 1 || requestedQty > 90) {
      throw new Error('Vehicle rental duration must be between 1 and 90 days.');
    }
    const existingIdx = cart.items.findIndex(
      (i) => i.itemType === 'vehicle' && i.referenceId === veh.id,
    );
    const pickupDate = input.metadata?.pickupDate || defaultStartIso(3);
    const newItem: CartItemRecord = {
      id: existingIdx >= 0 ? cart.items[existingIdx].id : `ci_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`,
      referenceId: veh.id,
      itemType: 'vehicle',
      title: `${veh.year} ${veh.name}`,
      subtitle: veh.category,
      category: veh.category,
      image: VEHICLE_THUMBNAILS[veh.id] || '',
      unitPriceUsd: veh.dailyRate,
      quantity: requestedQty,
      minQuantity: 1,
      maxQuantity: 90,
      quantityLabel: 'Rental Days',
      lineSubtotalUsd: veh.dailyRate * requestedQty,
      available: true,
      metadata: {
        ...input.metadata,
        billingUnit: 'day',
        pickupDate,
        pickupLocation: input.metadata?.pickupLocation || veh.hubLocation,
        protectionPlan: input.metadata?.protectionPlan === 'executive_shield' ? 'executive_shield' : 'standard',
      },
    };
    if (existingIdx >= 0) {
      cart.items[existingIdx] = newItem;
    } else {
      cart.items.push(newItem);
    }
  } else {
    const cat = db.catalogItems.find((c) => c.id === input.referenceId);
    if (!cat) throw new Error('Selected service or package was not found.');
    if (!cat.available) {
      throw new Error(`"${cat.title}" is currently unavailable.`);
    }
    const existingIdx = cart.items.findIndex(
      (i) => i.referenceId === cat.id && (i.itemType === 'addon_service' || i.itemType === 'unit_package'),
    );
    const combinedQty = existingIdx >= 0 ? cart.items[existingIdx].quantity + requestedQty : requestedQty;
    if (combinedQty > cat.maxQuantity) {
      throw new Error(`Maximum allowed quantity for "${cat.title}" is ${cat.maxQuantity}.`);
    }
    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity = combinedQty;
      if (input.metadata?.notes) {
        cart.items[existingIdx].metadata = { ...cart.items[existingIdx].metadata, notes: input.metadata.notes };
      }
    } else {
      cart.items.push({
        id: `ci_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`,
        referenceId: cat.id,
        itemType: cat.itemType,
        title: cat.title,
        subtitle: `${cat.category} • ${cat.billingUnitLabel}`,
        category: cat.category,
        image: cat.image,
        unitPriceUsd: cat.priceUsd,
        quantity: requestedQty,
        minQuantity: 1,
        maxQuantity: cat.maxQuantity,
        quantityLabel: 'Qty',
        lineSubtotalUsd: cat.priceUsd * requestedQty,
        available: true,
        metadata: {
          ...input.metadata,
          billingUnit: 'item',
          unitsIncluded: cat.unitsIncluded,
        },
      });
    }
  }

  const computed = recomputeCart(db, cart);
  db.carts[cartId] = computed;
  await writePlatformDb(db);
  return computed;
}

export async function updateCartItemQuantity(
  rawCartId: string,
  itemId: string,
  quantity: number,
): Promise<CartRecord> {
  const cartId = sanitizeCartId(rawCartId);
  const db = await readPlatformDb();
  const cart = db.carts[cartId];
  if (!cart) throw new Error('Shopping cart not found.');

  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new Error('Cart item not found.');

  const parsedQty = Number(quantity);
  if (!Number.isFinite(parsedQty) || !Number.isInteger(parsedQty)) {
    throw new Error('Quantity must be a valid whole number.');
  }
  if (parsedQty < item.minQuantity) {
    throw new Error(`Minimum allowed ${item.quantityLabel.toLowerCase()} for "${item.title}" is ${item.minQuantity}.`);
  }
  if (parsedQty > item.maxQuantity) {
    throw new Error(`Maximum allowed ${item.quantityLabel.toLowerCase()} for "${item.title}" is ${item.maxQuantity}.`);
  }

  item.quantity = parsedQty;
  const computed = recomputeCart(db, cart);
  db.carts[cartId] = computed;
  await writePlatformDb(db);
  return computed;
}

export async function removeCartItem(rawCartId: string, itemId: string): Promise<CartRecord> {
  const cartId = sanitizeCartId(rawCartId);
  const db = await readPlatformDb();
  const cart = db.carts[cartId];
  if (!cart) return getOrCreateCart(cartId);

  cart.items = cart.items.filter((i) => i.id !== itemId);
  if (cart.items.length === 0) {
    cart.promoCode = undefined;
    cart.promoDescription = undefined;
  }
  const computed = recomputeCart(db, cart);
  db.carts[cartId] = computed;
  await writePlatformDb(db);
  return computed;
}

export async function clearCart(rawCartId: string): Promise<CartRecord> {
  const cartId = sanitizeCartId(rawCartId);
  const db = await readPlatformDb();
  const empty: CartRecord = {
    cartId,
    items: [],
    subtotalUsd: 0,
    serviceFeeUsd: 0,
    taxUsd: 0,
    discountUsd: 0,
    totalUsd: 0,
    totalUnitsRequired: 0,
    itemCount: 0,
    validationIssues: [],
    updatedAt: new Date().toISOString(),
  };
  db.carts[cartId] = empty;
  await writePlatformDb(db);
  return empty;
}

export async function applyCartPromo(rawCartId: string, rawCode?: string): Promise<CartRecord> {
  const cartId = sanitizeCartId(rawCartId);
  const db = await readPlatformDb();
  const cart = db.carts[cartId] || {
    cartId,
    items: [],
    subtotalUsd: 0,
    serviceFeeUsd: 0,
    taxUsd: 0,
    discountUsd: 0,
    totalUsd: 0,
    totalUnitsRequired: 0,
    itemCount: 0,
    validationIssues: [],
    updatedAt: new Date().toISOString(),
  };

  const trimmed = (rawCode || '').trim().toUpperCase();
  if (!trimmed) {
    cart.promoCode = undefined;
    cart.promoDescription = undefined;
    const computed = recomputeCart(db, cart);
    db.carts[cartId] = computed;
    await writePlatformDb(db);
    return computed;
  }

  const promo = db.promoCodes.find((p) => p.code.toUpperCase() === trimmed && p.active);
  if (!promo) {
    throw new Error(`Promotional code "${trimmed}" is invalid or inactive.`);
  }
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    throw new Error(`Promotional code "${trimmed}" has expired.`);
  }

  const preCheck = recomputeCart(db, { ...cart, promoCode: undefined });
  if (preCheck.subtotalUsd < promo.minSubtotalUsd) {
    throw new Error(
      `Code "${promo.code}" requires a minimum item subtotal of $${promo.minSubtotalUsd.toLocaleString()} (current subtotal: $${preCheck.subtotalUsd.toLocaleString()}).`,
    );
  }

  cart.promoCode = promo.code;
  const computed = recomputeCart(db, cart);
  db.carts[cartId] = computed;
  await writePlatformDb(db);
  return computed;
}

export async function getOrderByReference(orderRef: string): Promise<OrderRecord | undefined> {
  const db = await readPlatformDb();
  const normalized = (orderRef || '').trim().toUpperCase();
  return db.orders.find(
    (o) => o.orderReference.toUpperCase() === normalized || o.id.toUpperCase() === normalized,
  );
}

export async function createPropertyAdmin(
  input: Partial<PropertyRecord> & { title: string; monthlyRate: number },
  actorEmail: string,
) {
  if (!input.title?.trim()) {
    throw new Error('Property title is required.');
  }
  const monthlyRate = Math.max(500, Math.round(Number(input.monthlyRate) || 2500));
  const db = await readPlatformDb();
  const idSlug = (input.id || input.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);
  const id = db.properties.some((p) => p.id === idSlug)
    ? `${idSlug}-${Date.now().toString().slice(-4)}`
    : idSlug || `prop-${Date.now().toString().slice(-5)}`;

  const bedrooms = Math.max(1, Math.round(Number(input.bedrooms) || 1));
  const bathrooms = Math.max(1, Number(input.bathrooms) || 1);
  const rawProp: PropertyRecord = {
    id,
    code: input.code?.trim() || `#${(db.properties.length + 1).toString().padStart(2, '0')}`,
    unitNumber: input.unitNumber?.trim() || `Residence ${db.properties.length + 1}`,
    slug: input.slug?.trim() || id,
    title: input.title.trim(),
    category: input.category?.trim() || 'Furnished Residence • Short & Extended Stays',
    shortDesc:
      input.shortDesc?.trim() ||
      `Curated ${bedrooms}-bedroom furnished residence with high-speed Wi-Fi and full kitchen.`,
    fullDesc:
      input.fullDesc?.trim() ||
      input.shortDesc?.trim() ||
      `Professionally managed ${bedrooms}-bedroom, ${bathrooms}-bathroom residence operated by Easy Travel Lodging.`,
    bedrooms,
    bathrooms,
    floor: input.floor === 'Upstairs' ? 'Upstairs' : 'Downstairs',
    location: input.location?.trim() || 'Rancho Cordova / Greater Sacramento, CA',
    monthlyRate,
    startingRate: `From $${monthlyRate.toLocaleString()} / Month`,
    pricingNote:
      input.pricingNote?.trim() ||
      'Includes utilities, high-speed Wi-Fi, and reserved parking. Available for short stays and 30+ day extended stays.',
    status: input.status && ['Available', 'Inquired', 'Reserved'].includes(input.status) ? input.status : 'Available',
    sqft: input.sqft?.trim() || `${bedrooms * 480 + 220} sq ft`,
    liveUrl: input.liveUrl?.trim() || undefined,
    images:
      Array.isArray(input.images) && input.images.filter(Boolean).length > 0
        ? input.images.map((u) => u.trim()).filter(Boolean)
        : ['https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg'],
    features:
      Array.isArray(input.features) && input.features.length > 0
        ? input.features.map((f) => f.trim()).filter(Boolean)
        : ['Full kitchen with cookware', 'In-unit washer and dryer', 'High-speed Wi-Fi'],
    amenities:
      Array.isArray(input.amenities) && input.amenities.length > 0
        ? input.amenities.map((a) => a.trim()).filter(Boolean)
        : ['WiFi', 'TV', 'Air Conditioning', 'Bathroom', 'In-Unit Washer/Dryer'],
    minimumStayDays: Math.max(1, Math.round(Number(input.minimumStayDays) || 5)),
    maximumStayDays: Math.max(5, Math.round(Number(input.maximumStayDays) || 365)),
    maxGuests: input.maxGuests ? Math.max(1, Math.round(Number(input.maxGuests))) : undefined,
    propertyType: input.propertyType?.trim() || undefined,
    verified: input.verified !== undefined ? Boolean(input.verified) : false,
    facilities: Array.isArray(input.facilities) ? input.facilities.map((f) => f.trim()).filter(Boolean) : undefined,
    videoTourUrl: input.videoTourUrl?.trim() || '',
    videoPosterUrl: input.videoPosterUrl?.trim() || '',
    bedroomsDetail: Array.isArray(input.bedroomsDetail) ? input.bedroomsDetail : undefined,
    seasonalPricing: Array.isArray(input.seasonalPricing) ? input.seasonalPricing : undefined,
    blockedDates: Array.isArray(input.blockedDates) ? input.blockedDates : [],
    locationInfo: input.locationInfo,
  };

  const created = enrichPropertyRecord(rawProp);
  db.properties.unshift(created);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'PROPERTY_LISTING_CREATED',
    targetId: created.id,
    details: `Created property "${created.title}" (${created.unitNumber}) at $${created.monthlyRate}/mo.`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return created;
}

export async function updatePropertyAdmin(
  propertyId: string,
  updates: Partial<PropertyRecord>,
  actorEmail: string,
) {
  const db = await readPlatformDb();
  const prop = db.properties.find((p) => p.id === propertyId);
  if (!prop) throw new Error('Residence not found');

  if (updates.title?.trim()) prop.title = updates.title.trim();
  if (updates.unitNumber?.trim()) prop.unitNumber = updates.unitNumber.trim();
  if (updates.code?.trim()) prop.code = updates.code.trim();
  if (updates.category?.trim()) prop.category = updates.category.trim();
  if (updates.propertyType !== undefined) prop.propertyType = updates.propertyType.trim();
  if (updates.location?.trim()) prop.location = updates.location.trim();
  if (updates.sqft !== undefined) prop.sqft = updates.sqft.trim();
  if (updates.floor && ['Downstairs', 'Upstairs'].includes(updates.floor)) {
    prop.floor = updates.floor;
  }
  if (typeof updates.bedrooms === 'number' && updates.bedrooms >= 1) {
    prop.bedrooms = Math.round(updates.bedrooms);
  }
  if (typeof updates.bathrooms === 'number' && updates.bathrooms >= 1) {
    prop.bathrooms = Number(updates.bathrooms);
  }
  if (typeof updates.maxGuests === 'number' && updates.maxGuests >= 1) {
    prop.maxGuests = Math.round(updates.maxGuests);
  }
  if (typeof updates.verified === 'boolean') {
    prop.verified = updates.verified;
  }
  if (updates.shortDesc?.trim()) prop.shortDesc = updates.shortDesc.trim();
  if (updates.fullDesc?.trim()) prop.fullDesc = updates.fullDesc.trim();
  if (typeof updates.monthlyRate === 'number' && updates.monthlyRate > 0) {
    prop.monthlyRate = Math.round(updates.monthlyRate);
    prop.startingRate = `From $${prop.monthlyRate.toLocaleString()} / Month`;
  }
  if (updates.pricingNote !== undefined && updates.pricingNote.trim()) {
    prop.pricingNote = updates.pricingNote.trim();
  }
  if (updates.status && ['Available', 'Inquired', 'Reserved'].includes(updates.status)) {
    prop.status = updates.status;
  }
  if (typeof updates.minimumStayDays === 'number' && updates.minimumStayDays >= 1) {
    prop.minimumStayDays = Math.round(updates.minimumStayDays);
  }
  if (typeof updates.maximumStayDays === 'number' && updates.maximumStayDays >= 5) {
    prop.maximumStayDays = Math.round(updates.maximumStayDays);
  }
  if (Array.isArray(updates.images) && updates.images.length > 0) {
    prop.images = updates.images.map((u) => u.trim()).filter(Boolean);
  }
  if (Array.isArray(updates.amenities)) {
    prop.amenities = updates.amenities.map((a) => a.trim()).filter(Boolean);
  }
  if (Array.isArray(updates.features)) {
    prop.features = updates.features.map((f) => f.trim()).filter(Boolean);
  }
  if (Array.isArray(updates.facilities)) {
    prop.facilities = updates.facilities.map((f) => f.trim()).filter(Boolean);
  }
  if (updates.videoTourUrl !== undefined) {
    prop.videoTourUrl = updates.videoTourUrl.trim();
  }
  if (updates.videoPosterUrl !== undefined) {
    prop.videoPosterUrl = updates.videoPosterUrl.trim();
  }
  if (Array.isArray(updates.bedroomsDetail)) {
    prop.bedroomsDetail = updates.bedroomsDetail;
  }
  if (Array.isArray(updates.seasonalPricing)) {
    prop.seasonalPricing = updates.seasonalPricing;
  }
  if (Array.isArray(updates.blockedDates)) {
    prop.blockedDates = updates.blockedDates;
  }
  if (updates.locationInfo && typeof updates.locationInfo === 'object') {
    prop.locationInfo = {
      ...(prop.locationInfo || {
        neighborhood: prop.location,
        city: 'Sacramento',
        state: 'CA',
        addressDisclosureRestricted: true,
        nearbyAttractions: [],
      }),
      ...updates.locationInfo,
    };
  }

  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'PROPERTY_LISTING_UPDATED',
    targetId: propertyId,
    details: `Updated ${prop.unitNumber} (${prop.title}): rate=$${prop.monthlyRate}/mo, status=${prop.status}.`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return enrichPropertyRecord(prop);
}

export async function listPropertyReviews(propertyId?: string): Promise<PropertyReviewRecord[]> {
  const db = await readPlatformDb();
  const all = Array.isArray(db.reviews) ? db.reviews : [];
  const filtered = propertyId ? all.filter((r) => r.propertyId === propertyId) : all;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createPropertyReview(input: {
  propertyId: string;
  customerId: string;
  customerEmail: string;
  authorName: string;
  authorRole?: string;
  stayContext?: string;
  rating: number;
  title?: string;
  content: string;
}): Promise<PropertyReviewRecord> {
  const content = (input.content || '').trim();
  if (content.length < 15) {
    throw new Error('Please write at least 15 characters sharing your genuine experience.');
  }
  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));

  const db = await readPlatformDb();
  const prop = db.properties.find((p) => p.id === input.propertyId);
  if (!prop) throw new Error('Property not found.');

  if (!Array.isArray(db.reviews)) db.reviews = [];

  const emailLower = input.customerEmail.toLowerCase().trim();
  const hasVerifiedStay = db.bookings.some(
    (b) =>
      b.propertyId === prop.id &&
      !['cancelled', 'refunded'].includes(b.status) &&
      (b.customerId === input.customerId || b.guestEmail.toLowerCase().trim() === emailLower),
  );

  const review: PropertyReviewRecord = {
    id: `rev_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`,
    propertyId: prop.id,
    customerId: input.customerId,
    authorName: input.authorName.trim(),
    authorRole: input.authorRole?.trim() || undefined,
    stayContext: input.stayContext?.trim() || undefined,
    rating,
    title: input.title?.trim() || undefined,
    content,
    verifiedBooking: hasVerifiedStay,
    createdAt: new Date().toISOString(),
  };

  db.reviews.unshift(review);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: emailLower,
    action: 'PROPERTY_REVIEW_SUBMITTED',
    targetId: review.id,
    details: `${review.authorName} submitted ${review.rating}-star review on ${prop.unitNumber} (verifiedStay=${hasVerifiedStay}).`,
    createdAt: review.createdAt,
  });
  await writePlatformDb(db);
  return review;
}

export async function deletePropertyReviewAdmin(reviewId: string, actorEmail: string) {
  const db = await readPlatformDb();
  if (!Array.isArray(db.reviews)) throw new Error('Review not found');
  const idx = db.reviews.findIndex((r) => r.id === reviewId);
  if (idx === -1) throw new Error('Review not found');
  const [removed] = db.reviews.splice(idx, 1);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'PROPERTY_REVIEW_DELETED',
    targetId: reviewId,
    details: `Removed review by ${removed.authorName} on ${removed.propertyId}.`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return removed;
}

export async function createCatalogItemAdmin(
  input: {
    sku?: string;
    itemType?: 'addon_service' | 'unit_package';
    category: string;
    title: string;
    shortDesc: string;
    fullDesc?: string;
    priceUsd: number;
    billingUnitLabel?: string;
    unitsIncluded?: number;
    image?: string;
    available?: boolean;
    maxQuantity?: number;
    featured?: boolean;
    highlights?: string[];
  },
  actorEmail: string,
) {
  if (!input.title?.trim() || !input.category?.trim()) {
    throw new Error('Title and category are required.');
  }
  const priceUsd = Number(input.priceUsd);
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
    throw new Error('Price must be greater than $0.');
  }

  const db = await readPlatformDb();
  const nowIso = new Date().toISOString();
  const itemType = input.itemType === 'unit_package' ? 'unit_package' : 'addon_service';
  const item: CatalogServiceItem = {
    id: `srv_${Date.now().toString().slice(-6)}`,
    sku: (input.sku || `ETL-${Date.now().toString().slice(-4)}`).trim().toUpperCase(),
    itemType,
    category: input.category.trim(),
    title: input.title.trim(),
    shortDesc: input.shortDesc?.trim() || input.title.trim(),
    fullDesc: input.fullDesc?.trim() || input.shortDesc?.trim() || input.title.trim(),
    priceUsd: roundCurrency(priceUsd),
    billingUnitLabel: input.billingUnitLabel?.trim() || (itemType === 'unit_package' ? 'per package' : 'per service'),
    unitsIncluded:
      itemType === 'unit_package'
        ? Math.max(1, Number(input.unitsIncluded) || Math.round(priceUsd / 100))
        : undefined,
    image:
      input.image?.trim() ||
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg',
    available: input.available !== false,
    maxQuantity: Math.max(1, Number(input.maxQuantity) || 10),
    featured: Boolean(input.featured),
    highlights:
      Array.isArray(input.highlights) && input.highlights.length > 0
        ? input.highlights.map((h) => h.trim()).filter(Boolean)
        : ['Professionally coordinated by Easy Travel Lodging local operations'],
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  db.catalogItems.unshift(item);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'CATALOG_ITEM_CREATED',
    targetId: item.id,
    details: `Created catalog listing "${item.title}" ($${item.priceUsd.toLocaleString()}).`,
    createdAt: nowIso,
  });
  await writePlatformDb(db);
  return item;
}

export async function updateCatalogItemAdmin(
  itemId: string,
  updates: Partial<CatalogServiceItem>,
  actorEmail: string,
) {
  const db = await readPlatformDb();
  const item = db.catalogItems.find((c) => c.id === itemId);
  if (!item) throw new Error('Catalog item not found');

  if (updates.title?.trim()) item.title = updates.title.trim();
  if (updates.category?.trim()) item.category = updates.category.trim();
  if (updates.sku?.trim()) item.sku = updates.sku.trim().toUpperCase();
  if (updates.shortDesc?.trim()) item.shortDesc = updates.shortDesc.trim();
  if (updates.fullDesc?.trim()) item.fullDesc = updates.fullDesc.trim();
  if (typeof updates.priceUsd === 'number' && updates.priceUsd > 0) item.priceUsd = roundCurrency(updates.priceUsd);
  if (updates.billingUnitLabel?.trim()) item.billingUnitLabel = updates.billingUnitLabel.trim();
  if (updates.image?.trim()) item.image = updates.image.trim();
  if (typeof updates.available === 'boolean') item.available = updates.available;
  if (typeof updates.featured === 'boolean') item.featured = updates.featured;
  if (typeof updates.maxQuantity === 'number' && updates.maxQuantity >= 1) {
    item.maxQuantity = Math.round(updates.maxQuantity);
  }
  if (typeof updates.unitsIncluded === 'number' && updates.unitsIncluded >= 1) {
    item.unitsIncluded = Math.round(updates.unitsIncluded);
  }
  if (Array.isArray(updates.highlights)) {
    item.highlights = updates.highlights.map((h) => h.trim()).filter(Boolean);
  }
  item.updatedAt = new Date().toISOString();

  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'CATALOG_ITEM_UPDATED',
    targetId: item.id,
    details: `Updated catalog item "${item.title}" ($${item.priceUsd}, available=${item.available}).`,
    createdAt: item.updatedAt,
  });
  await writePlatformDb(db);
  return item;
}

export async function deleteCatalogItemAdmin(itemId: string, actorEmail: string) {
  const db = await readPlatformDb();
  const idx = db.catalogItems.findIndex((c) => c.id === itemId);
  if (idx === -1) throw new Error('Catalog item not found');
  const [removed] = db.catalogItems.splice(idx, 1);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'CATALOG_ITEM_DELETED',
    targetId: itemId,
    details: `Removed catalog listing "${removed.title}".`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return removed;
}

export async function createPromoCodeAdmin(
  input: {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minSubtotalUsd?: number;
    maxDiscountUsd?: number;
    expiresAt?: string;
  },
  actorEmail: string,
) {
  const code = (input.code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (!code || code.length < 3) throw new Error('Promo code must be at least 3 alphanumeric characters.');
  const discountValue = Number(input.discountValue);
  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    throw new Error('Discount value must be greater than 0.');
  }
  if (input.discountType === 'percentage' && discountValue > 80) {
    throw new Error('Percentage discount cannot exceed 80%.');
  }

  const db = await readPlatformDb();
  if (db.promoCodes.some((p) => p.code.toUpperCase() === code)) {
    throw new Error(`Promo code "${code}" already exists.`);
  }

  const promo: PromoCodeRecord = {
    id: `prm_${Date.now().toString().slice(-6)}`,
    code,
    description: input.description?.trim() || `${code} promotional savings`,
    discountType: input.discountType === 'percentage' ? 'percentage' : 'fixed',
    discountValue,
    minSubtotalUsd: Math.max(0, Number(input.minSubtotalUsd) || 0),
    maxDiscountUsd:
      input.maxDiscountUsd && Number(input.maxDiscountUsd) > 0 ? Number(input.maxDiscountUsd) : undefined,
    active: true,
    usageCount: 0,
    expiresAt: input.expiresAt || undefined,
    createdAt: new Date().toISOString(),
  };

  db.promoCodes.unshift(promo);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'PROMO_CODE_CREATED',
    targetId: promo.id,
    details: `Created promo code ${promo.code} (${
      promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`
    } off).`,
    createdAt: promo.createdAt,
  });
  await writePlatformDb(db);
  return promo;
}

export async function updatePromoCodeAdmin(
  promoId: string,
  updates: Partial<Pick<PromoCodeRecord, 'active' | 'description' | 'discountValue' | 'minSubtotalUsd' | 'maxDiscountUsd'>>,
  actorEmail: string,
) {
  const db = await readPlatformDb();
  const promo = db.promoCodes.find((p) => p.id === promoId);
  if (!promo) throw new Error('Promo code not found');

  if (typeof updates.active === 'boolean') promo.active = updates.active;
  if (updates.description?.trim()) promo.description = updates.description.trim();
  if (typeof updates.discountValue === 'number' && updates.discountValue > 0) {
    promo.discountValue = updates.discountValue;
  }
  if (typeof updates.minSubtotalUsd === 'number' && updates.minSubtotalUsd >= 0) {
    promo.minSubtotalUsd = updates.minSubtotalUsd;
  }
  if (updates.maxDiscountUsd !== undefined) {
    promo.maxDiscountUsd = updates.maxDiscountUsd > 0 ? updates.maxDiscountUsd : undefined;
  }

  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'PROMO_CODE_UPDATED',
    targetId: promo.id,
    details: `Updated promo code ${promo.code} (active=${promo.active}).`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return promo;
}

export async function deletePromoCodeAdmin(promoId: string, actorEmail: string) {
  const db = await readPlatformDb();
  const idx = db.promoCodes.findIndex((p) => p.id === promoId);
  if (idx === -1) throw new Error('Promo code not found');
  const [removed] = db.promoCodes.splice(idx, 1);
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'PROMO_CODE_DELETED',
    targetId: promoId,
    details: `Deleted promo code ${removed.code}.`,
    createdAt: new Date().toISOString(),
  });
  await writePlatformDb(db);
  return removed;
}

export async function getAdminOverview() {
  const db = await readPlatformDb();

  const succeededPaymentsTotal = db.payments
    .filter((payment) => payment.status === 'succeeded')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingWireAmount = db.manualPayments
    .filter((m) => m.status === 'pending_verification')
    .reduce((sum, m) => sum + m.amountUsd, 0);

  const paidOrders = db.orders.filter((o) => o.paymentStatus === 'paid');
  const pendingOrders = db.orders.filter((o) =>
    ['pending_payment', 'pending_verification'].includes(o.paymentStatus),
  );
  const orderRevenueUsd = roundCurrency(paidOrders.reduce((sum, o) => sum + o.totalUsd, 0));
  const averageOrderValueUsd =
    db.orders.length > 0
      ? roundCurrency(db.orders.reduce((sum, o) => sum + o.totalUsd, 0) / db.orders.length)
      : 0;

  return {
    totalProperties: db.properties.length,
    totalBookings: db.bookings.length,
    activeBookings: db.bookings.filter((booking) => !['cancelled', 'refunded', 'completed'].includes(booking.status)).length,
    pendingBookings: db.bookings.filter((booking) => booking.status === 'pending' || booking.status === 'awaiting_payment').length,
    confirmedBookings: db.bookings.filter((booking) => booking.status === 'confirmed').length,
    totalVehicleBookings: db.vehicleBookings.length,
    activeVehicleBookings: db.vehicleBookings.filter((v) => ['confirmed', 'active'].includes(v.status)).length,
    pendingWireCount: db.manualPayments.filter((m) => m.status === 'pending_verification').length,
    pendingWireAmount,
    newInquiriesCount: db.inquiries.filter((i) => i.status === 'new').length,
    totalRevenue: succeededPaymentsTotal,
    totalOrders: db.orders.length,
    paidOrdersCount: paidOrders.length,
    pendingOrdersCount: pendingOrders.length,
    orderRevenueUsd,
    averageOrderValueUsd,
    activeCatalogCount: db.catalogItems.filter((c) => c.available).length,
    activePromoCount: db.promoCodes.filter((p) => p.active).length,
  };
}
