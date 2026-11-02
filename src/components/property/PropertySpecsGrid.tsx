import React from 'react';
import {
  Bath,
  BedDouble,
  Building2,
  CalendarClock,
  Layers,
  Ruler,
  Users,
} from 'lucide-react';
import { PropertyListing } from '../../data/lodgingData';

interface PropertySpecsGridProps {
  property: PropertyListing;
}

export const PropertySpecsGrid: React.FC<PropertySpecsGridProps> = ({ property }) => {
  const maxGuests = property.maxGuests || Math.max(2, property.bedrooms * 2);
  const minStay = property.minimumStayDays || 5;
  const propType = property.propertyType || 'Furnished Residence';

  const specs = [
    {
      label: 'Bedrooms',
      value: `${property.bedrooms} ${property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}`,
      icon: BedDouble,
    },
    {
      label: 'Bathrooms',
      value: `${property.bathrooms} ${property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}`,
      icon: Bath,
    },
    {
      label: 'Maximum Guests',
      value: `Up to ${maxGuests} Guests`,
      icon: Users,
    },
    ...(property.sqft
      ? [
          {
            label: 'Interior Area',
            value: property.sqft,
            icon: Ruler,
          },
        ]
      : []),
    {
      label: 'Level & Access',
      value: property.floor === 'Downstairs' ? 'Ground Floor' : 'Upper Level',
      icon: Layers,
    },
    {
      label: 'Property Type',
      value: propType,
      icon: Building2,
    },
    {
      label: 'Minimum Stay',
      value: `${minStay} Nights (30+ Tax-Exempt)`,
      icon: CalendarClock,
    },
  ];

  return (
    <section aria-label="Residence specifications" className="bg-white border border-[#e6dfd5] rounded-xl p-5 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {specs.map((spec) => {
          const Icon = spec.icon;
          return (
            <div key={spec.label} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg border border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-center shrink-0 text-[#5c5046]">
                <Icon className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <span className="type-support text-[#697076] block">{spec.label}</span>
                <span className="type-nav font-semibold text-[#1b1d20] block mt-0.5 tabular-nums">
                  {spec.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
