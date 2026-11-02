import React, { useEffect, useState } from 'react';
import {
  UserCarRentalBooking,
  UserDriverInfo,
  CarRentalsSubView,
} from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { VehicleCard } from '../components/VehicleCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  Car,
  Calendar,
  MapPin,
  ShieldCheck,
  User,
  Printer,
  CheckCircle2,
  AlertCircle,
  Key,
  Loader2,
  PlusCircle,
} from 'lucide-react';

interface CarRentalsModuleProps {
  rentals: UserCarRentalBooking[];
  driverInfo: UserDriverInfo;
  onExploreFleet: () => void;
  onSaveDriverInfo: (info: UserDriverInfo) => Promise<{ ok: boolean; message: string }>;
  onModifyRental: (
    id: string,
    payload: { pickupDate: string; returnDate: string; pickupLocation: string; notes?: string },
  ) => Promise<{ ok: boolean; message: string }>;
  onCancelRental: (id: string, reason: string) => Promise<{ ok: boolean; message: string }>;
}

export const CarRentalsModule: React.FC<CarRentalsModuleProps> = ({
  rentals,
  driverInfo,
  onExploreFleet,
  onSaveDriverInfo,
  onModifyRental,
  onCancelRental,
}) => {
  const [subView, setSubView] = useState<CarRentalsSubView>('index');
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(rentals[0]?.id || null);

  const [modPickupDate, setModPickupDate] = useState('');
  const [modReturnDate, setModReturnDate] = useState('');
  const [modPickupLoc, setModPickupLoc] = useState('');
  const [modNotes, setModNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const [driverName, setDriverName] = useState(driverInfo.primaryDriver);
  const [driverLicense, setDriverLicense] = useState(driverInfo.licenseNumber);
  const [driverState, setDriverState] = useState(driverInfo.issuingState || 'CA');

  const [isMutating, setIsMutating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  useEffect(() => {
    setDriverName(driverInfo.primaryDriver);
    setDriverLicense(driverInfo.licenseNumber);
    setDriverState(driverInfo.issuingState || 'CA');
  }, [driverInfo]);

  useEffect(() => {
    if (!selectedRentalId && rentals.length > 0) {
      setSelectedRentalId(rentals[0].id);
    } else if (
      selectedRentalId &&
      rentals.length > 0 &&
      !rentals.some((r) => r.id === selectedRentalId)
    ) {
      setSelectedRentalId(rentals[0].id);
    }
  }, [rentals, selectedRentalId]);

  const selectedRental = rentals.find((r) => r.id === selectedRentalId) || rentals[0] || null;

  const activeList = rentals.filter(
    (r) => r.status === 'confirmed' || r.status === 'active' || r.status === 'pending',
  );
  const historyList = rentals.filter(
    (r) => r.status === 'completed' || r.status === 'cancelled',
  );

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'All Reservations', badge: rentals.length },
    { id: 'my-rentals', label: 'Active & Upcoming', badge: activeList.length },
    { id: 'rental-history', label: 'Rental History', badge: historyList.length },
    { id: 'rental-details', label: 'Reservation Details' },
    { id: 'pickup-details', label: 'Pickup & Return Guide' },
    { id: 'driver-information', label: 'Driver Profile' },
    { id: 'modification-request', label: 'Modify Reservation' },
    { id: 'cancellation-request', label: 'Cancel Reservation' },
  ];

  const handleOpenDetails = (rental: UserCarRentalBooking) => {
    setSelectedRentalId(rental.id);
    setFeedback(null);
    setSubView('rental-details');
  };

  const handleOpenModify = (rental: UserCarRentalBooking) => {
    setSelectedRentalId(rental.id);
    setModPickupDate(rental.pickupDate);
    setModReturnDate(rental.returnDate);
    setModPickupLoc(rental.pickupLocation);
    setModNotes(rental.notes || '');
    setFeedback(null);
    setSubView('modification-request');
  };

  const handleOpenCancel = (rental: UserCarRentalBooking) => {
    setSelectedRentalId(rental.id);
    setCancelReason('');
    setFeedback(null);
    setSubView('cancellation-request');
  };

  const submitDriverProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMutating(true);
    setFeedback(null);
    const res = await onSaveDriverInfo({
      primaryDriver: driverName.trim(),
      licenseNumber: driverLicense.trim(),
      issuingState: driverState.trim() || 'CA',
    });
    setIsMutating(false);
    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
  };

  const submitModifyRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;
    if (!modPickupDate || !modReturnDate || new Date(modReturnDate) <= new Date(modPickupDate)) {
      setFeedback({ type: 'error', message: 'Return date must be after pickup date.' });
      return;
    }
    setIsMutating(true);
    setFeedback(null);
    const res = await onModifyRental(selectedRental.id, {
      pickupDate: modPickupDate,
      returnDate: modReturnDate,
      pickupLocation: modPickupLoc.trim() || selectedRental.pickupLocation,
      notes: modNotes.trim() || undefined,
    });
    setIsMutating(false);
    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
    if (res.ok) {
      setSubView('rental-details');
    }
  };

  const submitCancelRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;
    setIsMutating(true);
    setFeedback(null);
    const res = await onCancelRental(selectedRental.id, cancelReason.trim());
    setIsMutating(false);
    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
    if (res.ok) {
      setCancelReason('');
      setSubView('rental-history');
    }
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => {
          setFeedback(null);
          setSubView(id as CarRentalsSubView);
        }}
      />

      <div className="px-4 sm:px-8 pb-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828]">
              Car Rental Reservations
            </h3>
            <p className="text-xs text-[#6e5d50]">
              Manage vehicle reservations, airport or residence delivery, and primary driver credentials
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreFleet}
            className="px-4 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Reserve a Vehicle</span>
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

        {/* All Reservations */}
        {subView === 'index' &&
          (rentals.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No car rental reservations yet"
              description="You have not reserved any vehicles from our fleet yet. Explore SUVs, sedans, and trucks available for airport or residence delivery."
              actionText="Browse Car Rentals"
              onAction={onExploreFleet}
            />
          ) : (
            <div className="space-y-4">
              {rentals.map((rental) => (
                <VehicleCard
                  key={rental.id}
                  rental={rental}
                  onViewDetails={handleOpenDetails}
                  onRequestModification={handleOpenModify}
                  onRequestCancellation={handleOpenCancel}
                />
              ))}
            </div>
          ))}

        {/* Active & Upcoming */}
        {subView === 'my-rentals' &&
          (activeList.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No active or upcoming car rentals"
              description="You do not currently have any active or upcoming fleet reservations."
              actionText="Reserve a Vehicle"
              onAction={onExploreFleet}
            />
          ) : (
            <div className="space-y-4">
              {activeList.map((rental) => (
                <VehicleCard
                  key={rental.id}
                  rental={rental}
                  onViewDetails={handleOpenDetails}
                  onRequestModification={handleOpenModify}
                  onRequestCancellation={handleOpenCancel}
                />
              ))}
            </div>
          ))}

        {/* Rental History */}
        {subView === 'rental-history' &&
          (historyList.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No past car rental history"
              description="Completed and cancelled car rental reservations will appear here."
            />
          ) : (
            <div className="space-y-4">
              {historyList.map((rental) => (
                <VehicleCard
                  key={rental.id}
                  rental={rental}
                  onViewDetails={handleOpenDetails}
                />
              ))}
            </div>
          ))}

        {/* Reservation Details */}
        {subView === 'rental-details' &&
          (!selectedRental ? (
            <EmptyState
              icon={Car}
              title="No vehicle reservation selected"
              description="Reserve a fleet vehicle first to inspect handover details and pricing."
              actionText="Explore Fleet"
              onAction={onExploreFleet}
            />
          ) : (
            <div className="space-y-5">
              {rentals.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[#6e5d50]">Select Reservation:</span>
                  {rentals.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRentalId(r.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer whitespace-nowrap tabular-nums ${
                        r.id === selectedRental.id
                          ? 'bg-[#282828] text-white'
                          : 'bg-[#faf8f5] border border-[#d8cfc3] text-[#5c5046]'
                      }`}
                    >
                      {r.id} ({r.vehicleName})
                    </button>
                  ))}
                </div>
              )}

              <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e6dfd5] pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                      <span className="font-mono font-bold text-[#82634f]">{selectedRental.id}</span>
                      <span aria-hidden="true">·</span>
                      <StatusBadge status={selectedRental.status} size="sm" />
                    </div>
                    <h4 className="font-heading font-black text-xl text-[#282828]">
                      {selectedRental.year} {selectedRental.vehicleName}
                    </h4>
                    <p className="text-xs text-[#5c5046]">
                      {selectedRental.category} · Exterior Finish: {selectedRental.colorName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#d8cfc3] hover:border-[#00b7a8] text-xs font-bold text-[#282828] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#82634f]" />
                    <span>Print Voucher</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs tabular-nums">
                  <div className="p-3.5 bg-white rounded-xl border border-[#efe9e0]">
                    <span className="text-[#857568] block">Pickup Date</span>
                    <strong className="text-sm text-[#282828] mt-0.5 block">
                      {selectedRental.pickupDate}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[#efe9e0]">
                    <span className="text-[#857568] block">Return Date</span>
                    <strong className="text-sm text-[#282828] mt-0.5 block">
                      {selectedRental.returnDate}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[#efe9e0]">
                    <span className="text-[#857568] block">Rental Duration</span>
                    <strong className="text-sm text-[#282828] mt-0.5 block">
                      {selectedRental.totalDays} Days
                    </strong>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[#efe9e0]">
                    <span className="text-[#857568] block">Total Amount</span>
                    <strong className="text-sm text-[#00897d] mt-0.5 block">
                      ${selectedRental.totalUsd.toLocaleString()} USD
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-[#efe9e0] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#282828]">
                      <MapPin className="w-4 h-4 text-[#00897d]" />
                      <span>Delivery &amp; Return Location</span>
                    </div>
                    <p className="text-[#5c5046]">{selectedRental.pickupLocation}</p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#efe9e0] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#282828]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Coverage Plan</span>
                    </div>
                    <p className="text-[#5c5046]">
                      {selectedRental.protectionPlan === 'executive_shield'
                        ? 'Zero-Deductible Protection Shield'
                        : 'Standard Comprehensive Coverage'}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#efe9e0] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#282828]">
                      <Key className="w-4 h-4 text-amber-600" />
                      <span>Handover Reference</span>
                    </div>
                    <p className="font-mono text-[#5c5046] tabular-nums">
                      {selectedRental.handoverCode}
                    </p>
                  </div>
                </div>

                {selectedRental.status !== 'cancelled' && selectedRental.status !== 'completed' && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModify(selectedRental)}
                      className="px-4 py-2 rounded-xl border border-[#d8cfc3] bg-white hover:bg-[#f4efe9] text-xs font-bold text-[#282828] cursor-pointer whitespace-nowrap"
                    >
                      Modify Dates / Location
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenCancel(selectedRental)}
                      className="px-4 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-xs font-bold text-rose-700 cursor-pointer whitespace-nowrap"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Pickup & Return Guide */}
        {subView === 'pickup-details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-3">
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Concierge Vehicle Delivery &amp; Handover
              </h4>
              <p className="text-[#5c5046] leading-relaxed">
                Vehicles can be delivered directly to your Easy Travel Lodging residence stall or Sacramento International Airport (SMF) terminal arrival curb.
              </p>
              <ul className="space-y-2 text-[#5c5046]">
                <li>1. Have your valid driver&apos;s license ready for handover verification.</li>
                <li>2. Vehicles are delivered detailed and fueled at 100% capacity.</li>
                <li>3. Keep your handover code accessible inside your dashboard.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-3">
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Return &amp; Inspection Protocol
              </h4>
              <p className="text-[#5c5046] leading-relaxed">
                Park the vehicle in your residence&apos;s assigned space or coordinate terminal drop-off with our fleet desk at{' '}
                <strong className="tabular-nums">916-800-3295</strong> or{' '}
                <strong>easytravelagency@trustagent.space</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Driver Profile */}
        {subView === 'driver-information' && (
          <form
            onSubmit={submitDriverProfile}
            className="max-w-xl p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#00897d]" />
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Primary Driver Credentials
              </h4>
            </div>
            <p className="text-xs text-[#6e5d50]">
              Saved to your personal profile to streamline future fleet handovers.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#282828] mb-1">
                Primary Driver Full Name *
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Driver&apos;s License Number
                </label>
                <input
                  type="text"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder="Enter license number"
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Issuing State / Region
                </label>
                <input
                  type="text"
                  value={driverState}
                  onChange={(e) => setDriverState(e.target.value)}
                  placeholder="CA"
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isMutating}
              className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Driver Profile</span>
            </button>
          </form>
        )}

        {/* Modify Reservation */}
        {subView === 'modification-request' &&
          (!selectedRental || selectedRental.status === 'cancelled' ? (
            <EmptyState
              icon={Calendar}
              title="No modifiable vehicle reservation selected"
              description="Select an active or pending car rental reservation to adjust dates or delivery location."
            />
          ) : (
            <form
              onSubmit={submitModifyRental}
              className="max-w-xl p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4"
            >
              <div>
                <h4 className="font-heading font-bold text-base text-[#282828]">
                  Modify Rental — {selectedRental.vehicleName} ({selectedRental.id})
                </h4>
                <p className="text-xs text-[#6e5d50] mt-0.5">
                  Adjust pickup/return dates or delivery location. Rates automatically recalculate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={modPickupDate}
                    onChange={(e) => setModPickupDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={modReturnDate}
                    onChange={(e) => setModReturnDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Delivery / Handover Location *
                </label>
                <input
                  type="text"
                  required
                  value={modPickupLoc}
                  onChange={(e) => setModPickupLoc(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Flight / Handover Notes
                </label>
                <textarea
                  rows={2}
                  value={modNotes}
                  onChange={(e) => setModNotes(e.target.value)}
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
                  <span>Save Rental Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('index')}
                  className="px-4 py-2.5 rounded-xl border border-[#d8cfc3] bg-white text-xs font-semibold text-[#5c5046] cursor-pointer whitespace-nowrap"
                >
                  Back
                </button>
              </div>
            </form>
          ))}

        {/* Cancel Reservation */}
        {subView === 'cancellation-request' &&
          (!selectedRental || selectedRental.status === 'cancelled' ? (
            <EmptyState
              icon={Car}
              title="No active rental selected for cancellation"
              description="Select a confirmed or pending car rental reservation if you need to cancel."
            />
          ) : (
            <form
              onSubmit={submitCancelRental}
              className="max-w-xl p-6 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-4"
            >
              <div>
                <h4 className="font-heading font-bold text-base text-[#282828]">
                  Cancel Vehicle Reservation — {selectedRental.vehicleName} ({selectedRental.id})
                </h4>
                <p className="text-xs text-[#5c5046] mt-0.5">
                  Cancelling releases the vehicle from {selectedRental.pickupDate} to{' '}
                  {selectedRental.returnDate}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Cancellation Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Optional reason or schedule update..."
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
                  className="px-4 py-2.5 rounded-xl border border-[#d8cfc3] bg-white text-xs font-semibold text-[#5c5046] cursor-pointer whitespace-nowrap"
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
