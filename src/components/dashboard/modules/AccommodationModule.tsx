import React, { useEffect, useState } from 'react';
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
  Printer,
  AlertCircle,
  CheckCircle2,
  Phone,
  Loader2,
  PlusCircle,
} from 'lucide-react';

interface AccommodationModuleProps {
  reservations: UserAccommodationReservation[];
  onOpenBooking: () => void;
  onModifyReservation: (
    id: string,
    payload: { checkIn: string; checkOut: string; specialRequests?: string; notes?: string },
  ) => Promise<{ ok: boolean; message: string }>;
  onCancelReservation: (id: string, reason: string) => Promise<{ ok: boolean; message: string }>;
}

export const AccommodationModule: React.FC<AccommodationModuleProps> = ({
  reservations,
  onOpenBooking,
  onModifyReservation,
  onCancelReservation,
}) => {
  const [subView, setSubView] = useState<AccommodationSubView>('index');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    reservations[0]?.id || null,
  );

  const [modNewCheckIn, setModNewCheckIn] = useState('');
  const [modNewCheckOut, setModNewCheckOut] = useState('');
  const [modReason, setModReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isMutating, setIsMutating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (!selectedBookingId && reservations.length > 0) {
      setSelectedBookingId(reservations[0].id);
    } else if (
      selectedBookingId &&
      reservations.length > 0 &&
      !reservations.some((r) => r.id === selectedBookingId)
    ) {
      setSelectedBookingId(reservations[0].id);
    }
  }, [reservations, selectedBookingId]);

  const selectedBooking =
    reservations.find((r) => r.id === selectedBookingId) || reservations[0] || null;

  const activeList = reservations.filter(
    (r) => r.status === 'confirmed' || r.status === 'pending' || r.status === 'active',
  );
  const historyList = reservations.filter(
    (r) => r.status === 'completed' || r.status === 'cancelled',
  );

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'All Stays', badge: reservations.length },
    { id: 'my-reservations', label: 'Active & Upcoming', badge: activeList.length },
    { id: 'booking-history', label: 'Previous History', badge: historyList.length },
    { id: 'reservation-details', label: 'Stay Details' },
    { id: 'check-in-details', label: 'Check-In & Check-Out Guide' },
    { id: 'modification-request', label: 'Modify Dates' },
    { id: 'cancellation-request', label: 'Cancel Stay' },
  ];

  const handleOpenDetails = (booking: UserAccommodationReservation) => {
    setSelectedBookingId(booking.id);
    setFeedback(null);
    setSubView('reservation-details');
  };

  const handleOpenModification = (booking: UserAccommodationReservation) => {
    setSelectedBookingId(booking.id);
    setModNewCheckIn(booking.checkIn);
    setModNewCheckOut(booking.checkOut);
    setModReason(booking.specialRequests || '');
    setFeedback(null);
    setSubView('modification-request');
  };

  const handleOpenCancellation = (booking: UserAccommodationReservation) => {
    setSelectedBookingId(booking.id);
    setCancelReason('');
    setFeedback(null);
    setSubView('cancellation-request');
  };

  const submitModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!modNewCheckIn || !modNewCheckOut || new Date(modNewCheckOut) <= new Date(modNewCheckIn)) {
      setFeedback({
        type: 'error',
        message: 'Check-out date must be after your check-in date.',
      });
      return;
    }

    setIsMutating(true);
    setFeedback(null);
    const result = await onModifyReservation(selectedBooking.id, {
      checkIn: modNewCheckIn,
      checkOut: modNewCheckOut,
      specialRequests: modReason.trim() || undefined,
      notes: modReason.trim() || undefined,
    });
    setIsMutating(false);

    setFeedback({
      type: result.ok ? 'success' : 'error',
      message: result.message,
    });
    if (result.ok) {
      setSubView('reservation-details');
    }
  };

  const submitCancellation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsMutating(true);
    setFeedback(null);
    const result = await onCancelReservation(selectedBooking.id, cancelReason.trim());
    setIsMutating(false);

    setFeedback({
      type: result.ok ? 'success' : 'error',
      message: result.message,
    });
    if (result.ok) {
      setCancelReason('');
      setSubView('booking-history');
    }
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => {
          setFeedback(null);
          setSubView(id as AccommodationSubView);
        }}
      />

      <div className="px-4 sm:px-8 pb-6 space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828]">
              Accommodation Reservations
            </h3>
            <p className="text-xs text-[#6e5d50]">
              View active stays, previous booking history, digital entry instructions, and date changes
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="px-4 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Residence</span>
          </button>
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

        {/* All Stays */}
        {subView === 'index' &&
          (reservations.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No accommodation bookings yet"
              description="You have not booked any furnished residences yet. Browse our 1- and 2-bedroom residences to schedule your stay."
              actionText="Browse Residences"
              onAction={onOpenBooking}
            />
          ) : (
            <div className="space-y-4">
              {reservations.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onViewDetails={handleOpenDetails}
                  onRequestModification={handleOpenModification}
                  onRequestCancellation={handleOpenCancellation}
                />
              ))}
            </div>
          ))}

        {/* Active & Upcoming */}
        {subView === 'my-reservations' &&
          (activeList.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No active or upcoming stays"
              description="You have no active or upcoming residence reservations at this time."
              actionText="Book a Residence"
              onAction={onOpenBooking}
            />
          ) : (
            <div className="space-y-4">
              {activeList.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onViewDetails={handleOpenDetails}
                  onRequestModification={handleOpenModification}
                  onRequestCancellation={handleOpenCancellation}
                />
              ))}
            </div>
          ))}

        {/* Previous Booking History */}
        {subView === 'booking-history' &&
          (historyList.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No previous booking history"
              description="Completed and cancelled residence stays will be archived here for your records."
            />
          ) : (
            <div className="space-y-4">
              {historyList.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onViewDetails={handleOpenDetails}
                />
              ))}
            </div>
          ))}

        {/* Stay Details */}
        {subView === 'reservation-details' &&
          (!selectedBooking ? (
            <EmptyState
              icon={Building2}
              title="No reservation selected"
              description="Book a residence first to view detailed stay credentials and arrival instructions."
              actionText="Book a Residence"
              onAction={onOpenBooking}
            />
          ) : (
            <div className="space-y-6">
              {reservations.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[#6e5d50]">Select Reservation:</span>
                  {reservations.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBookingId(b.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer whitespace-nowrap tabular-nums ${
                        b.id === selectedBooking.id
                          ? 'bg-[#282828] text-white'
                          : 'bg-[#faf8f5] border border-[#d8cfc3] text-[#5c5046] hover:text-[#282828]'
                      }`}
                    >
                      {b.id} ({b.unitNumber})
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e6dfd5] pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                      <span className="font-mono font-bold text-[#82634f]">{selectedBooking.id}</span>
                      <span aria-hidden="true">·</span>
                      <StatusBadge status={selectedBooking.status} size="sm" />
                      <span aria-hidden="true">·</span>
                      <span className="text-[#6e5d50]">Booked {selectedBooking.bookedAt}</span>
                    </div>
                    <h4 className="font-heading font-black text-xl text-[#282828]">
                      {selectedBooking.propertyTitle} ({selectedBooking.unitNumber})
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-[#5c5046]">
                      <MapPin className="w-3.5 h-3.5 text-[#00897d]" />
                      <span>{selectedBooking.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#d8cfc3] hover:border-[#00b7a8] text-xs font-bold text-[#282828] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#82634f]" />
                      <span>Print Summary</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs tabular-nums">
                  <div className="p-3.5 bg-white rounded-xl border border-[#efe9e0]">
                    <span className="text-[#857568] block">Check-In Date</span>
                    <strong className="text-sm text-[#282828] mt-0.5 block">
                      {selectedBooking.checkIn}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[#efe9e0]">
                    <span className="text-[#857568] block">Check-Out Date</span>
                    <strong className="text-sm text-[#282828] mt-0.5 block">
                      {selectedBooking.checkOut}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[#efe9e0]">
                    <span className="text-[#857568] block">Total Length</span>
                    <strong className="text-sm text-[#282828] mt-0.5 block">
                      {selectedBooking.totalNights} Nights ({selectedBooking.guestsCount} Guest
                      {selectedBooking.guestsCount > 1 ? 's' : ''})
                    </strong>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[#efe9e0]">
                    <span className="text-[#857568] block">Estimated Total</span>
                    <strong className="text-sm text-[#00897d] mt-0.5 block">
                      ${selectedBooking.totalUsd.toLocaleString()} USD
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-[#efe9e0] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#282828]">
                      <Key className="w-4 h-4 text-amber-600" />
                      <span>Smart Lock Entry</span>
                    </div>
                    <p className="font-mono text-xs text-[#5c5046] tabular-nums">
                      {selectedBooking.status === 'confirmed' || selectedBooking.status === 'active'
                        ? selectedBooking.accessCode
                        : 'Issued 24 hours prior to confirmed check-in'}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#efe9e0] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#282828]">
                      <Wifi className="w-4 h-4 text-[#00b7a8]" />
                      <span>Dedicated Suite Wi-Fi</span>
                    </div>
                    <p className="text-[#5c5046]">
                      Network: <strong>{selectedBooking.wifiNetwork}</strong>
                    </p>
                    <p className="text-[#5c5046] font-mono">
                      Access: {selectedBooking.wifiPassword}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#efe9e0] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#282828]">
                      <MapPin className="w-4 h-4 text-[#82634f]" />
                      <span>Assigned Parking</span>
                    </div>
                    <p className="text-[#5c5046]">{selectedBooking.parkingSpace}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-4 bg-white rounded-xl border border-[#efe9e0] text-xs space-y-1">
                    <span className="font-bold text-[#282828] block">Reservation Notes</span>
                    <p className="text-[#5c5046]">{selectedBooking.notes}</p>
                  </div>
                )}

                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModification(selectedBooking)}
                      className="px-4 py-2 rounded-xl border border-[#d8cfc3] bg-white hover:bg-[#f4efe9] text-xs font-bold text-[#282828] cursor-pointer whitespace-nowrap"
                    >
                      Modify Stay Dates
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenCancellation(selectedBooking)}
                      className="px-4 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-xs font-bold text-rose-700 cursor-pointer whitespace-nowrap"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Check-In & Check-Out Guide */}
        {subView === 'check-in-details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-3">
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Arrival &amp; Contactless Check-In (After 3:00 PM)
              </h4>
              <p className="text-[#5c5046] leading-relaxed">
                {selectedBooking?.checkInInstructions ||
                  'All Easy Travel Lodging residences feature contactless smart-keypad entry. Your personal keypad code activates at 3:00 PM on your scheduled arrival date.'}
              </p>
              <ul className="space-y-2 text-[#5c5046] pt-1">
                <li>1. Park in your assigned stall listed on your reservation details.</li>
                <li>2. Enter your 4-digit keypad code followed by # on the residence door lock.</li>
                <li>3. High-speed Wi-Fi credentials and welcome packet are on the kitchen counter.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-3">
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Departure &amp; Check-Out Procedure (By 11:00 AM)
              </h4>
              <p className="text-[#5c5046] leading-relaxed">
                {selectedBooking?.checkOutInstructions ||
                  'Before 11:00 AM on departure day, ensure personal belongings are packed, start the dishwasher if needed, and lock the smart deadbolt upon exit.'}
              </p>
              <div className="pt-2 border-t border-[#e6dfd5] flex items-center gap-2 text-[#282828]">
                <Phone className="w-4 h-4 text-[#00897d]" />
                <span>
                  Need late check-out or stay extension? Call{' '}
                  <strong className="tabular-nums">916-800-3295</strong> or email{' '}
                  <strong>easytravelagency@trustagent.space</strong>.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modify Stay Dates */}
        {subView === 'modification-request' &&
          (!selectedBooking || selectedBooking.status === 'cancelled' ? (
            <EmptyState
              icon={Calendar}
              title="No modifiable reservation selected"
              description="Select an active or pending accommodation stay to update your check-in or check-out dates."
            />
          ) : (
            <form
              onSubmit={submitModification}
              className="max-w-xl p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4"
            >
              <div>
                <h4 className="font-heading font-bold text-base text-[#282828]">
                  Modify Dates — {selectedBooking.propertyTitle} ({selectedBooking.id})
                </h4>
                <p className="text-xs text-[#6e5d50] mt-0.5">
                  Updated stay dates recalculate nightly or monthly totals automatically on your account.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    New Check-In Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={modNewCheckIn}
                    onChange={(e) => setModNewCheckIn(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    New Check-Out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={modNewCheckOut}
                    onChange={(e) => setModNewCheckOut(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Special Requests / Schedule Notes
                </label>
                <textarea
                  rows={3}
                  value={modReason}
                  onChange={(e) => setModReason(e.target.value)}
                  placeholder="Optional arrival time or stay extension note..."
                  className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isMutating}
                  className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Updated Dates</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('index')}
                  className="px-4 py-2.5 rounded-xl border border-[#d8cfc3] bg-white text-xs font-semibold text-[#5c5046] hover:text-[#282828] cursor-pointer whitespace-nowrap"
                >
                  Back
                </button>
              </div>
            </form>
          ))}

        {/* Cancel Stay */}
        {subView === 'cancellation-request' &&
          (!selectedBooking || selectedBooking.status === 'cancelled' ? (
            <EmptyState
              icon={Building2}
              title="No active stay selected for cancellation"
              description="Select a confirmed or pending reservation if you need to cancel an upcoming stay."
            />
          ) : (
            <form
              onSubmit={submitCancellation}
              className="max-w-xl p-6 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-4"
            >
              <div>
                <h4 className="font-heading font-bold text-base text-[#282828]">
                  Cancel Reservation — {selectedBooking.propertyTitle} ({selectedBooking.id})
                </h4>
                <p className="text-xs text-[#5c5046] mt-0.5">
                  Cancelling will release {selectedBooking.unitNumber} for the dates {selectedBooking.checkIn} to{' '}
                  {selectedBooking.checkOut}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Let our housing team know if your travel dates changed..."
                  className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isMutating}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Confirm Cancellation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('index')}
                  className="px-4 py-2.5 rounded-xl border border-[#d8cfc3] bg-white text-xs font-semibold text-[#5c5046] hover:text-[#282828] cursor-pointer whitespace-nowrap"
                >
                  Keep Reservation
                </button>
              </div>
            </form>
          ))}
      </div>
    </div>
  );
};
