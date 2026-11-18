export type MenuCategory =
  | 'All'
  | 'Rice & Mains'
  | 'Swallow & Soups'
  | 'Suya & Grills'
  | 'Sides & Drinks';

export type ServiceMode = 'Dine-in' | 'Drive-through' | 'Delivery';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  priceNaira: number;
  prepTime: string;
  description: string;
  image: string;
  featured?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
}

export interface ReviewItem {
  id: string;
  author: string;
  context: string;
  serviceMode: ServiceMode;
  rating: number;
  dateLabel: string;
  spendRange: string;
  comment: string;
}

export const RESTAURANT_INFO = {
  brandName: 'Africana',
  handle: 'Tastetables_Africana',
  fullTitle: 'Africana (Tastetables_Africana)',
  category: 'Restaurant',
  rating: 4.8,
  reviewCount: 59,
  priceRange: '₦1–10,000',
  pricePerPersonText: '₦1–10,000 per person',
  priceReportedBy: 'Reported by 7 people',
  serviceOptions: ['Dine-in', 'Drive-through', 'Delivery'] as ServiceMode[],
  address: 'Shammall Mall, Futa South Gate, opp. 2nd Gaint IBK Filling Station, Akure 340110, Ondo',
  shortAddress: 'Shammall Mall, FUTA South Gate, Akure 340110',
  landmark: 'Opposite 2nd Giant IBK Filling Station, Ondo State',
  plusCode: '74VX+2X Akure',
  phoneDisplay: '0703 116 8708',
  phoneHref: 'tel:+2347031168708',
  whatsappNumber: '2347031168708',
  opensLabel: 'Opens 9 am',
  hoursSchedule: [
    { day: 'Monday – Saturday', hours: '9:00 AM – 10:00 PM' },
    { day: 'Sunday', hours: '9:00 AM – 9:30 PM' },
  ],
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Shammall+Mall+Futa+South+Gate+Akure+340110+Ondo',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=74VX%2B2X+Akure',
};

export const HERO_IMAGE = '/src/assets/images/hero_africana_feast_1794962152789.jpg';
export const INTERIOR_IMAGE = '/src/assets/images/interior_africana_dining_1794962236282.jpg';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'smoky-party-jollof',
    name: 'Smoky Party Jollof & Peppered Chicken',
    category: 'Rice & Mains',
    priceNaira: 4800,
    prepTime: '15 min',
    description:
      'Firewood-style long-grain Jollof rice finished with glazed peppered chicken thigh, sweet fried dodo plantain, and crisp house slaw.',
    image: '/src/assets/images/dish_jollof_chicken_1794962154727.jpg',
    featured: true,
    spiceLevel: 'Medium',
  },
  {
    id: 'pounded-yam-egusi',
    name: 'Ondo Pounded Yam & Egusi Special',
    category: 'Swallow & Soups',
    priceNaira: 5800,
    prepTime: '18 min',
    description:
      'Silky hand-pounded yam served with rich toasted melon-seed Egusi simmered in palm oil, ugwu greens, stockfish, and braised beef.',
    image: '/src/assets/images/dish_pounded_yam_egusi_1794962236303.jpg',
    featured: true,
    spiceLevel: 'Mild',
  },
  {
    id: 'charcoal-croaker-bole',
    name: 'Charcoal Croaker Fish & Roasted Bole',
    category: 'Suya & Grills',
    priceNaira: 8900,
    prepTime: '22 min',
    description:
      'Whole marinated croaker grilled over open coals, paired with caramelized roasted ripe plantain, sliced red onions, and ata din-din sauce.',
    image: '/src/assets/images/dish_grilled_croaker_bole_1794962155076.jpg',
    featured: true,
    spiceLevel: 'Spicy',
  },
  {
    id: 'ofada-ayamase',
    name: 'Ofada Rice & Ayamase Designer Stew',
    category: 'Rice & Mains',
    priceNaira: 5500,
    prepTime: '15 min',
    description:
      'Unpolished aromatic local Ofada rice served with green bell-pepper Ayamase, slow-braised assorted meats, ponmo, and boiled egg.',
    image: '/src/assets/images/dish_ofada_ayamase_1794963252483.jpg',
    spiceLevel: 'Spicy',
  },
  {
    id: 'coconut-fried-rice',
    name: 'Coconut Fried Rice & Grilled Turkey',
    category: 'Rice & Mains',
    priceNaira: 6200,
    prepTime: '18 min',
    description:
      'Fragrant basmati rice wok-tossed in fresh coconut milk with sweet corn, prawns, green peas, and crispy herb-rubbed turkey wings.',
    image: '/src/assets/images/dish_coconut_fried_rice_1794963252652.jpg',
    spiceLevel: 'Mild',
  },
  {
    id: 'amala-ewedu-gbegiri',
    name: 'Amala, Ewedu & Gbegiri Abula',
    category: 'Swallow & Soups',
    priceNaira: 5200,
    prepTime: '15 min',
    description:
      'Smooth yam-flour Amala layered with jute-leaf Ewedu, slow-cooked bean Gbegiri, and spicy Bukka stew with tender goat meat.',
    image: '/src/assets/images/dish_amala_abula_1794963252743.jpg',
    spiceLevel: 'Medium',
  },
  {
    id: 'catfish-peppersoup',
    name: 'Point & Kill Catfish Pepper Soup',
    category: 'Swallow & Soups',
    priceNaira: 6500,
    prepTime: '20 min',
    description:
      'Aromatic Akure-style broth infused with uda, ehuru, and scent leaf around fresh river catfish, accompanied by boiled white yam.',
    image: '/src/assets/images/dish_catfish_peppersoup_1794963254635.jpg',
    spiceLevel: 'Spicy',
  },
  {
    id: 'ram-suya-platter',
    name: 'House Yaji Beef & Ram Suya Platter',
    category: 'Suya & Grills',
    priceNaira: 4500,
    prepTime: '14 min',
    description:
      'Char-grilled skewered sirloin and ram dusted with house-ground roasted peanut yaji, served with fresh tomatoes, onions, and lime.',
    image: '/src/assets/images/dish_suya_platter_1794963255346.jpg',
    spiceLevel: 'Spicy',
  },
  {
    id: 'gizdodo-skillet',
    name: 'Peppered Snail & Gizdodo Skillet',
    category: 'Suya & Grills',
    priceNaira: 4900,
    prepTime: '15 min',
    description:
      'Wok-glazed chicken gizzards, giant peppered snail, and golden plantain cubes tossed in sweet habanero-tomato reduction with bell peppers.',
    image: '/src/assets/images/dish_gizdodo_snail_1794963255887.jpg',
    spiceLevel: 'Medium',
  },
  {
    id: 'zobo-pineapple',
    name: 'Chilled Hibiscus Zobo & Pineapple',
    category: 'Sides & Drinks',
    priceNaira: 1200,
    prepTime: '5 min',
    description:
      'Cold-brewed hibiscus petals steeped with ginger root, cloves, and crushed sweet pineapple.',
    image: '/src/assets/images/drink_zobo_pineapple_1794963254840.jpg',
    spiceLevel: 'Mild',
  },
  {
    id: 'palm-wine-calabash',
    name: 'Fresh Chilled Palm Wine',
    category: 'Sides & Drinks',
    priceNaira: 2000,
    prepTime: '5 min',
    description:
      'Crisp, naturally sweet tapped Ondo palm wine served chilled in carved calabash.',
    image: '/src/assets/images/drink_palm_wine_calabash_1794963256651.jpg',
    spiceLevel: 'Mild',
  },
  {
    id: 'puff-puff-platter',
    name: 'Warm Spiced Puff-Puff & Pepper Dip',
    category: 'Sides & Drinks',
    priceNaira: 1500,
    prepTime: '10 min',
    description:
      'Golden pillowy dough bites lightly scented with nutmeg, served alongside smoky pepper sauce.',
    image: '/src/assets/images/side_puff_puff_pepper_1794963257520.jpg',
    spiceLevel: 'Mild',
  },
];

