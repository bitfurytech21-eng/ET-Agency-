import React, { useState } from 'react';
import { UserAccommodationReservation } from '../types';
import { StatusBadge } from './StatusBadge';
import { Calendar, MapPin, Key, Wifi, Clock, ArrowRight, Building2 } from 'lucide-react';

interface BookingCardProps {
  booking: UserAccommodationReservation;
  onViewDetails: (booking: UserAccommodationReservation) => void;
  onRequestModification?: (booking: UserAccommodationReservation) => void;
  onRequestCancellation?: (booking: UserAccommodationReservation) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onRequestModification,
  onRequestCancellation,
}) => {
  const [imgError, setImgError] = useState(false);
  const canShowPin = booking.status === 'confirmed' || booking.status === 'active';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-4">
          {booking.image && !imgError ? (
            <img
              src={booking.image}
              alt={booking.propertyTitle}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-20 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#14616d] shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 type-support">
              <span className="font-mono font-semibold text-slate-600 tabular-nums">{booking.id}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <StatusBadge status={booking.status} size="sm" />
            </div>
            <h4 className="type-h4 text-[#0f172a]">
              {booking.propertyTitle} ({booking.unitNumber})
            </h4>
            <div className="flex items-center gap-1.5 type-support text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#14616d] shrink-0" />
              <span>{booking.location}</span>
            </div>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="type-support text-slate-500 font-medium block">Estimated Stay Value</span>
          <span className="type-h4 text-[#0f172a] tabular-nums">
            ${booking.totalUsd.toLocaleString()} USD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 type-support pt-1 tabular-nums">
        <div>
          <span className="type-support font-medium text-slate-500 block">Check-In</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#0f172a] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#14616d] shrink-0" />
            <span>{booking.checkIn}</span>
          </div>
        </div>
        <div>
          <span className="type-support font-medium text-slate-500 block">Check-Out</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#0f172a] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{booking.checkOut}</span>
          </div>
        </div>
        <div>
          <span className="type-support font-medium text-slate-500 block">Smart Keypad</span>
          <div className="flex items-center gap-1.5 font-mono font-semibold text-[#0f172a] mt-0.5">
            <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{canShowPin ? booking.accessCode : 'Issued 24h pre-arrival'}</span>
          </div>
        </div>
        <div>
          <span className="type-support font-medium text-slate-500 block">Duration</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#0f172a] mt-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{booking.totalNights} Nights</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 type-support text-slate-600">
          <Wifi className="w-3.5 h-3.5 text-[#14616d] shrink-0" />
          <span>
            Suite Wi-Fi: <strong className="text-[#0f172a]">{booking.wifiNetwork}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRequestModification && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
              type="button"
              onClick={() => onRequestModification(booking)}
              className="btn btn-outline btn-sm"
            >
              Modify Dates
            </button>
          )}
          {onRequestCancellation && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
              type="button"
              onClick={() => onRequestCancellation(booking)}
              className="px-3.5 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 type-btn cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => onViewDetails(booking)}
            className="btn btn-primary btn-sm"
          >
            <span>Stay Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
