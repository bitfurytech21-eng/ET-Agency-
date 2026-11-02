import { LA_PROPERTIES } from './laLodgingData';
import {
  BedroomDetail,
  BlockedDateRange,
  PropertyLocationInfo,
  SeasonalPricingRule,
  enrichPropertyRecord,
} from './propertyEnrichment';

export type {
  BedroomDetail,
  BlockedDateRange,
  PropertyLocationInfo,
  SeasonalPricingRule,
} from './propertyEnrichment';

export interface PropertyListing {
  id: string;
  code: string;
  unitNumber: string;
  slug: string;
  title: string;
  category?: string;
  shortDesc: string;
  fullDesc: string;
  bedrooms: number;
  bathrooms: number;
  floor: 'Downstairs' | 'Upstairs';
  location: string;
  images: string[];
  features: string[];
  amenities: string[];
  monthlyRate: number;
  startingRate: string;
  pricingNote?: string;
  status: 'Available' | 'Inquired' | 'Reserved';
  sqft?: string;
  liveUrl?: string;
  minimumStayDays?: number;
  maximumStayDays?: number;
  maxGuests?: number;
  propertyType?: string;
  verified?: boolean;
  facilities?: string[];
  videoTourUrl?: string;
  videoPosterUrl?: string;
  bedroomsDetail?: BedroomDetail[];
  seasonalPricing?: SeasonalPricingRule[];
  blockedDates?: BlockedDateRange[];
  locationInfo?: PropertyLocationInfo;
}

export type Property = PropertyListing;

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  date: string;
  rating: number;
  content: string;
  image?: string;
  badge?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  coverImage?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Stays & Amenities' | 'Booking & Policies';
}

export interface HouseRule {
  id: string;
  title: string;
  description: string;
  icon: string;
  strictness: 'Required' | 'Standard Policy' | 'Strict';
}

export const FALLBACK_PROPERTY_IMAGES: string[] = [
  '/assets/aistudio/IMG_7507_859e455d.jpeg',
  '/assets/aistudio/IMG_7508_48161a22.jpeg',
  '/assets/aistudio/IMG_7509_f0c79223.jpeg',
  '/assets/aistudio/IMG_7512_017601e0.jpeg',
  '/assets/aistudio/IMG_7513_1054402c.jpeg',
  '/assets/aistudio/IMG_7514_ed633c70.jpeg',
  '/assets/aistudio/IMG_7515_4de98041.jpeg',
  '/assets/aistudio/IMG_7516_dce1d031.jpeg',
  '/assets/aistudio/IMG_7518_0ee1a951.jpeg',
  '/assets/aistudio/IMG_7520_e944fa06.jpeg',
  '/assets/aistudio/IMG_7521_7eb0f68d.jpeg',
  '/assets/aistudio/IMG_7522_32340e37.jpeg',
  '/assets/aistudio/IMG_7523_c24ad0f9.jpeg',
  '/assets/aistudio/IMG_7525_5c632db5.jpeg',
];

export function getFallbackPropertyImage(index = 0): string {
  return FALLBACK_PROPERTY_IMAGES[Math.abs(index) % FALLBACK_PROPERTY_IMAGES.length];
}

export const COMPANY_INFO = {
  name: 'Easy Travel Lodging',
  shortName: 'Easy Travel Lodging',
  tagline: 'Furnished Residences, Fleet Mobility & Concierge Care',
  subtagline:
    'Thoughtfully equipped 1- and 2-bedroom residences, flexible stays from 5 nights to 12+ months, and attentive executive hospitality across California’s homes.',
  phone: '916-800-3295',
  phoneClean: '9168003295',
  email: 'easytravelagency@trustagent.space',
  location: 'California’s homes · Regional Agency Network',
  hours: 'Available 7 Days a Week for Guest Support & Inquiries',
  checkInTime: '2:00 PM',
  checkOutTime: '11:00 AM',
  minimumStay: 'Flexible Short Stays (5+ Nights) & Extended Stays (30+ Days)',
  logoUrl: 'https://easytravellodging.com/wp-content/uploads/2022/02/Easy-Travel-Lodging-Logo_jpeg-color.jpg',
  founders: [
    {
      name: 'Bill Wheelock',
      title: 'Co-Founder & Host',
      bio: "Bill’s career in Information Systems Management had him busy traveling around California’s homes heading up teams installing enterprise computer systems across diverse industries. A Private Pilot for over 40 years, Radio Voiceover artist, and Navy Veteran who served in Vietnam, Bill holds an undergraduate degree from the University of San Francisco and an MBA from the University of Phoenix.",
      image: 'https://easytravellodging.com/wp-content/uploads/2023/01/Bill-Marlena-casual.jpg',
    },
    {
      name: 'Dr. Marlena Uhrik',
      title: 'Co-Founder & Host',
      bio: "Marlena dedicated her career to Education, progressing from elementary school educator in diverse classrooms to completing her Doctorate degree in Educational Leadership. She retired as an Educational Consultant for the California Department of Education, honored as an Olympic Torchbearer in 1996 and recognized with local, state, and international awards for her leadership and philanthropy.",
      image: 'https://easytravellodging.com/wp-content/uploads/2023/01/Bill-Marlena-dressedup.jpg',
    }
  ],
  awards: [
    {
      title: 'Better Business Bureau Torch Award',
      organization: 'Better Business Bureau (BBB)',
      description: 'The highest distinction awarded for Business Ethics. Celebrates organizations demonstrating exceptional character, building community trust, and upholding supreme ethical standards.',
      image: 'https://easytravellodging.com/wp-content/uploads/2025/11/BBB-Torch-Award-web.jpg',
      badge: 'https://seal-necal.bbb.org/seals/blue-seal-120-61-bbb-90076707.png',
    },
    {
      title: 'Congressional Recognition',
      organization: 'U.S. Congressman Ami Bera',
      description: 'Presented by U.S. Congressman Ami Bera honoring Easy Travel Lodging for community leadership and dedicated hospitality service in California’s 6th Congressional District.',
      image: 'https://easytravellodging.com/wp-content/uploads/2025/11/Congressional-Recognition-Ami-Bera-web.jpg',
      badge: 'U.S. Congress',
    },
    {
      title: 'California State Assembly Commendation',
      organization: 'California Assemblymember Josh Hoover',
      description: 'Awarded by Assemblymember Josh Hoover for setting exemplary standards in corporate housing, guest care, and local business leadership in Rancho Cordova.',
      image: 'https://easytravellodging.com/wp-content/uploads/2025/11/CA-State-Assembly-Josh-Hoover-web.jpg',
      badge: 'State Assembly',
    },
    {
      title: 'California State Senate Commendation',
      organization: 'California State Senator Roger Niello',
      description: 'Conferred by Senator Roger Niello recognizing ethical corporate stewardship, military veteran entrepreneurship, and community impact.',
      image: 'https://easytravellodging.com/wp-content/uploads/2025/11/CA-State-Senate-Roger-Niello-web.jpg',
      badge: 'State Senate',
    }
  ],
  communityBadge: 'https://easytravellodging.com/wp-content/uploads/2022/12/RANCHO-CORDOVA-PROUD-MEMBER-BADGE.jpg'
};

