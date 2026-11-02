import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AccountActivityItem,
  ActiveSessionItem,
  DashboardTab,
  LoginHistoryItem,
  PaymentAccountInfo,
  UserAccommodationReservation,
  UserAddress,
  UserCarRentalBooking,
  UserDriverInfo,
  UserNotificationItem,
  UserPaymentRecord,
  UserPreferences,
  UserSession,
  UserSupportTicket,
} from './dashboard/types';
import { DashboardHeader } from './dashboard/includes/DashboardHeader';
import { DashboardSidebar } from './dashboard/includes/DashboardSidebar';
import { DashboardFooter } from './dashboard/includes/DashboardFooter';
import { OverviewModule } from './dashboard/modules/OverviewModule';
import { AccommodationModule } from './dashboard/modules/AccommodationModule';
import { CarRentalsModule } from './dashboard/modules/CarRentalsModule';
import { PayableTargetOption, PaymentsModule } from './dashboard/modules/PaymentsModule';
import { NotificationsModule } from './dashboard/modules/NotificationsModule';
import { ProfileModule } from './dashboard/modules/ProfileModule';
import { SecurityModule } from './dashboard/modules/SecurityModule';
import { SupportModule } from './dashboard/modules/SupportModule';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Heart,
  Loader2,
  RefreshCw,
  Wallet,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getFallbackPropertyImage } from '../data/lodgingData';

interface CustomerPortalProps {
  onOpenBooking: () => void;
  onNavigateTab: (tab: string) => void;
  onSignOut?: () => void;
  onAuthExpired?: () => void;
  onUserUpdated?: (user: { id: string; name: string; email: string }) => void;
}

