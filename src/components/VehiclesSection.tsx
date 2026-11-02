import React, { useState, useMemo } from 'react';
import { US_VEHICLES, UsVehicle } from '../data/vehicleData';
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
import { ScrollReveal } from './common/ScrollReveal';

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
    <div className="relative overflow-hidden py-12 sm:py-20 text-white text-left">
      <LivePhotoBackground scene="twilight" secondaryScene="courtyard" overlay="dark" />

      <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-[#4de0d2] backdrop-blur-xs">
            <span>Executive Fleet · Airport &amp; Residence Handover</span>
          </div>

          <h2 className="type-h2 text-white">
            Private Vehicle Rentals for Every Journey
          </h2>

          <p className="type-body text-[#e2ded6]">
            Pair your stay—or reserve standalone transportation—with our curated fleet of late-model vehicles. Explore each car with interactive 3D orbit and zoom before reserving. Ideal for major US airport terminal arrivals, corporate travel, family road trips, or convenient executive commuting during an extended nationwide stay.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {[
              { id: 'all', label: 'All Fleet Vehicles (5)' },
              { id: 'suv', label: '7-Passenger & 4x4 SUV' },
              { id: 'crossover', label: 'European Crossover' },
              { id: 'sedan', label: 'Luxury & Sport Sedans' },
              { id: 'performance', label: 'High-Performance' },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#14616d] text-white border-[#14616d] shadow-sm'
                      : 'bg-[#1e1713]/85 border-[#3d2f25] text-[#d6cdc2] hover:border-[#966746] hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vehicle Selector Thumbnails Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {filteredVehicles.map((v) => {
            const isSelected = v.id === selectedVehicleId;
            const liveV = liveFleetMap[v.id];
            const status = liveV?.inventoryStatus || 'available';
            const daily = liveV?.dailyRate || v.dailyRate;

            return (
              <button
                key={v.id}
                onClick={() => handleSelectVehicle(v)}
                className={`group p-4 rounded-2xl text-left border cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-40 gap-3 backdrop-blur-md transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#251d17]/95 border-[#14616d] ring-2 ring-[#14616d]/50 shadow-xl -translate-y-0.5'
                    : 'bg-[#1b140f]/80 border-[#382b22] hover:bg-[#251d17]/90 hover:border-[#5a4537] hover:-translate-y-1 text-[#e2ded6]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#4de0d2] uppercase tracking-wider">
                      {v.make}
                    </span>
                    <span
                      className={`text-xs font-semibold capitalize ${
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
                  <h4 className="type-h4 text-white">
                    {v.name}
                  </h4>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-end justify-between tabular-nums">
                  <div>
                    <span className="type-support text-xs text-[#b8a898] block">Daily Rate</span>
                    <span className="text-base font-bold font-mono text-white">${daily}</span>
                  </div>
                  <span className="type-support text-xs font-semibold text-[#4de0d2] whitespace-nowrap inline-flex items-center gap-1">
                    <span>3D Studio</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D Showcase & Detailed Specs Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive 3D Viewer */}
          <div className="lg:col-span-7 space-y-4">
            <Vehicle3DViewer
              vehicle={currentVehicle}
              selectedColorHex={selectedColorHex}
              onColorChange={(hex) => setSelectedColorHex(hex)}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center tabular-nums">
              <div className="p-3.5 bg-[#1b140f]/90 backdrop-blur-md border border-[#382b22] rounded-xl">
                <span className="type-support text-xs text-[#b8a898] font-medium block">Powertrain</span>
                <span className="text-sm font-semibold font-mono text-white mt-0.5 block truncate">{currentVehicle.specs.horsepower}</span>
              </div>
              <div className="p-3.5 bg-[#1b140f]/90 backdrop-blur-md border border-[#382b22] rounded-xl">
                <span className="type-support text-xs text-[#b8a898] font-medium block">0–60 mph</span>
                <span className="text-sm font-semibold font-mono text-white mt-0.5 block">{currentVehicle.specs.acceleration}</span>
              </div>
              <div className="p-3.5 bg-[#1b140f]/90 backdrop-blur-md border border-[#382b22] rounded-xl">
                <span className="type-support text-xs text-[#b8a898] font-medium block">Seating</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{currentVehicle.seating} Passengers</span>
              </div>
              <div className="p-3.5 bg-[#1b140f]/90 backdrop-blur-md border border-[#382b22] rounded-xl">
                <span className="type-support text-xs text-[#b8a898] font-medium block">Cargo Capacity</span>
                <span className="text-sm font-semibold text-white mt-0.5 block">{currentVehicle.luggage} Large Bags</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Cart Configuration & Booking Card */}
          <div className="lg:col-span-5 bg-[#1e1712]/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#3d2f25] shadow-2xl space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 type-support text-xs">
                <span className="font-semibold text-[#4de0d2] uppercase tracking-wider">{currentVehicle.category}</span>
                <span
                  className={`font-semibold capitalize ${
                    currentStatus === 'available'
                      ? 'text-emerald-400'
                      : currentStatus === 'rented'
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {currentStatus === 'available'
                    ? 'Available for Handover'
                    : currentStatus === 'rented'
                    ? 'Currently Rented'
                    : 'Scheduled Maintenance'}
                </span>
              </div>
              <h3 className="type-h3 text-white">
                {currentVehicle.name}
              </h3>
              <p className="type-body text-[#d6cdc2]">
                {currentVehicle.description}
              </p>
            </div>

            {/* Rates Table */}
            <div className="bg-[#140e0a]/90 border border-[#33261e] rounded-xl p-4 divide-y divide-white/10 type-support tabular-nums text-xs">
              <div className="flex items-center justify-between pb-2.5">
                <span className="text-[#b8a898]">Daily Rate (1–6 Days)</span>
                <span className="text-sm sm:text-base font-bold font-mono text-white">${currentVehicle.dailyRate} / day</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#b8a898]">Weekly Tier (7–29 Days)</span>
                <span className="text-sm sm:text-base font-bold font-mono text-[#4de0d2]">${currentVehicle.weeklyRate} / week</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#b8a898]">Extended Monthly Tier (30+ Days)</span>
                <span className="text-sm sm:text-base font-bold font-mono text-emerald-400">${currentVehicle.monthlyRate} / month</span>
              </div>
              <div className="flex items-center justify-between pt-2.5">
                <span className="text-[#b8a898] flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#d4a987]" /> Prepaid Unit Equivalent (Monthly)
                </span>
                <span className="font-semibold font-mono text-[#e2ded6]">
                  {Math.ceil(currentVehicle.monthlyRate / 100)} Units
                </span>
              </div>
            </div>

            {/* Instant Cart Configurator */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#140e0a]/85 border border-[#33261e] space-y-4">
              <div className="flex items-center justify-between gap-2 tabular-nums">
                <h4 className="type-label text-xs uppercase tracking-wider font-bold text-[#e2ded6]">
                  Configure Rental
                </h4>
                <span className="text-base font-bold font-mono tracking-tight text-emerald-400">
                  Est. ${estimatedTotal.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#b8a898] mb-1.5">
                    Rental Duration
                  </label>
                  <select
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    disabled={!isAvailableForCart}
                    className="w-full h-11 px-3 bg-[#241a13] border border-[#443327] rounded-xl text-xs sm:text-sm font-medium text-white outline-none focus:border-[#14616d]"
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
                  <label className="block text-xs font-semibold text-[#b8a898] mb-1.5">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    min={todayIso}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    disabled={!isAvailableForCart}
                    className="w-full h-11 px-3 bg-[#241a13] border border-[#443327] rounded-xl text-xs sm:text-sm font-medium text-white outline-none focus:border-[#14616d]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <label className="flex items-center gap-2.5 type-support text-xs text-[#d6cdc2] cursor-pointer">
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
            </div>

            {/* Key Inclusions */}
            <div className="space-y-2.5">
              <h4 className="type-label text-xs uppercase tracking-wider font-bold text-[#b8a898]">
                Included With Every Rental
              </h4>
              <div className="space-y-2 type-support text-xs text-[#d6cdc2]">
                {currentVehicle.features.slice(0, 4).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#4de0d2] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 space-y-3">
              <button
                type="button"
                disabled={!isAvailableForCart || isMutating}
                onClick={handleAddVehicleToCart}
                className={`btn w-full min-h-[48px] text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed ${
                  !isAvailableForCart
                    ? 'bg-[#2f221a] text-[#8a7a6c] border-[#2f221a]'
                    : justAdded
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'btn-primary shadow-md'
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
                className="btn group w-full min-h-[44px] bg-[#966746] hover:bg-[#7e5539] disabled:bg-[#2f221a] disabled:text-[#8a7a6c] text-white text-sm font-semibold border border-[#966746]/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {currentStatus === 'maintenance'
                    ? 'In Scheduled Service'
                    : 'Direct Standalone Fleet Booking'}
                </span>
                <ArrowRight className="w-4 h-4 btn-arrow" />
              </button>

              <div className="flex items-center justify-center gap-2 type-support text-xs text-[#b8a898] pt-1 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complimentary airport or residence delivery · Bundling supported in Cart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
