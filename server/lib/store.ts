import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashPassword } from '../auth.js';
import { defaultProperties } from '../data/seed.js';
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
  bankName: process.env.PAYMENT_BANK_NAME || 'JPMorgan Chase Bank, N.A.',
  accountName: process.env.PAYMENT_ACCOUNT_NAME || 'Easy Travel Lodging LLC',
  accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER || '7890123456',
  achRoutingNumber: process.env.PAYMENT_ROUTING_NUMBER || '322271627',
  wireRoutingNumber: '021000021',
  swiftCode: process.env.PAYMENT_WIRE_SWIFT || 'CHASUS33',
  bankAddress: '400 Capitol Mall, Suite 100, Sacramento, CA 95814',
  zelleEmail: process.env.PAYMENT_ZELLE || 'billing@easytravellodging.com',
  zelleRecipient: 'Easy Travel Lodging LLC — Corporate Housing Treasury',
  paymentInstructions:
    'Include your Client Email or Booking Reference Code (e.g. bk_rec_914 or ETL-WIRE) in the wire memo field. Upload your transfer confirmation receipt so our treasury team can verify and credit your account within 2–4 business hours.',
  updatedAt: '2026-10-01T16:00:00.000Z',
};

function buildDefaultBookings(): BookingRecord[] {
  return [
    {
      id: 'bk_rec_914',
      propertyId: 'unit-250',
      guestName: 'Dr. Marcus Vance',
      guestEmail: 'client@easytravellodging.com',
      guestPhone: '(916) 426-3655',
      employer: 'UC Davis Health Medical Center',
      role: 'Visiting Surgery Fellow',
      checkIn: '2026-12-17',
      checkOut: '2027-01-16',
      adults: 1,
      children: 0,
      status: 'awaiting_payment',
      unitCostUnits: 28,
      unitCostUsd: 2800,
      notes: 'Q1 surgical rotation extension — upstairs 2BR suite requested',
      totalNights: 30,
      createdAt: '2026-10-29T18:20:00.000Z',
      paymentProvider: 'manual',
    },
    {
      id: 'bk_rec_910',
      propertyId: 'unit-173',
      guestName: 'Dr. Marcus Vance',
      guestEmail: 'client@easytravellodging.com',
      guestPhone: '(916) 426-3655',
      employer: 'UC Davis Health Medical Center',
      role: 'Visiting Surgery Fellow',
      checkIn: '2026-11-05',
      checkOut: '2026-12-05',
      adults: 1,
      children: 0,
      status: 'confirmed',
      unitCostUnits: 25,
      unitCostUsd: 2500,
      notes: 'Reserved for visiting executive assignment | [Internal Settlement: Paid with 25 units from Dr. Marcus Vance balance]',
      totalNights: 30,
      createdAt: '2026-10-25T14:10:00.000Z',
      paymentProvider: 'unit_balance',
      paymentReference: 'tx_pay_1793481994_818',
    },
    {
      id: 'bk_corp_402',
      propertyId: 'unit-333',
      guestName: 'Dr. Elena Rostova',
      guestEmail: 'elena.rostova@kp.org',
      guestPhone: '(916) 555-0194',
      employer: 'Kaiser Permanente Morse Ave',
      role: 'Cardiology Specialist',
      checkIn: '2026-12-02',
      checkOut: '2027-02-01',
      adults: 2,
      children: 0,
      status: 'confirmed',
      unitCostUnits: 56,
      unitCostUsd: 5600,
      notes: '60-day cardiology assignment • Direct hospital corporate wire verified',
      totalNights: 61,
      createdAt: '2026-10-20T19:45:00.000Z',
      paymentProvider: 'manual',
      paymentReference: 'WIRE-KP-88412',
    },
  ];
}

