import React, { useState } from 'react';
import {
  UserCarRentalBooking,
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
  Clock,
  Printer,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Key,
} from 'lucide-react';

interface CarRentalsModuleProps {
  rentals: UserCarRentalBooking[];
  onExploreFleet: () => void;
  onUpdateRental: (id: string, updates: Partial<UserCarRentalBooking>) => void;
}

export const CarRentalsModule: React.FC<CarRentalsModuleProps> = ({
  rentals,
  onExploreFleet,
  onUpdateRental,
}) => {
  const [subView, setSubView] = useState<CarRentalsSubView>('index');
  const [selectedRental, setSelectedRental] = useState<UserCarRentalBooking | null>(
    rentals[0] || null
  );

  // Modification & Driver info form states
  const [modPickupDate, setModPickupDate] = useState('');
  const [modReturnDate, setModReturnDate] = useState('');
  const [modPickupLoc, setModPickupLoc] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverState, setDriverState] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'All Fleet Rentals', fileName: 'index.php', badge: rentals.length },
    { id: 'my-rentals', label: 'Active Rentals', fileName: 'my-rentals.php' },
    { id: 'rental-details', label: 'Rental Details', fileName: 'rental-details.php' },
    { id: 'rental-history', label: 'Rental History', fileName: 'rental-history.php' },
    { id: 'pickup-details', label: 'Pickup Info', fileName: 'pickup-details.php' },
    { id: 'return-details', label: 'Return Info', fileName: 'return-details.php' },
    { id: 'driver-information', label: 'Driver Info', fileName: 'driver-information.php' },
    { id: 'modification-request', label: 'Modify Rental', fileName: 'modification-request.php' },
    { id: 'cancellation-request', label: 'Cancel Rental', fileName: 'cancellation-request.php' },
  ];

  const activeRentals = rentals.filter(
    (r) => r.status === 'confirmed' || r.status === 'active' || r.status === 'pending'
  );
  const completedRentals = rentals.filter((r) => r.status === 'completed');

  const handleSelectDetails = (r: UserCarRentalBooking) => {
    setSelectedRental(r);
    setSubView('rental-details');
  };

  const handleSelectModification = (r: UserCarRentalBooking) => {
    setSelectedRental(r);
    setModPickupDate(r.pickupDate);
    setModReturnDate(r.returnDate);
    setModPickupLoc(r.pickupLocation);
    setSubView('modification-request');
  };

  const handleSelectCancellation = (r: UserCarRentalBooking) => {
    setSelectedRental(r);
    setSubView('cancellation-request');
  };

  const handleSaveDriverInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;
    onUpdateRental(selectedRental.id, {
      primaryDriver: driverName || selectedRental.primaryDriver,
      driverLicenseNumber: driverLicense || selectedRental.driverLicenseNumber,
      driverLicenseState: driverState || selectedRental.driverLicenseState,
    });
    setActionSuccessMsg('Driver credentials updated and submitted for insurance dispatch approval.');
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const handleSubmitMod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;
    onUpdateRental(selectedRental.id, {
      pickupDate: modPickupDate,
      returnDate: modReturnDate,
      pickupLocation: modPickupLoc,
      status: 'pending',
    });
    setActionSuccessMsg('Vehicle rental adjustment submitted to fleet dispatch.');
    setTimeout(() => setActionSuccessMsg(null), 5000);
    setSubView('my-rentals');
  };

  const handleSubmitCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;
    onUpdateRental(selectedRental.id, {
      status: 'cancelled',
    });
    setActionSuccessMsg(`Vehicle rental #${selectedRental.id} cancelled. Security hold released.`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
    setSubView('my-rentals');
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/CarRentals/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as CarRentalsSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6">
        {actionSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 1. All Fleet Rentals (index.php) */}
        {subView === 'index' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#282828]">
                  3D Fleet Vehicle Rentals (index.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Airport terminal concierge delivery &amp; private doorstep drop-offs across California’s homes.
                </p>
              </div>
              <button
                type="button"
                onClick={onExploreFleet}
                className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
              >
                + Book 3D Fleet Vehicle
              </button>
            </div>

            {rentals.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No Vehicle Rentals Found"
                description="Explore our interactive 3D fleet of 7-passenger SUVs, European crossovers, and luxury sedans."
                actionText="Explore 3D Vehicle Fleet"
                onAction={onExploreFleet}
              />
            ) : (
              <div className="space-y-4">
                {rentals.map((r) => (
                  <VehicleCard
                    key={r.id}
                    rental={r}
                    onViewDetails={handleSelectDetails}
                    onRequestModification={handleSelectModification}
                    onRequestCancellation={handleSelectCancellation}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Active Rentals (my-rentals.php) */}
        {subView === 'my-rentals' && (
          <div className="space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Active &amp; Scheduled Rentals (my-rentals.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Confirmed vehicles dispatched for airport terminal arrival or private residence curbside handover.
              </p>
            </div>

            {activeRentals.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No Active Vehicle Rentals"
                description="You currently have no vehicles scheduled for arrival."
                actionText="Reserve Fleet Vehicle"
                onAction={onExploreFleet}
              />
            ) : (
              <div className="space-y-4">
                {activeRentals.map((r) => (
                  <VehicleCard
                    key={r.id}
                    rental={r}
                    onViewDetails={handleSelectDetails}
                    onRequestModification={handleSelectModification}
                    onRequestCancellation={handleSelectCancellation}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Rental Details (rental-details.php) */}
        {subView === 'rental-details' && selectedRental && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#e6dfd5] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#82634f] bg-[#faf8f5] px-2.5 py-1 rounded-lg border border-[#e6dfd5]">
                    {selectedRental.id}
                  </span>
                  <StatusBadge status={selectedRental.status} />
                </div>
                <h3 className="text-2xl font-heading font-black text-[#282828] mt-2">
                  {selectedRental.year} {selectedRental.vehicleName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#5c5046] mt-1">
                  <span className="text-[#00897d] font-bold">{selectedRental.category}</span>
                  <span>• Color: {selectedRental.colorName}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl border border-[#d8cfc3] hover:bg-[#faf8f5] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Rental Voucher</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#857568] flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-600" /> Digital Keybox / Handover Code
                </span>
                <span className="font-mono text-xl font-black text-[#282828] block">
                  {selectedRental.handoverCode}
                </span>
                <p className="text-[11px] text-[#5c5046]">Present code to concierge or use smart glovebox code.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#857568] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00b7a8]" /> Handover Location
                </span>
                <span className="text-xs font-bold text-[#282828] block truncate">
                  {selectedRental.pickupLocation}
                </span>
                <p className="text-[11px] text-[#5c5046]">Flight tracked in real-time if specified.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#857568] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Protection Plan
                </span>
                <span className="text-xs font-bold text-[#282828] block">
                  {selectedRental.protectionPlan === 'executive_shield'
                    ? 'Executive Shield ($0 Deductible)'
                    : 'Standard Coverage'}
                </span>
                <p className="text-[11px] text-[#5c5046]">24/7 roadside breakdown assistance included.</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Rental History (rental-history.php) */}
        {subView === 'rental-history' && (
          <div className="space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Vehicle Rental History (rental-history.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Archive of past concluded vehicle rentals and return statements.
              </p>
            </div>

            {completedRentals.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No Completed Rentals"
                description="Past returns and odometer logs will appear here."
              />
            ) : (
              <div className="space-y-4">
                {completedRentals.map((r) => (
                  <VehicleCard
                    key={r.id}
                    rental={r}
                    onViewDetails={handleSelectDetails}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Pickup Details (pickup-details.php) */}
        {subView === 'pickup-details' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Airport &amp; Residence Pickup Guide (pickup-details.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Smooth airport arrivals and direct suite driveway handover logistics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#5c5046] leading-relaxed">
              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] space-y-2">
                <h5 className="font-heading font-bold text-sm text-[#282828] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00b7a8]" /> Major US Airport Hub Handover
                </h5>
                <p>
                  Upon deplaning, your concierge texts you the vehicle terminal bay and photo. Simply walk out to passenger curbside or designated VIP parking. No rental counter lines or shuttle buses.
                </p>
              </div>

              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] space-y-2">
                <h5 className="font-heading font-bold text-sm text-[#282828] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#82634f]" /> Direct Residence Driveway Delivery
                </h5>
                <p>
                  Vehicle is parked in your reserved covered parking space before arrival, clean, sanitized, and fully fueled with the smart keybox in place.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. Return Details (return-details.php) */}
        {subView === 'return-details' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Return Protocol &amp; Fuel Level (return-details.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Simple return process with full deposit release within 2 hours.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#5c5046]">
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                <span>Return with equal fuel level (full-to-full) or opt for our pre-paid refueling credit.</span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                <span>Park in your designated residence covered bay or airport return lane as coordinated.</span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                <span>Lock doors and replace key in digital keybox. Your digital inspection receipt will be sent automatically.</span>
              </div>
            </div>
          </div>
        )}

        {/* 7. Driver Information (driver-information.php) */}
        {subView === 'driver-information' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Primary Driver Profile (driver-information.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Driver license verification required for commercial fleet insurance coverage.
              </p>
            </div>

            <form onSubmit={handleSaveDriverInfo} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Driver Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder={selectedRental?.primaryDriver || 'Dr. Marcus Vance'}
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs font-semibold text-[#282828]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Driver License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder={selectedRental?.driverLicenseNumber || 'D18392019'}
                    value={driverLicense}
                    onChange={(e) => setDriverLicense(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs font-semibold text-[#282828]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Issuing State / Jurisdiction *</label>
                  <input
                    type="text"
                    required
                    placeholder={selectedRental?.driverLicenseState || 'CA'}
                    value={driverState}
                    onChange={(e) => setDriverState(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs font-semibold text-[#282828]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0] text-[11px] text-[#5c5046] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Drivers must be 21+ with a valid US or international driving permit.</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl shadow-2xs"
                >
                  Save Driver Information
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 8. Modification Request (modification-request.php) */}
        {subView === 'modification-request' && selectedRental && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Modify Rental Reservation (modification-request.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Adjust pickup dates, return schedule, or airport terminal delivery location.
              </p>
            </div>

            <form onSubmit={handleSubmitMod} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">New Pickup Date</label>
                  <input
                    type="date"
                    required
                    value={modPickupDate}
                    onChange={(e) => setModPickupDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">New Return Date</label>
                  <input
                    type="date"
                    required
                    value={modReturnDate}
                    onChange={(e) => setModReturnDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Delivery / Handover Location</label>
                <input
                  type="text"
                  required
                  value={modPickupLoc}
                  onChange={(e) => setModPickupLoc(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubView('my-rentals')}
                  className="px-4 py-2 rounded-xl border border-[#d8cfc3] text-[#5c5046] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl"
                >
                  Submit Modification
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 9. Cancellation Request (cancellation-request.php) */}
        {subView === 'cancellation-request' && selectedRental && (
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto shadow-xs">
            <div className="border-b border-rose-100 pb-4">
              <h3 className="font-heading font-bold text-lg text-rose-900">
                Cancel Vehicle Rental (cancellation-request.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Notice for cancelling rental #{selectedRental.id} ({selectedRental.vehicleName}).
              </p>
            </div>

            <p className="text-xs text-[#5c5046]">
              Vehicle cancellations made 48 hours prior to pickup incur no cancellation charge. Lodging units or bank authorization holds are released immediately.
            </p>

            <form onSubmit={handleSubmitCancel} className="space-y-4 text-xs">
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubView('my-rentals')}
                  className="px-4 py-2 rounded-xl border border-[#d8cfc3] text-[#5c5046] font-semibold"
                >
                  Keep Rental
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
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
