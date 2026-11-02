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
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="type-h3 text-slate-900 flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-[#14616d]" /> Account Preferences &amp; Configuration
            </h3>
            <p className="type-body text-slate-600">
              Customize portal localization, arrival notification triggers, and commercial invoice formatting.
            </p>
          </div>

          {savedSuccess && (
            <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl type-support font-semibold flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preferences Saved</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          {/* 1. GENERAL & LOCALIZATION */}
          {activeSubTab === 'general' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h4 className="type-h4 text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#14616d]" /> Regional &amp; Date Preferences
                </h4>
                <p className="type-support text-slate-500">
                  Set standard operating timezones and formatting for check-in schedules and receipts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    Operating Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="form-select"
                  >
                    <option value="America/Los_Angeles (Pacific Time - PST)">America/Los Angeles (Pacific PST/PDT)</option>
                    <option value="America/Denver (Mountain Time - MST)">America/Denver (Mountain MST)</option>
                    <option value="America/Chicago (Central Time - CST)">America/Chicago (Central CST)</option>
                    <option value="America/New_York (Eastern Time - EST)">America/New York (Eastern EST)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    Currency Display
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-select"
                  >
                    <option value="USD ($)">USD ($) - United States Dollar</option>
                    <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="form-select tabular-nums"
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
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h4 className="type-h4 text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#14616d]" /> Operational Communication Channels
                </h4>
                <p className="type-support text-slate-500">
                  Select which automated status updates you wish to receive during ongoing stays.
                </p>
              </div>

              <div className="space-y-3.5">
                <label className="flex items-start gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailBookingConfirm}
                    onChange={(e) => setEmailBookingConfirm(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#14616d] rounded shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="type-label text-slate-900 block">
                      Booking Confirmation Documents
                    </span>
                    <span className="type-support text-slate-500 block font-normal">
                      Receive automated PDF confirmations and arrival passcodes via email.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailReceipts}
                    onChange={(e) => setEmailReceipts(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#14616d] rounded shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="type-label text-slate-900 block">
                      Fedwire Escrow &amp; Payment Receipts
                    </span>
                    <span className="type-support text-slate-500 block font-normal">
                      Immediate email dispatch of certified commercial wire payment settlements.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsArrivalAlerts}
                    onChange={(e) => setSmsArrivalAlerts(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#14616d] rounded shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="type-label text-slate-900 block">
                      SMS Keypad &amp; Access Reminders
                    </span>
                    <span className="type-support text-slate-500 block font-normal">
                      Receive mobile SMS check-in passcodes 2 hours prior to scheduled arrival time.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flightMonitoring}
                    onChange={(e) => setFlightMonitoring(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#14616d] rounded shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="type-label text-slate-900 block">
                      Flight Tracking Fleet Adjustments
                    </span>
                    <span className="type-support text-slate-500 block font-normal">
                      Allow vehicle dispatch operators to automatically adjust curbside staging according to FAA live radar.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 3. BILLING & INVOICING */}
          {activeSubTab === 'billing' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <h4 className="type-h4 text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#14616d]" /> Commercial Billing Entity
                </h4>
                <p className="type-support text-slate-500">
                  Information specified here will appear on official accounting receipts and PDF invoices.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">
                    Corporate Entity / Invoicing Name
                  </label>
                  <input
                    type="text"
                    value={invoiceHeader}
                    onChange={(e) => setInvoiceHeader(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Federal Tax Identification / EIN
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="form-input tabular-nums"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="btn btn-primary"
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