// Authentic scraped property listings from easytravellodging.com
const RAW_PROPERTIES: PropertyListing[] = [
  {
    id: 'unit-91',
    code: '#A',
    unitNumber: 'Unit 91',
    slug: 'one-bedroom-one-bath-downstairs-91',
    title: 'One-Bedroom Ground-Floor Suite (Residence A)',
    category: 'Furnished Residence • Short & Extended Stays',
    shortDesc:
      'Step-free ground-floor one-bedroom apartment with an updated kitchen, wood-burning fireplace, private patio, and reserved covered parking.',
    fullDesc:
      'Set in a peaceful, landscaped Rancho Cordova community, Residence A offers comfortable single-level living for solo travelers, couples, relocating households, and guests visiting family or regional medical and academic centers.\n\nInside, you will find a full-size updated kitchen stocked with cookware and dinnerware, an in-unit washer and dryer, a welcoming living area with a wood-burning fireplace and 55-inch Smart TV, high-speed Wi-Fi, and a private patio steps from your reserved covered parking space.',
    bedrooms: 1,
    bathrooms: 1,
    floor: 'Downstairs',
    location: 'Rancho Cordova / Greater Sacramento, CA',
    monthlyRate: 2500,
    startingRate: 'From $2,500 / Month',
    pricingNote:
      'Includes utilities, high-speed Wi-Fi, and covered parking. Available for 5–29 night short stays and 30+ day tax-exempt extended stays.',
    status: 'Available',
    sqft: '680 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://easytravellodging.com/one-bedroom-one-bath-downstairs-91/',
    images: [
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1671.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1696.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-2.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1705.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1672.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1662.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1684.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1686.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/p91-lr.jpg',
    ],
    features: [
      'Updated full kitchen with full-size appliances, coffee maker, and cookware',
      'In-unit washer and dryer with initial laundry supplies',
      'Living room with wood-burning fireplace and 55-inch Smart TV',
      'Private ground-level patio for outdoor dining or quiet mornings',
      'Queen bedroom with generous closet storage and blackout curtains',
      'Step-free ground-floor entry with no exterior stairs',
      'Assigned covered parking space near your entrance',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Disabled Facilities',
      'Fireplace',
      'In-Unit Washer/Dryer',
      'Private Patio',
    ],
  },
  {
    id: 'unit-173',
    code: '#B',
    unitNumber: 'Unit 173',
    slug: 'one-bedroom-one-bath-downstairs-173',
    title: 'One-Bedroom Courtyard Suite (Residence B)',
    category: 'Pet-Friendly Residence • Short & Extended Stays',
    shortDesc:
      'Calm ground-floor one-bedroom suite featuring curated furnishings, a cozy fireplace, private patio, workspace, and pet-friendly options on approval.',
    fullDesc:
      'Residence B pairs residential warmth with everyday practicality in Greater Sacramento. Thoughtfully arranged for solo guests, couples, homeowners between closings or renovations, and travelers bringing an approved pet, this ground-floor apartment makes it easy to settle into your normal routine.\n\nPrepare meals in the updated kitchen, unwind beside the fireplace with a 55-inch Smart TV, handle laundry inside your suite, or step out onto your private fenced patio. Shops, neighborhood dining, American River Parkway trails, and Highway 50 are all minutes away.',
    bedrooms: 1,
    bathrooms: 1,
    floor: 'Downstairs',
    location: 'Rancho Cordova / Greater Sacramento, CA',
    monthlyRate: 2500,
    startingRate: 'From $2,500 / Month',
    pricingNote:
      'Includes utilities, high-speed Wi-Fi, and covered parking. Available for 5–29 night short stays and 30+ day tax-exempt extended stays.',
    status: 'Available',
    sqft: '710 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://easytravellodging.com/one-bedroom-one-bath-downstairs-173/',
    images: [
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4864.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3271.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3274.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3269.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3280.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3279.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3285.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3272.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3289.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3264.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3267.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3265.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3287.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3266.jpg',
    ],
    features: [
      'Ground-floor entry with nearby reserved covered parking',
      'Wood-burning fireplace with warm ambient lighting',
      '55-inch Smart TV in living area plus bedroom Smart TV',
      'Updated full kitchen with full-size appliances and starter essentials',
      'In-unit washer and dryer',
      'Private fenced outdoor patio',
      'Pet-friendly accommodations available with prior approval',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Pets Allowed',
      'Fireplace',
      'In-Unit Washer/Dryer',
      'Private Patio',
    ],
  },
  {
    id: 'unit-250',
    code: '#C',
    unitNumber: 'Unit 250',
    slug: 'two-bedroom-two-bath-upstairs-250',
    title: 'Two-Bedroom Vaulted Upper Residence (Residence C)',
    category: 'Family & Dual-Suite Residence • Short & Extended Stays',
    shortDesc:
      'Bright upstairs two-bedroom, two-bath apartment with vaulted ceilings, a private balcony, and generous space for families or shared stays.',
    fullDesc:
      'Residence C offers 960 square feet of sunlit upper-level living with vaulted ceilings and two well-separated bedrooms and full bathrooms. The layout works equally well for families, households bridging a home sale or remodel, colleagues sharing accommodations, or guests who want a dedicated home office separate from the primary bedroom.\n\nEnjoy a fully equipped kitchen with ample counter space, in-unit laundry, a living room fireplace, a private balcony overlooking mature trees, and access to the community pools, spa, fitness center, and courts.',
    bedrooms: 2,
    bathrooms: 2,
    floor: 'Upstairs',
    location: 'Rancho Cordova / Greater Sacramento, CA',
    monthlyRate: 2800,
    startingRate: 'From $2,800 / Month',
    pricingNote:
      'Includes utilities, high-speed Wi-Fi, and covered parking. Available for 5–29 night short stays and 30+ day tax-exempt extended stays.',
    status: 'Available',
    sqft: '960 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://easytravellodging.com/two-bedroom-two-bath-upstairs-250/',
    images: [
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2936.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2928.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2932.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4658.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2934.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2938.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2954.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4664.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2953.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4681.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4678.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4667.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2944.jpg',
    ],
    features: [
      'Two private bedrooms and two full bathrooms for household privacy',
      'Vaulted ceilings with abundant natural light and tree-lined views',
      'Living room fireplace and 55-inch 4K Smart TV',
      'Full kitchen with dishwasher, microwave, coffee maker, and dinnerware',
      'In-unit washer and dryer with starter supplies',
      'Private upstairs balcony',
      'Access to community fitness center, swimming pools, spa, and courts',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Fireplace',
      'In-Unit Washer/Dryer',
      'Private Balcony',
      'Chef Kitchen',
    ],
  },
  {
    id: 'unit-333',
    code: '#D',
    unitNumber: 'Unit 333',
    slug: 'exquisite-2-bedroom-midterm-rental-in-rancho-cordova-333',
    title: 'Two-Bedroom Designer Upper Suite (Residence D)',
    category: 'Two-Bedroom Suite • Short & Extended Stays',
    shortDesc:
      'Refined two-bedroom, two-bath residence with quartz kitchen counters, three Smart TVs, private balcony, and high-speed Wi-Fi.',
    fullDesc:
      'Residence D blends modern residential finishes with everyday comfort. Designed for families visiting Greater Sacramento, relocating homeowners, remote workers, and multi-week travelers, this quiet upstairs apartment provides room to cook, work, and unwind.\n\nBoth bedrooms include queen mattresses with crisp 400–600 thread count linens and dedicated 43-inch Smart TVs, complementing the 55-inch Smart TV and fireplace in the main living room. An updated kitchen with stone counters, in-unit laundry, and a peaceful balcony overlooking landscaped grounds complete the home.',
    bedrooms: 2,
    bathrooms: 2,
    floor: 'Upstairs',
    location: 'Rancho Cordova / Greater Sacramento, CA',
    monthlyRate: 2800,
    startingRate: 'From $2,800 / Month',
    pricingNote:
      'Includes utilities, high-speed Wi-Fi, and covered parking. Available for 5–29 night short stays and 30+ day tax-exempt extended stays.',
    status: 'Available',
    sqft: '980 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://easytravellodging.com/exquisite-2-bedroom-midterm-rental-in-rancho-cordova-333/',
    images: [
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_115.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_114.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_117.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_116.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_121.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_118.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_120.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_123.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_119.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_122.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_124.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_125.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_103.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_107.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_126.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_105.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_106.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_113.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_108.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_110.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_112.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_111.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_109.jpg',
    ],
    features: [
      'Three Smart TVs: 55-inch in living room plus 43-inch TV in each bedroom',
      'Two queen bedrooms with hotel-grade mattresses and crisp cotton linens',
      'Two full bathrooms with newly reglazed tubs and fresh white towels',
      'Updated kitchen with stone counters, Keurig coffee maker, and Instant Pot',
      'In-unit washer and dryer',
      'Private sunlit balcony overlooking landscaped grounds',
      'High-speed 400+ Mbps Wi-Fi for video calls, remote learning, and streaming',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Fireplace',
      '3 Smart TVs',
      'In-Unit Washer/Dryer',
      'Private Patio',
    ],
  },
  {
    id: 'unit-335',
    code: '#E',
    unitNumber: 'Unit 335',
    slug: 'luxury-2-bedroom-midterm-rental-in-rancho-cordova-335',
    title: 'Two-Bedroom Premier Patio Residence (Residence E)',
    category: 'Ground-Floor Two-Bedroom • Short & Extended Stays',
    shortDesc:
      'Spacious ground-floor two-bedroom, two-bath residence with a wood-burning fireplace, secluded patio, and full club amenities.',
    fullDesc:
      'Our largest ground-floor layout, Residence E offers 990 square feet of relaxed, single-level living in Rancho Cordova. With two spacious bedrooms, two full bathrooms, a built-in dining credenza, a full kitchen, and a secluded outdoor patio, it comfortably accommodates families, insurance-displaced homeowners, multi-week vacationers, and project teams.\n\nGuests also enjoy full access to community amenities—including a 24-hour fitness center, swimming pools, heated spas, and tennis and volleyball courts—along with central heating and air, in-unit laundry, and reserved covered parking.',
    bedrooms: 2,
    bathrooms: 2,
    floor: 'Downstairs',
    location: 'Rancho Cordova / Greater Sacramento, CA',
    monthlyRate: 2800,
    startingRate: 'From $2,800 / Month',
    pricingNote:
      'Includes utilities, high-speed Wi-Fi, and covered parking. Available for 5–29 night short stays and 30+ day tax-exempt extended stays.',
    status: 'Available',
    sqft: '990 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://easytravellodging.com/luxury-2-bedroom-midterm-rental-in-rancho-cordova-335/',
    images: [
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5339.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5342.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4881.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-2_kitchen_sink.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc_bathroom.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2934.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5257.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5267.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5258.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5262.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5268.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5275.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5277.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5274.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5280.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5337.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4228.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2953.jpg',
      'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/cc-335-img_5259.jpg',
    ],
    features: [
      'Spacious two-bedroom, two-bathroom ground-floor layout',
      'Community access: 24-hour gym, pools, heated spas, tennis & volleyball courts',
      'Wood-burning fireplace and 55-inch 4K Smart TV in the living room',
      'Full kitchen with refrigerator, range, microwave, and dishwasher',
      'Built-in dining credenza for extra household storage',
      'In-unit washer and dryer with starter detergent',
      'Secluded private patio for quiet outdoor relaxation',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Fireplace',
      'In-Unit Washer/Dryer',
      'Private Patio',
      'Pool & Spa Access',
    ],
  },
  {
    id: 'la-briarcrest-villa',
    code: '#LA-01',
    unitNumber: 'Villa Briarcrest',
    slug: 'briarcrest-estate-beverly-hills-luxury-villa',
    title: 'The Briarcrest Estate Villa (Los Angeles Collection)',
    category: 'Luxury Vacation Villa • Beverly Hills / Hollywood Hills, CA',
    shortDesc:
      'Gated multi-level luxury estate with an infinity pool, heated spa, panoramic skyline views, outdoor chef kitchen, and private cinema.',
    fullDesc:
      'Rebranded and curated under Easy Travel Lodging, Villa Briarcrest stands atop a private knoll between Beverly Hills and the Hollywood Hills. Featuring over 6,500 square feet of indoor-outdoor entertainment space, floor-to-ceiling glass walls, a heated infinity-edge pool, private spa, and sun loungers overlooking the Los Angeles basin.\n\nIdeal for executive retreats, extended entertainment production stays, family reunions, and high-profile guests seeking maximum privacy with 24/7 concierge support, secure gated access, and private chef catering options.',
    bedrooms: 5,
    bathrooms: 6,
    floor: 'Downstairs',
    location: 'Beverly Hills / Los Angeles, CA',
    monthlyRate: 12500,
    startingRate: 'From $12,500 / Month',
    pricingNote:
      'Includes estate utilities, gigabit fiber Wi-Fi, bi-weekly pool & garden care, and gated driveway parking. Available for 5+ night short stays and 30+ day leases.',
    status: 'Available',
    sqft: '6,500 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://stayawhile.com/los-angeles-vacation-rentals',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=80',
    ],
    features: [
      'Private gated knoll with security surveillance & smart lock entry',
      'Heated ocean-to-city infinity pool and 10-person whirlpool spa',
      'Gourmet chef kitchen with Sub-Zero & Wolf appliances',
      'Custom home cinema with Dolby Atmos surround sound',
      'Outdoor dining pavilion with BBQ grill, fire pit, and lounge seating',
      'Gigabit fiber Wi-Fi and smart home automation throughout',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Fireplace',
      'Private Pool & Spa',
      'In-Unit Washer/Dryer',
      'Chef Kitchen',
      'Gated Entry',
    ],
  },
  {
    id: 'la-belair-sanctuary',
    code: '#LA-02',
    unitNumber: 'Residence Bel-Air',
    slug: 'bel-air-executive-sanctuary-residence',
    title: 'The Bel-Air Executive Residence (Los Angeles Collection)',
    category: 'Executive Residence • Bel-Air / Los Angeles, CA',
    shortDesc:
      'Gated Mediterranean villa featuring lush gardens, a private swimming pool, dual home offices, and an EV charging garage.',
    fullDesc:
      'Set behind stone gates in prestigious Bel-Air, this 4-bedroom executive sanctuary offers tranquility minutes from Sunset Boulevard and UCLA Medical Center. Handcrafted architectural details, high wood-beamed ceilings, a wood-burning fireplace, and formal dining create an elegant residence for relocating executives and families.\n\nOutdoors, step into manicured olive groves and a swimming pool. The home features dual executive office suites equipped with high-speed fiber internet and ergonomic seating, making remote management effortless.',
    bedrooms: 4,
    bathrooms: 4,
    floor: 'Downstairs',
    location: 'Bel-Air / Los Angeles, CA',
    monthlyRate: 9800,
    startingRate: 'From $9,800 / Month',
    pricingNote:
      'Includes utilities, gardener, pool service, and Level 2 EV charging. Available for 5+ night short stays and 30+ day tax-exempt leases.',
    status: 'Available',
    sqft: '4,800 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://stayawhile.com/los-angeles-vacation-rentals',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b816e133e?auto=format&fit=crop&w=1600&q=80',
    ],
    features: [
      'Gated Bel-Air address with private motor court & EV charger',
      'Heated pool and tranquil landscaped gardens',
      'Dual dedicated home office spaces with fiber internet',
      'Primary suite with private balcony, fireplace, and soaking tub',
      'Sub-Zero kitchen appliances and breakfast nook',
      'In-unit laundry room with high-capacity washer and dryer',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Fireplace',
      'Private Pool & Spa',
      'In-Unit Washer/Dryer',
      'Dedicated Workspace',
    ],
  },
  {
    id: 'la-malibu-coastal-villa',
    code: '#LA-03',
    unitNumber: 'Villa Malibu Beach',
    slug: 'malibu-oceanfront-coastal-retreat',
    title: 'Malibu Oceanfront Retreat (Los Angeles Collection)',
    category: 'Coastal Luxury Residence • Malibu, CA',
    shortDesc:
      'Oceanfront architectural home with direct beach staircase, panoramic Pacific Ocean views, floor-to-ceiling glass, and a wrap-around deck.',
    fullDesc:
      'Experience California coastal living at its finest. This Malibu oceanfront residence offers floor-to-ceiling glass walls framing views of Catalina Island, dolphins in the surf, and Pacific sunsets. Walk directly down your private staircase to sand and tide pools.\n\nInside, an open-concept living area features polished white oak floors, a stone fireplace, a gourmet kitchen, and plush master suites with ocean-view balconies. Prepared with Easy Travel Lodging’s signature guest kit and optional coastal concierge services.',
    bedrooms: 3,
    bathrooms: 3,
    floor: 'Downstairs',
    location: 'Malibu Beach / Los Angeles, CA',
    monthlyRate: 11200,
    startingRate: 'From $11,200 / Month',
    pricingNote:
      'Includes beach maintenance, ocean-front utilities, high-speed Wi-Fi, and private garage parking.',
    status: 'Available',
    sqft: '3,400 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://stayawhile.com/los-angeles-vacation-rentals',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
    ],
    features: [
      'Direct beach stairs leading to Malibu sand & surf',
      'Wrap-around oceanfront deck with outdoor fire table & glass railings',
      'Master suite with ocean view balcony & spa soaking bath',
      'Floor-to-ceiling architectural glass walls & motorized shades',
      'Sound system, Smart TVs in every room, and fiber internet',
      'Private 2-car garage with electronic keypad entry',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Fireplace',
      'Private Balcony',
      'In-Unit Washer/Dryer',
      'Oceanfront',
    ],
  },
  {
    id: 'la-hollywood-view-estate',
    code: '#LA-04',
    unitNumber: 'Hollywood Skyline Haven',
    slug: 'hollywood-hills-panoramic-skyline-villa',
    title: 'Hollywood Hills Panoramic Haven (Los Angeles Collection)',
    category: 'Architectural Villa • Hollywood Hills, CA',
    shortDesc:
      'Contemporary glass-walled villa perched in the Hollywood Hills featuring a infinity lounge deck, outdoor spa, and city light views.',
    fullDesc:
      'Overlooking the sparkling lights of Los Angeles and the iconic Hollywood Sign, this contemporary 3-bedroom architectural villa combines sleek design with cozy comfort. Sliding glass doors merge the open living space with a expansive terrace, complete with a heated spa, fire pit, and dining space.\n\nEquipped with high-speed fiber internet, dedicated gym space, smart lock keyless entry, and secure garage parking. Perfect for corporate stays, entertainment industry professionals, and vacationing families.',
    bedrooms: 3,
    bathrooms: 3,
    floor: 'Upstairs',
    location: 'Hollywood Hills / Los Angeles, CA',
    monthlyRate: 8500,
    startingRate: 'From $8,500 / Month',
    pricingNote:
      'Includes utilities, high-speed Wi-Fi, garage parking, and weekly maintenance.',
    status: 'Available',
    sqft: '3,100 sq ft',
    minimumStayDays: 5,
    liveUrl: 'https://stayawhile.com/los-angeles-vacation-rentals',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
    ],
    features: [
      'Unobstructed city skyline and mountain views',
      'Expansive lounge deck with heated whirlpool spa & fire pit',
      'Private fitness room with Peloton bike & weights',
      'Modern kitchen with quartz waterfall island',
      '3 Smart TVs, Sonos audio, and fiber Wi-Fi',
      'Attached 2-car garage with direct interior access',
    ],
    amenities: [
      'WiFi',
      'TV',
      'Air Conditioning',
      'Bathroom',
      'Fireplace',
      'Private Spa',
      'In-Unit Washer/Dryer',
      'Fitness Gym',
    ],
  },
  ...LA_PROPERTIES,
];

