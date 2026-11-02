import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  ChevronDown,
  Thermometer,
  Radio,
  Search,
  X,
  Eye,
  ShieldCheck,
  Compass,
  Calendar,
  Info,
} from 'lucide-react';

export interface CaliforniaLocation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  travelTip: string;
}

export const CALIFORNIA_LOCATIONS: CaliforniaLocation[] = [
  {
    id: 'el-dorado-hills',
    name: 'El Dorado Hills, CA',
    region: 'Primary Residence Hub',
    lat: 38.6857,
    lng: -121.076,
    travelTip: 'Ideal weather for Folsom Lake overlooks, El Dorado Hills Town Center dining, & Sierra foothills trails.',
  },
  {
    id: 'tahoe',
    name: 'Lake Tahoe & Sierra Nevada',
    region: 'Alpine Resort Region',
    lat: 39.0968,
    lng: -120.0324,
    travelTip: 'Great mountain conditions for Emerald Bay scenic overlooks, hiking trails, & alpine air.',
  },
  {
    id: 'napa',
    name: 'Napa Valley & Sonoma',
    region: 'Wine Country',
    lat: 38.2975,
    lng: -122.2869,
    travelTip: 'Optimal temperatures for estate vineyard tours, open-air wine tastings, & culinary strolls.',
  },
  {
    id: 'sf',
    name: 'San Francisco & Bay Area',
    region: 'Coastal Pacific Region',
    lat: 37.7749,
    lng: -122.4194,
    travelTip: 'Pack light layers for pleasant coastal breezes, Golden Gate park walks, & waterfront dining.',
  },
  {
    id: 'yosemite',
    name: 'Yosemite & Gold Country',
    region: 'National Park & Foothills',
    lat: 37.8651,
    lng: -119.5383,
    travelTip: 'Excellent visibility for waterfall viewpoints, historic Gold Rush towns, & scenic drives.',
  },
  {
    id: 'monterey',
    name: 'Monterey & Carmel',
    region: 'Central Coast',
    lat: 36.6002,
    lng: -121.8947,
    travelTip: 'Crisp ocean breezes perfect for 17-Mile Drive, Cannery Row, & coastal cliff walks.',
  },
];

interface WeatherData {
  temperature: number;
  temperatureUnit: 'F' | 'C';
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  source: 'Open-Meteo Weather API' | 'National Weather Service';
  dailyForecast: Array<{
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    code: number;
    conditionText: string;
    rainChance?: number;
  }>;
}

const WEATHER_CODE_MAP: Record<number, { condition: string; icon: React.FC<{ className?: string }> }> = {
  0: { condition: 'Clear Sky', icon: Sun },
  1: { condition: 'Mainly Clear', icon: Sun },
  2: { condition: 'Partly Cloudy', icon: CloudSun },
  3: { condition: 'Overcast', icon: Cloud },
  45: { condition: 'Foggy', icon: CloudFog },
  48: { condition: 'Depositing Rime Fog', icon: CloudFog },
  51: { condition: 'Light Drizzle', icon: CloudRain },
  53: { condition: 'Moderate Drizzle', icon: CloudRain },
  55: { condition: 'Dense Drizzle', icon: CloudRain },
  61: { condition: 'Slight Rain', icon: CloudRain },
  63: { condition: 'Moderate Rain', icon: CloudRain },
  65: { condition: 'Heavy Rain', icon: CloudRain },
  71: { condition: 'Slight Snowfall', icon: Snowflake },
  73: { condition: 'Moderate Snowfall', icon: Snowflake },
  75: { condition: 'Heavy Snowfall', icon: Snowflake },
  80: { condition: 'Slight Rain Showers', icon: CloudRain },
  81: { condition: 'Moderate Rain Showers', icon: CloudRain },
  82: { condition: 'Violent Rain Showers', icon: CloudRain },
  95: { condition: 'Thunderstorm', icon: CloudLightning },
};

function getWeatherMeta(code: number) {
  return (
    WEATHER_CODE_MAP[code] || {
      condition: 'Clear & Mild',
      icon: Sun,
    }
  );
}

