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
  const [phone, setPhone] = useState('(916) 800-3295');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h3 className="type-h3 text-slate-900">System Settings &amp; Security</h3>
          <p className="type-body text-slate-600 mt-1">
            Global platform parameters, concierge contact channels, and immutable audit logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-7 admin-panel p-6 space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <h4 className="type-h4 text-slate-900">General Platform Configuration</h4>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {isSaved && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 type-support font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Settings successfully saved and propagated.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Company Legal Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Support Hotline</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Primary Support Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Hub Headquarters</label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Standard Check-In Time</label>
                <input
                  type="text"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="form-input tabular-nums"
                />
              </div>

              <div>
                <label className="form-label">Standard Check-Out Time</label>
                <input
                  type="text"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="form-input tabular-nums"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Save className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-5 admin-panel p-6 space-y-4">
          <div className="border-b border-slate-200 pb-4">
            <h4 className="type-h4 text-slate-900">Immutable Audit Trail</h4>
            <p className="type-support text-slate-600 mt-1">Recorded administrative mutations.</p>
          </div>

          <div className="divide-y divide-slate-200 max-h-[460px] overflow-y-auto">
            {auditLogs.length === 0 ? (
              <p className="type-support text-slate-500 py-6 text-center">No audit records logged yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono type-support font-semibold text-[#14616d]">{log.action}</span>
                    <span className="type-support text-slate-500 tabular-nums shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="type-support text-slate-800">{log.details}</p>
                  <span className="type-support text-slate-500 block">Actor: {log.actorEmail}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