export const PROPERTIES: PropertyListing[] = RAW_PROPERTIES.map((p) => enrichPropertyRecord(p));

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Stacy S.',
    role: 'Traveling Nurse / Healthcare Specialist',
    date: 'Recent Stay',
    rating: 5,
    content: 'My stay with Easy Travel Lodging in Rancho Cordova was hands down the best experience I have ever had while traveling for work! Bill and Marlena made sure everything was ready for me, right down to the welcome basket with local treats and starter laundry supplies. The bed was so comfortable after a 12-hour shift, and having my own washer/dryer was a lifesaver.',
    image: 'https://easytravellodging.com/wp-content/uploads/2023/06/Stacy-S.png',
    badge: 'Verified Healthcare Guest'
  },
  {
    id: 'rev-2',
    author: 'Jayda F.',
    role: 'Corporate Relocation Executive',
    date: '3-Month Stay',
    rating: 5,
    content: 'Easy Travel Lodging gave us our sanity back while we waited for our new home in Sacramento to close. The condo was spotless, beautifully furnished, and genuinely felt like home rather than an impersonal hotel room. The high-speed internet made remote work effortless, and Bill was always just a phone call away if we had any questions. Highly recommend!',
    image: 'https://easytravellodging.com/wp-content/uploads/2023/06/Jayda-F.-.png',
    badge: 'Relocation Guest'
  },
  {
    id: 'rev-3',
    author: 'Joanne H.',
    role: 'Visiting Consultant & Digital Nomad',
    date: '60-Day Stay',
    rating: 5,
    content: 'Bill and Marlena are exceptional hosts! The attention to detail is remarkable—from the 400+ count sheets to the fully equipped kitchen with an Instant Pot and Keurig. The neighborhood is quiet and safe, and having the pool and fitness center on-site made my extended stay in California truly rejuvenating. Their BBB Torch Award is so well deserved!',
    image: 'https://easytravellodging.com/wp-content/uploads/2023/06/Joanne-H.png',
    badge: 'Consultant & Nomad'
  },
  {
    id: 'rev-4',
    author: 'Michael T.',
    role: 'IT Systems Architect',
    date: '4-Month Project Assignment',
    rating: 5,
    content: 'As someone who travels for long-term tech contracts, hotel rooms get old fast. ETL provided a quiet, dedicated desk, blazing fast internet (tested above 420 Mbps), and all utilities included with zero billing hassle. The starter kit saved me from shopping on night one. Truly top tier corporate housing.',
    badge: 'Verified Tech Traveler'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'Who stays with Easy Travel Lodging?',
    answer:
      'We welcome a wide range of guests—families visiting relatives or relocating across California’s homes, homeowners bridging a closing or home renovation, traveling healthcare professionals and university fellows, remote consultants, and corporate organizations arranging extended accommodations nationwide.',
  },
  {
    id: 'faq-2',
    category: 'General',
    question: 'What stay lengths are available?',
    answer:
      'We offer both short stays (5 to 29 nights) and extended stays (30 days to 12+ months). Stays of 30 consecutive days or longer qualify for California extended-stay occupancy tax exemption.',
  },
  {
    id: 'faq-3',
    category: 'General',
    question: 'How does Easy Travel Lodging differ from standard hotels or peer-to-peer vacation listings?',
    answer:
      'Every residence is locally operated and inspected by co-founders Bill Wheelock and Dr. Marlena Uhrik. Unlike a compact hotel room, you receive a full kitchen, in-unit washer and dryer, separate living and sleeping areas, covered parking, all utilities, and optional vehicle rentals or arrival services in a single checkout.',
  },
  {
    id: 'faq-4',
    category: 'General',
    question: 'Can I bundle a residence, vehicle rental, and guest services in one cart?',
    answer:
      'Yes. You can add furnished apartments, 3D fleet rentals, airport transfers, pantry provisioning, ergonomic home-office setups, housekeeping sessions, or prepaid Lodging Unit bundles to one shopping cart and check out under a single order reference.',
  },
  {
    id: 'faq-5',
    category: 'General',
    question: 'What makes our residences feel like a real home?',
    answer:
      'Each apartment is prepared with hotel-grade bedding, plush bath towels, a full cookware-equipped kitchen, high-speed Wi-Fi, an arrival Welcome Basket, a local Area Guidebook, and our signature Starter Kit so you never need to run errands the night you arrive.',
  },
  {
    id: 'faq-6',
    category: 'Stays & Amenities',
    question: 'What is included in the Easy Travel Lodging Starter Kit?',
    answer:
      'Every stay includes initial household essentials so you can settle in right away:\n• Paper towels and extra bath tissue\n• Eco-friendly bath toiletries and shampoo\n• Laundry pods and dishwasher detergent\n• Food storage bags, wrap, and aluminum foil\n• Vacuum, broom, Swiffer, trash bags, and surface cleaners\n• Desk supplies and a generous set of closet hangers',
  },
  {
    id: 'faq-7',
    category: 'Stays & Amenities',
    question: 'What will I find in the Guest Guidebook?',
    answer:
      'Each residence includes local neighborhood maps, seasonal community calendars, dining and tasting-room recommendations, American River Parkway trail tips, and family-friendly activity ideas—including coloring books and crayons for younger guests.',
  },
  {
    id: 'faq-8',
    category: 'Stays & Amenities',
    question: 'What comfort and safety features come standard?',
    answer:
      'Residences feature queen mattresses with freshly laundered protectors, two sets of 400–600 thread count cotton sheets, plush white bath towels, Smart TVs in the living area and bedrooms, electronic keypad locks, reserved parking, and utilities included in your rate.',
  },
  {
    id: 'faq-9',
    category: 'Stays & Amenities',
    question: 'How are the kitchens equipped?',
    answer:
      'Every apartment has a full-size refrigerator, range and oven, microwave, dishwasher, coffee maker, Instant Pot, dishes and flatware, glassware, mixing bowls, bakeware, and everyday cooking utensils, plus an in-unit washer and dryer.',
  },
  {
    id: 'faq-10',
    category: 'Booking & Policies',
    question: 'How do checkout payments and payment verification work?',
    answer:
      'You can pay immediately using verified Lodging Units in your Client Portal (1 Unit = $100 USD) or remit via Bank Wire, Direct ACH, or Zelle. Wire, ACH, and Zelle orders remain in Pending Verification status until bank clearance is confirmed by our accounting team, after which your official Paid & Confirmed receipt is issued.',
  },
  {
    id: 'faq-11',
    category: 'Booking & Policies',
    question: 'What are the standard check-in and check-out times?',
    answer:
      'Standard check-in begins at 2:00 PM on your arrival date, and check-out is at 11:00 AM on your departure date. Early arrival or late departure requests can often be accommodated with advance notice.',
  },
];

