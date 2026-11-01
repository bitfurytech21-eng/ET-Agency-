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
    tagline: 'Open-Air California Touring & Weekend Escapes',
    description:
      'Enjoy sunny Northern California drives in Ford’s classic open-top grand tourer. Equipped with a responsive 5.0L V8, heated and ventilated leather seating, MagneRide adaptive damping, and an 8-second power soft-top—well suited for coastal day trips, Napa afternoons, or everyday Sacramento cruising.',
    features: [
      'Power soft-top convertible with quick 8-second deploy',
      'Selectable active valve performance exhaust',
      '12.4-inch digital driver display with Apple CarPlay & Android Auto',
      'Bang & Olufsen 12-speaker audio system',
      'Heated and ventilated leather front seats',
      'Prepared for Greater Sacramento & regional highway travel',
    ],
    specs: {
      horsepower: '480 HP @ 7,150 RPM',
      acceleration: '0–60 mph in 4.1 sec',
      topSpeed: '155 mph',
      efficiency: '18 MPG City / 24 MPG Hwy',
      fuelType: 'Premium Gasoline',
    },
    defaultColor: '#c8102e',
    availableColors: [
      { name: 'Race Red', hex: '#c8102e' },
      { name: 'Shadow Black', hex: '#111317' },
      { name: 'Grabber Blue', hex: '#005bb5' },
      { name: 'Oxford White', hex: '#f0f3f6' },
      { name: 'Carbonized Gray', hex: '#3d444b' },
    ],
    style3d: {
      bodyShape: 'muscle',
      dimensions: [1.9, 1.25, 4.4],
      wheelRadius: 0.38,
      wheelWidth: 0.28,
      hasConvertibleTop: true,
      hasExhaustPipes: true,
    },
  },
  {
    id: 'tesla-model-y',
    name: 'Tesla Model Y Performance',
    make: 'Tesla',
    category: 'All-Electric Dual Motor Crossover SUV',
    year: 2025,
    engine: 'Dual AC Permanent Magnet Electric Motors',
    drivetrain: 'All-Wheel Drive (AWD)',
    seating: 5,
    luggage: 4,
    dailyRate: 110,
    weeklyRate: 640,
    monthlyRate: 2200,
    tagline: 'Quiet All-Electric Comfort for Daily Errands & Regional Travel',
    description:
      'An effortless all-electric crossover with Dual Motor all-wheel drive, generous cargo space for suitcases or strollers, and seamless Supercharger access across Northern California. Popular with families, airport arrivals, and multi-week residents.',
    features: [
      'Dual Motor AWD with smooth, quiet acceleration',
      'Tinted panoramic glass roof',
      '15-inch touchscreen navigation with live charger routing',
      'Available for SMF Airport pickup or residence doorstep delivery',
      'HEPA cabin air filtration',
      '76 cu ft total cargo space including front trunk',
    ],
    specs: {
      horsepower: '455 HP Equivalent',
      acceleration: '0–60 mph in 3.5 sec',
      topSpeed: '155 mph',
      efficiency: '115 MPGe (303 mi range)',
      fuelType: '100% Electric (Supercharger Access)',
    },
    defaultColor: '#2563eb',
    availableColors: [
      { name: 'Deep Metallic Blue', hex: '#1e40af' },
      { name: 'Pearl White Multi-Coat', hex: '#f8fafc' },
      { name: 'Solid Black', hex: '#09090b' },
      { name: 'Midnight Silver Metallic', hex: '#475569' },
      { name: 'Ultra Red', hex: '#991b1b' },
    ],
    style3d: {
      bodyShape: 'suv',
      dimensions: [1.95, 1.45, 4.5],
      wheelRadius: 0.4,
      wheelWidth: 0.26,
      isElectric: true,
    },
  },
  {
    id: 'chevy-suburban',
    name: 'Chevrolet Suburban High Country',
    make: 'Chevrolet',
    category: 'Full-Size Three-Row Family & Group SUV',
    year: 2025,
    engine: '6.2L EcoTec3 V8 with Dynamic Fuel Management',
    drivetrain: 'Four-Wheel Drive (4WD) with Autotrac 2-speed',
    seating: 7,
    luggage: 6,
    dailyRate: 165,
    weeklyRate: 980,
    monthlyRate: 3400,
    tagline: 'Three-Row Space for Families, Relocations & Group Trips',
    description:
      'Roomy, composed, and built for long stretches of highway. With seating for up to seven, second-row captain’s chairs, adaptive air suspension, and expansive luggage capacity, the Suburban handles family visits, household moves, and group outings with ease.',
    features: [
      'Four-Corner Air Ride Adaptive Suspension',
      'Second-row captain’s chairs with tri-zone climate control',
      '10-speed automatic transmission with 4WD',
      'Dual rear-seat entertainment screens for passengers',
      'HD Surround Vision camera views for easy parking',
      '144.7 cu ft maximum cargo capacity',
    ],
    specs: {
      horsepower: '420 HP @ 5,600 RPM',
      acceleration: '0–60 mph in 6.1 sec',
      topSpeed: '130 mph',
      efficiency: '15 MPG City / 20 MPG Hwy',
      fuelType: 'Gasoline',
    },
    defaultColor: '#1c1917',
    availableColors: [
      { name: 'Black Onyx', hex: '#18181b' },
      { name: 'Summit White', hex: '#f4f4f5' },
      { name: 'Dark Ash Metallic', hex: '#334155' },
      { name: 'Auburn Metallic', hex: '#78350f' },
    ],
    style3d: {
      bodyShape: 'luxury_suv',
      dimensions: [2.05, 1.7, 5.3],
      wheelRadius: 0.44,
      wheelWidth: 0.32,
      hasRoofRack: true,
      hasExhaustPipes: true,
    },
  },
  {
    id: 'cadillac-escalade',
    name: 'Cadillac Escalade ESV Platinum',
    make: 'Cadillac',
    category: 'Extended-Length Luxury Three-Row SUV',
    year: 2025,
    engine: '6.2L V8 with Magnetic Ride Control 4.0',
    drivetrain: 'Electronic Full-Time All-Wheel Drive',
    seating: 7,
    luggage: 6,
    dailyRate: 195,
    weeklyRate: 1190,
    monthlyRate: 4100,
    tagline: 'First-Class Cabin Quietness & Extended Three-Row Comfort',
    description:
      'Our flagship full-size luxury SUV pairs whisper-quiet highway poise with extended ESV luggage room. Featuring curved OLED displays, AKG 36-speaker audio, semi-aniline leather seating, and Magnetic Ride damping for special occasions, family travel, or VIP arrivals.',
    features: [
      'Curved 38-inch diagonal OLED driver and infotainment display',
      'AKG Studio Reference 36-speaker sound system',
      'Semi-aniline leather with heated, ventilated, massaging front seats',
      'Night Vision driver assistance',
      'Power retractable assist steps and hands-free liftgate',
      'Optional SMF Airport curbside delivery',
    ],
    specs: {
      horsepower: '420 HP @ 5,600 RPM',
      acceleration: '0–60 mph in 5.9 sec',
      topSpeed: '130 mph',
      efficiency: '14 MPG City / 19 MPG Hwy',
      fuelType: 'Premium Gasoline',
    },
    defaultColor: '#0f172a',
    availableColors: [
      { name: 'Black Raven', hex: '#09090b' },
      { name: 'Galactic Deep Blue', hex: '#0f172a' },
      { name: 'Crystal White Tricoat', hex: '#fafafa' },
      { name: 'Dark Emerald Metallic', hex: '#064e3b' },
    ],
    style3d: {
      bodyShape: 'luxury_suv',
      dimensions: [2.1, 1.75, 5.4],
      wheelRadius: 0.46,
      wheelWidth: 0.34,
      hasRoofRack: true,
      hasExhaustPipes: true,
    },
  },
  {
    id: 'jeep-wrangler',
    name: 'Jeep Wrangler Rubicon 4xe',
    make: 'Jeep',
    category: 'Plug-In Hybrid 4x4 Adventure SUV',
    year: 2025,
    engine: '2.0L Turbo I4 + Plug-In Electric Hybrid Drive',
    drivetrain: 'Rock-Trac Full-Time 4x4',
    seating: 5,
    luggage: 3,
    dailyRate: 125,
    weeklyRate: 740,
    monthlyRate: 2550,
    tagline: 'Sierra Foothills, Lake Tahoe & Everyday Hybrid Versatility',
    description:
      'Ready for weekend trips to Lake Tahoe, Folsom Lake, or Yosemite while offering quiet plug-in hybrid driving around Sacramento neighborhoods. All-weather 4x4 capability meets open-air removable roof panels.',
    features: [
      'Removable 3-piece Freedom Top hardtop panels',
      'Full-time Rock-Trac 4x4 capability for mountain weather',
      'Plug-in hybrid mode for quiet local errands',
      'Alpine 9-speaker all-weather audio system',
      'Durable washout-ready interior flooring',
      'Optional bike rack or winter traction kit on request',
    ],
    specs: {
      horsepower: '375 HP / 470 lb-ft Torque',
      acceleration: '0–60 mph in 5.2 sec',
      topSpeed: '115 mph',
      efficiency: '49 MPGe / 370 Miles Combined Range',
      fuelType: 'Plug-In Hybrid (Electric + Gasoline)',
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