function buildDefaultVehicleBookings(): VehicleBookingRecord[] {
  return [
    {
      id: 'vbk_701',
      vehicleId: 'tesla-model-y',
      vehicleName: 'Tesla Model Y Performance',
      exteriorColorName: 'Deep Metallic Blue',
      exteriorColorHex: '#1e40af',
      customerName: 'Dr. Marcus Vance',
      customerEmail: 'client@easytravellodging.com',
      customerPhone: '(916) 426-3655',
      employer: 'UC Davis Health Medical Center',
      pickupDate: '2026-11-05',
      returnDate: '2026-11-12',
      totalDays: 7,
      pickupLocation: 'Direct Delivery to ETL Rancho Cordova Suite (Unit 173)',
      protectionPlan: 'standard',
      rateTier: 'weekly',
      totalUsd: 640,
      unitsRequired: 7,
      paymentMethod: 'manual_wire',
      status: 'awaiting_payment',
      notes: 'Deliver charged to 90% at Unit 173 covered parking space #B.',
      createdAt: '2026-10-28T20:15:00.000Z',
    },
    {
      id: 'vbk_698',
      vehicleId: 'cadillac-escalade',
      vehicleName: 'Cadillac Escalade ESV Platinum',
      exteriorColorName: 'Black Raven',
      exteriorColorHex: '#09090b',
      customerName: 'Dr. Elena Rostova',
      customerEmail: 'elena.rostova@kp.org',
      customerPhone: '(916) 555-0194',
      employer: 'Kaiser Permanente Morse Ave',
      pickupDate: '2026-12-02',
      returnDate: '2027-01-01',
      totalDays: 30,
      pickupLocation: 'SMF Sacramento Int’l Airport Concierge Delivery',
      protectionPlan: 'executive_shield',
      rateTier: 'monthly',
      totalUsd: 4640,
      unitsRequired: 47,
      paymentMethod: 'manual_wire',
      status: 'confirmed',
      paymentReference: 'WIRE-KP-88490',
      notes: 'Flight arrives Terminal B at 1:40 PM.',
      createdAt: '2026-10-21T16:00:00.000Z',
    },
  ];
}

function buildDefaultManualPayments(): ManualPaymentRecord[] {
  return [
    {
      id: 'mpay_301',
      referenceCode: 'ETL-WIRE-9042',
      customerId: 'cust_demo_01',
      customerName: 'Dr. Marcus Vance',
      customerEmail: 'client@easytravellodging.com',
      targetType: 'units',
      unitsRequested: 30,
      amountUsd: 3000,
      paymentMethod: 'Wire Transfer',
      senderName: 'UC Davis Health Medical Group Stipend',
      originatingBank: 'Wells Fargo Institutional Treasury',
      wireReference: 'IMAD-20261030-883920',
      transferDate: '2026-10-30',
      receiptFileName: 'ucd_stipend_wire_3000.pdf',
      notes: 'Q1 housing & fleet unit reload for Dr. Marcus Vance',
      status: 'pending_verification',
      createdAt: '2026-10-30T21:10:00.000Z',
    },
    {
      id: 'mpay_295',
      referenceCode: 'ETL-WIRE-8810',
      customerName: 'Dr. Elena Rostova',
      customerEmail: 'elena.rostova@kp.org',
      targetType: 'housing_booking',
      targetId: 'bk_corp_402',
      unitsRequested: 56,
      amountUsd: 5600,
      paymentMethod: 'Direct ACH',
      senderName: 'Kaiser Foundation Hospitals AP',
      originatingBank: 'Bank of America Corporate',
      wireReference: 'ACH-KP-20261020-402',
      transferDate: '2026-10-20',
      receiptFileName: 'kp_ach_remittance_5600.pdf',
      notes: 'Unit 333 60-day lease settlement',
      status: 'verified',
      adminNotes: 'Funds settled in Chase Operating #7890123456. Lease confirmed.',
      verifiedBy: 'admin@easytravellodging.com',
      verifiedAt: '2026-10-21T09:30:00.000Z',
      createdAt: '2026-10-20T20:05:00.000Z',
    },
  ];
}

function buildDefaultPayments(): PaymentRecord[] {
  return [
    {
      id: 'pay_8810',
      bookingId: 'bk_corp_402',
      amount: 5600,
      currency: 'USD',
      status: 'succeeded',
      provider: 'manual',
      reference: 'WIRE-KP-88412',
      createdAt: '2026-10-21T09:30:00.000Z',
    },
    {
      id: 'pay_8815',
      bookingId: 'bk_rec_910',
      amount: 2500,
      currency: 'USD',
      status: 'succeeded',
      provider: 'unit_balance',
      reference: 'tx_pay_1793481994_818',
      createdAt: '2026-10-31T21:26:34.000Z',
    },
  ];
}