export const HOUSE_RULES: HouseRule[] = [
  {
    id: 'rule-bg',
    title: 'Guest Verification for Extended Stays',
    description:
      'Extended-stay reservations (30+ days) require standard identity and background screening prior to lease finalization to maintain a safe, welcoming residential community.',
    icon: 'ShieldCheck',
    strictness: 'Required',
  },
  {
    id: 'rule-pets',
    title: 'Pet Policy',
    description:
      'Select residences welcome pets with advance approval and a signed Pet Addendum (you can also add the Approved Pet Welcome & Sanitization package directly to your cart).',
    icon: 'PawPrint',
    strictness: 'Standard Policy',
  },
  {
    id: 'rule-events',
    title: 'No Parties or Large Gatherings',
    description:
      'To preserve a peaceful residential setting for neighbors and fellow guests, large events or parties are not permitted.',
    icon: 'Users',
    strictness: 'Strict',
  },
  {
    id: 'rule-smoking',
    title: '100% Smoke-Free Residences',
    description:
      'All interiors, patios, and balconies are strictly smoke-free. Remediation charges apply if evidence of indoor smoking is found.',
    icon: 'CigaretteOff',
    strictness: 'Strict',
  },
  {
    id: 'rule-vaping',
    title: 'No Indoor Vaping or E-Cigarettes',
    description: 'Vaping and e-cigarette use are not permitted inside any apartment.',
    icon: 'Ban',
    strictness: 'Strict',
  },
  {
    id: 'rule-quiet',
    title: 'Quiet Hours: 10:00 PM – 6:00 AM',
    description:
      'Quiet hours are observed nightly between 10:00 PM and 6:00 AM out of courtesy for neighbors, families, and shift-schedule residents.',
    icon: 'VolumeX',
    strictness: 'Required',
  },
  {
    id: 'rule-times',
    title: 'Check-In 2:00 PM / Check-Out 11:00 AM',
    description:
      'Check-in opens at 2:00 PM via smart-lock code on arrival day, and check-out is by 11:00 AM on departure day.',
    icon: 'Clock',
    strictness: 'Standard Policy',
  },
  {
    id: 'rule-guests',
    title: 'Registered Household & Overnight Visitors',
    description:
      'Occasional overnight visitors are welcome for up to seven nights. Guests staying longer should be registered with Easy Travel Lodging.',
    icon: 'UserPlus',
    strictness: 'Standard Policy',
  },
  {
    id: 'rule-filming',
    title: 'Commercial Photography & Filming',
    description:
      'Commercial filming or production shoots require prior written authorization from Easy Travel Lodging.',
    icon: 'CameraOff',
    strictness: 'Required',
  },
  {
    id: 'rule-safety',
    title: 'Home Care & Security',
    description:
      'Please secure all windows and doors when away from the residence and store food items in the kitchen.',
    icon: 'Lock',
    strictness: 'Required',
  },
];

