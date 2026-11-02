import React from 'react';
import {
  Building,
  Compass,
  ExternalLink,
  MapPin,
  Navigation,
  Shield,
  Utensils,
} from 'lucide-react';
import { NearbyPlaceItem, PropertyLocationInfo } from '../../data/propertyEnrichment';

interface PropertyLocationSectionProps {
  locationInfo?: PropertyLocationInfo;
  fallbackLocation: string;
}

function getPlaceIcon(category: NearbyPlaceItem['category']) {
  switch (category) {
    case 'Dining':
      return Utensils;
    case 'Parks & Coastal':
      return Compass;
    case 'Medical & Business':
      return Building;
    default:
      return MapPin;
  }
}

export const PropertyLocationSection: React.FC<PropertyLocationSectionProps> = ({
  locationInfo,
  fallbackLocation,
}) => {
  if (!locationInfo) {
    return (
      <div className="space-y-3">
        <h2 className="type-h2 text-[#1b1d20]">Location &amp; Surroundings</h2>
        <p className="type-body text-[#434a4f]">{fallbackLocation}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="type-h2 text-[#1b1d20]">Location &amp; Neighborhood Corridor</h2>
          <p className="type-body text-[#5c5046] mt-1">
            {locationInfo.neighborhood} · {locationInfo.city}, {locationInfo.state}
          </p>
        </div>

        {locationInfo.directionsUrl && (
          <a
            href={locationInfo.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="type-btn px-4 py-2.5 rounded-lg border border-[#dfd7cc] bg-white hover:border-[#00897d] text-[#1b1d20] inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <Navigation className="w-4 h-4 text-[#00897d]" />
            <span>Open Regional Map</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#857568]" />
          </a>
        )}
      </div>

      {/* Corridor & Address Disclosure Card */}
      <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <span className="type-label text-[#1b1d20] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00897d]" />
              <span>
                {locationInfo.addressDisclosureRestricted
                  ? 'Approved Residential Corridor'
                  : 'Property Address'}
              </span>
            </span>
            <p className="type-body font-medium text-[#1b1d20]">
              {locationInfo.addressDisclosureRestricted
                ? `${locationInfo.neighborhood}, ${locationInfo.city}, ${locationInfo.state}`
                : locationInfo.addressLine || `${locationInfo.city}, ${locationInfo.state}`}
            </p>
            {locationInfo.coordinates && (
              <p className="type-support text-[#697076] tabular-nums">
                Regional Coordinates: {locationInfo.coordinates.lat.toFixed(4)}° N,{' '}
                {Math.abs(locationInfo.coordinates.lng).toFixed(4)}° W
              </p>
            )}
          </div>

          {locationInfo.transitSummary && (
            <div className="space-y-1.5">
              <span className="type-label text-[#1b1d20] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#00897d]" />
                <span>Highway &amp; Airport Connectivity</span>
              </span>
              <p className="type-support text-[#434a4f] leading-relaxed">
                {locationInfo.transitSummary}
              </p>
            </div>
          )}
        </div>

        {locationInfo.addressDisclosureRestricted && locationInfo.privacyNote && (
          <div className="pt-3 border-t border-[#e6dfd5] type-support text-[#5c5046] flex items-start gap-2">
            <Shield className="w-4 h-4 text-[#82634f] shrink-0 mt-0.5" />
            <span>{locationInfo.privacyNote}</span>
          </div>
        )}
      </div>

      {/* Nearby Dining, Parks, Medical & Business Corridors */}
      {locationInfo.nearbyAttractions && locationInfo.nearbyAttractions.length > 0 && (
        <div className="space-y-3">
          <h3 className="type-h4 text-[#1b1d20]">Nearby Dining, Parks &amp; Key Destinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locationInfo.nearbyAttractions.map((place, idx) => {
              const Icon = getPlaceIcon(place.category);
              return (
                <div
                  key={idx}
                  className="p-4 bg-white border border-[#e6dfd5] rounded-xl space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 text-[#00897d] shrink-0 stroke-[1.75]" />
                      <span className="type-support text-[#697076] truncate">{place.category}</span>
                    </div>
                    <span className="type-support font-semibold text-[#1b1d20] tabular-nums shrink-0">
                      {place.distance}
                    </span>
                  </div>
                  <h4 className="type-nav font-semibold text-[#1b1d20]">{place.name}</h4>
                  <p className="type-support text-[#434a4f]">{place.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
