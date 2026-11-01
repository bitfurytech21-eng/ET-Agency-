import React from 'react';
import { UserAccommodationReservation } from '../types';
import { StatusBadge } from './StatusBadge';
import { Calendar, MapPin, Key, Wifi, Clock, ArrowRight } from 'lucide-react';

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
  return (
    <div className="bg-white border border-[#e6dfd5] rounded-2xl p-5 hover:border-[#00b7a8] transition-all shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#efe9e0] pb-3.5">
        <div className="flex items-start gap-3">
          <img
            src={booking.image}
            alt={booking.propertyTitle}
            className="w-16 h-16 rounded-xl object-cover border border-[#e6dfd5] shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[#82634f] bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e6dfd5]">
                {booking.id}
              </span>
              <StatusBadge status={booking.status} size="sm" />
            </div>
            <h4 className="font-heading font-black text-base text-[#282828] leading-tight">
              {booking.propertyTitle} — Unit {booking.unitNumber}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-[#5c5046]">
              <MapPin className="w-3.5 h-3.5 text-[#00897d] shrink-0" />
              <span>{booking.location}</span>
            </div>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-[11px] text-[#857568] uppercase font-bold block">Total Amount</span>
          <span className="text-base font-black text-[#00897d] tabular-nums">
            ${booking.totalUsd.toLocaleString()} USD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-[#faf8f5] p-3 rounded-xl border border-[#efe9e0]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#857568] block">Check-In</span>
          <div className="flex items-center gap-1 font-semibold text-[#282828] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#00b7a8]" />
            <span>{booking.checkIn}</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#857568] block">Check-Out</span>
          <div className="flex items-center gap-1 font-semibold text-[#282828] mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#82634f]" />
            <span>{booking.checkOut}</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#857568] block">Keyless Smart Code</span>
          <div className="flex items-center gap-1 font-mono font-bold text-[#282828] mt-0.5">
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>{booking.accessCode || 'Pending Issue'}</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#857568] block">Duration</span>
          <div className="flex items-center gap-1 font-semibold text-[#282828] mt-0.5">
            <Clock className="w-3.5 h-3.5 text-[#857568]" />
            <span>{booking.totalNights} Nights</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-3 text-xs text-[#5c5046]">
          <span className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-[#00b7a8]" />
            <span>Wi-Fi: <strong>{booking.wifiNetwork}</strong></span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRequestModification && booking.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => onRequestModification(booking)}
              className="px-3 py-1.5 rounded-lg border border-[#d8cfc3] text-[#5c5046] hover:bg-[#f4efe9] text-xs font-semibold cursor-pointer"
            >
              Modify Dates
            </button>
          )}
          {onRequestCancellation && booking.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => onRequestCancellation(booking)}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => onViewDetails(booking)}
            className="px-4 py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
