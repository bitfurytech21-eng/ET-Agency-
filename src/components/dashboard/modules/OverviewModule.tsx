import React, { useState } from 'react';
import {
  UserSession,
  UserAccommodationReservation,
  UserCarRentalBooking,
  UserPaymentRecord,
  AccountActivityItem,
  DashboardTab,
  OverviewSubView,
} from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  Building2,
  Car,
  CreditCard,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  MapPin,
  User,
  Wallet,
} from 'lucide-react';

interface OverviewModuleProps {
  user: UserSession;
  accommodations: UserAccommodationReservation[];
  carRentals: UserCarRentalBooking[];
  payments: UserPaymentRecord[];
  activities?: AccountActivityItem[];
  onOpenBooking: () => void;
  onExploreFleet?: () => void;
  onOpenTopUpUnits: () => void;
  onNavigateTab: (tab: DashboardTab) => void;
  onViewBookingDetails: (booking: UserAccommodationReservation) => void;
  onViewRentalDetails: (rental: UserCarRentalBooking) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  user,
  accommodations,
  carRentals,
  payments,
  activities = [],
  onOpenBooking,
  onExploreFleet = () => {},
  onOpenTopUpUnits,
  onNavigateTab,
  onViewBookingDetails,
  onViewRentalDetails,
}) => {
  const [subView, setSubView] = useState<OverviewSubView>('index');

  const activeAccommodations = accommodations.filter(
    (b) => b.status === 'confirmed' || b.status === 'active' || b.status === 'pending',
  );
  const pastAccommodations = accommodations.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled',
  );
  const activeRentals = carRentals.filter(
    (r) => r.status === 'confirmed' || r.status === 'active' || r.status === 'pending',
  );
  const settledPayments = payments.filter((p) => p.status === 'settled');
  const pendingPayments = payments.filter((p) => p.status === 'pending');

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Overview' },
    { id: 'account-summary', label: 'Account Summary' },
    {
      id: 'upcoming-bookings',
      label: 'Active & Upcoming',
      badge: activeAccommodations.length + activeRentals.length,
    },
    { id: 'recent-activity', label: 'Recent Activity', badge: activities.length },
  ];

  const firstName = user.name.trim().split(' ')[0] || user.name;

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as OverviewSubView)}
      />

      <div className="px-4 sm:px-8 pb-6 space-y-6">
        {/* Personal Welcome Header */}
        <div className="bg-[#241d18] text-white rounded-2xl p-6 sm:p-7 border border-[#3f332b] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#d6c7b8] tabular-nums">
              <span>Personal Account</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#ede5dc]">User ID: {user.id}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#b8a99a]">Dashboard: {user.dashboardId}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
              Welcome back, {firstName}
            </h2>
            <p className="text-xs sm:text-sm text-[#d6c7b8] max-w-2xl leading-relaxed">
              Manage your furnished residence stays, vehicle reservations, invoices, and personal account settings in one secure place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-4 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Building2 className="w-4 h-4" />
              <span>Book Residence</span>
            </button>
            <button
              type="button"
              onClick={onExploreFleet}
              className="px-4 py-2.5 rounded-xl bg-[#322720] hover:bg-[#41332a] border border-[#4f3f34] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Car className="w-4 h-4 text-[#4de0d2]" />
              <span>Reserve Car</span>
            </button>
            <button
              type="button"
              onClick={onOpenTopUpUnits}
              className="px-4 py-2.5 rounded-xl bg-[#322720] hover:bg-[#41332a] border border-[#4f3f34] text-[#ede5dc] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#4de0d2]" />
              <span>Add Account Funds</span>
            </button>
          </div>
        </div>

        {/* 4 Core KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 tabular-nums">
          <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6e5d50]">
              <span className="font-semibold">Account Balance</span>
              <Wallet className="w-4 h-4 text-[#00897d]" />
            </div>
            <div>
              <div className="text-2xl font-heading font-black text-[#282828]">
                ${user.balance_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-[#5c5046] mt-0.5">
                {user.units_balance} Lodging Units available
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('payments')}
              className="text-xs font-bold text-[#00897d] hover:underline flex items-center gap-1 cursor-pointer w-fit whitespace-nowrap"
            >
              <span>View ledger &amp; funds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6e5d50]">
              <span className="font-semibold">Accommodation Stays</span>
              <Building2 className="w-4 h-4 text-[#00897d]" />
            </div>
            <div>
              <div className="text-2xl font-heading font-black text-[#282828]">
                {activeAccommodations.length}
              </div>
              <div className="text-xs text-[#5c5046] mt-0.5">
                Active &amp; upcoming · {pastAccommodations.length} past
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('accommodation')}
              className="text-xs font-bold text-[#00897d] hover:underline flex items-center gap-1 cursor-pointer w-fit whitespace-nowrap"
            >
              <span>Manage stays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6e5d50]">
              <span className="font-semibold">Car Rental Reservations</span>
              <Car className="w-4 h-4 text-[#82634f]" />
            </div>
            <div>
              <div className="text-2xl font-heading font-black text-[#282828]">
                {activeRentals.length}
              </div>
              <div className="text-xs text-[#5c5046] mt-0.5">
                Active &amp; upcoming · {carRentals.length} total
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('car-rentals')}
              className="text-xs font-bold text-[#00897d] hover:underline flex items-center gap-1 cursor-pointer w-fit whitespace-nowrap"
            >
              <span>Manage fleet rentals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6e5d50]">
              <span className="font-semibold">Payments &amp; Invoices</span>
              <CreditCard className="w-4 h-4 text-[#82634f]" />
            </div>
            <div>
              <div className="text-2xl font-heading font-black text-[#282828]">
                {payments.length}
              </div>
              <div className="text-xs text-[#5c5046] mt-0.5">
                {settledPayments.length} settled · {pendingPayments.length} pending verification
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('payments')}
              className="text-xs font-bold text-[#00897d] hover:underline flex items-center gap-1 cursor-pointer w-fit whitespace-nowrap"
            >
              <span>Invoices &amp; receipts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-view: Overview (Default) */}
        {subView === 'index' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Active & Upcoming Bookings */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
                <div>
                  <h3 className="font-heading font-bold text-base text-[#282828]">
                    Active &amp; Upcoming Reservations
                  </h3>
                  <p className="text-xs text-[#6e5d50]">
                    Your current accommodation stays and scheduled fleet vehicles
                  </p>
                </div>
                {(activeAccommodations.length > 0 || activeRentals.length > 0) && (
                  <button
                    type="button"
                    onClick={() => setSubView('upcoming-bookings')}
                    className="text-xs font-bold text-[#00897d] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    View all ({activeAccommodations.length + activeRentals.length})
                  </button>
                )}
              </div>

              {activeAccommodations.length === 0 && activeRentals.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No active or upcoming bookings yet"
                  description="Your personal dashboard is ready. Reserve a furnished 1- or 2-bedroom suite or schedule a fleet vehicle delivery anytime."
                  actionText="Browse Residences"
                  onAction={onOpenBooking}
                />
              ) : (
                <div className="space-y-3">
                  {activeAccommodations.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                          <span className="font-semibold text-[#82634f]">Accommodation</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[#5c5046]">{booking.id}</span>
                          <span aria-hidden="true">·</span>
                          <StatusBadge status={booking.status} size="sm" />
                        </div>
                        <h4 className="font-heading font-bold text-sm text-[#282828]">
                          {booking.propertyTitle} ({booking.unitNumber})
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5c5046] tabular-nums">
                          <span>
                            {booking.checkIn} to {booking.checkOut}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{booking.totalNights} nights</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#282828]">
                            ${booking.totalUsd.toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onViewBookingDetails(booking)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-[#d8cfc3] hover:border-[#00b7a8] text-xs font-bold text-[#282828] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-center"
                      >
                        <span>View Stay</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#00b7a8]" />
                      </button>
                    </div>
                  ))}

                  {activeRentals.slice(0, 3).map((rental) => (
                    <div
                      key={rental.id}
                      className="p-4 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                          <span className="font-semibold text-[#00897d]">Car Rental</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[#5c5046]">{rental.id}</span>
                          <span aria-hidden="true">·</span>
                          <StatusBadge status={rental.status} size="sm" />
                        </div>
                        <h4 className="font-heading font-bold text-sm text-[#282828]">
                          {rental.year} {rental.vehicleName} ({rental.colorName})
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5c5046] tabular-nums">
                          <span>
                            {rental.pickupDate} to {rental.returnDate}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{rental.totalDays} days</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#282828]">
                            ${rental.totalUsd.toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onViewRentalDetails(rental)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-[#d8cfc3] hover:border-[#00b7a8] text-xs font-bold text-[#282828] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-center"
                      >
                        <span>View Rental</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#00b7a8]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Registered Profile & Recent Activity */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00897d]" />
                    <h3 className="font-heading font-bold text-sm text-[#282828]">
                      Registered Profile
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('profile')}
                    className="text-xs font-bold text-[#00897d] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Edit Profile
                  </button>
                </div>

                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#6e5d50]">Full Name</dt>
                    <dd className="font-bold text-[#282828] text-right">{user.name}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#6e5d50]">Email</dt>
                    <dd className="font-semibold text-[#282828] text-right truncate">{user.email}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#6e5d50]">Phone</dt>
                    <dd className="font-semibold text-[#282828] text-right tabular-nums">
                      {user.phone || 'Not provided'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#6e5d50]">Organization</dt>
                    <dd className="font-semibold text-[#282828] text-right truncate">
                      {user.company || 'Personal Account'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#6e5d50]">Member Since</dt>
                    <dd className="font-semibold text-[#282828] text-right tabular-nums">
                      {user.memberSince}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm text-[#282828]">Recent Activity</h3>
                  {activities.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSubView('recent-activity')}
                      className="text-xs font-bold text-[#00897d] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      All activity
                    </button>
                  )}
                </div>

                {activities.length === 0 ? (
                  <p className="text-xs text-[#6e5d50] py-2">
                    Account initialized on {user.memberSince}. New reservations and payment updates will appear here.
                  </p>
                ) : (
                  <div className="divide-y divide-[#e6dfd5]">
                    {activities.slice(0, 4).map((act) => (
                      <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-[#282828] truncate">{act.title}</span>
                          <span className="text-[11px] text-[#857568] tabular-nums shrink-0">
                            {act.timestamp.split('T')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5c5046] line-clamp-2">{act.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sub-view: Account Summary */}
        {subView === 'account-summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4">
              <h3 className="font-heading font-bold text-base text-[#282828]">
                Account &amp; Dashboard Identity
              </h3>
              <dl className="space-y-3 text-xs tabular-nums">
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Account Holder</dt>
                  <dd className="font-bold text-[#282828]">{user.name}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Unique User ID</dt>
                  <dd className="font-mono font-bold text-[#282828]">{user.id}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Personal Dashboard ID</dt>
                  <dd className="font-mono font-bold text-[#282828]">{user.dashboardId}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Registered Email</dt>
                  <dd className="font-semibold text-[#282828]">{user.email}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Two-Factor Authentication</dt>
                  <dd className="font-bold text-[#282828]">
                    {user.twoFactorEnabled ? 'Enabled' : 'Standard Password Protection'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6e5d50]">Preferred Timezone</dt>
                  <dd className="font-semibold text-[#282828]">{user.timezone}</dd>
                </div>
              </dl>
            </div>

            <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4 tabular-nums">
              <h3 className="font-heading font-bold text-base text-[#282828]">
                Booking &amp; Financial Totals
              </h3>
              <dl className="space-y-3 text-xs">
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Available USD Balance</dt>
                  <dd className="font-bold text-[#00897d]">
                    ${user.balance_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Available Lodging Units</dt>
                  <dd className="font-bold text-[#282828]">{user.units_balance} Units</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Total Residence Reservations</dt>
                  <dd className="font-bold text-[#282828]">{accommodations.length}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#efe9e0] pb-2.5">
                  <dt className="text-[#6e5d50]">Total Car Rental Reservations</dt>
                  <dd className="font-bold text-[#282828]">{carRentals.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6e5d50]">Recorded Invoices &amp; Transfers</dt>
                  <dd className="font-bold text-[#282828]">{payments.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Sub-view: Upcoming Bookings */}
        {subView === 'upcoming-bookings' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-base text-[#282828]">
              All Active &amp; Upcoming Reservations
            </h3>
            {activeAccommodations.length === 0 && activeRentals.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No active or upcoming bookings"
                description="You do not currently have any active accommodation stays or car rental reservations."
                actionText="Book a Residence"
                onAction={onOpenBooking}
              />
            ) : (
              <div className="space-y-3">
                {activeAccommodations.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs tabular-nums">
                        <span className="font-mono font-bold text-[#82634f]">{b.id}</span>
                        <span aria-hidden="true">·</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[#282828]">
                        {b.propertyTitle} ({b.unitNumber})
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5c5046] tabular-nums">
                        <MapPin className="w-3.5 h-3.5 text-[#00897d]" />
                        <span>{b.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {b.checkIn} – {b.checkOut}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewBookingDetails(b)}
                      className="px-4 py-2 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Open Stay Details
                    </button>
                  </div>
                ))}

                {activeRentals.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs tabular-nums">
                        <span className="font-mono font-bold text-[#00897d]">{r.id}</span>
                        <span aria-hidden="true">·</span>
                        <StatusBadge status={r.status} size="sm" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[#282828]">
                        {r.year} {r.vehicleName} ({r.colorName})
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5c5046] tabular-nums">
                        <MapPin className="w-3.5 h-3.5 text-[#00897d]" />
                        <span>{r.pickupLocation}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {r.pickupDate} – {r.returnDate}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewRentalDetails(r)}
                      className="px-4 py-2 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Open Rental Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub-view: Recent Activity */}
        {subView === 'recent-activity' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-base text-[#282828]">
              Account Activity History
            </h3>
            {activities.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No activity recorded yet"
                description="All bookings, car rental reservations, payment verifications, and support tickets on your account will appear chronologically here."
              />
            ) : (
              <div className="divide-y divide-[#e6dfd5] border border-[#e6dfd5] rounded-2xl bg-[#faf8f5] px-5">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-[#282828]">{act.title}</span>
                        {act.status && (
                          <>
                            <span className="text-[#857568]" aria-hidden="true">·</span>
                            <StatusBadge status={act.status} size="sm" />
                          </>
                        )}
                      </div>
                      <p className="text-xs text-[#5c5046]">{act.description}</p>
                    </div>
                    <div className="sm:text-right text-xs text-[#857568] tabular-nums shrink-0">
                      {act.amountUsd !== undefined && act.amountUsd !== 0 && (
                        <div className="font-bold text-[#282828]">
                          ${Math.abs(act.amountUsd).toLocaleString()} USD
                        </div>
                      )}
                      <div>{act.timestamp.replace('T', ' ').slice(0, 16)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
