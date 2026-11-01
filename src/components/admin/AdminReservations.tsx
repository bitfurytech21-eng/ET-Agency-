import React, { useState } from 'react';
import {
  Calendar,
  Building2,
  Car,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  Check,
  X,
  FileText,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import type { AdminReservation } from './adminTypes';

interface AdminReservationsProps {
  reservations: AdminReservation[];
  onUpdateStatus: (id: string, newStatus: AdminReservation['status']) => void;
}

export const AdminReservations: React.FC<AdminReservationsProps> = ({
  reservations,
  onUpdateStatus,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'accommodation' | 'car-rentals'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<AdminReservation | null>(null);

  const filteredReservations = reservations.filter((r) => {
    // Type filter
    if (typeFilter === 'accommodation' && r.type !== 'accommodation') return false;
    if (typeFilter === 'car-rentals' && r.type !== 'car-rental') return false;

    // Status filter
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.guestName.toLowerCase().includes(q) ||
      r.guestEmail.toLowerCase().includes(q) ||
      r.targetTitle.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.employer && r.employer.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: AdminReservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation matching admin/reservations/ hierarchy */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
        {/* Type tabs (index, accommodation, car-rentals) */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Reservations (index.php)', icon: Calendar },
            { id: 'accommodation', label: 'Accommodation Stays (accommodation.php)', icon: Building2 },
            { id: 'car-rentals', label: '3D Fleet Rentals (car-rentals.php)', icon: Car },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id as typeof typeFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  active
                    ? 'bg-[#00b7a8] text-white border-[#00b7a8] shadow-xs'
                    : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:border-[#00b7a8]/40 hover:text-[#282828]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#857568] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search guest, unit, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white border border-[#dfd6ca] rounded-lg text-xs outline-none focus:border-[#00b7a8] w-64"
          />
        </div>
      </div>

      {/* Status Filter Tabs (pending, confirmed, active, completed, cancelled) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#857568] mr-1">Status View:</span>
        {[
          { id: 'all', label: 'All Statuses' },
          { id: 'pending', label: 'Pending Review (pending.php)', count: reservations.filter((r) => r.status === 'pending').length },
          { id: 'confirmed', label: 'Confirmed (confirmed.php)', count: reservations.filter((r) => r.status === 'confirmed').length },
          { id: 'active', label: 'Active / Checked In (active.php)', count: reservations.filter((r) => r.status === 'active').length },
          { id: 'completed', label: 'Completed (completed.php)', count: reservations.filter((r) => r.status === 'completed').length },
          { id: 'cancelled', label: 'Cancelled (cancelled.php)', count: reservations.filter((r) => r.status === 'cancelled').length },
        ].map((tab) => {
          const active = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                active
                  ? 'bg-[#82634f] text-white border-[#82634f]'
                  : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:bg-[#faf8f5]'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-[#faf8f5] text-[#82634f]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Reservations Table */}
      <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-[#282828]">
              {typeFilter === 'all'
                ? 'All Guest & Fleet Reservations'
                : typeFilter === 'accommodation'
                ? 'Nationwide Suites & Residences Stays'
                : '3D Studio Fleet Rentals'}
            </h3>
            <p className="text-xs text-[#5c5046]">
              Showing {filteredReservations.length} of {reservations.length} total bookings
            </p>
          </div>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-12 text-[#857568] space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-[#dfd6ca]" />
            <p className="text-sm font-semibold">No reservations found in this view.</p>
            <p className="text-xs">Adjust your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
                <tr>
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Guest &amp; Affiliation</th>
                  <th className="py-3 px-3">Reserved Asset</th>
                  <th className="py-3 px-3">Dates &amp; Duration</th>
                  <th className="py-3 px-3">Total ($ / Units)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5]">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-[#fbf9f6] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#82634f]">{res.id}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.type === 'accommodation'
                            ? 'bg-[#e8f8f6] text-[#00897d] border border-[#bfe8e3]'
                            : 'bg-[#fbf5ee] text-[#82634f] border border-[#ebdccb]'
                        }`}
                      >
                        {res.type === 'accommodation' ? <Building2 className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                        <span>{res.type === 'accommodation' ? 'Residence' : 'Vehicle'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#282828]">{res.guestName}</div>
                      <div className="text-[11px] text-[#5c5046]">{res.guestEmail}</div>
                      {res.employer && (
                        <div className="text-[10px] text-[#00897d] font-semibold">{res.employer}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#282828] block line-clamp-1">{res.targetTitle}</span>
                      <span className="text-[11px] text-[#857568]">{res.targetId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#282828] block">
                        {res.startDate} → {res.endDate}
                      </span>
                      <span className="text-[11px] text-[#857568]">{res.totalDays} days / nights</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#00897d] block tabular-nums">
                        ${res.amountUsd?.toLocaleString()}
                      </span>
                      {res.unitsCost && (
                        <span className="text-[10px] text-[#82634f] font-mono">{res.unitsCost} Units</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(
                          res.status
                        )}`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReservation(res)}
                          title="View Details"
                          className="p-1.5 rounded bg-white hover:bg-[#faf8f5] text-[#5c5046] border border-[#dfd6ca] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {res.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(res.id, 'confirmed')}
                            title="Confirm Booking"
                            className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {res.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(res.id, 'active')}
                            title="Check In / Activate"
                            className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {res.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(res.id, 'completed')}
                            title="Complete Stay"
                            className="p-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {res.status !== 'cancelled' && res.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(res.id, 'cancelled')}
                            title="Cancel Booking"
                            className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 text-xs text-[#282828] border border-[#e6dfd5]">
            <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#82634f] font-bold block">
                  {selectedReservation.id}
                </span>
                <h3 className="font-heading font-bold text-base text-[#282828]">Reservation Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReservation(null)}
                className="p-1.5 text-[#857568] hover:text-[#282828] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e6dfd5] space-y-1.5">
                <span className="font-bold text-[#82634f] text-[11px] block uppercase tracking-wider">
                  Target Asset &amp; Category
                </span>
                <p className="font-bold text-sm text-[#282828]">{selectedReservation.targetTitle}</p>
                <p className="text-[11px] text-[#5c5046]">Asset ID: {selectedReservation.targetId}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e6dfd5]">
                  <span className="text-[10px] text-[#857568] uppercase font-bold block">Guest Name</span>
                  <span className="font-bold text-[#282828] text-xs">{selectedReservation.guestName}</span>
                </div>
                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e6dfd5]">
                  <span className="text-[10px] text-[#857568] uppercase font-bold block">Corporate Sponsor</span>
                  <span className="font-bold text-[#00897d] text-xs">
                    {selectedReservation.employer || 'Self-Sponsored'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e6dfd5] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#857568]">Stay Dates:</span>
                  <span className="font-bold text-[#282828]">
                    {selectedReservation.startDate} to {selectedReservation.endDate} ({selectedReservation.totalDays} days)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#857568]">Financial Settlement:</span>
                  <span className="font-bold text-[#00897d] tabular-nums">
                    ${selectedReservation.amountUsd?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#857568]">Current Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(
                      selectedReservation.status
                    )}`}
                  >
                    {selectedReservation.status}
                  </span>
                </div>
              </div>

              {selectedReservation.notes && (
                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e6dfd5]">
                  <span className="text-[10px] text-[#857568] uppercase font-bold block mb-1">Guest Notes:</span>
                  <p className="text-xs text-[#282828]">{selectedReservation.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#e6dfd5]">
              <div className="flex gap-2">
                {selectedReservation.status !== 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStatus(selectedReservation.id, 'confirmed');
                      setSelectedReservation(null);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-emerald-700"
                  >
                    Set Confirmed
                  </button>
                )}
                {selectedReservation.status !== 'active' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStatus(selectedReservation.id, 'active');
                      setSelectedReservation(null);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-blue-700"
                  >
                    Set Active
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedReservation(null)}
                className="px-4 py-1.5 border border-[#dfd6ca] rounded-lg text-[#5c5046] hover:bg-[#faf8f5] font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