export const AREA_ATTRACTIONS = {
  restaurants: [
    { name: 'Organic Delights Cafe and Restaurant', desc: 'Check out our amazing variety of ethnic restaurants including our new Organic Delights Cafe.' },
    { name: 'Famous Burgers & Brew', desc: 'Casual American craft burgers, sandwiches, and regional California draughts.' },
    { name: 'Rudy’s Hideaway Lobster House', desc: 'Beloved Rancho Cordova staple famous for whole Maine lobster and premium steaks.' },
    { name: 'Samurai Sushi', desc: 'Fresh Japanese rolls, sashimi, and bento favorites.' },
    { name: 'El Forno Classico', desc: 'Traditional Italian gourmet thin-crust pizza and pasta dishes.' },
    { name: 'Formaggio Taverna and Patio', desc: 'Chic Mediterranean dining with relaxing patio ambiance.' },
    { name: 'Brookfields Restaurant', desc: 'Homestyle cooking, scratch pancakes, and classic diner favorites.' },
    { name: 'Old Spaghetti Factory', desc: 'Family-friendly historic Italian dining in Rancho Cordova.' },
    { name: 'Oz Korean BBQ Restaurant', desc: 'All-you-can-eat interactive table grilling and Korean side dishes.' },
    { name: 'Casa Ramos', desc: 'Vibrant authentic Mexican cuisine with festive margaritas.' },
    { name: 'Mimosa House', desc: 'Popular breakfast and weekend brunch spot with dozens of custom mimosa flavors.' }
  ],
  breweries: [
    { name: 'The Barrel District', desc: 'Chill and sample our Local Craft Beers at the 6 craft breweries, distillery, and hard kombucha taprooms in the Rancho Cordova Barrel District.' }
  ],
  artsAndCulture: [
    { name: 'California Automobile Museum', desc: 'Enjoy the amazing display of cool cars at the California Automobile Museum in Sacramento.' },
    { name: 'The MACC (Mills Station Arts & Culture Center)', desc: 'Admire the visual arts and historic 1911 architecture at The MACC in Rancho Cordova.' },
    { name: 'Crocker Art Museum', desc: 'Visit the world-class Crocker Art Museum in downtown Sacramento, premier museum of California art.' },
    { name: 'Rancho Cordova City Hall Art Gallery', desc: 'Check out the art of our local talent displayed year-round at the Rancho Cordova City Hall.' }
  ],
  history: [
    { name: 'California State Capitol', desc: 'Come see the beautiful California State Capitol in downtown Sacramento — 20 minutes away.' },
    { name: 'Old Sacramento State Historic Park', desc: 'Relive Gold Rush history with wooden sidewalks, riverboats, and California State Railroad Museum.' },
    { name: 'Sutter’s Fort State Historic Park', desc: 'Historic 1839 agricultural outpost in downtown Sacramento.' }
  ],
  entertainment: [
    { name: 'Downtown Folsom Live Music', desc: 'Lots of live music in historic downtown Folsom — a scenic 20-minute drive.' },
    { name: 'SMUD Museum of Science and Curiosity (MOSAC)', desc: 'Enjoy the new and amazing Powerhouse Science Center on the Sacramento riverfront.' },
    { name: 'Fireworks Rancho Cordova (July 3–4)', desc: 'No one does fireworks quite like Rancho Cordova! Two full days of fireworks, parades, floats, carnivals, and corndogs.' },
    { name: 'Moonlight Movies', desc: 'Moonlight Movies every Friday in June in the park.' },
    { name: 'Summer Concert Series', desc: 'Summer Concert Series every Friday in August.' },
    { name: 'California Capitol Airshow', desc: 'Thrilling aerial performances at Mather Airport — usually in September.' }
  ],
  outdoors: [
    { name: 'Sacramento Valley Live Steamers Railroad', desc: 'Enjoy miniature railroad train rides at Hagan Park. A great place for a picnic or stroll along the American River Parkway.' },
    { name: 'Monster Mini Golf', desc: 'Be a kid again and enjoy a fun-filled afternoon at Monster Mini Golf.' },
    { name: 'Sacramento Zoo', desc: 'Visit the Sacramento Zoo in nearby Land Park.' },
    { name: 'Mather Golf Course', desc: 'Test your accuracy at the scenic golf course at Mather — designed by Jack Fleming amidst native valley oaks.' },
    { name: 'Lake Natoma Aquatic Park', desc: 'Paddleboard, kayak, sail, canoe, swim, and hike on Lake Natoma.' },
    { name: 'Granite Arch Climbing Center', desc: 'Climb to new heights with over 20,000 square feet of realistic indoor climbing surfaces!' }
  ],
  dayTrips: [
    { name: 'Lake Tahoe', distance: '2 hours away', desc: 'Crystal blue alpine lake, hiking, and skiing.' },
    { name: 'Yosemite National Park', distance: '4 hours away', desc: 'Glacial valleys, giant sequoias, and waterfalls.' },
    { name: 'San Francisco, Sausalito, Alcatraz', distance: 'Only 2 hours away', desc: 'Golden Gate Bridge, coastal fog, and bay cruises.' },
    { name: 'Napa-Sonoma Wine Country', distance: '2 hours away', desc: 'World-renowned vineyards and tastings.' }
  ]
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'welcome-to-easy-travel-lodging-your-home-away-from-home',
    title: 'Welcome to Easy Travel Lodging: Furnished Comfort for Every Kind of Stay',
    category: 'Guest Experience',
    date: 'November 2025',
    readTime: '4 min read',
    excerpt: 'Whether you are visiting family, remodeling your home, relocating across California’s homes, or arriving for an extended project, discover how a thoughtfully furnished residence changes the way you travel.',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/04/CC-91-2.jpg',
    content: [
      'Great hospitality starts with recognizing that no two guests travel for the exact same reason. Some arrive to welcome a new grandchild or support a loved one at a regional medical center; others are waiting for a new home build to close, navigating a home renovation, working remotely, or managing a multi-month corporate project nationwide.',
      'We understand that time away from your primary residence is far easier when your space feels genuinely livable. With warm residential interiors, indoor fireplaces, fully equipped kitchens, in-unit laundry, and arrival starter kits, each Easy Travel Lodging suite is prepared for real daily life rather than a cramped overnight stopover.',
      'Guests consistently tell us how reassuring it is to have responsive local hosts in Bill and Marlena. From smooth keyless self check-in to quiet evening hours and optional concierge add-ons, every detail is arranged so you can settle in from day one.'
    ]
  },
  {
    id: 'post-2',
    slug: 'embrace-history-and-nature-a-delightful-stay-in-rancho-cordovas-gold-rush-haven',
    title: "Trails, River Views & Local Flavor: Exploring Rancho Cordova and Sacramento",
    category: 'Local Guide',
    date: 'October 2025',
    readTime: '5 min read',
    excerpt: "Set along the American River Parkway in California's historic Gold Country corridor, Rancho Cordova pairs peaceful riverside trails with quick access to Midtown Sacramento and Folsom.",
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/01/keys-hotel-board-web-crop.png',
    content: [
      "Set along California's historic Gold Country corridor, Rancho Cordova offers an inviting blend of outdoor recreation, neighborhood dining, and effortless regional access.",
      "Just minutes from our residences, the 32-mile American River Parkway invites morning bike rides, riverside walks, and birdwatching beneath native valley oaks. Upstream, Lake Natoma offers calm water for paddleboarding, kayaking, and lakeside picnics.",
      "In the evening, explore independent craft breweries, cideries, and coffee roasters in the Barrel District, or hop onto Highway 50 to reach Downtown Sacramento, Folsom's historic Sutter Street, or weekend day trips to Lake Tahoe and Napa Valley."
    ]
  },
  {
    id: 'post-3',
    slug: 'the-waiting-game-embracing-midterm-rentals-during-the-transition-period',
    title: 'Bridging the Gap Between Homes: Stress-Free Housing During Moves & Renovations',
    category: 'Relocation & Home Transitions',
    date: 'September 2025',
    readTime: '4 min read',
    excerpt: 'Buying, building, or renovating a home rarely follows a rigid calendar. Flexible furnished residences give families and homeowners breathing room without 12-month lease lock-ins.',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/01/P91-LR.jpg',
    content: [
      'Buying, selling, or renovating a home is exciting, yet closing timelines and contractor schedules rarely line up to the exact day.',
      'When your previous home sells quickly or kitchen and flooring renovations require moving out for several weeks, traditional 12-month apartment leases are too rigid—and living out of suitcases in a hotel quickly wears thin without a real kitchen or laundry room.',
      'Easy Travel Lodging bridges that gap cleanly. With flexible short stays (5+ nights) and tax-exempt extended stays (30+ nights), utilities and high-speed Wi-Fi included, and optional pet-friendly residences, your household can keep its normal routine until moving day arrives.'
    ]
  },
  {
    id: 'post-4',
    slug: 'a-home-away-from-home-the-vital-role-of-midterm-rentals-for-medically-fragile-travelers',
    title: 'Restful Ground-Floor Suites Near Sacramento Medical Centers',
    category: 'Wellness & Accessibility',
    date: 'August 2025',
    readTime: '5 min read',
    excerpt: 'When traveling for outpatient care or supporting a family member at UC Davis Health, Kaiser Permanente, or Sutter Health, step-free access and a calm, hygienic home environment matter.',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/04/IMG_1684.jpg',
    content: [
      'For patients and family caregivers visiting regional centers such as UC Davis Health, Kaiser Permanente, Mercy General, and Sutter Medical Center, a quiet, sanitized, ground-floor residence makes recovery far more comfortable.',
      'At Easy Travel Lodging, our ground-floor residences (Suites 91, 173, and 335) feature step-free entry, protective hypoallergenic mattress encasements, freshly reglazed bathtubs, and central climate control.',
      'A full private kitchen makes it simple to prepare specific dietary meals at any hour, while community quiet hours from 10:00 PM to 6:00 AM support uninterrupted rest.'
    ]
  },
  {
    id: 'post-5',
    slug: 'what-should-i-consider-before-renting-midterm',
    title: 'How to Choose the Right Furnished Residence for a Short or Extended Stay',
    category: 'Planning Guide',
    date: 'June 2025',
    readTime: '4 min read',
    excerpt: 'Comparing hotels, unfurnished apartments, and turnkey residences? Use this practical checklist to evaluate total cost, workspace quality, kitchen equipment, and location.',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/04/IMG_1672.jpg',
    content: [
      'Look at Transparent Total Cost: Compare nightly hotel taxes, parking fees, and restaurant meals against an all-inclusive furnished suite where electricity, gas, water, trash, reserved parking, and 400+ Mbps Wi-Fi are already built in—and stays of 30+ nights qualify for California occupancy tax exemption.',
      'Check Everyday Livability: Look for in-unit laundry, full-size cookware rather than a mini-fridge, comfortable seating, and dedicated desk space if anyone in your party works or studies remotely.',
      'Bundle Transportation & Arrival Extras: Combining your residence with a delivered fleet vehicle or pre-arrival grocery and housekeeping service in a single checkout saves valuable time on arrival day.'
    ]
  },
  {
    id: 'post-6',
    slug: 'how-do-midterm-rentals-work',
    title: 'How Online Reservations, Flexible Stays & Prepaid Lodging Units Work',
    category: 'Booking Guide',
    date: 'May 2025',
    readTime: '4 min read',
    excerpt: 'From adding a residence, vehicle, or concierge service to your cart to settling by Unit Balance or bank transfer, here is what to expect at every step.',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/01/250-LR.jpg',
    content: [
      'Booking a furnished residence or vehicle with Easy Travel Lodging is straightforward whether you are reserving for yourself, your family, or a team.',
      'Browse available suites, 3D fleet vehicles, and arrival add-ons, add your selections to your shopping cart, and review itemized pricing—including automatic occupancy tax exemption on 30+ night residential stays—before checkout.',
      'Complete checkout instantly using prepaid Client Portal Lodging Units or choose Bank Wire, Direct ACH, or Corporate Zelle with real-time payment verification status tracking and downloadable receipts.'
    ]
  }
];

