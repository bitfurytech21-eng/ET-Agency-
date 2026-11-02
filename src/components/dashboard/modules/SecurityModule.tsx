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

      <div className="px-4 sm:px-8 pb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <h3 className="type-h3 text-slate-900">
              Security &amp; Password Management
            </h3>
            <p className="type-body text-slate-600">
              Manage your account password, two-factor verification, and active browser sessions.
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="btn btn-sm border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 w-fit"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Current Session</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border type-support flex items-start gap-2.5 ${
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-[#14616d]" />
                  <h4 className="type-h4 text-slate-900">Account Password</h4>
                </div>
                <p className="type-support text-slate-600">
                  Encrypted with bcrypt hashing.{' '}
                  {passwordUpdatedAt
                    ? `Last updated ${passwordUpdatedAt.split('T')[0]}.`
                    : 'Protected since registration.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubView('change-password')}
                className="btn btn-outline btn-sm w-fit"
              >
                Update Password
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#8c6a4a]" />
                  <h4 className="type-h4 text-slate-900">Two-Factor Verification</h4>
                </div>
                <p className="type-support text-slate-600">
                  Current status:{' '}
                  <strong className={twoFactorEnabled ? 'text-emerald-700 font-semibold' : 'text-slate-900 font-semibold'}>
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubView('two-factor')}
                className="btn btn-outline btn-sm w-fit"
              >
                Configure 2FA
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-5 shadow-xs tabular-nums">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <Laptop className="w-4 h-4 text-[#14616d]" />
                  <h4 className="type-h4 text-slate-900">Active Sessions ({activeSessions.length})</h4>
                </div>
                <p className="type-support text-slate-600">
                  Review authorized devices signed into your personal dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubView('active-sessions')}
                className="btn btn-outline btn-sm w-fit"
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
            className="max-w-lg p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs"
          >
            <h4 className="type-h4 text-slate-900">
              Update Account Password
            </h4>

            <div>
              <label className="form-label">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                New Password (Minimum 6 characters) *
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save New Password</span>
            </button>
          </form>
        )}

        {/* Two-Factor */}
        {subView === 'two-factor' && (
          <div className="max-w-xl p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#14616d]" />
              <h4 className="type-h4 text-slate-900">
                Two-Factor Account Protection
              </h4>
            </div>
            <p className="type-body text-slate-600">
              Enable secondary verification alerts on your account to protect reservation changes and payment settlements.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="type-label text-slate-900 block">
                  Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <span className="type-support text-slate-500 block">
                  {twoFactorEnabled
                    ? 'Enhanced verification is active on your account.'
                    : 'Click to activate two-factor verification on your profile.'}
                </span>
              </div>
              <button
                type="button"
                disabled={submitting}
                onClick={handleToggle2FA}
                className={`btn btn-sm ${
                  twoFactorEnabled
                    ? 'border border-rose-200 text-rose-700 hover:bg-rose-50 bg-white'
                    : 'btn-primary'
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
                  className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 type-support tabular-nums shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{sess.device}</span>
                      {sess.isCurrent && (
                        <>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <span className="text-[#14616d] font-semibold">Current Session</span>
                        </>
                      )}
                    </div>
                    <div className="text-slate-500">
                      Network: {sess.ip} · Signed in {sess.createdAt.replace('T', ' ').slice(0, 16)}
                    </div>
                  </div>
                  <div className="text-slate-500 sm:text-right">
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
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white px-5 type-support tabular-nums shadow-xs">
              {loginHistory.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{item.device}</span>
                    <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                    <span className="text-slate-600">{item.ip}</span>
                  </div>
                  <div className="text-slate-500">
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
