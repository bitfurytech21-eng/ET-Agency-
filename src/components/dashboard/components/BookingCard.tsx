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
    <div className="bg-white border border-[#e6dfd5] rounded-2xl p-5 hover:border-[#00b7a8] transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#efe9e0] pb-3.5">
        <div className="flex items-start gap-3.5">
          {booking.image && !imgError ? (
            <img
              src={booking.image}
              alt={booking.propertyTitle}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-16 h-16 rounded-xl object-cover border border-[#e6dfd5] shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] flex items-center justify-center text-[#82634f] shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#82634f] tabular-nums">{booking.id}</span>
              <span className="text-[#857568]" aria-hidden="true">·</span>
              <StatusBadge status={booking.status} size="sm" />
            </div>
            <h4 className="font-heading font-black text-base text-[#282828] leading-tight">
              {booking.propertyTitle} ({booking.unitNumber})
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-[#5c5046]">
              <MapPin className="w-3.5 h-3.5 text-[#00897d] shrink-0" />
              <span>{booking.location}</span>
            </div>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-[11px] text-[#857568] font-semibold block">Estimated Stay Value</span>
          <span className="text-base font-black text-[#00897d] tabular-nums">
            ${booking.totalUsd.toLocaleString()} USD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#faf8f5] p-3.5 rounded-xl border border-[#efe9e0] tabular-nums">
        <div>
          <span className="text-[11px] font-semibold text-[#857568] block">Check-In</span>
          <div className="flex items-center gap-1.5 font-bold text-[#282828] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#00b7a8] shrink-0" />
            <span>{booking.checkIn}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#857568] block">Check-Out</span>
          <div className="flex items-center gap-1.5 font-bold text-[#282828] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#82634f] shrink-0" />
            <span>{booking.checkOut}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#857568] block">Smart Keypad</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-[#282828] mt-0.5">
            <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{canShowPin ? booking.accessCode : 'Issued 24h pre-arrival'}</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#857568] block">Duration</span>
          <div className="flex items-center gap-1.5 font-bold text-[#282828] mt-0.5">
            <Clock className="w-3.5 h-3.5 text-[#857568] shrink-0" />
            <span>{booking.totalNights} Nights</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 text-xs text-[#5c5046]">
          <Wifi className="w-3.5 h-3.5 text-[#00b7a8] shrink-0" />
          <span>
            Suite Wi-Fi: <strong>{booking.wifiNetwork}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRequestModification && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
              type="button"
              onClick={() => onRequestModification(booking)}
              className="px-3 py-1.5 rounded-lg border border-[#d8cfc3] text-[#5c5046] hover:bg-[#f4efe9] text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              Modify Dates
            </button>
          )}
          {onRequestCancellation && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
              type="button"
              onClick={() => onRequestCancellation(booking)}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => onViewDetails(booking)}
            className="px-4 py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Stay Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
