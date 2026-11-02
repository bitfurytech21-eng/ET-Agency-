import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Landmark,
  ArrowRight,
  Copy,
  Clock,
  Printer,
} from 'lucide-react';
import { LIVE_PHOTO_URLS } from './LivePhotoBackground';
import { PROPERTIES } from '../data/lodgingData';
import { getVehicleImage } from '../data/fleetImages';
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
  const [loginEmail, setLoginEmail] = useState('easytravelagency@trustagent.space');
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
      dashboardId: 'WS-CA-8942',
      name: 'Alexander Sterling',
      email: 'easytravelagency@trustagent.space',
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
      timezone: 'America/Los_Angeles (Pacific Time)',
      address: {
        street: '450 Lexington Avenue, Suite 1900',
        city: 'New York',
        state: 'NY',
        zip: '10017',
        country: 'United States',
      },
    };
  });

  const [accommodations, setAccommodations] = useState<UserAccommodationReservation[]>([
    {
      id: 'RES-US-8921',
      propertyId: 'residence-b',
      propertyTitle: 'Residence B · Ground-Floor Corporate Suite',
      unitNumber: 'Suite 104',
      location: 'Sacramento Metropolitan Corridor, CA',
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
      image: PROPERTIES[0]?.images?.[0] || LIVE_PHOTO_URLS.interior,
    },
    {
      id: 'RES-US-9430',
      propertyId: 'residence-c',
      propertyTitle: 'Residence C · Modern Furnished Suite',
      unitNumber: 'Suite 208',
      location: 'Midtown Sacramento Business District, CA',
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
      image: PROPERTIES[1]?.images?.[0] || LIVE_PHOTO_URLS.courtyard,
    },
  ]);

  const [carRentals, setCarRentals] = useState<UserCarRentalBooking[]>([
    {
      id: 'FLT-US-1049',
      vehicleId: 'audi-a3-2021',
      vehicleName: 'Audi A3 Premium Sedan',
      year: 2021,
      category: 'Luxury Sedan',
      colorName: 'Mythos Black Metallic',
      colorHex: '#141414',
      pickupDate: '2025-04-10',
      returnDate: '2025-04-24',
      totalDays: 14,
      pickupLocation: 'Sacramento International Airport (SMF) Terminal Dispatch',
      returnLocation: 'Sacramento International Airport (SMF) Terminal Dispatch',
      protectionPlan: 'executive_shield',
      status: 'active',
      totalUsd: 1890,
      primaryDriver: 'Alexander Sterling',
      driverLicenseNumber: 'US-DL-NY-9821470',
      driverLicenseState: 'NY',
      flightNumber: 'AA-1842',
      handoverCode: 'FLT-US-8902A3',
      image: getVehicleImage('audi-a3-2021'),
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
      message: 'Your organization enjoys complimentary executive protection plans and priority dispatch across California metros.',
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
      body: 'We are actively monitoring flight AA-1842. Your executive sedan will be staged at the terminal passenger pickup zone upon touchdown.',
      timestamp: 'Yesterday at 02:10 PM',
      isRead: true,
    },
  ]);

  useEffect(() => {
    localStorage.setItem('etl_user_session', JSON.stringify(userSession));
  }, [userSession]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    setTimeout(() => {
      const demoToken = `usr_session_${Date.now()}`;
      localStorage.setItem('etl_php_token', demoToken);
      setToken(demoToken);
      setSuccessMsg('Session authenticated. Welcome to your corporate workspace.');
      setIsLoading(false);
    }, 500);
  };

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
        dashboardId: `WS-CA-${Math.floor(1000 + Math.random() * 9000)}`,
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
        timezone: 'America/Los_Angeles (Pacific Time)',
      };

      setUserSession(newUser);
      setSuccessMsg('Account registered successfully. Welcome to your corporate portal.');
      setIsLoading(false);
    }, 600);
  };

  const handleSignOut = () => {
    localStorage.removeItem('etl_php_token');
    setToken(null);
    setSuccessMsg('You have signed out of your workspace.');
  };

  const handleOpenDepositModal = () => {
    setManualStep(1);
    setWireRefCode(`REMIT-US-${Math.floor(100000 + Math.random() * 900000)}`);
    setBuyUnitsModalOpen(true);
  };

  const handleTopUpUnits = () => {
    const addedUsd = Number(depositAmount);
    if (isNaN(addedUsd) || addedUsd <= 0) return;

    setIsLoading(true);
    setTimeout(() => {
      const newPay: UserPaymentRecord = {
        id: `PAY-US-${Math.floor(1000 + Math.random() * 9000)}`,
        referenceCode: wireRefCode || `WIRE-US-${Date.now().toString().slice(-6)}`,
        targetType: 'account_funds',
        description: `Manual Account Deposit (${depositMethod}) - ${remitterName || userSession.company}`,
        amountUsd: addedUsd,
        paymentMethod: depositMethod,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        invoiceNumber: `INV-US-2026-${Math.floor(100 + Math.random() * 900)}`,
        proofDocumentUrl: '#',
      };
      setPayments((prev) => [newPay, ...prev]);

      const newNotif: UserNotificationItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title: 'Manual Deposit Submitted (Pending Verification)',
        message: `Your manual remittance notice (${newPay.referenceCode} for $${addedUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD) is in review. Balance updates upon accounting verification.`,
        type: 'payment',
        isRead: false,
        timestamp: 'Just now',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      setIsLoading(false);
      setManualStep(3);
      setSuccessMsg(`Remittance reference ${newPay.referenceCode} logged and pending accounting verification.`);
    }, 600);
  };

  const handleApprovePayment = (paymentId: string) => {
    const targetPayment = payments.find((p) => p.id === paymentId);
    if (!targetPayment || targetPayment.status !== 'pending') return;

    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'settled' } : p)),
    );

    setUserSession((prev) => ({
      ...prev,
      units_balance: Math.floor((prev.balance_usd + targetPayment.amountUsd) / 100),
      balance_usd: prev.balance_usd + targetPayment.amountUsd,
    }));

    const approveNotif: UserNotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Payment Approved & Balance Credited',
      message: `Treasury approved payment ${targetPayment.referenceCode}. $${targetPayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD credited to your account balance.`,
      type: 'payment',
      isRead: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [approveNotif, ...prev]);

    setSuccessMsg(`Payment ${targetPayment.referenceCode} settled and $${targetPayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD credited.`);
  };

  const handleRejectPayment = (paymentId: string) => {
    const targetPayment = payments.find((p) => p.id === paymentId);
    if (!targetPayment) return;

    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'failed' } : p)),
    );

    const rejectNotif: UserNotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Payment Remittance Declined',
      message: `Payment remittance ${targetPayment.referenceCode} for $${targetPayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD was declined during verification.`,
      type: 'payment',
      isRead: false,
      timestamp: 'Just now',
    };
    setNotifications((prev) => [rejectNotif, ...prev]);

    setErrorMsg(`Payment ${targetPayment.referenceCode} declined.`);
  };

  const handleUpdateReservation = (id: string, updates: Partial<UserAccommodationReservation>) => {
    setAccommodations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleUpdateRental = (id: string, updates: Partial<UserCarRentalBooking>) => {
    setCarRentals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleUploadProof = async (
    refCode: string,
    bank: string,
    sender: string,
    fileNotes: string,
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

  const handleSendMessage = async (
    subject: string,
    body: string,
    _recipient: string,
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

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotifCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );
  const unreadMsgCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages],
  );

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen text-left flex flex-col font-sans">
      {/* ========================================================
          1. UNAUTHENTICATED: LOGIN / REGISTRATION VIEW
         ======================================================== */}
      {!token ? (
        <div className="flex-1 flex flex-col justify-center py-14 px-4 sm:px-6 lg:px-8 bg-[#0f172a]">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-[#5eead4] type-support font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Easy Travel Lodging · Client Workspace</span>
              </div>
              <h2 className="type-h2 text-white">
                {authMode === 'login' ? 'Sign In to Client Portal' : 'Create Corporate Account'}
              </h2>
              <p className="type-body text-slate-300">
                {authMode === 'login'
                  ? 'Access your furnished residence bookings, vehicle reservations, and financial ledger.'
                  : 'Register for direct corporate housing reservations, vehicle dispatch, and consolidated invoicing.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 type-support flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 type-support flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-200 rounded-xl type-btn text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    authMode === 'login'
                      ? 'bg-white text-[#0f172a] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-[#0f172a]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    authMode === 'register'
                      ? 'bg-white text-[#0f172a] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-[#0f172a]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="form-label">Business or Guest Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="form-input pl-9"
                        placeholder="client@corporate.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="form-input pl-9"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In to Dashboard</span>
                    )}
                  </button>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl type-support text-slate-600 text-center">
                    <span>Pre-filled Demo Account: </span>
                    <strong className="text-[#0f172a]">easytravelagency@trustagent.space</strong>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="form-label">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Alexander Sterling"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Corporate or Personal Email *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alexander@company.com"
                      className="form-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="Global Partners LLC"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        placeholder="Relocation Manager"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="form-input tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="form-label">Set Password *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Client Account</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onNavigateTab('home')}
                className="type-nav text-slate-300 hover:text-white underline cursor-pointer"
              >
                ← Return to Public Website
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
            2. AUTHENTICATED: CLIENT WORKSPACE DASHBOARD
           ======================================================== */
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            user={userSession}
            activeTab={activeTab}
            unreadNotificationsCount={unreadNotifCount}
            unreadMessagesCount={unreadMsgCount}
            savedItemsCount={3}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setMobileMenuOpen(false);
            }}
            onOpenTopUpUnits={handleOpenDepositModal}
            onSignOut={handleSignOut}
            onReturnToSite={() => onNavigateTab('home')}
          />

          {successMsg && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 type-support text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-[1440px] mx-auto w-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMsg(null)}
                className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 type-support text-rose-900 flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-[1440px] mx-auto w-full">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-rose-700 hover:text-rose-950 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="hidden lg:block lg:col-span-3 sticky top-22">
                <DashboardSidebar
                  user={userSession}
                  activeTab={activeTab}
                  onSelectTab={(tab) => setActiveTab(tab)}
                  onSignOut={handleSignOut}
                  unreadNotificationsCount={unreadNotifCount}
                  unreadMessagesCount={unreadMsgCount}
                  savedItemsCount={3}
                />
              </div>

              <div className="lg:col-span-9 min-h-[620px]">
                <div key={activeTab} className="page-transition-wrapper">
                  {activeTab === 'overview' && (
                    <OverviewModule
                      user={userSession}
                      accommodations={accommodations}
                      carRentals={carRentals}
                      payments={payments}
                      onOpenBooking={onOpenBooking}
                      onExploreFleet={() => onNavigateTab('vehicles')}
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
                      balanceUsd={userSession.balance_usd}
                      unitsBalance={userSession.units_balance ?? Math.floor(userSession.balance_usd / 100)}
                      userSession={userSession}
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
                      onNavigateTab={(tab) => setActiveTab(tab)}
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
                      onUpdateUser={(updates: Partial<UserSession>) =>
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
                      onSignOut={handleSignOut}
                    />
                  )}

                  {activeTab === 'settings' && <SettingsModule />}

                  {activeTab === 'support' && <SupportModule />}
                </div>
              </div>
            </div>
          </div>

          <DashboardFooter />
        </div>
      )}

      {/* ========================================================
          3. MANUAL PAYMENT TOP-UP MODAL
         ======================================================== */}
      {buyUnitsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#edf6f8] text-[#14616d] flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="type-h3 text-[#0f172a] truncate">
                    Add Account Funds
                  </h3>
                  <p className="type-support text-slate-500 truncate">
                    Corporate wire &amp; ACH treasury remittance
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBuyUnitsModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0f172a] hover:bg-slate-50 cursor-pointer shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 type-support font-semibold">
                <div className={`flex items-center gap-1.5 ${manualStep >= 1 ? 'text-[#14616d]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold tabular-nums ${manualStep >= 1 ? 'bg-[#14616d] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
                  <span className="hidden sm:inline">Configure</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className={`flex items-center gap-1.5 ${manualStep >= 2 ? 'text-[#14616d]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold tabular-nums ${manualStep >= 2 ? 'bg-[#14616d] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                  <span className="hidden sm:inline">Wire Routing</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className={`flex items-center gap-1.5 ${manualStep >= 3 ? 'text-[#14616d]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold tabular-nums ${manualStep >= 3 ? 'bg-[#14616d] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
                  <span className="hidden sm:inline">Confirmation</span>
                </div>
              </div>

              {manualStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="form-label">1. Deposit Amount (USD)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-base font-bold text-[#0f172a]">$</span>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={depositAmount || ''}
                        onChange={(e) => setDepositAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full h-11 pl-8 pr-14 bg-slate-50 border border-slate-300 focus:border-[#14616d] focus:bg-white rounded-xl text-base font-mono font-bold text-[#0f172a] outline-none transition-colors tabular-nums"
                        placeholder="1000"
                      />
                      <span className="absolute right-3.5 type-support font-semibold text-slate-500">USD</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 tabular-nums">
                      {[500, 1000, 2500, 5000, 10000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(amt)}
                          className={`type-btn px-3 py-1.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                            depositAmount === amt
                              ? 'bg-[#14616d] text-white border-[#14616d]'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          +${amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="form-label">2. Settlement Channel</label>
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
                          label: 'Bank Counter Deposit / Certified Check',
                          desc: 'Branch teller or certified corporate check deposit',
                        },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setDepositMethod(method.id)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                            depositMethod === method.id
                              ? 'bg-[#edf6f8] border-[#14616d]'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="pr-2">
                            <span className="type-btn text-[#0f172a] block">{method.label}</span>
                            <span className="type-support text-slate-500 block mt-0.5">{method.desc}</span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              depositMethod === method.id
                                ? 'border-[#14616d] bg-[#14616d]'
                                : 'border-slate-300'
                            }`}
                          >
                            {depositMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">3. Remitting Entity / Company Name</label>
                    <input
                      type="text"
                      value={remitterName}
                      onChange={(e) => setRemitterName(e.target.value)}
                      className="form-input"
                      placeholder="e.g. OmniGlobal Enterprise Partners"
                    />
                  </div>
                </div>
              )}

              {manualStep === 2 && (
                <div className="space-y-3.5 type-support">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 type-support flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      Transfer <strong className="tabular-nums">${(depositAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong> to the receiving bank below and include the memo reference code.
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 tabular-nums">
                    <span className="type-label text-[#0f172a] block">
                      Official Receiving Bank Credentials
                    </span>

                    <div className="divide-y divide-slate-200 type-support">
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-600">Beneficiary Name</span>
                        <strong className="text-[#0f172a]">Easy Travel Lodging LLC</strong>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-600">Receiving Bank</span>
                        <strong className="text-[#0f172a]">Bank of America, N.A.</strong>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-600">Routing / ABA</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-[#0f172a]">121000358</strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('121000358');
                              setCopiedField('aba');
                              setTimeout(() => setCopiedField(null), 2000);
                            }}
                            className="p-1 text-slate-500 hover:text-[#14616d] cursor-pointer"
                            title="Copy ABA Routing"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedField === 'aba' && <span className="text-xs text-emerald-600 font-semibold">Copied</span>}
                        </div>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-600">Account Number</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-[#0f172a]">325088219441</strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('325088219441');
                              setCopiedField('acct');
                              setTimeout(() => setCopiedField(null), 2000);
                            }}
                            className="p-1 text-slate-500 hover:text-[#14616d] cursor-pointer"
                            title="Copy Account Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedField === 'acct' && <span className="text-xs text-emerald-600 font-semibold">Copied</span>}
                        </div>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <span className="text-[#0f172a] font-semibold">Payment Memo Reference</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-mono text-[#14616d] text-sm">{wireRefCode}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(wireRefCode);
                              setCopiedField('ref');
                              setTimeout(() => setCopiedField(null), 2000);
                            }}
                            className="p-1 text-[#14616d] hover:text-[#0f4952] cursor-pointer"
                            title="Copy Reference Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedField === 'ref' && <span className="text-xs text-emerald-600 font-semibold">Copied</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Bank Confirmation / Federal Wire Trace # (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. FED-WIRE-982104 or ACH-88120"
                      onChange={(e) => {
                        if (e.target.value.trim()) setWireRefCode(e.target.value.trim());
                      }}
                      className="form-input font-mono"
                    />
                  </div>
                </div>
              )}

              {manualStep === 3 && (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <span className="type-support font-semibold text-amber-700 block">
                      Pending Accounting Verification
                    </span>
                    <h4 className="type-h3 text-[#0f172a]">
                      Deposit Notice Recorded
                    </h4>
                    <p className="type-body text-slate-600">
                      Your remittance notice of <strong className="tabular-nums">${(depositAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong> has been queued for treasury review.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl type-support space-y-2 text-left max-w-md mx-auto tabular-nums">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reference</span>
                      <strong className="font-mono text-[#0f172a]">{wireRefCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Channel</span>
                      <span className="font-semibold text-[#0f172a] truncate max-w-[210px]">{depositMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Pending</span>
                      <strong className="text-[#0f172a] font-bold">${(depositAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              {manualStep === 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setBuyUnitsModalOpen(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!depositAmount || depositAmount <= 0}
                    onClick={() => setManualStep(2)}
                    className="btn btn-primary btn-sm disabled:opacity-50"
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
                    className="btn btn-outline btn-sm"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleTopUpUnits}
                    className="btn btn-primary btn-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="tabular-nums">Submit Deposit (${(depositAmount || 0).toLocaleString()} USD)</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {manualStep === 3 && (
                <div className="w-full flex flex-col sm:flex-row items-center justify-end gap-2">
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
                    className="btn btn-outline btn-sm w-full sm:w-auto"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBuyUnitsModalOpen(false);
                      setActiveTab('payments');
                    }}
                    className="btn btn-primary btn-sm w-full sm:w-auto"
                  >
                    Done &amp; View Payments
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <TransactionReceiptModal
        isOpen={portalReceiptModalOpen}
        onClose={() => setPortalReceiptModalOpen(false)}
        payment={portalReceiptPayment}
        userSession={userSession}
      />
    </div>
  );
};
