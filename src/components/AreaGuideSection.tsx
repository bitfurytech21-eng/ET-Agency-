import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';
import { WeatherWidget } from './WeatherWidget';

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
      <section className="bg-white py-14 sm:py-20 border-b border-[#e6dfd5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 text-left space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <h2 className="et_teal_h2 text-3xl sm:text-5xl font-bold text-[#00b7a8]">
                Explore Greater Sacramento &amp; Northern California
              </h2>
              <p className="text-sm sm:text-base text-[#5c5046] leading-relaxed">
                Centrally situated near Highway 50 and the American River Parkway, Rancho Cordova connects you to neighborhood dining, museums, outdoor recreation, and iconic weekend destinations like Lake Tahoe &amp; Napa Valley.
              </p>
            </div>
            <div className="lg:col-span-5">
              <WeatherWidget />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-4">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Toggle 0: Restaurants */}
              <div className="et_pb_toggle border border-[#dfd7cc]">
                <button
                  onClick={() => toggleItem(0)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[0] ? 'bg-white text-[#282828]' : 'bg-[#faf8f5] text-[#282828]'
                  }`}
                >
                  <span>Local Dining &amp; Cafes</span>
                  <span className="text-xl font-mono text-[#00b7a8]">{openToggles[0] ? '–' : '+'}</span>
                </button>
                {openToggles[0] && (
                  <div className="p-5 text-sm text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Explore diverse international and farm-to-fork kitchens nearby, including Organic Delights Cafe and Restaurant.</li>
                      <li>Neighborhood favorites include Famous Burgers &amp; Brew, Rudy’s Hideaway Lobster House, Samurai Sushi, El Forno Classico, Formaggio Taverna &amp; Patio, Brookfields, Old Spaghetti Factory, Oz Korean BBQ, Casa Ramos, and Mimosa House.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 1: Bars & Lounges */}
              <div className="et_pb_toggle border border-[#dfd7cc]">
                <button
                  onClick={() => toggleItem(1)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[1] ? 'bg-white text-[#282828]' : 'bg-[#82634f] text-[#ffffff]'
                  }`}
                >
                  <span>Tasting Rooms &amp; Craft Breweries</span>
                  <span className="text-xl font-mono">{openToggles[1] ? '–' : '+'}</span>
                </button>
                {openToggles[1] && (
                  <div className="p-5 text-sm text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Visit the Rancho Cordova Barrel District—home to six independent craft breweries, local taprooms, and artisan beverage makers.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 2: Arts & Culture */}
              <div className="et_pb_toggle border border-[#dfd7cc]">
                <button
                  onClick={() => toggleItem(2)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[2] ? 'bg-white text-[#282828]' : 'bg-[#faf8f5] text-[#282828]'
                  }`}
                >
                  <span>Arts &amp; Culture</span>
                  <span className="text-xl font-mono text-[#00b7a8]">{openToggles[2] ? '–' : '+'}</span>
                </button>
                {openToggles[2] && (
                  <div className="p-5 text-sm text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Tour classic and vintage collections at the California Automobile Museum in Sacramento.</li>
                      <li>Experience rotating exhibitions and concerts at the Mills Station Arts &amp; Culture Center (The MACC).</li>
                      <li>Spend an afternoon at the renowned Crocker Art Museum in downtown Sacramento.</li>
                      <li>View regional fine art displayed year-round at Rancho Cordova City Hall.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 3: Historical Sites */}
              <div className="et_pb_toggle border border-[#dfd7cc]">
                <button
                  onClick={() => toggleItem(3)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[3] ? 'bg-white text-[#282828]' : 'bg-[#00b7a8] text-[#ffffff]'
                  }`}
                >
                  <span>Historical Landmarks</span>
                  <span className="text-xl font-mono">{openToggles[3] ? '–' : '+'}</span>
                </button>
                {openToggles[3] && (
                  <div className="p-5 text-sm text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Stroll the California State Capitol Museum and surrounding Capitol Park—about 20 minutes west.</li>
                      <li>Explore Gold Rush history, riverboats, and the California State Railroad Museum in Old Sacramento State Historic Park.</li>
                      <li>Visit historic Sutter’s Fort in Midtown Sacramento.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {/* Toggle 4: Shows & Entertainment */}
              <div className="et_pb_toggle border border-[#dfd7cc]">
                <button
                  onClick={() => toggleItem(4)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[4] ? 'bg-white text-[#282828]' : 'bg-[#00b7a8] text-[#ffffff]'
                  }`}
                >
                  <span>Events, Science &amp; Live Music</span>
                  <span className="text-xl font-mono">{openToggles[4] ? '–' : '+'}</span>
                </button>
                {openToggles[4] && (
                  <div className="p-5 text-sm text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Enjoy live music, dining, and boutique shopping in Historic Folsom—just a 20-minute drive east.</li>
                      <li>Bring the whole family to the SMUD Museum of Science and Curiosity (MOSAC) along the Sacramento riverfront.</li>
                      <li>Attend seasonal Rancho Cordova community traditions including the July 3–4 Independence Celebration, Friday Moonlight Movies in June, and the August Summer Concert Series.</li>
                      <li>Experience the annual California Capital Airshow at Mather Airport each autumn.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 5: Outdoor & Adventure */}
              <div className="et_pb_toggle border border-[#dfd7cc]">
                <button
                  onClick={() => toggleItem(5)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[5] ? 'bg-white text-[#282828]' : 'bg-[#faf8f5] text-[#282828]'
                  }`}
                >
                  <span>Parks, Trails &amp; Outdoor Recreation</span>
                  <span className="text-xl font-mono text-[#00b7a8]">{openToggles[5] ? '–' : '+'}</span>
                </button>
                {openToggles[5] && (
                  <div className="p-5 text-sm text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li>Walk or cycle the 32-mile American River Parkway trail system and visit Hagan Community Park.</li>
                      <li>Paddleboard, kayak, row, or hike around scenic Lake Natoma in the Folsom Lake State Recreation Area.</li>
                      <li>Play a year-round round at the Jack Fleming-designed Mather Golf Course.</li>
                      <li>Enjoy family afternoons at the Sacramento Zoo in Land Park, Monster Mini Golf, or the 20,000-square-foot Granite Arch Climbing Center.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Toggle 6: Day Trips */}
              <div className="et_pb_toggle border border-[#dfd7cc]">
                <button
                  onClick={() => toggleItem(6)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 font-heading font-bold text-lg text-left transition-colors cursor-pointer ${
                    openToggles[6] ? 'bg-white text-[#282828]' : 'bg-[#82634f] text-[#ffffff]'
                  }`}
                >
                  <span>Weekend &amp; Day Trips</span>
                  <span className="text-xl font-mono">{openToggles[6] ? '–' : '+'}</span>
                </button>
                {openToggles[6] && (
                  <div className="p-5 text-sm text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li><strong>Lake Tahoe (approx. 2 hours east):</strong> Alpine beaches, mountain trails, and winter ski resorts.</li>
                      <li><strong>Napa &amp; Sonoma Valleys (approx. 2 hours west):</strong> World-renowned vineyards, culinary tours, and scenic drives.</li>
                      <li><strong>San Francisco, Sausalito &amp; the Coast (approx. 2 hours west):</strong> Bayfront landmarks, museums, and Pacific beaches.</li>
                      <li><strong>Yosemite National Park (approx. 4 hours south):</strong> Iconic granite cliffs, waterfalls, and giant sequoia groves.</li>
                      <li className="italic text-xs text-[#857568] list-none pt-2">Compiled in collaboration with Visit Rancho Cordova.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live American River Sunrise Banner */}
      <section className="et_section_attractions relative overflow-hidden py-24 sm:py-36 text-white text-left border-b border-[#3a2f28]">
        <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-[1250px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h6 className="et_section_h6 text-[#4de0d2] tracking-widest">
                Stay in Greater Sacramento With Ease
              </h6>
              <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white">
                Check open dates or build your stay online.
              </h2>
            </div>

            <div>
              <button
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_white group cursor-pointer shadow-md"
              >
                <span>Check Availability</span>
                <span className="ml-3 text-[14px] text-[#282828] group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Pre-Footer Strip (#282828) */}
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
                Schedule a Complimentary Rental Design Call
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
