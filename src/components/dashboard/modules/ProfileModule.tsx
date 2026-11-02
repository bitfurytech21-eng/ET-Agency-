import React, { useEffect, useState } from 'react';
import {
  ProfileSubView,
  UserAddress,
  UserPreferences,
  UserSession,
} from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import {
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Loader2,
  MapPin,
} from 'lucide-react';

interface ProfileModuleProps {
  user: UserSession;
  onSaveProfile?: (updates: {
    name?: string;
    company?: string;
    role?: string;
    phone?: string;
    address?: Partial<UserAddress>;
    preferences?: Partial<UserPreferences>;
  }) => Promise<{ ok: boolean; message: string }>;
  onUpdateUser?: (updates: Partial<UserSession>) => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({ user, onSaveProfile, onUpdateUser }) => {
  const [subView, setSubView] = useState<ProfileSubView>('index');

  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.company);
  const [role, setRole] = useState(user.role);
  const [phone, setPhone] = useState(user.phone);

  const [street, setStreet] = useState(user.address?.street || '');
  const [city, setCity] = useState(user.address?.city || '');
  const [stateCode, setStateCode] = useState(user.address?.state || '');
  const [zip, setZip] = useState(user.address?.zip || '');
  const [country, setCountry] = useState(user.address?.country || 'United States');

