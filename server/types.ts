export type Role = 'guest' | 'admin' | 'staff';

export type BookingStatus = 'pending' | 'awaiting_payment' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

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
}

export interface BookingRecord {
  id: string;
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
  status: BookingStatus;
  notes?: string;
  specialRequests?: string;
  totalNights: number;
  createdAt: string;
  paymentProvider?: 'manual' | 'stripe' | 'paypal';
  paymentReference?: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: 'manual' | 'stripe' | 'paypal';
  reference?: string;
  createdAt: string;
}

export interface DatabaseState {
  users: UserRecord[];
  properties: PropertyRecord[];
  bookings: BookingRecord[];
  payments: PaymentRecord[];
}
