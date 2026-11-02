import React from 'react';
import { Check } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';
import { ScrollReveal } from './common/ScrollReveal';

export const AmenitiesSection: React.FC = () => {
  const amenities = [
    { title: 'High-Speed Wi-Fi', desc: '400+ Mbps enterprise-grade internet for remote work and streaming' },
    { title: 'Reserved Parking', desc: 'Dedicated covered parking stall steps from your residence door' },
    { title: 'Restful Queen Suites', desc: 'Hotel-grade mattresses outfitted with 400–600 thread count linens' },
    { title: 'Private Patio or Balcony', desc: 'Furnished outdoor space for morning coffee or evening relaxation' },
    { title: 'In-Unit Laundry', desc: 'Private full-size washer and dryer with starter supplies' },
    { title: 'Ground-Floor Options', desc: 'Step-free single-level access available in select residences' },
    { title: 'Dedicated Workspace', desc: 'Ergonomic desk setup tailored for extended work sessions' },
    { title: 'Living Room Fireplace', desc: 'Warm indoor fireplace for comfortable evenings' },
    { title: 'Stocked Chef Kitchen', desc: 'Full-size appliances, cookware, Keurig brewer, and Instant Pot' },
  ];

  return (
    <>
      <div className="et_section_amenities relative overflow-hidden h-52 sm:h-68 w-full border-y border-[#1e293b]">
        <LivePhotoBackground scene="interior" secondaryScene="courtyard" overlay="subtle" />
        <div className="relative z-10 h-full max-w-[1280px] mx-auto px-4 sm:px-8 flex items-end pb-6 sm:pb-8">
          <div className="text-left space-y-1">
            <span className="type-support font-semibold tracking-wide text-[#5eead4] block">
              Interior Architecture &amp; Living Spaces
            </span>
            <h3 className="type-h3 text-white">
              Sunlit California living spaces outfitted for effortless arrivals
            </h3>
          </div>
        </div>
      </div>

      <section className="bg-white py-16 sm:py-20 border-b border-[#e2e8f0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 text-left space-y-10">
          <ScrollReveal direction="up" className="space-y-2">
            <span className="et_section_h6 block">Included With Every Residence</span>
            <h2 className="type-h2 text-[#0f172a]">
              Everyday Home Comforts &amp; <span className="text-[#14616d]">Turnkey Essentials</span>
            </h2>
            <p className="type-body text-[#475569] max-w-3xl pt-1">
              Every apartment includes utilities, household essentials, and full community amenities so you can settle in from your first evening without unexpected setup costs.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-1">
            {amenities.map((item, index) => (
              <ScrollReveal
                key={index}
                direction="up"
                delay={Math.min(index * 30, 150)}
                className="flex items-start gap-3.5 p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#edf6f8] text-[#14616d] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="type-h4 text-[#0f172a]">{item.title}</h4>
                  <p className="type-body text-[#475569] mt-1">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
