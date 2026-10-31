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
}

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

export const COMPANY_INFO = {
  name: 'Easy Travel Lodging',
  shortName: 'ETL Corporate Housing',
  tagline: 'A Home Away From Home — Stay With Us In Comfort',
  subtagline: 'Where comfort meets integrity, and every guest is treated with dignity and care.',
  phone: '916-800-3295',
  phoneClean: '9168003295',
  email: 'Contact@EasyTravelLodging.com',
  location: 'Sacramento & Rancho Cordova, CA',
  hours: 'Available 7 Days a Week for Guest Inquiries',
  checkInTime: '2:00 PM',
  checkOutTime: '11:00 AM',
  minimumStay: '5 Days or More (5 to 10 Day Short Stays Available)',
  logoUrl: 'https://easytravellodging.com/wp-content/uploads/2022/02/Easy-Travel-Lodging-Logo_jpeg-color.jpg',
  founders: [
    {
      name: 'Bill Wheelock',
      title: 'Co-Founder & Host',
      bio: "Bill’s career in Information Systems Management had him busy traveling around the United States heading up teams installing enterprise computer systems across diverse industries. A Private Pilot for over 40 years, Radio Voiceover artist, and Navy Veteran who served in Vietnam, Bill holds an undergraduate degree from the University of San Francisco and an MBA from the University of Phoenix.",
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
export const PROPERTIES: PropertyListing[] = [
  {
    id: "unit-91",
    code: "#A",
    unitNumber: "Unit 91",
    slug: "one-bedroom-one-bath-downstairs-91",
    title: "One Bedroom, One Bath, Downstairs (A)",
    category: "Holiday Apartment, Family Apartment",
    shortDesc: "Stunning downstairs 1-bedroom apartment in Rancho Cordova tailored for traveling healthcare workers, engineers, and corporate executives.",
    fullDesc: "Welcome to your new home away from home in #RanchoCordova! This stunning 1 bedroom, 1 bath apartment is perfect for traveling professionals seeking a comfortable and convenient stay.\n\nCheck out all the amazing features this apartment has to offer:\n\u2022 Fully updated kitchen with modern appliances for all your cooking needs\n\u2022 In-unit washer/dryer for the ultimate convenience\n\u2022 Cozy living room with fireplace and 55\u2033 Smart TV for relaxing after a long day\n\u2022 Private patio for fresh air and relaxation\n\u2022 Comfy bedroom with plenty of storage space for your belongings.",
    bedrooms: 1,
    bathrooms: 1,
    floor: "Downstairs",
    location: "Rancho Cordova / Greater Sacramento, CA",
    monthlyRate: 2500,
    startingRate: "Starting From ,500 Per Month",
    pricingNote: "May vary. Includes 00.00 utilities and parking. Minimum stay 30 days.",
    status: "Available",
    sqft: "680 sq ft",
    liveUrl: "https://easytravellodging.com/one-bedroom-one-bath-downstairs-91/",
    images: [
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1671.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1696.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-2.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1705.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1672.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1662.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1684.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_1686.jpg"
],
    features: [
      "Fully updated kitchen with modern appliances for all your cooking needs",
      "In-unit washer/dryer for the ultimate convenience",
      "Cozy living room with fireplace and 55\u2033 Smart TV for relaxing after a long day",
      "Private patio for fresh air and relaxation",
      "Comfy bedroom with plenty of storage space for your belongings",
      "Single-level ground floor access with no exterior stairs",
      "Assigned covered parking space with easy building access"
],
    amenities: [
      "WiFi",
      "TV",
      "Air Conditioning",
      "Bathroom",
      "Disabled Facilities",
      "Fireplace",
      "In-Unit Washer/Dryer",
      "Private Patio"
]
  },
  {
    id: "unit-173",
    code: "#B",
    unitNumber: "Unit 173",
    slug: "one-bedroom-one-bath-downstairs-173",
    title: "One Bedroom, One Bath, Downstairs (B)",
    category: "Holiday Apartment, Family Apartment",
    shortDesc: "Modern ground-floor luxury suite with designer touches, fireplace, private patio, and complete office setup in a quiet neighborhood.",
    fullDesc: "Welcome to this awesome #RanchoCordova pad, available for a midterm rental! This 1 bedroom, 1 bath beauty comes fully loaded with all the bells and whistles, making it the perfect spot for a #vacay or #staycation.\n\nGet cozy by the fireplace, binge-watch your fave shows on the 55\u2033 Smart TV, or whip up some delicious eats in the fully updated kitchen \u2013 the choice is yours! And with an in-unit washer/dryer, you\u2019ll be able to rock your fave outfits all week long.\n\nEnjoy the outdoor patio and soak up some sun or just chill out with your #bff. And when it\u2019s time to call it a night, the comfy bedroom is ready and waiting to snuggle you up in style.\n\nLocated in a quiet neighborhood, you\u2019ll be just steps away from all the best shops, restaurants, and local hotspots. Don\u2019t wait \u2013 apply now to snag this totally #awesome apartment for your next #adventure!",
    bedrooms: 1,
    bathrooms: 1,
    floor: "Downstairs",
    location: "Rancho Cordova / Greater Sacramento, CA",
    monthlyRate: 2500,
    startingRate: "Starting From ,500 Per Month",
    pricingNote: "May vary. Includes 00.00 utilities and parking. Minimum stay 30 days.",
    status: "Available",
    sqft: "710 sq ft",
    liveUrl: "https://easytravellodging.com/one-bedroom-one-bath-downstairs-173/",
    images: [
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4864.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3271.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3274.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3269.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3280.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3279.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3285.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3272.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3289.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3264.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3267.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3265.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3287.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_3266.jpg"
],
    features: [
      "Ground-floor unit with convenient nearby reserved parking",
      "Cozy indoor fireplace with modern mantel & designer lighting",
      "55\u2033 Smart TV in living salon plus bedroom streaming TV",
      "Fully updated kitchen with premium appliances & kitchen starter kit",
      "In-unit washer and dryer for effortless laundry days",
      "Private outdoor patio for morning coffee and California sunshine",
      "Pet-friendly accommodation with prior approval"
],
    amenities: [
      "WiFi",
      "TV",
      "Air Conditioning",
      "Bathroom",
      "Pets Allowed",
      "Fireplace",
      "In-Unit Washer/Dryer",
      "Private Patio"
]
  },
  {
    id: "unit-250",
    code: "#C",
    unitNumber: "Unit 250",
    slug: "two-bedroom-two-bath-upstairs-250",
    title: "Two Bedroom, Two Bath, Upstairs (C)",
    category: "Holiday Apartment, Family Apartment",
    shortDesc: "Spacious 2-bedroom, 2-bathroom upper residence boasting vaulted ceilings, private balcony, dual smart TVs, and dual master comforts.",
    fullDesc: "Welcome to this stunning #RanchoCordova apartment, available for a midterm rental! Boasting 2 bedrooms, 2 bathrooms, and a host of luxurious amenities, this is the perfect home-away-from-home for those seeking a comfortable and convenient stay.\n\nAs you step into the apartment, you\u2019ll immediately be struck by its inviting ambience, with a charming fireplace and modern updates throughout. The fully updated kitchen is a chef\u2019s dream, complete with top-of-the-line appliances and ample counter space to whip up delicious meals. And with the in-unit washer/dryer, you\u2019ll enjoy the ultimate convenience and comfort during your stay.\n\nStep outside onto the private patio to enjoy the fresh air and sunshine or curl up in the cozy bedroom for a peaceful night\u2019s rest. And with a 55\u2033 Smart TV, you can unwind and catch up on your favorite shows after a long day. Located in a quiet neighborhood, this apartment offers easy access to shops, restaurants, and other local hotspots. Don\u2019t miss your chance to experience the ultimate in #midtermrental living \u2013 apply now to make this beautiful apartment your own!",
    bedrooms: 2,
    bathrooms: 2,
    floor: "Upstairs",
    location: "Rancho Cordova / Greater Sacramento, CA",
    monthlyRate: 2800,
    startingRate: "Starting From ,800 Per Month",
    pricingNote: "May vary. Includes 00.00 utilities and parking. Minimum stay 30 days.",
    status: "Available",
    sqft: "960 sq ft",
    liveUrl: "https://easytravellodging.com/two-bedroom-two-bath-upstairs-250/",
    images: [
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2936.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2928.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2932.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4658.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2934.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2938.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2954.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4664.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2953.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4681.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4678.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4667.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2944.jpg"
],
    features: [
      "Two private bedrooms and two full bathrooms for optimal privacy",
      "Vaulted ceilings with abundant natural sunlight & tree views",
      "Charming living room fireplace and 55\u2033 4K Smart TV",
      "Chef-inspired kitchen with dishwasher, microwave, and full dinnerware",
      "In-unit stackable washer/dryer with laundry supplies",
      "Private upstairs balcony patio for peaceful relaxation",
      "Access to community fitness center, pools, and tennis courts"
],
    amenities: [
      "WiFi",
      "TV",
      "Air Conditioning",
      "Bathroom",
      "Fireplace",
      "In-Unit Washer/Dryer",
      "Private Balcony",
      "Chef Kitchen"
]
  },
  {
    id: "unit-333",
    code: "#D",
    unitNumber: "Unit 333",
    slug: "exquisite-2-bedroom-midterm-rental-in-rancho-cordova-333",
    title: "Exquisite 2-Bedroom Midterm Rental in Rancho Cordova (D)",
    category: "Holiday Apartment, Family Apartment",
    shortDesc: "Sophisticated 2-bedroom, 2-bathroom haven designed for supreme executive comfort, remote productivity, and luxury relaxation.",
    fullDesc: "Welcome to this exquisite two-bedroom, two-bathroom apartment in the captivating city of Rancho Cordova! With its unrivaled charm and an array of upscale amenities, this extraordinary abode is tailor-made to be your ideal home-away-from-home for a truly remarkable stay.\n\nFrom the moment you step foot inside, you\u2019ll be enchanted by the welcoming atmosphere that envelops you. The elegant fireplace and contemporary upgrades throughout the apartment create an irresistible blend of sophistication and comfort. The fully updated kitchen is a culinary haven, equipped with state-of-the-art appliances and generous counter space to effortlessly craft delectable meals. Plus, with the added convenience of an in-unit washer/dryer, your stay promises to be nothing short of pure indulgence.\n\nStep outside onto the private patio and bask in the glorious sunshine while reveling in the fresh air. Alternatively, retreat to the cozy bedroom, where tranquility awaits to provide you with a restful night\u2019s sleep. And for your entertainment needs, a magnificent 55\u2033 Smart TV stands ready to whisk you away into a world of captivating shows and movies, allowing you to unwind after a fulfilling day. Each bedroom has its own 43\u201d TV so you are just a click away from your favorite TV shows.\n\nNestled within a serene neighborhood, this exceptional apartment offers seamless access to a plethora of shops, restaurants, and local hotspots, ensuring that you are perfectly positioned to experience the vibrant pulse of Rancho Cordova. Seize this extraordinary opportunity to immerse yourself in the pinnacle of midterm rental living\u2014apply now and make this stunning apartment your very own!",
    bedrooms: 2,
    bathrooms: 2,
    floor: "Upstairs",
    location: "Rancho Cordova / Greater Sacramento, CA",
    monthlyRate: 2800,
    startingRate: "Starting From ,800 Per Month",
    pricingNote: "May vary. Includes 00.00 utilities and parking. Minimum stay 30 days.",
    status: "Available",
    sqft: "980 sq ft",
    liveUrl: "https://easytravellodging.com/exquisite-2-bedroom-midterm-rental-in-rancho-cordova-333/",
    images: [
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_115.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_114.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_117.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_116.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_121.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_118.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_120.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_123.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_119.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_122.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_124.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_125.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_103.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_107.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_126.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_105.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_106.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_113.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_108.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_110.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_112.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_111.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_109.jpg"
],
    features: [
      "3 Smart TVs: 55\u2033 Smart TV in living salon plus 43\u2033 Smart TV in each bedroom",
      "Two deluxe bedrooms with premium hotel-quality queen mattresses and 600-thread count sheets",
      "Two full bathrooms with newly reglazed tubs and plush white towels",
      "State-of-the-art kitchen with granite counters, Keurig, and Instant Pot",
      "In-unit washer/dryer for ultimate comfort and independence",
      "Private sunlit patio/balcony overlooking calm landscaped grounds",
      "400+ Mbps high-speed WiFi network for seamless remote work and streaming"
],
    amenities: [
      "WiFi",
      "TV",
      "Air Conditioning",
      "Bathroom",
      "Fireplace",
      "3 Smart TVs",
      "In-Unit Washer/Dryer",
      "Private Patio"
]
  },
  {
    id: "unit-335",
    code: "#E",
    unitNumber: "Unit 335",
    slug: "luxury-2-bedroom-midterm-rental-in-rancho-cordova-335",
    title: "Luxury 2-Bedroom Midterm Rental in Rancho Cordova (E)",
    category: "Holiday Apartment, Family Apartment",
    shortDesc: "Top-tier 2-bedroom executive condo featuring fireplace, private outdoor space, modern chef kitchen, and full access to club amenities.",
    fullDesc: "Looking for a luxurious and fully equipped midterm rental in Rancho Cordova? Look no further than this stunning 2 bedroom, 2 bath apartment.\n\nFeaturing a cozy fireplace, private patio, fully updated kitchen, in-unit washer/dryer, and a 55\u2033 Smart TV, this apartment has everything you need for a comfortable and convenient stay. With two spacious bedrooms and two modern bathrooms, this apartment is perfect for traveling professionals seeking ample space to work and relax.\n\nLocated in a prime neighborhood near major businesses and local attractions, this apartment offers the perfect balance of comfort and convenience. Plus, with a beautifully furnished interior and top-of-the-line amenities, you\u2019ll feel right at home during your stay.\n\nDon\u2019t settle for a boring hotel room \u2013 make this stunning apartment your own. Apply now and experience the best in luxury living during your next business trip to Rancho Cordova.\n\nIncluded in your stay are a 24-hour fitness center, swimming pools, and heated spas along with volleyball and tennis courts. Amenities include central air, central heat, refrigerator, oven/stove, microwave, dishwasher, updated kitchen counters, and in-unit stackable washer/dryer. The built-in credenza in the dining area provides extra storage. Your living room includes a cozy indoor fireplace. The updated bathroom includes a newly reglazed bathtub. Your private patio offers a secluded outdoor space for your rest and tranquility.",
    bedrooms: 2,
    bathrooms: 2,
    floor: "Downstairs",
    location: "Rancho Cordova / Greater Sacramento, CA",
    monthlyRate: 2800,
    startingRate: "Starting From ,800 Per Month",
    pricingNote: "May vary. Includes 00.00 utilities and parking. Minimum stay 30 days.",
    status: "Available",
    sqft: "990 sq ft",
    liveUrl: "https://easytravellodging.com/luxury-2-bedroom-midterm-rental-in-rancho-cordova-335/",
    images: [
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5339.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5342.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4881.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-2_kitchen_sink.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc_bathroom.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2934.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5257.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5267.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5258.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5262.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5268.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5275.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5277.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5274.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5280.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-335_img_5337.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_4228.jpg",
      "https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_img_2953.jpg"
],
    features: [
      "Spacious two-bedroom, two-bathroom floor plan with ground-level access",
      "Full suite of community amenities: 24-hr gym, swimming pools, spas, tennis & volleyball courts",
      "Cozy indoor wood-burning fireplace and 55\u2033 4K Smart TV in living salon",
      "Chef kitchen with refrigerator, oven/range, microwave, and dishwasher",
      "Built-in credenza in dining area providing generous storage",
      "In-unit stackable washer and dryer with detergent supplies",
      "Private secluded patio for outdoor rest and peaceful evenings"
],
    amenities: [
      "WiFi",
      "TV",
      "Air Conditioning",
      "Bathroom",
      "Fireplace",
      "In-Unit Washer/Dryer",
      "Private Patio",
      "Pool & Spa Access"
]
  },
];

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
    question: 'What is Easy Travel Lodging (ETL)?',
    answer: 'ETL is a corporate housing company that provides fully furnished and equipped rentals for traveling professionals who are in the Sacramento area for 30 days or more.'
  },
  {
    id: 'faq-2',
    category: 'General',
    question: 'What is a Mid-term rental?',
    answer: 'Typically, a mid-term rental is designed for occupancy of 30 days or more.'
  },
  {
    id: 'faq-3',
    category: 'General',
    question: 'What makes ETL different from Airbnb?',
    answer: 'Airbnb caters to those who might be on vacation and need a place to stay for a very short period of time---typically a day or two or a week. ETL caters to the traveling professional who is on a work assignment and needs a place to stay for 30 days or more.'
  },
  {
    id: 'faq-4',
    category: 'General',
    question: 'Who are traveling professionals?',
    answer: 'Some examples of traveling professionals are described as traveling nurses/doctors, visiting professors, project managers, engineers, consultants, IT personnel, and digital nomads.'
  },
  {
    id: 'faq-5',
    category: 'General',
    question: 'How is ETL different from other mid-term rentals?',
    answer: 'We feel we go the extra mile to have each mid-term rental look and feel like home. Our guests marvel at how beautiful and cozy their "new home" is and how special they feel throughout the whole onboarding process including the ETL Welcome Basket, Guest Book, and Starter Kit.'
  },
  {
    id: 'faq-6',
    category: 'Stays & Amenities',
    question: 'What is included in the Easy Travel Lodging Starter Kit?',
    answer: 'Your "Easy Travel Lodging Starter Kit" includes basic supplies so that you do not have to run out to the store to get dish detergent or trash bags while getting set up for your new assignment:\n• 1 roll of Paper Towels & extra Toilet Paper\n• Eco-friendly Toiletries & Shampoo\n• Eco-friendly Laundry Detergent\n• Dish/Dishwasher Detergent & drying towels\n• Ziplock bags, Saran Wrap & aluminum foil\n• Cleaning supplies: broom, dustpan, vacuum, Swiffer with pads, trash bags, multi-purpose cleaners\n• Basic office desk supplies\n• Plenty of quality hangers!'
  },
  {
    id: 'faq-7',
    category: 'Stays & Amenities',
    question: 'What is in the ETL Guest Book?',
    answer: 'You will find maps of the area, calendars of local events, and coupons for nearby breweries/wineries and restaurants. You will even find a coloring book and crayons for young kids.'
  },
  {
    id: 'faq-8',
    category: 'Stays & Amenities',
    question: 'What things are planned for safety and comfort?',
    answer: 'Hotel quality queen-size mattress, vinyl-free bed bug liner for the mattress, mattress protector washed for each new guest, 2 sets of sheets/pillows with pillowcases and protectors (400-600 thread count), 2 sets of white towels for each guest, Hotel quality duvet and duvet insert, 2 Smart TVs (a 43-inch TV in the bedroom and a 55-inch in the living room), electronic key system, convenient parking, all utilities paid, and so much more!'
  },
  {
    id: 'faq-9',
    category: 'Stays & Amenities',
    question: 'What things are included in the kitchen?',
    answer: 'Each property has a stove, oven, microwave, refrigerator, and dishwasher along with an in unit washer and dryer. A complete set of dishes and silverware for 4, along with cups and glasses, mixing bowls, and other cooking and baking supplies. Each kitchen also has a coffee maker and Instant Pot.'
  },
  {
    id: 'faq-10',
    category: 'Booking & Policies',
    question: 'What else makes ETL special?',
    answer: 'At ETL, we care about our guests and strive to build meaningful relationships. That\'s why we take the time to call ahead and bring local treats and goodies as a warm welcome to our guests. When you stay with ETL, you\'ll have the peace of mind of knowing that the owners, Bill Wheelock and Marlena Uhrik, understand the unique needs of traveling professionals and are committed to making your stay as comfortable and enjoyable as possible.'
  },
  {
    id: 'faq-11',
    category: 'Booking & Policies',
    question: 'What are the check-in and check-out times?',
    answer: 'Check in time is at 2:00 PM on the mutually approved move-in day and check out time is at 11:00 AM upon the move-out day. Changes may be accommodated upon request.'
  }
];

export const HOUSE_RULES: HouseRule[] = [
  {
    id: 'rule-bg',
    title: 'Background Verification Required',
    description: 'All applicants are required to pay for and complete a background check. Once the background check for your midterm rental application has yielded satisfactory results, your application will be approved.',
    icon: 'ShieldCheck',
    strictness: 'Required'
  },
  {
    id: 'rule-pets',
    title: 'Pets Policy',
    description: 'Typically, Easy Travel Lodging does not accept pets. If, for some reason, an exception is made based on pre-established criteria, the occupant must fill out a Pet Addendum form before occupancy.',
    icon: 'PawPrint',
    strictness: 'Standard Policy'
  },
  {
    id: 'rule-events',
    title: 'No Large Events',
    description: 'No large events or parties are allowed on the premises.',
    icon: 'Users',
    strictness: 'Strict'
  },
  {
    id: 'rule-smoking',
    title: '100% Smoke-Free Environment',
    description: 'This is a smoke-free environment. Should there be evidence of smoking, the occupant will be charged for damages such as re-carpeting, painting, cleaning, etc.',
    icon: 'CigaretteOff',
    strictness: 'Strict'
  },
  {
    id: 'rule-vaping',
    title: 'Vaping and E-Cigarettes',
    description: 'Vaping and e-cigarette smoking is not allowed inside the property.',
    icon: 'Ban',
    strictness: 'Strict'
  },
  {
    id: 'rule-quiet',
    title: 'Quiet Hours: 10:00 PM – 6:00 AM',
    description: 'Quiet hours are typically designated between 10:00 pm - 6:00 am. Please be respectful of your surroundings and other people’s work schedules. We ask that you be quiet and discreet, especially at night.',
    icon: 'VolumeX',
    strictness: 'Required'
  },
  {
    id: 'rule-times',
    title: 'Check-In 2:00 PM / Check-Out 11:00 AM',
    description: 'Check in time is at 2:00 PM on the mutually approved move-in day and check out time is at 11:00 AM upon the move-out day.',
    icon: 'Clock',
    strictness: 'Standard Policy'
  },
  {
    id: 'rule-guests',
    title: 'Maximum Number of Guests',
    description: 'Occasional overnight guests are allowed for up to seven days. Any extended stay must be approved by Easy Travel Lodging.',
    icon: 'UserPlus',
    strictness: 'Standard Policy'
  },
  {
    id: 'rule-filming',
    title: 'Commercial Photography & Filming',
    description: 'Commercial photography and filming is not allowed on premises.',
    icon: 'CameraOff',
    strictness: 'Required'
  },
  {
    id: 'rule-safety',
    title: 'Safety & Health Standards',
    description: 'Please close and lock all windows and doors when you leave the property. Please do not keep any food in the bedroom.',
    icon: 'Lock',
    strictness: 'Required'
  }
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
    title: 'Welcome to Easy Travel Lodging: Your Home Away from Home!',
    category: 'Corporate Housing',
    date: 'November 2025',
    readTime: '4 min read',
    excerpt: 'Other travelers are also part of who we serve. Perhaps you are a digital nomad, waiting for your new home to be built, or in need of a welcoming haven during a medical journey...',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/04/CC-91-2.jpg',
    content: [
      'Welcome to Easy Travel Lodging! Other travelers are also part of who we serve. Perhaps you are a digital nomad, waiting for your new home to be built, in need of a welcoming haven during a medical journey, a grandparent eager to be closer to your grandchildren, or dealing with an insurance claim due to property damage.',
      'We understand that being away from home can bring its own set of stresses. That’s why we curate spaces that don’t feel like temporary quarters. With warm color palettes, cozy indoor fireplaces, fully stocked kitchens, and thoughtful welcome baskets filled with local goodies, ETL brings the essence of home to every stay.',
      'Our guests frequently mention the peace of mind they feel knowing that Bill and Marlena are local and accessible. From seamless keyless check-in to quiet evening hours, our mission is to ensure you feel grounded and appreciated throughout your time in Sacramento.'
    ]
  },
  {
    id: 'post-2',
    slug: 'embrace-history-and-nature-a-delightful-stay-in-rancho-cordovas-gold-rush-haven',
    title: "Embrace History and Nature: A Delightful Stay in Rancho Cordova's Gold Rush Haven",
    category: 'Local Guide',
    date: 'October 2025',
    readTime: '5 min read',
    excerpt: "Nestled in the embrace of California's historical Gold Rush area, Rancho Cordova offers a unique blend of history, nature, and modern charm. A stay in this vibrant city promises not only a journey through the pages of the past...",
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/01/keys-hotel-board-web-crop.png',
    content: [
      "Nestled in the embrace of California's historical Gold Rush area, Rancho Cordova offers a unique blend of history, nature, and modern charm.",
      "The American River Parkway provides endless opportunities for biking, jogging, and birdwatching along 32 miles of paved trails. Just upstream, Lake Natoma offers serene waters for paddleboarding, kayaking, and open-air picnics.",
      "In the evening, discover the Barrel District, home to six independent craft breweries and local tasting rooms. With our strategic location near Highway 50, you are 20 minutes from the California State Capitol and minutes from the historic town of Folsom."
    ]
  },
  {
    id: 'post-3',
    slug: 'the-waiting-game-embracing-midterm-rentals-during-the-transition-period',
    title: 'The Waiting Game: Embracing Midterm Rentals During the Transition Period',
    category: 'Relocation',
    date: 'September 2025',
    readTime: '4 min read',
    excerpt: 'The exhilarating journey of buying or building a new home often comes with its own unique set of challenges, particularly during the transition period. Whether you have sold your old home and are awaiting closing...',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/01/P91-LR.jpg',
    content: [
      'The exhilarating journey of buying or building a new home often comes with its own unique set of challenges, particularly during the transition period.',
      'Whether you have sold your previous residence faster than expected, or construction delays have pushed back your move-in date, trying to find flexible housing can cause immense stress. Traditional apartments demand 12-month commitments, while hotels lack kitchens, in-unit laundry, and storage.',
      'Easy Travel Lodging midterm rentals eliminate the dilemma. With 30-day minimum stays, all utilities paid, in-unit washers and dryers, and fully equipped kitchens, your transition period turns into a relaxing staycation rather than an ordeal.'
    ]
  },
  {
    id: 'post-4',
    slug: 'a-home-away-from-home-the-vital-role-of-midterm-rentals-for-medically-fragile-travelers',
    title: 'A Home Away from Home: The Vital Role of Midterm Rentals for Medically Fragile Travelers',
    category: 'Healthcare',
    date: 'August 2025',
    readTime: '5 min read',
    excerpt: 'For those facing complex medical conditions or undergoing specialized treatment, traveling can be a challenging and daunting endeavor. Being far from home during such times can heighten stress...',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/04/IMG_1684.jpg',
    content: [
      'For patients and families facing specialized treatments at regional medical hubs like UC Davis Health, Kaiser Permanente, and Mercy General, having a tranquil, hygienic, ground-floor space is essential.',
      'At Easy Travel Lodging, our ground-floor downstairs units (Unit 91, Unit 173, and Unit 335) provide step-free access, vinyl-free bed bug mattress liners, hypoallergenic protections, and reglazed sanitized bathtubs.',
      'Having a private kitchen allows patients to prepare dietary-specific meals, while designated quiet hours (10:00 PM - 6:00 AM) guarantee undisturbed rest crucial for recovery.'
    ]
  },
  {
    id: 'post-5',
    slug: 'what-should-i-consider-before-renting-midterm',
    title: 'What Should I Consider Before Renting Midterm?',
    category: 'Midterm Guide',
    date: 'June 2023',
    readTime: '4 min read',
    excerpt: 'Renting a midterm property can provide a convenient and flexible housing solution for individuals or families in need of temporary accommodation. Here are key aspects to keep in mind...',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/04/IMG_1672.jpg',
    content: [
      'Budget: Determine your budget for rent, utilities, and any additional fees. At ETL, all utilities and high-speed WiFi are 100% included in the monthly rate with zero surprise bills.',
      'Location: Ensure close proximity to freeways, grocery stores, healthcare centers, and your workplace. Rancho Cordova offers rapid access to Sacramento, Folsom, and Elk Grove.',
      'Furnishings & Equipment: Ensure the property includes high-speed internet, dedicated workstations, hotel-quality mattresses, and a fully stocked kitchen with essential cookware.'
    ]
  },
  {
    id: 'post-6',
    slug: 'how-do-midterm-rentals-work',
    title: 'How Do Midterm Rentals Work?',
    category: 'Midterm Guide',
    date: 'June 2023',
    readTime: '4 min read',
    excerpt: 'When it comes to midterm rentals, the process is similar to long-term rentals, but with a shorter, more flexible duration. It starts with a streamlined digital agreement...',
    coverImage: 'https://easytravellodging.com/wp-content/uploads/2023/01/250-LR.jpg',
    content: [
      'Midterm rentals typically span from one to six months. Unlike vacation rentals where tourists stay for a weekend, midterm rentals cater to professionals on 30+ day work assignments or families in transition.',
      'Easy Travel Lodging follows a meticulous onboarding process: you select your dates and unit, complete a quick background check for community safety, sign your digital lease, and receive your keyless door codes.',
      'Everything is ready upon arrival: beds made with 400-600 thread count linens, the ETL Starter Kit unpacked, and the ETL Welcome Basket waiting on your kitchen counter.'
    ]
  }
];

