import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Mail,
  Building2,
  Coins,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  X,
  PlusCircle,
  CreditCard,
  Landmark,
  Check,
  ArrowRight,
  Copy,
  Clock,
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';
import {
  DashboardTab,
  UserSession,
  UserAccommodationReservation,
  UserCarRentalBooking,
  UserPaymentRecord,
  UserNotificationItem,
  UserMessageItem,
} from './dashboard/types';
import { DashboardHeader } from './dashboard/includes/DashboardHeader';
import { DashboardSidebar } from './dashboard/includes/DashboardSidebar';
import { DashboardFooter } from './dashboard/includes/DashboardFooter';
import { TransactionReceiptModal } from './dashboard/components/TransactionReceiptModal';
import { Printer } from 'lucide-react';

// Modules
import { OverviewModule } from './dashboard/modules/OverviewModule';
import { AccommodationModule } from './dashboard/modules/AccommodationModule';
import { CarRentalsModule } from './dashboard/modules/CarRentalsModule';
import { PaymentsModule } from './dashboard/modules/PaymentsModule';
import { SavedItemsModule } from './dashboard/modules/SavedItemsModule';
import { NotificationsModule } from './dashboard/modules/NotificationsModule';
import { MessagesModule } from './dashboard/modules/MessagesModule';
import { ProfileModule } from './dashboard/modules/ProfileModule';
import { SecurityModule } from './dashboard/modules/SecurityModule';
import { SettingsModule } from './dashboard/modules/SettingsModule';
import { SupportModule } from './dashboard/modules/SupportModule';

