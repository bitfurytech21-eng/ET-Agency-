import React, { useState } from 'react';
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
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white border border-[#e6dfd5] rounded-2xl p-5 hover:border-[#00b7a8] transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#efe9e0] pb-3.5">
        <div className="flex items-start gap-3.5">
          {rental.image && !imgError ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#e6dfd5] shrink-0 relative bg-[#1f1915]">
              <img
                src={rental.image}
                alt={rental.vehicleName}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#1f1915] flex items-center justify-center text-white shrink-0 border border-[#3f332b]">
              <Car className="w-7 h-7 text-[#00b7a8]" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#82634f] tabular-nums">{rental.id}</span>
              <span className="text-[#857568]" aria-hidden="true">·</span>
              <StatusBadge status={rental.status} size="sm" />
            </div>
            <h4 className="font-heading font-black text-base text-[#282828] leading-tight">
              {rental.year} {rental.vehicleName}
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5c5046]">
              <span className="text-[#00897d] font-bold">{rental.category}</span>
              <span className="text-[#857568]" aria-hidden="true">·</span>
              <span>Finish: {rental.colorName}</span>
            </div>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-[11px] text-[#857568] font-semibold block">Total Rental</span>
          <span className="text-base font-black text-[#00897d] tabular-nums">
            ${rental.totalUsd.toLocaleString()} USD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#faf8f5] p-3.5 rounded-xl border border-[#efe9e0] tabular-nums">
        <div>
          <span className="text-[11px] font-semibold text-[#857568] block">Pickup Date</span>
          <div className="flex items-center gap-1.5 font-bold text-[#282828] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#00b7a8] shrink-0" />
            <span>{rental.pickupDate}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#857568] block">Return Date</span>
          <div className="flex items-center gap-1.5 font-bold text-[#282828] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#82634f] shrink-0" />
            <span>{rental.returnDate}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#857568] block">Handover Location</span>
          <div className="flex items-center gap-1.5 font-bold text-[#282828] mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#00897d] shrink-0" />
            <span className="truncate">{rental.pickupLocation}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#857568] block">Protection Plan</span>
          <div className="flex items-center gap-1.5 font-bold text-[#282828] mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {rental.protectionPlan === 'executive_shield' ? 'Zero-Deductible Shield' : 'Standard Coverage'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="text-xs text-[#5c5046]">
          <span>
            Primary Driver: <strong>{rental.primaryDriver}</strong>
          </span>
          <span className="mx-2 text-[#857568]" aria-hidden="true">·</span>
          <span className="tabular-nums">{rental.totalDays} Days</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRequestModification && rental.status !== 'cancelled' && rental.status !== 'completed' && (
            <button
              type="button"
              onClick={() => onRequestModification(rental)}
              className="px-3 py-1.5 rounded-lg border border-[#d8cfc3] text-[#5c5046] hover:bg-[#f4efe9] text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              Modify
            </button>
          )}
          {onRequestCancellation && rental.status !== 'cancelled' && rental.status !== 'completed' && (
            <button
              type="button"
              onClick={() => onRequestCancellation(rental)}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => onViewDetails(rental)}
            className="px-4 py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Rental Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