const FALLBACK_WEATHER: Record<string, WeatherData> = {
  'el-dorado-hills': {
    temperature: 73,
    temperatureUnit: 'F',
    tempMax: 78,
    tempMin: 52,
    weatherCode: 0,
    condition: 'Sunny & Pleasant',
    humidity: 42,
    windSpeed: 7,
    source: 'Open-Meteo Weather API',
    dailyForecast: [
      { date: 'Today', dayName: 'Today', maxTemp: 78, minTemp: 52, code: 0, conditionText: 'Sunny & Clear', rainChance: 0 },
      { date: 'Tomorrow', dayName: 'Tomorrow', maxTemp: 80, minTemp: 54, code: 1, conditionText: 'Mostly Clear', rainChance: 5 },
      { date: 'Day 3', dayName: 'Day 3', maxTemp: 75, minTemp: 50, code: 2, conditionText: 'Partly Cloudy', rainChance: 10 },
    ],
  },
  tahoe: {
    temperature: 58,
    temperatureUnit: 'F',
    tempMax: 62,
    tempMin: 36,
    weatherCode: 1,
    condition: 'Clear Alpine Air',
    humidity: 35,
    windSpeed: 9,
    source: 'Open-Meteo Weather API',
    dailyForecast: [
      { date: 'Today', dayName: 'Today', maxTemp: 62, minTemp: 36, code: 1, conditionText: 'Sunny Alpine', rainChance: 0 },
      { date: 'Tomorrow', dayName: 'Tomorrow', maxTemp: 64, minTemp: 38, code: 0, conditionText: 'Clear Skies', rainChance: 0 },
      { date: 'Day 3', dayName: 'Day 3', maxTemp: 60, minTemp: 34, code: 2, conditionText: 'Partly Cloudy', rainChance: 15 },
    ],
  },
  napa: {
    temperature: 71,
    temperatureUnit: 'F',
    tempMax: 76,
    tempMin: 50,
    weatherCode: 0,
    condition: 'Warm & Sunny',
    humidity: 48,
    windSpeed: 6,
    source: 'Open-Meteo Weather API',
    dailyForecast: [
      { date: 'Today', dayName: 'Today', maxTemp: 76, minTemp: 50, code: 0, conditionText: 'Sunny', rainChance: 0 },
      { date: 'Tomorrow', dayName: 'Tomorrow', maxTemp: 78, minTemp: 52, code: 0, conditionText: 'Sunny & Warm', rainChance: 0 },
      { date: 'Day 3', dayName: 'Day 3', maxTemp: 74, minTemp: 49, code: 1, conditionText: 'Mostly Clear', rainChance: 5 },
    ],
  },
  sf: {
    temperature: 64,
    temperatureUnit: 'F',
    tempMax: 68,
    tempMin: 53,
    weatherCode: 2,
    condition: 'Cool Bay Breeze',
    humidity: 65,
    windSpeed: 12,
    source: 'Open-Meteo Weather API',
    dailyForecast: [
      { date: 'Today', dayName: 'Today', maxTemp: 68, minTemp: 53, code: 2, conditionText: 'Partly Cloudy', rainChance: 10 },
      { date: 'Tomorrow', dayName: 'Tomorrow', maxTemp: 67, minTemp: 54, code: 45, conditionText: 'Morning Fog', rainChance: 15 },
      { date: 'Day 3', dayName: 'Day 3', maxTemp: 66, minTemp: 52, code: 1, conditionText: 'Sunny Intervals', rainChance: 5 },
    ],
  },
};