export const RATING_BREAKDOWN = [
  { stars: 5, count: 49 },
  { stars: 4, count: 8 },
  { stars: 3, count: 2 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Oluwaseun Adeyemi',
    context: 'Local Guide · Akure',
    serviceMode: 'Dine-in',
    rating: 5,
    dateLabel: '2 weeks ago',
    spendRange: '₦4,500–₦7,000',
    comment:
      'The pounded yam and Egusi taste truly homemade—smooth swallow, generous beef, and neat dining room inside Shammall Mall right by FUTA South Gate.',
  },
  {
    id: 'rev-2',
    author: 'Chidinma Okafor',
    context: 'Verified Guest · Ondo',
    serviceMode: 'Drive-through',
    rating: 5,
    dateLabel: '1 month ago',
    spendRange: '₦3,000–₦6,000',
    comment:
      'Super convenient drive-through pickup when heading past Giant IBK Filling Station. My smoky Jollof and turkey pack was still piping hot.',
  },
  {
    id: 'rev-3',
    author: 'Tunde Babatunde',
    context: 'FUTA Alumni · Akure',
    serviceMode: 'Delivery',
    rating: 5,
    dateLabel: '1 month ago',
    spendRange: '₦5,000–₦9,000',
    comment:
      'Ordered the whole grilled croaker with bole and chilled zobo for evening dinner. Fast delivery to South Gate and well-balanced yaji spice.',
  },
  {
    id: 'rev-4',
    author: 'Amina Bello',
    context: 'Verified Guest · Akure',
    serviceMode: 'Dine-in',
    rating: 4,
    dateLabel: '2 months ago',
    spendRange: '₦2,500–₦5,000',
    comment:
      'Clean environment, courteous staff, and fair pricing under ₦10,000 per person. Great spot for lunch right after opening at 9 am.',
  },
];

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

/**
 * Computes current open/closed status in Africa/Lagos (WAT, UTC+1)
 * matching daily opening time at 9:00 AM and closing at 10:00 PM (9:30 PM Sun).
 */
export function getAkureKitchenStatus(): {
  isOpen: boolean;
  headline: string;
  detail: string;
} {
  try {
    const now = new Date();
    const watString = now.toLocaleString('en-US', {
      timeZone: 'Africa/Lagos',
      hour12: false,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    // e.g. "Tue, 14:35"
    const [weekdayPart, timePart] = watString.split(', ');
    const [hourStr, minuteStr] = (timePart || '09:00').split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const totalMins = hour * 60 + minute;
    const isSunday = weekdayPart === 'Sun';
    const openMins = 9 * 60; // 9:00 AM
    const closeMins = isSunday ? 21 * 60 + 30 : 22 * 60;

    if (totalMins >= openMins && totalMins < closeMins) {
      return {
        isOpen: true,
        headline: 'Open now',
        detail: isSunday ? 'Closes 9:30 pm WAT' : 'Closes 10 pm WAT',
      };
    }

    return {
      isOpen: false,
      headline: 'Closed',
      detail: 'Opens 9 am',
    };
  } catch {
    return {
      isOpen: false,
      headline: 'Closed',
      detail: 'Opens 9 am',
    };
  }
}
