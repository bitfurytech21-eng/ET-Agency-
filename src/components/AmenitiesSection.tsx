import React from 'react';
import { Check } from 'lucide-react';

export const AmenitiesSection: React.FC = () => {
  const amenities = [
    { title: 'Free WiFi', desc: '400+ Mbps high-speed internet' },
    { title: 'Free Parking', desc: 'Assigned dedicated parking space' },
    { title: 'Bedroom Comforts', desc: 'Hotel-quality queen mattress & linens' },
    { title: 'Private Patio Or Balcony', desc: 'Secluded outdoor space with seating' },
    { title: 'Washer & Dryer', desc: 'In-unit stackable laundry' },
    { title: 'ADA Compliant', desc: 'Single-level ground floor access' },
    { title: 'Computer Station', desc: 'Work desk and comfortable chair' },
    { title: 'Cozy Fireplace', desc: 'Electric fireplace in living room' },
    { title: 'Coffee Maker', desc: 'Keurig coffee maker & Instant Pot' }
  ];

  return (
    <>
      {/* Visual Separator Section 5 from easytravellodging.com */}
      <div className="et_section_amenities h-48 sm:h-72 w-full" />

      {/* Section 6: Amenities, Services, & Travel Guide */}
      <section className="bg-white py-14 sm:py-20 border-b border-[#e5e5e5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-left space-y-10">
          <div>
            <h6 className="et_section_h6 text-[#000000]">
              What you Get
            </h6>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#00b7a8] leading-tight mt-1">
              Amenities, Services, &amp; Travel Guide
            </h2>
          </div>

          {/* 3x3 Grid with round check icons matching Divi ETmodules style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {amenities.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-2">
                <div className="w-9 h-9 rounded-full bg-[#00b7a8] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h5 className="font-heading font-bold text-lg text-[#000000]">
                    {item.title}
                  </h5>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
