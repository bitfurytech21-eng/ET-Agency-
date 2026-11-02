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
  onSaveProfile: (updates: {
    name?: string;
    company?: string;
    role?: string;
    phone?: string;
    address?: Partial<UserAddress>;
    preferences?: Partial<UserPreferences>;
  }) => Promise<{ ok: boolean; message: string }>;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({ user, onSaveProfile }) => {
  const [subView, setSubView] = useState<ProfileSubView>('index');

  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.company);
  const [role, setRole] = useState(user.role);
  const [phone, setPhone] = useState(user.phone);

  const [street, setStreet] = useState(user.address.street);
  const [city, setCity] = useState(user.address.city);
  const [stateCode, setStateCode] = useState(user.address.state);
  const [zip, setZip] = useState(user.address.zip);
  const [country, setCountry] = useState(user.address.country || 'United States');

  const [thermostat, setThermostat] = useState(user.preferences.thermostat);
  const [pillows, setPillows] = useState(user.preferences.pillows);
  const [quietHours, setQuietHours] = useState(user.preferences.quietHours);
  const [emailNotifications, setEmailNotifications] = useState(user.preferences.emailNotifications);
  const [smsNotifications, setSmsNotifications] = useState(user.preferences.smsNotifications);
  const [preferredCurrency, setPreferredCurrency] = useState(user.preferences.preferredCurrency);
  const [timezone, setTimezone] = useState(user.preferences.timezone);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  useEffect(() => {
    setName(user.name);
    setCompany(user.company);
    setRole(user.role);
    setPhone(user.phone);
    setStreet(user.address.street);
    setCity(user.address.city);
    setStateCode(user.address.state);
    setZip(user.address.zip);
    setCountry(user.address.country || 'United States');
    setThermostat(user.preferences.thermostat);
    setPillows(user.preferences.pillows);
    setQuietHours(user.preferences.quietHours);
    setEmailNotifications(user.preferences.emailNotifications);
    setSmsNotifications(user.preferences.smsNotifications);
    setPreferredCurrency(user.preferences.preferredCurrency);
    setTimezone(user.preferences.timezone);
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
    const res = await onSaveProfile({
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
    setSaving(false);
    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    const res = await onSaveProfile({
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

      <div className="px-4 sm:px-8 pb-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828]">
              Profile Information &amp; Account Settings
            </h3>
            <p className="text-xs text-[#6e5d50]">
              Update your personal contact details, billing address, and residence stay preferences
            </p>
          </div>
          {subView === 'index' && (
            <button
              type="button"
              onClick={() => setSubView('personal-information')}
              className="px-4 py-2 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 w-fit"
            >
              Edit Profile Details
            </button>
          )}
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

        {/* Profile Overview */}
        {subView === 'index' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#00897d]" />
                <h4 className="font-heading font-bold text-base text-[#282828]">
                  Registered Account Profile
                </h4>
              </div>

              <dl className="space-y-3 tabular-nums">
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Full Name</dt>
                  <dd className="font-bold text-[#282828] text-right">{user.name}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Email Address</dt>
                  <dd className="font-semibold text-[#282828] text-right">{user.email}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Phone Number</dt>
                  <dd className="font-semibold text-[#282828] text-right">
                    {user.phone || 'Not provided'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Company / Organization</dt>
                  <dd className="font-semibold text-[#282828] text-right">
                    {user.company || 'Not specified'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Role / Title</dt>
                  <dd className="font-semibold text-[#282828] text-right">
                    {user.role || 'Not specified'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6e5d50]">User ID</dt>
                  <dd className="font-mono font-bold text-[#282828] text-right">{user.id}</dd>
                </div>
              </dl>
            </div>

            <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#82634f]" />
                <h4 className="font-heading font-bold text-base text-[#282828]">
                  Billing Address &amp; Stay Preferences
                </h4>
              </div>

              <dl className="space-y-3">
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Billing Address</dt>
                  <dd className="font-semibold text-[#282828] text-right">
                    {user.address.street
                      ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}`
                      : 'No billing street saved yet'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Arrival Thermostat</dt>
                  <dd className="font-semibold text-[#282828] text-right">
                    {user.preferences.thermostat}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Bedding / Pillows</dt>
                  <dd className="font-semibold text-[#282828] text-right">
                    {user.preferences.pillows}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Email Alerts</dt>
                  <dd className="font-semibold text-[#282828] text-right">
                    {user.preferences.emailNotifications ? 'Enabled' : 'Paused'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6e5d50]">Timezone</dt>
                  <dd className="font-semibold text-[#282828] text-right">
                    {user.preferences.timezone}
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
            className="max-w-2xl p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Registered Email (Account Login)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-9 pr-3 h-10 bg-[#efe9e0]/60 border border-[#d8cfc3] rounded-xl text-xs text-[#6e5d50] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(916) 555-0100"
                    className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional organization"
                    className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Role / Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Optional title"
                  className="w-full px-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#e6dfd5] space-y-4">
              <h4 className="font-heading font-bold text-sm text-[#282828]">Billing Address</h4>
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street address, suite or apartment"
                  className="w-full px-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-[#282828] mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">State</label>
                  <input
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="w-full px-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-[#282828] mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
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
            className="max-w-2xl p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-5"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00897d]" />
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Residence Stay &amp; Notification Settings
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Preferred Arrival Thermostat
                </label>
                <select
                  value={thermostat}
                  onChange={(e) => setThermostat(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="68°F (20°C)">68°F (20°C)</option>
                  <option value="70°F (21°C)">70°F (21°C)</option>
                  <option value="72°F (22°C)">72°F (22°C)</option>
                  <option value="74°F (23°C)">74°F (23°C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Pillow &amp; Bedding Preference
                </label>
                <select
                  value={pillows}
                  onChange={(e) => setPillows(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="Hypoallergenic Medium-Firm">Hypoallergenic Medium-Firm</option>
                  <option value="Plush Down-Alternative">Plush Down-Alternative</option>
                  <option value="Memory Foam Contour">Memory Foam Contour</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Housekeeping &amp; Quiet Schedule
                </label>
                <select
                  value={quietHours}
                  onChange={(e) => setQuietHours(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="Standard (10:00 PM – 7:00 AM)">Standard (10:00 PM – 7:00 AM)</option>
                  <option value="Daytime Sleeper / Night Shift">Daytime Sleeper / Night Shift</option>
                  <option value="No Entry During Stay">No Entry During Stay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="America/Los_Angeles (PT)">America/Los_Angeles (PT)</option>
                  <option value="America/Denver (MT)">America/Denver (MT)</option>
                  <option value="America/Chicago (CT)">America/Chicago (CT)</option>
                  <option value="America/New_York (ET)">America/New_York (ET)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#e6dfd5]">
              <label className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#efe9e0] cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-[#282828] block">
                    Email Confirmation &amp; Invoice Alerts
                  </span>
                  <span className="text-[11px] text-[#6e5d50]">
                    Receive booking confirmations and receipt statements at {user.email}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[#00b7a8]"
                />
              </label>

              <label className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#efe9e0] cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-[#282828] block">
                    SMS Arrival &amp; Fleet Delivery Updates
                  </span>
                  <span className="text-[11px] text-[#6e5d50]">
                    Receive check-in keypad activation and vehicle delivery timing updates
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[#00b7a8]"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
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
