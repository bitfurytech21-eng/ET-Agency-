import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Lock,
  FileText,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface AdminAuditLog {
  id: string;
  actorEmail: string;
  action: string;
  targetId: string;
  details: string;
  createdAt: string;
}

interface AdminSettingsProps {
  auditLogs: AdminAuditLog[];
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ auditLogs }) => {
  const [platformName, setPlatformName] = useState('Easy Travel Lodging LLC');
  const [phone, setPhone] = useState('+1 (646) 415-0211');
  const [email, setEmail] = useState('easytravelagency@trustagent.space');
  const [officeAddress, setOfficeAddress] = useState('California’s homes (Agency Headquarters & Regional Service Network)');
  const [checkInTime, setCheckInTime] = useState('3:00 PM PST');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM PST');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header matching admin/settings/ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-[#282828]">System Settings &amp; Security (settings/)</h3>
          <p className="text-xs text-[#5c5046]">
            Global platform parameters, concierge contact channels, and immutable audit logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-[#e6dfd5] pb-3">
            <h4 className="font-heading font-bold text-base text-[#282828]">General Platform Configuration</h4>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {isSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings successfully saved and propagated.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Support Hotline</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Primary Support Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Hub Headquarters</label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Standard Check-In Time</label>
                <input
                  type="text"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Standard Check-Out Time</label>
                <input
                  type="text"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2 bg-[#82634f] hover:bg-[#6e5240] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-[#e6dfd5] pb-3">
            <h4 className="font-heading font-bold text-base text-[#282828]">Immutable Audit Trail</h4>
            <p className="text-xs text-[#5c5046]">Recorded administrative mutations.</p>
          </div>

          <div className="space-y-3 text-xs max-h-[460px] overflow-y-auto">
            {auditLogs.length === 0 ? (
              <p className="text-[#857568] py-4 text-center">No audit records logged yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#82634f]">{log.action}</span>
                    <span className="text-[10px] text-[#857568]">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#282828] text-[11px]">{log.details}</p>
                  <span className="text-[10px] text-[#00897d] font-medium block">Actor: {log.actorEmail}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
