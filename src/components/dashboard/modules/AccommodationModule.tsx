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
  onModifyReservation?: (
    id: string,
    payload: { checkIn: string; checkOut: string; specialRequests?: string; notes?: string },
  ) => Promise<{ ok: boolean; message: string }>;
  onCancelReservation?: (id: string, reason: string) => Promise<{ ok: boolean; message: string }>;
  onUpdateReservation?: (id: string, updates: Partial<UserAccommodationReservation>) => void;
}

export const AccommodationModule: React.FC<AccommodationModuleProps> = ({
  reservations,
  onOpenBooking,
  onModifyReservation,
  onCancelReservation,
  onUpdateReservation,
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
    let result = { ok: true, message: 'Reservation modification request recorded.' };
    if (onModifyReservation) {
      result = await onModifyReservation(selectedBooking.id, {
        checkIn: modNewCheckIn,
        checkOut: modNewCheckOut,
        specialRequests: modReason.trim() || undefined,
        notes: modReason.trim() || undefined,
      });
    } else if (onUpdateReservation) {
      onUpdateReservation(selectedBooking.id, {
        checkIn: modNewCheckIn,
        checkOut: modNewCheckOut,
      });
    }
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
    let result = { ok: true, message: 'Reservation cancellation processed.' };
    if (onCancelReservation) {
      result = await onCancelReservation(selectedBooking.id, cancelReason.trim());
    } else if (onUpdateReservation) {
      onUpdateReservation(selectedBooking.id, { status: 'cancelled' });
    }
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

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="type-h3 text-[#0f172a]">
              Accommodation Reservations
            </h3>
            <p className="type-body text-slate-500 mt-1">
              View active stays, previous booking history, digital entry instructions, and date changes
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            className="btn btn-primary btn-sm w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Residence</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border type-support flex items-start gap-2.5 ${
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
            <div className="space-y-5">
              {reservations.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="type-support font-semibold text-slate-500">Select Reservation:</span>
                  {reservations.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBookingId(b.id)}
                      className={`px-3.5 py-2 rounded-lg type-btn font-mono cursor-pointer whitespace-nowrap tabular-nums ${
                        b.id === selectedBooking.id
                          ? 'bg-[#0f172a] text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0f172a]'
                      }`}
                    >
                      {b.id} ({b.unitNumber})
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 type-support tabular-nums">
                      <span className="font-mono font-semibold text-slate-600">{selectedBooking.id}</span>
                      <span aria-hidden="true">·</span>
                      <StatusBadge status={selectedBooking.status} size="sm" />
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500">Booked {selectedBooking.bookedAt}</span>
                    </div>
                    <h4 className="type-h3 text-[#0f172a]">
                      {selectedBooking.propertyTitle} ({selectedBooking.unitNumber})
                    </h4>
                    <div className="flex items-center gap-1.5 type-support text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#14616d]" />
                      <span>{selectedBooking.location}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-outline btn-sm shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Summary</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 type-support tabular-nums">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Check-In Date</span>
                    <strong className="type-h4 text-[#0f172a] mt-0.5 block">
                      {selectedBooking.checkIn}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Check-Out Date</span>
                    <strong className="type-h4 text-[#0f172a] mt-0.5 block">
                      {selectedBooking.checkOut}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Total Length</span>
                    <strong className="type-h4 text-[#0f172a] mt-0.5 block">
                      {selectedBooking.totalNights} Nights ({selectedBooking.guestsCount} Guest
                      {selectedBooking.guestsCount > 1 ? 's' : ''})
                    </strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Estimated Total</span>
                    <strong className="type-h4 text-[#14616d] mt-0.5 block">
                      ${selectedBooking.totalUsd.toLocaleString()} USD
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 type-support">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#0f172a]">
                      <Key className="w-4 h-4 text-amber-600" />
                      <span>Smart Lock Entry</span>
                    </div>
                    <p className="font-mono type-support text-slate-600 tabular-nums">
                      {selectedBooking.status === 'confirmed' || selectedBooking.status === 'active'
                        ? selectedBooking.accessCode
                        : 'Issued 24 hours prior to confirmed check-in'}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#0f172a]">
                      <Wifi className="w-4 h-4 text-[#14616d]" />
                      <span>Dedicated Suite Wi-Fi</span>
                    </div>
                    <p className="text-slate-600">
                      Network: <strong className="text-[#0f172a]">{selectedBooking.wifiNetwork}</strong>
                    </p>
                    <p className="text-slate-600 font-mono">
                      Access: {selectedBooking.wifiPassword}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#0f172a]">
                      <MapPin className="w-4 h-4 text-[#14616d]" />
                      <span>Assigned Parking</span>
                    </div>
                    <p className="text-slate-600">{selectedBooking.parkingSpace}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="type-support font-semibold text-[#0f172a] block">Reservation Notes</span>
                    <p className="type-body text-slate-600">{selectedBooking.notes}</p>
                  </div>
                )}

                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModification(selectedBooking)}
                      className="btn btn-outline btn-sm"
                    >
                      Modify Stay Dates
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenCancellation(selectedBooking)}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {subView === 'check-in-details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="type-h4 text-[#0f172a]">
                Arrival &amp; Contactless Check-In (After 3:00 PM)
              </h4>
              <p className="type-body text-slate-600">
                {selectedBooking?.checkInInstructions ||
                  'All Easy Travel Lodging residences feature contactless smart-keypad entry. Your personal keypad code activates at 3:00 PM on your scheduled arrival date.'}
              </p>
              <ul className="space-y-2 type-body text-slate-600 pt-1">
                <li>1. Park in your assigned stall listed on your reservation details.</li>
                <li>2. Enter your 4-digit keypad code followed by # on the residence door lock.</li>
                <li>3. High-speed Wi-Fi credentials and welcome packet are on the kitchen counter.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="type-h4 text-[#0f172a]">
                Departure &amp; Check-Out Procedure (By 11:00 AM)
              </h4>
              <p className="type-body text-slate-600">
                {selectedBooking?.checkOutInstructions ||
                  'Before 11:00 AM on departure day, ensure personal belongings are packed, start the dishwasher if needed, and lock the smart deadbolt upon exit.'}
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 type-support text-[#0f172a]">
                <Phone className="w-4 h-4 text-[#14616d] shrink-0" />
                <span>
                  Need late check-out or stay extension? Call{' '}
                  <strong className="tabular-nums">916-800-3295</strong> or email{' '}
                  <strong>easytravelagency@trustagent.space</strong>.
                </span>
              </div>
            </div>
          </div>
        )}

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
              className="max-w-xl p-6 rounded-2xl border border-slate-200 bg-white space-y-4"
            >
              <div>
                <h4 className="type-h4 text-[#0f172a]">
                  Modify Dates — {selectedBooking.propertyTitle} ({selectedBooking.id})
                </h4>
                <p className="type-body text-slate-600 mt-1">
                  Updated stay dates recalculate nightly or monthly totals automatically on your account.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">New Check-In Date *</label>
                  <input
                    type="date"
                    required
                    value={modNewCheckIn}
                    onChange={(e) => setModNewCheckIn(e.target.value)}
                    className="form-input tabular-nums"
                  />
                </div>
                <div>
                  <label className="form-label">New Check-Out Date *</label>
                  <input
                    type="date"
                    required
                    value={modNewCheckOut}
                    onChange={(e) => setModNewCheckOut(e.target.value)}
                    className="form-input tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Special Requests / Schedule Notes</label>
                <textarea
                  rows={3}
                  value={modReason}
                  onChange={(e) => setModReason(e.target.value)}
                  placeholder="Optional arrival time or stay extension note..."
                  className="form-textarea"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isMutating}
                  className="btn btn-primary btn-sm disabled:opacity-50"
                >
                  {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Updated Dates</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('index')}
                  className="btn btn-outline btn-sm"
                >
                  Back
                </button>
              </div>
            </form>
          ))}

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
              className="max-w-xl p-6 rounded-2xl border border-rose-200 bg-white space-y-4"
            >
              <div>
                <h4 className="type-h4 text-[#0f172a]">
                  Cancel Reservation — {selectedBooking.propertyTitle} ({selectedBooking.id})
                </h4>
                <p className="type-body text-slate-600 mt-1">
                  Cancelling releases {selectedBooking.unitNumber} for {selectedBooking.checkIn} to{' '}
                  {selectedBooking.checkOut}.
                </p>
              </div>

              <div>
                <label className="form-label">Reason for Cancellation (Optional)</label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Let our housing team know if your travel dates changed..."
                  className="form-textarea"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isMutating}
                  className="btn btn-danger btn-sm disabled:opacity-50"
                >
                  {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Confirm Cancellation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('index')}
                  className="btn btn-outline btn-sm"
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
