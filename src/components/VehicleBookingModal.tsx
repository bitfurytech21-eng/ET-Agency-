import React, { useState, useEffect, useMemo } from 'react';
import { UsVehicle, US_VEHICLES } from '../data/vehicleData';
import { LivePhotoBackground } from './LivePhotoBackground';
import {
  X,
  Calendar,
  MapPin,
  Coins,
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Printer,
  ArrowRight,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface VehicleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: UsVehicle | null;
  initialColorHex?: string;
  onOpenPortal?: () => void;
  onNavigate?: (view: string) => void;
}

export const VehicleBookingModal: React.FC<VehicleBookingModalProps> = ({
  isOpen,
  onClose,
  initialVehicle,
  initialColorHex,
  onOpenPortal,
}) => {
  const { addItem, isMutating, liveVehicles } = useCart();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicle?.id || US_VEHICLES[0].id);
  const [selectedColorHex, setSelectedColorHex] = useState<string>(
    initialColorHex || initialVehicle?.defaultColor || US_VEHICLES[0].defaultColor,
  );
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [employer, setEmployer] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Major US Airport Hub Delivery (Airport Concierge Terminal Handover)');
  const [protectionPlan, setProtectionPlan] = useState<'standard' | 'executive_shield'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'manual_wire' | 'unit_balance'>('manual_wire');
  const [notes, setNotes] = useState('');

  const [portalToken, setPortalToken] = useState<string | null>(null);
  const [portalUnitsBalance, setPortalUnitsBalance] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    id: string;
    vehicleName: string;
    colorName: string;
    pickupDate: string;
    returnDate: string;
    totalDays: number;
    totalUsd: number;
    unitsRequired: number;
    settledWithUnits: boolean;
    remainingUnits?: number;
    pickupLocation: string;
  } | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const currentVehicle = useMemo(
    () => US_VEHICLES.find((v) => v.id === selectedVehicleId) || US_VEHICLES[0],
    [selectedVehicleId],
  );

  const selectedColorObj = useMemo(
    () =>
      currentVehicle.availableColors.find((c) => c.hex.toLowerCase() === selectedColorHex.toLowerCase()) ||
      currentVehicle.availableColors[0],
    [currentVehicle, selectedColorHex],
  );

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    setConfirmation(null);

    if (initialVehicle) {
      setSelectedVehicleId(initialVehicle.id);
      setSelectedColorHex(initialColorHex || initialVehicle.defaultColor);
    }

    const start = new Date();
    start.setDate(start.getDate() + 2);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    setPickupDate(start.toISOString().split('T')[0]);
    setReturnDate(end.toISOString().split('T')[0]);

    const storedToken = localStorage.getItem('etl_php_token');
    setPortalToken(storedToken);
    if (storedToken) {
      fetch('/api/php/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: storedToken }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.customer) {
            setCustomerName((prev) => prev || data.customer.name || '');
            setCustomerEmail((prev) => prev || data.customer.email || '');
            setCustomerPhone((prev) => prev || data.customer.phone || '');
            setEmployer((prev) => prev || data.customer.company || '');
            setPortalUnitsBalance(Number(data.customer.units_balance || 0));
          }
        })
        .catch(() => {});
    }
  }, [isOpen, initialVehicle, initialColorHex]);

  const pricing = useMemo(() => {
    if (!pickupDate || !returnDate) {
      return { totalDays: 7, rateTier: 'weekly', baseUsd: currentVehicle.weeklyRate, shieldUsd: 0, totalUsd: currentVehicle.weeklyRate, unitsRequired: Math.ceil(currentVehicle.weeklyRate / 100) };
    }
    const s = new Date(pickupDate);
    const e = new Date(returnDate);
    const diff = Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000));

    let rateTier = 'Daily Tier';
    let baseUsd = currentVehicle.dailyRate * diff;
    if (diff >= 30) {
      rateTier = 'Monthly Midterm Bundle';
      baseUsd = Math.round((currentVehicle.monthlyRate / 30) * diff);
    } else if (diff >= 7) {
      rateTier = 'Weekly Corporate Tier';
      baseUsd = Math.round((currentVehicle.weeklyRate / 7) * diff);
    }
    const shieldUsd = protectionPlan === 'executive_shield' ? diff * 18 : 0;
    const totalUsd = baseUsd + shieldUsd;
    const unitsRequired = Math.max(1, Math.ceil(totalUsd / 100));

    return { totalDays: diff, rateTier, baseUsd, shieldUsd, totalUsd, unitsRequired };
  }, [pickupDate, returnDate, currentVehicle, protectionPlan]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter your full name, email address, and phone number.');
      return;
    }
    if (!pickupDate || !returnDate || new Date(returnDate) <= new Date(pickupDate)) {
      setErrorMsg('Return date must be after your pickup date.');
      return;
    }
    if (paymentMethod === 'unit_balance' && (!portalToken || (portalUnitsBalance ?? 0) < pricing.unitsRequired)) {
      setErrorMsg(
        `Insufficient Client Portal unit balance (${portalUnitsBalance ?? 0} available, ${pricing.unitsRequired} required). Choose Corporate Invoice / Wire or recharge units in Client Portal.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/vehicle-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: currentVehicle.id,
          exteriorColorName: selectedColorObj.name,
          exteriorColorHex: selectedColorObj.hex,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          employer: employer.trim() || undefined,
          pickupDate,
          returnDate,
          pickupLocation,
          protectionPlan,
          paymentMethod,
          customerToken: paymentMethod === 'unit_balance' ? portalToken : undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Unable to submit vehicle reservation.');
      }

      setConfirmation({
        id: data.booking?.id || `vbk_${Date.now().toString().slice(-6)}`,
        vehicleName: currentVehicle.name,
        colorName: selectedColorObj.name,
        pickupDate,
        returnDate,
        totalDays: pricing.totalDays,
        totalUsd: pricing.totalUsd,
        unitsRequired: pricing.unitsRequired,
        settledWithUnits: Boolean(data.settledWithUnits),
        remainingUnits: data.remainingUnits,
        pickupLocation,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Reservation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1c1613]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white text-[#282828] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-[#e6dfd5] shadow-2xl overflow-hidden text-left">
        {/* Header with Live Realistic Twilight Arrival Photo */}
        <div className="relative overflow-hidden px-6 sm:px-8 py-6 border-b border-[#3a2f28] text-white shrink-0">
          <LivePhotoBackground scene="twilight" overlay="espresso" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#4de0d2]">
                Fleet Rental &amp; Concierge Delivery
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                Reserve {currentVehicle.year} {currentVehicle.name}
              </h2>
              <p className="text-xs text-[#ede5dc]">
                Complimentary SMF airport handover or direct delivery to your Rancho Cordova residence.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-[#ede5dc] hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-[#fcfaf7]">
          {confirmation ? (
            <div className="py-4 space-y-6 text-center">
              <div className="w-16 h-16 bg-[#e8f8f6] border border-[#b8ebe5] text-[#00897d] rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00897d]">
                  {confirmation.settledWithUnits
                    ? 'Payment Verified via Prepaid Lodging Units'
                    : 'Reservation Request Logged — Awaiting Transfer Settlement'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-[#282828]">
                  {confirmation.settledWithUnits
                    ? `${confirmation.vehicleName} Confirmed!`
                    : `${confirmation.vehicleName} Held Pending Payment`}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5046] max-w-lg mx-auto">
                  Reference <strong className="font-mono text-[#00897d]">{confirmation.id}</strong> has been created for{' '}
                  <strong className="text-[#282828]">{customerName}</strong> ({customerEmail}).
                </p>
              </div>

              <div className="bg-white border border-[#e6dfd5] rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3 text-xs shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#efe9e0] pb-2.5">
                  <span className="text-[#857568] uppercase font-bold">Reservation ID</span>
                  <span className="font-mono font-bold text-[#00897d] text-sm">{confirmation.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 tabular-nums">
                  <div>
                    <span className="text-[#857568] block">Vehicle &amp; Finish</span>
                    <span className="font-bold text-[#282828]">{confirmation.colorName}</span>
                  </div>
                  <div>
                    <span className="text-[#857568] block">Duration</span>
                    <span className="font-bold text-[#282828]">{confirmation.totalDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[#857568] block">Pickup Date</span>
                    <span className="font-bold text-[#282828]">{confirmation.pickupDate}</span>
                  </div>
                  <div>
                    <span className="text-[#857568] block">Return Date</span>
                    <span className="font-bold text-[#282828]">{confirmation.returnDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#857568] block">Concierge Delivery Point</span>
                    <span className="font-bold text-[#282828]">{confirmation.pickupLocation}</span>
                  </div>
                </div>
                <div className="pt-2.5 border-t border-[#efe9e0] flex items-center justify-between tabular-nums">
                  <span className="text-[#5c5046] font-bold">Total Rental Value</span>
                  <span className="text-base font-black text-[#00897d]">
                    ${confirmation.totalUsd.toLocaleString()} USD ({confirmation.unitsRequired} Units)
                  </span>
                </div>
                {confirmation.settledWithUnits && confirmation.remainingUnits !== undefined && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                    <Coins className="w-4 h-4 shrink-0" />
                    <span>
                      Paid with {confirmation.unitsRequired} Lodging Units • Remaining Balance:{' '}
                      <strong className="tabular-nums">{confirmation.remainingUnits} Units</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl border border-[#d8cfc3] text-[#5c5046] hover:bg-[#f4efe9] text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Summary
                </button>
                {onOpenPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPortal();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <span>View in Client Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#82634f] hover:bg-[#6e5240] text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Vehicle & Exterior Paint Selector */}
              <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl space-y-3 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Selected Fleet Model
                    </label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => {
                        const next = US_VEHICLES.find((v) => v.id === e.target.value) || US_VEHICLES[0];
                        setSelectedVehicleId(next.id);
                        setSelectedColorHex(next.defaultColor);
                      }}
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#d8cfc3] rounded-xl text-xs font-bold text-[#282828] outline-none focus:border-[#00b7a8]"
                    >
                      {US_VEHICLES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.year} {v.name} — ${v.dailyRate}/day • ${v.weeklyRate}/wk
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#857568] mb-1">
                      Exterior Finish: <span className="text-[#282828]">{selectedColorObj.name}</span>
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      {currentVehicle.availableColors.map((col) => {
                        const active = col.hex.toLowerCase() === selectedColorObj.hex.toLowerCase();
                        return (
                          <button
                            key={col.name}
                            type="button"
                            onClick={() => setSelectedColorHex(col.hex)}
                            title={col.name}
                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform ${
                              active ? 'border-[#282828] scale-110 ring-2 ring-[#00b7a8]' : 'border-[#c8bbaa] opacity-85 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: col.hex }}
                          >
                            {active && <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">Pickup / Delivery Date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">Return Date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                    <input
                      type="date"
                      required
                      min={pickupDate || todayStr}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#282828] mb-1">
                    Concierge Delivery / Handover Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#00897d] pointer-events-none" />
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                    >
                      <option value="Major US Airport Hub Delivery (Airport Concierge Terminal Handover)">
                        Major US Airport Hub Delivery (Airport Concierge Terminal Handover)
                      </option>
                      <option value="Direct Residence Curbside Delivery (Delivered to Your Reserved Furnished Suite)">
                        Direct Residence Curbside Delivery (Delivered to Your Reserved Furnished Suite)
                      </option>
                      <option value="Executive Dispatch Hub &amp; Private FBO Jet Center Delivery">
                        Executive Dispatch Hub &amp; Private FBO Jet Center Delivery
                      </option>
                      <option value="Corporate Campus &amp; Office Delivery (Nationwide)">
                        Corporate Campus &amp; Office Delivery (Nationwide)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">Primary Driver Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Dr. Marcus Vance"
                      className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="client@easytravellodging.com"
                      className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">Mobile Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="916-800-3295"
                      className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">Organization or Company (Optional)</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#857568] pointer-events-none" />
                    <input
                      type="text"
                      value={employer}
                      onChange={(e) => setEmployer(e.target.value)}
                      placeholder="Personal Trip, Family Visit, or Company"
                      className="w-full pl-9 pr-3 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                </div>
              </div>

              {/* Coverage & Payment Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#282828]">Protection Package</label>
                  <button
                    type="button"
                    onClick={() => setProtectionPlan('standard')}
                    className={`w-full p-3 rounded-xl border text-left text-xs cursor-pointer transition-all ${
                      protectionPlan === 'standard'
                        ? 'bg-[#e8f8f6] border-[#00b7a8] text-[#282828]'
                        : 'bg-white border-[#e6dfd5] text-[#5c5046]'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>Standard Comprehensive Coverage</span>
                      <span className="text-emerald-700">Included</span>
                    </div>
                    <span className="text-[11px] text-[#6e5f53] block mt-0.5">
                      Comprehensive liability &amp; 24/7 roadside support
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProtectionPlan('executive_shield')}
                    className={`w-full p-3 rounded-xl border text-left text-xs cursor-pointer transition-all ${
                      protectionPlan === 'executive_shield'
                        ? 'bg-[#e8f8f6] border-[#00b7a8] text-[#282828]'
                        : 'bg-white border-[#e6dfd5] text-[#5c5046]'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>Zero-Deductible Protection Shield</span>
                      <span className="text-[#00897d] tabular-nums">+$18/day</span>
                    </div>
                    <span className="text-[11px] text-[#6e5f53] block mt-0.5">
                      $0 glass/tire/collision deductible + Sierra winter kit
                    </span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#282828]">Settlement Method</label>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('manual_wire')}
                    className={`w-full p-3 rounded-xl border text-left text-xs cursor-pointer transition-all ${
                      paymentMethod === 'manual_wire'
                        ? 'bg-[#f5efe8] border-[#82634f] text-[#282828]'
                        : 'bg-white border-[#e6dfd5] text-[#5c5046]'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>Bank Wire, ACH, or Zelle Invoice</span>
                      <span className="text-[#82634f]">Hold Now</span>
                    </div>
                    <span className="text-[11px] text-[#6e5f53] block mt-0.5">
                      Reserve vehicle now · Confirmed once transfer is verified
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('unit_balance')}
                    className={`w-full p-3 rounded-xl border text-left text-xs cursor-pointer transition-all ${
                      paymentMethod === 'unit_balance'
                        ? 'bg-[#e8f8f6] border-[#00b7a8] text-[#282828]'
                        : 'bg-white border-[#e6dfd5] text-[#5c5046]'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>Pay with Client Portal Units</span>
                      <span className="text-[#00897d] tabular-nums">{pricing.unitsRequired} Units</span>
                    </div>
                    <span className="text-[11px] text-[#6e5f53] block mt-0.5">
                      {portalUnitsBalance !== null
                        ? `Signed in • Available Balance: ${portalUnitsBalance} Units`
                        : 'Requires active sign-in on Client Portal'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Flight Number / Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. United UA 1492 arriving SMF at 3:15 PM, or park in Unit 173 stall #B"
                  className="w-full px-3.5 h-10 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>

              {/* Live Rate Summary Footer */}
              <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 tabular-nums shadow-2xs">
                <div className="space-y-0.5 text-xs">
                  <div className="text-[#6e5f53]">
                    <strong className="text-[#282828]">{pricing.totalDays} Days</strong> • {pricing.rateTier}
                    {pricing.shieldUsd > 0 ? ` + $${pricing.shieldUsd} Shield` : ''}
                  </div>
                  <div className="text-lg font-heading font-black text-[#282828]">
                    ${pricing.totalUsd.toLocaleString()} USD{' '}
                    <span className="text-xs font-semibold text-[#82634f]">
                      (or {pricing.unitsRequired} Lodging Units)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    disabled={
                      isMutating ||
                      liveVehicles.find((lv) => lv.id === currentVehicle.id)?.inventoryStatus === 'rented' ||
                      liveVehicles.find((lv) => lv.id === currentVehicle.id)?.inventoryStatus === 'maintenance'
                    }
                    onClick={async () => {
                      const ok = await addItem(
                        {
                          referenceId: currentVehicle.id,
                          itemType: 'vehicle',
                          quantity: pricing.totalDays,
                          metadata: {
                            billingUnit: 'day',
                            pickupDate: pickupDate || undefined,
                            pickupLocation,
                            exteriorColorName: selectedColorObj.name,
                            exteriorColorHex: selectedColorObj.hex,
                            protectionPlan,
                          },
                        },
                        { openDrawerOnSuccess: true },
                      );
                      if (ok) onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#82634f] hover:bg-[#6e5240] disabled:bg-[#e6dfd5] disabled:text-[#857568] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-60 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {paymentMethod === 'unit_balance'
                            ? `Verify & Pay (${pricing.unitsRequired} Units)`
                            : 'Submit Reservation'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