export const HOST_DESIGN_SECRETS = [
  {
    number: '01',
    title: 'Design for the 30-Day+ Traveler, Not the Weekend Tourist',
    description: 'Midterm guests need ample wardrobe closet space, ergonomic work desks, blazing internet, and full kitchen cookware—not superficial decor.'
  },
  {
    number: '02',
    title: 'The Power of First-Impression Photography',
    description: 'Prospective corporate bookers decide in under 4 seconds whether to click your listing. Bright natural lighting, decluttered surfaces, and staged welcoming vignettes make all the difference.'
  },
  {
    number: '03',
    title: 'Durable Luxury: High-Thread Linens & Bulletproof Surfaces',
    description: 'Hotel-quality 400-600 thread count linens combined with commercial stain-resistant fabrics elevate review scores while lowering replacement expenses.'
  },
  {
    number: '04',
    title: 'The "Turnkey Starter Kit" Psychology',
    description: 'Providing initial dishwasher pods, eco-detergent, paper products, and coffee creates an instant sense of relief that translates directly into 5-star reviews.'
  },
  {
    number: '05',
    title: 'Community Ethics & Trust as a Competitive Moat',
    description: 'Guests staying a month or more want accountable local operators. Ethical transparency, rapid responsiveness, and professional reputation unlock high occupancy.'
  }
];