  const [thermostat, setThermostat] = useState(user.preferences?.thermostat || '70°F (Optimal Comfort)');
  const [pillows, setPillows] = useState(user.preferences?.pillows || 'Firm Feather & Memory Foam');
  const [quietHours, setQuietHours] = useState(user.preferences?.quietHours || '10:00 PM – 8:00 AM');
  const [emailNotifications, setEmailNotifications] = useState(user.preferences?.emailNotifications ?? true);
  const [smsNotifications, setSmsNotifications] = useState(user.preferences?.smsNotifications ?? true);
  const [preferredCurrency, setPreferredCurrency] = useState(user.preferences?.preferredCurrency || 'USD');
  const [timezone, setTimezone] = useState(user.preferences?.timezone || 'America/Los_Angeles (Pacific Time)');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  useEffect(() => {
    setName(user.name);
    setCompany(user.company);
    setRole(user.role);
    setPhone(user.phone);
    setStreet(user.address?.street || '');
    setCity(user.address?.city || '');
    setStateCode(user.address?.state || '');
    setZip(user.address?.zip || '');
    setCountry(user.address?.country || 'United States');
    setThermostat(user.preferences?.thermostat || '70°F (Optimal Comfort)');
    setPillows(user.preferences?.pillows || 'Firm Feather & Memory Foam');
    setQuietHours(user.preferences?.quietHours || '10:00 PM – 8:00 AM');
    setEmailNotifications(user.preferences?.emailNotifications ?? true);
    setSmsNotifications(user.preferences?.smsNotifications ?? true);
    setPreferredCurrency(user.preferences?.preferredCurrency || 'USD');
    setTimezone(user.preferences?.timezone || 'America/Los_Angeles (Pacific Time)');
  }, [user]);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Profile Overview' },
    { id: 'personal-information', label: 'Edit Personal & Billing Info' },
    { id: 'preferences', label: 'Stay & Account Settings' },
  ];

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Full name cannot be empty.' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    let res = { ok: true, message: 'Profile details saved.' };
    if (onSaveProfile) {
      res = await onSaveProfile({
        name: name.trim(),
        company: company.trim(),
        role: role.trim(),
        phone: phone.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          state: stateCode.trim(),
          zip: zip.trim(),
          country: country.trim() || 'United States',
        },
      });
    } else if (onUpdateUser) {
      onUpdateUser({
        name: name.trim(),
        company: company.trim(),
        role: role.trim(),
        phone: phone.trim(),
      });
    }
    setSaving(false);
    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    let res = { ok: true, message: 'Stay preferences updated.' };
    if (onSaveProfile) {
      res = await onSaveProfile({
        preferences: {
          thermostat,
          pillows,
          quietHours,
          emailNotifications,
          smsNotifications,
          preferredCurrency,
          timezone,
        },
      });
    } else if (onUpdateUser) {
      onUpdateUser({
        preferredCurrency,
        timezone,
      });
    }
    setSaving(false);
    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => {
          setFeedback(null);
          setSubView(id as ProfileSubView);
        }}
      />

      <div className="px-4 sm:px-8 pb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <h3 className="type-h3 text-slate-900">
              Profile Information &amp; Account Settings
            </h3>
            <p className="type-body text-slate-600">
              Update your personal contact details, billing address, and residence stay preferences.
            </p>
          </div>
          {subView === 'index' && (
            <button
              type="button"
              onClick={() => setSubView('personal-information')}
              className="btn btn-primary btn-sm w-fit"
            >
              Edit Profile Details
            </button>
          )}
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

        {/* Profile Overview */}
        {subView === 'index' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#14616d]" />
                <h4 className="type-h4 text-slate-900">
                  Registered Account Profile
                </h4>
              </div>

              <dl className="space-y-3.5 tabular-nums type-support">
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-slate-500">Full Name</dt>
                  <dd className="font-semibold text-slate-900 text-right">{user.name}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-slate-500">Email Address</dt>
                  <dd className="font-semibold text-slate-900 text-right">{user.email}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-slate-500">Phone Number</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {user.phone || 'Not provided'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-slate-500">Company / Organization</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {user.company || 'Not specified'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-slate-500">Role / Title</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {user.role || 'Not specified'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">User ID</dt>
                  <dd className="font-mono font-semibold text-slate-900 text-right">{user.id}</dd>
                </div>
              </dl>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#8c6a4a]" />
                <h4 className="type-h4 text-slate-900">
                  Billing Address &amp; Stay Preferences
                </h4>
              </div>

              <dl className="space-y-3.5 type-support">
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-slate-500">Billing Address</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {user.address?.street
                      ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}`
                      : 'No billing street saved yet'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 tabular-nums">
                  <dt className="text-slate-500">Arrival Thermostat</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {user.preferences?.thermostat || '70°F'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-slate-500">Bedding / Pillows</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {user.preferences?.pillows || 'Standard Luxury'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt className="text-slate-500">Email Alerts</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {user.preferences?.emailNotifications ? 'Enabled' : 'Paused'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Timezone</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {user.preferences?.timezone || user.timezone || 'Pacific (PST)'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Edit Personal & Billing Info */}
        {subView === 'personal-information' && (
          <form
            onSubmit={handleSavePersonal}
            className="max-w-2xl p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Registered Email (Account Login)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="form-input pl-10 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(916) 555-0100"
                    className="form-input pl-10 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional organization"
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Role / Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Optional title"
                  className="form-input"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="type-h4 text-slate-900">Billing Address</h4>
              <div>
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street address, suite or apartment"
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="form-input tabular-nums"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Profile Changes</span>
            </button>
          </form>
        )}

        {/* Stay & Notification Preferences */}
        {subView === 'preferences' && (
          <form
            onSubmit={handleSavePreferences}
            className="max-w-2xl p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-[#14616d]" />
              <h4 className="type-h4 text-slate-900">
                Residence Stay &amp; Notification Settings
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Preferred Arrival Thermostat
                </label>
                <select
                  value={thermostat}
                  onChange={(e) => setThermostat(e.target.value)}
                  className="form-select tabular-nums"
                >
                  <option value="68°F (20°C)">68°F (20°C)</option>
                  <option value="70°F (21°C)">70°F (21°C)</option>
                  <option value="72°F (22°C)">72°F (22°C)</option>
                  <option value="74°F (23°C)">74°F (23°C)</option>
                </select>
              </div>

              <div>
                <label className="form-label">
                  Pillow &amp; Bedding Preference
                </label>
                <select
                  value={pillows}
                  onChange={(e) => setPillows(e.target.value)}
                  className="form-select"
                >
                  <option value="Hypoallergenic Medium-Firm">Hypoallergenic Medium-Firm</option>
                  <option value="Plush Down-Alternative">Plush Down-Alternative</option>
                  <option value="Memory Foam Contour">Memory Foam Contour</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Housekeeping &amp; Quiet Schedule
                </label>
                <select
                  value={quietHours}
                  onChange={(e) => setQuietHours(e.target.value)}
                  className="form-select"
                >
                  <option value="Standard (10:00 PM – 7:00 AM)">Standard (10:00 PM – 7:00 AM)</option>
                  <option value="Daytime Sleeper / Night Shift">Daytime Sleeper / Night Shift</option>
                  <option value="No Entry During Stay">No Entry During Stay</option>
                </select>
              </div>

              <div>
                <label className="form-label">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="form-select"
                >
                  <option value="America/Los_Angeles (PT)">America/Los_Angeles (PT)</option>
                  <option value="America/Denver (MT)">America/Denver (MT)</option>
                  <option value="America/Chicago (CT)">America/Chicago (CT)</option>
                  <option value="America/New_York (ET)">America/New_York (ET)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-200">
              <label className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="type-label text-slate-900 block">
                    Email Confirmation &amp; Invoice Alerts
                  </span>
                  <span className="type-support text-slate-500 block font-normal">
                    Receive booking confirmations and receipt statements at {user.email}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[#14616d] shrink-0"
                />
              </label>

              <label className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="type-label text-slate-900 block">
                    SMS Arrival &amp; Fleet Delivery Updates
                  </span>
                  <span className="type-support text-slate-500 block font-normal">
                    Receive check-in keypad activation and vehicle delivery timing updates
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[#14616d] shrink-0"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Preferences</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
