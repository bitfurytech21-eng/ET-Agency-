import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Mail,
  Building2,
  Coins,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PlusCircle,
  FileText,
  Calendar,
  LogOut,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Car,
  Landmark,
  Copy,
  Check,
  Bell,
  Upload,
  Settings,
  Clock,
  XCircle,
  ShoppingBag,
  Printer,
} from 'lucide-react';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { LivePhotoBackground } from './LivePhotoBackground';

interface CustomerPortalProps {
  onOpenBooking: () => void;
  onNavigateTab: (tab: string) => void;
}

interface CustomerPurchase {
  id: string;
  description: string;
  unit_number: string;
  units_purchased: number;
  amount_usd: number;
  status: string;
  purchased_at: string;
  payment_method: string;
}

interface CustomerTransaction {
  id: string;
  type: string;
  units: number;
  amount_usd: number;
  description: string;
  date: string;
  command_code?: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  balance_usd: number;
  units_balance: number;
  created_at: string;
  purchases: CustomerPurchase[];
  transactions: CustomerTransaction[];
}

interface BookingRecord {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  unitCostUnits?: number;
  unitCostUsd?: number;
  status: string;
  paymentProvider?: string;
  paymentReference?: string;
  notes?: string;
}

interface VehicleBookingRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  exteriorColorName: string;
  exteriorColorHex: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pickupLocation: string;
  protectionPlan: 'standard' | 'executive_shield';
  rateTier: 'daily' | 'weekly' | 'monthly';
  totalUsd: number;
  unitsRequired: number;
  paymentMethod: 'manual_wire' | 'unit_balance';
  status: string;
  paymentReference?: string;
  notes?: string;
}

interface ManualPaymentRecord {
  id: string;
  referenceCode: string;
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
  notes?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

interface PortalOrderItem {
  id: string;
  referenceId: string;
  itemType: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  unitPriceUsd: number;
  quantity: number;
  quantityLabel: string;
  lineSubtotalUsd: number;
}

interface PortalOrderRecord {
  id: string;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  items: PortalOrderItem[];
  promoCode?: string;
  subtotalUsd: number;
  serviceFeeUsd: number;
  taxUsd: number;
  discountUsd: number;
  totalUsd: number;
  totalUnitsRequired: number;
  paymentMethod: 'unit_balance' | 'wire_transfer' | 'direct_ach' | 'zelle';
  paymentStatus: 'pending_payment' | 'pending_verification' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentReference?: string;
  adminNotes?: string;
  createdAt: string;
}

interface PaymentAccountConfig {
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
}

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  category: string;
  read: boolean;
  createdAt: string;
}

