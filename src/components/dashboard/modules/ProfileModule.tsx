import React, { useState } from 'react';
import { UserSession, ProfileSubView } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Settings,
  Heart,
  Sliders,
} from 'lucide-react';

interface ProfileModuleProps {
  user: UserSession;
  onUpdateUser: (updates: Partial<UserSession>) => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({
  user,
  onUpdateUser,
}) => {
  const [subView, setSubView] = useState<ProfileSubView>('index');

  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.company);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [street, setStreet] = useState(user.address?.street || '104 Corporate Plaza');
  const [city, setCity] = useState(user.address?.city || 'Dallas');
  const [state, setState] = useState(user.address?.state || 'TX');
  const [zip, setZip] = useState(user.address?.zip || '75001');

  // Preferences
  const [tempPref, setTempPref] = useState('71°F');
  const [pillowPref, setPillowPref] = useState('Hypoallergenic Down-Alternative');
  const [quietHours, setQuietHours] = useState('10:00 PM – 8:00 AM');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Profile Summary', fileName: 'index.php' },
    { id: 'personal-information', label: 'Personal Info', fileName: 'personal-information.php' },
    { id: 'contact-information', label: 'Contact Details', fileName: 'contact-information.php' },
    { id: 'profile-photo', label: 'Profile Avatar', fileName: 'profile-photo.php' },
    { id: 'identification', label: 'Identity Verification', fileName: 'identification.php' },
    { id: 'preferences', label: 'Stay Preferences', fileName: 'preferences.php' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      company,
      role,
      email,
      phone,
      address: { street, city, state, zip, country: 'California’s homes' },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/Profile/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as ProfileSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6">
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile settings saved and updated across all current bookings.</span>
          </div>
        )}

        {/* 1. Profile Summary (index.php) */}
        {subView === 'index' && (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-[#e6dfd5] rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-2xs">
              <div className="w-20 h-20 rounded-2xl bg-[#00b7a8] text-white flex items-center justify-center font-heading font-black text-3xl shadow-sm shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-heading font-black text-2xl text-[#282828]">{user.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00b7a8]/15 border border-[#00b7a8]/30 text-[#00897d] text-xs font-bold">
                    {user.tier} Member
                  </span>
                </div>
                <p className="text-xs text-[#5c5046] font-medium">
                  {user.role} • {user.company}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-[#857568]">
                  <span>Member Since: <strong>{user.memberSince}</strong></span>
                  <span>•</span>
                  <span>Verified Identity: <strong>{user.idVerified ? 'Verified ✓' : 'Pending'}</strong></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#282828]">Account Information</h4>
                <div className="space-y-2 text-[#5c5046]">
                  <div><span className="text-[#857568]">Email:</span> <strong>{user.email}</strong></div>
                  <div><span className="text-[#857568]">Phone:</span> <strong>{user.phone}</strong></div>
                  <div><span className="text-[#857568]">Client ID:</span> <strong className="font-mono">{user.id}</strong></div>
                </div>
              </div>

              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#282828]">Corporate Residence Preferences</h4>
                <div className="space-y-2 text-[#5c5046]">
                  <div><span className="text-[#857568]">Target Temp:</span> <strong>{tempPref}</strong></div>
                  <div><span className="text-[#857568]">Bedding Pillows:</span> <strong>{pillowPref}</strong></div>
                  <div><span className="text-[#857568]">Billing Currency:</span> <strong>{user.preferredCurrency} (USD)</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Personal Information (personal-information.php) & 3. Contact Info */}
        {(subView === 'personal-information' || subView === 'contact-information') && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto shadow-xs">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                {subView === 'personal-information' ? 'Personal Information' : 'Contact Information'}
              </h3>
              <p className="text-xs text-[#5c5046]">
                Keep guest and corporate travel coordinator records up to date.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Billing Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl shadow-2xs cursor-pointer"
                >
                  Save Profile Updates
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. Profile Photo (profile-photo.php) */}
        {subView === 'profile-photo' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl mx-auto text-center">
            <h3 className="font-heading font-bold text-lg text-[#282828]">Profile Avatar (profile-photo.php)</h3>
            <div className="w-24 h-24 rounded-full bg-[#00b7a8] text-white flex items-center justify-center font-heading font-black text-4xl mx-auto shadow-md">
              {user.name.charAt(0)}
            </div>
            <p className="text-xs text-[#5c5046]">
              Your initials or photo appear on guest itineraries and vehicle handover records.
            </p>
            <button
              type="button"
              onClick={() => alert('Photo upload simulated successfully.')}
              className="px-4 py-2 border border-[#d8cfc3] rounded-xl text-xs font-bold text-[#282828] hover:bg-[#faf8f5] cursor-pointer"
            >
              Upload New Photo
            </button>
          </div>
        )}

        {/* 5. Identification (identification.php) */}
        {subView === 'identification' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl mx-auto">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Government ID Verification (identification.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Encrypted identity verification for contactless keyless self check-in.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Verified Government ID on File</span>
                <span className="text-[11px] text-emerald-700">Driver License verified • Expiration: 2028</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Preferences (preferences.php) */}
        {subView === 'preferences' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Personalized Stay Preferences (preferences.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Our staging team prepares each residence to your exact comfort standards.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Preferred Thermostat Setting</label>
                <select
                  value={tempPref}
                  onChange={(e) => setTempPref(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                >
                  <option value="68°F">68°F (Cool)</option>
                  <option value="70°F">70°F (Mild)</option>
                  <option value="71°F">71°F (Standard)</option>
                  <option value="73°F">73°F (Warm)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Pillow &amp; Bedding Type</label>
                <select
                  value={pillowPref}
                  onChange={(e) => setPillowPref(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                >
                  <option value="Hypoallergenic Down-Alternative">Hypoallergenic Down-Alternative (Standard)</option>
                  <option value="Memory Foam Contour">Memory Foam Contour</option>
                  <option value="Firm Feather Blend">Firm Feather Blend</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Preferences saved!')}
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl shadow-2xs"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
