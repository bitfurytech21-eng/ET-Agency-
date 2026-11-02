import React, { useState } from 'react';
import { UserCarRentalBooking } from '../types';
import { StatusBadge } from './StatusBadge';
import { getVehicleImage } from '../../../data/fleetImages';
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
  const resolvedImage =
    rental.image && !rental.image.includes('images.unsplash.com')
      ? rental.image
      : getVehicleImage(rental.vehicleId);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-4">
          {resolvedImage && !imgError ? (
            <div className="w-20 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-900">
              <img
                src={resolvedImage}
                alt={rental.vehicleName}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-16 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 border border-slate-800">
              <Car className="w-6 h-6 text-[#5eead4]" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-semibold text-slate-600 tabular-nums">{rental.id}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <StatusBadge status={rental.status} size="sm" />
            </div>
            <h4 className="font-heading font-bold text-base text-[#0f172a] leading-snug">
              {rental.year} {rental.vehicleName}
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
              <span className="text-[#14616d] font-semibold">{rental.category}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span>Finish: {rental.colorName}</span>
            </div>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-[11px] text-slate-500 font-medium block">Total Rental</span>
          <span className="text-base font-bold text-[#0f172a] tabular-nums">
            ${rental.totalUsd.toLocaleString()} USD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1 tabular-nums">
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Pickup Date</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#0f172a] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#14616d] shrink-0" />
            <span>{rental.pickupDate}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Return Date</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#0f172a] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{rental.returnDate}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Handover Location</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#0f172a] mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#14616d] shrink-0" />
            <span className="truncate">{rental.pickupLocation}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Protection Plan</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#0f172a] mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {rental.protectionPlan === 'executive_shield' ? 'Zero-Deductible Shield' : 'Standard Coverage'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <div className="text-xs text-slate-600">
          <span>
            Primary Driver: <strong className="text-[#0f172a]">{rental.primaryDriver}</strong>
          </span>
          <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
          <span className="tabular-nums">{rental.totalDays} Days</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRequestModification && rental.status !== 'cancelled' && rental.status !== 'completed' && (
            <button
              type="button"
              onClick={() => onRequestModification(rental)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer whitespace-nowrap"
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
            className="btn btn-primary btn-sm"
          >
            <span>Rental Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
