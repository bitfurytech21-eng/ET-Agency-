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
      {/* Header and Search matching admin/guests/ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-[#282828]">Guest Directory &amp; Client Ledger (guests/)</h3>
          <p className="text-xs text-[#5c5046]">
            Physicians, corporate travelers, relocating families, and pre-funded Lodging Unit accounts.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#857568] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, hospital, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white border border-[#dfd6ca] rounded-lg text-xs outline-none focus:border-[#00b7a8] w-64"
          />
        </div>
      </div>

      {/* Guest Directory Table */}
      <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
              <tr>
                <th className="py-3 px-3">Guest Profile</th>
                <th className="py-3 px-3">Organization &amp; Role</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Verification Badges</th>
                <th className="py-3 px-3">Lodging Units Balance</th>
                <th className="py-3 px-3">Total Stays</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd5]">
              {filteredGuests.map((g) => (
                <tr key={g.id} className="hover:bg-[#fbf9f6] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#282828]">{g.name}</div>
                    <div className="text-[11px] font-mono text-[#82634f]">{g.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#282828]">{g.company || 'Private Client'}</div>
                    <div className="text-[11px] text-[#5c5046]">{g.role || 'Guest'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-[#282828]">{g.email}</div>
                    <div className="text-[11px] text-[#857568]">{g.phone || 'No phone recorded'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Government ID Verified
                      </span>
                      {g.corporateVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#00897d] font-bold">
                          <ShieldCheck className="w-3 h-3 text-[#00b7a8]" /> Direct Hospital Settle
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-heading font-black text-sm text-[#00897d] tabular-nums">
                      {g.units_balance} Units
                    </div>
                    <div className="text-[10px] text-[#857568] tabular-nums">
                      Eq. ${g.balance_usd?.toLocaleString()} USD
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#282828] tabular-nums">
                    {g.totalStays || 1} stays
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedGuest(g)}
                        title="View Guest Record"
                        className="p-1.5 bg-white text-[#5c5046] hover:bg-[#faf8f5] rounded border border-[#dfd6ca] cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllocModalGuest(g)}
                        className="px-2 py-1 bg-[#e8f8f6] hover:bg-[#d0f2ed] text-[#00897d] border border-[#bfe8e3] rounded text-[11px] font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Coins className="w-3 h-3" />
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs text-[#282828] border border-[#e6dfd5]">
            <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
              <h3 className="font-heading font-bold text-base text-[#282828]">{selectedGuest.name}</h3>
              <button onClick={() => setSelectedGuest(null)} className="text-[#857568]">✕</button>
            </div>
            <div className="space-y-2">
              <div><strong className="text-[#857568]">Email:</strong> {selectedGuest.email}</div>
              <div><strong className="text-[#857568]">Phone:</strong> {selectedGuest.phone}</div>
              <div><strong className="text-[#857568]">Company:</strong> {selectedGuest.company}</div>
              <div><strong className="text-[#857568]">Role:</strong> {selectedGuest.role}</div>
              <div><strong className="text-[#857568]">Units Balance:</strong> {selectedGuest.units_balance} Units (${selectedGuest.balance_usd} USD)</div>
              <div><strong className="text-[#857568]">Registered Since:</strong> {new Date(selectedGuest.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex justify-end pt-3 border-t border-[#e6dfd5]">
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-4 py-1.5 border border-[#dfd6ca] rounded-lg text-[#5c5046]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Units Modal */}
      {allocModalGuest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs text-[#282828] border border-[#e6dfd5]">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h3 className="font-heading font-bold text-base text-[#282828]">
                Allocate Units: {allocModalGuest.name}
              </h3>
              <p className="text-[11px] text-[#5c5046]">1 Lodging Unit = $100 USD redeemable across stays and fleet.</p>
            </div>

            <form onSubmit={handleAllocateSubmit} className="space-y-3">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Units Delta (+/-)</label>
                <input
                  type="number"
                  required
                  value={allocUnits}
                  onChange={(e) => setAllocUnits(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Treasury Authorization Reason</label>
                <input
                  type="text"
                  required
                  value={allocReason}
                  onChange={(e) => setAllocReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e6dfd5]">
                <button
                  type="button"
                  onClick={() => setAllocModalGuest(null)}
                  className="px-4 py-1.5 border border-[#dfd6ca] rounded-lg text-[#5c5046]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00b7a8] text-white font-bold rounded-lg"
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
