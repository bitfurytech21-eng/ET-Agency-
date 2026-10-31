import React, { useState } from 'react';
import { US_VEHICLES, UsVehicle } from '../data/vehicleData';
import { Vehicle3DViewer } from './Vehicle3DViewer';
import { 
  Car, 
  Fuel, 
  Gauge, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Check, 
  ArrowRight,
  Zap,
  Flame,
  Crown
} from 'lucide-react';

interface VehiclesSectionProps {
  onReserveVehicle: (vehicleName: string, vehicleId: string) => void;
}

export const VehiclesSection: React.FC<VehiclesSectionProps> = ({ onReserveVehicle }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(US_VEHICLES[0].id);
  const [selectedColorHex, setSelectedColorHex] = useState<string>(US_VEHICLES[0].defaultColor);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const currentVehicle = US_VEHICLES.find((v) => v.id === selectedVehicleId) || US_VEHICLES[0];

  const handleSelectVehicle = (vehicle: UsVehicle) => {
    setSelectedVehicleId(vehicle.id);
    setSelectedColorHex(vehicle.defaultColor);
  };

  const filteredVehicles = activeCategory === 'all' 
    ? US_VEHICLES 
    : US_VEHICLES.filter(v => {
        if (activeCategory === 'electric') return v.style3d.isElectric;
        if (activeCategory === 'muscle') return v.style3d.bodyShape === 'muscle';
        if (activeCategory === 'luxury') return v.style3d.bodyShape === 'luxury_suv';
        if (activeCategory === 'offroad') return v.style3d.bodyShape === 'offroad';
        return true;
      });

  return (
    <div className="py-12 sm:py-20 bg-slate-900 text-white text-left">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Car className="w-3.5 h-3.5" />
            <span>Sacramento Premium Fleet &amp; Extended Stays</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white">
            American Fleet &amp; Vehicle Rentals
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Elevate your Sacramento assignment with our curated fleet of authentic American vehicles. Every rental includes airport delivery, comprehensive insurance coverage, and seamless billing integrated directly with your housing lease.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All American Vehicles' },
              { id: 'muscle', label: 'Muscle & Convertibles' },
              { id: 'electric', label: 'Pure Electric' },
              { id: 'luxury', label: 'Executive Luxury SUVs' },
              { id: 'offroad', label: '4x4 Adventure' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
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
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVehicle(v)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-36 ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/50 shadow-xl'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                      {v.make}
                    </span>
                    {v.style3d.isElectric && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" /> EV
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-black text-sm text-white leading-tight">
                    {v.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Daily</span>
                    <span className="text-sm font-bold text-white">${v.dailyRate}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-400">3D View →</span>
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Engine / Power</span>
                <span className="text-xs font-bold text-white mt-0.5 block truncate">{currentVehicle.specs.horsepower}</span>
              </div>
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Acceleration</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{currentVehicle.specs.acceleration}</span>
              </div>
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Passenger Capacity</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{currentVehicle.seating} Adults</span>
              </div>
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Luggage Space</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{currentVehicle.luggage} Large Bags</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="lg:col-span-5 bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {currentVehicle.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
                {currentVehicle.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentVehicle.description}
              </p>
            </div>

            {/* Rates Table */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 divide-y divide-slate-800 text-xs">
              <div className="flex items-center justify-between pb-3">
                <span className="text-slate-400">Daily Rate (3–6 Days)</span>
                <span className="text-sm font-bold text-white">${currentVehicle.dailyRate} / day</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400">Weekly Rate (7+ Days)</span>
                <span className="text-sm font-bold text-blue-400">${currentVehicle.weeklyRate} / week</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400">Monthly Midterm Bundle (30+ Days)</span>
                <span className="text-sm font-bold text-emerald-400">${currentVehicle.monthlyRate} / month</span>
              </div>
            </div>

            {/* Key Inclusions */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Vehicle Provisions &amp; Inclusions:
              </h5>
              <div className="space-y-1.5 text-xs text-slate-300">
                {currentVehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservation Call to Action */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => onReserveVehicle(currentVehicle.name, currentVehicle.id)}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Reserve {currentVehicle.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero deposit hold on inquiry • Free airport / unit delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
