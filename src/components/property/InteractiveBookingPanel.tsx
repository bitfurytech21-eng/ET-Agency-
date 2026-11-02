import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';
import { PropertyListing } from '../../data/lodgingData';
import {
  AvailabilityQuoteBreakdown,
  BookingAddonSelection,
} from '../../data/propertyEnrichment';
import { CatalogServiceItem, useCart } from '../../context/CartContext';

interface InteractiveBookingPanelProps {
  property: PropertyListing;
  checkIn: string;
  checkOut: string;
  onChangeDates: (checkIn: string, checkOut: string) => void;
  adults: number;
  childrenCount: number;
  infants: number;
  onChangeGuests: (next: { adults: number; children: number; infants: number }) => void;
  selectedAddonQuantities: Record<string, number>;
  onChangeAddonQuantity: (serviceId: string, nextQty: number) => void;
  catalogServices: CatalogServiceItem[];
  bookingModalOpen: boolean;
  onOpenBookingModal: () => void;
  onCloseBookingModal: () => void;
  onBookingCreated: () => void;
  onNavigate?: (tab: string) => void;
}

function addDaysIso(isoDate: string, days: number): string {
  const base = isoDate ? new Date(`${isoDate}T00:00:00Z`) : new Date();
  if (Number.isNaN(base.getTime())) return '';
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().split('T')[0];
}

