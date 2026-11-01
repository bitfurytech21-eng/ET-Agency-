import React, { useState } from 'react';
import {
  UserSession,
  UserAccommodationReservation,
  UserCarRentalBooking,
  UserPaymentRecord,
  OverviewSubView,
} from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { StatusBadge } from '../components/StatusBadge';
import {
  Building2,
  Car,
  Coins,
  CreditCard,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  Key,
  MapPin,
  CheckCircle2,
  User,
  Activity,
} from 'lucide-react';

interface OverviewModuleProps {
  user: UserSession;
  accommodations: UserAccommodationReservation[];
  carRentals: UserCarRentalBooking[];
  payments: UserPaymentRecord[];
  onOpenBooking: () => void;
  onOpenTopUpUnits: () => void;
  onNavigateTab: (tab: any, subView?: string) => void;
  onViewBookingDetails: (booking: UserAccommodationReservation) => void;
  onViewRentalDetails: (rental: UserCarRentalBooking) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  user,
  accommodations,
  carRentals,
  payments,
  onOpenBooking,
  onOpenTopUpUnits,
  onNavigateTab,
  onViewBookingDetails,
  onViewRentalDetails,
}) => {
  const [subView, setSubView] = useState<OverviewSubView>('index');

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Overview Home', fileName: 'index.php' },
    { id: 'account-summary', label: 'Account Summary', fileName: 'account-summary.php' },
    { id: 'upcoming-bookings', label: 'Upcoming Bookings', fileName: 'upcoming-bookings.php' },
    { id: 'recent-activity', label: 'Recent Activity', fileName: 'recent-activity.php' },
  ];

  const upcomingAccommodations = accommodations.filter(
    (a) => a.status === 'confirmed' || a.status === 'active' || a.status === 'pending'
  );
  const upcomingRentals = carRentals.filter(
    (c) => c.status === 'confirmed' || c.status === 'active' || c.status === 'pending'
  );

  return (
      <div className="px-4 sm:px-8 space-y-6">
        {/* 1. Sub-View: index.php / Overview Home */}
        {subView === 'index' && (
          <div className="space-y-6">
            {/* Clean Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-[#282828]">
                  Overview &amp; Account Home
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Real-time ledger overview for account balance, verified suites, 3D fleet rentals, and settlements.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenTopUpUnits}
                  className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Top-Up Balance</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-4 py-2 bg-[#faf8f5] hover:bg-[#f2ece3] border border-[#d8cfc3] text-[#282828] text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#00b7a8]" />
                  <span>New Stay</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Account Balance */}
              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568]">
                    Account Balance
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf8f5] border border-[#e6dfd5] flex items-center justify-center text-[#00b7a8]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-[#282828] tabular-nums">
                    ${user.balance_usd.toLocaleString()}{' '}
                    <span className="text-xs font-bold text-[#00b7a8]">USD</span>
                  </div>
                  <span className="text-xs text-[#5c5046]">
                    Available for housing &amp; fleet rentals
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenTopUpUnits}
                  className="w-full py-1.5 bg-[#faf8f5] hover:bg-[#f2ece3] text-[#282828] text-xs font-semibold rounded-lg border border-[#d8cfc3] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#00b7a8]" />
                  <span>Top-Up Balance</span>
                </button>
              </div>

              {/* Card 2: Housing Stays */}
              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568]">
                    Reserved Suites
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf8f5] border border-[#e6dfd5] flex items-center justify-center text-[#82634f]">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-[#282828] tabular-nums">
                    {upcomingAccommodations.length}{' '}
                    <span className="text-xs font-semibold text-[#857568]">Active/Upcoming</span>
                  </div>
                  <span className="text-xs text-[#5c5046]">
                    Across our verified US portfolio
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('accommodation')}
                  className="w-full py-1.5 bg-[#faf8f5] hover:bg-[#f2ece3] text-[#282828] text-xs font-semibold rounded-lg border border-[#d8cfc3] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View Suites</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#82634f]" />
                </button>
              </div>

              {/* Card 3: 3D Fleet Rentals */}
              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568]">
                    3D Fleet Vehicles
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf8f5] border border-[#e6dfd5] flex items-center justify-center text-[#00b7a8]">
                    <Car className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-[#282828] tabular-nums">
                    {upcomingRentals.length}{' '}
                    <span className="text-xs font-semibold text-[#857568]">Reservations</span>
                  </div>
                  <span className="text-xs text-[#5c5046]">
                    Airport &amp; suite delivery dispatch
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('car-rentals')}
                  className="w-full py-1.5 bg-[#faf8f5] hover:bg-[#f2ece3] text-[#282828] text-xs font-semibold rounded-lg border border-[#d8cfc3] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Fleet Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00b7a8]" />
                </button>
              </div>

              {/* Card 4: Payments / Ledger */}
              <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568]">
                    Payments Settled
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#faf8f5] border border-[#e6dfd5] flex items-center justify-center text-emerald-600">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-[#282828] tabular-nums">
                    {payments.length}{' '}
                    <span className="text-xs font-semibold text-[#857568]">Invoices/Receipts</span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Per Diem / CPA Reconciled</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('payments')}
                  className="w-full py-1.5 bg-[#faf8f5] hover:bg-[#f2ece3] text-[#282828] text-xs font-semibold rounded-lg border border-[#d8cfc3] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Invoices &amp; Receipts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Sub-View: account-summary.php */}
        {subView === 'account-summary' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[#e6dfd5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00b7a8]">Corporate Tier Profile</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Verified Account</span>
                </div>
                <h3 className="text-2xl font-heading font-black text-[#282828] mt-1">
                  Account Summary (account-summary.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Complete member portfolio breakdown, corporate partner credentials, and balance entitlements.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenTopUpUnits}
                className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
              >
                + Top-Up Balance
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] space-y-2">
                <span className="text-[11px] font-bold uppercase text-[#857568]">Client Name</span>
                <span className="font-bold text-base text-[#282828] block">{user.name}</span>
                <span className="text-[#5c5046]">{user.role}</span>
              </div>

              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] space-y-2">
                <span className="text-[11px] font-bold uppercase text-[#857568]">Enterprise Partner</span>
                <span className="font-bold text-base text-[#282828] block">{user.company}</span>
                <span className="text-[#5c5046]">Client ID: <strong className="font-mono">{user.id}</strong></span>
              </div>

              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] space-y-2">
                <span className="text-[11px] font-bold uppercase text-[#857568]">Membership Status</span>
                <span className="font-bold text-base text-[#00b7a8] block">{user.tier}</span>
                <span className="text-[#5c5046]">Member Since: {user.memberSince}</span>
              </div>
            </div>

            <div className="p-6 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] space-y-4">
              <h4 className="font-heading font-bold text-base text-[#282828]">Balance &amp; Credit Ledger</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#857568] block">Account USD Balance</span>
                  <span className="text-2xl font-black text-[#00897d]">${user.balance_usd.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-[#857568] block">Preferred Settlement Currency</span>
                  <span className="text-2xl font-black text-[#282828]">{user.preferredCurrency}</span>
                </div>
                <div>
                  <span className="text-[#857568] block">Security Hold Status</span>
                  <span className="text-2xl font-black text-emerald-700">Clear ($0 Hold)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Sub-View: upcoming-bookings.php */}
        {subView === 'upcoming-bookings' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#282828]">
                  Upcoming &amp; Active Stays (upcoming-bookings.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Keyless smart-lock codes, arrival timetables, and curbside fleet vehicle delivery.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenBooking}
                className="text-xs font-bold text-[#00b7a8] hover:underline"
              >
                + Book Another Residence
              </button>
            </div>

            {upcomingAccommodations.length === 0 && upcomingRentals.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[#e6dfd5] rounded-2xl space-y-2">
                <p className="text-xs text-[#5c5046]">No active or upcoming bookings currently found.</p>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-4 py-2 bg-[#00b7a8] text-white text-xs font-bold rounded-xl"
                >
                  Explore Nationwide Suites
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingAccommodations.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-5 bg-white border border-[#e6dfd5] rounded-2xl space-y-3 hover:border-[#00b7a8] transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={acc.status} size="sm" />
                          <span className="text-[11px] font-mono text-[#857568]">{acc.id}</span>
                        </div>
                        <h4 className="font-heading font-bold text-base text-[#282828] mt-1">
                          {acc.propertyTitle} — Unit {acc.unitNumber}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-[#5c5046]">
                          <MapPin className="w-3.5 h-3.5 text-[#00897d]" />
                          <span>{acc.location}</span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#00897d] tabular-nums">
                        ${acc.totalUsd.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0] text-xs grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#857568] font-bold block uppercase">Check-In</span>
                        <span className="font-semibold text-[#282828]">{acc.checkIn}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#857568] font-bold block uppercase">Smart-Lock Code</span>
                        <span className="font-mono font-bold text-amber-700 flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          {acc.accessCode}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onViewBookingDetails(acc)}
                        className="text-xs font-bold text-[#00b7a8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Check-In Instructions</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {upcomingRentals.map((veh) => (
                  <div
                    key={veh.id}
                    className="p-5 bg-white border border-[#e6dfd5] rounded-2xl space-y-3 hover:border-[#00b7a8] transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={veh.status} size="sm" />
                          <span className="text-[11px] font-mono text-[#857568]">{veh.id}</span>
                        </div>
                        <h4 className="font-heading font-bold text-base text-[#282828] mt-1">
                          {veh.year} {veh.vehicleName}
                        </h4>
                        <span className="text-xs text-[#00897d] font-bold">{veh.category}</span>
                      </div>
                      <span className="text-sm font-black text-[#00897d] tabular-nums">
                        ${veh.totalUsd.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#efe9e0] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#857568] font-bold uppercase">Pickup Date</span>
                        <span className="font-semibold text-[#282828]">{veh.pickupDate}</span>
                      </div>
                      <div className="text-[11px] text-[#5c5046] truncate">
                        Location: <strong>{veh.pickupLocation}</strong>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onViewRentalDetails(veh)}
                        className="text-xs font-bold text-[#00b7a8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Handover Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Sub-View: recent-activity.php */}
        {subView === 'recent-activity' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-xl text-[#282828]">
                Recent Account Activity (recent-activity.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Audit log of transactions, key code dispatches, and verification milestones.
              </p>
            </div>

            <div className="divide-y divide-[#efe9e0] text-xs space-y-2">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#282828] block">Corporate Unit Remittance Verified</span>
                    <span className="text-[#857568]">Wire reference settled and credited to client balance</span>
                  </div>
                </div>
                <span className="text-[#857568] font-medium">Just now</span>
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#faf8f5] border border-[#efe9e0] text-[#00b7a8] flex items-center justify-center font-bold text-base">
                    🔑
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#282828] block">Smart-Lock Digital Key Generated</span>
                    <span className="text-[#857568]">Unique entry pin issued for upcoming arrival</span>
                  </div>
                </div>
                <span className="text-[#857568] font-medium">Yesterday</span>
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#faf8f5] border border-[#efe9e0] text-[#82634f] flex items-center justify-center font-bold text-base">
                    📄
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#282828] block">Consolidated Monthly Lease Agreement Generated</span>
                    <span className="text-[#857568]">Tax-exempt 30+ day corporate housing packet ready</span>
                  </div>
                </div>
                <span className="text-[#857568] font-medium">3 days ago</span>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

