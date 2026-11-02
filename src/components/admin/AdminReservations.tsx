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
      {/* Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Reservations', icon: Calendar },
            { id: 'accommodation', label: 'Accommodation Stays', icon: Building2 },
            { id: 'car-rentals', label: 'Fleet Rentals', icon: Car },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id as typeof typeFilter)}
                className={`px-3.5 py-2 rounded-xl type-nav flex items-center gap-2 transition-colors cursor-pointer border whitespace-nowrap ${
                  active
                    ? 'bg-[#14616d] text-white border-[#14616d] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search guest, unit, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="type-label text-slate-600 mr-1">Status View:</span>
        {[
          { id: 'all', label: 'All Statuses' },
          { id: 'pending', label: 'Pending Review', count: reservations.filter((r) => r.status === 'pending').length },
          { id: 'confirmed', label: 'Confirmed', count: reservations.filter((r) => r.status === 'confirmed').length },
          { id: 'active', label: 'Active / Checked In', count: reservations.filter((r) => r.status === 'active').length },
          { id: 'completed', label: 'Completed', count: reservations.filter((r) => r.status === 'completed').length },
          { id: 'cancelled', label: 'Cancelled', count: reservations.filter((r) => r.status === 'cancelled').length },
        ].map((tab) => {
          const active = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3 py-1.5 rounded-lg type-btn cursor-pointer border transition-colors flex items-center gap-1.5 whitespace-nowrap tabular-nums ${
                active
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`type-support font-semibold ${
                    active ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Reservations Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <h3 className="type-h3 text-slate-900">
              {typeFilter === 'all'
                ? 'All Guest & Fleet Reservations'
                : typeFilter === 'accommodation'
                ? 'Suites & Residences Stays'
                : 'Executive Fleet Rentals'}
            </h3>
            <p className="type-support text-slate-500 tabular-nums">
              Showing {filteredReservations.length} of {reservations.length} total bookings
            </p>
          </div>
        </div>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-slate-300" />
            <p className="type-h4 text-slate-700">No reservations found in this view.</p>
            <p className="type-support text-slate-500">Adjust your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Category</th>
                  <th>Guest &amp; Affiliation</th>
                  <th>Reserved Asset</th>
                  <th>Dates &amp; Duration</th>
                  <th>Total ($ / Units)</th>
                  <th>Status</th>
                  <th className="text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((res) => (
                  <tr key={res.id}>
                    <td className="font-mono font-semibold text-[#8c6a4a] type-support">{res.id}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 type-support font-semibold ${
                          res.type === 'accommodation'
                            ? 'text-[#14616d]'
                            : 'text-[#8c6a4a]'
                        }`}
                      >
                        {res.type === 'accommodation' ? <Building2 className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                        <span>{res.type === 'accommodation' ? 'Residence' : 'Vehicle'}</span>
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900">{res.guestName}</div>
                      <div className="type-support text-slate-500">{res.guestEmail}</div>
                      {res.employer && (
                        <div className="type-support text-[#14616d] font-medium">{res.employer}</div>
                      )}
                    </td>
                    <td>
                      <span className="font-semibold text-slate-900 block line-clamp-1">{res.targetTitle}</span>
                      <span className="type-support text-slate-500 font-mono">{res.targetId}</span>
                    </td>
                    <td className="tabular-nums">
                      <span className="font-semibold text-slate-900 block">
                        {res.startDate} → {res.endDate}
                      </span>
                      <span className="type-support text-slate-500">{res.totalDays} days / nights</span>
                    </td>
                    <td className="tabular-nums">
                      <span className="font-semibold text-[#14616d] block">
                        ${res.amountUsd?.toLocaleString()}
                      </span>
                      {res.unitsCost && (
                        <span className="type-support text-[#8c6a4a] font-mono">{res.unitsCost} Units</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-md type-support font-semibold capitalize border inline-block ${getStatusBadge(
                          res.status
                        )}`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReservation(res)}
                          title="View Details"
                          className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {res.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(res.id, 'confirmed')}
                            title="Confirm Booking"
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {res.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(res.id, 'active')}
                            title="Check In / Activate"
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {res.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(res.id, 'completed')}
                            title="Complete Stay"
                            className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}

                        {res.status !== 'cancelled' && res.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(res.id, 'cancelled')}
                            title="Cancel Booking"
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-5 text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="font-mono type-support text-[#8c6a4a] font-semibold block">
                  {selectedReservation.id}
                </span>
                <h3 className="type-h4 text-slate-900">Reservation Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReservation(null)}
                className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="type-support font-semibold text-slate-500 block">
                  Target Asset &amp; Category
                </span>
                <p className="type-h4 text-slate-900">{selectedReservation.targetTitle}</p>
                <p className="type-support text-slate-500 font-mono">Asset ID: {selectedReservation.targetId}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="type-support text-slate-500 font-medium block">Guest Name</span>
                  <span className="type-label text-slate-900">{selectedReservation.guestName}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="type-support text-slate-500 font-medium block">Corporate Sponsor</span>
                  <span className="type-label text-[#14616d]">
                    {selectedReservation.employer || 'Self-Sponsored'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 type-support tabular-nums">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Stay Dates:</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {selectedReservation.startDate} to {selectedReservation.endDate} ({selectedReservation.totalDays} days)
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Financial Settlement:</span>
                  <span className="font-semibold text-[#14616d]">
                    ${selectedReservation.amountUsd?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-500">Current Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md type-support font-semibold capitalize border ${getStatusBadge(
                      selectedReservation.status
                    )}`}
                  >
                    {selectedReservation.status}
                  </span>
                </div>
              </div>

              {selectedReservation.notes && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="type-support text-slate-500 font-semibold block">Guest Notes:</span>
                  <p className="type-body text-slate-700">{selectedReservation.notes}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-slate-200">
              <div className="flex flex-wrap gap-2">
                {selectedReservation.status !== 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStatus(selectedReservation.id, 'confirmed');
                      setSelectedReservation(null);
                    }}
                    className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white"
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
                    className="btn btn-sm bg-[#14616d] hover:bg-[#0f4952] text-white"
                  >
                    Set Active
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedReservation(null)}
                className="btn btn-outline btn-sm"
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
