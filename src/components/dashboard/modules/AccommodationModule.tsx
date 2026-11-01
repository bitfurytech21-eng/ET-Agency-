import React, { useState } from 'react';
import {
  UserAccommodationReservation,
  AccommodationSubView,
} from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { BookingCard } from '../components/BookingCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  Building2,
  Calendar,
  Key,
  Wifi,
  MapPin,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  CheckCircle2,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface AccommodationModuleProps {
  reservations: UserAccommodationReservation[];
  onOpenBooking: () => void;
  onUpdateReservation: (id: string, updates: Partial<UserAccommodationReservation>) => void;
}

export const AccommodationModule: React.FC<AccommodationModuleProps> = ({
  reservations,
  onOpenBooking,
  onUpdateReservation,
}) => {
  const [subView, setSubView] = useState<AccommodationSubView>('index');
  const [selectedBooking, setSelectedBooking] = useState<UserAccommodationReservation | null>(
    reservations[0] || null
  );

  // Form states for modification / cancellation
  const [modNewCheckIn, setModNewCheckIn] = useState('');
  const [modNewCheckOut, setModNewCheckOut] = useState('');
  const [modReason, setModReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'All Stays', fileName: 'index.php', badge: reservations.length },
    { id: 'my-reservations', label: 'Active & Pending', fileName: 'my-reservations.php' },
    { id: 'reservation-details', label: 'Stay Details', fileName: 'reservation-details.php' },
    { id: 'booking-history', label: 'History', fileName: 'booking-history.php' },
    { id: 'check-in-details', label: 'Check-In Info', fileName: 'check-in-details.php' },
    { id: 'check-out-details', label: 'Check-Out Info', fileName: 'check-out-details.php' },
    { id: 'modification-request', label: 'Modify Dates', fileName: 'modification-request.php' },
    { id: 'cancellation-request', label: 'Cancellation', fileName: 'cancellation-request.php' },
  ];

  const activeReservations = reservations.filter(
    (r) => r.status === 'confirmed' || r.status === 'active' || r.status === 'pending'
  );
  const completedReservations = reservations.filter((r) => r.status === 'completed');

  const handleSelectForDetails = (b: UserAccommodationReservation) => {
    setSelectedBooking(b);
    setSubView('reservation-details');
  };

  const handleSelectForModification = (b: UserAccommodationReservation) => {
    setSelectedBooking(b);
    setModNewCheckIn(b.checkIn);
    setModNewCheckOut(b.checkOut);
    setSubView('modification-request');
  };

  const handleSelectForCancellation = (b: UserAccommodationReservation) => {
    setSelectedBooking(b);
    setSubView('cancellation-request');
  };

  const handleConfirmModification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    onUpdateReservation(selectedBooking.id, {
      checkIn: modNewCheckIn,
      checkOut: modNewCheckOut,
      status: 'pending',
    });
    setActionSuccessMsg(
      `Date modification request submitted for ${selectedBooking.propertyTitle}. Host concierge will review within 2 business hours.`
    );
    setTimeout(() => setActionSuccessMsg(null), 5000);
    setSubView('my-reservations');
  };

  const handleConfirmCancellation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    onUpdateReservation(selectedBooking.id, {
      status: 'cancelled',
    });
    setActionSuccessMsg(
      `Cancellation requested for Reservation ${selectedBooking.id}. Refund statement will be credited per policy.`
    );
    setTimeout(() => setActionSuccessMsg(null), 5000);
    setSubView('my-reservations');
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/Accommodation/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as AccommodationSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6">
        {actionSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 1. All Stays (index.php) */}
        {subView === 'index' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#282828]">
                  Accommodation Reservations Directory (index.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Your reserved furnished residences across our nationwide agency network.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
              >
                + Book Additional Suite
              </button>
            </div>

            {reservations.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No Accommodation Stays Found"
                description="You currently have no reserved furnished apartments or executive suites."
                actionText="Explore Available Residences"
                onAction={onOpenBooking}
              />
            ) : (
              <div className="space-y-4">
                {reservations.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onViewDetails={handleSelectForDetails}
                    onRequestModification={handleSelectForModification}
                    onRequestCancellation={handleSelectForCancellation}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. My Reservations (my-reservations.php) */}
        {subView === 'my-reservations' && (
          <div className="space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Active &amp; Upcoming Residences (my-reservations.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Confirmed stays ready for move-in, check-in instructions, and keyless smart door locks.
              </p>
            </div>

            {activeReservations.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No Active Reservations"
                description="You have no stays currently scheduled or active."
                actionText="Reserve Now"
                onAction={onOpenBooking}
              />
            ) : (
              <div className="space-y-4">
                {activeReservations.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onViewDetails={handleSelectForDetails}
                    onRequestModification={handleSelectForModification}
                    onRequestCancellation={handleSelectForCancellation}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Stay Details (reservation-details.php) */}
        {subView === 'reservation-details' && selectedBooking && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e6dfd5] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#82634f] bg-[#faf8f5] px-2.5 py-1 rounded-lg border border-[#e6dfd5]">
                    {selectedBooking.id}
                  </span>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <h3 className="text-2xl font-heading font-black text-[#282828] mt-2">
                  {selectedBooking.propertyTitle} — Unit {selectedBooking.unitNumber}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#5c5046] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00b7a8]" />
                  <span>{selectedBooking.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl border border-[#d8cfc3] hover:bg-[#faf8f5] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Stay Packet</span>
                </button>
              </div>
            </div>

            {/* In-Stay Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#857568] flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-600" /> Smart-Lock Door PIN
                </span>
                <span className="font-mono text-xl font-black text-[#282828] block">
                  {selectedBooking.accessCode || 'Pending Issue'}
                </span>
                <p className="text-[11px] text-[#5c5046]">
                  Enter 4-digit PIN followed by # on keypad.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#857568] flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-[#00b7a8]" /> High-Speed Wi-Fi
                </span>
                <span className="text-sm font-bold text-[#282828] block">
                  {selectedBooking.wifiNetwork}
                </span>
                <p className="text-[11px] font-mono text-[#5c5046]">
                  Pass: <strong>{selectedBooking.wifiPassword}</strong> (400+ Mbps)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#857568] flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#82634f]" /> Reserved Parking Space
                </span>
                <span className="text-sm font-bold text-[#282828] block">
                  Space #{selectedBooking.parkingSpace}
                </span>
                <p className="text-[11px] text-[#5c5046]">Covered bay directly adjacent to breezeway.</p>
              </div>
            </div>

            {/* Check-In / Check-Out instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#5c5046] leading-relaxed">
              <div className="p-5 bg-white border border-[#efe9e0] rounded-2xl space-y-2">
                <h5 className="font-heading font-bold text-sm text-[#282828] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00b7a8]" /> Check-In Instructions (2:00 PM)
                </h5>
                <p>{selectedBooking.checkInInstructions}</p>
              </div>

              <div className="p-5 bg-white border border-[#efe9e0] rounded-2xl space-y-2">
                <h5 className="font-heading font-bold text-sm text-[#282828] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#82634f]" /> Departure Checklist (11:00 AM)
                </h5>
                <p>{selectedBooking.checkOutInstructions}</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Booking History (booking-history.php) */}
        {subView === 'booking-history' && (
          <div className="space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Past Booking History (booking-history.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Review completed stays, download past receipts, or re-book favourite residences.
              </p>
            </div>

            {completedReservations.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No Completed Stays Yet"
                description="Past concluded leases and stays will appear in this archive."
              />
            ) : (
              <div className="space-y-4">
                {completedReservations.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onViewDetails={handleSelectForDetails}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Check-In Details (check-in-details.php) */}
        {subView === 'check-in-details' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Arrival &amp; Move-In Protocol (check-in-details.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Everything you need for an effortless, contactless move-in from 2:00 PM on arrival day.
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#5c5046] leading-relaxed">
              <div className="p-4 bg-[#faf8f5] rounded-xl border border-[#efe9e0] space-y-2">
                <span className="font-bold text-[#282828] text-sm block">1. Keyless Digital Smart Door Lock</span>
                <p>
                  No key pickup required. Touch the keypad to illuminate numbers, type your 4-digit PIN followed by the checkmark (#) key. Wait for the green chime and handle rotation.
                </p>
              </div>

              <div className="p-4 bg-[#faf8f5] rounded-xl border border-[#efe9e0] space-y-2">
                <span className="font-bold text-[#282828] text-sm block">2. High-Speed 400+ Mbps Wi-Fi</span>
                <p>
                  Your network credentials are posted on the kitchen counter credenza welcome stand and inside your client portal. Connect laptops, smartphones, and smart TVs instantly with zero sign-in portals.
                </p>
              </div>

              <div className="p-4 bg-[#faf8f5] rounded-xl border border-[#efe9e0] space-y-2">
                <span className="font-bold text-[#282828] text-sm block">3. Starter Amenities &amp; Kitchen Basics</span>
                <p>
                  All residences are stocked with fresh Keurig pods, premium teas, dishwasher tablets, hypoallergenic laundry detergent, paper products, and hotel-grade bath linens.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. Check-Out Details (check-out-details.php) */}
        {subView === 'check-out-details' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Check-Out &amp; Departure Checklist (check-out-details.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Simple steps before departure at 11:00 AM on your scheduled move-out day.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#5c5046]">
              <div className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0]">
                <CheckCircle2 className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#282828]">Trash &amp; Disposals:</strong> Please bag kitchen trash and place in the courtyard bins.
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0]">
                <CheckCircle2 className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#282828]">Linens &amp; Towels:</strong> Leave used bath towels in the bathroom hamper; no need to strip bed sheets.
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0]">
                <CheckCircle2 className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#282828]">Thermostat &amp; Appliances:</strong> Set thermostat to 72°F and verify oven/stove are powered off.
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0]">
                <CheckCircle2 className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#282828]">Lock Door:</strong> Close door firmly and press the lock symbol on the smart keypad.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. Modification Request (modification-request.php) */}
        {subView === 'modification-request' && selectedBooking && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Request Stay Modification (modification-request.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Adjust arrival/departure dates or extend your current residence lease.
              </p>
            </div>

            <form onSubmit={handleConfirmModification} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Residence</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedBooking.propertyTitle} (Unit ${selectedBooking.unitNumber})`}
                  className="w-full h-10 px-3 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">New Move-In Date</label>
                  <input
                    type="date"
                    required
                    value={modNewCheckIn}
                    onChange={(e) => setModNewCheckIn(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">New Move-Out Date</label>
                  <input
                    type="date"
                    required
                    value={modNewCheckOut}
                    onChange={(e) => setModNewCheckOut(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Reason for Adjustment</label>
                <textarea
                  rows={3}
                  value={modReason}
                  onChange={(e) => setModReason(e.target.value)}
                  placeholder="e.g., Project extended by two weeks, delayed closing on new home..."
                  className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubView('my-reservations')}
                  className="px-4 py-2 rounded-xl border border-[#d8cfc3] text-[#5c5046] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl shadow-2xs"
                >
                  Submit Modification
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 8. Cancellation Request (cancellation-request.php) */}
        {subView === 'cancellation-request' && selectedBooking && (
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto shadow-xs">
            <div className="border-b border-rose-100 pb-4">
              <h3 className="font-heading font-bold text-lg text-rose-900">
                Submit Cancellation Request (cancellation-request.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Notice for cancelling reservation #{selectedBooking.id} per policy guidelines.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Refund &amp; Cancellation Policy:</span>
              <p>
                Full refund or 100% Lodging Units re-credit if cancelled 14+ days before move-in. For emergency changes within 14 days, contact concierge desk directly for waiver review.
              </p>
            </div>

            <form onSubmit={handleConfirmCancellation} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Reason for Cancellation</label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please let us know the reason so we can best assist..."
                  className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubView('my-reservations')}
                  className="px-4 py-2 rounded-xl border border-[#d8cfc3] text-[#5c5046] font-semibold"
                >
                  Keep Reservation
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-2xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
