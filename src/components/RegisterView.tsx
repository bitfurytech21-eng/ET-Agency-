import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  UserPlus,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface RegisterViewProps {
  onNavigateTab: (tab: string) => void;
  onRegisterSuccess?: (token: string, customer: any) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onNavigateTab,
  onRegisterSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/php/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          company: company || 'Independent Professional',
          role: role || 'Visiting Professional',
          phone: phone || '(916) 426-3655',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. An account may already exist with this email.');
      }

      localStorage.setItem('etl_php_token', data.token);
      if (onRegisterSuccess) {
        onRegisterSuccess(data.token, data.customer);
      }
      onNavigateTab('dashboard');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#f7f3ed] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-left">
      <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />

      <div className="relative z-10 max-w-xl w-full mx-auto space-y-6">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between text-xs text-[#efe7dc]">
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#00b7a8]" />
            <span>Back to Home</span>
          </button>
          <span className="flex items-center gap-1.5 text-[#e5dbcc] text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00b7a8]" />
            Direct Guest &amp; Corporate Portal
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white/98 backdrop-blur-md rounded-2xl p-6 sm:p-9 shadow-xl border border-[#e6dfd5] space-y-6 text-[#282828]">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#00897d] text-white flex items-center justify-center mx-auto shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#282828]">
              Create Your Account
            </h1>
            <p className="text-xs text-[#6e5d50] max-w-md mx-auto">
              Open your guest or corporate client account for instant residence booking and payment tracking.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jennifer Hayes"
                    className="w-full pl-9 pr-3 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(916) 555-0192"
                    className="w-full pl-9 pr-3 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jennifer@organization.com"
                    className="w-full pl-9 pr-3 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Password (Min. 6 chars) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Company / Organization</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="UC Davis Health / State of CA"
                    className="w-full pl-9 pr-3 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Professional Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Visiting Surgeon / Relocating"
                    className="w-full pl-9 pr-3 h-10 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-xs text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Instant Activation Callout */}
            <div className="p-3 bg-[#e8f8f6] border border-[#b9ebe6] rounded-xl flex items-center gap-3 text-xs text-[#006e65]">
              <ShieldCheck className="w-5 h-5 text-[#00b7a8] shrink-0" />
              <span>
                <strong>Instant Activation:</strong> Manage furnished residences, vehicle fleet rentals, and USD top-up billing.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="pt-4 border-t border-[#ede6dc] text-center space-y-3">
            <p className="text-xs text-[#5c5046]">
              Already have an Easy Travel account?
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('login')}
              className="w-full py-2.5 px-4 bg-[#faf8f5] hover:bg-[#f2ece3] border border-[#dfd7cc] hover:border-[#00b7a8] rounded-xl text-xs font-bold text-[#282828] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-[#00b7a8]" />
              <span>Sign In to Your Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