export const HOST_DESIGN_SECRETS = [
  {
    number: '01',
    title: 'Design for Real Daily Living, Not Just Overnight Stays',
    description: 'Guests staying a week or several months value generous closet storage, supportive seating, ergonomic desk space, reliable Wi-Fi, and real cookware far more than novelty decor.'
  },
  {
    number: '02',
    title: 'Honest, Natural-Light Photography',
    description: 'Clear, accurate photography builds trust before check-in. Bright natural lighting, uncluttered rooms, and truthful floor-plan angles help guests choose the right suite with confidence.'
  },
  {
    number: '03',
    title: 'Enduring Comfort: Hotel-Grade Linens & Easy-Care Finishes',
    description: 'Crisp 400–600 thread count cotton sheets paired with durable, easy-to-sanitize surfaces keep every residence feeling fresh stay after stay.'
  },
  {
    number: '04',
    title: 'Thoughtful First-Night Arrival Essentials',
    description: 'Stocking initial dish soap, laundry pods, paper goods, coffee, and a local welcome basket lets tired travelers unpack and unwind before ever visiting a grocery store.'
  },
  {
    number: '05',
    title: 'Responsive Local Stewardship & Transparent Policies',
    description: 'Guests appreciate accountable local hosts, clear pricing without hidden fees, and prompt maintenance support from arrival through departure.'
  }
];

