import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface SignInViewProps {
  onNavigateTab: (tab: string) => void;
  onLoginSuccess?: (token: string, customer: any) => void;
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
      const res = await fetch('/api/php/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please check your email and password.');
      }

      localStorage.setItem('etl_php_token', data.token);
      if (onLoginSuccess) {
        onLoginSuccess(data.token, data.customer);
      }
      onNavigateTab('dashboard');
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
        {/* Top Logo & Back to Home */}
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
            Guest &amp; Corporate Access
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white/98 backdrop-blur-md rounded-2xl p-6 sm:p-9 shadow-xl border border-[#e6dfd5] space-y-6 text-[#282828]">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#00897d] text-white flex items-center justify-center mx-auto shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#282828]">
              Sign In to Dashboard
            </h1>
            <p className="text-xs text-[#6e5d50] max-w-xs mx-auto">
              Access your nationwide residence bookings, 3D fleet rentals, and USD account ledger.
            </p>
          </div>

          {authNotice && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{authNotice}</div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#282828] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#857568] pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@easytravellodging.com"
                  className="w-full pl-10 pr-4 h-11 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-sm text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5">
                <label className="block text-xs font-bold text-[#282828]">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#857568] pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 h-11 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-sm text-[#282828] placeholder:text-[#9a8d80] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="pt-4 border-t border-[#ede6dc] text-center space-y-3">
            <p className="text-xs text-[#5c5046]">
              Don&apos;t have an Easy Travel account yet?
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('register')}
              className="w-full py-2.5 px-4 bg-[#faf8f5] hover:bg-[#f2ece3] border border-[#dfd7cc] hover:border-[#00b7a8] rounded-xl text-xs font-bold text-[#282828] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00b7a8]" />
              <span>Create an Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
