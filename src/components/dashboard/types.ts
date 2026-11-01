export type DashboardTab =
  | 'overview'
  | 'accommodation'
  | 'car-rentals'
  | 'payments'
  | 'saved-items'
  | 'notifications'
  | 'messages'
  | 'profile'
  | 'security'
  | 'settings'
  | 'support';

export type OverviewSubView = 'index' | 'account-summary' | 'upcoming-bookings' | 'recent-activity';
export type AccommodationSubView =
  | 'index'
  | 'my-reservations'
  | 'reservation-details'
  | 'booking-history'
  | 'check-in-details'
  | 'check-out-details'
  | 'modification-request'
  | 'cancellation-request';
export type CarRentalsSubView =
  | 'index'
  | 'my-rentals'
  | 'rental-details'
  | 'rental-history'
  | 'pickup-details'
  | 'return-details'
  | 'modification-request'
  | 'cancellation-request'
  | 'driver-information';
export type PaymentsSubView =
  | 'index'
  | 'payment-history'
  | 'pending-payments'
  | 'payment-details'
  | 'payment-methods'
  | 'upload-payment-proof'
  | 'invoices'
  | 'receipts';
export type SavedItemsSubView = 'index' | 'saved-properties' | 'saved-vehicles';
export type NotificationsSubView = 'index' | 'booking-alerts' | 'payment-alerts' | 'system-notifications';
export type MessagesSubView = 'index' | 'conversations' | 'new-message' | 'support-tickets';
export type ProfileSubView =
  | 'index'
  | 'personal-information'
  | 'contact-information'
  | 'profile-photo'
  | 'identification'
  | 'preferences';
export type SecuritySubView =
  | 'index'
  | 'change-password'
  | 'two-factor'
  | 'active-sessions'
  | 'login-history';
export type SettingsSubView =
  | 'index'
  | 'account-settings'
  | 'notification-settings'
  | 'privacy-settings'
  | 'language-currency';
export type SupportSubView = 'index' | 'help-center' | 'faq' | 'contact-support' | 'submit-request';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatarUrl?: string;
  units_balance?: number;
  balance_usd: number;
  memberSince: string;
  tier: string;
  twoFactorEnabled: boolean;
  idVerified: boolean;
  preferredCurrency: string;
  timezone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
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
  accessCode: string;
  wifiNetwork: string;
  wifiPassword: string;
  parkingSpace: string;
  checkInInstructions: string;
  checkOutInstructions: string;
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
  primaryDriver: string;
  driverLicenseNumber: string;
  driverLicenseState: string;
  flightNumber?: string;
  handoverCode: string;
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
  isRead: boolean;
  actionUrl?: string;
}

export interface UserMessageItem {
  id: string;
  sender: 'host' | 'concierge' | 'user' | 'support';
  senderName: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  ticketId?: string;
  status?: 'open' | 'resolved' | 'waiting';
}

export interface UserSupportTicket {
  id: string;
  category: 'Housing' | 'Fleet Vehicle' | 'Billing' | 'Access / Keyless' | 'General';
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'normal' | 'urgent';
  createdAt: string;
  updatedAt: string;
  messagesCount: number;
}
