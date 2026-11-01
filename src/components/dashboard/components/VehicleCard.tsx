import React from 'react';
import { UserCarRentalBooking } from '../types';
import { StatusBadge } from './StatusBadge';
import { Car, MapPin, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

interface VehicleCardProps {
  rental: UserCarRentalBooking;
  onViewDetails: (rental: UserCarRentalBooking) => void;
  onRequestModification?: (rental: UserCarRentalBooking) => void;
  onRequestCancellation?: (rental: UserCarRentalBooking) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  rental,
  onViewDetails,
  onRequestModification,
  onRequestCancellation,
}) => {
  return (
    <div className="bg-white border border-[#e6dfd5] rounded-2xl p-5 hover:border-[#00b7a8] transition-all shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#efe9e0] pb-3.5">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-xl bg-[#1f1915] flex items-center justify-center text-white shrink-0 relative overflow-hidden border border-[#3f332b]">
            <Car className="w-8 h-8 text-[#00b7a8]" />
            <div
              className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white"
              style={{ backgroundColor: rental.colorHex }}
              title={rental.colorName}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[#82634f] bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e6dfd5]">
                {rental.id}
              </span>
              <StatusBadge status={rental.status} size="sm" />
            </div>
            <h4 className="font-heading font-black text-base text-[#282828] leading-tight">
              {rental.year} {rental.vehicleName}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-[#5c5046]">
              <span className="text-[#00897d] font-bold">{rental.category}</span>
              <span>• Finish: {rental.colorName}</span>
            </div>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-[11px] text-[#857568] uppercase font-bold block">Total Rental</span>
          <span className="text-base font-black text-[#00897d] tabular-nums">
            ${rental.totalUsd.toLocaleString()} USD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-[#faf8f5] p-3 rounded-xl border border-[#efe9e0]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#857568] block">Pickup Date</span>
          <div className="flex items-center gap-1 font-semibold text-[#282828] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#00b7a8]" />
            <span>{rental.pickupDate}</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#857568] block">Return Date</span>
          <div className="flex items-center gap-1 font-semibold text-[#282828] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#82634f]" />
            <span>{rental.returnDate}</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#857568] block">Delivery Location</span>
          <div className="flex items-center gap-1 font-semibold text-[#282828] mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#00897d] shrink-0" />
            <span className="truncate">{rental.pickupLocation}</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#857568] block">Protection Tier</span>
          <div className="flex items-center gap-1 font-semibold text-[#282828] mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{rental.protectionPlan === 'executive_shield' ? 'Executive Zero-Deductible' : 'Standard'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="text-xs text-[#5c5046]">
          <span>Primary Driver: <strong>{rental.primaryDriver}</strong></span>
          {rental.flightNumber && <span className="ml-2 font-mono">Flight: {rental.flightNumber}</span>}
        </div>

        <div className="flex items-center gap-2">
          {onRequestModification && rental.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => onRequestModification(rental)}
              className="px-3 py-1.5 rounded-lg border border-[#d8cfc3] text-[#5c5046] hover:bg-[#f4efe9] text-xs font-semibold cursor-pointer"
            >
              Modify
            </button>
          )}
          {onRequestCancellation && rental.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => onRequestCancellation(rental)}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => onViewDetails(rental)}
            className="px-4 py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Rental Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