function deriveKeypadPin(bookingId: string): string {
  let hash = 0;
  for (let i = 0; i < bookingId.length; i += 1) {
    hash = (hash * 31 + bookingId.charCodeAt(i)) % 9000;
  }
  return `${1000 + Math.abs(hash)}#`;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  onOpenBooking,
  onNavigateTab,
  onSignOut,
  onAuthExpired,
  onUserUpdated,
}) => {
  const { wishlistIds, liveProperties, toggleWishlist } = useCart();
  const [token] = useState<string | null>(() => localStorage.getItem('etl_php_token'));
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [accommodations, setAccommodations] = useState<UserAccommodationReservation[]>([]);
  const [carRentals, setCarRentals] = useState<UserCarRentalBooking[]>([]);
  const [payments, setPayments] = useState<UserPaymentRecord[]>([]);
  const [notifications, setNotifications] = useState<UserNotificationItem[]>([]);
  const [supportTickets, setSupportTickets] = useState<UserSupportTicket[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccountInfo | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSessionItem[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [activities, setActivities] = useState<AccountActivityItem[]>([]);
  const [rawOrders, setRawOrders] = useState<
    Array<{ id: string; orderReference: string; totalUsd: number; paymentStatus: string }>
  >([]);

  // Add Account Funds modal state
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>('1000');
  const [topUpMethod, setTopUpMethod] = useState<
    'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate'
  >('Wire Transfer');
  const [topUpSender, setTopUpSender] = useState<string>('');
  const [topUpBank, setTopUpBank] = useState<string>('');
  const [topUpRef, setTopUpRef] = useState<string>('');
  const [topUpSubmitting, setTopUpSubmitting] = useState(false);
  const [topUpError, setTopUpError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchDashboard = useCallback(
    async (silent = false) => {
      const currentToken = localStorage.getItem('etl_php_token');
      if (!currentToken) {
        if (onAuthExpired) onAuthExpired();
        else onNavigateTab('login');
        return;
      }

      if (!silent) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const res = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        const data = await res.json();

        if (res.status === 401 || !data.success || !data.customer) {
          localStorage.removeItem('etl_php_token');
          if (onAuthExpired) onAuthExpired();
          else onNavigateTab('login');
          return;
        }

        const cust = data.customer;
        const dash = data.dashboard || cust.dashboard || {};

        const prefs: UserPreferences = {
          thermostat: cust.preferences?.thermostat || '70°F (21°C)',
          pillows: cust.preferences?.pillows || 'Hypoallergenic Medium-Firm',
          quietHours: cust.preferences?.quietHours || 'Standard (10:00 PM – 7:00 AM)',
          emailNotifications: cust.preferences?.emailNotifications ?? true,
          smsNotifications: cust.preferences?.smsNotifications ?? true,
          preferredCurrency: cust.preferences?.preferredCurrency || 'USD ($)',
          timezone: cust.preferences?.timezone || 'America/Los_Angeles (PT)',
        };

        const address: UserAddress = {
          street: cust.address?.street || '',
          city: cust.address?.city || '',
          state: cust.address?.state || 'CA',
          zip: cust.address?.zip || '',
          country: cust.address?.country || 'United States',
        };

        const driverInfo: UserDriverInfo = {
          primaryDriver: cust.driver_info?.primaryDriver || cust.name,
          licenseNumber: cust.driver_info?.licenseNumber || '',
          issuingState: cust.driver_info?.issuingState || 'CA',
        };

        const mappedUser: UserSession = {
          id: cust.id,
          dashboardId: dash.id || `dash_${cust.id}`,
          dashboardCreatedAt: dash.created_at || cust.created_at,
          lastAccessedAt: dash.last_accessed_at || new Date().toISOString(),
          name: cust.name,
          email: cust.email,
          phone: cust.phone || '',
          company: cust.company || '',
          role: cust.role || '',
          units_balance: Number(data.units_balance ?? cust.units_balance ?? 0),
          balance_usd: Number(data.balance_usd ?? cust.balance_usd ?? 0),
          memberSince: String(cust.created_at || '').split('T')[0] || 'Active Member',
          passwordUpdatedAt: cust.password_updated_at,
          twoFactorEnabled: Boolean(cust.two_factor_enabled),
          preferredCurrency: prefs.preferredCurrency,
          timezone: prefs.timezone,
          address,
          preferences: prefs,
          driverInfo,
        };

        setUserSession(mappedUser);
        setTopUpSender((prev) => prev || mappedUser.name);
        if (onUserUpdated) {
          onUserUpdated({ id: mappedUser.id, name: mappedUser.name, email: mappedUser.email });
        }

        // Map Accommodation Bookings
        const mappedStays: UserAccommodationReservation[] = (data.bookings || []).map(
          (b: Record<string, any>) => {
            const checkInStr = String(b.checkIn || '');
            const checkOutStr = String(b.checkOut || '');
            const nights = Math.max(
              1,
              Math.round(
                (new Date(checkOutStr).getTime() - new Date(checkInStr).getTime()) / 86400000,
              ) || 30,
            );
            const rawStatus = String(b.status || 'pending').toLowerCase();
            const normalizedStatus: UserAccommodationReservation['status'] =
              rawStatus === 'confirmed'
                ? 'confirmed'
                : rawStatus === 'completed'
                ? 'completed'
                : rawStatus === 'cancelled'
                ? 'cancelled'
                : rawStatus === 'active'
                ? 'active'
                : 'pending';

            const unitNum = String(b.unitNumber || b.propertyId || 'Suite');
            return {
              id: String(b.id),
              propertyId: String(b.propertyId || ''),
              propertyTitle: String(b.propertyTitle || `Residence ${unitNum}`),
              unitNumber: unitNum,
              location: String(b.location || 'Rancho Cordova, CA'),
              checkIn: checkInStr,
              checkOut: checkOutStr,
              totalNights: nights,
              guestsCount: Number(b.adults || 1) + Number(b.children || 0),
              status: normalizedStatus,
              totalUsd: Number(b.totalPrice ?? (b.unitCostUnits ? b.unitCostUnits * 100 : 0)),
              unitsRequired: b.unitCostUnits ? Number(b.unitCostUnits) : undefined,
              paymentMethod: String(b.paymentProvider || 'Direct Invoice'),
              accessCode: deriveKeypadPin(String(b.id)),
              wifiNetwork: `ETL-Residence-${unitNum.replace(/\s+/g, '')}`,
              wifiPassword: 'Provided inside arrival packet',
              parkingSpace: `Assigned Covered Stall (${unitNum})`,
              checkInInstructions:
                'Contactless smart-lock entry activates at 3:00 PM on your check-in date. Enter your 4-digit keypad code followed by #.',
              checkOutInstructions:
                'Check-out is by 11:00 AM. Ensure personal items are packed and engage the smart keypad lock upon departure.',
              specialRequests: b.specialRequests ? String(b.specialRequests) : undefined,
              notes: b.notes ? String(b.notes) : undefined,
              bookedAt: String(b.createdAt || '').split('T')[0] || checkInStr,
              image: String(b.image || ''),
            };
          },
        );
        setAccommodations(mappedStays);

        // Map Car Rental Bookings
        const mappedRentals: UserCarRentalBooking[] = (data.vehicleBookings || []).map(
          (vb: Record<string, any>) => {
            const rawStatus = String(vb.status || 'pending').toLowerCase();
            const normalizedStatus: UserCarRentalBooking['status'] =
              rawStatus === 'confirmed'
                ? 'confirmed'
                : rawStatus === 'active'
                ? 'active'
                : rawStatus === 'completed'
                ? 'completed'
                : rawStatus === 'cancelled'
                ? 'cancelled'
                : 'pending';

            return {
              id: String(vb.id),
              vehicleId: String(vb.vehicleId || ''),
              vehicleName: String(vb.vehicleName || 'Fleet Vehicle'),
              year: Number(vb.year || 2023),
              category: String(vb.category || 'Executive Fleet'),
              colorName: String(vb.exteriorColorName || 'Standard Finish'),
              colorHex: String(vb.exteriorColorHex || '#1e40af'),
              pickupDate: String(vb.pickupDate || ''),
              returnDate: String(vb.returnDate || ''),
              totalDays: Number(vb.totalDays || 1),
              pickupLocation: String(vb.pickupLocation || 'Concierge Delivery'),
              returnLocation: String(vb.pickupLocation || 'Concierge Delivery'),
              protectionPlan:
                vb.protectionPlan === 'executive_shield' ? 'executive_shield' : 'standard',
              status: normalizedStatus,
              totalUsd: Number(vb.totalUsd || 0),
              unitsRequired: vb.unitsRequired ? Number(vb.unitsRequired) : undefined,
              paymentMethod: String(vb.paymentMethod || 'manual_wire'),
              primaryDriver: String(vb.customerName || driverInfo.primaryDriver),
              driverLicenseNumber: driverInfo.licenseNumber,
              driverLicenseState: driverInfo.issuingState,
              notes: vb.notes ? String(vb.notes) : undefined,
              handoverCode: `FLT-${String(vb.id).replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
              createdAt: vb.createdAt ? String(vb.createdAt) : undefined,
              image: String(vb.image || ''),
            };
          },
        );
        setCarRentals(mappedRentals);

        // Map Payments & Manual Payments
        const settledRefs = new Set<string>();
        const combinedPayments: UserPaymentRecord[] = [];

        for (const p of data.payments || []) {
          const ref = String(p.reference || p.id);
          settledRefs.add(ref);
          combinedPayments.push({
            id: String(p.id),
            referenceCode: ref,
            targetType: 'accommodation',
            description: p.bookingId
              ? `Verified Payment — Reference ${p.bookingId}`
              : 'Account Balance Settlement',
            amountUsd: Number(p.amount || 0),
            paymentMethod:
              p.provider === 'unit_balance'
                ? 'Account Lodging Units'
                : p.provider === 'manual'
                ? 'Verified Bank Transfer'
                : String(p.provider || 'Bank Transfer'),
            status:
              p.status === 'succeeded'
                ? 'settled'
                : p.status === 'failed'
                ? 'failed'
                : p.status === 'refunded'
                ? 'refunded'
                : 'pending',
            date: String(p.createdAt || '').split('T')[0] || new Date().toISOString().split('T')[0],
            invoiceNumber: `INV-${String(p.id).replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
          });
        }

        for (const mp of data.manualPayments || []) {
          if (mp.status === 'verified' && settledRefs.has(String(mp.referenceCode))) {
            continue;
          }
          const tType: UserPaymentRecord['targetType'] =
            mp.targetType === 'housing_booking'
              ? 'accommodation'
              : mp.targetType === 'vehicle_booking'
              ? 'car_rental'
              : mp.targetType === 'order'
              ? 'concierge'
              : 'account_funds';

          const desc =
            mp.targetType === 'housing_booking'
              ? `Accommodation Transfer (${mp.targetId || mp.referenceCode})`
              : mp.targetType === 'vehicle_booking'
              ? `Car Rental Transfer (${mp.targetId || mp.referenceCode})`
              : mp.targetType === 'order'
              ? `Order Remittance (${mp.targetId || mp.referenceCode})`
              : `Account Funds Deposit (${mp.unitsRequested || 0} Units)`;

          combinedPayments.push({
            id: String(mp.id),
            referenceCode: String(mp.referenceCode || mp.wireReference || mp.id),
            targetType: tType,
            description: desc,
            amountUsd: Number(mp.amountUsd || 0),
            paymentMethod: `${mp.paymentMethod || 'Wire Transfer'} (${mp.originatingBank || 'Bank'})`,
            status:
              mp.status === 'verified'
                ? 'settled'
                : mp.status === 'rejected'
                ? 'failed'
                : 'pending',
            date: String(mp.transferDate || String(mp.createdAt || '').split('T')[0]),
            invoiceNumber: `INV-${String(mp.referenceCode || mp.id)
              .replace(/[^a-zA-Z0-9]/g, '')
              .slice(-6)
              .toUpperCase()}`,
            proofDocumentUrl: mp.receiptDataUrl ? String(mp.receiptDataUrl) : undefined,
          });
        }

        setPayments(combinedPayments);

        // Map Notifications
        const mappedNotifications: UserNotificationItem[] = (data.notifications || []).map(
          (n: Record<string, any>) => {
            const cat = String(n.category || 'system');
            const nType: UserNotificationItem['type'] =
              cat === 'booking' || cat === 'fleet'
                ? 'booking'
                : cat === 'payment' || cat === 'units'
                ? 'payment'
                : 'system';

            const actionTab: DashboardTab | undefined =
              cat === 'booking'
                ? 'accommodation'
                : cat === 'fleet'
                ? 'car-rentals'
                : cat === 'payment' || cat === 'units'
                ? 'payments'
                : undefined;

            return {
              id: String(n.id),
              type: nType,
              title: String(n.title || 'Account Update'),
              message: String(n.message || ''),
              timestamp: String(n.createdAt || '').replace('T', ' ').slice(0, 16),
              createdAtIso: String(n.createdAt || ''),
              isRead: Boolean(n.read),
              actionTab,
            };
          },
        );
        setNotifications(mappedNotifications);

        // Support Tickets
        const mappedTickets: UserSupportTicket[] = (data.supportTickets || []).map(
          (t: Record<string, any>) => ({
            id: String(t.id),
            ticketNumber: String(t.ticketNumber || t.id),
            category: String(t.category || 'General'),
            subject: String(t.subject || ''),
            message: String(t.message || ''),
            status:
              t.status === 'resolved'
                ? 'resolved'
                : t.status === 'in_progress'
                ? 'in_progress'
                : 'open',
            priority: t.priority === 'urgent' ? 'urgent' : 'normal',
            createdAt: String(t.createdAt || ''),
            updatedAt: String(t.updatedAt || t.createdAt || ''),
          }),
        );
        setSupportTickets(mappedTickets);

        if (data.paymentAccounts) {
          setPaymentAccounts(data.paymentAccounts);
        }
        setActiveSessions(Array.isArray(data.activeSessions) ? data.activeSessions : []);
        setLoginHistory(Array.isArray(data.loginHistory) ? data.loginHistory : []);
        setRawOrders(Array.isArray(data.orders) ? data.orders : []);

        // Build chronological Account Activity list from real user records
        const builtActivities: AccountActivityItem[] = [];
        for (const b of data.bookings || []) {
          builtActivities.push({
            id: `act_bk_${b.id}`,
            category: 'booking',
            title: `Accommodation Stay ${b.id}`,
            description: `${b.propertyTitle || b.propertyId} · ${b.checkIn} to ${b.checkOut}`,
            timestamp: String(b.createdAt || b.checkIn),
            amountUsd: Number(b.totalPrice || 0),
            status: String(b.status || 'pending'),
          });
        }
        for (const vb of data.vehicleBookings || []) {
          builtActivities.push({
            id: `act_vb_${vb.id}`,
            category: 'rental',
            title: `Car Rental ${vb.id}`,
            description: `${vb.vehicleName} · ${vb.pickupDate} to ${vb.returnDate}`,
            timestamp: String(vb.createdAt || vb.pickupDate),
            amountUsd: Number(vb.totalUsd || 0),
            status: String(vb.status || 'pending'),
          });
        }
        for (const mp of data.manualPayments || []) {
          builtActivities.push({
            id: `act_mp_${mp.id}`,
            category: 'payment',
            title: `Transfer Notice ${mp.referenceCode}`,
            description: `${mp.paymentMethod} via ${mp.originatingBank}`,
            timestamp: String(mp.createdAt || mp.transferDate),
            amountUsd: Number(mp.amountUsd || 0),
            status: mp.status === 'verified' ? 'settled' : String(mp.status || 'pending'),
          });
        }
        for (const tx of data.transactions || []) {
          builtActivities.push({
            id: `act_tx_${tx.id}`,
            category: 'payment',
            title: tx.type === 'unit_purchase' ? 'Account Funds Credited' : 'Balance Settlement',
            description: String(tx.description || ''),
            timestamp: String(tx.date || ''),
            amountUsd: Number(tx.amount_usd || 0),
            status: String(tx.status || 'settled'),
          });
        }
        for (const tk of mappedTickets) {
          builtActivities.push({
            id: `act_tk_${tk.id}`,
            category: 'support',
            title: `Support Ticket ${tk.ticketNumber}`,
            description: tk.subject,
            timestamp: tk.createdAt,
            status: tk.status,
          });
        }

        builtActivities.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        setActivities(builtActivities);
      } catch (err) {
        setLoadError(
          err instanceof Error
            ? err.message
            : 'Unable to load your personal dashboard right now.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onAuthExpired, onNavigateTab, onUserUpdated],
  );

  useEffect(() => {
    if (!token) {
      if (onAuthExpired) onAuthExpired();
      else onNavigateTab('login');
      return;
    }
    fetchDashboard(false);
  }, [token, fetchDashboard, onAuthExpired, onNavigateTab]);

  const authHeaders = useCallback(() => {
    const currentToken = localStorage.getItem('etl_php_token') || '';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };
  }, []);

  const handleLogoutClick = async () => {
    const currentToken = localStorage.getItem('etl_php_token');
    if (currentToken) {
      try {
        await fetch('/api/auth/customer/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${currentToken}` },
        });
      } catch {
        // Proceed with local cleanup
      }
    }
    localStorage.removeItem('etl_php_token');
    localStorage.removeItem('etl_user_session');
    if (onSignOut) {
      onSignOut();
    } else {
      onNavigateTab('login');
    }
  };

  // Mutation Handlers
  const handleSaveProfile = async (updates: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Unable to save profile updates.' };
      }
      await fetchDashboard(true);
      return { ok: true, message: data.message || 'Profile updated successfully.' };
    } catch {
      return { ok: false, message: 'Network error while updating your profile.' };
    }
  };

  const handleModifyAccommodation = async (
    id: string,
    payload: { checkIn: string; checkOut: string; specialRequests?: string; notes?: string },
  ) => {
    try {
      const res = await fetch(`/api/dashboard/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'modify', ...payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Unable to modify reservation.' };
      }
      await fetchDashboard(true);
      return { ok: true, message: data.message || 'Stay dates updated.' };
    } catch {
      return { ok: false, message: 'Network error while updating stay dates.' };
    }
  };

  const handleCancelAccommodation = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/dashboard/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'cancel', notes: reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Unable to cancel reservation.' };
      }
      await fetchDashboard(true);
      return { ok: true, message: data.message || 'Reservation cancelled.' };
    } catch {
      return { ok: false, message: 'Network error while cancelling reservation.' };
    }
  };

  const handleModifyCarRental = async (
    id: string,
    payload: { pickupDate: string; returnDate: string; pickupLocation: string; notes?: string },
  ) => {
    try {
      const res = await fetch(`/api/dashboard/vehicle-bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'modify', ...payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Unable to modify car rental.' };
      }
      await fetchDashboard(true);
      return { ok: true, message: data.message || 'Car rental updated.' };
    } catch {
      return { ok: false, message: 'Network error while updating car rental.' };
    }
  };

  const handleCancelCarRental = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/dashboard/vehicle-bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'cancel', notes: reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Unable to cancel car rental.' };
      }
      await fetchDashboard(true);
      return { ok: true, message: data.message || 'Car rental cancelled.' };
    } catch {
      return { ok: false, message: 'Network error while cancelling car rental.' };
    }
  };

  const handleSubmitManualPayment = async (payload: {
    targetType: 'units' | 'housing_booking' | 'vehicle_booking' | 'order';
    targetId?: string;
    amountUsd: number;
    paymentMethod: 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate';
    senderName: string;
    originatingBank: string;
    wireReference: string;
    transferDate: string;
    receiptFileName?: string;
    receiptDataUrl?: string;
    notes?: string;
  }) => {
    try {
      const res = await fetch('/api/dashboard/payments/manual', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...payload,
          unitsRequested:
            payload.targetType === 'units'
              ? Math.max(1, Math.round(payload.amountUsd / 100))
              : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Unable to submit transfer proof.' };
      }
      await fetchDashboard(true);
      return {
        ok: true,
        message: data.message || 'Transfer confirmation submitted for verification.',
      };
    } catch {
      return { ok: false, message: 'Network error while submitting transfer confirmation.' };
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    await fetch('/api/dashboard/notifications/read', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ notificationId: id }),
    });
    await fetchDashboard(true);
  };

  const handleMarkAllNotificationsRead = async () => {
    await fetch('/api/dashboard/notifications/read', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({}),
    });
    await fetchDashboard(true);
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await fetch('/api/dashboard/password', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Password update failed.' };
      }
      await fetchDashboard(true);
      return { ok: true, message: data.message || 'Password updated successfully.' };
    } catch {
      return { ok: false, message: 'Network error while updating password.' };
    }
  };

  const handleToggleTwoFactor = async (enabled: boolean) => {
    try {
      const res = await fetch('/api/dashboard/two-factor', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Unable to update 2FA setting.' };
      }
      await fetchDashboard(true);
      return { ok: true, message: data.message || 'Two-factor preference saved.' };
    } catch {
      return { ok: false, message: 'Network error while updating 2FA setting.' };
    }
  };

  const handleCreateTicket = async (payload: {
    category: string;
    priority: 'normal' | 'urgent';
    subject: string;
    message: string;
  }) => {
    try {
      const res = await fetch('/api/dashboard/support-tickets', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { ok: false, message: data.message || 'Unable to submit support request.' };
      }
      await fetchDashboard(true);
      return { ok: true, message: data.message || 'Support request submitted.' };
    } catch {
      return { ok: false, message: 'Network error while submitting support request.' };
    }
  };

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopUpError(null);
    const amountNum = Number(topUpAmount);
    if (!amountNum || amountNum <= 0) {
      setTopUpError('Please enter a valid USD deposit amount.');
      return;
    }
    if (!topUpSender.trim() || !topUpRef.trim()) {
      setTopUpError('Sender name and wire/ACH confirmation reference are required.');
      return;
    }

    setTopUpSubmitting(true);
    const res = await handleSubmitManualPayment({
      targetType: 'units',
      amountUsd: amountNum,
      paymentMethod: topUpMethod,
      senderName: topUpSender.trim(),
      originatingBank: topUpBank.trim() || 'Client Financial Institution',
      wireReference: topUpRef.trim(),
      transferDate: new Date().toISOString().split('T')[0],
      notes: 'Dashboard Add Account Funds notice',
    });
    setTopUpSubmitting(false);

    if (!res.ok) {
      setTopUpError(res.message);
      return;
    }

    setTopUpRef('');
    setTopUpModalOpen(false);
    setBannerMessage(res.message);
    setActiveTab('payments');
  };

  const availablePaymentTargets = useMemo<PayableTargetOption[]>(() => {
    const items: PayableTargetOption[] = [];
    for (const stay of accommodations) {
      if (stay.status === 'pending' || stay.status === 'confirmed') {
        items.push({
          id: stay.id,
          targetType: 'housing_booking',
          label: `Accommodation ${stay.id} — ${stay.propertyTitle} ($${stay.totalUsd.toLocaleString()})`,
          suggestedAmountUsd: stay.totalUsd,
        });
      }
    }
    for (const rental of carRentals) {
      if (rental.status === 'pending' || rental.status === 'confirmed') {
        items.push({
          id: rental.id,
          targetType: 'vehicle_booking',
          label: `Car Rental ${rental.id} — ${rental.vehicleName} ($${rental.totalUsd.toLocaleString()})`,
          suggestedAmountUsd: rental.totalUsd,
        });
      }
    }
    for (const ord of rawOrders) {
      if (ord.paymentStatus !== 'settled') {
        items.push({
          id: ord.orderReference,
          targetType: 'order',
          label: `Order ${ord.orderReference} ($${Number(ord.totalUsd || 0).toLocaleString()})`,
          suggestedAmountUsd: Number(ord.totalUsd || 0),
        });
      }
    }
    return items;
  }, [accommodations, carRentals, rawOrders]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  // Loading State
  if (isLoading && !userSession) {
    return (
      <div className="min-h-[80vh] bg-[#f7f3ed] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-6 animate-pulse">
          <div className="h-16 bg-white rounded-2xl border border-[#e6dfd5]" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 h-[520px] bg-[#241d18]/90 rounded-2xl" />
            <div className="lg:col-span-9 space-y-4">
              <div className="h-36 bg-white rounded-2xl border border-[#e6dfd5]" />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="h-28 bg-white rounded-2xl border border-[#e6dfd5]" />
                <div className="h-28 bg-white rounded-2xl border border-[#e6dfd5]" />
                <div className="h-28 bg-white rounded-2xl border border-[#e6dfd5]" />
                <div className="h-28 bg-white rounded-2xl border border-[#e6dfd5]" />
              </div>
              <div className="h-64 bg-white rounded-2xl border border-[#e6dfd5]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (loadError && !userSession) {
    return (
      <div className="min-h-[75vh] bg-[#f7f3ed] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#e6dfd5] rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h2 className="font-heading font-bold text-lg text-[#282828]">
            Unable to Load Your Dashboard
          </h2>
          <p className="text-xs text-[#5c5046]">{loadError}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fetchDashboard(false)}
              className="px-4 py-2 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="px-4 py-2 rounded-xl border border-[#d8cfc3] text-xs font-bold text-[#5c5046] cursor-pointer"
            >
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userSession) return null;

  const bank = paymentAccounts || {
    bankName: 'Chase Bank, N.A.',
    accountName: 'Easy Travel Lodging LLC',
    accountNumber: '8492017462',
    achRoutingNumber: '322271627',
    wireRoutingNumber: '021000021',
    swiftCode: 'CHASUS33',
    zelleEmail: 'easytravelagency@trustagent.space',
    corporateMailingAddress: 'Easy Travel Lodging LLC · Rancho Cordova, CA 95670',
    paymentInstructions: 'Include your User ID in the transfer memo.',
  };

  return (
    <div className="min-h-screen bg-[#f4efe9] text-[#282828] flex flex-col">
      <DashboardHeader
        user={userSession}
        activeTab={activeTab}
        unreadNotificationsCount={unreadNotificationsCount}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSignOut={handleLogoutClick}
        onReturnToSite={() => onNavigateTab('home')}
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {bannerMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{bannerMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <DashboardSidebar
              user={userSession}
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
              onSignOut={handleLogoutClick}
              unreadNotificationsCount={unreadNotificationsCount}
            />
          </div>

          {/* Active Dashboard Module Surface */}
          <div className="lg:col-span-9 min-w-0">
            <div className="bg-white border border-[#e6dfd5] rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-6">
                {activeTab === 'overview' && (
                  <OverviewModule
                    user={userSession}
                    accommodations={accommodations}
                    carRentals={carRentals}
                    payments={payments}
                    activities={activities}
                    onOpenBooking={onOpenBooking}
                    onExploreFleet={() => onNavigateTab('vehicles')}
                    onOpenTopUpUnits={() => setTopUpModalOpen(true)}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onViewBookingDetails={() => setActiveTab('accommodation')}
                    onViewRentalDetails={() => setActiveTab('car-rentals')}
                  />
                )}

                {activeTab === 'accommodation' && (
                  <div className="space-y-8">
                    <AccommodationModule
                      reservations={accommodations}
                      onOpenBooking={onOpenBooking}
                      onModifyReservation={handleModifyAccommodation}
                      onCancelReservation={handleCancelAccommodation}
                    />

                    {/* Saved Residences / Wishlist */}
                    <div className="pt-6 border-t border-[#efe9e0] space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="type-h4 text-[#1b1d20] flex items-center gap-2">
                            <Heart className="w-4 h-4 text-[#00897d]" />
                            <span>Saved Residences</span>
                          </h3>
                          <p className="type-support text-[#697076]">
                            Properties saved to your personal wishlist for upcoming travel planning.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigateTab('portfolio')}
                          className="type-btn text-[#00897d] hover:underline cursor-pointer whitespace-nowrap"
                        >
                          Browse All Residences →
                        </button>
                      </div>

                      {wishlistIds.length === 0 ? (
                        <div className="p-5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl text-left">
                          <p className="type-support text-[#5c5046]">
                            You have not saved any residences yet. Click the Save button on any residence gallery to bookmark it here.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {liveProperties
                            .filter((p) => wishlistIds.includes(p.id))
                            .map((prop, idx) => (
                              <div
                                key={prop.id}
                                className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center gap-4"
                              >
                                <img
                                  src={prop.images[0] || getFallbackPropertyImage(idx)}
                                  alt={prop.title}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = getFallbackPropertyImage(idx);
                                  }}
                                  className="w-20 h-16 rounded-lg object-cover border border-[#e6dfd5] shrink-0"
                                />
                                <div className="min-w-0 flex-1 space-y-1">
                                  <p className="type-support text-[#00897d] font-semibold truncate">
                                    {prop.unitNumber} · ${prop.monthlyRate.toLocaleString()}/mo
                                  </p>
                                  <h4 className="type-nav font-semibold text-[#1b1d20] truncate">
                                    {prop.title}
                                  </h4>
                                  <div className="flex items-center gap-3 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => onNavigateTab(`listing:${prop.id}`)}
                                      className="type-support font-semibold text-[#1b1d20] hover:text-[#00897d] inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>Open Details</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => toggleWishlist(prop.id)}
                                      className="type-support text-[#857568] hover:text-rose-700 cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'car-rentals' && (
                  <CarRentalsModule
                    rentals={carRentals}
                    driverInfo={userSession.driverInfo}
                    onExploreFleet={() => onNavigateTab('vehicles')}
                    onSaveDriverInfo={(info) => handleSaveProfile({ driver_info: info })}
                    onModifyRental={handleModifyCarRental}
                    onCancelRental={handleCancelCarRental}
                  />
                )}

                {activeTab === 'payments' && (
                  <PaymentsModule
                    payments={payments}
                    balanceUsd={userSession.balance_usd}
                    unitsBalance={userSession.units_balance}
                    userSession={userSession}
                    paymentAccounts={paymentAccounts}
                    availableTargets={availablePaymentTargets}
                    onOpenTopUpUnits={() => setTopUpModalOpen(true)}
                    onSubmitManualPayment={handleSubmitManualPayment}
                  />
                )}

                {activeTab === 'notifications' && (
                  <NotificationsModule
                    notifications={notifications}
                    onMarkAsRead={handleMarkNotificationRead}
                    onMarkAllAsRead={handleMarkAllNotificationsRead}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileModule user={userSession} onSaveProfile={handleSaveProfile} />
                )}

                {activeTab === 'security' && (
                  <SecurityModule
                    twoFactorEnabled={userSession.twoFactorEnabled}
                    passwordUpdatedAt={userSession.passwordUpdatedAt}
                    activeSessions={activeSessions}
                    loginHistory={loginHistory}
                    onChangePassword={handleChangePassword}
                    onToggleTwoFactor={handleToggleTwoFactor}
                    onSignOut={handleLogoutClick}
                  />
                )}

                {activeTab === 'support' && (
                  <SupportModule
                    tickets={supportTickets}
                    onCreateTicket={handleCreateTicket}
                  />
                )}
              </div>

              <DashboardFooter />
            </div>
          </div>
        </div>
      </div>

      {/* Add Account Funds Modal */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#e6dfd5] max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-[#efe9e0] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00897d]">
                  <Wallet className="w-4 h-4" />
                  <span>Add Personal Account Funds</span>
                </div>
                <h3 className="font-heading font-black text-lg text-[#282828]">
                  Wire, ACH, or Zelle Deposit Notice
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTopUpModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6e5d50] hover:text-[#282828] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Bank Instructions Summary */}
            <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] space-y-2 text-xs tabular-nums">
              <div className="flex items-center justify-between">
                <span className="text-[#6e5d50]">Beneficiary:</span>
                <strong className="text-[#282828]">
                  {bank.accountName} ({bank.bankName})
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6e5d50]">Account / Wire Routing:</span>
                <div className="flex items-center gap-1.5">
                  <strong className="font-mono text-[#282828]">
                    {bank.accountNumber} / {bank.wireRoutingNumber}
                  </strong>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(bank.accountNumber).catch(() => {});
                      setCopiedKey('acct');
                      setTimeout(() => setCopiedKey(null), 1800);
                    }}
                    className="p-1 text-[#5c5046] hover:text-[#00897d] cursor-pointer"
                    title="Copy account number"
                  >
                    {copiedKey === 'acct' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6e5d50]">Zelle Corporate:</span>
                <strong className="text-[#282828]">{bank.zelleEmail}</strong>
              </div>
            </div>

            {topUpError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{topUpError}</span>
              </div>
            )}

            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    Deposit Amount (USD) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    step="50"
                    required
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    Transfer Method *
                  </label>
                  <select
                    value={topUpMethod}
                    onChange={(e) =>
                      setTopUpMethod(
                        e.target.value as 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate',
                      )
                    }
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  >
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Direct ACH">Direct ACH</option>
                    <option value="Zelle Corporate">Zelle Corporate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    Sender Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={topUpSender}
                    onChange={(e) => setTopUpSender(e.target.value)}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    Originating Bank *
                  </label>
                  <input
                    type="text"
                    required
                    value={topUpBank}
                    onChange={(e) => setTopUpBank(e.target.value)}
                    placeholder="e.g. Chase, Wells Fargo"
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Wire / ACH / Zelle Reference Code *
                </label>
                <input
                  type="text"
                  required
                  value={topUpRef}
                  onChange={(e) => setTopUpRef(e.target.value)}
                  placeholder="Enter confirmation or trace number"
                  className="w-full h-10 px-3 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#d8cfc3] text-xs font-semibold text-[#5c5046] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={topUpSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {topUpSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Submit Deposit Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
