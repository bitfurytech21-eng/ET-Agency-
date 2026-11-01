import React from 'react';
import { Check } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

export const AmenitiesSection: React.FC = () => {
  const amenities = [
    { title: 'High-Speed Wi-Fi', desc: '400+ Mbps internet for work, study, and streaming' },
    { title: 'Reserved Parking', desc: 'Dedicated covered parking steps from your door' },
    { title: 'Restful Queen Suites', desc: 'Hotel-grade mattresses with 400–600 thread count linens' },
    { title: 'Private Patio or Balcony', desc: 'Furnished outdoor space for morning coffee or evening air' },
    { title: 'In-Unit Laundry', desc: 'Private washer and dryer with starter detergent' },
    { title: 'Ground-Floor Options', desc: 'Step-free single-level access in select residences' },
    { title: 'Dedicated Workspace', desc: 'Comfortable desk setup for remote work or planning' },
    { title: 'Living Room Fireplace', desc: 'Warm indoor fireplace for relaxed evenings' },
    { title: 'Stocked Kitchen & Coffee Bar', desc: 'Full appliances, cookware, Keurig brewer, and Instant Pot' }
  ];

  return (
    <>
      <div className="et_section_amenities relative overflow-hidden h-52 sm:h-72 w-full border-y border-[#3a2f28]">
        <LivePhotoBackground scene="interior" secondaryScene="courtyard" overlay="subtle" />
        <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 sm:px-8 flex items-end pb-6 sm:pb-8">
          <div className="text-left">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#4de0d2] block">
              Interior Architecture &amp; Comfort
            </span>
            <p className="font-heading font-bold text-lg sm:text-2xl text-white mt-0.5">
              Sunlit California living spaces outfitted for effortless arrivals
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white py-14 sm:py-20 border-b border-[#e6dfd5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-left space-y-10">
          <div className="space-y-2">
            <h6 className="et_section_h6 text-[#282828]">
              Included With Every Residence
            </h6>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#00b7a8] leading-tight mt-1">
              Everyday Home Comforts &amp; Turnkey Essentials
            </h2>
            <p className="text-sm sm:text-base text-[#5c5046] max-w-3xl pt-1">
              Every apartment includes utilities, household essentials, and full community amenities so you can settle in from your first evening without unexpected setup costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {amenities.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-2">
                <div className="w-9 h-9 rounded-full bg-[#00b7a8] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h5 className="font-heading font-bold text-lg text-[#282828]">
                    {item.title}
                  </h5>
                  <p className="text-xs text-[#5c5046]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
