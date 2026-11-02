import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  FileText,
  Plus,
  Eye,
  Calendar,
} from 'lucide-react';
import type { AdminGuest } from './adminTypes';

interface AdminGuestsProps {
  guests: AdminGuest[];
  onAllocateUnits: (guestId: string, unitsDelta: number, reason: string) => void;
}

export const AdminGuests: React.FC<AdminGuestsProps> = ({
  guests,
  onAllocateUnits,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<AdminGuest | null>(null);
  const [allocModalGuest, setAllocModalGuest] = useState<AdminGuest | null>(null);
  const [allocUnits, setAllocUnits] = useState('10');
  const [allocReason, setAllocReason] = useState('Corporate travel credit');

  const filteredGuests = guests.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.company.toLowerCase().includes(q) ||
      g.role.toLowerCase().includes(q)
    );
  });

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allocModalGuest) {
      onAllocateUnits(allocModalGuest.id, Number(allocUnits) || 0, allocReason);
      setAllocModalGuest(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h3 className="type-h3 text-slate-900">Guest Directory &amp; Client Ledger</h3>
          <p className="type-body text-slate-600">
            Physicians, corporate travelers, relocating families, and pre-funded Lodging Unit accounts.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, hospital, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Guest Directory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest Profile</th>
                <th>Organization &amp; Role</th>
                <th>Contact Details</th>
                <th>Verification Status</th>
                <th>Lodging Units Balance</th>
                <th>Total Stays</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((g) => (
                <tr key={g.id}>
                  <td>
                    <div className="font-semibold text-slate-900">{g.name}</div>
                    <div className="type-support font-mono text-[#8c6a4a]">{g.id}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900">{g.company || 'Private Client'}</div>
                    <div className="type-support text-slate-500">{g.role || 'Guest'}</div>
                  </td>
                  <td>
                    <div className="text-slate-900">{g.email}</div>
                    <div className="type-support text-slate-500 tabular-nums">{g.phone || 'No phone recorded'}</div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1.5 type-support text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Government ID Verified
                      </span>
                      {g.corporateVerified && (
                        <span className="inline-flex items-center gap-1.5 type-support text-[#14616d] font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#14616d]" /> Direct Hospital Settle
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="tabular-nums">
                    <div className="font-semibold text-[#14616d]">
                      {g.units_balance} Units
                    </div>
                    <div className="type-support text-slate-500">
                      Eq. ${g.balance_usd?.toLocaleString()} USD
                    </div>
                  </td>
                  <td className="font-semibold text-slate-900 tabular-nums">
                    {g.totalStays || 1} stays
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedGuest(g)}
                        title="View Guest Record"
                        className="p-2 bg-white text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllocModalGuest(g)}
                        className="btn btn-outline btn-sm text-[#14616d] border-[#14616d]/30 hover:border-[#14616d]"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Allocate Units</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Details Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl space-y-5 text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="type-h4 text-slate-900">{selectedGuest.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedGuest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 type-support tabular-nums">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-900 text-right">{selectedGuest.email}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-900 text-right">{selectedGuest.phone || 'Not recorded'}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-slate-500">Company:</span>
                <span className="font-semibold text-slate-900 text-right">{selectedGuest.company || 'Private Client'}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-slate-900 text-right">{selectedGuest.role || 'Guest'}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-slate-500">Units Balance:</span>
                <span className="font-semibold text-[#14616d] text-right">
                  {selectedGuest.units_balance} Units (${selectedGuest.balance_usd} USD)
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Registered Since:</span>
                <span className="font-semibold text-slate-900 text-right">
                  {new Date(selectedGuest.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedGuest(null)}
                className="btn btn-outline btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Units Modal */}
      {allocModalGuest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl space-y-5 text-slate-900 border border-slate-200">
            <div className="border-b border-slate-200 pb-4 space-y-1">
              <h3 className="type-h4 text-slate-900">
                Allocate Units: {allocModalGuest.name}
              </h3>
              <p className="type-support text-slate-500">
                1 Lodging Unit = $100 USD redeemable across stays and fleet.
              </p>
            </div>

            <form onSubmit={handleAllocateSubmit} className="space-y-4">
              <div>
                <label className="form-label">Units Delta (+/-)</label>
                <input
                  type="number"
                  required
                  value={allocUnits}
                  onChange={(e) => setAllocUnits(e.target.value)}
                  className="form-input font-semibold tabular-nums"
                />
              </div>

              <div>
                <label className="form-label">Treasury Authorization Reason</label>
                <input
                  type="text"
                  required
                  value={allocReason}
                  onChange={(e) => setAllocReason(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAllocModalGuest(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
