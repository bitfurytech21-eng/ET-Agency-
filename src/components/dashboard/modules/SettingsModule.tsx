import React, { useState } from 'react';
import { SettingsSubView } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { Settings, Bell, Shield, Globe, CheckCircle2 } from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const [subView, setSubView] = useState<SettingsSubView>('index');

  // Notification toggles
  const [emailBooking, setEmailBooking] = useState(true);
  const [smsKeyCodes, setSmsKeyCodes] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [marketingNews, setMarketingNews] = useState(false);

  // Privacy toggles
  const [shareFleetInsurance, setShareFleetInsurance] = useState(true);
  const [cookieAnalytics, setCookieAnalytics] = useState(false);

  // Currency & Locale
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/Los_Angeles (Pacific Time)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Settings Hub', fileName: 'index.php' },
    { id: 'account-settings', label: 'Account Settings', fileName: 'account-settings.php' },
    { id: 'notification-settings', label: 'Notifications', fileName: 'notification-settings.php' },
    { id: 'privacy-settings', label: 'Privacy & Data', fileName: 'privacy-settings.php' },
    { id: 'language-currency', label: 'Currency & Locale', fileName: 'language-currency.php' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/Settings/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as SettingsSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6 max-w-3xl">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preferences updated successfully.</span>
          </div>
        )}

        <div className="border-b border-[#e6dfd5] pb-4">
          <h3 className="font-heading font-bold text-lg text-[#282828]">
            Client Portal Settings (Settings/)
          </h3>
          <p className="text-xs text-[#5c5046]">
            Configure automated SMS alerts, invoice delivery, and reporting preferences.
          </p>
        </div>

        {/* 1. Notifications Settings */}
        {(subView === 'index' || subView === 'notification-settings') && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h4 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#00b7a8]" />
              <span>Communication &amp; Alert Preferences (notification-settings.php)</span>
            </h4>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#efe9e0] cursor-pointer">
                <div>
                  <span className="font-bold text-[#282828] block">Reservation Confirmations &amp; Updates</span>
                  <span className="text-[#857568]">Instant email alerts for booking approvals and date modifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailBooking}
                  onChange={(e) => setEmailBooking(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#00b7a8]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#efe9e0] cursor-pointer">
                <div>
                  <span className="font-bold text-[#282828] block">SMS Smart-Lock Door PINs &amp; Vehicle Drop-off</span>
                  <span className="text-[#857568]">Receive your keyless door PIN and airport delivery spot via SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsKeyCodes}
                  onChange={(e) => setSmsKeyCodes(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#00b7a8]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#efe9e0] cursor-pointer">
                <div>
                  <span className="font-bold text-[#282828] block">Wire Clearance &amp; Invoice Statements</span>
                  <span className="text-[#857568]">Automated CPA-compliant receipts dispatched when payments clear</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailReceipts}
                  onChange={(e) => setEmailReceipts(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#00b7a8]"
                />
              </label>
            </div>
          </div>
        )}

        {/* 2. Privacy & Data */}
        {(subView === 'index' || subView === 'privacy-settings') && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h4 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#82634f]" />
              <span>Privacy &amp; Data Safeguards (privacy-settings.php)</span>
            </h4>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#efe9e0] cursor-pointer">
                <div>
                  <span className="font-bold text-[#282828] block">Commercial Fleet Insurance Verification Sync</span>
                  <span className="text-[#857568]">Enable rapid verification between driver license and carrier</span>
                </div>
                <input
                  type="checkbox"
                  checked={shareFleetInsurance}
                  onChange={(e) => setShareFleetInsurance(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#00b7a8]"
                />
              </label>
            </div>
          </div>
        )}

        {/* 3. Currency & Locale */}
        {(subView === 'index' || subView === 'language-currency') && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h4 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00b7a8]" />
              <span>Currency &amp; Timezone (language-currency.php)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Standard Billing Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                >
                  <option value="USD">USD ($) — California’s homes Dollar</option>
                  <option value="CAD">CAD ($) — Canadian Dollar (Estimated)</option>
                  <option value="EUR">EUR (€) — Euro (Estimated)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Account Display Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                >
                  <option value="America/Los_Angeles (Pacific Time)">Pacific Time (PT) — HQ Corridor</option>
                  <option value="America/Denver (Mountain Time)">Mountain Time (MT)</option>
                  <option value="America/Chicago (Central Time)">Central Time (CT)</option>
                  <option value="America/New_York (Eastern Time)">Eastern Time (ET)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl shadow-2xs cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