export const PRIVACY_POLICY_TEXT = {
  effectiveDate: 'November 8, 2022',
  siteUrl: 'https://easytravellodging.com/',
  sections: [
    {
      title: 'Information Collection, Use, and Sharing',
      content: 'Easy Travel Lodging is the sole owner of the information collected on this website. We collect only the contact, billing, stay, and order details you voluntarily provide when placing an order through our shopping cart, submitting a reservation or inquiry form, or registering for the Client Portal. We never sell or rent your personal information.\n\nWe use your information strictly to fulfill reservations, process vehicle rentals and concierge services, verify payments, issue order receipts, and respond to guest support requests. Information is shared outside our organization only when required to complete a requested service (such as identity or residential screening for extended leases).'
    },
    {
      title: 'Your Access to and Control Over Information',
      content: 'You may opt out of non-transactional communications from us at any time. By contacting us via the email address or phone number listed below, you may:\n• Request a summary of the personal records associated with your account or orders.\n• Update or correct your contact, billing, or profile information.\n• Request deletion of personal data not required for active leases or tax accounting.\n• Share any questions regarding how your data is handled.'
    },
    {
      title: 'Security & Payment Verification',
      content: 'We take industry-standard precautions to protect your information online and offline. All order totals are calculated and verified server-side, client portal passwords are encrypted, and access to reservation and billing records is restricted to authorized hosts and treasury personnel performing guest support, fulfillment, or accounting reconciliation.'
    },
    {
      title: 'Contact Us Regarding Privacy',
      content: 'If you have questions about this Privacy Policy or how your information is handled, please contact us directly by phone at 916-800-3295 or by email at easytravelagency@trustagent.space.'
    }
  ]
};
