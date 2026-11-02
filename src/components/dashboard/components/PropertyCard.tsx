import React, { useState } from 'react';
import { PropertyListing } from '../../../data/lodgingData';
import { MapPin, Users, Maximize, Heart, ArrowRight, Building2 } from 'lucide-react';

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
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {property.images[0] && !imgError ? (
          <img
            src={property.images[0]}
            alt={property.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover hover:scale-103 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Building2 className="w-8 h-8" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[#0f172a]/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
          Unit {property.unitNumber}
        </div>
        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(property.id)}
            title={isSaved ? 'Remove from saved' : 'Save property'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-rose-500 hover:scale-105 transition-transform cursor-pointer shadow-xs"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h4 className="font-heading font-bold text-base text-[#0f172a] leading-snug line-clamp-1">
            {property.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-[#14616d] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 tabular-nums">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {property.bedrooms} Bed · {property.bathrooms} Bath
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5" /> {property.sqft || 'Furnished'}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Monthly Rate</span>
            <span className="text-sm font-bold text-[#0f172a] tabular-nums">
              ${property.monthlyRate.toLocaleString()} / mo
            </span>
          </div>

          <button
            type="button"
            onClick={() => onReserve(property.id)}
            className="btn btn-primary btn-sm"
          >
            <span>Book Stay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
