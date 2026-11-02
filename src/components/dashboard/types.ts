export type DashboardTab =
  | 'overview'
  | 'accommodation'
  | 'car-rentals'
  | 'payments'
  | 'notifications'
  | 'profile'
  | 'security'
  | 'support';

export type OverviewSubView = 'index' | 'account-summary' | 'upcoming-bookings' | 'recent-activity';

export type AccommodationSubView =
  | 'index'
  | 'my-reservations'
  | 'reservation-details'
  | 'booking-history'
  | 'check-in-details'
  | 'modification-request'
  | 'cancellation-request';

export type CarRentalsSubView =
  | 'index'
  | 'my-rentals'
  | 'rental-details'
  | 'rental-history'
  | 'pickup-details'
  | 'driver-information'
  | 'modification-request'
  | 'cancellation-request';

export type PaymentsSubView =
  | 'index'
  | 'payment-history'
  | 'pending-payments'
  | 'payment-details'
  | 'upload-payment-proof'
  | 'invoices';

export type NotificationsSubView = 'index' | 'booking-alerts' | 'payment-alerts' | 'system-notifications';

export type ProfileSubView = 'index' | 'personal-information' | 'preferences';

export type SecuritySubView =
  | 'index'
  | 'change-password'
  | 'two-factor'
  | 'active-sessions'
  | 'login-history';

export type SupportSubView = 'index' | 'my-tickets' | 'submit-request' | 'faq' | 'contact-support';

export interface UserPreferences {
  thermostat: string;
  pillows: string;
  quietHours: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  preferredCurrency: string;
  timezone: string;
}

export interface UserDriverInfo {
  primaryDriver: string;
  licenseNumber: string;
  issuingState: string;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface DashboardMetadata {
  id: string;
  user_id: string;
  created_at: string;
  last_accessed_at: string;
  initialized: boolean;
}

export interface PaymentAccountInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  achRoutingNumber: string;
  wireRoutingNumber: string;
  swiftCode: string;
  zelleEmail: string;
  corporateMailingAddress: string;
  paymentInstructions: string;
}

export interface ActiveSessionItem {
  id: string;
  isCurrent: boolean;
  device: string;
  ip: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

export interface LoginHistoryItem {
  id: string;
  timestamp: string;
  device: string;
  ip: string;
}

export interface AccountActivityItem {
  id: string;
  category: 'booking' | 'rental' | 'payment' | 'support' | 'account';
  title: string;
  description: string;
  timestamp: string;
  amountUsd?: number;
  status?: string;
}

export interface UserSession {
  id: string;
  dashboardId: string;
  dashboardCreatedAt: string;
  lastAccessedAt: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  units_balance: number;
  balance_usd: number;
  memberSince: string;
  passwordUpdatedAt?: string;
  twoFactorEnabled: boolean;
  preferredCurrency: string;
  timezone: string;
  address: UserAddress;
  preferences: UserPreferences;
  driverInfo: UserDriverInfo;
}

export interface UserAccommodationReservation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  unitNumber: string;
  location: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  guestsCount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'active';
  totalUsd: number;
  unitsRequired?: number;
  paymentMethod?: string;
  accessCode: string;
  wifiNetwork: string;
  wifiPassword: string;
  parkingSpace: string;
  checkInInstructions: string;
  checkOutInstructions: string;
  specialRequests?: string;
  notes?: string;
  bookedAt: string;
  image: string;
}

export interface UserCarRentalBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  year: number;
  category: string;
  colorName: string;
  colorHex: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pickupLocation: string;
  returnLocation: string;
  protectionPlan: 'standard' | 'executive_shield';
  status: 'confirmed' | 'active' | 'completed' | 'cancelled' | 'pending';
  totalUsd: number;
  unitsRequired?: number;
  paymentMethod?: string;
  primaryDriver: string;
  driverLicenseNumber: string;
  driverLicenseState: string;
  notes?: string;
  handoverCode: string;
  createdAt?: string;
  image: string;
}

export interface UserPaymentRecord {
  id: string;
  referenceCode: string;
  targetType: 'accommodation' | 'car_rental' | 'account_funds' | 'concierge';
  description: string;
  amountUsd: number;
  paymentMethod: string;
  status: 'settled' | 'pending' | 'failed' | 'refunded';
  date: string;
  invoiceNumber: string;
  proofDocumentUrl?: string;
}

export interface UserNotificationItem {
  id: string;
  type: 'booking' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  createdAtIso?: string;
  isRead: boolean;
  actionTab?: DashboardTab;
}

export interface UserSupportTicket {
  id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'normal' | 'urgent';
  createdAt: string;
  updatedAt: string;
}
