import React, { useState, useMemo } from 'react';
import { US_VEHICLES, UsVehicle } from '../data/vehicleData';
import { Vehicle3DViewer } from './Vehicle3DViewer';
import { LivePhotoBackground } from './LivePhotoBackground';
import { useCart, LiveVehicleInventory } from '../context/CartContext';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  Zap,
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
    <div className="relative overflow-hidden py-12 sm:py-20 text-white text-left">
      <LivePhotoBackground scene="twilight" secondaryScene="courtyard" overlay="dark" />

      <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-[#4de0d2]">
            Interactive 3D Fleet · Airport &amp; Residence Delivery
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white">
            Private Vehicle Rentals for Every Trip
          </h2>

          <p className="text-sm sm:text-base text-[#ede5dc] leading-relaxed">
            Pair your stay—or book standalone transportation—with our curated fleet of late-model vehicles. Explore each car with interactive 3D orbit and zoom before reserving. Ideal for major US airport terminal arrivals, corporate travel, family road trips, or convenient executive commuting during an extended nationwide stay.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Fleet Vehicles (5)' },
              { id: 'suv', label: '7-Passenger & 4x4 SUV' },
              { id: 'crossover', label: 'European Crossover' },
              { id: 'sedan', label: 'Luxury & Sport Sedans' },
              { id: 'performance', label: 'High-Performance' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#00b7a8] text-white shadow-lg ring-2 ring-[#4de0d2]/60'
                    : 'bg-[#261f1a]/85 border border-[#45382f] text-[#e6dfd5] hover:bg-[#332922] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Selector Thumbnails Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredVehicles.map((v) => {
            const isSelected = v.id === selectedVehicleId;
            const liveV = liveFleetMap[v.id];
            const status = liveV?.inventoryStatus || 'available';
            const daily = liveV?.dailyRate || v.dailyRate;

            return (
              <button
                key={v.id}
                onClick={() => handleSelectVehicle(v)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-38 backdrop-blur-md ${
                  isSelected
                    ? 'bg-[#2c221b]/95 border-[#00b7a8] ring-2 ring-[#00b7a8]/45 shadow-xl'
                    : 'bg-[#211a15]/80 border-[#3f332b] hover:bg-[#2a211b]/90 hover:border-[#6e5849] text-[#e6dfd5]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4de0d2]">
                      {v.make}
                    </span>
                    <span
                      className={`text-[10px] font-bold flex items-center gap-0.5 ${
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
                  <h4 className="font-heading font-black text-sm text-white leading-tight">
                    {v.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-end justify-between tabular-nums">
                  <div>
                    <span className="text-[10px] text-[#c8b9a9] block">Daily</span>
                    <span className="text-sm font-bold text-white">${daily}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#4de0d2]">3D Studio →</span>
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
              <div className="p-3 bg-[#221b16]/88 backdrop-blur-md border border-[#3f332b] rounded-xl">
                <span className="text-[10px] text-[#c8b9a9] uppercase font-bold block">Powertrain</span>
                <span className="text-xs font-bold text-white mt-0.5 block truncate">{currentVehicle.specs.horsepower}</span>
              </div>
              <div className="p-3 bg-[#221b16]/88 backdrop-blur-md border border-[#3f332b] rounded-xl">
                <span className="text-[10px] text-[#c8b9a9] uppercase font-bold block">0–60 mph</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{currentVehicle.specs.acceleration}</span>
              </div>
              <div className="p-3 bg-[#221b16]/88 backdrop-blur-md border border-[#3f332b] rounded-xl">
                <span className="text-[10px] text-[#c8b9a9] uppercase font-bold block">Seating</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{currentVehicle.seating} Passengers</span>
              </div>
              <div className="p-3 bg-[#221b16]/88 backdrop-blur-md border border-[#3f332b] rounded-xl">
                <span className="text-[10px] text-[#c8b9a9] uppercase font-bold block">Cargo Capacity</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{currentVehicle.luggage} Large Bags</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Cart Configuration & Booking Card */}
          <div className="lg:col-span-5 bg-[#221b16]/92 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#3f332b] shadow-2xl space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#4de0d2]">{currentVehicle.category}</span>
                <span
                  className={`font-bold ${
                    currentStatus === 'available'
                      ? 'text-emerald-400'
                      : currentStatus === 'rented'
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {currentStatus === 'available'
                    ? 'Available for Delivery'
                    : currentStatus === 'rented'
                    ? 'Currently Rented'
                    : 'Scheduled Maintenance'}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
                {currentVehicle.name}
              </h3>
              <p className="text-xs text-[#ede5dc] leading-relaxed">
                {currentVehicle.description}
              </p>
            </div>

            {/* Rates Table */}
            <div className="bg-[#1a1410]/90 border border-[#3a2f28] rounded-2xl p-4 divide-y divide-white/10 text-xs tabular-nums">
              <div className="flex items-center justify-between pb-2.5">
                <span className="text-[#c8b9a9]">Daily Rate (1–6 Days)</span>
                <span className="text-sm font-bold text-white">${currentVehicle.dailyRate} / day</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#c8b9a9]">Weekly Tier (7–29 Days)</span>
                <span className="text-sm font-bold text-[#4de0d2]">${currentVehicle.weeklyRate} / week</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#c8b9a9]">Extended Monthly Tier (30+ Days)</span>
                <span className="text-sm font-bold text-emerald-400">${currentVehicle.monthlyRate} / month</span>
              </div>
              <div className="flex items-center justify-between pt-2.5">
                <span className="text-[#c8b9a9] flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#d4a987]" /> Prepaid Unit Equivalent (Monthly)
                </span>
                <span className="text-xs font-bold text-[#ede5dc]">
                  {Math.ceil(currentVehicle.monthlyRate / 100)} Units
                </span>
              </div>
            </div>

            {/* Instant Cart Configurator */}
            <div className="p-4 rounded-2xl bg-[#1a1410]/85 border border-[#3a2f28] space-y-3">
              <div className="flex items-center justify-between text-xs tabular-nums">
                <span className="font-bold text-[#ede5dc]">
                  Configure Rental
                </span>
                <span className="font-extrabold text-emerald-400">
                  Est. ${estimatedTotal.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#c8b9a9] mb-1">
                    Rental Duration
                  </label>
                  <select
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    disabled={!isAvailableForCart}
                    className="w-full h-9 px-2.5 bg-[#29201a] border border-[#4a3b31] rounded-lg text-xs font-semibold text-white outline-none focus:border-[#00b7a8]"
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
                  <label className="block text-[11px] font-semibold text-[#c8b9a9] mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    min={todayIso}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    disabled={!isAvailableForCart}
                    className="w-full h-9 px-2.5 bg-[#29201a] border border-[#4a3b31] rounded-lg text-xs font-semibold text-white outline-none focus:border-[#00b7a8]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <label className="flex items-center gap-2 text-xs text-[#ede5dc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={protectionPlan === 'executive_shield'}
                    onChange={(e) =>
                      setProtectionPlan(e.target.checked ? 'executive_shield' : 'standard')
                    }
                    disabled={!isAvailableForCart}
                    className="w-4 h-4 rounded accent-[#00b7a8]"
                  />
                  <span>Add Zero-Deductible Protection (+$18/day)</span>
                </label>
              </div>
            </div>

            {/* Key Inclusions */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#dfd3c5]">
                Included With Every Rental
              </h5>
              <div className="space-y-1.5 text-xs text-[#ede5dc]">
                {currentVehicle.features.slice(0, 4).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#4de0d2] shrink-0 mt-0.5" />
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
                className={`w-full py-3.5 px-6 font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed ${
                  !isAvailableForCart
                    ? 'bg-[#362c25] text-[#8a7a6c]'
                    : justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#00b7a8] hover:bg-[#009e91] text-white'
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
                className="w-full py-3 px-6 bg-[#82634f] hover:bg-[#6e5240] disabled:bg-[#362c25] disabled:text-[#8a7a6c] text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-[#9b7a64]/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>
                  {currentStatus === 'maintenance'
                    ? 'In Scheduled Service'
                    : 'Direct Standalone Fleet Booking'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#c8b9a9] pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complimentary SMF airport or residence delivery · Bundle with stays or promo codes in Cart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
