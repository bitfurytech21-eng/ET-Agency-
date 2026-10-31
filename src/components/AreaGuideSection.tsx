import React, { useState } from 'react';
import { Mail, Phone, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';

interface AreaGuideSectionProps {
  onOpenBooking: () => void;
  onOpenDiscoveryCall?: () => void;
}

export const AreaGuideSection: React.FC<AreaGuideSectionProps> = ({
  onOpenBooking,
  onOpenDiscoveryCall
}) => {
  // State for Divi accordion toggles
  const [openToggles, setOpenToggles] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });

  const toggleItem = (index: number) => {
    setOpenToggles((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      {/* Area Attractions Accordions Section */}
      <section className="bg-white py-14 sm:py-20 border-b border-[#e5e5e5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-left space-y-8">
          <div>
            <h2 className="et_teal_h2 text-3xl sm:text-5xl font-bold text-[#00b7a8]">
              Area Attractions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Toggle 0: Restaurants */}
              <div className="et_pb_toggle border border-[#d9d9d9]">
                <button
                  onClick={() => toggleItem(0)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[0] ? 'bg-white text-[#333333]' : 'bg-[#f5f5f5] text-[#1d363a]'
                  }`}
                >
                  <span>Restaurants</span>
                  <span className="text-xl font-mono">{openToggles[0] ? '–' : '+'}</span>
                </button>
                {openToggles[0] && (
                  <div className="p-5 text-sm text-[#333333] space-y-3 bg-white border-t border-[#e5e5e5]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Check out our amazing variety of ethnic restaurants including our new Organic Delights Cafe and Restaurant</li>
                      <li>Some oldies but goodies include Famous Burgers &amp; Brew, Rudy’s Hideaway Lobster House, Samurai Sushi, El Forno Classico, Formaggio Taverna and patio, Brookfields, Old Spaghetti Factory, Oz Korean BBQ Restaurant, Casa Ramos, Mimosa House</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 1: Bars & Lounges */}
              <div className="et_pb_toggle border border-[#d9d9d9]">
                <button
                  onClick={() => toggleItem(1)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[1] ? 'bg-white text-[#333333]' : 'bg-[#368187] text-[#ffffff]'
                  }`}
                >
                  <span>Bars &amp; Lounges</span>
                  <span className="text-xl font-mono">{openToggles[1] ? '–' : '+'}</span>
                </button>
                {openToggles[1] && (
                  <div className="p-5 text-sm text-[#333333] space-y-3 bg-white border-t border-[#e5e5e5]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Chill and sample our Local Craft Beers at the 6 breweries in the Barrel District Brewery</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 2: Arts & Culture */}
              <div className="et_pb_toggle border border-[#d9d9d9]">
                <button
                  onClick={() => toggleItem(2)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[2] ? 'bg-white text-[#333333]' : 'bg-[#f5f5f5] text-[#1d363a]'
                  }`}
                >
                  <span>Arts &amp; Culture</span>
                  <span className="text-xl font-mono">{openToggles[2] ? '–' : '+'}</span>
                </button>
                {openToggles[2] && (
                  <div className="p-5 text-sm text-[#333333] space-y-3 bg-white border-t border-[#e5e5e5]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Enjoy the amazing display of cool cars at the California Automobile Museum in Sacramento</li>
                      <li>Admire the visual arts at the Mills Station Arts &amp; Culture Center referred to as “The MACC”</li>
                      <li>Visit the world-class Crocker Art Museum in Sacramento</li>
                      <li>Check out the art of our local talent displayed year-round at the Rancho Cordova City Hall</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 3: Historical Sites */}
              <div className="et_pb_toggle border border-[#d9d9d9]">
                <button
                  onClick={() => toggleItem(3)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[3] ? 'bg-white text-[#333333]' : 'bg-[#368187] text-[#ffffff]'
                  }`}
                >
                  <span>Historical Sites</span>
                  <span className="text-xl font-mono">{openToggles[3] ? '–' : '+'}</span>
                </button>
                {openToggles[3] && (
                  <div className="p-5 text-sm text-[#333333] space-y-3 bg-white border-t border-[#e5e5e5]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Come see the beautiful California State Capitol in downtown Sacramento---20 minutes away</li>
                      <li>Relive history in the Old Sacramento State Historic Park</li>
                      <li>Sutter’s Fort in downtown Sacramento</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {/* Toggle 4: Shows & Entertainment */}
              <div className="et_pb_toggle border border-[#d9d9d9]">
                <button
                  onClick={() => toggleItem(4)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[4] ? 'bg-white text-[#333333]' : 'bg-[#368187] text-[#ffffff]'
                  }`}
                >
                  <span>Shows &amp; Entertainment</span>
                  <span className="text-xl font-mono">{openToggles[4] ? '–' : '+'}</span>
                </button>
                {openToggles[4] && (
                  <div className="p-5 text-sm text-[#333333] space-y-3 bg-white border-t border-[#e5e5e5]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Lots of live music in downtown Folsom---a 20-minute drive</li>
                      <li>Enjoy the new and amazing SMUD Museum of Science and Curiosity (Powerhouse Science Center)</li>
                      <li>Fireworks Rancho Cordova! No one does fireworks quite like Rancho Cordova! July 3-4 Two full days of fireworks, parades, floats, corndogs carnivals, and more</li>
                      <li>Moonlight Movies every Friday in June</li>
                      <li>Summer Concert Series every Friday in August</li>
                      <li>California Capitol Airshow at Mather Airport---usually in September</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 5: Outdoor & Adventure */}
              <div className="et_pb_toggle border border-[#d9d9d9]">
                <button
                  onClick={() => toggleItem(5)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[5] ? 'bg-white text-[#333333]' : 'bg-[#f5f5f5] text-[#1d363a]'
                  }`}
                >
                  <span>Outdoor &amp; Adventure</span>
                  <span className="text-xl font-mono">{openToggles[5] ? '–' : '+'}</span>
                </button>
                {openToggles[5] && (
                  <div className="p-5 text-sm text-[#333333] space-y-3 bg-white border-t border-[#e5e5e5]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Enjoy the Railroad at the Sacramento Valley Live Steamers Railroad Museum Inc. at Hagan Park. A great place for a picnic or stroll along the American River Parkway.</li>
                      <li>Be a kid again and enjoy a fun-filled afternoon at Monster Mini Golf</li>
                      <li>Visit the Sacramento Zoo in nearby Land Park</li>
                      <li>Test your accuracy at the scenic golf center at Mather Golf Course---the perfect round of golf all year round designed by Jack Fleming</li>
                      <li>Enjoy the beautiful Lake Natoma where you can paddleboard, kayak, sail, canoe, swim, hike, and much more</li>
                      <li>You will love climbing to New Heights at the Granite Arch Climbing Center---over 20,000 square feet of realistic climbing surfaces!</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 6: Day Trips */}
              <div className="et_pb_toggle border border-[#d9d9d9]">
                <button
                  onClick={() => toggleItem(6)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[6] ? 'bg-white text-[#333333]' : 'bg-[#368187] text-[#ffffff]'
                  }`}
                >
                  <span>Day Trips</span>
                  <span className="text-xl font-mono">{openToggles[6] ? '–' : '+'}</span>
                </button>
                {openToggles[6] && (
                  <div className="p-5 text-sm text-[#333333] space-y-3 bg-white border-t border-[#e5e5e5]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>A Must See—Lake Tahoe---2 hours away, Yosemite National Park---4 hours away</li>
                      <li>San Francisco, Sausalito, Alcatraz---only 2 hours away!</li>
                      <li>Napa-Sonoma Wine Country---2 hours away</li>
                      <li>Two hours to the west---ocean, Two hours to the east---snow</li>
                      <li>And so much more…</li>
                      <li className="italic text-xs text-slate-500 list-none pt-2">Special acknowledgment to Visit Rancho Cordova for their input</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Rancho Sunrise Background with "Visit Sacramento in Style" Banner */}
      <section className="et_section_attractions py-24 sm:py-36 text-white text-left">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h6 className="et_section_h6 text-white tracking-widest">
                Visit Sacramento in Style
              </h6>
              <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white">
                Check vacancies or reserve a stay.
              </h2>
            </div>

            <div>
              <button
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_white group cursor-pointer"
              >
                <span>Book Your Stay</span>
                <span className="ml-3 text-[14px] text-[#333333] group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Dark Footer Strip (#282828) matching easytravellodging.com */}
      <section className="et_section_dark py-6 text-white border-b border-[#333333]">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Column 1: Contact info */}
            <div className="space-y-2 text-xs sm:text-sm font-semibold">
              <a
                href="mailto:Contact@EasyTravelLodging.com"
                className="flex items-center gap-2 hover:text-[#00b7a8] transition-colors"
              >
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span className="break-all">Contact@EasyTravelLodging.com</span>
              </a>
              <a
                href="tel:9168003295"
                className="flex items-center gap-2 hover:text-[#00b7a8] transition-colors"
              >
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>916-800-3295</span>
              </a>
            </div>

            {/* Column 2: BBB Seal & Proud Member Badge */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.bbb.org/us/ca/sacramento/profile/boarding-house/easy-travel-lodging-1156-90076707/#sealclick"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="https://seal-necal.bbb.org/seals/blue-seal-120-61-bbb-90076707.png"
                  alt="Easy Travel Lodging BBB Business Review"
                  className="h-14 w-auto object-contain"
                />
              </a>
              <img
                src="https://easytravellodging.com/wp-content/uploads/2022/12/RANCHO-CORDOVA-PROUD-MEMBER-BADGE.jpg"
                alt="Rancho Cordova Proud Member Badge"
                className="h-14 w-auto object-contain"
              />
            </div>

            {/* Column 3: Discovery Call Button */}
            <div>
              <button
                onClick={onOpenDiscoveryCall || onOpenBooking}
                className="et_pb_button et_pb_button_teal text-xs py-3 px-4 w-full text-center"
              >
                Book Your FREE Vacation Rental Design Discovery Call
              </button>
            </div>

            {/* Column 4: Badge 19 */}
            <div className="flex justify-center md:justify-end">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/04/19.png"
                alt="Badge 19"
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
