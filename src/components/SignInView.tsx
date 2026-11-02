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
    <div className="min-h-[85vh] bg-[#0f172a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-left">
      <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />

      <div className="relative z-10 max-w-md w-full mx-auto space-y-6">
        <div className="flex items-center justify-between type-support text-slate-300">
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            className="type-nav flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#5eead4]" />
            <span>Back to Home</span>
          </button>
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#5eead4]" />
            <span>Guest &amp; Corporate Access</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-9 shadow-xl border border-[#e2e8f0] space-y-6 text-[#0f172a]">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#14616d] text-white flex items-center justify-center mx-auto">
              <User className="w-5 h-5" />
            </div>
            <h1 className="type-h2 text-[#0f172a]">
              Sign In to Client Portal
            </h1>
            <p className="type-body text-[#475569] max-w-sm mx-auto">
              Access your residence reservations, executive car rentals, and account ledger.
            </p>
          </div>

          {authNotice && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 type-support flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{authNotice}</div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 type-support flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64748b] pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="form-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#64748b] pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#e2e8f0] text-center space-y-3">
            <p className="type-support text-[#64748b]">
              Don&apos;t have an Easy Travel Lodging account yet?
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('register')}
              className="btn btn-outline w-full"
            >
              <UserPlus className="w-4 h-4 text-[#14616d]" />
              <span>Create an Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