interface CustomerPortalProps {
  onOpenBooking: () => void;
  onNavigateTab: (tab: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onOpenBooking, onNavigateTab }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('etl_php_token'));
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Auth Inputs
  const [loginEmail, setLoginEmail] = useState('corporate@easytravellodging.com');
  const [loginPassword, setLoginPassword] = useState('welcome123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regRole, setRegRole] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [buyUnitsModalOpen, setBuyUnitsModalOpen] = useState(false);
  
  // Manual Payment Configuration State
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositMethod, setDepositMethod] = useState<string>('Direct Commercial Wire (Fedwire)');
  const [manualStep, setManualStep] = useState<number>(1);
  const [remitterName, setRemitterName] = useState<string>('OmniGlobal Enterprise Partners');
  const [wireRefCode, setWireRefCode] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [portalReceiptModalOpen, setPortalReceiptModalOpen] = useState(false);
  const [portalReceiptPayment, setPortalReceiptPayment] = useState<UserPaymentRecord | null>(null);

  // Authenticated State Stores
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('etl_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      id: 'USR-8942-CORP',
      name: 'Alexander Sterling',
      email: 'corporate@easytravellodging.com',
      phone: '+1 (415) 890-4321',
      company: 'OmniGlobal Enterprise Partners',
      role: 'Director of Corporate Housing & Relocation',
      units_balance: 75,
      balance_usd: 7500,
      memberSince: '2024-03-15',
      tier: 'Diamond Corporate Partner',
      twoFactorEnabled: true,
      idVerified: true,
      preferredCurrency: 'USD',
      timezone: 'America/New_York (Eastern Time)',
      address: {
        street: '450 Lexington Avenue, Suite 1900',
        city: 'New York',
        state: 'NY',
        zip: '10017',
        country: 'California’s homes',
      },
    };
  });

  const [accommodations, setAccommodations] = useState<UserAccommodationReservation[]>([
    {
      id: 'RES-US-8921',
      propertyId: 'residence-b',
      propertyTitle: 'Residence B · Ground-Floor Corporate Suite',
      unitNumber: 'Suite 104',
      location: 'Premier US Metropolitan Corridor',
      checkIn: '2025-04-10',
      checkOut: '2025-05-15',
      totalNights: 35,
      guestsCount: 2,
      status: 'confirmed',
      totalUsd: 4850,
      accessCode: '7821#',
      wifiNetwork: 'ETL-Suite-Secure-5G',
      wifiPassword: 'US-Furnished-Living',
      parkingSpace: 'Executive Bay #14',
      checkInInstructions: 'Self check-in via electronic keypad at Suite 104 entrance.',
      checkOutInstructions: 'Leave keys inside suite on kitchen island. Turn off climate system.',
      bookedAt: '2025-03-01',
      image: '/photos/residence-b-living.jpg',
    },
    {
      id: 'RES-US-9430',
      propertyId: 'residence-c',
      propertyTitle: 'Residence C · Modern Furnished Suite',
      unitNumber: 'Suite 208',
      location: 'Major US Business & Technology Hub',
      checkIn: '2025-06-01',
      checkOut: '2025-06-30',
      totalNights: 29,
      guestsCount: 1,
      status: 'pending',
      totalUsd: 3950,
      accessCode: 'Keypad release 24h before arrival',
      wifiNetwork: 'ETL-Guest-Secure',
      wifiPassword: 'Distributed upon check-in',
      parkingSpace: 'Covered Carport #22',
      checkInInstructions: 'Access instructions dispatched 24 hours prior to scheduled arrival.',
      checkOutInstructions: 'Standard corporate check-out at 11:00 AM local time.',
      bookedAt: '2025-03-20',
      image: '/photos/residence-c-living.jpg',
    },
  ]);

  const [carRentals, setCarRentals] = useState<UserCarRentalBooking[]>([
    {
      id: 'FLT-US-1049',
      vehicleId: 'audi-a3-2021',
      vehicleName: '2021 Audi A3 Premium Sedan',
      year: 2021,
      category: 'Luxury Sedan',
      colorName: 'Mythos Black Metallic',
      colorHex: '#141414',
      pickupDate: '2025-04-10',
      returnDate: '2025-04-24',
      totalDays: 14,
      pickupLocation: 'Major US International Airport Terminal Dispatch',
      returnLocation: 'Major US International Airport Terminal Dispatch',
      protectionPlan: 'executive_shield',
      status: 'active',
      totalUsd: 1890,
      primaryDriver: 'Alexander Sterling',
      driverLicenseNumber: 'US-DL-NY-9821470',
      driverLicenseState: 'NY',
      flightNumber: 'AA-1842',
      handoverCode: 'FLT-US-8902A3',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    },
  ]);

  const [payments, setPayments] = useState<UserPaymentRecord[]>([
    {
      id: 'PAY-US-5510',
      referenceCode: 'WIRE-US-98231',
      targetType: 'account_funds',
      description: 'Account Treasury Allocation Deposit ($5,000 USD)',
      amountUsd: 5000,
      paymentMethod: 'Direct Fedwire / Commercial ACH',
      status: 'settled',
      date: '2025-03-20',
      invoiceNumber: 'INV-US-2025-081',
      proofDocumentUrl: '#',
    },
    {
      id: 'PAY-US-5511',
      referenceCode: 'WIRE-US-99412',
      targetType: 'account_funds',
      description: 'Account Balance Credit ($2,500 USD)',
      amountUsd: 2500,
      paymentMethod: 'Wire Transfer',
      status: 'pending',
      date: '2025-03-28',
      invoiceNumber: 'INV-US-2025-094',
    },
  ]);

  const [notifications, setNotifications] = useState<UserNotificationItem[]>([
    {
      id: 'NOTIF-01',
      title: 'Stay Check-In Details Available',
      message: 'Access instructions and keyless keypad code for Residence B (RES-US-8921) are now active in your dashboard.',
      type: 'booking',
      isRead: false,
      timestamp: 'Today at 09:30 AM',
    },
    {
      id: 'NOTIF-02',
      title: 'Wire Remittance Pending Verification',
      message: 'Your treasury remittance notice (WIRE-US-99412 for $2,500.00 USD) is in review with our settlements desk.',
      type: 'payment',
      isRead: false,
      timestamp: 'Yesterday at 04:15 PM',
    },
    {
      id: 'NOTIF-03',
      title: 'Airport Fleet Handover Confirmed',
      message: 'Your 2021 Audi A3 Premium Sedan is detailed and scheduled for concierge curbside handover upon flight arrival.',
      type: 'booking',
      isRead: true,
      timestamp: 'Mar 26, 2025',
    },
    {
      id: 'NOTIF-04',
      title: 'Diamond Corporate Benefits Active',
      message: 'Your organization enjoys complimentary executive protection plans and priority dispatch across all US metros.',
      type: 'system',
      isRead: true,
      timestamp: 'Mar 15, 2025',
    },
  ]);

  const [messages, setMessages] = useState<UserMessageItem[]>([
    {
      id: 'MSG-01',
      sender: 'concierge',
      senderName: 'Easy Travel Concierge Desk',
      subject: 'Executive Residence Welcome & Arrival Concierge',
      body: 'Good morning Alexander, your corporate apartment has completed full sanitization and our staging team has stocked premium espresso and arrival refreshments. Please let us know if your team requires additional mid-stay housekeeping or airport transit adjustments.',
      timestamp: 'Today at 08:45 AM',
      isRead: false,
    },
    {
      id: 'MSG-02',
      sender: 'host',
      senderName: 'Fleet Operations Division',
      subject: 'Flight Tracking & Curbside Vehicle Delivery',
      body: 'We are actively monitoring flight AA-1842. Your executive sedan will be staged at the terminal passenger pickup zone exactly when your flight touches down.',
      timestamp: 'Yesterday at 02:10 PM',
      isRead: true,
    },
  ]);

  // Persist user session to localStorage
  useEffect(() => {
    localStorage.setItem('etl_user_session', JSON.stringify(userSession));
  }, [userSession]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    setTimeout(() => {
      const demoToken = `usr_session_${Date.now()}`;
      localStorage.setItem('etl_php_token', demoToken);
      setToken(demoToken);
      setSuccessMsg('Session authenticated. Welcome to your corporate dashboard.');
      setIsLoading(false);
    }, 600);
  };

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    setTimeout(() => {
      const demoToken = `usr_session_${Date.now()}`;
      localStorage.setItem('etl_php_token', demoToken);
      setToken(demoToken);

      const newUser: UserSession = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}-CORP`,
        name: regName || 'Corporate Client',
        email: regEmail || 'client@corporate.com',
        phone: regPhone || '+1 (555) 019-2834',
        company: regCompany || 'Partner Enterprise',
        role: regRole || 'Account Manager',
        units_balance: 0,
        balance_usd: 0,
        memberSince: new Date().toISOString().split('T')[0],
        tier: 'Corporate Client',
        twoFactorEnabled: false,
        idVerified: true,
        preferredCurrency: 'USD',
        timezone: 'America/New_York (Eastern Time)',
      };

      setUserSession(newUser);
      setSuccessMsg('Account registered successfully. Welcome to your corporate portal.');
      setIsLoading(false);
    }, 700);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem('etl_php_token');
    setToken(null);
    setSuccessMsg('You have successfully signed out.');
  };

  // Manual Payment Configuration - Open Modal Reset
  const handleOpenDepositModal = () => {
    setManualStep(1);
    setWireRefCode(`REMIT-US-${Math.floor(100000 + Math.random() * 900000)}`);
    setBuyUnitsModalOpen(true);
  };

  // Confirm & Process Manual Bank Remittance (Stays PENDING until Admin Approves)
  const handleTopUpUnits = () => {
    const addedUsd = Number(depositAmount);
    if (isNaN(addedUsd) || addedUsd <= 0) return;

    setIsLoading(true);
    setTimeout(() => {
      // Create payment entry with PENDING status
      const newPay: UserPaymentRecord = {
        id: `PAY-US-${Math.floor(1000 + Math.random() * 9000)}`,
        referenceCode: wireRefCode || `WIRE-US-${Date.now().toString().slice(-6)}`,
        targetType: 'account_funds',
        description: `Manual Account Deposit (${depositMethod}) - ${remitterName || userSession.company}`,
        amountUsd: addedUsd,
        paymentMethod: depositMethod,
        date: new Date().toISOString().split('T')[0],
        status: 'pending', // STAYS PENDING UNTIL ADMIN APPROVAL
        invoiceNumber: `INV-US-2026-${Math.floor(100 + Math.random() * 900)}`,
        proofDocumentUrl: '#',
      };
      setPayments((prev) => [newPay, ...prev]);

      // Add account alert notification
      const newNotif: UserNotificationItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title: 'Manual Deposit Submitted (Pending Admin Approval)',
        message: `Your manual remittance notice (${newPay.referenceCode} for $${addedUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD) is in review. Balance will update upon admin approval.`,
        type: 'payment',
        isRead: false,
        timestamp: 'Just now',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      setIsLoading(false);
      setManualStep(3); // Step 3: Pending Confirmation Screen
      setSuccessMsg(`Manual payment submitted. Remittance reference ${newPay.referenceCode} is pending treasury admin approval.`);
    }, 700);
  };

  // ADMIN APPROVAL HANDLER: Approve Payment & Credit Balance
  const handleApprovePayment = (paymentId: string) => {
    const targetPayment = payments.find((p) => p.id === paymentId);
    if (!targetPayment || targetPayment.status !== 'pending') return;

    // Update payment status to settled
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'settled' } : p))
    );

    // Credit user's account balance
    setUserSession((prev) => ({
      ...prev,
      units_balance: Math.floor((prev.balance_usd + targetPayment.amountUsd) / 100),
      balance_usd: prev.balance_usd + targetPayment.amountUsd,
    }));

    // Push notification to user
    const approveNotif: UserNotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Payment Approved & Balance Credited',
      message: `Treasury Admin approved payment ${targetPayment.referenceCode}. $${targetPayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD has been credited to your account balance.`,
      type: 'payment',
      isRead: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [approveNotif, ...prev]);

    setSuccessMsg(`Admin Approved: Payment ${targetPayment.referenceCode} settled and $${targetPayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD credited to client balance.`);
  };

  // ADMIN REJECTION HANDLER: Reject Payment
  const handleRejectPayment = (paymentId: string) => {
    const targetPayment = payments.find((p) => p.id === paymentId);
    if (!targetPayment) return;

    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'failed' } : p))
    );

    const rejectNotif: UserNotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Payment Remittance Declined',
      message: `Payment remittance ${targetPayment.referenceCode} for $${targetPayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD was declined by treasury audit.`,
      type: 'payment',
      isRead: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [rejectNotif, ...prev]);

    setErrorMsg(`Admin Action: Payment ${targetPayment.referenceCode} declined.`);
  };

  // Update Reservation handler
  const handleUpdateReservation = (id: string, updates: Partial<UserAccommodationReservation>) => {
    setAccommodations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Update Rental handler
  const handleUpdateRental = (id: string, updates: Partial<UserCarRentalBooking>) => {
    setCarRentals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Upload Payment Proof handler
  const handleUploadProof = async (
    refCode: string,
    bank: string,
    sender: string,
    fileNotes: string
  ): Promise<boolean> => {
    const newRecord: UserPaymentRecord = {
      id: `PAY-US-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceCode: refCode || `REMIT-${Date.now().toString().slice(-6)}`,
      targetType: 'account_funds',
      description: `Remittance Notice - ${sender || 'Corporate Treasury'} (${bank}) - ${fileNotes || 'Wire slip'}`,
      amountUsd: 2500,
      paymentMethod: 'Wire Transfer / ACH',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      invoiceNumber: `INV-US-2025-${Math.floor(100 + Math.random() * 900)}`,
      proofDocumentUrl: '#',
    };
    setPayments((prev) => [newRecord, ...prev]);
    return true;
  };

  // Send Message handler
  const handleSendMessage = async (
    subject: string,
    body: string,
    recipient: string
  ): Promise<boolean> => {
    const newMsg: UserMessageItem = {
      id: `MSG-${Date.now().toString().slice(-5)}`,
      sender: 'user',
      senderName: userSession.name,
      subject,
      body,
      timestamp: 'Just now',
      isRead: true,
    };
    setMessages((prev) => [newMsg, ...prev]);
    return true;
  };

  // Mark notification read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotifCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );
  const unreadMsgCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages]
  );

  // Calculate current PHP path breadcrumb
  const currentPhpPath = useMemo(() => {
    const folderMap: Record<DashboardTab, string> = {
      overview: 'Overview/',
      accommodation: 'Accommodation/',
      'car-rentals': 'CarRentals/',
      payments: 'Payments/',
      'saved-items': 'SavedItems/',
      notifications: 'Notifications/',
      messages: 'Messages/',
      profile: 'Profile/',
      security: 'Security/',
      settings: 'Settings/',
      support: 'Support/',
    };
    return `UserDashboard/${folderMap[activeTab]}index.php`;
  }, [activeTab]);

  return (
    <div className="bg-[#f7f3ed] text-[#282828] min-h-screen text-left flex flex-col font-sans">
      {/* ========================================================
          1. UNAUTHENTICATED: LOGIN / REGISTRATION VIEW
         ======================================================== */}
      {!token ? (
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Header Brand */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00897d]/10 border border-[#00897d]/20 text-[#00897d] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Client Portal · California’s homes</span>
              </div>
              <h2 className="text-3xl font-heading font-black text-[#282828] tracking-tight">
                {authMode === 'login' ? 'Sign In to Your Dashboard' : 'Open Corporate Lodging Account'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5c5046]">
                {authMode === 'login'
                  ? 'Access your nationwide furnished residences, 3D fleet rentals, and balance ledger.'
                  : 'Instant access to managed furnished residences, 3D vehicle fleet rentals, and USD top-up billing.'}
              </p>
            </div>

            {/* Notifications & Feedback */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Auth Box */}
            <div className="bg-white border border-[#dfd7cc] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl text-xs font-bold text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-[#282828] shadow-xs'
                      : 'text-[#857568] hover:text-[#282828]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-[#282828] shadow-xs'
                      : 'text-[#857568] hover:text-[#282828]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Login Form */}
              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Business or Guest Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-[#857568]" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-9 pr-3 h-10 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs font-medium text-[#282828] outline-none focus:border-[#00897d]"
                        placeholder="client@corporate.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-[#857568]" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-9 pr-3 h-10 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs font-medium text-[#282828] outline-none focus:border-[#00897d]"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#00897d] hover:bg-[#00746b] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate Dashboard</span>
                      </>
                    )}
                  </button>

                  <div className="p-3 bg-[#f8f5f0] border border-[#e6dfd5] rounded-xl text-[11px] text-[#5c5046] text-center">
                    <span>Demo Account Pre-Filled: </span>
                    <strong className="text-[#282828]">corporate@easytravellodging.com</strong>
                  </div>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Alexander Sterling"
                      className="w-full px-3 h-9.5 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00897d]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Corporate or Personal Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alexander@company.com"
                      className="w-full px-3 h-9.5 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00897d]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="Global Partners LLC"
                        className="w-full px-3 h-9.5 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00897d]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        placeholder="Relocation Manager"
                        className="w-full px-3 h-9.5 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00897d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 h-9.5 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00897d]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Set Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full px-3 h-9.5 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00897d]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#00897d] hover:bg-[#00746b] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Register &amp; Create Account</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onNavigateTab('home')}
                className="text-xs text-[#5c5046] hover:text-[#282828] underline cursor-pointer"
              >
                ← Return to Public Homepage
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
            2. AUTHENTICATED: COMPREHENSIVE USER DASHBOARD
           ======================================================== */
        <div className="flex-1 flex flex-col">
          {/* Top Header Bar */}
          <DashboardHeader
            user={userSession}
            activeTab={activeTab}
            currentPhpPath={currentPhpPath}
            unreadNotificationsCount={unreadNotifCount}
            unreadMessagesCount={unreadMsgCount}
            savedItemsCount={4}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setMobileMenuOpen(false);
            }}
            onOpenTopUpUnits={() => setBuyUnitsModalOpen(true)}
            onSignOut={handleSignOut}
            onReturnToSite={() => onNavigateTab('home')}
          />

          {/* Feedback Banners */}
          {successMsg && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMsg(null)}
                className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-800 flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-rose-700 hover:text-rose-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Dashboard Layout Container */}
          <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Sidebar (Desktop) */}
              <div className="hidden lg:block lg:col-span-3">
                <DashboardSidebar
                  activeTab={activeTab}
                  onSelectTab={(tab) => setActiveTab(tab)}
                  unreadNotificationsCount={unreadNotifCount}
                  unreadMessagesCount={unreadMsgCount}
                  savedItemsCount={4}
                />
              </div>

              {/* Main Content Area: Active Module */}
              <div className="lg:col-span-9 min-h-[600px]">
                {activeTab === 'overview' && (
                  <OverviewModule
                    user={userSession}
                    accommodations={accommodations}
                    carRentals={carRentals}
                    payments={payments}
                    onOpenBooking={onOpenBooking}
                    onOpenTopUpUnits={handleOpenDepositModal}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onViewBookingDetails={() => setActiveTab('accommodation')}
                    onViewRentalDetails={() => setActiveTab('car-rentals')}
                  />
                )}

                {activeTab === 'accommodation' && (
                  <AccommodationModule
                    reservations={accommodations}
                    onOpenBooking={onOpenBooking}
                    onUpdateReservation={handleUpdateReservation}
                  />
                )}

                {activeTab === 'car-rentals' && (
                  <CarRentalsModule
                    rentals={carRentals}
                    onExploreFleet={() => onNavigateTab('vehicles')}
                    onUpdateRental={handleUpdateRental}
                  />
                )}

                {activeTab === 'payments' && (
                  <PaymentsModule
                    payments={payments}
                    unitsBalance={userSession.units_balance ?? Math.floor(userSession.balance_usd / 100)}
                    onOpenTopUpUnits={handleOpenDepositModal}
                    onUploadProof={handleUploadProof}
                    onApprovePayment={handleApprovePayment}
                    onRejectPayment={handleRejectPayment}
                  />
                )}

                {activeTab === 'saved-items' && (
                  <SavedItemsModule
                    onReserveProperty={() => onOpenBooking()}
                    onExploreVehicles={() => onNavigateTab('vehicles')}
                  />
                )}

                {activeTab === 'notifications' && (
                  <NotificationsModule
                    notifications={notifications}
                    onMarkAsRead={handleMarkNotificationRead}
                    onMarkAllAsRead={handleMarkAllNotificationsRead}
                  />
                )}

                {activeTab === 'messages' && (
                  <MessagesModule
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileModule
                    user={userSession}
                    onUpdateUser={(updates) =>
                      setUserSession((prev) => ({ ...prev, ...updates }))
                    }
                  />
                )}

                {activeTab === 'security' && (
                  <SecurityModule
                    twoFactorEnabled={userSession.twoFactorEnabled}
                    onToggleTwoFactor={(enabled) =>
                      setUserSession((prev) => ({ ...prev, twoFactorEnabled: enabled }))
                    }
                  />
                )}

                {activeTab === 'settings' && <SettingsModule />}

                {activeTab === 'support' && <SupportModule />}
              </div>
            </div>
          </div>

          {/* Footer Component */}
          <DashboardFooter />
        </div>
      )}

      {/* ========================================================
          3. RESPONSIVE MANUAL PAYMENT TOP-UP MODAL (FIXED UI)
         ======================================================== */}
      {buyUnitsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col border border-[#e6dfd5] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header (Fixed Top) */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#f0e9df] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#00897d]/10 text-[#00897d] flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-base sm:text-lg text-[#282828] truncate">
                    Top-Up Account Balance
                  </h3>
                  <p className="text-xs text-[#5c5046] truncate">
                    Manual corporate wire &amp; ACH remittance setup
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBuyUnitsModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-[#e6dfd5] flex items-center justify-center text-[#857568] hover:text-[#282828] hover:bg-[#faf8f5] cursor-pointer shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Compact Stepper Progress Bar */}
              <div className="flex items-center justify-between bg-[#faf8f5] px-3 py-2 rounded-xl border border-[#efe9e0] text-[11px] font-bold">
                <div className={`flex items-center gap-1.5 ${manualStep >= 1 ? 'text-[#00897d]' : 'text-[#857568]'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${manualStep >= 1 ? 'bg-[#00897d] text-white' : 'bg-[#e6dfd5] text-[#857568]'}`}>1</span>
                  <span className="hidden sm:inline">Configure</span>
                </div>
                <span className="text-[#d8cfc3]">→</span>
                <div className={`flex items-center gap-1.5 ${manualStep >= 2 ? 'text-[#00897d]' : 'text-[#857568]'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${manualStep >= 2 ? 'bg-[#00897d] text-white' : 'bg-[#e6dfd5] text-[#857568]'}`}>2</span>
                  <span className="hidden sm:inline">Wire Routing</span>
                </div>
                <span className="text-[#d8cfc3]">→</span>
                <div className={`flex items-center gap-1.5 ${manualStep >= 3 ? 'text-[#00897d]' : 'text-[#857568]'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${manualStep >= 3 ? 'bg-[#00897d] text-white' : 'bg-[#e6dfd5] text-[#857568]'}`}>3</span>
                  <span className="hidden sm:inline">Confirmation</span>
                </div>
              </div>

              {/* STEP 1: CONFIGURE MANUAL DEPOSIT */}
              {manualStep === 1 && (
                <div className="space-y-4 text-xs">
                  {/* Deposit Amount Entry */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568]">
                      1. Enter Top-Up Amount (USD):
                    </label>

                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-lg font-black text-[#282828]">$</span>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={depositAmount || ''}
                        onChange={(e) => setDepositAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full h-11 pl-8 pr-14 bg-[#faf8f5] border-2 border-[#d8cfc3] focus:border-[#00897d] rounded-xl text-lg font-mono font-bold text-[#282828] outline-none transition-colors"
                        placeholder="1000"
                      />
                      <span className="absolute right-3.5 text-xs font-bold text-[#857568]">USD</span>
                    </div>

                    {/* Quick Add Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-[#857568] font-bold uppercase mr-0.5">Presets:</span>
                      {[500, 1000, 2500, 5000, 10000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(amt)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            depositAmount === amt
                              ? 'bg-[#00897d] text-white border-[#00897d]'
                              : 'bg-[#faf8f5] border-[#d8cfc3] text-[#5c5046] hover:bg-[#efe8df]'
                          }`}
                        >
                          +${amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Settlement Method Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568]">
                      2. Select Manual Settlement Channel:
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: 'Direct Commercial Wire (Fedwire)',
                          label: 'Direct Fedwire / SWIFT Transfer',
                          desc: 'Interbank wire transfer directly to operating escrow',
                        },
                        {
                          id: 'Corporate ACH Direct Deposit',
                          label: 'Corporate ACH Direct Remittance',
                          desc: 'Automated Clearing House batch deposit from A/P',
                        },
                        {
                          id: 'Manual Bank Counter / Cashier Check',
                          label: 'Manual Bank Counter Deposit / Check',
                          desc: 'Physical branch teller or certified cashier check deposit',
                        },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setDepositMethod(method.id)}
                          className={`w-full p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            depositMethod === method.id
                              ? 'bg-[#00897d]/5 border-[#00897d] ring-1 ring-[#00897d]'
                              : 'bg-[#faf8f5] border-[#e6dfd5] hover:bg-[#f5efe8]'
                          }`}
                        >
                          <div className="pr-2">
                            <span className="font-bold text-[#282828] block text-xs">{method.label}</span>
                            <span className="text-[10px] text-[#5c5046] leading-tight block mt-0.5">{method.desc}</span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              depositMethod === method.id
                                ? 'border-[#00897d] bg-[#00897d]'
                                : 'border-[#a89988]'
                            }`}
                          >
                            {depositMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Remitter Information */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      3. Remitting Entity / Company Name:
                    </label>
                    <input
                      type="text"
                      value={remitterName}
                      onChange={(e) => setRemitterName(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs font-semibold text-[#282828]"
                      placeholder="e.g. OmniGlobal Enterprise Partners"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: BANK ROUTING & WIRE CREDENTIALS */}
              {manualStep === 2 && (
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      Please transfer exactly <strong>${(depositAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong> to our receiving bank below and include the reference code in your payment memo.
                    </span>
                  </div>

                  {/* Official Bank Wiring Details */}
                  <div className="p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#857568] block">
                      Official Receiving Bank Credentials
                    </span>

                    <div className="divide-y divide-[#efe9e0] text-xs">
                      <div className="py-1.5 flex items-center justify-between">
                        <span className="text-[#5c5046]">Beneficiary Name:</span>
                        <strong className="text-[#282828]">Easy Travel Lodging LLC</strong>
                      </div>
                      <div className="py-1.5 flex items-center justify-between">
                        <span className="text-[#5c5046]">Receiving Bank:</span>
                        <strong className="text-[#282828]">Bank of America, N.A.</strong>
                      </div>
                      <div className="py-1.5 flex items-center justify-between">
                        <span className="text-[#5c5046]">Routing / ABA (Domestic Wire):</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-[#282828]">121000358</strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('121000358');
                              setCopiedField('aba');
                              setTimeout(() => setCopiedField(null), 2000);
                            }}
                            className="p-1 text-[#857568] hover:text-[#00897d] cursor-pointer"
                            title="Copy ABA Routing"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedField === 'aba' && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                        </div>
                      </div>
                      <div className="py-1.5 flex items-center justify-between">
                        <span className="text-[#5c5046]">Account Number:</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-[#282828]">325088219441</strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('325088219441');
                              setCopiedField('acct');
                              setTimeout(() => setCopiedField(null), 2000);
                            }}
                            className="p-1 text-[#857568] hover:text-[#00897d] cursor-pointer"
                            title="Copy Account Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedField === 'acct' && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                        </div>
                      </div>
                      <div className="py-1.5 flex items-center justify-between bg-emerald-50/60 p-2 rounded-lg border border-emerald-200">
                        <span className="text-emerald-900 font-bold">Payment Memo Reference (Mandatory):</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-emerald-800 text-sm">{wireRefCode}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(wireRefCode);
                              setCopiedField('ref');
                              setTimeout(() => setCopiedField(null), 2000);
                            }}
                            className="p-1 text-emerald-700 hover:text-emerald-900 cursor-pointer"
                            title="Copy Reference Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedField === 'ref' && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optional Trace Number Entry */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Bank Confirmation / Federal Wire Trace # (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FED-WIRE-982104 or ACH-88120"
                      onChange={(e) => {
                        if (e.target.value.trim()) setWireRefCode(e.target.value.trim());
                      }}
                      className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs font-mono text-[#282828]"
                    />
                    <p className="text-[10px] text-[#857568] mt-1">
                      Entering your bank transfer confirmation speeds up automated treasury ledger matching.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: MANUAL DEPOSIT SUBMITTED & PENDING APPROVAL */}
              {manualStep === 3 && (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                    <Clock className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[10px] uppercase tracking-wider mb-1">
                      Pending Admin Approval
                    </div>
                    <h4 className="font-heading font-black text-lg text-[#282828]">
                      Manual Deposit Notice Logged
                    </h4>
                    <p className="text-xs text-[#5c5046]">
                      Your remittance notice of <strong>${(depositAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong> has been received and is awaiting treasury admin approval.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl text-xs space-y-2 text-left max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-[#857568]">Remittance Reference:</span>
                      <strong className="font-mono text-[#282828]">{wireRefCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#857568]">Settlement Channel:</span>
                      <span className="font-semibold text-[#282828] truncate max-w-[200px]">{depositMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#857568]">Amount Pending:</span>
                      <strong className="text-amber-800 font-bold text-sm tabular-nums">${(depositAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#e6dfd5]">
                      <span className="font-bold text-[#282828]">Approval Status:</span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Pending Admin Review
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer (Fixed at Bottom - Never Cut Off) */}
            <div className="p-3.5 sm:p-4 bg-[#faf8f5] border-t border-[#e6dfd5] flex items-center justify-between gap-2 shrink-0">
              {manualStep === 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setBuyUnitsModalOpen(false)}
                    className="px-4 py-2 border border-[#d8cfc3] text-[#5c5046] hover:bg-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!depositAmount || depositAmount <= 0}
                    onClick={() => setManualStep(2)}
                    className="px-4 sm:px-5 py-2.5 bg-[#00897d] hover:bg-[#00746b] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>View Routing Instructions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {manualStep === 2 && (
                <>
                  <button
                    type="button"
                    onClick={() => setManualStep(1)}
                    className="px-3.5 py-2 border border-[#d8cfc3] text-[#5c5046] hover:bg-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleTopUpUnits}
                    className="px-4 sm:px-5 py-2.5 bg-[#00897d] hover:bg-[#00746b] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Notice...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Submit Manual Deposit (${(depositAmount || 0).toLocaleString()} USD)</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {manualStep === 3 && (
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPortalReceiptPayment({
                        id: 'PAY-TEMP-' + Date.now(),
                        referenceCode: wireRefCode || 'FED-WIRE-PENDING',
                        targetType: 'account_funds',
                        description: `Account Balance Top-Up (${depositMethod})`,
                        amountUsd: depositAmount,
                        paymentMethod: depositMethod,
                        status: 'pending',
                        date: new Date().toISOString().split('T')[0],
                        invoiceNumber: 'INV-2026-' + Math.floor(10000 + Math.random() * 90000),
                      });
                      setPortalReceiptModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>Print Transaction Receipt (White/Black)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBuyUnitsModalOpen(false);
                      setActiveTab('payments');
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#00897d] hover:bg-[#00746b] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs"
                  >
                    Done &amp; View Pending Payments
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Printable Transaction Receipt Template Modal */}
      <TransactionReceiptModal
        isOpen={portalReceiptModalOpen}
        onClose={() => setPortalReceiptModalOpen(false)}
        payment={portalReceiptPayment}
        userSession={userSession}
      />
    </div>
  );
};