function buildDefaultNotifications(): NotificationRecord[] {
  return [
    {
      id: 'ntf_101',
      recipientEmail: 'client@easytravellodging.com',
      title: 'Unit 173 Keyless Check-In Provisioned',
      message: 'Your stay for Unit 173 (#B) is confirmed. Smart-lock code and parking pass instructions will activate at 2:00 PM on check-in day.',
      category: 'booking',
      read: false,
      createdAt: '2026-10-29T15:00:00.000Z',
    },
    {
      id: 'ntf_102',
      recipientEmail: 'client@easytravellodging.com',
      title: 'Wire Transfer Notice Received (ETL-WIRE-9042)',
      message: 'We received your $3,000.00 wire notice (30 Lodging Units). Treasury verification typically completes within 2–4 business hours.',
      category: 'payment',
      read: false,
      createdAt: '2026-10-30T21:11:00.000Z',
    },
  ];
}

function buildDefaultAuditLogs(): AuditLogRecord[] {
  return [
    {
      id: 'aud_01',
      actorEmail: 'admin@easytravellodging.com',
      action: 'PAYMENT_VERIFIED',
      targetId: 'mpay_295',
      details: 'Verified $5,600.00 Direct ACH from Kaiser Foundation Hospitals AP for booking bk_corp_402.',
      createdAt: '2026-10-21T09:30:00.000Z',
    },
    {
      id: 'aud_02',
      actorEmail: 'client@easytravellodging.com',
      action: 'UNIT_BALANCE_SETTLEMENT',
      targetId: 'bk_rec_910',
      details: 'Settled Unit 173 stay (bk_rec_910) with 25 dashboard units ($2,500.00).',
      createdAt: '2026-10-31T21:26:34.000Z',
    },
  ];
}

export const VEHICLE_THUMBNAILS: Record<string, string> = {
  'ford-mustang-gt': 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=900&q=80',
  'tesla-model-y': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
  'chevy-suburban': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  'cadillac-escalade': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
  'jeep-wrangler': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
};

