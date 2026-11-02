import React, { useState } from 'react';
import {
  ActiveSessionItem,
  LoginHistoryItem,
  SecuritySubView,
} from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { EmptyState } from '../components/EmptyState';
import {
  Shield,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  LogOut,
} from 'lucide-react';

interface SecurityModuleProps {
  twoFactorEnabled: boolean;
  passwordUpdatedAt?: string;
  activeSessions?: ActiveSessionItem[];
  loginHistory?: LoginHistoryItem[];
  onChangePassword?: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; message: string }>;
  onToggleTwoFactor: ((enabled: boolean) => Promise<{ ok: boolean; message: string }>) | ((enabled: boolean) => void);
  onSignOut?: () => void;
}

export const SecurityModule: React.FC<SecurityModuleProps> = ({
  twoFactorEnabled,
  passwordUpdatedAt,
  activeSessions = [],
  loginHistory = [],
  onChangePassword,
  onToggleTwoFactor,
  onSignOut = () => {},
}) => {
  const [subView, setSubView] = useState<SecuritySubView>('index');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Security Overview' },
    { id: 'change-password', label: 'Change Password' },
    { id: 'two-factor', label: 'Two-Factor Verification' },
    { id: 'active-sessions', label: 'Active Sessions', badge: activeSessions.length },
    { id: 'login-history', label: 'Sign-In History', badge: loginHistory.length },
  ];

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (newPass !== confirmPass) {
      setFeedback({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    if (newPass.length < 6) {
      setFeedback({
        type: 'error',
        message: 'New password must be at least 6 characters long.',
      });
      return;
    }

    setSubmitting(true);
    let res = { ok: true, message: 'Password updated successfully.' };
    if (onChangePassword) {
      res = await onChangePassword(currentPass, newPass);
    }
    setSubmitting(false);

    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
    if (res.ok) {
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  const handleToggle2FA = async () => {
    setSubmitting(true);
    setFeedback(null);
    let res = {
      ok: true,
      message: !twoFactorEnabled
        ? 'Two-Factor Authentication activated for this account.'
        : 'Two-Factor Authentication deactivated.',
    };
    if (onToggleTwoFactor) {
      const result = await onToggleTwoFactor(!twoFactorEnabled);
      if (result && typeof result === 'object' && 'ok' in result) {
        res = result as { ok: boolean; message: string };
      }
    }
    setSubmitting(false);
    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => {
          setFeedback(null);
          setSubView(id as SecuritySubView);
        }}
      />

      <div className="px-4 sm:px-8 pb-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828]">
              Security &amp; Password Management
            </h3>
            <p className="text-xs text-[#6e5d50]">
              Manage your account password, two-factor verification, and active browser sessions
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-xs font-bold text-rose-700 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 w-fit"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Current Session</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* Security Overview */}
        {subView === 'index' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#282828]">
                  <Key className="w-4 h-4 text-[#00897d]" />
                  <span>Account Password</span>
                </div>
                <p className="text-[#5c5046]">
                  Encrypted with bcrypt hashing.{' '}
                  {passwordUpdatedAt
                    ? `Last updated ${passwordUpdatedAt.split('T')[0]}.`
                    : 'Protected since registration.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubView('change-password')}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#d8cfc3] hover:border-[#00b7a8] font-bold text-[#282828] cursor-pointer w-fit whitespace-nowrap"
              >
                Update Password
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#282828]">
                  <Smartphone className="w-4 h-4 text-[#82634f]" />
                  <span>Two-Factor Verification</span>
                </div>
                <p className="text-[#5c5046]">
                  Current status:{' '}
                  <strong className={twoFactorEnabled ? 'text-emerald-700' : 'text-[#282828]'}>
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubView('two-factor')}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#d8cfc3] hover:border-[#00b7a8] font-bold text-[#282828] cursor-pointer w-fit whitespace-nowrap"
              >
                Configure 2FA
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col justify-between space-y-4 tabular-nums">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#282828]">
                  <Laptop className="w-4 h-4 text-[#00897d]" />
                  <span>Active Sessions ({activeSessions.length})</span>
                </div>
                <p className="text-[#5c5046]">
                  Review authorized devices signed into your personal dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubView('active-sessions')}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#d8cfc3] hover:border-[#00b7a8] font-bold text-[#282828] cursor-pointer w-fit whitespace-nowrap"
              >
                Inspect Sessions
              </button>
            </div>
          </div>
        )}

        {/* Change Password */}
        {subView === 'change-password' && (
          <form
            onSubmit={handlePasswordSubmit}
            className="max-w-lg p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4"
          >
            <h4 className="font-heading font-bold text-base text-[#282828]">
              Update Account Password
            </h4>

            <div>
              <label className="block text-xs font-bold text-[#282828] mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#282828] mb-1">
                New Password (Minimum 6 characters) *
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#282828] mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save New Password</span>
            </button>
          </form>
        )}

        {/* Two-Factor */}
        {subView === 'two-factor' && (
          <div className="max-w-xl p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00897d]" />
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Two-Factor Account Protection
              </h4>
            </div>
            <p className="text-xs text-[#5c5046] leading-relaxed">
              Enable secondary verification alerts on your account to protect reservation changes and payment settlements.
            </p>
            <div className="p-4 bg-white rounded-xl border border-[#efe9e0] flex items-center justify-between gap-4">
              <div className="text-xs">
                <span className="font-bold text-[#282828] block">
                  Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <span className="text-[#6e5d50]">
                  {twoFactorEnabled
                    ? 'Enhanced verification is active on your account.'
                    : 'Click to activate two-factor verification on your profile.'}
                </span>
              </div>
              <button
                type="button"
                disabled={submitting}
                onClick={handleToggle2FA}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                  twoFactorEnabled
                    ? 'border border-rose-200 text-rose-700 hover:bg-rose-50 bg-white'
                    : 'bg-[#00b7a8] hover:bg-[#009e91] text-white'
                }`}
              >
                {submitting
                  ? 'Updating...'
                  : twoFactorEnabled
                  ? 'Disable 2FA'
                  : 'Enable 2FA'}
              </button>
            </div>
          </div>
        )}

        {/* Active Sessions */}
        {subView === 'active-sessions' &&
          (activeSessions.length === 0 ? (
            <EmptyState
              icon={Laptop}
              title="No active sessions found"
              description="Active browser sessions linked to your user ID will be listed here."
            />
          ) : (
            <div className="space-y-3">
              {activeSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs tabular-nums"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#282828]">{sess.device}</span>
                      {sess.isCurrent && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#00897d] font-bold">Current Session</span>
                        </>
                      )}
                    </div>
                    <div className="text-[#5c5046]">
                      Network: {sess.ip} · Signed in {sess.createdAt.replace('T', ' ').slice(0, 16)}
                    </div>
                  </div>
                  <div className="text-[#857568] sm:text-right">
                    Expires {sess.expiresAt.split('T')[0]}
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Login History */}
        {subView === 'login-history' &&
          (loginHistory.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No sign-in history recorded"
              description="Recent authentication timestamps for your account will appear here."
            />
          ) : (
            <div className="divide-y divide-[#e6dfd5] border border-[#e6dfd5] rounded-2xl bg-[#faf8f5] px-5 text-xs tabular-nums">
              {loginHistory.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-[#282828]">{item.device}</span>
                    <span className="mx-2 text-[#857568]" aria-hidden="true">·</span>
                    <span className="text-[#5c5046]">{item.ip}</span>
                  </div>
                  <div className="text-[#6e5d50]">
                    {item.timestamp.replace('T', ' ').slice(0, 19)} UTC
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
