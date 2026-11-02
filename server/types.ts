import type {
  BedroomDetail,
  BlockedDateRange,
  BookingAddonSelection,
  PropertyLocationInfo,
  PropertyReviewRecord,
  SeasonalPricingRule,
} from '../src/data/propertyEnrichment.js';

export type {
  BedroomDetail,
  BlockedDateRange,
  BookingAddonSelection,
  PropertyLocationInfo,
  PropertyReviewRecord,
  SeasonalPricingRule,
} from '../src/data/propertyEnrichment.js';

export type Role = 'guest' | 'admin' | 'staff';

export type BookingStatus = 'pending' | 'awaiting_payment' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type VehicleInventoryStatus = 'available' | 'rented' | 'maintenance';
export type VehicleBookingStatus = 'awaiting_payment' | 'confirmed' | 'active' | 'completed' | 'cancelled';
export type ManualPaymentStatus = 'pending_verification' | 'verified' | 'rejected';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  createdAt: string;
  isActive: boolean;
}

export interface PropertyRecord {
  id: string;
  code: string;
  unitNumber: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  bedrooms: number;
  bathrooms: number;
  floor: 'Downstairs' | 'Upstairs';
  location: string;
  monthlyRate: number;
  startingRate: string;
  pricingNote: string;
  status: 'Available' | 'Inquired' | 'Reserved';
  sqft: string;
  liveUrl?: string;
  images: string[];
  features: string[];
  amenities: string[];
  minimumStayDays: number;
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

export interface BookingRecord {
  id: string;
  customerId?: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  employer?: string;
  role?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants?: number;
  selectedAddons?: BookingAddonSelection[];
  accommodationSubtotalUsd?: number;
  addonsTotalUsd?: number;
  serviceFeeUsd?: number;
  taxUsd?: number;
  totalUsd?: number;
  status: BookingStatus;
  notes?: string;
  specialRequests?: string;
  totalNights: number;
  unitCostUnits?: number;
  unitCostUsd?: number;
  createdAt: string;
  paymentProvider?: 'manual' | 'stripe' | 'paypal' | 'unit_balance';
  paymentReference?: string;
}

export interface PaymentRecord {
  id: string;
  customerId?: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: 'manual' | 'stripe' | 'paypal' | 'unit_balance';
  reference?: string;
  createdAt: string;
}

export interface VehicleMaintenanceLog {
  id: string;
  serviceType: string;
  notes: string;
  costUsd: number;
  date: string;
  performedBy: string;
}

export interface VehicleInventoryRecord {
  id: string;
  name: string;
  make: string;
  category: string;
  year: number;
  licensePlate: string;
  mileage: number;
  hubLocation: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  inventoryStatus: VehicleInventoryStatus;
  maintenanceLogs: VehicleMaintenanceLog[];
}

export interface VehicleBookingRecord {
  id: string;
  customerId?: string;
  vehicleId: string;
  vehicleName: string;
  exteriorColorName: string;
  exteriorColorHex: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  employer?: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pickupLocation: string;
  protectionPlan: 'standard' | 'executive_shield';
  rateTier: 'daily' | 'weekly' | 'monthly';
  totalUsd: number;
  unitsRequired: number;
  paymentMethod: 'manual_wire' | 'unit_balance';
  status: VehicleBookingStatus;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
}

export type CatalogItemType = 'accommodation' | 'vehicle' | 'addon_service' | 'unit_package';
export type OrderPaymentMethod = 'unit_balance' | 'wire_transfer' | 'direct_ach' | 'zelle';
export type OrderPaymentStatus =
  | 'pending_payment'
  | 'pending_verification'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';

export interface CatalogServiceItem {
  id: string;
  sku: string;
  itemType: 'addon_service' | 'unit_package';
  category: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  priceUsd: number;
  billingUnitLabel: string;
  unitsIncluded?: number;
  image: string;
  available: boolean;
  maxQuantity: number;
  featured?: boolean;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PromoCodeRecord {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotalUsd: number;
  maxDiscountUsd?: number;
  active: boolean;
  usageCount: number;
  expiresAt?: string;
  createdAt: string;
}

export interface CartItemMetadata {
  billingUnit?: 'month' | 'night' | 'day' | 'item';
  checkIn?: string;
  checkOut?: string;
  pickupDate?: string;
  returnDate?: string;
  pickupLocation?: string;
  exteriorColorName?: string;
  exteriorColorHex?: string;
  protectionPlan?: 'standard' | 'executive_shield';
  guests?: number;
  adults?: number;
  children?: number;
  infants?: number;
  selectedAddons?: BookingAddonSelection[];
  unitsIncluded?: number;
  notes?: string;
}

export interface CartItemRecord {
  id: string;
  referenceId: string;
  itemType: CatalogItemType;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  unitPriceUsd: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  quantityLabel: string;
  lineSubtotalUsd: number;
  available: boolean;
  unavailableReason?: string;
  metadata?: CartItemMetadata;
}

export interface CartRecord {
  cartId: string;
  items: CartItemRecord[];
  promoCode?: string;
  promoDescription?: string;
  subtotalUsd: number;
  serviceFeeUsd: number;
  taxUsd: number;
  discountUsd: number;
  totalUsd: number;
  totalUnitsRequired: number;
  itemCount: number;
  validationIssues: string[];
  updatedAt: string;
}

export interface OrderRecord {
  id: string;
  orderReference: string;
  cartId?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  role?: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  guestNotes?: string;
  items: CartItemRecord[];
  promoCode?: string;
  subtotalUsd: number;
  serviceFeeUsd: number;
  taxUsd: number;
  discountUsd: number;
  totalUsd: number;
  totalUnitsRequired: number;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  paymentReference?: string;
  manualPaymentId?: string;
  linkedBookingIds: string[];
  linkedVehicleBookingIds: string[];
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
  confirmationEmailSentAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManualPaymentRecord {
  id: string;
  referenceCode: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  targetType: 'units' | 'housing_booking' | 'vehicle_booking' | 'order';
  targetId?: string;
  unitsRequested: number;
  amountUsd: number;
  paymentMethod: 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate';
  senderName: string;
  originatingBank: string;
  wireReference: string;
  transferDate: string;
  receiptFileName?: string;
  receiptDataUrl?: string;
  notes?: string;
  status: ManualPaymentStatus;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface PaymentAccountConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  achRoutingNumber: string;
  wireRoutingNumber: string;
  swiftCode: string;
  bankAddress: string;
  zelleEmail: string;
  zelleRecipient: string;
  paymentInstructions: string;
  updatedAt: string;
}

export interface InquiryRecord {
  id: string;
  customerId?: string;
  referenceCode: string;
  type: 'contact' | 'brochure' | 'host_design' | 'live_chat';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  propertyId?: string;
  moveInDate?: string;
  duration?: string;
  message?: string;
  status: 'new' | 'reviewed' | 'archived';
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  customerId?: string;
  recipientEmail: string;
  title: string;
  message: string;
  category: 'booking' | 'payment' | 'fleet' | 'units' | 'system';
  read: boolean;
  createdAt: string;
}

export interface SupportTicketRecord {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  category: string;
  priority: 'normal' | 'urgent';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  actorEmail: string;
  action: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export interface DatabaseState {
  users: UserRecord[];
  properties: PropertyRecord[];
  bookings: BookingRecord[];
  payments: PaymentRecord[];
  vehicles: VehicleInventoryRecord[];
  vehicleBookings: VehicleBookingRecord[];
  manualPayments: ManualPaymentRecord[];
  paymentAccounts: PaymentAccountConfig;
  inquiries: InquiryRecord[];
  notifications: NotificationRecord[];
  auditLogs: AuditLogRecord[];
  catalogItems: CatalogServiceItem[];
  promoCodes: PromoCodeRecord[];
  carts: Record<string, CartRecord>;
  orders: OrderRecord[];
  supportTickets?: SupportTicketRecord[];
  reviews?: PropertyReviewRecord[];
}