const defaultCatalogItems: CatalogServiceItem[] = [
  {
    id: 'srv-airport-chauffeur',
    sku: 'ETL-SRV-SMF',
    itemType: 'addon_service',
    category: 'Arrival & Concierge',
    title: 'SMF Airport Meet-and-Greet & Private Transfer',
    shortDesc:
      'Direct private pickup from Sacramento International Airport (SMF) to your residence with luggage assistance and smart-lock check-in.',
    fullDesc:
      'Skip rideshare queues after your flight. Our local concierge tracks your arrival into Sacramento International Airport (SMF), meets you curbside at Terminal A or B, assists with luggage, and delivers you directly to your prepared residence.',
    priceUsd: 145,
    billingUnitLabel: 'per transfer',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4864.jpg',
    available: true,
    maxQuantity: 6,
    featured: true,
    highlights: [
      'Real-time flight tracking for Terminal A & Terminal B arrivals',
      'Direct drop-off at your residence with keycode walkthrough',
      'Accommodates up to 4 passengers and full luggage',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-remote-workstation',
    sku: 'ETL-SRV-DESK',
    itemType: 'addon_service',
    category: 'Workspace & Technology',
    title: 'Ergonomic Dual-Monitor Home Office Package',
    shortDesc:
      '27-inch QHD monitor, ergonomic task chair, USB-C docking station, wireless keyboard/mouse, and surge-protected desk lamp installed before arrival.',
    fullDesc:
      'Turn your residence into a productive home office from day one. Ideal for remote workers, visiting faculty, consultants, or anyone managing projects from home, this package is set up and tested prior to check-in.',
    priceUsd: 180,
    billingUnitLabel: 'per stay',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_115.jpg',
    available: true,
    maxQuantity: 4,
    featured: true,
    highlights: [
      '27-inch QHD display with universal USB-C & HDMI hub',
      'Adjustable lumbar office chair & task lighting',
      'Pre-installed and cable-managed prior to arrival',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-midstay-refresh',
    sku: 'ETL-SRV-CLEAN',
    itemType: 'addon_service',
    category: 'Housekeeping & Care',
    title: 'Scheduled Mid-Stay Housekeeping & Linen Refresh',
    shortDesc:
      'Complete residence cleaning, fresh hotel-grade bed linens, plush towel replacement, and kitchen/bath restocking.',
    fullDesc:
      'Keep your apartment feeling fresh throughout a multi-week or multi-month visit. Our trusted local housekeeping team coordinates a convenient two-hour window to clean living spaces, refresh bedding and bath linens, and replenish household essentials.',
    priceUsd: 165,
    billingUnitLabel: 'per session',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2936.jpg',
    available: true,
    maxQuantity: 12,
    featured: false,
    highlights: [
      'Full kitchen, bath, and living area cleaning',
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
    category: 'Arrival & Concierge',
    title: 'Arrival Pantry & Local Artisan Welcome Provisioning',
    shortDesc:
      'Stocked refrigerator and pantry essentials—local Sacramento roast coffee, breakfast staples, fresh fruit, sparkling water, and snacks.',
    fullDesc:
      'Arrive to a stocked kitchen without needing an immediate grocery trip. Especially popular with families arriving late, relocating households, and busy travelers, our welcome provisioning stocks fresh produce, breakfast items, artisan coffee, and beverages before you unlock the door.',
    priceUsd: 135,
    billingUnitLabel: 'per arrival basket',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-2_kitchen_sink.jpg',
    available: true,
    maxQuantity: 4,
    featured: false,
    highlights: [
      'Local Northern California coffee, teas, and filtered beverages',
      'Fresh seasonal fruit, breakfast staples, and snacks',
      'Dietary preferences accommodated via checkout notes',
    ],
    createdAt: '2026-10-01T16:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z',
  },
  {
    id: 'srv-pet-comfort',
    sku: 'ETL-SRV-PET',
    itemType: 'addon_service',
    category: 'Family & Pet Comfort',
    title: 'Approved Pet Welcome & Post-Stay Deep Sanitization',
    shortDesc:
      'Covers pet registration for approved residences, washable orthopedic pet bed, stainless bowls, and post-checkout allergen treatment.',
    fullDesc:
      'Bringing a four-legged family member along? Add our Pet Welcome & Sanitization package for pre-approved pet-friendly suites. Includes stainless food and water bowls, a clean pet mat, waste bags for neighborhood walks, and required post-stay HEPA allergen detailing.',
    priceUsd: 225,
    billingUnitLabel: 'per stay',
    image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5339.jpg',
    available: true,
    maxQuantity: 2,
    featured: false,
    highlights: [
      'Valid for pre-approved pet-friendly residences',
      'Includes bowls, washable mat, and local dog-park guide',
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
  return [
    {
      id: 'ord_901',
      orderReference: 'ORD-ETL-842105',
      customerId: 'cust_demo_01',
      customerName: 'Dr. Marcus Vance',
      customerEmail: 'client@easytravellodging.com',
      customerPhone: '(916) 426-3655',
      company: 'UC Davis Health Medical Center',
      role: 'Visiting Surgery Fellow',
      billingAddress: {
        line1: '2315 Stockton Blvd',
        city: 'Sacramento',
        state: 'CA',
        postalCode: '95817',
        country: 'United States',
      },
      guestNotes: 'Please set up the monitor on the bedroom desk before 3 PM arrival.',
      items: [
        {
          id: 'ci_seed_1',
          referenceId: 'srv-remote-workstation',
          itemType: 'addon_service',
          title: 'Ergonomic Dual-Monitor Home Office Package',
          subtitle: 'Workspace & Technology • per stay',
          category: 'Workspace & Technology',
          image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_115.jpg',
          unitPriceUsd: 180,
          quantity: 1,
          minQuantity: 1,
          maxQuantity: 4,
          quantityLabel: 'Qty',
          lineSubtotalUsd: 180,
          available: true,
        },
        {
          id: 'ci_seed_2',
          referenceId: 'srv-kitchen-provisioning',
          itemType: 'addon_service',
          title: 'Arrival Pantry & Local Artisan Welcome Provisioning',
          subtitle: 'Arrival & Concierge • per arrival basket',
          category: 'Arrival & Concierge',
          image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-2_kitchen_sink.jpg',
          unitPriceUsd: 135,
          quantity: 1,
          minQuantity: 1,
          maxQuantity: 4,
          quantityLabel: 'Qty',
          lineSubtotalUsd: 135,
          available: true,
        },
      ],
      promoCode: 'WELCOME10',
      subtotalUsd: 315,
      serviceFeeUsd: 0,
      taxUsd: 0,
      discountUsd: 31.5,
      totalUsd: 283.5,
      totalUnitsRequired: 3,
      paymentMethod: 'unit_balance',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      paymentReference: 'tx_pay_seed_901',
      linkedBookingIds: [],
      linkedVehicleBookingIds: [],
      verifiedBy: 'Unit Balance Ledger',
      verifiedAt: '2026-10-28T16:45:00.000Z',
      confirmationEmailSentAt: '2026-10-28T16:45:00.000Z',
      createdAt: '2026-10-28T16:45:00.000Z',
      updatedAt: '2026-10-28T16:45:00.000Z',
    },
    {
      id: 'ord_902',
      orderReference: 'ORD-ETL-849320',
      customerName: 'Hannah & David Morales',
      customerEmail: 'hmorales.family@example.com',
      customerPhone: '(916) 555-0182',
      company: 'Home Renovation Relocation',
      role: 'Homeowners',
      billingAddress: {
        line1: '1420 Crocker Dr',
        city: 'Folsom',
        state: 'CA',
        postalCode: '95630',
        country: 'United States',
      },
      guestNotes: 'Staying with two children during kitchen remodel in Folsom.',
      items: [
        {
          id: 'ci_seed_3',
          referenceId: 'unit-250',
          itemType: 'accommodation',
          title: 'Two-Bedroom Vaulted Upper Residence (Residence C)',
          subtitle: 'Unit 250 • Check-in 2026-12-01 → 2026-12-31 (30+ Day Tax-Exempt)',
          category: 'Family & Dual-Suite Residence • Short & Extended Stays',
          image: 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2936.jpg',
          unitPriceUsd: 2800,
          quantity: 1,
          minQuantity: 1,
          maxQuantity: 12,
          quantityLabel: 'Months (30-Day)',
          lineSubtotalUsd: 2800,
          available: true,
          metadata: {
            billingUnit: 'month',
            checkIn: '2026-12-01',
            checkOut: '2026-12-31',
            guests: 4,
          },
        },
      ],
      promoCode: 'EXTENDED250',
      subtotalUsd: 2800,
      serviceFeeUsd: 95,
      taxUsd: 0,
      discountUsd: 250,
      totalUsd: 2645,
      totalUnitsRequired: 27,
      paymentMethod: 'direct_ach',
      paymentStatus: 'pending_verification',
      orderStatus: 'pending',
      paymentReference: 'ACH-MORALES-1201',
      linkedBookingIds: [],
      linkedVehicleBookingIds: [],
      confirmationEmailSentAt: '2026-10-30T19:15:00.000Z',
      createdAt: '2026-10-30T19:15:00.000Z',
      updatedAt: '2026-10-30T19:15:00.000Z',
    },
  ];
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
    inquiries: [
      {
        id: 'inq_501',
        referenceCode: 'ETL-501882',
        type: 'contact',
        name: 'Sarah Jenkins, RN',
        email: 's.jenkins@sutterhealth.org',
        phone: '(916) 555-0148',
        company: 'Sutter Medical Center Sacramento',
        role: 'Travel Telemetry Nurse',
        propertyId: 'unit-91',
        moveInDate: '2026-11-18',
        duration: '90-180',
        message: 'Looking for ground-floor 1BR unit with quiet daytime environment for night-shift schedule.',
        status: 'new',
        createdAt: '2026-10-30T17:40:00.000Z',
      },
    ],
    notifications: buildDefaultNotifications(),
    auditLogs: buildDefaultAuditLogs(),
    catalogItems: defaultCatalogItems,
    promoCodes: defaultPromoCodes,
    carts: {},
    orders: buildDefaultOrders(),
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

  // Ensure default admin & staff accounts always exist
  const users = [...parsed.users];
  for (const defUser of defaultUsers) {
    if (!users.some((u) => u.email.toLowerCase() === defUser.email.toLowerCase())) {
      users.push(defUser);
    }
  }

  // Upgrade unedited legacy property copy while preserving any custom admin edits
  const properties = (parsed.properties?.length ? parsed.properties : defaultProperties).map((prop) => {
    const seeded = defaultProperties.find((d) => d.id === prop.id);
    if (
      seeded &&
      (prop.category === 'Holiday Apartment, Family Apartment' ||
        prop.pricingNote === 'May vary. Includes utilities and parking. Minimum stay 30 days.')
    ) {
      return {
        ...seeded,
        status: prop.status,
        monthlyRate: prop.monthlyRate,
        startingRate:
          prop.monthlyRate !== seeded.monthlyRate
            ? `From $${prop.monthlyRate.toLocaleString()} / Month`
            : seeded.startingRate,
      };
    }
    return prop;
  });

  return {
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
    catalogItems: parsed.catalogItems?.length ? parsed.catalogItems : defaultCatalogItems,
    promoCodes: parsed.promoCodes?.length ? parsed.promoCodes : defaultPromoCodes,
    carts: parsed.carts && typeof parsed.carts === 'object' ? parsed.carts : {},
    orders: Array.isArray(parsed.orders) ? parsed.orders : defaults.orders,
  };
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
  recipientEmail: string;
  title: string;
  message: string;
  category: NotificationRecord['category'];
}) {
  const db = await readPlatformDb();
  const item: NotificationRecord = {
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
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

export async function createBooking(input: {
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  notes?: string;
  employer?: string;
  role?: string;
  specialRequests?: string;
  paymentProvider?: 'manual' | 'stripe' | 'paypal' | 'unit_balance';
}): Promise<BookingRecord> {
  const db = await readPlatformDb();
  let property = db.properties.find((entry) => entry.id === input.propertyId);

  if (!property) {
    property = db.properties[0];
  }

  const start = new Date(input.checkIn);
  const end = new Date(input.checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Invalid date range');
  }
  if (end <= start) {
    throw new Error('Check-out must be after check-in');
  }

  const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
  const monthlyRate = property?.monthlyRate || 2500;
  const estimatedUsd = Math.max(500, Math.round((monthlyRate / 30) * nights));
  const estimatedUnits = Math.max(5, Math.ceil(estimatedUsd / 100));

  const booking: BookingRecord = {
    id: `bk_${Date.now().toString().slice(-6)}`,
    propertyId: property ? property.id : 'unit-91',
    guestName: input.guestName,
    guestEmail: input.guestEmail.trim(),
    guestPhone: input.guestPhone,
    employer: input.employer,
    role: input.role,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: input.adults ?? 1,
    children: input.children ?? 0,
    status: 'awaiting_payment',
    notes: input.notes,
    specialRequests: input.specialRequests,
    totalNights: nights,
    unitCostUsd: estimatedUsd,
    unitCostUnits: estimatedUnits,
    createdAt: new Date().toISOString(),
    paymentProvider: input.paymentProvider ?? 'manual',
  };

  db.bookings.unshift(booking);
  db.notifications.unshift({
    id: `ntf_${Date.now()}`,
    recipientEmail: booking.guestEmail.toLowerCase(),
    title: `Housing Inquiry Received (${booking.id})`,
    message: `Your request for ${property?.unitNumber || booking.propertyId} (${booking.checkIn} to ${booking.checkOut}) is ready for review or unit settlement.`,
    category: 'booking',
    read: false,
    createdAt: new Date().toISOString(),
  });
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: booking.guestEmail.toLowerCase(),
    action: 'HOUSING_BOOKING_CREATED',
    targetId: booking.id,
    details: `Submitted ${nights}-night stay inquiry for ${property?.unitNumber || booking.propertyId} ($${estimatedUsd.toLocaleString()}).`,
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
    id: `ntf_${Date.now()}`,
    recipientEmail: record.customerEmail.toLowerCase(),
    title: `Fleet Reservation Created (${record.id})`,
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
      const isAvailable = prop.status !== 'Reserved';
      if (!isAvailable) {
        validationIssues.push(`${prop.unitNumber} (${prop.title}) is currently reserved and unavailable.`);
      }
      const billingUnit = item.metadata?.billingUnit === 'night' ? 'night' : 'month';
      const minQuantity = billingUnit === 'night' ? Math.max(5, prop.minimumStayDays || 5) : 1;
      const maxQuantity = billingUnit === 'night' ? 29 : 12;
      const quantity = Math.min(maxQuantity, Math.max(minQuantity, Math.round(item.quantity || minQuantity)));
      const unitPriceUsd =
        billingUnit === 'night' ? Math.round(prop.monthlyRate / 30) : prop.monthlyRate;
      const lineSubtotalUsd = roundCurrency(unitPriceUsd * quantity);
      const checkIn = item.metadata?.checkIn || defaultStartIso(5);
      const stayDays = billingUnit === 'night' ? quantity : quantity * 30;
      const checkOut = addDaysIso(checkIn, stayDays);

      if (isAvailable) {
        subtotalUsd += lineSubtotalUsd;
        hasAccommodation = true;
        if (billingUnit === 'night' && stayDays < 30) {
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
        unavailableReason: isAvailable ? undefined : 'Currently Reserved',
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
    const minQty = billingUnit === 'night' ? Math.max(5, prop.minimumStayDays || 5) : 1;
    const maxQty = billingUnit === 'night' ? 29 : 12;
    if (requestedQty < minQty || requestedQty > maxQty) {
      throw new Error(
        billingUnit === 'night'
          ? `Short stays require between ${minQty} and ${maxQty} nights (choose Monthly for 30+ days).`
          : `Extended-stay months must be between ${minQty} and ${maxQty} months.`,
      );
    }

    const existingIdx = cart.items.findIndex(
      (i) => i.itemType === 'accommodation' && i.referenceId === prop.id,
    );
    const checkIn = input.metadata?.checkIn || defaultStartIso(5);
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

export async function updatePropertyAdmin(
  propertyId: string,
  updates: Partial<
    Pick<
      PropertyRecord,
      | 'title'
      | 'category'
      | 'shortDesc'
      | 'fullDesc'
      | 'monthlyRate'
      | 'pricingNote'
      | 'status'
      | 'minimumStayDays'
      | 'images'
    >
  >,
  actorEmail: string,
) {
  const db = await readPlatformDb();
  const prop = db.properties.find((p) => p.id === propertyId);
  if (!prop) throw new Error('Residence not found');

  if (updates.title?.trim()) prop.title = updates.title.trim();
  if (updates.category?.trim()) prop.category = updates.category.trim();
  if (updates.shortDesc?.trim()) prop.shortDesc = updates.shortDesc.trim();
  if (updates.fullDesc?.trim()) prop.fullDesc = updates.fullDesc.trim();
  if (typeof updates.monthlyRate === 'number' && updates.monthlyRate > 0) {
    prop.monthlyRate = Math.round(updates.monthlyRate);
    prop.startingRate = `From $${prop.monthlyRate.toLocaleString()} / Month`;
  }
  if (updates.pricingNote?.trim()) prop.pricingNote = updates.pricingNote.trim();
  if (updates.status && ['Available', 'Inquired', 'Reserved'].includes(updates.status)) {
    prop.status = updates.status;
  }
  if (typeof updates.minimumStayDays === 'number' && updates.minimumStayDays >= 1) {
    prop.minimumStayDays = Math.round(updates.minimumStayDays);
  }
  if (Array.isArray(updates.images) && updates.images.length > 0) {
    prop.images = updates.images.map((u) => u.trim()).filter(Boolean);
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
  return prop;
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
