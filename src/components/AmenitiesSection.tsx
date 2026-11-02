import React from 'react';
import { Check } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';
import { ScrollReveal } from './common/ScrollReveal';

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
      <div className="et_section_amenities relative overflow-hidden h-52 sm:h-72 w-full border-y border-[#382b22]">
        <LivePhotoBackground scene="interior" secondaryScene="courtyard" overlay="subtle" />
        <div className="relative z-10 h-full max-w-[1250px] mx-auto px-4 sm:px-8 flex items-end pb-6 sm:pb-8">
          <div className="text-left space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4de0d2] block">
              Interior Architecture &amp; Living Spaces
            </span>
            <h3 className="type-h3 text-white">
              Sunlit California living spaces outfitted for effortless arrivals
            </h3>
          </div>
        </div>
      </div>

      <section className="bg-white py-14 sm:py-20 border-b border-[#e2ded6]">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-8 text-left space-y-10">
          <ScrollReveal direction="up" className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#966746] block">
              Included With Every Residence
            </span>
            <h2 className="type-h2 text-[#182024]">
              Everyday Home Comforts &amp; <span className="text-[#14616d]">Turnkey Essentials</span>
            </h2>
            <p className="type-body text-[#4a545c] max-w-3xl pt-1">
              Every apartment includes utilities, household essentials, and full community amenities so you can settle in from your first evening without unexpected setup costs.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {amenities.map((item, index) => (
              <ScrollReveal
                key={index}
                direction="up"
                delay={Math.min(index * 40, 200)}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-[#faf7f2] border border-[#e2ded6] shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#e2ded6] text-[#14616d] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="type-h4 text-[#182024]">
                    {item.title}
                  </h4>
                  <p className="type-support text-xs text-[#4a545c] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