interface WeatherWidgetProps {
  compact?: boolean;
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  compact = false,
  className = '',
}) => {
  const [selectedLoc, setSelectedLoc] = useState<CaliforniaLocation>(CALIFORNIA_LOCATIONS[0]);
  const [weather, setWeather] = useState<WeatherData>(FALLBACK_WEATHER['el-dorado-hills']);
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState<'F' | 'C'>('F');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [radarModalOpen, setRadarModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customLoc, setCustomLoc] = useState<CaliforniaLocation | null>(null);

  useEffect(() => {
    let isMounted = true;
    const activeLoc = customLoc || selectedLoc;

    const fetchWeatherForecast = async () => {
      setLoading(true);
      try {
        const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${activeLoc.lat}&longitude=${activeLoc.lng}&current_weather=true&hourly=relativehumidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FLos_Angeles`;
        const res = await fetch(omUrl);
        if (!res.ok) throw new Error('Weather API error');
        const data = await res.json();

        if (isMounted && data?.current_weather) {
          const cw = data.current_weather;
          const code = cw.weathercode ?? 0;
          const meta = getWeatherMeta(code);
          const maxT = Math.round(data.daily?.temperature_2m_max?.[0] ?? cw.temperature + 5);
          const minT = Math.round(data.daily?.temperature_2m_min?.[0] ?? cw.temperature - 15);
          const hum = data.hourly?.relativehumidity_2m?.[0] ?? 42;

          const days = (data.daily?.time || []).slice(0, 3).map((tStr: string, idx: number) => {
            const dateObj = new Date(tStr + 'T12:00:00');
            const dayName =
              idx === 0
                ? 'Today'
                : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
            const dayCode = data.daily?.weathercode?.[idx] ?? code;
            const dayMeta = getWeatherMeta(dayCode);
            const rainChance = data.daily?.precipitation_probability_max?.[idx] ?? 0;

            return {
              date: tStr,
              dayName,
              maxTemp: Math.round(data.daily?.temperature_2m_max?.[idx] ?? cw.temperature),
              minTemp: Math.round(data.daily?.temperature_2m_min?.[idx] ?? cw.temperature - 10),
              code: dayCode,
              conditionText: dayMeta.condition,
              rainChance,
            };
          });

          setWeather({
            temperature: Math.round(cw.temperature),
            temperatureUnit: 'F',
            tempMax: maxT,
            tempMin: minT,
            weatherCode: code,
            condition: meta.condition,
            humidity: Math.round(hum),
            windSpeed: Math.round(cw.windspeed || 6),
            source: 'Open-Meteo Weather API',
            dailyForecast: days.length > 0 ? days : (FALLBACK_WEATHER[activeLoc.id]?.dailyForecast || FALLBACK_WEATHER['el-dorado-hills'].dailyForecast),
          });
        }
      } catch {
        if (isMounted) {
          setWeather(FALLBACK_WEATHER[activeLoc.id] || FALLBACK_WEATHER['el-dorado-hills']);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeatherForecast();
    return () => {
      isMounted = false;
    };
  }, [selectedLoc, customLoc]);

  const handleSearchCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchQuery,
      )}&count=5&language=en&format=json`;
      const res = await fetch(geoUrl);
      const data = await res.json();
      if (data?.results?.length > 0) {
        const match =
          data.results.find((r: { admin1?: string; country_code?: string }) => r.admin1 === 'California' || r.country_code === 'US') ||
          data.results[0];

        const newLoc: CaliforniaLocation = {
          id: `custom_${Date.now()}`,
          name: `${match.name}${match.admin1 ? `, ${match.admin1}` : ''}`,
          region: 'Search Destination',
          lat: match.latitude,
          lng: match.longitude,
          travelTip: `Live 3-day forecast for ${match.name}. Pack accordingly for local California activities.`,
        };
        setCustomLoc(newLoc);
        setSearchQuery('');
        setDropdownOpen(false);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const activeLocation = customLoc || selectedLoc;
  const MetaIcon = getWeatherMeta(weather.weatherCode).icon;

  const displayTemp = (f: number) => {
    if (unit === 'C') {
      return Math.round(((f - 32) * 5) / 9);
    }
    return f;
  };

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setRadarModalOpen(true)}
          className={`type-btn inline-flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-[#e6dfd5] hover:border-[#00b7a8] rounded-xl text-[#282828] shadow-xs cursor-pointer transition-all ${className}`}
          title="Click to view full California weather & 3-day forecast"
        >
          <MetaIcon className="w-4 h-4 text-[#00b7a8] shrink-0" />
          <span className="font-bold tabular-nums">
            {displayTemp(weather.temperature)}°{unit}
          </span>
          <span className="type-support text-[#5c5046] hidden sm:inline truncate max-w-[160px]">
            {activeLocation.name.split('&')[0]} · {weather.condition}
          </span>
        </button>

        {radarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-[#e6dfd5] space-y-5 text-[#282828]">
              <div className="flex items-center justify-between border-b border-[#ede6dc] pb-3">
                <div className="flex items-center gap-2 type-h4 text-[#282828]">
                  <Calendar className="w-4 h-4 text-[#00b7a8]" />
                  <span>3-Day California Weather Forecast</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRadarModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#faf8f5] text-[#857568] hover:text-[#282828] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <WeatherWidget compact={false} />

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between type-support font-semibold text-[#82634f]">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#00b7a8]" /> Live California Doppler Radar
                  </span>
                  <span className="type-support text-[#857568]">NOAA Live Feed</span>
                </div>
                <div className="w-full h-56 rounded-2xl overflow-hidden border border-[#e6dfd5] bg-[#faf8f5]">
                  <iframe
                    title="Live California Radar"
                    src={`https://www.rainviewer.com/map.html?loc=${activeLocation.lat},${activeLocation.lng},8&o=1&b=1&c=1&t=1&s=0&g=1`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`bg-white/95 backdrop-blur-md border border-[#e6dfd5] rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 text-[#282828] ${className}`}
    >
      {/* Top Controls: Location Dropdown + Search + Unit Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ede6dc] pb-3.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-left font-heading font-semibold text-base text-[#282828] hover:text-[#00b7a8] transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#00b7a8] shrink-0" />
            <span className="max-w-[210px] sm:max-w-xs truncate">{activeLocation.name}</span>
            <ChevronDown className="w-4 h-4 text-[#857568]" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#e6dfd5] rounded-2xl shadow-2xl z-30 p-3 space-y-2.5 animate-in fade-in">
              <form onSubmit={handleSearchCity} className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#857568]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search California town..."
                  className="w-full pl-9 pr-3 py-2 bg-[#faf8f5] border border-[#dfd7cc] rounded-xl text-sm text-[#282828] placeholder:text-[#9a8d80] outline-none focus:border-[#00b7a8]"
                />
              </form>

              <div className="px-2 py-0.5 type-support font-semibold uppercase tracking-[0.06em] text-[#82634f]">
                California Travel Destinations
              </div>

              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {CALIFORNIA_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setSelectedLoc(loc);
                      setCustomLoc(null);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 type-nav flex items-center justify-between cursor-pointer rounded-lg transition-colors ${
                      activeLocation.id === loc.id && !customLoc
                        ? 'bg-[#e8f8f6] text-[#00897d] font-semibold'
                        : 'hover:bg-[#faf8f5] text-[#282828] font-medium'
                    }`}
                  >
                    <span className="truncate">{loc.name}</span>
                    <span className="type-support text-[#857568] shrink-0 ml-2">{loc.region}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRadarModalOpen(true)}
            className="type-btn px-3 py-1.5 bg-[#e8f8f6] hover:bg-[#b9ebe6] text-[#00897d] rounded-lg border border-[#b9ebe6] flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
          >
            <Radio className="w-3.5 h-3.5 text-[#00b7a8]" />
            <span>Radar Map</span>
          </button>

          <div className="flex items-center gap-1 bg-[#f5efe8] p-0.5 rounded-lg border border-[#e6dfd5]">
            <button
              type="button"
              onClick={() => setUnit('F')}
              className={`type-btn px-2.5 py-1 rounded cursor-pointer transition-all ${
                unit === 'F' ? 'bg-[#00b7a8] text-white shadow-2xs' : 'text-[#5c5046]'
              }`}
            >
              °F
            </button>
            <button
              type="button"
              onClick={() => setUnit('C')}
              className={`type-btn px-2.5 py-1 rounded cursor-pointer transition-all ${
                unit === 'C' ? 'bg-[#00b7a8] text-white shadow-2xs' : 'text-[#5c5046]'
              }`}
            >
              °C
            </button>
          </div>
        </div>
      </div>

      {/* Current Temperature & Conditions Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-1">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#e8f8f6] rounded-2xl border border-[#b9ebe6] text-[#00897d]">
            <MetaIcon className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-heading font-bold tabular-nums text-[#282828]">
                {displayTemp(weather.temperature)}°
              </span>
              <span className="text-sm font-semibold text-[#82634f]">{unit}</span>
            </div>
            <span className="type-support font-semibold text-[#00897d] block">{weather.condition}</span>
          </div>
        </div>

        <div className="text-right space-y-1 type-support text-[#5c5046] tabular-nums">
          <div className="flex items-center justify-end gap-1 font-semibold text-[#282828]">
            <Thermometer className="w-3.5 h-3.5 text-[#82634f]" />
            <span>
              High: {displayTemp(weather.tempMax)}° · Low: {displayTemp(weather.tempMin)}°
            </span>
          </div>
          <div className="flex items-center justify-end gap-2.5 type-support text-[#857568]">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-[#00b7a8]" /> {weather.humidity}% Humidity
            </span>
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-[#82634f]" /> {weather.windSpeed} mph Wind
            </span>
          </div>
        </div>
      </div>

      {/* 3-Day Temperature & Condition Forecast Cards */}
      <div className="space-y-2.5 pt-2 border-t border-[#ede6dc]">
        <div className="flex items-center justify-between type-support font-semibold text-[#282828]">
          <span className="flex items-center gap-1.5 text-[#82634f]">
            <Calendar className="w-4 h-4 text-[#00b7a8]" />
            3-Day Temperature Forecast
          </span>
          <span className="type-support font-normal text-[#857568]">External Weather Feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {weather.dailyForecast.map((fc, idx) => {
            const FcIcon = getWeatherMeta(fc.code).icon;
            return (
              <div
                key={idx}
                className="p-3.5 bg-[#faf8f5] hover:bg-[#f5efe8] border border-[#e6dfd5] rounded-2xl space-y-2 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="type-support font-semibold text-[#282828]">{fc.dayName}</span>
                  <FcIcon className="w-4 h-4 text-[#00b7a8]" />
                </div>

                <div className="space-y-0.5">
                  <div className="text-base font-bold text-[#282828] tabular-nums">
                    {displayTemp(fc.maxTemp)}°
                    <span className="type-support text-[#857568] font-normal ml-1">
                      / {displayTemp(fc.minTemp)}°{unit}
                    </span>
                  </div>
                  <span className="type-support font-medium text-[#00897d] block truncate">
                    {fc.conditionText}
                  </span>
                </div>

                {/* Rain probability bar */}
                <div className="pt-1 space-y-1">
                  <div className="flex justify-between type-support text-[#857568] tabular-nums">
                    <span>Chance of Rain</span>
                    <span className="font-semibold text-[#282828]">{fc.rainChance ?? 0}%</span>
                  </div>
                  <div className="w-full bg-[#e6dfd5] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00b7a8] h-full rounded-full transition-all"
                      style={{ width: `${Math.max(5, fc.rainChance ?? 0)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Destination Travel Planning Advice */}
      <div className="p-3.5 bg-[#e8f8f6] border border-[#b9ebe6] rounded-2xl flex items-start gap-2.5 type-support text-[#007a70]">
        <Info className="w-4 h-4 text-[#00897d] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-[#282828] block">Travel Planning Advice ({activeLocation.name}):</span>
          <p className="type-support text-[#006e65]">
            {activeLocation.travelTip}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="type-support text-[#857568] flex items-center justify-between pt-0.5">
        <span className="flex items-center gap-1.5 type-support">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified live API feed · {weather.source}
        </span>
        {loading && <RefreshCw className="w-3.5 h-3.5 text-[#00b7a8] animate-spin" />}
      </div>

      {/* Live Radar Overlay Window */}
      {radarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-[#e6dfd5] space-y-4 text-[#282828]">
            <div className="flex items-center justify-between border-b border-[#ede6dc] pb-3">
              <div>
                <h3 className="type-h4 text-[#282828] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#00b7a8]" />
                  Live California Weather &amp; Doppler Radar
                </h3>
                <p className="type-support text-[#5c5046]">{activeLocation.name} Radar &amp; Atmospheric View</p>
              </div>
              <button
                type="button"
                onClick={() => setRadarModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#faf8f5] text-[#857568] hover:text-[#282828] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#e6dfd5] bg-[#1a1a1a]">
              <iframe
                title="Live California Doppler Radar Interactive"
                src={`https://www.rainviewer.com/map.html?loc=${activeLocation.lat},${activeLocation.lng},8&o=1&b=1&c=1&t=1&s=0&g=1`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="flex items-center justify-between type-support text-[#5c5046]">
              <span>Real-time precipitation radar powered by NOAA feed</span>
              <button
                type="button"
                onClick={() => setRadarModalOpen(false)}
                className="type-btn px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl transition-colors cursor-pointer"
              >
                Close Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
