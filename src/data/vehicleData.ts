export interface UsVehicle {
  id: string;
  name: string;
  make: 'Ford' | 'Tesla' | 'Chevrolet' | 'Cadillac' | 'Jeep';
  category: string;
  year: number;
  engine: string;
  drivetrain: string;
  seating: number;
  luggage: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  tagline: string;
  description: string;
  features: string[];
  specs: {
    horsepower: string;
    acceleration: string;
    topSpeed: string;
    efficiency: string;
    fuelType: string;
  };
  defaultColor: string;
  availableColors: { name: string; hex: string }[];
  style3d: {
    bodyShape: 'suv' | 'muscle' | 'luxury_suv' | 'offroad' | 'sedan';
    dimensions: [number, number, number]; // width, height, length
    wheelRadius: number;
    wheelWidth: number;
    hasRoofRack?: boolean;
    hasConvertibleTop?: boolean;
    hasExhaustPipes?: boolean;
    isElectric?: boolean;
  };
}

export const US_VEHICLES: UsVehicle[] = [
  {
    id: 'ford-mustang-gt',
    name: 'Ford Mustang GT Convertible',
    make: 'Ford',
    category: 'American Muscle & Open Air Touring',
    year: 2025,
    engine: '5.0L Ti-VCT Coyote V8',
    drivetrain: 'Rear-Wheel Drive (RWD) with Active Exhaust',
    seating: 4,
    luggage: 2,
    dailyRate: 119,
    weeklyRate: 690,
    monthlyRate: 2350,
    tagline: 'Iconic American Freedom Under California Skies',
    description: 'Experience California highways in the quintessential American open-top muscle car. Featuring Ford’s signature 5.0L Coyote V8, premium leather seating, MagneRide damping, and an automated soft-top for sunny Sacramento drives.',
    features: [
      'Power soft-top convertible with quick 8-second deploy',
      'Selectable active valve performance exhaust',
      '12.4" digital instrument cluster with Track Apps',
      'Bang & Olufsen 12-speaker surround sound',
      'Heated and ventilated leather sport bucket seats',
      'Sacramento & Tahoe highway prep with toll transponder'
    ],
    specs: {
      horsepower: '480 HP @ 7,150 RPM',
      acceleration: '0–60 mph in 4.1 sec',
      topSpeed: '155 mph',
      efficiency: '18 MPG City / 24 MPG Hwy',
      fuelType: 'Premium Gasoline'
    },
    defaultColor: '#c8102e', // Race Red
    availableColors: [
      { name: 'Race Red', hex: '#c8102e' },
      { name: 'Shadow Black', hex: '#111317' },
      { name: 'Grabber Blue', hex: '#005bb5' },
      { name: 'Oxford White', hex: '#f0f3f6' },
      { name: 'Carbonized Gray', hex: '#3d444b' }
    ],
    style3d: {
      bodyShape: 'muscle',
      dimensions: [1.9, 1.25, 4.4],
      wheelRadius: 0.38,
      wheelWidth: 0.28,
      hasConvertibleTop: true,
      hasExhaustPipes: true,
    }
  },
  {
    id: 'tesla-model-y',
    name: 'Tesla Model Y Performance',
    make: 'Tesla',
    category: 'All-Electric Dual Motor Performance SUV',
    year: 2025,
    engine: 'Dual AC Permanent Magnet Electric Motors',
    drivetrain: 'Intelligent All-Wheel Drive (AWD)',
    seating: 5,
    luggage: 4,
    dailyRate: 110,
    weeklyRate: 640,
    monthlyRate: 2200,
    tagline: 'Silent Acceleration & Ultra-Efficient Sacramento Commutes',
    description: 'The premier Silicon Valley engineered crossover. Enjoy instant torque, complimentary access to Tesla Supercharging stations throughout the Central Valley, Autopilot highway assist, and expansive cargo capacity for medical & corporate professionals.',
    features: [
      'Dual Motor AWD with instant 0-60 throttle response',
      'Full glass panoramic roof with infrared tinting',
      '15-inch center touchscreen with streaming & navigation',
      'Over-the-air Sacramento airport and ETL unit delivery',
      'HEPA cabin air filtration system with Bioweapon Defense',
      'Expansive 76 cu ft cargo capacity with front trunk (frunk)'
    ],
    specs: {
      horsepower: '455 HP Equivalent',
      acceleration: '0–60 mph in 3.5 sec',
      topSpeed: '155 mph',
      efficiency: '115 MPGe (303 mi range)',
      fuelType: 'Pure Electric (Complimentary Supercharging)'
    },
    defaultColor: '#2563eb', // Deep Blue Metallic
    availableColors: [
      { name: 'Deep Metallic Blue', hex: '#1e40af' },
      { name: 'Pearl White Multi-Coat', hex: '#f8fafc' },
      { name: 'Solid Black', hex: '#09090b' },
      { name: 'Midnight Silver Metallic', hex: '#475569' },
      { name: 'Ultra Red', hex: '#991b1b' }
    ],
    style3d: {
      bodyShape: 'suv',
      dimensions: [1.95, 1.45, 4.5],
      wheelRadius: 0.4,
      wheelWidth: 0.26,
      isElectric: true,
    }
  },
  {
    id: 'chevy-suburban',
    name: 'Chevrolet Suburban High Country',
    make: 'Chevrolet',
    category: 'Full-Size American Executive Transport',
    year: 2025,
    engine: '6.2L EcoTec3 V8 with Dynamic Fuel Management',
    drivetrain: 'Four-Wheel Drive (4WD) with Autotrac 2-speed',
    seating: 7,
    luggage: 6,
    dailyRate: 165,
    weeklyRate: 980,
    monthlyRate: 3400,
    tagline: 'The Gold Standard of American Room & Road Command',
    description: 'Spacious, commanding, and exceptionally smooth. Designed for executive teams, traveling healthcare crews, and families desiring expansive comfort with four-corner adaptive air suspension and authentic American build quality.',
    features: [
      'Four-Corner Air Ride Adaptive Suspension for pillow ride',
      'Second-row executive captain chairs with personal climate',
      '10-speed electronically controlled automatic transmission',
      'Dual 12.6-inch rear-seat entertainment screens',
      'HD Surround Vision with 13 camera perspectives',
      'Massive 144.7 cu ft cargo volume for long assignment gear'
    ],
    specs: {
      horsepower: '420 HP @ 5,600 RPM',
      acceleration: '0–60 mph in 6.1 sec',
      topSpeed: '130 mph',
      efficiency: '15 MPG City / 20 MPG Hwy',
      fuelType: 'Gasoline'
    },
    defaultColor: '#1c1917', // Black Raven
    availableColors: [
      { name: 'Black Onyx', hex: '#18181b' },
      { name: 'Summit White', hex: '#f4f4f5' },
      { name: 'Dark Ash Metallic', hex: '#334155' },
      { name: 'Auburn Metallic', hex: '#78350f' }
    ],
    style3d: {
      bodyShape: 'luxury_suv',
      dimensions: [2.05, 1.7, 5.3],
      wheelRadius: 0.44,
      wheelWidth: 0.32,
      hasRoofRack: true,
      hasExhaustPipes: true,
    }
  },
  {
    id: 'cadillac-escalade',
    name: 'Cadillac Escalade ESV Platinum',
    make: 'Cadillac',
    category: 'Ultra-Luxury American VIP Flagship',
    year: 2025,
    engine: '6.2L Handcrafted V8 with Magnetic Ride 4.0',
    drivetrain: 'Electronic Full-Time All-Wheel Drive',
    seating: 7,
    luggage: 6,
    dailyRate: 195,
    weeklyRate: 1190,
    monthlyRate: 4100,
    tagline: 'Unrivaled Elegance, Status and Whisper-Quiet Comfort',
    description: 'The pinnacle of American luxury automotive craftsmanship. Features 38 inches of curved OLED dashboard displays, AKG Studio Reference 36-speaker sound, semi-aniline hand-finished leather, and unmatched highway prestige.',
    features: [
      'Curved 38-inch total diagonal OLED displays',
      'AKG Studio Reference 36-speaker 3D audio system',
      'Full semi-aniline leather with 16-way massaging seats',
      'Night Vision thermal imaging with pedestrian detection',
      'Soft-close automatic doors and motorized deployable steps',
      'Chauffeur pickup option to Sacramento International (SMF)'
    ],
    specs: {
      horsepower: '420 HP @ 5,600 RPM',
      acceleration: '0–60 mph in 5.9 sec',
      topSpeed: '130 mph',
      efficiency: '14 MPG City / 19 MPG Hwy',
      fuelType: 'Premium Gasoline'
    },
    defaultColor: '#0f172a', // Galactic Blue / Deep Obsidian
    availableColors: [
      { name: 'Black Raven', hex: '#09090b' },
      { name: 'Galactic Deep Blue', hex: '#0f172a' },
      { name: 'Crystal White Tricoat', hex: '#fafafa' },
      { name: 'Dark Emerald Metallic', hex: '#064e3b' }
    ],
    style3d: {
      bodyShape: 'luxury_suv',
      dimensions: [2.1, 1.75, 5.4],
      wheelRadius: 0.46,
      wheelWidth: 0.34,
      hasRoofRack: true,
      hasExhaustPipes: true,
    }
  },
  {
    id: 'jeep-wrangler',
    name: 'Jeep Wrangler Rubicon 4xe',
    make: 'Jeep',
    category: 'American Adventure Hybrid Convertible 4x4',
    year: 2025,
    engine: '2.0L Turbo I4 + Dual Electric Hybrid Motors',
    drivetrain: 'Rock-Trac Full-Time 4x4 with Locking Differentials',
    seating: 5,
    luggage: 3,
    dailyRate: 125,
    weeklyRate: 740,
    monthlyRate: 2550,
    tagline: 'Legendary Trail Rated Capability with Electric Hybrid Drive',
    description: 'Built for guests seeking California wilderness weekend getaways to Lake Tahoe, Yosemite, and the Sierra Nevada foothills while maintaining silent electric city capability throughout Sacramento and Rancho Cordova.',
    features: [
      'Removable Freedom Top 3-piece hardtop and doors',
      'Rock-Trac 4:1 low gear ratio with electronic sway-bar disconnect',
      'Dana 44 heavy-duty axles with Tru-Lok electronic lockers',
      'Alpine 9-speaker premium all-weather audio system',
      'Waterproof interior with one-way drain valves',
      'Tahoe snow chains & bike rack included upon request'
    ],
    specs: {
      horsepower: '375 HP / 470 lb-ft Torque',
      acceleration: '0–60 mph in 5.2 sec',
      topSpeed: '115 mph',
      efficiency: '49 MPGe / 370 Miles Combined Range',
      fuelType: 'PHEV (Electric + Gasoline)'
    },
    defaultColor: '#0284c7', // Hydro Blue
    availableColors: [
      { name: 'Hydro Blue Metallic', hex: '#0284c7' },
      { name: 'Firecracker Red', hex: '#dc2626' },
      { name: 'Sarge Green', hex: '#3f6212' },
      { name: 'Bright White', hex: '#f8fafc' },
      { name: 'Granite Crystal', hex: '#4b5563' }
    ],
    style3d: {
      bodyShape: 'offroad',
      dimensions: [1.9, 1.65, 4.3],
      wheelRadius: 0.45,
      wheelWidth: 0.35,
      hasRoofRack: true,
    }
  }
];