export const PRIVACY_POLICY_TEXT = {
  effectiveDate: 'November 8, 2022',
  siteUrl: 'https://easytravellodging.com/',
  sections: [
    {
      title: 'Information Collection, Use, and Sharing',
      content: 'We are the sole owners of the information collected on this site. We only have access to/collect information that you voluntarily give us via email, booking inquiry form, or other direct contact from you. We will not sell or rent this information to anyone.\n\nWe will use your information to respond to you, regarding the reason you contacted us. We will not share your information with any third party outside of our organization, other than as necessary to fulfill your request (e.g., standard tenant background verification for midterm housing approval).'
    },
    {
      title: 'Your Access to and Control Over Information',
      content: 'You may opt out of any future contacts from us at any time. You can do the following at any time by contacting us via the email address or phone number given on our website:\n• See what data we have about you, if any.\n• Change/correct any data we have about you.\n• Have us delete any data we have about you.\n• Express any concern you have about our use of your data.'
    },
    {
      title: 'Security',
      content: 'We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline. Only employees or hosts (Bill Wheelock and Marlena Uhrik) who need the information to perform a specific job (e.g., customer service, reservation management, or billing) are granted access to personally identifiable information.'
    },
    {
      title: 'Contact Us Regarding Privacy',
      content: 'If you feel that we are not abiding by this privacy policy, you should contact us immediately via telephone at 916-800-3295 or via email at Contact@EasyTravelLodging.com'
    }
  ]
};
