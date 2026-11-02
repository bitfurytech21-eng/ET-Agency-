import type {
  BedroomDetail,
  BlockedDateRange,
  PropertyLocationInfo,
  SeasonalPricingRule,
} from '../../data/propertyEnrichment';

export interface AdminProperty {
  id: string;
  code?: string;
  slug?: string;
  unitNumber: string;
  title: string;
  category: string;
  propertyType?: string;
  verified?: boolean;
  shortDesc: string;
  fullDesc: string;
  monthlyRate: number;
  pricingNote: string;
  status: 'Available' | 'Inquired' | 'Reserved';
  minimumStayDays: number;
  maximumStayDays?: number;
  maxGuests?: number;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  sqft?: string;
  location?: string;
  floor?: 'Downstairs' | 'Upstairs' | string;
  amenities?: string[];
  features?: string[];
  facilities?: string[];
  videoTourUrl?: string;
  videoPosterUrl?: string;
  bedroomsDetail?: BedroomDetail[];
  seasonalPricing?: SeasonalPricingRule[];
  blockedDates?: BlockedDateRange[];
  locationInfo?: PropertyLocationInfo;
}

export interface AdminReservation {
  id: string;
  type: 'accommodation' | 'car-rental';
  targetId: string;
  targetTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  employer?: string;
  role?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  amountUsd: number;
  unitsCost?: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
}

export interface AdminVehicle {
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
  inventoryStatus: 'available' | 'rented' | 'maintenance' | 'cleaning';
  sketchfabEmbedId?: string;
  maintenanceLogs: Array<{
    id: string;
    serviceType: string;
    notes: string;
    costUsd: number;
    date: string;
    performedBy: string;
  }>;
  documents?: Array<{
    id: string;
    title: string;
    docType: 'registration' | 'insurance' | 'inspection' | 'title';
    expiryDate: string;
    status: 'valid' | 'expiring_soon' | 'expired';
  }>;
}

export interface AdminGuest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  units_balance: number;
  balance_usd: number;
  totalStays: number;
  verifiedId: boolean;
  corporateVerified: boolean;
  notes?: string;
  createdAt: string;
}

export interface AdminHost {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  assignedPropertyIds: string[];
  commissionSplit: string;
  payoutMethod: string;
  ytdPayoutUsd: number;
  status: 'active' | 'pending_agreement' | 'inactive';
  joinedDate: string;
}

export interface AdminHousekeepingTask {
  id: string;
  propertyId: string;
  unitNumber: string;
  unitTitle: string;
  assignedStaff: string;
  scheduledDate: string;
  status: 'dirty' | 'cleaning' | 'inspected' | 'ready';
  lastGuestCheckOut: string;
  nextGuestCheckIn: string;
  checklist: {
    linensChanged: boolean;
    bathroomsSanitized: boolean;
    kitchenReset: boolean;
    toiletriesRestocked: boolean;
    keypadCodeReset: boolean;
    inspectionPassed: boolean;
  };
  notes?: string;
}

export interface AdminPricingFee {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage' | 'per_day';
  description: string;
  isMandatory: boolean;
}
