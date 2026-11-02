import React from 'react';
import { PropertyListing, getFallbackPropertyImage } from '../data/lodgingData';
import { US_VEHICLES, UsVehicle } from '../data/vehicleData';
import { getVehicleImage } from '../data/fleetImages';
import { ArrowRight, BedDouble, Car, Check, MapPin, ShieldCheck, Users } from 'lucide-react';

interface HomeShowcaseSectionProps {
  properties: PropertyListing[];
  onViewProperty: (property: PropertyListing) => void;
  onBookProperty: (propertyId: string) => void;
  onExploreAllProperties: () => void;
  onReserveVehicle: (vehicle: UsVehicle) => void;
  onExploreAllVehicles: () => void;
}

export const HomeShowcaseSection: React.FC<HomeShowcaseSectionProps> = ({
  properties,
  onViewProperty,
  onBookProperty,
  onExploreAllProperties,
  onReserveVehicle,
  onExploreAllVehicles,
}) => {
  const featuredResidences = properties.slice(0, 3);
  const featuredVehicles = [US_VEHICLES[0], US_VEHICLES[2], US_VEHICLES[4]].filter(Boolean);

  return (
    <>
      {/* Section 1: Featured Furnished Residences */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#e2e8f0]">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="et_section_h6 block">Signature Accommodations</span>
              <h2 className="type-h2 text-[#0f172a]">
                Featured Move-In-Ready Residences
              </h2>
              <p className="type-body text-[#475569]">
                Professionally managed 1- and 2-bedroom residences equipped with full kitchens, dedicated workspaces, high-speed WiFi, and reserved parking.
              </p>
            </div>
            <button
              type="button"
              onClick={onExploreAllProperties}
              className="btn btn-outline group self-start md:self-auto"
            >
              <span>View All {properties.length} Residences</span>
              <ArrowRight className="w-4 h-4 btn-arrow text-[#14616d]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredResidences.map((property, idx) => (
              <article
                key={property.id}
                className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs card-hover group flex flex-col"
              >
                <div
                  onClick={() => onViewProperty(property)}
                  className="relative aspect-[4/3] bg-[#f1f5f9] overflow-hidden cursor-pointer"
                >
                  <img
                    src={property.images[0] || getFallbackPropertyImage(idx)}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackPropertyImage(idx);
                    }}
                    className="w-full h-full object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/55 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-medium">
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#5eead4] shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold shrink-0">
                      Unit {property.unitNumber}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <div className="type-support flex items-center gap-2 text-[#64748b] font-medium">
                      <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                      <span aria-hidden="true">·</span>
                      <span>Up to {property.maxGuests} Guests</span>
                    </div>

                    <h3
                      onClick={() => onViewProperty(property)}
                      className="type-h3 text-[#0f172a] group-hover:text-[#14616d] transition-colors cursor-pointer line-clamp-1"
                    >
                      {property.title}
                    </h3>

                    <p className="type-body text-[#475569] line-clamp-2">
                      {property.shortDesc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#f1f5f9] space-y-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <span className="text-xl font-bold text-[#0f172a] font-mono tabular-nums">
                          ${property.monthlyRate.toLocaleString()}
                        </span>
                        <span className="type-support text-[#64748b] ml-1">/ month</span>
                      </div>
                      <span className="type-support text-[#64748b] font-mono tabular-nums">
                        ${Math.round(property.monthlyRate / 30)}/night
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => onViewProperty(property)}
                        className="btn btn-sm btn-outline w-full"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onBookProperty(property.id)}
                        className="btn btn-sm btn-primary w-full"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Executive Car Rental & 3D Fleet Preview */}
      <section className="bg-[#0f172a] text-white py-16 sm:py-20 border-b border-[#1e293b]">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="type-support font-semibold tracking-wide text-[#5eead4] block">
                Executive Car Rentals &amp; Interactive 3D Studio
              </span>
              <h2 className="type-h2 text-white">
                Private Fleet Staged for Your Arrival
              </h2>
              <p className="type-body text-slate-300">
                Pair your residence with an executive SUV or German sport sedan. Inspect every model in 360° 3D and request terminal or residence driveway delivery.
              </p>
            </div>
            <button
              type="button"
              onClick={onExploreAllVehicles}
              className="btn btn-white group self-start md:self-auto"
            >
              <Car className="w-4 h-4 text-[#14616d]" />
              <span>Explore All {US_VEHICLES.length} Vehicles</span>
              <ArrowRight className="w-4 h-4 btn-arrow text-[#0f172a]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="bg-[#1e293b]/90 border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-slate-500 group"
              >
                <div>
                  <div
                    onClick={onExploreAllVehicles}
                    className="relative aspect-[4/3] bg-[#0b1120] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={getVehicleImage(vehicle.id)}
                      alt={`${vehicle.name} — ${vehicle.category}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover img-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-slate-200 font-medium">
                      <span>{vehicle.make} · {vehicle.year}</span>
                      <span className="text-[#5eead4] font-medium">360° 3D View Available</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="type-support flex items-center gap-2 text-slate-400">
                      <span>{vehicle.seating} Passengers</span>
                      <span aria-hidden="true">·</span>
                      <span>{vehicle.luggage} Bags</span>
                      <span aria-hidden="true">·</span>
                      <span>{vehicle.specs.horsepower.split('@')[0].trim()}</span>
                    </div>

                    <h3 className="type-h3 text-white">
                      {vehicle.name}
                    </h3>

                    <p className="type-body text-slate-300 line-clamp-2">
                      {vehicle.tagline}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-slate-700/70 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-bold text-white font-mono tabular-nums">
                        ${vehicle.dailyRate}
                      </span>
                      <span className="type-support text-slate-400 ml-1">/ day</span>
                    </div>
                    <span className="type-support text-slate-300 font-mono tabular-nums">
                      ${vehicle.weeklyRate}/wk · ${vehicle.monthlyRate.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={onExploreAllVehicles}
                      className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 w-full"
                    >
                      3D Studio
                    </button>
                    <button
                      type="button"
                      onClick={() => onReserveVehicle(vehicle)}
                      className="btn btn-sm btn-primary w-full"
                    >
                      Reserve Car
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
