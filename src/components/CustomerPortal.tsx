import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Building2, 
  Briefcase, 
  Phone, 
  Coins, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Terminal, 
  PlusCircle, 
  FileText, 
  Calendar, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Send,
  Building,
  RefreshCw,
  Hash
} from 'lucide-react';

interface CustomerPortalProps {
  onOpenBooking: () => void;
  onNavigateTab: (tab: string) => void;
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
  purchases: Array<{
    id: string;
    description: string;
    unit_number: string;
    units_purchased: number;
    amount_usd: number;
    status: string;
    purchased_at: string;
    payment_method: string;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    units: number;
    amount_usd: number;
    description: string;
    date: string;
    command_code?: string;
  }>;
}

interface BookingRecord {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  status: string;
  paymentProvider?: string;
  paymentReference?: string;
  notes?: string;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onOpenBooking, onNavigateTab }) => {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('etl_php_token'));
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
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

  // UI / Action states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [buyUnitsModalOpen, setBuyUnitsModalOpen] = useState(false);
  const [selectedUnitTier, setSelectedUnitTier] = useState<number>(25);

  // Internal Command Console State
  const [internalCommandLog, setInternalCommandLog] = useState<string[]>([
    'PHP 8.2 CLI Engine initialized.',
    'Ready for customer unit commands.'
  ]);
  const [executingCommand, setExecutingCommand] = useState(false);

  // Fetch Dashboard Data
  const loadDashboardData = async (activeToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/php/dashboard/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: activeToken }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setBookings(data.bookings || []);
      } else {
        // Token invalid, clear it
        handleLogout();
      }
    } catch (err) {
      console.error('[PHP Dashboard] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

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
      setSuccessMsg('Welcome back! PHP session authenticated.');
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
      setSuccessMsg('Account created successfully with 25 Welcome Unit Credits!');
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
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  // Buy Units handler
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
          payment_method: 'Corporate Wire / ACH Invoice',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Purchase failed');

      setSuccessMsg(`Successfully purchased ${selectedUnitTier} units!`);
      setBuyUnitsModalOpen(false);
      loadDashboardData(token);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error purchasing units');
    } finally {
      setIsLoading(false);
    }
  };

  // INTERNAL COMMAND: Pay from balance (deduct units)
  const handleExecuteInternalBalanceCheckout = async (bookingId: string, unitsToDeduct: number = 25) => {
    if (!token) return;
    setExecutingCommand(true);
    setErrorMsg(null);

    const cmdCode = `CMD_INTERNAL_SETTLE_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString();

    setInternalCommandLog((prev) => [
      ...prev,
      `[${timestamp}] Executing: php checkout_balance.php pay --booking="${bookingId}" --units=${unitsToDeduct} --cmd="${cmdCode}"`,
    ]);

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
        throw new Error(data.message || 'Internal command execution rejected');
      }

      setInternalCommandLog((prev) => [
        ...prev,
        `[${timestamp}] SUCCESS: ${data.message}`,
        `[${timestamp}] TX ID: ${data.transaction.id} | Remaining Balance: ${data.remaining_units} Units ($${data.remaining_balance_usd})`,
      ]);

      setSuccessMsg(`Internal settlement complete! Deducted ${unitsToDeduct} units to settle booking ${bookingId}.`);
      loadDashboardData(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Execution error';
      setInternalCommandLog((prev) => [...prev, `[${timestamp}] ERROR: ${msg}`]);
      setErrorMsg(msg);
    } finally {
      setExecutingCommand(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-900 text-white min-h-[750px] text-left">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>PHP 8.2 Client Dashboard &amp; Records Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white">
              Customer Portal &amp; Unit Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Individual account management, unit purchase records, stay invoices, and internal balance settlement.
            </p>
          </div>

          {customer && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => loadDashboardData(token!)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/50 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Feedback Notifications */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Notice:</span> {errorMsg}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Success:</span> {successMsg}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 1: SIGN IN / SIGN UP (When Unauthenticated)
           ======================================================== */}
        {!customer ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
            {/* Left: Info Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Individual Client Access
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white leading-tight">
                  Manage Units, Reservations &amp; Corporate Credits
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Sign in to your Easy Travel Lodging client account powered by a PHP 8.2 backend service. Track booked Sacramento suites, purchase unit packages, and execute direct balance settlements.
                </p>
              </div>

              {/* Demo Credentials Quick Box */}
              <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-blue-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Demo Executive Account Available
                  </span>
                  <span className="text-[10px] bg-blue-900/50 px-2 py-0.5 rounded-full border border-blue-700">Pre-seeded</span>
                </div>
                <div className="font-mono text-slate-300 text-[11px] space-y-1">
                  <div><strong>Email:</strong> client@easytravellodging.com</div>
                  <div><strong>Password:</strong> welcome123</div>
                  <div className="text-emerald-400"><strong>Initial Balance:</strong> 84 Units ($8,400 Credit)</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginEmail('client@easytravellodging.com');
                    setLoginPassword('welcome123');
                  }}
                  className="w-full py-1.5 mt-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Load Demo Credentials
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Encrypted session tokens with bcrypt password hashing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-blue-400" />
                  <span>1 Unit = $100 lodging credit with zero expiration</span>
                </div>
              </div>
            </div>

            {/* Right: Authentication Form */}
            <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Client Account
                </button>
              </div>

              {authMode === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Client Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="client@easytravellodging.com"
                        className="w-full pl-10 pr-4 h-11 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Account Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 h-11 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying with PHP Engine...</span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        <span>Sign In to Dashboard</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Jennifer Hayes"
                      className="w-full px-3.5 h-10 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="jennifer@hospital.org"
                        className="w-full px-3.5 h-10 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Password (6+ chars) *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 h-10 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Employer / Hospital / Agency
                      </label>
                      <input
                        type="text"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="e.g. Kaiser Permanente"
                        className="w-full px-3.5 h-10 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Job Title / Traveler Role
                      </label>
                      <input
                        type="text"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        placeholder="e.g. Travel Nurse"
                        className="w-full px-3.5 h-10 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Registering PHP Account...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Create Account &amp; Claim 25 Units</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================
             VIEW 2: AUTHENTICATED CUSTOMER DASHBOARD
             ======================================================== */
          <div className="space-y-8 animate-in fade-in">
            {/* Top Stat Cards: Unit Balance, Purchases, Stays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Unit Balance Card */}
              <div className="p-6 bg-gradient-to-br from-blue-900/60 to-slate-900 border border-blue-500/40 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Units Balance
                  </span>
                  <Coins className="w-5 h-5 text-blue-400" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                    {customer.units_balance}{' '}
                    <span className="text-sm font-semibold text-blue-300">Units</span>
                  </div>
                  <span className="text-xs text-slate-300 mt-1 block">
                    Equivalent Value: <strong className="text-white">${customer.balance_usd?.toLocaleString() || '0'} USD</strong>
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-800/40">
                  <button
                    onClick={() => setBuyUnitsModalOpen(true)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Purchase More Units</span>
                  </button>
                </div>
              </div>

              {/* Client Profile Card */}
              <div className="p-6 bg-slate-800/90 border border-slate-700 rounded-3xl shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Client Details
                  </span>
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-white truncate">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-slate-300 truncate">{customer.role}</p>
                  <p className="text-xs text-blue-400 truncate">{customer.company}</p>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
                  Member ID: <span className="font-mono text-slate-300">{customer.id}</span>
                </div>
              </div>

              {/* Unit Purchases Metric */}
              <div className="p-6 bg-slate-800/90 border border-slate-700 rounded-3xl shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Unit Purchases
                  </span>
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                  {customer.purchases?.length || 0}
                  <span className="text-xs font-medium text-slate-400 ml-1.5">Packages</span>
                </div>
                <p className="text-xs text-slate-300">
                  Lifetime purchased lodging packages and corporate credits on file.
                </p>
              </div>

              {/* Reservations Metric */}
              <div className="p-6 bg-slate-800/90 border border-slate-700 rounded-3xl shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Booking Records
                  </span>
                  <Calendar className="w-5 h-5 text-slate-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                  {bookings.length}
                  <span className="text-xs font-medium text-slate-400 ml-1.5">Stays</span>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Reserve New Stay</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid: Booking Records + Internal Command Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Customer Booking Records & Internal Balance Settle */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                    <div>
                      <h3 className="font-heading font-black text-lg text-white">
                        Your Booking Records &amp; Settlement Actions
                      </h3>
                      <p className="text-xs text-slate-400">
                        Active reservations and internal unit checkout commands.
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-slate-900 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
                      {bookings.length} Records
                    </span>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <p className="text-xs">No active booking records found for this client account.</p>
                      <button
                        onClick={onOpenBooking}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                      >
                        Submit Reservation Request
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((b) => {
                        const isSettled = b.status === 'confirmed' || b.paymentProvider === 'unit_balance';
                        return (
                          <div
                            key={b.id}
                            className="p-5 bg-slate-900/80 border border-slate-700/80 rounded-2xl space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-lg border border-blue-800">
                                  {b.id}
                                </span>
                                <span className="font-bold text-sm text-white">
                                  {b.propertyId?.toUpperCase()}
                                </span>
                              </div>

                              <span
                                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  isSettled
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}
                              >
                                {isSettled ? 'Confirmed / Settled' : 'Awaiting Payment'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                              <div>
                                <span className="text-slate-500 block text-[11px]">Check-In</span>
                                <span className="font-semibold">{b.checkIn}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[11px]">Check-Out</span>
                                <span className="font-semibold">{b.checkOut}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-[11px]">Duration</span>
                                <span className="font-semibold">{b.totalNights} Nights</span>
                              </div>
                            </div>

                            {b.notes && (
                              <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg">
                                {b.notes}
                              </p>
                            )}

                            {/* INTERNAL COMMAND CHECKOUT TRIGGER
                                (Hidden from public booking form, accessible as an internal command here) */}
                            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                              <span className="text-[11px] text-slate-400 font-mono">
                                Standard Settle: 25 Units ($2,500)
                              </span>

                              {!isSettled ? (
                                <button
                                  type="button"
                                  disabled={executingCommand || customer.units_balance < 25}
                                  onClick={() => handleExecuteInternalBalanceCheckout(b.id, 25)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  {executingCommand ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Executing Command...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard className="w-3.5 h-3.5" />
                                      <span>Pay From Balance (25 Units)</span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span>Settled from Unit Balance ({b.paymentReference || 'Internal Ref'})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Unit Purchases History Card */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                    <h3 className="font-heading font-black text-lg text-white">
                      Unit Purchases &amp; Corporate Packages
                    </h3>
                    <button
                      onClick={() => setBuyUnitsModalOpen(true)}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Buy Units
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(customer.purchases || []).map((pch) => (
                      <div
                        key={pch.id}
                        className="p-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-white block">{pch.description}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(pch.purchased_at).toLocaleDateString()} via {pch.payment_method}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">+{pch.units_purchased} Units</span>
                          <span className="text-[11px] text-slate-400">${pch.amount_usd.toLocaleString()} USD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Internal Command Console & Ledger */}
              <div className="lg:col-span-5 space-y-6">
                {/* Internal Command Execution Terminal Card */}
                <div className="bg-black/90 border border-slate-700 rounded-3xl p-5 shadow-2xl font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-slate-300 font-bold">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Internal Command Terminal</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 h-52 overflow-y-auto text-[11px]">
                    {internalCommandLog.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.includes('SUCCESS')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('ERROR')
                            ? 'text-rose-400'
                            : log.includes('Executing')
                            ? 'text-blue-300'
                            : 'text-slate-400'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>

                  {/* Direct Command Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={executingCommand || customer.units_balance < 25}
                      onClick={() => handleExecuteInternalBalanceCheckout('Direct_Settlement', 25)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-750 text-white font-mono text-[11px] font-bold rounded-xl border border-slate-600 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      <span>RUN: checkout_balance.php --settle=25</span>
                    </button>
                    <span className="text-[10px] text-slate-500 block text-center mt-1">
                      Internal command settles booking with units from customer balance.
                    </span>
                  </div>
                </div>

                {/* Financial Ledger & Transactions */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                    <h3 className="font-heading font-bold text-base text-white">
                      Customer Ledger Transactions
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {customer.transactions?.length || 0} Entries
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto text-xs pr-1">
                    {(customer.transactions || []).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-xl flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-200 block truncate max-w-[200px]">
                            {tx.description}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(tx.date).toLocaleDateString()} • {tx.id}
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-bold block ${
                              tx.units > 0 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {tx.units > 0 ? `+${tx.units}` : `${tx.units}`} Units
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ${Math.abs(tx.amount_usd).toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fleet / Vehicle Rental Quick Link */}
                <div className="p-5 bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-800 border border-blue-500/30 rounded-3xl space-y-2.5">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Add American Fleet Rental
                  </span>
                  <h4 className="font-heading font-black text-white text-base">
                    Need a US Rental Car in Sacramento?
                  </h4>
                  <p className="text-xs text-slate-300">
                    Explore Ford Mustang, Tesla Model Y, Chevy Suburban, and Cadillac Escalade in our interactive 3D viewer.
                  </p>
                  <button
                    onClick={() => onNavigateTab('vehicles')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View 3D Vehicle Fleet</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase More Units Modal */}
        {buyUnitsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-left space-y-5 animate-in fade-in shadow-2xl">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  PHP Unit Allotment Engine
                </span>
                <h3 className="font-heading font-black text-xl text-white">
                  Purchase Lodging Units
                </h3>
                <p className="text-xs text-slate-300">
                  Select a corporate or individual package. 1 Unit = $100 accommodation credit.
                </p>
              </div>

              {/* Package Tiers */}
              <div className="space-y-2.5">
                {[
                  { units: 10, cost: 1000, label: '10 Units Starter Pack' },
                  { units: 25, cost: 2500, label: '25 Units Monthly Stay Pack' },
                  { units: 50, cost: 5000, label: '50 Units Corporate Pack (Q4)' },
                ].map((tier) => (
                  <button
                    key={tier.units}
                    type="button"
                    onClick={() => setSelectedUnitTier(tier.units)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedUnitTier === tier.units
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                        : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white text-xs block">{tier.label}</span>
                      <span className="text-[11px] text-slate-400">1 Unit = $100 Credit</span>
                    </div>
                    <span className="font-bold text-sm text-blue-400">${tier.cost.toLocaleString()}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBuyUnitsModalOpen(false)}
                  className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handlePurchaseUnits}
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>Confirm Purchase</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
