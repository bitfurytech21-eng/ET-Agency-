import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface AreaGuideSectionProps {
  onOpenBooking: () => void;
  onOpenDiscoveryCall?: () => void;
}

export const AreaGuideSection: React.FC<AreaGuideSectionProps> = ({
  onOpenBooking
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
          <div className="max-w-3xl space-y-3">
            <div className="space-y-1.5">
              <span className="type-support font-semibold uppercase tracking-[0.08em] text-[#82634f] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00897d]" />
                Nationwide Destination &amp; Logistics Guide
              </span>
              <h2 className="type-h2 text-[#282828]">
                Explore Premier Destinations &amp; <span className="text-[#00897d]">Coast-to-Coast Corridors</span>
              </h2>
            </div>
            <p className="type-body text-[#5c5046] pt-1">
              Whether you are traveling for healthcare assignments, corporate consulting, government relocations, or family transitions, Easy Travel Lodging coordinates move-in-ready furnished residences, airport fleet delivery, and attentive concierge support across California’s homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-4">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Toggle 0: Restaurants */}
              <div className="et_pb_toggle border border-[#dfd7cc]">
                <button
                  onClick={() => toggleItem(0)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 type-h4 text-left transition-colors cursor-pointer ${
                    openToggles[0] ? 'bg-white text-[#282828]' : 'bg-[#faf8f5] text-[#282828]'
                  }`}
                >
                  <span>Local Dining &amp; Cafes</span>
                  <span className="text-xl font-mono text-[#00b7a8]">{openToggles[0] ? '–' : '+'}</span>
                </button>
                {openToggles[0] && (
                  <div className="p-5 type-body text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
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
                  className={`w-full flex items-center justify-between p-4 sm:p-5 type-h4 text-left transition-colors cursor-pointer ${
                    openToggles[1] ? 'bg-white text-[#282828]' : 'bg-[#82634f] text-[#ffffff]'
                  }`}
                >
                  <span>Tasting Rooms &amp; Craft Breweries</span>
                  <span className="text-xl font-mono">{openToggles[1] ? '–' : '+'}</span>
                </button>
                {openToggles[1] && (
                  <div className="p-5 type-body text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
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
                  className={`w-full flex items-center justify-between p-4 sm:p-5 type-h4 text-left transition-colors cursor-pointer ${
                    openToggles[2] ? 'bg-white text-[#282828]' : 'bg-[#faf8f5] text-[#282828]'
                  }`}
                >
                  <span>Arts &amp; Culture</span>
                  <span className="text-xl font-mono text-[#00b7a8]">{openToggles[2] ? '–' : '+'}</span>
                </button>
                {openToggles[2] && (
                  <div className="p-5 type-body text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
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
                  className={`w-full flex items-center justify-between p-4 sm:p-5 type-h4 text-left transition-colors cursor-pointer ${
                    openToggles[3] ? 'bg-white text-[#282828]' : 'bg-[#00b7a8] text-[#ffffff]'
                  }`}
                >
                  <span>Historical Landmarks</span>
                  <span className="text-xl font-mono">{openToggles[3] ? '–' : '+'}</span>
                </button>
                {openToggles[3] && (
                  <div className="p-5 type-body text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
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
                  className={`w-full flex items-center justify-between p-4 sm:p-5 type-h4 text-left transition-colors cursor-pointer ${
                    openToggles[4] ? 'bg-white text-[#282828]' : 'bg-[#00b7a8] text-[#ffffff]'
                  }`}
                >
                  <span>Events, Science &amp; Live Music</span>
                  <span className="text-xl font-mono">{openToggles[4] ? '–' : '+'}</span>
                </button>
                {openToggles[4] && (
                  <div className="p-5 type-body text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
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
                  className={`w-full flex items-center justify-between p-4 sm:p-5 type-h4 text-left transition-colors cursor-pointer ${
                    openToggles[5] ? 'bg-white text-[#282828]' : 'bg-[#faf8f5] text-[#282828]'
                  }`}
                >
                  <span>Parks, Trails &amp; Outdoor Recreation</span>
                  <span className="text-xl font-mono text-[#00b7a8]">{openToggles[5] ? '–' : '+'}</span>
                </button>
                {openToggles[5] && (
                  <div className="p-5 type-body text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
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
                  className={`w-full flex items-center justify-between p-4 sm:p-5 type-h4 text-left transition-colors cursor-pointer ${
                    openToggles[6] ? 'bg-white text-[#282828]' : 'bg-[#82634f] text-[#ffffff]'
                  }`}
                >
                  <span>Weekend &amp; Day Trips</span>
                  <span className="text-xl font-mono">{openToggles[6] ? '–' : '+'}</span>
                </button>
                {openToggles[6] && (
                  <div className="p-5 type-body text-[#3d352e] space-y-3 bg-white border-t border-[#ebe4da]">
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                      <li><strong className="font-semibold">Lake Tahoe (approx. 2 hours east):</strong> Alpine beaches, mountain trails, and winter ski resorts.</li>
                      <li><strong className="font-semibold">Napa &amp; Sonoma Valleys (approx. 2 hours west):</strong> World-renowned vineyards, culinary tours, and scenic drives.</li>
                      <li><strong className="font-semibold">San Francisco, Sausalito &amp; the Coast (approx. 2 hours west):</strong> Bayfront landmarks, museums, and Pacific beaches.</li>
                      <li><strong className="font-semibold">Yosemite National Park (approx. 4 hours south):</strong> Iconic granite cliffs, waterfalls, and giant sequoia groves.</li>
                      <li className="italic type-support text-[#857568] list-none pt-2">Curated regional destination highlights across our California founding corridor and nationwide network.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live American River Sunrise Banner */}
      <section className="et_section_attractions relative overflow-hidden py-24 sm:py-32 text-white text-left border-b border-[#3a2f28]">
        <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-[1250px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h6 className="et_section_h6 text-[#4de0d2]">
                Experience Turnkey Living Across California’s homes
              </h6>
              <h2 className="type-h2 text-white">
                Check open dates or build your stay online.
              </h2>
            </div>

            <div className="shrink-0">
              <button
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_white group cursor-pointer shadow-md whitespace-nowrap"
              >
                <span>Check Availability</span>
                <span className="ml-2 text-[#282828] group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
