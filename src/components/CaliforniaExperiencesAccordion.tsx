import React, { useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';

export interface CaliforniaExperienceItem {
  id: number;
  title: string;
  theme: 'cream' | 'brown' | 'teal';
  subtitle?: string;
  points: string[];
}

export const CALIFORNIA_EXPERIENCES: CaliforniaExperienceItem[] = [
  {
    id: 0,
    title: 'Local Dining & Cafes',
    theme: 'cream',
    subtitle: 'California Farm-to-Fork & Coastal Culinary Scene',
    points: [
      'Fresh California farm-to-fork dining, organic farmers markets, and celebrated coastal seafood kitchens with seasonal chef-curated menus.',
      'Diverse international culinary corridors spanning Northern California’s Farm-to-Fork Capital, Napa Valley bistro terraces, San Francisco bayfront dining, and Southern California coastal eateries.',
      'Artisan sourdough bakeries, authentic mission-style taquerias, specialty espresso coffee roasters, and sunny year-round outdoor patio dining.',
    ],
  },
  {
    id: 1,
    title: 'Tasting Rooms & Craft Breweries',
    theme: 'brown',
    subtitle: 'World-Renowned Wine AVAs & West Coast Craft Brews',
    points: [
      'Convenient access to premier American Viticultural Areas (AVAs) including Napa Valley, Sonoma County, Paso Robles, and Sierra Foothills heritage estates.',
      'Pioneer West Coast craft brewery hubs featuring independent craft taprooms, hop farms, artisan cider houses, and urban micro-distilleries.',
      'Private barrel tastings, vineyard terrace pairings, and scenic agricultural valley drives across California’s premier wine trails.',
    ],
  },
  {
    id: 2,
    title: 'Arts & Culture',
    theme: 'cream',
    subtitle: 'World-Class Museums, Sculpture Parks & Creative Enclaves',
    points: [
      'Celebrated cultural institutions including Crocker Art Museum, SFMOMA, The Getty Center, LACMA, and the California Automobile Museum.',
      'Historic performing arts centers, outdoor amphitheaters, contemporary civic sculpture walks, and independent community art collectives.',
      'Rotating regional fine art exhibitions, historic California missions, and seasonal outdoor Shakespeare festivals.',
    ],
  },
  {
    id: 3,
    title: 'Historical Landmarks',
    theme: 'teal',
    subtitle: 'California Heritage, Gold Country & Pacific Horizons',
    points: [
      'Explore the California State Capitol Museum and 40-acre Capitol Park, Old Sacramento State Historic Park, and Gold Country heritage corridors.',
      'Iconic historic landmarks along the Pacific Coast, Golden Gate vistas, Spanish mission architecture, and legendary pioneer railroad museums.',
      'Historic state monuments, vintage riverboats, and scenic heritage routes tracing California’s rich path from the 1849 Gold Rush to modern innovation.',
    ],
  },
  {
    id: 4,
    title: 'Events, Science & Live Music',
    theme: 'teal',
    subtitle: 'Innovation Centers, Waterfront Concerts & Annual Traditions',
    points: [
      'Interactive science and discovery centers including the SMUD Museum of Science & Curiosity (MOSAC), California Academy of Sciences, and Tech Interactive.',
      'Open-air summer concert series, shoreline music festivals, championship sporting events, and cultural street fairs celebrated under California skies.',
      'World-famous California airshows, film festivals, and seasonal community holiday spectacles hosted year-round across the state.',
    ],
  },
  {
    id: 5,
    title: 'Parks, Trails & Outdoor Recreation',
    theme: 'cream',
    subtitle: 'Rivers, Alpine Lakes, Coastal Bluffs & Redwood Groves',
    points: [
      'Scenic multi-use trails including the legendary 32-mile American River Parkway, Lake Tahoe ridge walks, Point Reyes National Seashore, and coastal Redwood parks.',
      'Year-round outdoor adventures: paddleboarding, kayaking, road and gravel cycling, Pacific surfing, and championship golf courses.',
      'Sunlit state recreation areas, pristine freshwater lakes, mountain climbing centers, and extensive preserved natural parklands.',
    ],
  },
  {
    id: 6,
    title: 'Weekend & Day Trips',
    theme: 'brown',
    subtitle: 'Iconic California Gateways & National Wonders',
    points: [
      'Lake Tahoe & the High Sierra (approx. 2 hours): Crystal-clear alpine beaches, hiking trails, granite peaks, and world-class winter ski resorts.',
      'Napa & Sonoma Wine Valleys (approx. 1.5–2 hours): Historic vineyards, estate tours, culinary retreats, and tranquil country highways.',
      'San Francisco & Pacific Coastline (approx. 2 hours): Golden Gate Bridge, Marin Headlands, Sausalito, Monterey Bay, and dramatic coastal bluffs.',
      'Yosemite National Park & the Sierra Foothills: Towering granite monoliths of El Capitan and Half Dome, cascading waterfalls, and ancient giant sequoia groves.',
    ],
  },
];

interface CaliforniaExperiencesAccordionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showIntro?: boolean;
  className?: string;
}

