import React, { useState } from 'react';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import {
  Settings,
  Bell,
  CreditCard,
  Globe,
  CheckCircle2,
  Save,
  Building,
  Mail,
  Shield,
  FileText,
} from 'lucide-react';

interface SettingsModuleProps {}

export const SettingsModule: React.FC<SettingsModuleProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'notifications' | 'billing'>('general');

  // Stored state
  const [timezone, setTimezone] = useState('America/Los_Angeles (Pacific Time - PST)');
  const [currency, setCurrency] = useState('USD ($)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [invoiceHeader, setInvoiceHeader] = useState('OmniGlobal Enterprise Partners LLC');
  const [taxId, setTaxId] = useState('XX-XXXXXXX');
  
  // Notification checkboxes
  const [emailBookingConfirm, setEmailBookingConfirm] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [smsArrivalAlerts, setSmsArrivalAlerts] = useState(true);
  const [flightMonitoring, setFlightMonitoring] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const subTabOptions: SubTabOption[] = [
    { id: 'general', label: 'General & Localization' },
    { id: 'notifications', label: 'Communication Preferences' },
    { id: 'billing', label: 'Invoicing & Tax Details' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={activeSubTab}
        options={subTabOptions}
        onSelectSubTab={(id) => setActiveSubTab(id as 'general' | 'notifications' | 'billing')}
      />

      <div className="px-4 sm:px-8 pb-8 space-y-6">
        <div className="border-b border-[#e6dfd5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828] flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#00b7a8]" /> Account Preferences &amp; Configuration
            </h3>
            <p className="text-xs text-[#5c5046] mt-0.5">
              Customize portal localization, arrival notification triggers, and commercial invoice formatting.
            </p>
          </div>

          {savedSuccess && (
            <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preferences Saved</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          {/* 1. GENERAL & LOCALIZATION */}
          {activeSubTab === 'general' && (
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
              <div className="border-b border-[#efe9e0] pb-3">
                <h4 className="font-heading font-bold text-sm text-[#282828] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00b7a8]" /> Regional &amp; Date Preferences
                </h4>
                <p className="text-xs text-[#5c5046] mt-0.5">
                  Set standard operating timezones and formatting for check-in schedules and receipts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1.5">
                    Operating Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  >
                    <option value="America/Los_Angeles (Pacific Time - PST)">America/Los Angeles (Pacific PST/PDT)</option>
                    <option value="America/Denver (Mountain Time - MST)">America/Denver (Mountain MST)</option>
                    <option value="America/Chicago (Central Time - CST)">America/Chicago (Central CST)</option>
                    <option value="America/New_York (Eastern Time - EST)">America/New York (Eastern EST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1.5">
                    Currency Display
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  >
                    <option value="USD ($)">USD ($) - United States Dollar</option>
                    <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1.5">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. NOTIFICATIONS */}
          {activeSubTab === 'notifications' && (
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
              <div className="border-b border-[#efe9e0] pb-3">
                <h4 className="font-heading font-bold text-sm text-[#282828] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#00b7a8]" /> Operational Communication Channels
                </h4>
                <p className="text-xs text-[#5c5046] mt-0.5">
                  Select which automated status updates you wish to receive during ongoing stays.
                </p>
              </div>

              <div className="space-y-3.5">
                <label className="flex items-start gap-3 p-3 bg-[#faf8f5] border border-[#efe9e0] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailBookingConfirm}
                    onChange={(e) => setEmailBookingConfirm(e.target.checked)}
                    className="mt-0.5 accent-[#00b7a8] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#282828] block">
                      Booking Confirmation Documents
                    </span>
                    <span className="text-[11px] text-[#5c5046]">
                      Receive automated PDF confirmations and arrival passcodes via email.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-[#faf8f5] border border-[#efe9e0] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailReceipts}
                    onChange={(e) => setEmailReceipts(e.target.checked)}
                    className="mt-0.5 accent-[#00b7a8] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#282828] block">
                      Fedwire Escrow &amp; Payment Receipts
                    </span>
                    <span className="text-[11px] text-[#5c5046]">
                      Immediate email dispatch of certified commercial wire payment settlements.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-[#faf8f5] border border-[#efe9e0] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsArrivalAlerts}
                    onChange={(e) => setSmsArrivalAlerts(e.target.checked)}
                    className="mt-0.5 accent-[#00b7a8] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#282828] block">
                      SMS Keypad &amp; Access Reminders
                    </span>
                    <span className="text-[11px] text-[#5c5046]">
                      Receive mobile SMS check-in passcodes 2 hours prior to scheduled arrival time.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-[#faf8f5] border border-[#efe9e0] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flightMonitoring}
                    onChange={(e) => setFlightMonitoring(e.target.checked)}
                    className="mt-0.5 accent-[#00b7a8] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#282828] block">
                      Flight Tracking Fleet Adjustments
                    </span>
                    <span className="text-[11px] text-[#5c5046]">
                      Allow vehicle dispatch operators to automatically adjust curbside staging according to FAA live radar.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 3. BILLING & INVOICING */}
          {activeSubTab === 'billing' && (
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
              <div className="border-b border-[#efe9e0] pb-3">
                <h4 className="font-heading font-bold text-sm text-[#282828] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00b7a8]" /> Commercial Billing Entity
                </h4>
                <p className="text-xs text-[#5c5046] mt-0.5">
                  Information specified here will appear on official accounting receipts and PDF invoices.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1.5">
                    Corporate Entity / Invoicing Name
                  </label>
                  <input
                    type="text"
                    value={invoiceHeader}
                    onChange={(e) => setInvoiceHeader(e.target.value)}
                    className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1.5">
                    Federal Tax Identification / EIN
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
