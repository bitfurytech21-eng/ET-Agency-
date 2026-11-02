import React, { useState, useMemo } from 'react';
import { US_VEHICLES, UsVehicle } from '../data/vehicleData';
import { getVehicleImage } from '../data/fleetImages';
import { Vehicle3DViewer } from './Vehicle3DViewer';
import { LivePhotoBackground } from './LivePhotoBackground';
import { useCart, LiveVehicleInventory } from '../context/CartContext';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  Coins,
  ShoppingBag,
} from 'lucide-react';

interface VehiclesSectionProps {
  onReserveVehicle: (vehicle: UsVehicle, selectedColorHex: string) => void;
  onNavigate?: (view: string) => void;
}

export const VehiclesSection: React.FC<VehiclesSectionProps> = ({ onReserveVehicle }) => {
  const { addItem, liveVehicles, isMutating } = useCart();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(US_VEHICLES[0].id);
  const [selectedColorHex, setSelectedColorHex] = useState<string>(US_VEHICLES[0].defaultColor);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [rentalDays, setRentalDays] = useState<number>(7);
  const [pickupDate, setPickupDate] = useState<string>('');
  const [protectionPlan, setProtectionPlan] = useState<'standard' | 'executive_shield'>('standard');
  const [justAdded, setJustAdded] = useState(false);

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);

  const liveFleetMap = useMemo(() => {
    const map: Record<string, LiveVehicleInventory> = {};
    for (const v of liveVehicles) {
      map[v.id] = v;
    }
    return map;
  }, [liveVehicles]);

  const rawVehicle = US_VEHICLES.find((v) => v.id === selectedVehicleId) || US_VEHICLES[0];
  const liveInfo = liveFleetMap[rawVehicle.id];
  const currentVehicle: UsVehicle = liveInfo
    ? {
        ...rawVehicle,
        dailyRate: liveInfo.dailyRate || rawVehicle.dailyRate,
        weeklyRate: liveInfo.weeklyRate || rawVehicle.weeklyRate,
        monthlyRate: liveInfo.monthlyRate || rawVehicle.monthlyRate,
      }
    : rawVehicle;

  const currentStatus = liveInfo?.inventoryStatus || 'available';
  const isAvailableForCart = currentStatus === 'available';

  const selectedColorObj = useMemo(
    () =>
      currentVehicle.availableColors.find((c) => c.hex.toLowerCase() === selectedColorHex.toLowerCase()) ||
      currentVehicle.availableColors[0],
    [currentVehicle, selectedColorHex],
  );

  const estimatedTotal = useMemo(() => {
    let base = currentVehicle.dailyRate * rentalDays;
    if (rentalDays >= 30) {
      base = Math.round((currentVehicle.monthlyRate / 30) * rentalDays);
    } else if (rentalDays >= 7) {
      base = Math.round((currentVehicle.weeklyRate / 7) * rentalDays);
    }
    const shield = protectionPlan === 'executive_shield' ? rentalDays * 18 : 0;
    return base + shield;
  }, [currentVehicle, rentalDays, protectionPlan]);

  const handleSelectVehicle = (vehicle: UsVehicle) => {
    setSelectedVehicleId(vehicle.id);
    setSelectedColorHex(vehicle.defaultColor);
    setJustAdded(false);
  };

  const handleAddVehicleToCart = async () => {
    if (!isAvailableForCart) return;
    const ok = await addItem(
      {
        referenceId: currentVehicle.id,
        itemType: 'vehicle',
        quantity: rentalDays,
        metadata: {
          billingUnit: 'day',
          pickupDate: pickupDate || undefined,
          pickupLocation: liveInfo?.hubLocation || 'Major US Airport Concierge Terminal Handover',
          exteriorColorName: selectedColorObj.name,
          exteriorColorHex: selectedColorObj.hex,
          protectionPlan,
        },
      },
      { openDrawerOnSuccess: true },
    );
    if (ok) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const filteredVehicles =
    activeCategory === 'all'
      ? US_VEHICLES
      : US_VEHICLES.filter((v) => {
          if (activeCategory === 'suv') return v.id === 'nissan-terra-2020';
          if (activeCategory === 'crossover') return v.id === 'skoda-karoq-2019';
          if (activeCategory === 'sedan') return v.id === 'audi-a3-2021' || v.id === 'vw-jetta-gli';
          if (activeCategory === 'performance') return v.id === 'audi-rs5-2019' || v.id === 'vw-jetta-gli';
          return true;
        });

  return (
    <div className="relative overflow-hidden py-14 sm:py-20 bg-[#0f172a] text-white text-left">
      <LivePhotoBackground scene="twilight" secondaryScene="courtyard" overlay="dark" />

      <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <span className="type-support font-semibold tracking-wide text-[#5eead4] block">
            Executive Fleet · Airport &amp; Residence Handover
          </span>

          <h1 className="type-h1 text-white">
            Private Car Rentals &amp; 3D Fleet Studio
          </h1>

          <p className="type-body text-slate-300">
            Pair your furnished stay—or reserve standalone executive mobility—with our curated fleet of late-model SUVs and European sport sedans. Review exterior photography, inspect every vehicle in interactive 360° 3D, and schedule terminal or residence driveway delivery.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {[
              { id: 'all', label: `All Fleet Vehicles (${US_VEHICLES.length})` },
              { id: 'suv', label: '7-Passenger 4x4 SUV' },
              { id: 'crossover', label: 'Executive Crossover' },
              { id: 'sedan', label: 'Luxury & Sport Sedans' },
              { id: 'performance', label: 'Grand Touring' },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`type-btn px-4 py-2 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-[#14616d] text-white border-[#14616d]'
                      : 'bg-[#1e293b]/90 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Realistic Fleet Photography Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredVehicles.map((v) => {
            const isSelected = v.id === selectedVehicleId;
            const liveV = liveFleetMap[v.id];
            const status = liveV?.inventoryStatus || 'available';
            const daily = liveV?.dailyRate || v.dailyRate;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectVehicle(v)}
                className={`group rounded-2xl text-left border cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1e293b] border-[#5eead4] ring-2 ring-[#14616d] shadow-lg'
                    : 'bg-[#1e293b]/80 border-slate-700/80 hover:bg-[#1e293b] hover:border-slate-500'
                }`}
              >
                <div className="w-full">
                  <div className="relative aspect-[4/3] w-full bg-[#0b1120] overflow-hidden">
                    <img
                      src={getVehicleImage(v.id)}
                      alt={`${v.name} commercial exterior`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover img-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/75 via-transparent to-transparent" />
                    <span
                      className={`absolute top-2.5 right-2.5 text-xs font-semibold px-2 py-0.5 rounded bg-[#0f172a]/85 backdrop-blur-xs capitalize ${
                        status === 'available'
                          ? 'text-emerald-400'
                          : status === 'rented'
                          ? 'text-amber-300'
                          : 'text-rose-300'
                      }`}
                    >
                      {status === 'available' ? 'Available' : status}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <div className="text-xs text-slate-400 font-medium">
                      {v.make} · {v.year} · {v.seating} Seats
                    </div>
                    <h4 className="text-base font-semibold text-white truncate">
                      {v.name}
                    </h4>
                  </div>
                </div>

                <div className="px-3.5 pb-3.5 pt-2.5 border-t border-slate-700/70 flex items-center justify-between tabular-nums w-full">
                  <div>
                    <span className="text-sm font-bold font-mono text-white">${daily}</span>
                    <span className="text-xs text-slate-400 ml-1">/ day</span>
                  </div>
                  <span className="text-xs font-semibold text-[#5eead4] whitespace-nowrap">
                    {isSelected ? 'Selected' : 'Inspect →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D Showcase & Detailed Booking Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive 3D Viewer + Key Mechanical Specs */}
          <div className="lg:col-span-7 space-y-4">
            <Vehicle3DViewer
              vehicle={currentVehicle}
              selectedColorHex={selectedColorHex}
              onColorChange={(hex) => setSelectedColorHex(hex)}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center tabular-nums">
              <div className="p-3.5 bg-[#1e293b]/90 border border-slate-700/80 rounded-xl">
                <span className="text-xs text-slate-400 font-medium block">Powertrain</span>
                <span className="text-sm font-semibold font-mono text-white mt-0.5 block truncate">
                  {currentVehicle.specs.horsepower}
                </span>
              </div>
              <div className="p-3.5 bg-[#1e293b]/90 border border-slate-700/80 rounded-xl">
                <span className="text-xs text-slate-400 font-medium block">0–60 mph</span>
                <span className="text-sm font-semibold font-mono text-white mt-0.5 block">
                  {currentVehicle.specs.acceleration}
                </span>
              </div>
              <div className="p-3.5 bg-[#1e293b]/90 border border-slate-700/80 rounded-xl">
                <span className="text-xs text-slate-400 font-medium block">Capacity</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">
                  {currentVehicle.seating} Passengers
                </span>
              </div>
              <div className="p-3.5 bg-[#1e293b]/90 border border-slate-700/80 rounded-xl">
                <span className="text-xs text-slate-400 font-medium block">Luggage</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">
                  {currentVehicle.luggage} Large Bags
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Configurator & Reservation Card */}
          <div className="lg:col-span-5 bg-[#1e293b] rounded-2xl p-6 sm:p-7 border border-slate-700 shadow-xl space-y-6">
            {/* Selected Vehicle Photo + Overview */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-700/80">
              <div className="w-24 h-18 rounded-xl overflow-hidden bg-[#0b1120] border border-slate-700 shrink-0">
                <img
                  src={getVehicleImage(currentVehicle.id)}
                  alt={currentVehicle.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-[#5eead4]">{currentVehicle.category}</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span
                    className={`font-semibold ${
                      currentStatus === 'available'
                        ? 'text-emerald-400'
                        : currentStatus === 'rented'
                        ? 'text-amber-300'
                        : 'text-rose-300'
                    }`}
                  >
                    {currentStatus === 'available'
                      ? 'Available'
                      : currentStatus === 'rented'
                      ? 'Rented'
                      : 'Maintenance'}
                  </span>
                </div>
                <h3 className="type-h3 text-white truncate">{currentVehicle.name}</h3>
              </div>
            </div>

            <p className="type-body text-slate-300">
              {currentVehicle.description}
            </p>

            {/* Rates Schedule */}
            <div className="type-support bg-[#0f172a] border border-slate-700/80 rounded-xl p-4 divide-y divide-slate-800 tabular-nums">
              <div className="flex items-center justify-between pb-2.5">
                <span className="text-slate-400">Daily Rate (1–6 Days)</span>
                <span className="text-sm font-bold font-mono text-white">
                  ${currentVehicle.dailyRate} / day
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">Weekly Corporate Tier (7–29 Days)</span>
                <span className="text-sm font-bold font-mono text-[#5eead4]">
                  ${currentVehicle.weeklyRate} / week
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">Extended Monthly Tier (30+ Days)</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  ${currentVehicle.monthlyRate.toLocaleString()} / month
                </span>
              </div>
              <div className="flex items-center justify-between pt-2.5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prepaid Unit Equivalent (Monthly)</span>
                </span>
                <span className="font-semibold font-mono text-slate-200">
                  {Math.ceil(currentVehicle.monthlyRate / 100)} Units
                </span>
              </div>
            </div>

            {/* Instant Cart Configurator */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0f172a] border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between gap-2 tabular-nums">
                <h4 className="type-label text-slate-200">
                  Configure Rental
                </h4>
                <span className="text-base font-bold font-mono text-white">
                  Est. ${estimatedTotal.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="type-label block text-slate-200 mb-1.5">
                    Rental Duration
                  </label>
                  <select
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    disabled={!isAvailableForCart}
                    className="w-full h-11 px-3 bg-[#1e293b] border border-slate-600 rounded-lg text-base font-medium text-white outline-none focus:border-[#5eead4]"
                  >
                    <option value={2}>2 Days (Weekend)</option>
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={7}>7 Days (1 Week Tier)</option>
                    <option value={14}>14 Days (2 Weeks)</option>
                    <option value={30}>30 Days (1 Month Tier)</option>
                  </select>
                </div>

                <div>
                  <label className="type-label block text-slate-200 mb-1.5">
                    Pick-Up Date
                  </label>
                  <input
                    type="date"
                    min={todayIso}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    disabled={!isAvailableForCart}
                    className="w-full h-11 px-3 bg-[#1e293b] border border-slate-600 rounded-lg text-base font-mono tabular-nums text-white outline-none focus:border-[#5eead4]"
                  />
                </div>
              </div>

              <label className="type-label flex items-center gap-2.5 text-slate-200 cursor-pointer pt-0.5 font-medium">
                <input
                  type="checkbox"
                  checked={protectionPlan === 'executive_shield'}
                  onChange={(e) =>
                    setProtectionPlan(e.target.checked ? 'executive_shield' : 'standard')
                  }
                  disabled={!isAvailableForCart}
                  className="w-4 h-4 rounded accent-[#14616d]"
                />
                <span>Add Zero-Deductible Protection (+$18/day)</span>
              </label>
            </div>

            {/* Key Inclusions */}
            <div className="space-y-2">
              <h4 className="type-label text-slate-200">
                Included With Every Rental
              </h4>
              <div className="type-support space-y-1.5 text-slate-300">
                {currentVehicle.features.slice(0, 4).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#5eead4] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 space-y-2.5">
              <button
                type="button"
                disabled={!isAvailableForCart || isMutating}
                onClick={handleAddVehicleToCart}
                className={`btn w-full min-h-[48px] text-sm ${
                  !isAvailableForCart
                    ? 'bg-slate-800 text-slate-500 border-slate-700'
                    : justAdded
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'btn-primary'
                }`}
              >
                {!isAvailableForCart ? (
                  <span>Unavailable ({currentStatus})</span>
                ) : justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {currentVehicle.name} to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={currentStatus === 'maintenance'}
                onClick={() => onReserveVehicle(currentVehicle, selectedColorHex)}
                className="btn w-full min-h-[44px] bg-white hover:bg-slate-100 text-[#0f172a] border border-slate-200 disabled:bg-slate-800 disabled:text-slate-500 group"
              >
                <span>
                  {currentStatus === 'maintenance'
                    ? 'In Scheduled Service'
                    : 'Direct Standalone Reservation'}
                </span>
                <ArrowRight className="w-4 h-4 btn-arrow" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complimentary airport or residence delivery included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