export const CaliforniaExperiencesAccordion: React.FC<CaliforniaExperiencesAccordionProps> = ({
  title = 'California Experiences & Destination Corridors',
  subtitle = 'Statewide Experiences · Northern & Southern California Corridors',
  description = 'Easy Travel Lodging connects guests with move-in-ready furnished residences, private fleet rentals, and attentive host hospitality across California’s premier destinations—designed for effortless travel, corporate relocation, and authentic California living.',
  showIntro = true,
  className = '',
}) => {
  const [openToggles, setOpenToggles] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const toggleItem = (id: number) => {
    setOpenToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {showIntro && (
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#e2ded6] text-xs font-semibold uppercase tracking-wider text-[#14616d] shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#14616d]" />
            <span>{subtitle}</span>
          </div>
          <h3 className="type-h2 text-[#182024]">{title}</h3>
          <p className="type-body text-[#4a545c] max-w-3xl leading-relaxed">{description}</p>
        </div>
      )}

      {/* Styled Accordion Stack Matching Divi Screenshot */}
      <div className="space-y-3 max-w-3xl">
        {CALIFORNIA_EXPERIENCES.map((item) => {
          const isOpen = Boolean(openToggles[item.id]);

          // Exact theme styling from user screenshot IMG_7630_678a5973.jpeg
          let btnClass = '';
          let plusColor = '';

          if (item.theme === 'cream') {
            btnClass = 'bg-[#fbf9f6] text-[#1c2226] border border-[#e8e2d8] hover:bg-[#f4efe8] shadow-2xs';
            plusColor = 'text-[#3ca79d]';
          } else if (item.theme === 'brown') {
            btnClass = 'bg-[#785945] text-white border border-[#6b4e3c] hover:bg-[#6e513c] shadow-2xs';
            plusColor = 'text-white';
          } else {
            // teal
            btnClass = 'bg-[#45a99f] text-white border border-[#3ca096] hover:bg-[#3ca096] shadow-2xs';
            plusColor = 'text-white';
          }

          return (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden shadow-2xs transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-4.5 text-left font-heading font-bold text-base sm:text-lg cursor-pointer transition-all duration-200 ${btnClass}`}
              >
                <span className="tracking-tight">{item.title}</span>
                <span className={`text-2xl font-light leading-none select-none ${plusColor}`}>
                  {isOpen ? '–' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="p-5 sm:p-6 bg-white border-x border-b border-[#e2ded6] rounded-b-xl space-y-3.5 animate-in fade-in duration-200">
                  {item.subtitle && (
                    <div className="type-support text-xs font-semibold uppercase tracking-wider text-[#14616d]">
                      {item.subtitle}
                    </div>
                  )}
                  <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#4a545c] leading-relaxed">
                    {item.points.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