type PortalSubTab = 'overview' | 'orders' | 'fleet' | 'payments' | 'ledger';

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onOpenBooking, onNavigateTab }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('etl_php_token'));
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBookingRecord[]>([]);
  const [orders, setOrders] = useState<PortalOrderRecord[]>([]);
  const [manualPayments, setManualPayments] = useState<ManualPaymentRecord[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccountConfig | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<PortalSubTab>('overview');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('client@easytravellodging.com');
  const [loginPassword, setLoginPassword] = useState('welcome123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regRole, setRegRole] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // UI & Modal states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [buyUnitsModalOpen, setBuyUnitsModalOpen] = useState(false);
  const [selectedUnitTier, setSelectedUnitTier] = useState<number>(25);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Manual Wire / ACH submission state
  const [wireTargetType, setWireTargetType] = useState<'units' | 'housing_booking' | 'vehicle_booking' | 'order'>('units');
  const [wireTargetId, setWireTargetId] = useState<string>('');
  const [wireAmountUsd, setWireAmountUsd] = useState<string>('2500');
  const [wireMethod, setWireMethod] = useState<'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate'>('Wire Transfer');
  const [wireSenderName, setWireSenderName] = useState('');
  const [wireBankName, setWireBankName] = useState('');
  const [wireReference, setWireReference] = useState('');
  const [wireDate, setWireDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [wireNotes, setWireNotes] = useState('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [receiptDataUrl, setReceiptDataUrl] = useState<string>('');
  const [submittingWire, setSubmittingWire] = useState(false);

  // Profile edit state
  const [profName, setProfName] = useState('');
  const [profCompany, setProfCompany] = useState('');
  const [profRole, setProfRole] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [executingCommand, setExecutingCommand] = useState(false);

  const loadDashboardData = async (activeToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/php/dashboard/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: activeToken }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        const cust: CustomerData = {
          ...data.customer,
          purchases: data.purchases || data.customer.purchases || [],
          transactions: data.transactions || data.customer.transactions || [],
        };
        setCustomer(cust);
        setBookings(data.bookings || []);
        setVehicleBookings(data.vehicleBookings || []);
        setOrders(data.orders || []);
        setManualPayments(data.manualPayments || []);
        setPaymentAccounts(data.paymentAccounts || null);
        setNotifications(data.notifications || []);

        setProfName(cust.name || '');
        setProfCompany(cust.company || '');
        setProfRole(cust.role || '');
        setProfPhone(cust.phone || '');
        if (!wireSenderName) {
          setWireSenderName(cust.company ? `${cust.company} Treasury` : cust.name);
        }
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('[Customer Portal] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData(token);
    }
  }, [token]);

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/php/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('etl_php_token', data.token);
      setToken(data.token);
      setCustomer(data.customer);
      setSuccessMsg('Client portal session authenticated.');
      loadDashboardData(data.token);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/php/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          company: regCompany,
          role: regRole,
          phone: regPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('etl_php_token', data.token);
      setToken(data.token);
      setCustomer(data.customer);
      setSuccessMsg('Account created with 25 Welcome Lodging Units ($2,500 value)!');
      loadDashboardData(data.token);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('etl_php_token');
    setToken(null);
    setCustomer(null);
    setBookings([]);
    setVehicleBookings([]);
    setOrders([]);
    setManualPayments([]);
    setNotifications([]);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handlePurchaseUnits = async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/php/dashboard/buy-units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          units: selectedUnitTier,
          package_type: `${selectedUnitTier} Lodging Units Package`,
          payment_method: 'Portal Unit Allotment',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Purchase failed');

      setSuccessMsg(`Credited ${selectedUnitTier} Lodging Units ($${(selectedUnitTier * 100).toLocaleString()} USD) to your account.`);
      setBuyUnitsModalOpen(false);
      loadDashboardData(token);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error purchasing units');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteInternalBalanceCheckout = async (bookingId: string, unitsToDeduct: number = 25) => {
    if (!token) return;
    setExecutingCommand(true);
    setErrorMsg(null);

    const cmdCode = `SETTLE_${Date.now()}`;

    try {
      const res = await fetch('/api/php/checkout/pay-from-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          booking_id: bookingId,
          units: unitsToDeduct,
          command_code: cmdCode,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Balance settlement rejected');
      }

      setSuccessMsg(data.message || `Settled ${bookingId} using ${data.units_deducted || unitsToDeduct} Units.`);
      loadDashboardData(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Settlement error';
      setErrorMsg(msg);
    } finally {
      setExecutingCommand(false);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      setErrorMsg('Receipt attachment must be under 2.5 MB.');
      return;
    }
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReceiptDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitManualWire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmittingWire(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const parsedUsd = Number(wireAmountUsd);
    const unitsReq = Math.max(1, Math.round(parsedUsd / 100));

    try {
      const res = await fetch('/api/php/payments/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          targetType: wireTargetType,
          targetId: wireTargetType === 'units' ? undefined : wireTargetId || undefined,
          unitsRequested: unitsReq,
          amountUsd: parsedUsd,
          paymentMethod: wireMethod,
          senderName: wireSenderName,
          originatingBank: wireBankName,
          wireReference,
          transferDate: wireDate,
          receiptFileName: receiptFileName || undefined,
          receiptDataUrl: receiptDataUrl || undefined,
          notes: wireNotes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit wire notice');
      }

      setSuccessMsg(data.message);
      setWireReference('');
      setWireNotes('');
      setReceiptFileName('');
      setReceiptDataUrl('');
      loadDashboardData(token);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit transfer notice');
    } finally {
      setSubmittingWire(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/php/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: profName,
          company: profCompany,
          role: profRole,
          phone: profPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Profile update failed');
      }
      setSuccessMsg('Client profile updated.');
      loadDashboardData(token);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleMarkNotificationsRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/php/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      loadDashboardData(token);
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingWiresCount = manualPayments.filter((m) => m.status === 'pending_verification').length;
  const unsettledHousing = bookings.filter((b) => b.status !== 'confirmed' && b.paymentProvider !== 'unit_balance');
  const unsettledFleet = vehicleBookings.filter((vb) => vb.status === 'awaiting_payment');
  const unsettledOrders = orders.filter((o) => o.paymentStatus === 'pending_payment' || o.paymentStatus === 'pending_verification');

  return (
    <div className="bg-[#f7f3ed] text-[#282828] min-h-[780px] text-left pb-14">
      {/* Top Portal Live Photography Banner */}
      <div className="relative overflow-hidden border-b border-[#dfd5c9]">
        <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 py-9 sm:py-11 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-[#7ce8df] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Easy Travel Client Portal &amp; Order Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
              Guest, Family &amp; Corporate Client Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#efe7dc] max-w-2xl">
              Manage Sacramento residences, 3D fleet rentals, storefront orders, prepaid Lodging Units, and wire/ACH settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {customer && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('ledger')}
                  className="relative px-3 py-2 rounded-xl bg-white/14 hover:bg-white/22 backdrop-blur-xs border border-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[#7ce8df]" />
                  <span>Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#00b7a8] text-white font-black rounded-md text-[10px] tabular-nums">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => loadDashboardData(token!)}
                  className="px-3.5 py-2 rounded-xl bg-white/14 hover:bg-white/22 backdrop-blur-xs border border-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/65 border border-rose-400/40 hover:bg-rose-900/75 text-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-7 space-y-7">
        {/* Feedback Banners */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Notice:</span> {errorMsg}
              </div>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-700 hover:text-rose-950 font-semibold text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Confirmed:</span> {successMsg}
              </div>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-950 font-semibold text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* ========================================================
            UNAUTHENTICATED VIEW: SIGN IN / CREATE ACCOUNT
           ======================================================== */}
        {!customer ? (
          <div className="relative overflow-hidden rounded-3xl border border-[#dfd5c9] p-6 sm:p-10 shadow-xl">
            <LivePhotoBackground scene="cycle" secondaryScene="interior" overlay="espresso" />
            <div className="relative z-10 max-w-xl mx-auto w-full">
              <div className="bg-white/96 backdrop-blur-md border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#282828]">
                <div className="flex p-1 bg-[#f5efe8] rounded-xl border border-[#e6dfd5]">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === 'login' ? 'bg-[#00b7a8] text-white shadow-xs' : 'text-[#5c5046] hover:text-[#282828]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === 'register' ? 'bg-[#00b7a8] text-white shadow-xs' : 'text-[#5c5046] hover:text-[#282828]'
                    }`}
                  >
                    Sign Out / Create Account
                  </button>
                </div>

                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#282828] mb-1.5">Client Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#857568] pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="client@easytravellodging.com"
                          className="w-full pl-10 pr-4 h-11 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-sm text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#282828] mb-1.5">Account Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#857568] pointer-events-none" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 h-11 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-sm text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Authenticating Session...</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4" />
                          <span>Sign In to Client Dashboard</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#282828] mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Dr. Jennifer Hayes"
                          className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#282828] mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="(916) 555-0192"
                          className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#282828] mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="jennifer@hospital.org"
                          className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#282828] mb-1">Password (6+ chars) *</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#282828] mb-1">Employer / Hospital / Agency</label>
                        <input
                          type="text"
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          placeholder="UC Davis Health / Kaiser"
                          className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#282828] mb-1">Job Title / Role</label>
                        <input
                          type="text"
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                          placeholder="Travel Nurse / Relocation"
                          className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Create Account &amp; Claim 25 Welcome Units</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             AUTHENTICATED DASHBOARD
             ======================================================== */
          <div className="space-y-7">
            {/* 4 Crisp KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-[#b9ebe6] rounded-2xl shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00897d]">Available Balance</span>
                  <Coins className="w-4 h-4 text-[#00b7a8]" />
                </div>
                <div className="my-3">
                  <div className="text-3xl font-heading font-black text-[#282828] tabular-nums">
                    {customer.units_balance}{' '}
                    <span className="text-xs font-semibold text-[#857568]">Units</span>
                  </div>
                  <span className="text-xs text-[#5c5046] tabular-nums">
                    Credit Value: <strong className="text-[#282828]">${customer.balance_usd?.toLocaleString() || '0'} USD</strong>
                  </span>
                </div>
                <button
                  onClick={() => setBuyUnitsModalOpen(true)}
                  className="w-full py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Unit Package</span>
                </button>
              </div>

              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#857568]">Housing Stays</span>
                  <Building2 className="w-4 h-4 text-[#82634f]" />
                </div>
                <div className="my-3">
                  <div className="text-3xl font-heading font-black text-[#282828] tabular-nums">
                    {bookings.length}{' '}
                    <span className="text-xs font-semibold text-[#857568]">Suites</span>
                  </div>
                  <span className="text-xs text-[#5c5046]">
                    {unsettledHousing.length > 0 ? `${unsettledHousing.length} awaiting settlement` : 'All active stays confirmed'}
                  </span>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2 bg-[#faf8f5] hover:bg-[#f0e9df] text-[#282828] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#dfd7cc]"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#00b7a8]" />
                  <span>Reserve Sacramento Suite</span>
                </button>
              </div>

              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#857568]">3D Fleet Rentals</span>
                  <Car className="w-4 h-4 text-[#82634f]" />
                </div>
                <div className="my-3">
                  <div className="text-3xl font-heading font-black text-[#282828] tabular-nums">
                    {vehicleBookings.length}{' '}
                    <span className="text-xs font-semibold text-[#857568]">Vehicles</span>
                  </div>
                  <span className="text-xs text-[#5c5046]">
                    {unsettledFleet.length > 0 ? `${unsettledFleet.length} awaiting unit/wire settle` : 'SMF & Suite delivery ready'}
                  </span>
                </div>
                <button
                  onClick={() => onNavigateTab('vehicles')}
                  className="w-full py-2 bg-[#faf8f5] hover:bg-[#f0e9df] text-[#282828] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#dfd7cc]"
                >
                  <span>Explore 3D Vehicle Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#82634f]" />
                </button>
              </div>

              <div className="p-5 bg-white border border-[#ead5c3] rounded-2xl shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#82634f]">Wire / ACH Transfers</span>
                  <Landmark className="w-4 h-4 text-[#82634f]" />
                </div>
                <div className="my-3">
                  <div className="text-3xl font-heading font-black text-[#282828] tabular-nums">
                    {manualPayments.length}{' '}
                    <span className="text-xs font-semibold text-[#857568]">Notices</span>
                  </div>
                  <span className="text-xs text-[#5c5046] tabular-nums">
                    {pendingWiresCount > 0 ? `${pendingWiresCount} pending bank verification` : 'All submitted wires verified'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveSubTab('payments')}
                  className="w-full py-2 bg-[#82634f] hover:bg-[#6e5240] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Submit Wire / ACH Notice</span>
                </button>
              </div>
            </div>


            {/* Dashboard Section Switcher */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e6dfd5] pb-3">
              {[
                { id: 'overview', label: 'Housing Stays & Units', icon: Building2, count: bookings.length },
                { id: 'orders', label: 'Orders & Receipts', icon: ShoppingBag, count: orders.length },
                { id: 'fleet', label: 'Fleet Rentals', icon: Car, count: vehicleBookings.length },
                { id: 'payments', label: 'Wire / ACH Details', icon: Landmark, count: pendingWiresCount },
                { id: 'ledger', label: 'Ledger & Profile', icon: FileText, count: unreadCount },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSubTab(item.id as PortalSubTab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      active
                        ? 'bg-[#00897d] text-white shadow-xs'
                        : 'bg-white text-[#5c5046] hover:bg-[#f5efe8] hover:text-[#282828] border border-[#e6dfd5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.count > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold tabular-nums ${
                          active ? 'bg-white/20 text-white' : 'bg-[#e6dfd5] text-[#5c5046]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ========================================================
                SUB-TAB 1: HOUSING STAYS & INTERNAL COMMAND TERMINAL
               ======================================================== */}
            {activeSubTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between border-b border-[#ede6dc] pb-4">
                      <div>
                        <h3 className="font-heading font-bold text-base text-[#282828]">
                          Sacramento Housing Reservations
                        </h3>
                        <p className="text-xs text-[#5c5046]">
                          Settle pending leases immediately using your Lodging Units balance.
                        </p>
                      </div>
                      <span className="text-xs font-mono bg-[#faf8f5] px-2.5 py-1 rounded-lg text-[#5c5046] border border-[#e6dfd5] tabular-nums">
                        {bookings.length} Records
                      </span>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="text-center py-8 text-[#5c5046] space-y-3">
                        <p className="text-xs">No housing reservations linked to {customer.email} yet.</p>
                        <button
                          onClick={onOpenBooking}
                          className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                        >
                          Request 30+ Day Furnished Suite
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((b) => {
                          const isSettled = b.status === 'confirmed' || b.paymentProvider === 'unit_balance';
                          const unitsNeeded = b.unitCostUnits || 25;
                          const usdNeeded = b.unitCostUsd || unitsNeeded * 100;
                          return (
                            <div
                              key={b.id}
                              className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#007a70] bg-[#e8f8f6] px-2.5 py-0.5 rounded border border-[#b9ebe6]">
                                    {b.id}
                                  </span>
                                  <span className="font-bold text-sm text-[#282828] uppercase">
                                    {b.propertyId}
                                  </span>
                                </div>

                                <span
                                  className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                    isSettled
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}
                                >
                                  {isSettled ? 'Confirmed / Settled' : b.status.replace('_', ' ')}
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-xs text-[#282828] tabular-nums">
                                <div>
                                  <span className="text-[#857568] block text-[11px]">Move-In</span>
                                  <span className="font-semibold">{b.checkIn}</span>
                                </div>
                                <div>
                                  <span className="text-[#857568] block text-[11px]">Move-Out</span>
                                  <span className="font-semibold">{b.checkOut}</span>
                                </div>
                                <div>
                                  <span className="text-[#857568] block text-[11px]">Stay Length</span>
                                  <span className="font-semibold">{b.totalNights} Nights</span>
                                </div>
                              </div>

                              {b.notes && (
                                <p className="text-[11px] text-[#5c5046] bg-white p-2.5 rounded-lg border border-[#e6dfd5]">
                                  {b.notes}
                                </p>
                              )}

                              <div className="pt-2.5 border-t border-[#e6dfd5] flex flex-wrap items-center justify-between gap-3">
                                <span className="text-[11px] text-[#5c5046] font-mono tabular-nums">
                                  Allotment: {unitsNeeded} Units (${usdNeeded.toLocaleString()} USD)
                                </span>

                                {!isSettled ? (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setWireTargetType('housing_booking');
                                        setWireTargetId(b.id);
                                        setWireAmountUsd(String(usdNeeded));
                                        setActiveSubTab('payments');
                                      }}
                                      className="px-3 py-1.5 bg-white hover:bg-[#f0e9df] text-[#282828] text-xs font-semibold rounded-lg border border-[#dfd7cc] cursor-pointer transition-colors"
                                    >
                                      Pay via Wire
                                    </button>
                                    <button
                                      type="button"
                                      disabled={executingCommand || customer.units_balance < unitsNeeded}
                                      onClick={() => handleExecuteInternalBalanceCheckout(b.id, unitsNeeded)}
                                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-[#ede7df] disabled:text-[#9a8d80] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <CreditCard className="w-3.5 h-3.5" />
                                      <span>Pay From Balance ({unitsNeeded} Units)</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Settled ({b.paymentReference || 'Verified'})</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Purchased Unit Packages */}
                  <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ede6dc] pb-3">
                      <h3 className="font-heading font-bold text-base text-[#282828]">
                        Unit Allotment Packages
                      </h3>
                      <button
                        onClick={() => setBuyUnitsModalOpen(true)}
                        className="text-xs font-bold text-[#00897d] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Purchase Package
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(customer.purchases || []).map((pch) => (
                        <div
                          key={pch.id}
                          className="p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#282828] block">{pch.description}</span>
                            <span className="text-[11px] text-[#857568]">
                              {new Date(pch.purchased_at).toLocaleDateString()} • {pch.payment_method}
                            </span>
                          </div>
                          <div className="text-right tabular-nums">
                            <span className="font-bold text-emerald-700 block">+{pch.units_purchased} Units</span>
                            <span className="text-[11px] text-[#5c5046]">${pch.amount_usd.toLocaleString()} USD</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Recent Storefront Orders + Account Summary */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ede6dc] pb-3">
                      <div>
                        <h3 className="font-heading font-bold text-base text-[#282828]">
                          Storefront Orders &amp; Checkout
                        </h3>
                        <p className="text-xs text-[#5c5046]">
                          Bundle residences, vehicles, and arrival services in one cart.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('orders')}
                        className="text-xs font-bold text-[#00897d] hover:underline cursor-pointer"
                      >
                        View All ({orders.length})
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <p className="text-xs text-[#5c5046] py-2">
                        No online cart orders placed yet. Use your Lodging Units or bank transfer at checkout.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {orders.slice(0, 3).map((ord) => (
                          <div
                            key={ord.id}
                            className="p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-mono font-bold text-[#282828] block">{ord.orderReference}</span>
                              <span className="text-[11px] text-[#857568] truncate block">
                                {ord.items.length} item(s) · {new Date(ord.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-right shrink-0 tabular-nums">
                              <span className="font-bold text-[#282828] block">${ord.totalUsd.toLocaleString()}</span>
                              <span
                                className={`text-[11px] font-semibold ${
                                  ord.paymentStatus === 'paid'
                                    ? 'text-emerald-700'
                                    : ord.paymentStatus === 'failed' || ord.paymentStatus === 'cancelled'
                                    ? 'text-rose-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {ord.paymentStatus === 'paid'
                                  ? 'Paid & Verified'
                                  : ord.paymentStatus.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => onNavigateTab('shop')}
                        className="py-2.5 px-3 bg-[#faf8f5] hover:bg-[#f0e9df] text-[#282828] text-xs font-semibold rounded-xl border border-[#dfd7cc] cursor-pointer transition-colors"
                      >
                        Add Services &amp; Units
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('cart')}
                        className="py-2.5 px-3 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        Open Shopping Cart
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xs space-y-3">
                    <span className="text-xs font-bold text-[#00897d] uppercase tracking-wider block">
                      Account Holder
                    </span>
                    <div className="space-y-1 text-xs">
                      <div className="text-base font-bold text-[#282828]">{customer.name}</div>
                      {(customer.role || customer.company) && (
                        <div className="text-[#5c5046] font-medium">
                          {[customer.role, customer.company].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      <div className="text-[#857568]">{customer.email} · {customer.phone}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('ledger')}
                      className="text-xs font-bold text-[#82634f] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Settings className="w-3.5 h-3.5" /> Edit Profile &amp; Notification Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SUB-TAB: STOREFRONT ORDERS & RECEIPTS
               ======================================================== */}
            {activeSubTab === 'orders' && (
              <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ede6dc] pb-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#282828]">
                      Storefront Orders, Payment Verification &amp; Receipts
                    </h3>
                    <p className="text-xs text-[#5c5046]">
                      Orders paid via Lodging Units confirm immediately; wire, ACH, and Zelle orders confirm as soon as treasury verifies settlement.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTab('shop')}
                      className="px-3.5 py-2 bg-[#faf8f5] hover:bg-[#f0e9df] text-[#282828] text-xs font-semibold rounded-xl border border-[#dfd7cc] cursor-pointer transition-colors"
                    >
                      Browse Storefront
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('cart')}
                      className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                    >
                      Open Cart &amp; Lookup
                    </button>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3 text-[#5c5046]">
                    <ShoppingBag className="w-10 h-10 text-[#b0a396] mx-auto" />
                    <p className="text-sm font-semibold text-[#282828]">No storefront orders linked to {customer.email} yet.</p>
                    <p className="text-xs max-w-md mx-auto">
                      Add furnished residences, 3D fleet rentals, arrival packages, or Lodging Unit bundles to your cart and check out using your Unit Balance or bank transfer.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('shop')}
                      className="px-5 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                    >
                      Explore Services &amp; Packages
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord, idx) => {
                      const isPaid = ord.paymentStatus === 'paid';
                      const isPending = ord.paymentStatus === 'pending_payment' || ord.paymentStatus === 'pending_verification';
                      return (
                        <div
                          key={ord.id}
                          className="p-5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-3">
                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-mono font-bold text-sm text-[#00897d]">
                                  {ord.orderReference}
                                </span>
                                <span aria-hidden="true" className="text-[#b8aba0]">·</span>
                                <span className="text-[#857568]">
                                  {new Date(ord.createdAt).toLocaleString()}
                                </span>
                                <span aria-hidden="true" className="text-[#b8aba0]">·</span>
                                <span className="text-[#282828] font-medium capitalize">
                                  {ord.paymentMethod.replace(/_/g, ' ')}
                                </span>
                              </div>
                              {ord.paymentReference && (
                                <div className="text-[11px] font-mono text-[#5c5046]">
                                  Payment Reference: {ord.paymentReference}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Payment Verified · {ord.orderStatus}</span>
                                </span>
                              ) : isPending ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {ord.paymentStatus === 'pending_verification'
                                      ? 'Pending Treasury Verification'
                                      : 'Awaiting Payment Transfer'}
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700">
                                  <XCircle className="w-4 h-4" />
                                  <span className="capitalize">{ord.paymentStatus.replace(/_/g, ' ')}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {ord.items.map((item, itemIdx) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-[#ede6dc] last:border-0"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image || getFallbackPropertyImage(idx + itemIdx)}
                                    alt={item.title}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = getFallbackPropertyImage(idx + itemIdx);
                                    }}
                                    className="w-11 h-11 rounded-lg object-cover bg-[#efe9e0] shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-bold text-[#282828] truncate">{item.title}</div>
                                    <div className="text-[11px] text-[#5c5046] truncate">
                                      {item.category} · {item.quantity} {item.quantityLabel} × ${item.unitPriceUsd.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="font-bold text-[#282828] tabular-nums shrink-0">
                                  ${item.lineSubtotalUsd.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-[#e6dfd5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#5c5046] tabular-nums">
                              <span>Subtotal: ${ord.subtotalUsd.toLocaleString()}</span>
                              {ord.serviceFeeUsd > 0 && <span>Fee: ${ord.serviceFeeUsd.toLocaleString()}</span>}
                              {ord.taxUsd > 0 && <span>Tax: ${ord.taxUsd.toLocaleString()}</span>}
                              {ord.discountUsd > 0 && (
                                <span className="text-emerald-700 font-semibold">
                                  Discount{ord.promoCode ? ` (${ord.promoCode})` : ''}: -${ord.discountUsd.toLocaleString()}
                                </span>
                              )}
                              <span className="font-bold text-[#282828] text-sm">
                                Total: ${ord.totalUsd.toLocaleString()} USD ({ord.totalUnitsRequired}u)
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWireTargetType('order');
                                    setWireTargetId(ord.orderReference);
                                    setWireAmountUsd(String(ord.totalUsd));
                                    setActiveSubTab('payments');
                                  }}
                                  className="px-3.5 py-1.5 bg-[#82634f] hover:bg-[#6e5240] text-white font-bold rounded-lg cursor-pointer transition-colors"
                                >
                                  Submit Wire / ACH Proof
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => window.print()}
                                className="px-3 py-1.5 bg-white hover:bg-[#f0e9df] text-[#282828] font-semibold rounded-lg border border-[#dfd7cc] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#82634f]" />
                                <span>{isPaid ? 'Print Receipt' : 'Print Order Summary'}</span>
                              </button>
                            </div>
                          </div>

                          {ord.adminNotes && (
                            <div className="text-[11px] text-[#007a70] bg-[#e8f8f6] border border-[#b9ebe6] rounded-lg px-3 py-2">
                              Concierge / Treasury Note: {ord.adminNotes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                SUB-TAB 2: MY FLEET RENTALS
               ======================================================== */}
            {activeSubTab === 'fleet' && (
              <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ede6dc] pb-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#282828]">
                      American Fleet Reservations &amp; Concierge Delivery
                    </h3>
                    <p className="text-xs text-[#5c5046]">
                      Vehicles scheduled for SMF Airport arrival or Rancho Cordova suite delivery.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('vehicles')}
                    className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Open 3D Fleet Configurator</span>
                  </button>
                </div>

                {vehicleBookings.length === 0 ? (
                  <div className="text-center py-12 space-y-3 text-[#5c5046]">
                    <Car className="w-10 h-10 text-[#b0a396] mx-auto" />
                    <p className="text-sm font-semibold text-[#282828]">No fleet rentals currently booked.</p>
                    <p className="text-xs max-w-md mx-auto">
                      Inspect our Ford Mustang GT, Tesla Model Y, Chevrolet Suburban, Ford F-150 Crew Cab, and Cadillac Escalade in real-time 3D.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('vehicles')}
                      className="px-5 py-2.5 bg-[#82634f] hover:bg-[#6e5240] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                    >
                      Browse 3D Vehicle Fleet
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicleBookings.map((vb) => {
                      const settled = vb.status === 'confirmed' || vb.status === 'active' || vb.status === 'completed';
                      return (
                        <div
                          key={vb.id}
                          className="p-5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-4 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-mono text-[11px] font-bold text-[#6e5240] bg-[#f5efe8] px-2 py-0.5 rounded border border-[#dfd3c5]">
                                  {vb.id}
                                </span>
                                <h4 className="font-heading font-bold text-base text-[#282828] mt-1.5">
                                  {vb.vehicleName}
                                </h4>
                              </div>
                              <span
                                className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                  settled
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {vb.status.replace('_', ' ')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-[#5c5046]">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-[#c9bfb2] shrink-0"
                                style={{ backgroundColor: vb.exteriorColorHex }}
                              />
                              <span>Finish: <strong className="text-[#282828]">{vb.exteriorColorName}</strong></span>
                              <span>•</span>
                              <span className="capitalize">{vb.rateTier} Tier</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-lg border border-[#e6dfd5] tabular-nums">
                              <div>
                                <span className="text-[10px] text-[#857568] block">Pickup</span>
                                <span className="font-semibold text-[#282828]">{vb.pickupDate}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-[#857568] block">Return</span>
                                <span className="font-semibold text-[#282828]">{vb.returnDate}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-[#857568] block">Total</span>
                                <span className="font-bold text-[#00897d]">${vb.totalUsd.toLocaleString()} ({vb.unitsRequired}u)</span>
                              </div>
                            </div>

                            <div className="text-xs text-[#5c5046]">
                              <strong className="text-[#282828]">Delivery Hub:</strong> {vb.pickupLocation}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#e6dfd5] flex flex-wrap items-center justify-between gap-2">
                            {!settled ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWireTargetType('vehicle_booking');
                                    setWireTargetId(vb.id);
                                    setWireAmountUsd(String(vb.totalUsd));
                                    setActiveSubTab('payments');
                                  }}
                                  className="px-3 py-1.5 bg-white hover:bg-[#f0e9df] text-[#282828] text-xs font-semibold rounded-lg border border-[#dfd7cc] cursor-pointer transition-colors"
                                >
                                  Submit Wire Receipt
                                </button>
                                <button
                                  type="button"
                                  disabled={executingCommand || customer.units_balance < vb.unitsRequired}
                                  onClick={() => handleExecuteInternalBalanceCheckout(vb.id, vb.unitsRequired)}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-[#ede7df] disabled:text-[#9a8d80] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                                >
                                  <Coins className="w-3.5 h-3.5" />
                                  <span>Settle ({vb.unitsRequired} Units)</span>
                                </button>
                              </>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Confirmed ({vb.paymentReference || 'Verified'})</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                SUB-TAB 3: WIRE / ACH & OFFICIAL BANK INSTRUCTIONS
               ======================================================== */}
            {activeSubTab === 'payments' && (
              <div className="space-y-7">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                  {/* Left: Official Receiving Bank Account Instructions */}
                  <div className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xs overflow-hidden">
                    <div className="relative overflow-hidden p-6 text-white">
                      <LivePhotoBackground scene="twilight" overlay="espresso" />
                      <div className="relative z-10 space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7ce8df]">
                          Official Treasury Instructions
                        </span>
                        <h3 className="font-heading font-bold text-lg text-white">
                          Wire, Direct ACH &amp; Corporate Zelle
                        </h3>
                        <p className="text-xs text-[#efe7dc]">
                          Transfer corporate housing funds or unit package payments to our verified escrow account below, then log your transfer reference on the right.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {paymentAccounts ? (
                        <div className="space-y-2.5 text-xs">
                          {[
                            { label: 'Receiving Bank', value: paymentAccounts.bankName },
                            { label: 'Beneficiary Name', value: paymentAccounts.accountName },
                            { label: 'Account Number', value: paymentAccounts.accountNumber },
                            { label: 'ACH Routing', value: paymentAccounts.achRoutingNumber },
                            { label: 'Domestic Wire ABA', value: paymentAccounts.wireRoutingNumber },
                            { label: 'SWIFT / BIC', value: paymentAccounts.swiftCode },
                            { label: 'Corporate Zelle', value: paymentAccounts.zelleEmail },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="p-2.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase tracking-wider text-[#857568] block">
                                  {item.label}
                                </span>
                                <span className="font-mono font-semibold text-[#282828] truncate block">
                                  {item.value}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopy(item.label, item.value)}
                                className="px-2.5 py-1 bg-white hover:bg-[#f0e9df] border border-[#dfd7cc] rounded-lg text-[11px] font-semibold text-[#5c5046] flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                              >
                                {copiedField === item.label ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-700">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ))}

                          <div className="p-3 bg-[#e8f8f6] border border-[#b9ebe6] rounded-xl text-[11px] text-[#006960] leading-relaxed">
                            {paymentAccounts.paymentInstructions}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#5c5046]">Loading treasury account configuration...</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Submit Wire / ACH Transfer Notice Form */}
                  <div className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-5">
                    <div className="border-b border-[#ede6dc] pb-3">
                      <h3 className="font-heading font-bold text-lg text-[#282828]">
                        Submit Wire / ACH Transfer Verification Notice
                      </h3>
                      <p className="text-xs text-[#5c5046]">
                        Once our accounting team verifies your bank wire or ACH trace number, units or booking confirmations post automatically.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitManualWire} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block font-bold text-[#282828] mb-1">Apply Payment Toward *</label>
                          <select
                            value={wireTargetType}
                            onChange={(e) => {
                              const nextType = e.target.value as 'units' | 'housing_booking' | 'vehicle_booking' | 'order';
                              setWireTargetType(nextType);
                              if (nextType === 'housing_booking' && unsettledHousing[0]) {
                                setWireTargetId(unsettledHousing[0].id);
                              } else if (nextType === 'vehicle_booking' && unsettledFleet[0]) {
                                setWireTargetId(unsettledFleet[0].id);
                              } else if (nextType === 'order' && unsettledOrders[0]) {
                                setWireTargetId(unsettledOrders[0].orderReference);
                                setWireAmountUsd(String(unsettledOrders[0].totalUsd));
                              } else {
                                setWireTargetId('');
                              }
                            }}
                            className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          >
                            <option value="units">Credit Lodging Units ($100 = 1 Unit)</option>
                            <option value="order">Settle Storefront Order (ORD-ETL-...)</option>
                            <option value="housing_booking">Settle Housing Reservation</option>
                            <option value="vehicle_booking">Settle Fleet Vehicle Rental</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-[#282828] mb-1">Transfer Method *</label>
                          <select
                            value={wireMethod}
                            onChange={(e) => setWireMethod(e.target.value as 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate')}
                            className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          >
                            <option value="Wire Transfer">Domestic / Fedwire Transfer</option>
                            <option value="Direct ACH">Direct Bank ACH</option>
                            <option value="Zelle Corporate">Corporate Zelle</option>
                          </select>
                        </div>
                      </div>

                      {wireTargetType !== 'units' && (
                        <div>
                          <label className="block font-bold text-[#282828] mb-1">Target Order or Reservation ID</label>
                          <input
                            type="text"
                            value={wireTargetId}
                            onChange={(e) => setWireTargetId(e.target.value)}
                            placeholder={
                              wireTargetType === 'order'
                                ? 'e.g. ORD-ETL-849320'
                                : wireTargetType === 'housing_booking'
                                ? 'e.g. bk_rec_914'
                                : 'e.g. vbk_701'
                            }
                            className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] font-mono outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block font-bold text-[#282828] mb-1">Amount Sent (USD) *</label>
                          <input
                            type="number"
                            min={100}
                            step={1}
                            required
                            value={wireAmountUsd}
                            onChange={(e) => setWireAmountUsd(e.target.value)}
                            className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                          <span className="text-[10px] text-[#00897d] font-semibold mt-0.5 block tabular-nums">
                            ≈ {Math.max(1, Math.round((Number(wireAmountUsd) || 0) / 100))} Lodging Units
                          </span>
                        </div>

                        <div>
                          <label className="block font-bold text-[#282828] mb-1">Transfer Date *</label>
                          <input
                            type="date"
                            required
                            value={wireDate}
                            onChange={(e) => setWireDate(e.target.value)}
                            className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#282828] mb-1">Wire / IMAD / ACH Ref *</label>
                          <input
                            type="text"
                            required
                            value={wireReference}
                            onChange={(e) => setWireReference(e.target.value)}
                            placeholder="IMAD-20261101-8841"
                            className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] font-mono outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block font-bold text-[#282828] mb-1">Sender Account Name *</label>
                          <input
                            type="text"
                            required
                            value={wireSenderName}
                            onChange={(e) => setWireSenderName(e.target.value)}
                            placeholder="Kaiser Permanente Travel AP"
                            className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#282828] mb-1">Originating Bank *</label>
                          <input
                            type="text"
                            required
                            value={wireBankName}
                            onChange={(e) => setWireBankName(e.target.value)}
                            placeholder="Wells Fargo / Bank of America"
                            className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#282828] mb-1">
                          Upload Wire Receipt / Remittance Advice (Optional Image/PDF)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="px-3.5 py-2 bg-[#faf8f5] hover:bg-[#f0e9df] border border-[#dfd7cc] rounded-xl text-[#282828] font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5 text-[#00b7a8]" />
                            <span>{receiptFileName || 'Choose Receipt File'}</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleReceiptUpload}
                              className="hidden"
                            />
                          </label>
                          {receiptFileName && (
                            <button
                              type="button"
                              onClick={() => {
                                setReceiptFileName('');
                                setReceiptDataUrl('');
                              }}
                              className="text-rose-700 hover:underline text-xs font-semibold cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#282828] mb-1">Remittance Memo / Notes</label>
                        <input
                          type="text"
                          value={wireNotes}
                          onChange={(e) => setWireNotes(e.target.value)}
                          placeholder="Optional department cost center or invoice number..."
                          className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingWire}
                        className="w-full py-3 bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        {submittingWire ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Transfer Notice...</span>
                          </>
                        ) : (
                          <>
                            <Landmark className="w-4 h-4" />
                            <span>Submit Transfer for Treasury Verification</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Submitted Manual Payments History */}
                <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ede6dc] pb-3">
                    <h3 className="font-heading font-bold text-base text-[#282828]">
                      Submitted Wire &amp; ACH Verification Log
                    </h3>
                    <span className="text-xs text-[#857568] tabular-nums">{manualPayments.length} Submissions</span>
                  </div>

                  {manualPayments.length === 0 ? (
                    <p className="text-xs text-[#5c5046] py-4 text-center">
                      No manual wire or ACH notices submitted yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {manualPayments.map((mp) => (
                        <div
                          key={mp.id}
                          className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-[#282828]">{mp.referenceCode}</span>
                              <span className="text-[#b8aba0]">•</span>
                              <span className="text-[#5c5046] font-semibold">{mp.paymentMethod}</span>
                              <span className="text-[#b8aba0]">•</span>
                              <span className="font-mono text-[#82634f]">Trace: {mp.wireReference}</span>
                            </div>
                            <div className="text-[11px] text-[#5c5046]">
                              From {mp.senderName} ({mp.originatingBank}) on {mp.transferDate} • Target:{' '}
                              <span className="text-[#282828] font-medium">{mp.targetId || `${mp.unitsRequested} Lodging Units`}</span>
                            </div>
                            {mp.adminNotes && (
                              <div className="text-[11px] text-[#00897d] font-medium">
                                Treasury Note: {mp.adminNotes}
                              </div>
                            )}
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 tabular-nums">
                            <span className="font-bold text-sm text-[#282828]">
                              ${mp.amountUsd.toLocaleString()} USD
                            </span>
                            {mp.status === 'verified' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            )}
                            {mp.status === 'pending_verification' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase">
                                <Clock className="w-3 h-3" /> Pending Review
                              </span>
                            )}
                            {mp.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold uppercase">
                                <XCircle className="w-3 h-3" /> Rejected
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================
                SUB-TAB 4: LEDGER, ALERTS & PROFILE
               ======================================================== */}
            {activeSubTab === 'ledger' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                {/* Left: Transactions & Alerts */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Notifications */}
                  <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ede6dc] pb-3">
                      <h3 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#00b7a8]" />
                        <span>Account Alerts &amp; Confirmations</span>
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkNotificationsRead}
                          className="text-xs font-bold text-[#00897d] hover:underline cursor-pointer"
                        >
                          Mark All Read
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#5c5046]">No recent account notifications.</p>
                    ) : (
                      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                              n.read
                                ? 'bg-[#faf8f5] border-[#e6dfd5] text-[#5c5046]'
                                : 'bg-[#e8f8f6]/60 border-[#b9ebe6] text-[#282828]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-[#282828]">{n.title}</span>
                              <span className="text-[10px] text-[#857568]">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Full Ledger */}
                  <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ede6dc] pb-3">
                      <h3 className="font-heading font-bold text-base text-[#282828]">
                        Complete Unit &amp; USD Ledger
                      </h3>
                      <span className="text-xs text-[#857568] tabular-nums">
                        {customer.transactions?.length || 0} Entries
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 text-xs">
                      {(customer.transactions || []).map((tx) => (
                        <div
                          key={tx.id}
                          className="p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <span className="font-semibold text-[#282828] block truncate">
                              {tx.description}
                            </span>
                            <span className="text-[10px] text-[#857568] font-mono">
                              {new Date(tx.date).toLocaleDateString()} • {tx.id}
                            </span>
                          </div>
                          <div className="text-right shrink-0 tabular-nums">
                            <span
                              className={`font-bold block ${
                                tx.units >= 0 ? 'text-emerald-700' : 'text-[#82634f]'
                              }`}
                            >
                              {tx.units >= 0 ? `+${tx.units}` : tx.units} Units
                            </span>
                            <span className="text-[10px] text-[#5c5046]">
                              ${Math.abs(tx.amount_usd).toLocaleString()} USD
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Client Profile Editor */}
                <div className="lg:col-span-5">
                  <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="border-b border-[#ede6dc] pb-3">
                      <h3 className="font-heading font-bold text-base text-[#282828]">
                        Traveler &amp; Corporate Profile
                      </h3>
                      <p className="text-xs text-[#5c5046]">
                        Keep your contact details current for lease agreements and concierge vehicle delivery.
                      </p>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-[#282828] mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profName}
                          onChange={(e) => setProfName(e.target.value)}
                          className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#282828] mb-1">Account Email (Read-only)</label>
                        <input
                          type="email"
                          disabled
                          value={customer.email}
                          className="w-full h-10 px-3.5 bg-[#f2ede6] border border-[#e6dfd5] rounded-xl text-[#857568]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#282828] mb-1">Employer / Agency</label>
                        <input
                          type="text"
                          value={profCompany}
                          onChange={(e) => setProfCompany(e.target.value)}
                          className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#282828] mb-1">Role / Title</label>
                        <input
                          type="text"
                          value={profRole}
                          onChange={(e) => setProfRole(e.target.value)}
                          className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#282828] mb-1">Mobile Phone</label>
                        <input
                          type="tel"
                          value={profPhone}
                          onChange={(e) => setProfPhone(e.target.value)}
                          className="w-full h-10 px-3.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="w-full py-3 bg-[#00b7a8] hover:bg-[#009e91] text-white font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                      >
                        {savingProfile ? 'Saving Changes...' : 'Save Client Profile'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instant Unit Allotment Modal */}
        {buyUnitsModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#1c1613]/65 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#e6dfd5] rounded-2xl max-w-md w-full overflow-hidden text-left shadow-2xl">
              <div className="relative overflow-hidden p-6 text-white">
                <LivePhotoBackground scene="courtyard" overlay="espresso" />
                <div className="relative z-10 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7ce8df]">
                    Corporate Unit Allotment
                  </span>
                  <h3 className="font-heading font-black text-xl text-white">
                    Add Lodging Units to Balance
                  </h3>
                  <p className="text-xs text-[#efe7dc]">
                    1 Unit = $100 USD toward any Sacramento suite or American 3D fleet rental.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {[10, 25, 50, 100].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedUnitTier(tier)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer tabular-nums ${
                        selectedUnitTier === tier
                          ? 'bg-[#e8f8f6] border-[#00b7a8] text-[#282828] shadow-2xs'
                          : 'bg-[#faf8f5] border-[#e6dfd5] text-[#5c5046] hover:border-[#00b7a8]'
                      }`}
                    >
                      <div className="text-lg font-heading font-black text-[#282828]">{tier} Units</div>
                      <div className="text-xs text-[#5c5046]">${(tier * 100).toLocaleString()} USD</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setBuyUnitsModalOpen(false)}
                    className="flex-1 py-2.5 bg-[#faf8f5] hover:bg-[#f0e9df] border border-[#dfd7cc] text-[#5c5046] text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handlePurchaseUnits}
                    className="flex-1 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                  >
                    {isLoading ? 'Crediting...' : `Credit ${selectedUnitTier} Units`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
