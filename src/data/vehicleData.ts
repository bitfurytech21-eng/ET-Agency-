export interface SketchfabEmbedInfo {
  modelId: string;
  embedUrl: string;
  modelUrl: string;
  authorName: string;
  authorUrl: string;
  title: string;
}

export interface UsVehicle {
  id: string;
  name: string;
  make: 'Nissan' | 'Skoda' | 'Audi' | 'Volkswagen' | string;
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
  sketchfab: SketchfabEmbedInfo;
  style3d?: {
    bodyShape?: 'suv' | 'muscle' | 'luxury_suv' | 'offroad' | 'sedan';
    dimensions?: [number, number, number];
    wheelRadius?: number;
    wheelWidth?: number;
  };
}

export const US_VEHICLES: UsVehicle[] = [
  {
    id: 'nissan-terra-2020',
    name: 'Nissan Terra 2020',
    make: 'Nissan',
    category: '7-Passenger Rugged 4x4 SUV',
    year: 2020,
    engine: '2.5L Turbo Diesel 4-Cylinder',
    drivetrain: 'Part-Time 4WD with Shift-on-the-Fly & Rear Diff Lock',
    seating: 7,
    luggage: 5,
    dailyRate: 125,
    weeklyRate: 740,
    monthlyRate: 2450,
    tagline: 'Spacious 7-Passenger 4x4 SUV for Family & Sierra Excursions',
    description:
      'The Nissan Terra combines genuine truck-based ladder frame durability with premium three-row seating for seven passengers. Perfect for visiting families, hospital teams, and Tahoe trips with fold-flat seating, multi-link rear suspension, and Nissan Intelligent Mobility safety suite.',
    features: [
      'Genuine 7-passenger three-row configuration with one-touch tumble fold',
      'Selectable 4WD with low-range transfer case and electronic locking rear differential',
      'Around View Monitor with Moving Object Detection',
      'Dual-zone climate control with dedicated rear ceiling AC vents',
      'Roof rails, running boards, and full underbody protection',
      'Prepared for all-season nationwide highway, metropolitan, and alpine travel',
    ],
    specs: {
      horsepower: '190 HP @ 3,600 RPM',
      acceleration: '0–60 mph in 8.9 sec',
      topSpeed: '118 mph',
      efficiency: '22 MPG City / 28 MPG Hwy',
      fuelType: 'Ultra-Low Sulfur Diesel',
    },
    defaultColor: '#1d2a3a',
    availableColors: [
      { name: 'Twilight Pearl Navy', hex: '#1d2a3a' },
      { name: 'Brilliant Silver Metallic', hex: '#b3b9be' },
      { name: 'Pearl White Diamond', hex: '#f4f4f4' },
      { name: 'Earth Brown Metallic', hex: '#4a3828' },
      { name: 'Galaxy Black', hex: '#111214' },
    ],
    sketchfab: {
      modelId: '46727bb6f4f84df5878bed50c58a70bf',
      embedUrl: 'https://sketchfab.com/models/46727bb6f4f84df5878bed50c58a70bf/embed?autostart=1&preload=1&ui_theme=dark&ui_watermark_link=0&ui_color=00b7a8',
      modelUrl: 'https://sketchfab.com/3d-models/nissan-terra-2020-46727bb6f4f84df5878bed50c58a70bf',
      authorName: 'Asadawut.Kaewma',
      authorUrl: 'https://sketchfab.com/Asadawut.Kaewma',
      title: 'Nissan Terra 2020',
    },
  },
  {
    id: 'skoda-karoq-2019',
    name: '2019 Skoda Karoq',
    make: 'Skoda',
    category: 'European Executive Compact Crossover',
    year: 2019,
    engine: '1.5L TSI EVO Turbocharged 4-Cylinder',
    drivetrain: 'Front-Wheel Drive with 7-Speed Dual-Clutch DSG',
    seating: 5,
    luggage: 4,
    dailyRate: 95,
    weeklyRate: 560,
    monthlyRate: 1890,
    tagline: 'Intelligent European Engineering & Agile City-to-Country Utility',
    description:
      'Refined European crossover practicality with Skoda’s renowned VarioFlex modular rear seating. The Karoq delivers crisp handling, responsive turbocharged power, exceptional cargo versatility, and full smartphone integration for visiting medical professionals and consultants.',
    features: [
      'VarioFlex removable & sliding three-piece rear seating system',
      'Columbus 9.2-inch infotainment with Apple CarPlay & Android Auto',
      'Adaptive Cruise Control with Front Assist Emergency Braking',
      'Panoramic glass sunroof with electric sunblind',
      'Electrically operated tailgate with virtual pedal kick sensor',
      'Drive Mode Select with Eco, Normal, Sport, and Individual presets',
    ],
    specs: {
      horsepower: '150 HP @ 5,000 RPM',
      acceleration: '0–60 mph in 8.4 sec',
      topSpeed: '127 mph',
      efficiency: '30 MPG City / 38 MPG Hwy',
      fuelType: 'Regular Unleaded Gasoline',
    },
    defaultColor: '#2b5275',
    availableColors: [
      { name: 'Lava Blue Metallic', hex: '#2b5275' },
      { name: 'Moon White Pearl', hex: '#f0f3f6' },
      { name: 'Steel Grey Metallic', hex: '#49525c' },
      { name: 'Velvet Red Metallic', hex: '#8c1626' },
      { name: 'Black Magic Pearl', hex: '#121417' },
    ],
    sketchfab: {
      modelId: '7e359874ebe744158eddc37c9da8f487',
      embedUrl: 'https://sketchfab.com/models/7e359874ebe744158eddc37c9da8f487/embed?autostart=1&preload=1&ui_theme=dark&ui_watermark_link=0&ui_color=00b7a8',
      modelUrl: 'https://sketchfab.com/3d-models/2019-skoda-karoq-7e359874ebe744158eddc37c9da8f487',
      authorName: 'BHP3D',
      authorUrl: 'https://sketchfab.com/BHP3D',
      title: '2019 Skoda Karoq',
    },
  },
  {
    id: 'audi-a3-2021',
    name: 'Audi A3 2021',
    make: 'Audi',
    category: 'Luxury Compact Executive Sport Sedan',
    year: 2021,
    engine: '2.0L 40 TFSI Turbocharged MHEV Mild Hybrid',
    drivetrain: 'Front-Wheel Drive / 7-Speed S tronic Dual-Clutch',
    seating: 5,
    luggage: 3,
    dailyRate: 115,
    weeklyRate: 680,
    monthlyRate: 2250,
    tagline: 'German Luxury Craftsmanship & Crisp Highway Composure',
    description:
      'The 2021 Audi A3 presents a sculpted exterior with signature Singleframe grille and matrix-design LED headlights. Inside, enjoy Audi Virtual Cockpit digital instrument cluster, leather sport seats, and acoustic windshield glass for a hushed, relaxing commute along Highway 50 and I-80.',
    features: [
      'Audi Virtual Cockpit Plus 12.3-inch high-resolution customizable display',
      'MMI 10.1-inch central touchscreen with acoustic feedback and nav',
      'Panoramic power sunroof and ambient interior LED lighting package',
      'Bang & Olufsen 3D Premium Sound System with 15 speakers',
      'Audi Pre Sense Front with pedestrian & bicyclist avoidance assist',
      'Heated 8-way power front leather seats with 4-way power lumbar',
    ],
    specs: {
      horsepower: '201 HP @ 4,800 RPM',
      acceleration: '0–60 mph in 6.6 sec',
      topSpeed: '130 mph',
      efficiency: '28 MPG City / 36 MPG Hwy',
      fuelType: 'Premium Gasoline',
    },
    defaultColor: '#1d3557',
    availableColors: [
      { name: 'Navarra Blue Metallic', hex: '#1d3557' },
      { name: 'Glacier White Metallic', hex: '#f2f4f7' },
      { name: 'Mythos Black Metallic', hex: '#0e1013' },
      { name: 'Manhattan Gray Metallic', hex: '#3e444b' },
      { name: 'Tango Red Metallic', hex: '#a61c28' },
    ],
    sketchfab: {
      modelId: 'db34a8426f684e299d53fcb2e331d35d',
      embedUrl: 'https://sketchfab.com/models/db34a8426f684e299d53fcb2e331d35d/embed?autostart=1&preload=1&ui_theme=dark&ui_watermark_link=0&ui_color=00b7a8',
      modelUrl: 'https://sketchfab.com/3d-models/audi-a3-2021-db34a8426f684e299d53fcb2e331d35d',
      authorName: '3DStarving',
      authorUrl: 'https://sketchfab.com/3DStarving',
      title: 'Audi A3 2021',
    },
  },
  {
    id: 'vw-jetta-gli',
    name: 'Volkswagen Jetta GLI',
    make: 'Volkswagen',
    category: 'Sport Performance Turbocharged Sedan',
    year: 2022,
    engine: '2.0L TSI EA888 Turbocharged 4-Cylinder',
    drivetrain: 'Front-Wheel Drive with VAQ Mechanical Limited-Slip Differential',
    seating: 5,
    luggage: 4,
    dailyRate: 105,
    weeklyRate: 620,
    monthlyRate: 2050,
    tagline: 'Enthusiast Sport Sedan with Golf GTI DNA & Highway Agility',
    description:
      'The GTI with a trunk. The Jetta GLI packs a 228-horsepower turbocharged powerplant, multi-link rear suspension, DCC adaptive chassis dampers, red-stitched sport seats, and oversized performance brakes for an exhilarating Northern California road trip or executive commute.',
    features: [
      'DCC Adaptive Chassis Control with selectable suspension damping modes',
      'VAQ torque-sensing electronically controlled limited-slip differential',
      'Golf R performance braking system with vented red calipers',
      'Titan Black leather sport seating with red contrast GLI stitching',
      'BeatsAudio 400-watt 8-channel premium audio system',
      'Wireless App-Connect with inductive wireless phone charging pad',
    ],
    specs: {
      horsepower: '228 HP @ 5,000 RPM',
      acceleration: '0–60 mph in 5.6 sec',
      topSpeed: '126 mph',
      efficiency: '26 MPG City / 37 MPG Hwy',
      fuelType: 'Regular or Premium Gasoline',
    },
    defaultColor: '#8a1c22',
    availableColors: [
      { name: 'Tornado Red Sport', hex: '#8a1c22' },
      { name: 'Pure White Gloss', hex: '#f7f7f8' },
      { name: 'Deep Black Pearl', hex: '#0f1114' },
      { name: 'Pure Gray Solid', hex: '#636970' },
      { name: 'Rising Blue Metallic', hex: '#163c78' },
    ],
    sketchfab: {
      modelId: 'fcca9d60045b4b2c94f221ce09d2e574',
      embedUrl: 'https://sketchfab.com/models/fcca9d60045b4b2c94f221ce09d2e574/embed?autostart=1&preload=1&ui_theme=dark&ui_watermark_link=0&ui_color=00b7a8',
      modelUrl: 'https://sketchfab.com/3d-models/volkswagen-jetta-gli-fcca9d60045b4b2c94f221ce09d2e574',
      authorName: '3DStarving',
      authorUrl: 'https://sketchfab.com/3DStarving',
      title: 'Volkswagen Jetta GLI',
    },
  },
  {
    id: 'audi-rs5-2019',
    name: 'Audi RS5 2019',
    make: 'Audi',
    category: 'High-Performance Twin-Turbo Sportback',
    year: 2019,
    engine: '2.9L Twin-Turbocharged TFSI V6',
    drivetrain: 'Quattro Permanent All-Wheel Drive with Sport Rear Differential',
    seating: 5,
    luggage: 4,
    dailyRate: 175,
    weeklyRate: 1050,
    monthlyRate: 3600,
    tagline: 'Supercar Acceleration Meets 5-Door Grand Touring Prestige',
    description:
      'The Audi RS5 Sportback is the pinnacle of executive grand touring. Powered by a Porsche-developed 2.9L twin-turbo V6 generating 444 HP, it sprints from 0 to 60 mph in just 3.7 seconds. Finished with RS sport exhaust, honeycomb Fine Nappa leather, and Quattro all-weather grip.',
    features: [
      'Quattro permanent all-wheel drive with self-locking center differential',
      'Dynamic Ride Control (DRC) hydraulic anti-roll active suspension',
      'RS Sport Oval dual exhaust system with active bypass valves',
      'Fine Nappa leather RS honeycomb sport seats with pneumatic massage',
      'Carbon-fiber exterior trim package & mirror housings',
      'Head-up display with lap timer and G-meter telemetry',
    ],
    specs: {
      horsepower: '444 HP @ 6,700 RPM',
      acceleration: '0–60 mph in 3.7 sec',
      topSpeed: '174 mph',
      efficiency: '18 MPG City / 26 MPG Hwy',
      fuelType: '91+ Octane Premium Gasoline',
    },
    defaultColor: '#174033',
    availableColors: [
      { name: 'Sonoma Green Metallic', hex: '#174033' },
      { name: 'Nardo Gray Solid', hex: '#585e65' },
      { name: 'Mythos Black Metallic', hex: '#0a0b0d' },
      { name: 'Glacier White Pearl', hex: '#f0f2f5' },
      { name: 'Misano Red Pearl', hex: '#941724' },
    ],
    sketchfab: {
      modelId: 'fae1a4186d464a6aae351ce9e9ff2401',
      embedUrl: 'https://sketchfab.com/models/fae1a4186d464a6aae351ce9e9ff2401/embed?autostart=1&preload=1&ui_theme=dark&ui_watermark_link=0&ui_color=00b7a8',
      modelUrl: 'https://sketchfab.com/3d-models/audi-rs5-2019-fae1a4186d464a6aae351ce9e9ff2401',
      authorName: 'Indians',
      authorUrl: 'https://sketchfab.com/Indians',
      title: 'Audi RS5 2019',
    },
  },
];
