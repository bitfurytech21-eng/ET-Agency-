import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Home,
  UserPlus,
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface SignInViewProps {
  onNavigateTab: (tab: string) => void;
  onLoginSuccess?: (token: string, customer: { id: string; name: string; email: string }) => void;
  authNotice?: string | null;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onNavigateTab,
  onLoginSuccess,
  authNotice,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.message || 'Authentication failed. Please check your email and password.',
        );
      }

      localStorage.removeItem('etl_user_session');
      localStorage.setItem('etl_php_token', data.token);
      if (onLoginSuccess) {
        onLoginSuccess(data.token, data.customer);
      } else {
        onNavigateTab('dashboard');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f7f3ed] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-left">
      <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />

      <div className="relative z-10 max-w-md w-full mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 text-[#efe7dc]">
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-1.5 type-btn hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#00b7a8]" />
            <span>Back to Home</span>
          </button>
          <span className="flex items-center gap-1.5 text-[#e5dbcc] type-support font-medium">
            <ShieldCheck className="w-4 h-4 text-[#00b7a8]" />
            Personal Dashboard Access
          </span>
        </div>

        <div className="bg-white/98 backdrop-blur-md rounded-2xl p-6 sm:p-9 shadow-xl border border-[#e6dfd5] space-y-6 text-[#282828]">
          <div className="text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#00897d] text-white flex items-center justify-center mx-auto shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <h1 className="type-h2 text-[#282828]">
              Sign In to Your Dashboard
            </h1>
            <p className="type-body text-[#6e5d50]">
              Access your personal residence reservations, car rentals, invoices, and account settings.
            </p>
          </div>

          {authNotice && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 type-support flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{authNotice}</div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 type-support flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block type-label text-[#282828] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#857568] pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 h-11 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-sm sm:text-base text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block type-label text-[#282828] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#857568] pointer-events-none" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 h-11 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-sm sm:text-base text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white type-btn rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#ede6dc] text-center space-y-3">
            <p className="type-support text-[#5c5046]">
              New to Easy Travel Lodging? Register to create your personal dashboard.
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('register')}
              className="w-full py-3 px-4 bg-[#faf8f5] hover:bg-[#f2ece3] border border-[#dfd7cc] hover:border-[#00b7a8] rounded-xl type-btn text-[#282828] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-[#00897d]" />
              <span>Create Personal Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
