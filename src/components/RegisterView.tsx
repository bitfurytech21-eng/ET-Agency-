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
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface RegisterViewProps {
  onNavigateTab: (tab: string) => void;
  onRegisterSuccess?: (token: string, customer: { id: string; name: string; email: string }) => void;
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
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          company: company.trim(),
          role: role.trim(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.message || 'Registration failed. An account may already exist with this email.',
        );
      }

      localStorage.removeItem('etl_user_session');
      localStorage.setItem('etl_php_token', data.token);
      if (onRegisterSuccess) {
        onRegisterSuccess(data.token, data.customer);
      } else {
        onNavigateTab('dashboard');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#0f172a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-left">
      <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />

      <div className="relative z-10 max-w-xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 type-support text-slate-300">
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            className="type-nav flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#5eead4]" />
            <span>Back to Home</span>
          </button>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#5eead4]" />
            <span>Client Account Registration</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-9 shadow-xl border border-[#e2e8f0] space-y-6 text-[#0f172a]">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#14616d] text-white flex items-center justify-center mx-auto">
              <UserPlus className="w-5 h-5" />
            </div>
            <h1 className="type-h2 text-[#0f172a]">
              Create Your Account
            </h1>
            <p className="type-body text-[#475569] max-w-md mx-auto">
              Register to manage accommodation stays, executive car rentals, and payment records in your personal client workspace.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 type-support flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64748b] pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64748b] pointer-events-none" />
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(916) 555-0100"
                    className="form-input pl-10 tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64748b] pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Password (Min. 6 Characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64748b] pointer-events-none" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="form-input pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Company / Organization (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64748b] pointer-events-none" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company or agency"
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Role / Title (Optional)
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64748b] pointer-events-none" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Title or travel purpose"
                    className="form-input pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#edf6f8] border border-[#14616d]/20 rounded-xl flex items-center gap-3 type-support text-[#0f4952]">
              <ShieldCheck className="w-4 h-4 text-[#14616d] shrink-0" />
              <span>
                Your personal client portal and account profile are created immediately upon registration.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Open Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#e2e8f0] text-center space-y-3">
            <p className="type-support text-[#64748b]">Already have an Easy Travel Lodging account?</p>
            <button
              type="button"
              onClick={() => onNavigateTab('login')}
              className="btn btn-outline w-full"
            >
              <User className="w-4 h-4 text-[#14616d]" />
              <span>Sign In to Your Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
