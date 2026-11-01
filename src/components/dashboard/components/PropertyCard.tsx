import React from 'react';
import { PropertyListing } from '../../../data/lodgingData';
import { MapPin, Users, Maximize, Heart, ArrowRight } from 'lucide-react';

interface PropertyCardProps {
  property: PropertyListing;
  onReserve: (propertyId: string) => void;
  onToggleSave?: (propertyId: string) => void;
  isSaved?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onReserve,
  onToggleSave,
  isSaved = false,
}) => {
  return (
    <div className="bg-white border border-[#e6dfd5] rounded-2xl overflow-hidden shadow-2xs hover:border-[#00b7a8] transition-all flex flex-col justify-between">
      <div className="relative h-44 w-full bg-[#f4efe9] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-[#1f1915]/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
          Unit {property.unitNumber}
        </div>
        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(property.id)}
            title={isSaved ? 'Remove from saved' : 'Save property'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 hover:scale-110 transition-transform cursor-pointer shadow-xs"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h4 className="font-heading font-black text-base text-[#282828] leading-snug line-clamp-1">
            {property.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-[#5c5046]">
            <MapPin className="w-3.5 h-3.5 text-[#00897d] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center gap-3 pt-1 text-[11px] text-[#857568] font-semibold">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {property.bedrooms} Bed · {property.bathrooms} Bath
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5" /> {property.sqft || 'Fully Furnished'}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#efe9e0] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#857568] block">Corporate Monthly</span>
            <span className="text-sm font-black text-[#00897d] tabular-nums">
              ${property.monthlyRate.toLocaleString()} / mo
            </span>
          </div>

          <button
            type="button"
            onClick={() => onReserve(property.id)}
            className="px-3.5 py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Book Stay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
