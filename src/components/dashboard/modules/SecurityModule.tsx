import React, { useState } from 'react';
import { SecuritySubView } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { Shield, Key, Smartphone, Laptop, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface SecurityModuleProps {
  twoFactorEnabled: boolean;
  onToggleTwoFactor: (enabled: boolean) => void;
}

export const SecurityModule: React.FC<SecurityModuleProps> = ({
  twoFactorEnabled,
  onToggleTwoFactor,
}) => {
  const [subView, setSubView] = useState<SecuritySubView>('index');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Security Hub', fileName: 'index.php' },
    { id: 'change-password', label: 'Change Password', fileName: 'change-password.php' },
    { id: 'two-factor', label: 'Two-Factor (2FA)', fileName: 'two-factor.php' },
    { id: 'active-sessions', label: 'Active Sessions', fileName: 'active-sessions.php' },
    { id: 'login-history', label: 'Login History', fileName: 'login-history.php' },
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }
    if (newPass.length < 8) {
      setPassError('Password must be at least 8 characters long.');
      return;
    }
    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/Security/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as SecuritySubView)}
      />

      <div className="px-4 sm:px-8 space-y-6">
        {/* 1. Security Hub (index.php) */}
        {subView === 'index' && (
          <div className="space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Security &amp; Account Protection (Security/)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Manage credentials, two-factor authentication, active devices, and sign-in audit logs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#282828] flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#00b7a8]" /> Password Protection
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">Strong</span>
                </div>
                <p className="text-[#5c5046]">
                  Last updated 42 days ago. Recommended rotation every 90 days for corporate compliance.
                </p>
                <button
                  type="button"
                  onClick={() => setSubView('change-password')}
                  className="px-3 py-1.5 rounded-lg border border-[#d8cfc3] hover:bg-[#faf8f5] font-semibold text-[#282828] cursor-pointer"
                >
                  Change Password
                </button>
              </div>

              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#282828] flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#82634f]" /> Two-Factor Authentication
                  </span>
                  <span className={`text-[11px] font-bold ${twoFactorEnabled ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {twoFactorEnabled ? 'Enabled ✓' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[#5c5046]">
                  Requires SMS code or authenticator app token on every sign-in.
                </p>
                <button
                  type="button"
                  onClick={() => setSubView('two-factor')}
                  className="px-3 py-1.5 rounded-lg border border-[#d8cfc3] hover:bg-[#faf8f5] font-semibold text-[#282828] cursor-pointer"
                >
                  Configure 2FA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Change Password (change-password.php) */}
        {subView === 'change-password' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl mx-auto shadow-xs">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Change Password (change-password.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Choose a strong password with at least 8 characters.
              </p>
            </div>

            {passSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password changed successfully.</span>
              </div>
            )}

            {passError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl shadow-2xs cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. Two-Factor Authentication (two-factor.php) */}
        {subView === 'two-factor' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl mx-auto shadow-xs">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Two-Factor Authentication (two-factor.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Prevent unauthorized access to your corporate Lodging Units and reservation codes.
              </p>
            </div>

            <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#282828] text-sm block">Require 2FA on Sign-In</span>
                <span className="text-xs text-[#5c5046]">Sends a one-time verification code via SMS or app</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleTwoFactor(!twoFactorEnabled)}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  twoFactorEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        )}

        {/* 4. Active Sessions (active-sessions.php) & 5. Login History (login-history.php) */}
        {(subView === 'active-sessions' || subView === 'login-history') && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                {subView === 'active-sessions' ? 'Active Signed-In Devices' : 'Sign-In Audit Log'}
              </h3>
              <p className="text-xs text-[#5c5046]">
                Secure session auditing matching commercial security guidelines.
              </p>
            </div>

            <div className="divide-y divide-[#efe9e0] text-xs">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-[#00b7a8]" />
                  <div>
                    <span className="font-bold text-[#282828] block">MacBook Pro (Chrome) — Current Session</span>
                    <span className="text-[#857568]">California’s homes · IP 73.189.44.11</span>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold">Active Now</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#82634f]" />
                  <div>
                    <span className="font-bold text-[#282828] block">iPhone 15 Pro (Safari Mobile)</span>
                    <span className="text-[#857568]">California’s homes · IP 172.56.21.90</span>
                  </div>
                </div>
                <span className="text-[#857568]">Signed in 2 days ago</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