export const InteractiveBookingPanel: React.FC<InteractiveBookingPanelProps> = ({
  property,
  checkIn,
  checkOut,
  onChangeDates,
  adults,
  childrenCount,
  infants,
  onChangeGuests,
  selectedAddonQuantities,
  onChangeAddonQuantity,
  catalogServices,
  bookingModalOpen,
  onOpenBookingModal,
  onCloseBookingModal,
  onBookingCreated,
  onNavigate,
}) => {
  const { addItem, isMutating } = useCart();

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const maxGuests = property.maxGuests || Math.max(2, property.bedrooms * 2);
  const minStay = property.minimumStayDays || 5;
  const isReservedListing = property.status === 'Reserved';

  const [quote, setQuote] = useState<AvailabilityQuoteBreakdown | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [justAddedCart, setJustAddedCart] = useState(false);

  // Direct Reservation Form state (inside interactive booking modal)
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [employer, setEmployer] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'manual' | 'unit_balance'>('manual');
  const [customerUnitsBalance, setCustomerUnitsBalance] = useState<number | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedResult, setConfirmedResult] = useState<{
    bookingId: string;
    status: string;
    settledWithUnits: boolean;
    message: string;
    totalUsd: number;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    wireRoutingNumber?: string;
    zelleEmail?: string;
  } | null>(null);

  // Pre-populate guest fields if authenticated
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('etl_php_token') : null;
    if (!token) {
      setIsSignedIn(false);
      setCustomerUnitsBalance(null);
      return;
    }
    let cancelled = false;
    fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.success && data.customer) {
          setIsSignedIn(true);
          setGuestName((prev) => prev || data.customer.name || '');
          setGuestEmail((prev) => prev || data.customer.email || '');
          setGuestPhone((prev) => prev || data.customer.phone || '');
          setEmployer((prev) => prev || data.customer.company || '');
          setCustomerUnitsBalance(Number(data.units_balance ?? data.customer.units_balance ?? 0));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [bookingModalOpen]);

  const selectedAddonsPayload = useMemo(
    () =>
      Object.entries(selectedAddonQuantities)
        .filter(([, q]) => q > 0)
        .map(([serviceId, quantity]) => ({ serviceId, quantity })),
    [selectedAddonQuantities],
  );

  const selectedAddonItems = useMemo(() => {
    return selectedAddonsPayload
      .map(({ serviceId, quantity }) => {
        const svc = catalogServices.find((s) => s.id === serviceId);
        if (!svc) return null;
        return {
          serviceId: svc.id,
          title: svc.title,
          category: svc.category,
          unitPriceUsd: svc.priceUsd,
          quantity,
          billingUnitLabel: svc.billingUnitLabel,
          lineTotalUsd: svc.priceUsd * quantity,
        } as BookingAddonSelection;
      })
      .filter((x): x is BookingAddonSelection => Boolean(x));
  }, [selectedAddonsPayload, catalogServices]);

  // Live quote calculation against backend API whenever dates, guests, or add-ons change
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setQuote(null);
      setQuoteError(null);
      return;
    }

    let cancelled = false;
    setQuoteLoading(true);
    setQuoteError(null);

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/properties/${encodeURIComponent(property.id)}/quote-availability`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              checkIn,
              checkOut,
              adults,
              children: childrenCount,
              infants,
              selectedAddons: selectedAddonsPayload,
            }),
          },
        );
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.quote) {
          setQuote(null);
          setQuoteError(data.message || 'Unable to verify dates right now.');
        } else {
          setQuote(data.quote as AvailabilityQuoteBreakdown);
          setQuoteError(null);
        }
      } catch {
        if (!cancelled) {
          setQuoteError('Network error while checking live availability.');
        }
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    }, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [property.id, checkIn, checkOut, adults, childrenCount, infants, selectedAddonsPayload]);

  const totalGuestsExcludingInfants = adults + childrenCount;
  const fallbackNightly = Math.round((property.monthlyRate / 30) * 1.12);

  const handleCheckInChange = (nextCheckIn: string) => {
    if (!nextCheckIn) {
      onChangeDates('', '');
      return;
    }
    if (!checkOut || checkOut <= nextCheckIn) {
      onChangeDates(nextCheckIn, addDaysIso(nextCheckIn, Math.max(minStay, 30)));
    } else {
      onChangeDates(nextCheckIn, checkOut);
    }
  };

  const handleQuickDuration = (nights: number) => {
    const start = checkIn || addDaysIso(todayIso, 7);
    onChangeDates(start, addDaysIso(start, nights));
  };

  const handleAddBundleToCart = async () => {
    if (isReservedListing) return;
    if (checkIn && checkOut && quote && !quote.available) {
      return;
    }

    const nights = quote?.nights || 30;
    const isMonthly = nights >= 30 && nights % 30 === 0;
    const accQty = isMonthly ? Math.max(1, Math.round(nights / 30)) : nights;

    const ok = await addItem(
      {
        referenceId: property.id,
        itemType: 'accommodation',
        quantity: accQty,
        metadata: {
          billingUnit: isMonthly ? 'month' : 'night',
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
          guests: totalGuestsExcludingInfants,
          adults,
          children: childrenCount,
          infants,
          selectedAddons: selectedAddonItems,
        },
      },
      {
        openDrawerOnSuccess: selectedAddonItems.length === 0,
        successMessage:
          selectedAddonItems.length > 0
            ? 'Residence added. Adding selected concierge services...'
            : 'Residence stay added to your cart.',
      },
    );

    if (!ok) return;

    for (let i = 0; i < selectedAddonItems.length; i++) {
      const addon = selectedAddonItems[i];
      const isLast = i === selectedAddonItems.length - 1;
      await addItem(
        {
          referenceId: addon.serviceId,
          itemType: 'addon_service',
          quantity: addon.quantity,
          metadata: {
            billingUnit: 'item',
            checkIn: checkIn || undefined,
            notes: `Linked to ${property.unitNumber}`,
          },
        },
        {
          openDrawerOnSuccess: isLast,
          successMessage: isLast
            ? 'Residence stay and selected concierge services added to cart.'
            : undefined,
        },
      );
    }

    setJustAddedCart(true);
    window.setTimeout(() => setJustAddedCart(false), 2200);
  };

  const handleDirectBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setSubmitError('Please select both check-in and check-out dates.');
      return;
    }
    if (quote && !quote.available) {
      setSubmitError(quote.reason || 'Selected dates are unavailable.');
      return;
    }

    setSubmittingBooking(true);
    setSubmitError(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('etl_php_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/properties/${encodeURIComponent(property.id)}/book`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim(),
          employer: employer.trim() || undefined,
          checkIn,
          checkOut,
          adults,
          children: childrenCount,
          infants,
          selectedAddons: selectedAddonsPayload,
          specialRequests: specialRequests.trim() || undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to complete reservation.');
      }

      setConfirmedResult({
        bookingId: data.booking.id,
        status: data.booking.status,
        settledWithUnits: Boolean(data.settledWithUnits),
        message: data.message,
        totalUsd: Number(data.booking.totalPrice || quote?.totalUsd || 0),
        bankName: data.paymentAccounts?.bankName,
        accountName: data.paymentAccounts?.accountName,
        accountNumber: data.paymentAccounts?.accountNumber,
        wireRoutingNumber: data.paymentAccounts?.wireRoutingNumber,
        zelleEmail: data.paymentAccounts?.zelleEmail,
      });

      onBookingCreated();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Reservation request failed.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const renderGuestSteppers = () => (
    <div className="p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="type-label text-[#1b1d20] flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#00897d]" />
          <span>Guests</span>
        </span>
        <span className="type-support text-[#697076] tabular-nums">
          Max {maxGuests} guests
        </span>
      </div>

      {[
        {
          key: 'adults' as const,
          label: 'Adults',
          sub: 'Ages 13+',
          value: adults,
          min: 1,
          canInc: totalGuestsExcludingInfants < maxGuests,
          onChange: (v: number) => onChangeGuests({ adults: v, children: childrenCount, infants }),
        },
        {
          key: 'children' as const,
          label: 'Children',
          sub: 'Ages 2–12',
          value: childrenCount,
          min: 0,
          canInc: totalGuestsExcludingInfants < maxGuests,
          onChange: (v: number) => onChangeGuests({ adults, children: v, infants }),
        },
        {
          key: 'infants' as const,
          label: 'Infants',
          sub: 'Under 2',
          value: infants,
          min: 0,
          canInc: infants < 4,
          onChange: (v: number) => onChangeGuests({ adults, children: childrenCount, infants: v }),
        },
      ].map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-2">
          <div>
            <span className="type-support font-semibold text-[#1b1d20]">{row.label}</span>
            <span className="type-support text-[#697076] ml-1.5">· {row.sub}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={row.value <= row.min}
              onClick={() => row.onChange(Math.max(row.min, row.value - 1))}
              aria-label={`Decrease ${row.label}`}
              className="w-8 h-8 rounded-lg border border-[#dfd7cc] bg-white hover:bg-[#f4efe9] disabled:opacity-40 flex items-center justify-center cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="type-support font-semibold text-[#1b1d20] w-5 text-center tabular-nums">
              {row.value}
            </span>
            <button
              type="button"
              disabled={!row.canInc}
              onClick={() => row.onChange(row.value + 1)}
              aria-label={`Increase ${row.label}`}
              className="w-8 h-8 rounded-lg border border-[#dfd7cc] bg-white hover:bg-[#f4efe9] disabled:opacity-40 flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPriceBreakdown = () => {
    if (quoteLoading) {
      return (
        <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center gap-2.5 text-[#5c5046]">
          <Loader2 className="w-4 h-4 animate-spin text-[#00897d]" />
          <span className="type-support">Calculating live availability &amp; pricing...</span>
        </div>
      );
    }

    if (quoteError) {
      return (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="type-support">{quoteError}</span>
        </div>
      );
    }

    if (!quote) {
      return (
        <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2 tabular-nums">
          <div className="flex justify-between type-support text-[#434a4f]">
            <span>30+ Day Extended Rate</span>
            <span className="font-semibold text-[#1b1d20]">${property.monthlyRate.toLocaleString()} / mo</span>
          </div>
          <div className="flex justify-between type-support text-[#434a4f]">
            <span>Short Stay ({minStay}–29 Nights)</span>
            <span className="font-semibold text-[#1b1d20]">~${fallbackNightly.toLocaleString()} / night</span>
          </div>
          {selectedAddonItems.length > 0 && (
            <div className="flex justify-between type-support text-[#00897d] pt-1 border-t border-[#e6dfd5]">
              <span>Selected Concierge Add-Ons ({selectedAddonItems.length})</span>
              <span className="font-semibold">
                +${selectedAddonItems.reduce((s, a) => s + a.lineTotalUsd, 0).toLocaleString()}
              </span>
            </div>
          )}
          <p className="type-support text-[#697076] pt-1">
            Select check-in and check-out dates above to verify availability and calculate exact totals.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {!quote.available && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="type-support font-medium">
              {quote.reason || 'Selected dates overlap an existing booking.'}
            </span>
          </div>
        )}

        {quote.available && (
          <div className="type-support text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Dates verified open ({quote.nights} nights
              {quote.isExtendedTaxExempt ? ' · CA 30+ day tax-exempt rate' : ''})
            </span>
          </div>
        )}

        <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2 tabular-nums">
          <div className="flex justify-between type-support text-[#434a4f]">
            <span>
              ${quote.effectiveNightlyRateUsd.toLocaleString()} × {quote.nights} nights
            </span>
            <span className="font-semibold text-[#1b1d20]">
              ${quote.accommodationSubtotalUsd.toLocaleString()}
            </span>
          </div>

          {quote.seasonalNote && (
            <p className="type-support text-[#82634f]">{quote.seasonalNote}</p>
          )}

          {quote.addons.length > 0 && (
            <div className="pt-1.5 border-t border-[#efe9e0] space-y-1.5">
              {quote.addons.map((addon) => (
                <div
                  key={addon.serviceId}
                  className="flex items-center justify-between gap-2 type-support text-[#434a4f]"
                >
                  <span className="truncate">
                    {addon.title} × {addon.quantity}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-[#1b1d20]">
                      ${addon.lineTotalUsd.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => onChangeAddonQuantity(addon.serviceId, 0)}
                      aria-label={`Remove ${addon.title}`}
                      className="text-[#857568] hover:text-rose-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between type-support text-[#434a4f]">
            <span>Preparation &amp; Inspection Fee</span>
            <span className="font-semibold text-[#1b1d20]">${quote.serviceFeeUsd.toLocaleString()}</span>
          </div>

          <div className="flex justify-between type-support text-[#434a4f]">
            <span>
              {quote.isExtendedTaxExempt
                ? 'CA Occupancy Tax (30+ Day Exempt)'
                : `CA Occupancy Tax (${quote.taxRatePercent}%)`}
            </span>
            <span className="font-semibold text-[#1b1d20]">${quote.taxUsd.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-baseline pt-2.5 border-t border-[#dfd7cc]">
            <div>
              <span className="type-nav font-bold text-[#1b1d20] block">Total Estimate</span>
              <span className="type-support text-[#697076]">
                Equivalent: {quote.unitsRequired} Lodging Units
              </span>
            </div>
            <span className="text-xl font-bold text-[#00897d]">
              ${quote.totalUsd.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Purchase & Availability Module */}
      <aside className="space-y-4">
        <div className="bg-white border border-[#dfd7cc] p-6 rounded-2xl space-y-5">
          <div className="border-b border-[#efe9e0] pb-4 tabular-nums">
            <div className="type-support text-[#697076] flex items-center gap-2">
              <span className="font-semibold text-[#00897d]">
                {isReservedListing ? 'Currently Reserved' : property.status}
              </span>
              <span aria-hidden="true">·</span>
              <span>Min {minStay} nights</span>
            </div>
            <div className="text-3xl font-bold text-[#1b1d20] mt-1">
              ${property.monthlyRate.toLocaleString()}
              <span className="type-support font-normal text-[#5c5046]"> / month</span>
            </div>
            <p className="type-support text-[#697076] mt-1">
              Short stays: ~${fallbackNightly.toLocaleString()}/night · Utilities &amp; parking included
            </p>
          </div>

          {/* Quick Duration Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[
              { label: `${minStay} Nights`, nights: minStay },
              { label: '14 Nights', nights: 14 },
              { label: '30 Days', nights: 30 },
              { label: '60 Days', nights: 60 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleQuickDuration(preset.nights)}
                className="type-support px-2.5 py-1.5 rounded-lg border border-[#dfd7cc] bg-[#faf8f5] hover:border-[#00897d] text-[#282828] font-medium cursor-pointer whitespace-nowrap shrink-0 tabular-nums"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block type-label text-[#1b1d20] mb-1">Check-In</label>
              <input
                type="date"
                min={todayIso}
                value={checkIn}
                disabled={isReservedListing}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full h-11 px-2.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base font-medium text-[#1b1d20] tabular-nums focus:outline-none focus:border-[#00897d]"
              />
            </div>
            <div>
              <label className="block type-label text-[#1b1d20] mb-1">Check-Out</label>
              <input
                type="date"
                min={checkIn ? addDaysIso(checkIn, minStay) : addDaysIso(todayIso, minStay)}
                value={checkOut}
                disabled={isReservedListing}
                onChange={(e) => onChangeDates(checkIn || todayIso, e.target.value)}
                className="w-full h-11 px-2.5 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base font-medium text-[#1b1d20] tabular-nums focus:outline-none focus:border-[#00897d]"
              />
            </div>
          </div>

          {/* Guest Counter */}
          {renderGuestSteppers()}

          {/* Live Price Breakdown */}
          {renderPriceBreakdown()}

          {/* Primary Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              disabled={isReservedListing || (quote !== null && !quote.available)}
              onClick={() => {
                setConfirmedResult(null);
                setSubmitError(null);
                if (!checkIn || !checkOut) {
                  handleQuickDuration(30);
                }
                onOpenBookingModal();
              }}
              className="type-btn w-full py-3 px-4 rounded-xl bg-[#00b7a8] hover:bg-[#009b8e] disabled:bg-[#ebe4da] disabled:text-[#857568] text-white inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>
                {isReservedListing
                  ? 'Currently Reserved'
                  : checkIn && checkOut
                  ? 'Reserve Stay & Add-Ons'
                  : 'Check Availability & Reserve'}
              </span>
            </button>

            <button
              type="button"
              disabled={
                isReservedListing ||
                isMutating ||
                (Boolean(checkIn && checkOut) && quote !== null && !quote.available)
              }
              onClick={handleAddBundleToCart}
              className={`type-btn w-full py-2.5 px-4 rounded-xl border inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap ${
                justAddedCart
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-[#faf8f5] text-[#1b1d20] border-[#dfd7cc]'
              }`}
            >
              {justAddedCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#00897d]" />
                  <span>
                    {selectedAddonItems.length > 0
                      ? `Add Stay + ${selectedAddonItems.length} Add-On(s) to Cart`
                      : 'Add Stay to Shopping Cart'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Direct Host Assistance Card */}
        <div className="type-support p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl text-[#434a4f] space-y-1.5">
          <div className="type-label text-[#1b1d20] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00897d]" />
            <span>Direct Host &amp; Corporate Desk</span>
          </div>
          <p>
            Need multi-residence invoicing or insurance relocation documentation? Contact us at{' '}
            <a
              href="mailto:easytravelagency@trustagent.space"
              className="text-[#00897d] font-medium hover:underline"
            >
              easytravelagency@trustagent.space
            </a>{' '}
            or call{' '}
            <a href="tel:9168003295" className="text-[#00897d] font-medium hover:underline tabular-nums">
              916-800-3295
            </a>
            .
          </p>
        </div>
      </aside>

      {/* Mobile Compact Fixed Bottom Bar (<= 15% viewport height) */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-xs border-t border-[#dfd7cc] px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0 tabular-nums">
          <div className="text-base font-bold text-[#1b1d20] truncate">
            {quote && quote.available ? (
              <>
                ${quote.totalUsd.toLocaleString()}{' '}
                <span className="type-support font-normal text-[#5c5046]">
                  total ({quote.nights}n)
                </span>
              </>
            ) : (
              <>
                ${property.monthlyRate.toLocaleString()}{' '}
                <span className="type-support font-normal text-[#5c5046]">/ mo</span>
              </>
            )}
          </div>
          <p className="type-support text-[#697076] truncate">
            {checkIn && checkOut
              ? `${checkIn} → ${checkOut}`
              : `Min ${minStay} nights · Up to ${maxGuests} guests`}
          </p>
        </div>

        <button
          type="button"
          disabled={isReservedListing}
          onClick={() => {
            setConfirmedResult(null);
            setSubmitError(null);
            if (!checkIn || !checkOut) {
              handleQuickDuration(30);
            }
            onOpenBookingModal();
          }}
          className="type-btn px-4 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009b8e] disabled:bg-[#ebe4da] disabled:text-[#857568] text-white cursor-pointer whitespace-nowrap shrink-0"
        >
          {isReservedListing ? 'Reserved' : 'Check Availability'}
        </button>
      </div>

      {/* Interactive Booking & Direct Reservation Modal */}
      {bookingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={onCloseBookingModal}
        >
          <div
            className="bg-white border border-[#e6dfd5] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#efe9e0] pb-4">
              <div>
                <p className="type-support text-[#00897d] font-semibold">
                  {property.unitNumber} · {property.propertyType || 'Furnished Residence'}
                </p>
                <h3 className="type-h3 text-[#1b1d20] mt-0.5">{property.title}</h3>
              </div>
              <button
                type="button"
                onClick={onCloseBookingModal}
                aria-label="Close booking panel"
                className="w-10 h-10 rounded-lg border border-[#e6dfd5] text-[#5c5046] hover:text-[#1b1d20] flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {confirmedResult ? (
              <div className="space-y-5">
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      {confirmedResult.settledWithUnits
                        ? 'Reservation Confirmed'
                        : 'Reservation Recorded — Awaiting Payment Verification'}
                    </span>
                  </div>
                  <p className="type-support text-emerald-900">{confirmedResult.message}</p>
                  <div className="type-support text-emerald-950 pt-1 tabular-nums">
                    Reference: <strong className="font-mono">{confirmedResult.bookingId}</strong> · Total:{' '}
                    <strong>${confirmedResult.totalUsd.toLocaleString()} USD</strong>
                  </div>
                </div>

                {!confirmedResult.settledWithUnits && confirmedResult.bankName && (
                  <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2 tabular-nums">
                    <span className="type-label text-[#1b1d20] block">
                      Official Wire / ACH / Zelle Settlement Instructions
                    </span>
                    <div className="type-support text-[#434a4f] space-y-1">
                      <div>
                        Beneficiary: <strong className="text-[#1b1d20]">{confirmedResult.accountName}</strong> ({confirmedResult.bankName})
                      </div>
                      <div>
                        Account / Wire Routing:{' '}
                        <strong className="font-mono text-[#1b1d20]">
                          {confirmedResult.accountNumber} / {confirmedResult.wireRoutingNumber}
                        </strong>
                      </div>
                      {confirmedResult.zelleEmail && (
                        <div>
                          Zelle Corporate:{' '}
                          <strong className="text-[#1b1d20]">{confirmedResult.zelleEmail}</strong>
                        </div>
                      )}
                      <p className="text-[#697076] pt-1">
                        Include reservation reference <strong className="font-mono">{confirmedResult.bookingId}</strong> in your transfer memo, or submit your transfer receipt from your personal dashboard.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        onCloseBookingModal();
                        onNavigate('dashboard');
                      }}
                      className="type-btn px-4 py-2.5 rounded-xl border border-[#dfd7cc] text-[#1b1d20] hover:bg-[#faf8f5] cursor-pointer"
                    >
                      Open My Dashboard
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onCloseBookingModal}
                    className="type-btn px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009b8e] text-white cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDirectBookingSubmit} className="space-y-5">
                {/* Dates & Guests Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block type-label text-[#1b1d20] mb-1">Check-In Date *</label>
                    <input
                      type="date"
                      required
                      min={todayIso}
                      value={checkIn}
                      onChange={(e) => handleCheckInChange(e.target.value)}
                      className="w-full h-11 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base font-medium text-[#1b1d20] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block type-label text-[#1b1d20] mb-1">Check-Out Date *</label>
                    <input
                      type="date"
                      required
                      min={checkIn ? addDaysIso(checkIn, minStay) : addDaysIso(todayIso, minStay)}
                      value={checkOut}
                      onChange={(e) => onChangeDates(checkIn || todayIso, e.target.value)}
                      className="w-full h-11 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base font-medium text-[#1b1d20] tabular-nums"
                    />
                  </div>
                </div>

                {renderGuestSteppers()}

                {/* Live Quote Summary */}
                {renderPriceBreakdown()}

                {/* Guest Details */}
                <div className="space-y-3 pt-2 border-t border-[#efe9e0]">
                  <h4 className="type-nav font-semibold text-[#1b1d20]">Primary Guest Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block type-label text-[#1b1d20] mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Full legal name"
                        className="w-full h-11 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base text-[#1b1d20]"
                      />
                    </div>
                    <div>
                      <label className="block type-label text-[#1b1d20] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full h-11 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base text-[#1b1d20]"
                      />
                    </div>
                    <div>
                      <label className="block type-label text-[#1b1d20] mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="(916) 555-0140"
                        className="w-full h-11 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base text-[#1b1d20]"
                      />
                    </div>
                    <div>
                      <label className="block type-label text-[#1b1d20] mb-1">
                        Company / Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={employer}
                        onChange={(e) => setEmployer(e.target.value)}
                        placeholder="Optional corporate / relocation sponsor"
                        className="w-full h-11 px-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base text-[#1b1d20]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block type-label text-[#1b1d20] mb-1">
                      Arrival Timing &amp; Concierge Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Preferred arrival window, dietary preferences for chef/grocery service, or pet details..."
                      className="w-full p-3 bg-[#faf8f5] border border-[#dfd7cc] rounded-lg text-base text-[#1b1d20]"
                    />
                  </div>
                </div>

                {/* Settlement Method */}
                <div className="space-y-2.5 pt-2 border-t border-[#efe9e0]">
                  <span className="block type-label text-[#1b1d20]">Settlement Method</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('manual')}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        paymentMethod === 'manual'
                          ? 'bg-[#f4fbfa] border-[#00897d]'
                          : 'bg-white border-[#dfd7cc]'
                      }`}
                    >
                      <span className="type-support font-semibold text-[#1b1d20] block">
                        Bank Wire, ACH, or Zelle
                      </span>
                      <span className="type-support text-[#697076] block mt-0.5">
                        Holds dates as Awaiting Payment until transfer verification
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('unit_balance')}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        paymentMethod === 'unit_balance'
                          ? 'bg-[#f4fbfa] border-[#00897d]'
                          : 'bg-white border-[#dfd7cc]'
                      }`}
                    >
                      <span className="type-support font-semibold text-[#1b1d20] block">
                        Prepaid Lodging Units
                      </span>
                      <span className="type-support text-[#697076] block mt-0.5 tabular-nums">
                        {isSignedIn && customerUnitsBalance !== null
                          ? `Available balance: ${customerUnitsBalance} Units`
                          : 'Instant settlement for signed-in unit holders'}
                      </span>
                    </button>
                  </div>
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 type-support flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await handleAddBundleToCart();
                      onCloseBookingModal();
                    }}
                    disabled={!quote?.available || isMutating}
                    className="type-btn px-4 py-2.5 rounded-xl border border-[#dfd7cc] text-[#1b1d20] hover:bg-[#faf8f5] disabled:opacity-45 cursor-pointer whitespace-nowrap"
                  >
                    Add Bundle to Cart Instead
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onCloseBookingModal}
                      className="type-btn px-4 py-2.5 rounded-xl text-[#5c5046] hover:text-[#1b1d20] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingBooking || !quote?.available}
                      className="type-btn px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009b8e] disabled:opacity-50 text-white inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      {submittingBooking && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>
                        {paymentMethod === 'unit_balance'
                          ? 'Confirm with Lodging Units'
                          : 'Submit Reservation'}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
