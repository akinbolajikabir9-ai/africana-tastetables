import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Bookmark,
  Smartphone,
  Share2,
  ShoppingBag,
  Plus,
  Minus,
  Search,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  HERO_IMAGE,
  INITIAL_REVIEWS,
  INTERIOR_IMAGE,
  MENU_ITEMS,
  MenuCategory,
  RATING_BREAKDOWN,
  RESTAURANT_INFO,
  ReviewItem,
  ServiceMode,
  formatNaira,
  getAkureKitchenStatus,
} from './data/restaurantData';
import { Navbar } from './components/Navbar';
import { RevealBlock, ResilientImage } from './components/MotionPrimitives';
import { CartEntry, OrderDrawer } from './components/OrderDrawer';
import { ShareModal } from './components/ShareModal';

const CATEGORIES: MenuCategory[] = [
  'All',
  'Rice & Mains',
  'Swallow & Soups',
  'Suya & Grills',
  'Sides & Drinks',
];

const HOSPITALITY_PILLARS = [
  {
    number: '01.',
    title: 'Dine-In at Shammall Mall',
    description:
      'Settle into our sunlit dining room right off FUTA South Gate. Freshly pounded yam, clay-pot soups, and sizzling charcoal platters served straight to your table.',
  },
  {
    number: '02.',
    title: 'Express Drive-Through',
    description:
      'Passing along the Akure corridor opposite 2nd Giant IBK Filling Station? Pre-order ahead and pick up sealed, piping-hot packs without leaving your car.',
  },
  {
    number: '03.',
    title: 'Akure Doorstep Delivery',
    description:
      'Fast dispatch across FUTA South Gate, North Gate, Roadblock, and central Akure neighbourhoods so home or office meals arrive hot.',
  },
];

export default function App() {
  const prefersReduced = useReducedMotion();
  const reservationRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Menu state
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [serviceMode, setServiceMode] = useState<ServiceMode>('Dine-in');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Saved & Share state
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    try {
      return localStorage.getItem('africana_saved_spot') === 'true';
    } catch {
      return false;
    }
  });
  const [shareModal, setShareModal] = useState<{ open: boolean; mode: 'send' | 'share' }>({
    open: false,
    mode: 'share',
  });
  const [copiedPlusCode, setCopiedPlusCode] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewMode, setReviewMode] = useState<ServiceMode>('Dine-in');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSpend, setReviewSpend] = useState('₦3,000–₦6,000');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Reservation form state
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resGuests, setResGuests] = useState('2');
  const [resDate, setResDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [resTime, setResTime] = useState('13:00');
  const [resMode, setResMode] = useState<'Dine-in' | 'Drive-through'>('Dine-in');
  const [resNotes, setResNotes] = useState('');
  const [resError, setResError] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<{
    ref: string;
    name: string;
    guests: string;
    date: string;
    time: string;
    mode: string;
  } | null>(null);

  const kitchenStatus = useMemo(() => getAkureKitchenStatus(), []);

  useEffect(() => {
    try {
      localStorage.setItem('africana_saved_spot', String(isSaved));
    } catch {
      // Ignore storage failures in restricted browsers
    }
  }, [isSaved]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCat = activeCategory === 'All' || item.category === activeCategory;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const cartCount = cart.reduce((acc, entry) => acc + entry.quantity, 0);
  const cartTotal = cart.reduce((acc, entry) => acc + entry.item.priceNaira * entry.quantity, 0);

  const getItemQty = (id: string) => cart.find((c) => c.item.id === id)?.quantity ?? 0;

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.id === id);
      if (!existing && delta > 0) {
        const target = MENU_ITEMS.find((m) => m.id === id);
        return target ? [...prev, { item: target, quantity: delta }] : prev;
      }
      if (!existing) return prev;
      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) {
        return prev.filter((entry) => entry.item.id !== id);
      }
      return prev.map((entry) =>
        entry.item.id === id ? { ...entry, quantity: nextQty } : entry
      );
    });
  };

  const scrollToReservation = () => {
    reservationRef.current?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true });
    }, 450);
  };

  const handleCopyPlusCode = async () => {
    try {
      await navigator.clipboard.writeText(
        `${RESTAURANT_INFO.address} (${RESTAURANT_INFO.plusCode})`
      );
      setCopiedPlusCode(true);
      setTimeout(() => setCopiedPlusCode(false), 2000);
    } catch {
      setCopiedPlusCode(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewAuthor.trim() || reviewComment.trim().length < 10) {
      setReviewError('Please enter your name and at least a short sentence about your meal.');
      return;
    }
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      context: 'Guest Review · Akure',
      serviceMode: reviewMode,
      rating: reviewRating,
      dateLabel: 'Just now',
      spendRange: reviewSpend,
      comment: reviewComment.trim(),
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewAuthor('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResError('');
    if (!resName.trim()) {
      setResError('Please enter your full name.');
      return;
    }
    const cleanPhone = resPhone.replace(/\s+/g, '');
    if (cleanPhone.length < 10) {
      setResError('Please enter a valid contact phone number.');
      return;
    }
    if (!resDate) {
      setResError('Please select a reservation date.');
      return;
    }
    const [hr] = resTime.split(':').map(Number);
    if (hr < 9 || hr >= 22) {
      setResError('Our kitchen serves from 9:00 AM to 10:00 PM. Please select an open hour.');
      return;
    }

    setConfirmedReservation({
      ref: `TT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: resName.trim(),
      guests: resGuests,
      date: resDate,
      time: resTime,
      mode: resMode,
    });
  };

  const totalReviewCount = RESTAURANT_INFO.reviewCount + (reviews.length - INITIAL_REVIEWS.length);

  return (
    <div id="top" className="min-h-screen bg-[#F7F6F2] text-[#171513] flex flex-col">
      <Navbar onReserveClick={scrollToReservation} />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Editorial Column */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-between py-2"
            >
              <div className="space-y-6">
                <p className="text-xs sm:text-sm font-medium text-[#524D46] tracking-wide">
                  Tastetables_Africana · Shammall Mall, FUTA South Gate
                </p>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] tracking-tight text-[#171513] text-balance">
                  Nigerian Firewood Kitchen &amp; Grill in Akure.
                </h1>

                <p className="text-base sm:text-lg text-[#524D46] leading-relaxed max-w-xl">
                  From smoky party Jollof and hand-pounded yam with Egusi to open-coal croaker and
                  suya platters—crafted fresh from 9 am daily for dine-in, express drive-through,
                  and local delivery across Akure.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <a
                    href="#menu"
                    className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-[#F7F6F2] bg-[#1A4D33] hover:bg-[#143D28] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A4D33]"
                  >
                    Explore Menu
                  </a>
                  <a
                    href={RESTAURANT_INFO.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-[#171513] border border-[#171513]/20 hover:bg-[#EAE7DF] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    <Navigation className="w-4 h-4 text-[#1A4D33]" aria-hidden="true" />
                    Directions
                  </a>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-[#171513]/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#524D46]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#171513]">
                  <Star className="w-4 h-4 fill-[#B87A1F] text-[#B87A1F]" aria-hidden="true" />
                  <span className="tabular-nums">{RESTAURANT_INFO.rating}</span>
                  <span className="text-[#615B53] font-normal tabular-nums">
                    ({totalReviewCount} reviews)
                  </span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{RESTAURANT_INFO.priceRange}</span>
                <span aria-hidden="true">·</span>
                <span>Dine-in · Drive-through · Delivery</span>
              </div>
            </motion.div>

            {/* Right Visual Column */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <ResilientImage
                src={HERO_IMAGE}
                alt="Africana dining spread featuring smoky Jollof rice, grilled suya skewers, fried plantain, and chilled hibiscus zobo"
                containerClassName="w-full h-72 sm:h-96 lg:h-full lg:min-h-[460px] rounded-xl overflow-hidden border border-[#171513]/10 bg-[#EAE7DF]"
                className="w-full h-full object-cover"
                fallbackTitle="Africana Kitchen Spread"
              />
            </motion.div>
          </div>

          {/* Full-width 4-column Google Business Key Facts Strip below the split */}
          <div className="mt-10 pt-8 border-t border-[#171513]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#615B53]">Guest Rating</p>
              <p className="font-display text-xl font-semibold text-[#171513] tabular-nums">
                4.8 / 5.0
              </p>
              <p className="text-xs text-[#524D46] tabular-nums">
                {totalReviewCount} verified guest reviews
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[#615B53]">Typical Spend</p>
              <p className="font-display text-xl font-semibold text-[#171513] tabular-nums">
                {RESTAURANT_INFO.priceRange}
              </p>
              <p className="text-xs text-[#524D46]">
                Per person · {RESTAURANT_INFO.priceReportedBy}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[#615B53]">Kitchen Hours (WAT)</p>
              <p className="font-display text-xl font-semibold text-[#171513]">
                {kitchenStatus.headline} · {kitchenStatus.detail}
              </p>
              <p className="text-xs text-[#524D46]">Dine-in · Drive-through · Delivery</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[#615B53]">Akure Location</p>
              <p className="font-display text-xl font-semibold text-[#171513]">
                Shammall Mall
              </p>
              <p className="text-xs text-[#524D46]">
                FUTA South Gate · Plus Code {RESTAURANT_INFO.plusCode}
              </p>
            </div>
          </div>
        </section>

        {/* 2. MENU SECTION */}
        <section id="menu" className="bg-[#EFECE4]/70 border-y border-[#171513]/10 py-16 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
            <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <p className="text-xs font-medium text-[#1A4D33]">Kitchen Menu</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#171513] text-balance">
                  Cooked to Order · ₦1,200 to ₦8,900
                </h2>
                <p className="text-sm sm:text-base text-[#524D46]">
                  Build your tray for dine-in seating, drive-through pickup at Shammall Mall, or
                  dispatch across Akure.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search
                    className="w-4 h-4 text-[#615B53] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Jollof, Yam, Suya..."
                    aria-label="Search menu dishes"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-md bg-[#F7F6F2] border border-[#171513]/15 text-[#171513] placeholder:text-[#8E867B] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-md bg-[#171513] hover:bg-[#2A2622] text-[#F7F6F2] text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span>Order Tray</span>
                  <span className="tabular-nums text-[#E4DFD3]">
                    ({cartCount} · {formatNaira(cartTotal)})
                  </span>
                </button>
              </div>
            </RevealBlock>

            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Menu categories"
              className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#171513]/10"
            >
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'text-[#171513]'
                        : 'text-[#615B53] hover:text-[#171513]'
                    }`}
                  >
                    {category}
                    {isActive && (
                      <motion.span
                        layoutId="active-menu-tab"
                        transition={{ duration: prefersReduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-2 right-2 -bottom-[9px] h-[2px] bg-[#1A4D33]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-12 text-center space-y-3 border border-[#171513]/10 rounded-xl bg-[#F7F6F2] p-8">
                <p className="font-display text-lg font-medium text-[#171513]">
                  No dishes matched &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-[#1A4D33] text-[#F7F6F2] hover:bg-[#143D28] transition-colors cursor-pointer"
                >
                  Show All Dishes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredItems.map((item) => {
                  const qty = getItemQty(item.id);
                  return (
                    <article
                      key={item.id}
                      className="flex flex-col bg-[#F7F6F2] rounded-xl border border-[#171513]/10 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <ResilientImage
                        src={item.image}
                        alt={item.name}
                        containerClassName="aspect-[4/3] w-full bg-[#EAE7DF] overflow-hidden"
                        className="w-full h-full object-cover"
                        fallbackTitle={item.name}
                      />

                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                        <div className="space-y-2">
                          <p className="text-xs text-[#615B53]">
                            {item.category} · {item.prepTime}
                            {item.spiceLevel ? ` · ${item.spiceLevel}` : ''}
                          </p>
                          <h3 className="font-display text-lg font-semibold text-[#171513] leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-sm text-[#524D46] leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#171513]/10 flex items-center justify-between gap-4">
                          <span className="text-base font-semibold text-[#171513] tabular-nums">
                            {formatNaira(item.priceNaira)}
                          </span>

                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, 1)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1A4D33] hover:bg-[#143D28] text-[#F7F6F2] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              Add to Tray
                            </button>
                          ) : (
                            <div className="inline-flex items-center border border-[#171513]/15 rounded-md bg-white">
                              <button
                                type="button"
                                aria-label={`Remove one ${item.name}`}
                                onClick={() => updateCartQty(item.id, -1)}
                                className="w-9 h-9 inline-flex items-center justify-center text-[#524D46] hover:text-[#171513] cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-xs font-semibold tabular-nums">
                                {qty}
                              </span>
                              <button
                                type="button"
                                aria-label={`Add one ${item.name}`}
                                onClick={() => updateCartQty(item.id, 1)}
                                className="w-9 h-9 inline-flex items-center justify-center text-[#524D46] hover:text-[#171513] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 3. OVERVIEW, ABOUT & HOSPITALITY ACTION STRIP */}
        <section id="overview" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <RevealBlock className="lg:col-span-6">
              <ResilientImage
                src={INTERIOR_IMAGE}
                alt="Inside Africana (Tastetables_Africana) dining room at Shammall Mall, Akure"
                containerClassName="w-full h-72 sm:h-96 lg:h-full lg:min-h-[420px] rounded-xl overflow-hidden border border-[#171513]/10 bg-[#EAE7DF]"
                className="w-full h-full object-cover"
                fallbackTitle="Africana Dining Room · Shammall Mall"
              />
            </RevealBlock>

            <RevealBlock delay={0.08} className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-medium text-[#1A4D33]">About Tastetables_Africana</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#171513] text-balance">
                  Warm Ondo Hospitality at FUTA South Gate.
                </h2>
                <p className="text-base text-[#524D46] leading-relaxed">
                  Tucked inside Shammall Mall opposite the 2nd Giant IBK Filling Station, Africana
                  serves students, families, and Akure professionals with unhurried Nigerian dishes
                  at approachable everyday pricing.
                </p>
              </div>

              <div className="space-y-6 divide-y divide-[#171513]/10">
                {HOSPITALITY_PILLARS.map((pillar) => (
                  <div key={pillar.number} className="pt-5 first:pt-0 space-y-1.5">
                    <h3 className="font-display text-lg font-semibold text-[#171513]">
                      {pillar.number} {pillar.title}
                    </h3>
                    <p className="text-sm text-[#524D46] leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>

              {/* Action Bar matching Google Business capabilities */}
              <div className="pt-4 border-t border-[#171513]/10 flex flex-wrap items-center gap-2.5">
                <a
                  href={RESTAURANT_INFO.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#171513]/15 hover:bg-[#EAE7DF] text-xs font-medium text-[#171513] transition-colors whitespace-nowrap"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#1A4D33]" aria-hidden="true" />
                  Directions
                </a>

                <button
                  type="button"
                  onClick={() => setIsSaved((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isSaved
                      ? 'bg-[#1A4D33] border-[#1A4D33] text-[#F7F6F2]'
                      : 'border-[#171513]/15 hover:bg-[#EAE7DF] text-[#171513]'
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : 'text-[#1A4D33]'}`}
                    aria-hidden="true"
                  />
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                <button
                  type="button"
                  onClick={() => setShareModal({ open: true, mode: 'send' })}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#171513]/15 hover:bg-[#EAE7DF] text-xs font-medium text-[#171513] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#1A4D33]" aria-hidden="true" />
                  Send to phone
                </button>

                <button
                  type="button"
                  onClick={() => setShareModal({ open: true, mode: 'share' })}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#171513]/15 hover:bg-[#EAE7DF] text-xs font-medium text-[#171513] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#1A4D33]" aria-hidden="true" />
                  Share
                </button>

                <a
                  href={RESTAURANT_INFO.phoneHref}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#171513]/15 hover:bg-[#EAE7DF] text-xs font-medium text-[#171513] transition-colors whitespace-nowrap tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1A4D33]" aria-hidden="true" />
                  {RESTAURANT_INFO.phoneDisplay}
                </a>
              </div>
            </RevealBlock>
          </div>
        </section>

        {/* 4. GUEST REVIEWS & RATING BREAKDOWN */}
        <section id="reviews" className="bg-[#171513] text-[#F7F6F2] py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
            <RevealBlock className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Rating summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#D6B172] tracking-wide">
                    Verified Guest Consensus
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                    Rated 4.8 Across {totalReviewCount} Reviews
                  </h2>
                  <p className="text-sm text-[#CEC8BE] leading-relaxed">
                    Average meal cost of {RESTAURANT_INFO.priceRange} per person (
                    {RESTAURANT_INFO.priceReportedBy.toLowerCase()}) across dine-in, drive-through,
                    and delivery orders.
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2.5 pt-2">
                  {RATING_BREAKDOWN.map((row) => {
                    const pct = Math.round((row.count / RESTAURANT_INFO.reviewCount) * 100);
                    return (
                      <div key={row.stars} className="flex items-center gap-3 text-xs">
                        <span className="w-8 tabular-nums text-[#E4DFD3] font-medium">
                          {row.stars} ★
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-[#2C2824] overflow-hidden">
                          <div
                            className="h-full bg-[#D6B172] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right tabular-nums text-[#AFA89D]">
                          {row.count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm((prev) => !prev)}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-md border border-[#F7F6F2]/25 hover:bg-[#F7F6F2] hover:text-[#171513] text-sm font-medium transition-colors cursor-pointer"
                  >
                    {showReviewForm ? 'Close Review Form' : 'Write a Guest Review'}
                  </button>
                </div>
              </div>

              {/* Review Cards + Optional Form */}
              <div className="lg:col-span-7 space-y-6">
                {showReviewForm && (
                  <form
                    onSubmit={handleReviewSubmit}
                    className="p-6 rounded-xl bg-[#221F1C] border border-[#F7F6F2]/12 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold">Share Your Visit</h3>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        aria-label="Close review form"
                        className="text-[#AFA89D] hover:text-[#F7F6F2] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="rev-name" className="block text-xs text-[#CEC8BE] mb-1">
                          Your Name
                        </label>
                        <input
                          id="rev-name"
                          type="text"
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="e.g. Folake Ojo"
                          className="w-full px-3 py-2 text-sm rounded-md bg-[#171513] border border-[#F7F6F2]/15 text-[#F7F6F2] focus:outline-none focus:ring-2 focus:ring-[#D6B172]"
                        />
                      </div>
                      <div>
                        <label htmlFor="rev-mode" className="block text-xs text-[#CEC8BE] mb-1">
                          Service Type
                        </label>
                        <select
                          id="rev-mode"
                          value={reviewMode}
                          onChange={(e) => setReviewMode(e.target.value as ServiceMode)}
                          className="w-full px-3 py-2 text-sm rounded-md bg-[#171513] border border-[#F7F6F2]/15 text-[#F7F6F2] focus:outline-none focus:ring-2 focus:ring-[#D6B172]"
                        >
                          <option value="Dine-in">Dine-in</option>
                          <option value="Drive-through">Drive-through</option>
                          <option value="Delivery">Delivery</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="rev-rating" className="block text-xs text-[#CEC8BE] mb-1">
                          Star Rating
                        </label>
                        <select
                          id="rev-rating"
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm rounded-md bg-[#171513] border border-[#F7F6F2]/15 text-[#F7F6F2] focus:outline-none focus:ring-2 focus:ring-[#D6B172]"
                        >
                          <option value={5}>5 Stars — Excellent</option>
                          <option value={4}>4 Stars — Very Good</option>
                          <option value={3}>3 Stars — Good</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="rev-spend" className="block text-xs text-[#CEC8BE] mb-1">
                          Spend per Person
                        </label>
                        <select
                          id="rev-spend"
                          value={reviewSpend}
                          onChange={(e) => setReviewSpend(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-md bg-[#171513] border border-[#F7F6F2]/15 text-[#F7F6F2] focus:outline-none focus:ring-2 focus:ring-[#D6B172]"
                        >
                          <option value="₦1,000–₦3,000">₦1,000–₦3,000</option>
                          <option value="₦3,000–₦6,000">₦3,000–₦6,000</option>
                          <option value="₦6,000–₦10,000">₦6,000–₦10,000</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rev-comment" className="block text-xs text-[#CEC8BE] mb-1">
                        Your Experience
                      </label>
                      <textarea
                        id="rev-comment"
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What did you order and how was the service?"
                        className="w-full px-3 py-2 text-sm rounded-md bg-[#171513] border border-[#F7F6F2]/15 text-[#F7F6F2] focus:outline-none focus:ring-2 focus:ring-[#D6B172]"
                      />
                    </div>

                    {reviewError && <p className="text-xs text-[#F29F9F]">{reviewError}</p>}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-md bg-[#D6B172] hover:bg-[#C69D57] text-[#171513] text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Publish Review
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {reviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="p-6 rounded-xl bg-[#221F1C] border border-[#F7F6F2]/10 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs text-[#AFA89D]">
                          <span>
                            {rev.serviceMode} · {rev.spendRange}
                          </span>
                          <span className="tabular-nums text-[#D6B172] font-medium">
                            {rev.rating}.0 ★
                          </span>
                        </div>
                        <p className="text-sm text-[#EFECE4] leading-relaxed">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#F7F6F2]/10 text-xs">
                        <p className="font-semibold text-[#F7F6F2]">{rev.author}</p>
                        <p className="text-[#AFA89D] mt-0.5">
                          {rev.context} · {rev.dateLabel}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </RevealBlock>
          </div>
        </section>

        {/* 5. VISIT, DIRECTIONS & TABLE RESERVATION */}
        <section
          id="visit"
          ref={reservationRef}
          className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 lg:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Location & Hours Details */}
            <RevealBlock className="lg:col-span-6 space-y-6">
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-[#1A4D33]">Visit Us in Akure</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#171513] text-balance">
                  Find Us at Shammall Mall, FUTA South Gate.
                </h2>
              </div>

              <div className="rounded-xl border border-[#171513]/12 bg-[#EFECE4]/60 p-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#1A4D33] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#171513]">Street Address</p>
                    <p className="text-sm text-[#524D46] leading-relaxed">
                      {RESTAURANT_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#171513]/10">
                  <Clock className="w-5 h-5 text-[#1A4D33] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#171513]">
                        {kitchenStatus.headline} · {kitchenStatus.detail}
                      </p>
                      <span className="text-xs text-[#615B53]">West Africa Time</span>
                    </div>
                    <div className="space-y-1 text-xs text-[#524D46] tabular-nums">
                      {RESTAURANT_INFO.hoursSchedule.map((row) => (
                        <div key={row.day} className="flex justify-between gap-4">
                          <span>{row.day}</span>
                          <span className="font-medium text-[#171513]">{row.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-[#171513]/10">
                  <Phone className="w-5 h-5 text-[#1A4D33] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#171513]">Direct Kitchen Line</p>
                      <a
                        href={RESTAURANT_INFO.phoneHref}
                        className="text-sm font-medium text-[#1A4D33] hover:underline tabular-nums"
                      >
                        {RESTAURANT_INFO.phoneDisplay}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPlusCode}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#F7F6F2] border border-[#171513]/15 hover:bg-[#EAE7DF] text-xs font-medium text-[#171513] transition-colors cursor-pointer"
                    >
                      {copiedPlusCode ? (
                        <Check className="w-3.5 h-3.5 text-[#1A4D33]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedPlusCode ? 'Copied Plus Code' : RESTAURANT_INFO.plusCode}
                    </button>
                  </div>
                </div>
              </div>

              {/* Clean Architectural Landmark Map Card */}
              <div className="rounded-xl border border-[#171513]/12 bg-[#EAE7DF] p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#615B53]">FUTA South Gate Corridor</p>
                    <p className="font-display text-lg font-semibold text-[#171513]">
                      Shammall Mall · {RESTAURANT_INFO.plusCode}
                    </p>
                  </div>
                  <a
                    href={RESTAURANT_INFO.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1A4D33] hover:bg-[#143D28] text-[#F7F6F2] text-xs font-medium transition-colors whitespace-nowrap shrink-0"
                  >
                    Open Google Maps
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>

                {/* Minimal schematic landmark guide */}
                <svg
                  viewBox="0 0 600 180"
                  className="w-full h-36 rounded-lg bg-[#F7F6F2] border border-[#171513]/10"
                  role="img"
                  aria-label="Schematic landmark map showing Shammall Mall opposite 2nd Giant IBK Filling Station near FUTA South Gate, Akure"
                >
                  <line x1="0" y1="95" x2="600" y2="95" stroke="#D5CFC3" strokeWidth="18" />
                  <line x1="0" y1="95" x2="600" y2="95" stroke="#F7F6F2" strokeWidth="1.5" strokeDasharray="8 8" />
                  <line x1="150" y1="0" x2="150" y2="180" stroke="#E2DDD2" strokeWidth="10" />

                  {/* FUTA South Gate */}
                  <rect x="30" y="24" width="102" height="36" rx="6" fill="#EFECE4" stroke="#B7B0A4" />
                  <text x="81" y="46" textAnchor="middle" fill="#3B3732" fontSize="11" fontWeight="600">
                    FUTA South Gate
                  </text>

                  {/* 2nd Giant IBK Filling Station */}
                  <rect x="260" y="124" width="195" height="34" rx="6" fill="#EFECE4" stroke="#B7B0A4" />
                  <text x="357" y="145" textAnchor="middle" fill="#524D46" fontSize="11">
                    2nd Giant IBK Filling Station
                  </text>

                  {/* Africana at Shammall Mall */}
                  <rect x="268" y="20" width="180" height="44" rx="8" fill="#1A4D33" />
                  <text x="358" y="40" textAnchor="middle" fill="#F7F6F2" fontSize="12" fontWeight="600">
                    Africana · Shammall Mall
                  </text>
                  <text x="358" y="55" textAnchor="middle" fill="#D6B172" fontSize="10">
                    74VX+2X Akure
                  </text>
                </svg>
              </div>
            </RevealBlock>

            {/* Table Reservation & Drive-Through Booking Form */}
            <RevealBlock delay={0.08} className="lg:col-span-6">
              <div className="rounded-xl border border-[#171513]/12 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-[#1A4D33]">Reservations &amp; Pre-Order</p>
                  <h3 className="font-display text-2xl font-semibold text-[#171513]">
                    Book a Table or Drive-Through Slot
                  </h3>
                  <p className="text-sm text-[#524D46]">
                    Reserve seating in our dining room or schedule an express pickup time from 9:00
                    AM onward.
                  </p>
                </div>

                {confirmedReservation ? (
                  <div className="p-6 rounded-lg bg-[#EFECE4]/70 border border-[#171513]/10 space-y-4">
                    <div className="flex items-center gap-2.5 text-[#1A4D33]">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-semibold">
                        Booking Confirmed · {confirmedReservation.ref}
                      </span>
                    </div>
                    <p className="text-sm text-[#3B3732] leading-relaxed">
                      We look forward to hosting{' '}
                      <span className="font-semibold text-[#171513]">
                        {confirmedReservation.name}
                      </span>{' '}
                      for {confirmedReservation.mode} ({confirmedReservation.guests} guests) on{' '}
                      <span className="font-medium tabular-nums">
                        {confirmedReservation.date} at {confirmedReservation.time}
                      </span>
                      .
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setConfirmedReservation(null)}
                        className="px-4 py-2 rounded-md bg-[#1A4D33] text-[#F7F6F2] text-xs font-medium hover:bg-[#143D28] transition-colors cursor-pointer"
                      >
                        Make Another Booking
                      </button>
                      <a
                        href={RESTAURANT_INFO.phoneHref}
                        className="px-4 py-2 rounded-md border border-[#171513]/15 text-xs font-medium text-[#171513] hover:bg-[#EAE7DF] transition-colors"
                      >
                        Call {RESTAURANT_INFO.phoneDisplay}
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReservationSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFECE4] rounded-lg">
                      {(['Dine-in', 'Drive-through'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setResMode(mode)}
                          className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                            resMode === mode
                              ? 'bg-white text-[#171513] shadow-sm'
                              : 'text-[#524D46] hover:text-[#171513]'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="res-name"
                          className="block text-xs font-medium text-[#524D46] mb-1.5"
                        >
                          Full Name
                        </label>
                        <input
                          ref={nameInputRef}
                          id="res-name"
                          type="text"
                          value={resName}
                          onChange={(e) => setResName(e.target.value)}
                          placeholder="e.g. Toluwani Akinola"
                          className="w-full px-3.5 py-2.5 text-sm rounded-md bg-[#F7F6F2] border border-[#171513]/15 text-[#171513] placeholder:text-[#8E867B] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="res-phone"
                          className="block text-xs font-medium text-[#524D46] mb-1.5"
                        >
                          Phone Number
                        </label>
                        <input
                          id="res-phone"
                          type="tel"
                          value={resPhone}
                          onChange={(e) => setResPhone(e.target.value)}
                          placeholder="0703 116 8708"
                          className="w-full px-3.5 py-2.5 text-sm rounded-md bg-[#F7F6F2] border border-[#171513]/15 text-[#171513] placeholder:text-[#8E867B] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="res-guests"
                          className="block text-xs font-medium text-[#524D46] mb-1.5"
                        >
                          Party Size
                        </label>
                        <select
                          id="res-guests"
                          value={resGuests}
                          onChange={(e) => setResGuests(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-md bg-[#F7F6F2] border border-[#171513]/15 text-[#171513] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="4">4 Guests</option>
                          <option value="6">6 Guests</option>
                          <option value="8+">8+ Group</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="res-date"
                          className="block text-xs font-medium text-[#524D46] mb-1.5"
                        >
                          Date
                        </label>
                        <input
                          id="res-date"
                          type="date"
                          value={resDate}
                          onChange={(e) => setResDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-md bg-[#F7F6F2] border border-[#171513]/15 text-[#171513] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="res-time"
                          className="block text-xs font-medium text-[#524D46] mb-1.5"
                        >
                          Time (Opens 9 AM)
                        </label>
                        <input
                          id="res-time"
                          type="time"
                          min="09:00"
                          max="21:30"
                          value={resTime}
                          onChange={(e) => setResTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-md bg-[#F7F6F2] border border-[#171513]/15 text-[#171513] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="res-notes"
                        className="block text-xs font-medium text-[#524D46] mb-1.5"
                      >
                        Special Requests (optional)
                      </label>
                      <input
                        id="res-notes"
                        type="text"
                        value={resNotes}
                        onChange={(e) => setResNotes(e.target.value)}
                        placeholder="e.g. Birthday table, outdoor shade, or car model for pickup"
                        className="w-full px-3.5 py-2.5 text-sm rounded-md bg-[#F7F6F2] border border-[#171513]/15 text-[#171513] placeholder:text-[#8E867B] focus:outline-none focus:ring-2 focus:ring-[#1A4D33]"
                      />
                    </div>

                    {resError && (
                      <p role="alert" className="text-xs font-medium text-[#9B2C2C]">
                        {resError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 px-5 rounded-md bg-[#1A4D33] hover:bg-[#143D28] text-[#F7F6F2] text-sm font-medium transition-colors cursor-pointer"
                    >
                      Confirm {resMode} Reservation
                    </button>
                  </form>
                )}
              </div>
            </RevealBlock>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="border-t border-[#171513]/10 bg-[#EFECE4]/60 py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/images__3__05b83de9.jpeg"
              alt="Tastetables Africana logo"
              className="h-14 w-14 rounded-md object-contain shrink-0"
            />
            <div className="space-y-1">
              <p className="font-display text-xl font-semibold text-[#171513]">
                Africana <span className="font-sans text-xs font-normal text-[#615B53]">(Tastetables_Africana)</span>
              </p>
              <p className="text-xs text-[#524D46]">
                {RESTAURANT_INFO.address} · {RESTAURANT_INFO.plusCode}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#524D46]">
            <a href="#overview" className="hover:text-[#171513] transition-colors">
              Overview
            </a>
            <a href="#menu" className="hover:text-[#171513] transition-colors">
              Menu
            </a>
            <a href="#reviews" className="hover:text-[#171513] transition-colors">
              Reviews
            </a>
            <a href="#visit" className="hover:text-[#171513] transition-colors">
              Directions
            </a>
            <a
              href={RESTAURANT_INFO.phoneHref}
              className="text-[#1A4D33] hover:underline tabular-nums"
            >
              {RESTAURANT_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </footer>

      {/* Compact Sticky Tray Summary Bar — Appears ONLY when user adds dishes, stays well below 15% mobile height */}
      {cartCount > 0 && !drawerOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-md">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-full h-12 px-5 rounded-lg bg-[#171513] hover:bg-[#2A2622] text-[#F7F6F2] shadow-lg flex items-center justify-between gap-4 text-sm font-medium transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D6B172]" aria-hidden="true" />
              <span className="tabular-nums">{cartCount} items in tray</span>
            </span>
            <span className="tabular-nums font-semibold">
              Checkout · {formatNaira(cartTotal)}
            </span>
          </button>
        </div>
      )}

      <OrderDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        serviceMode={serviceMode}
        onServiceModeChange={setServiceMode}
        onUpdateQty={updateCartQty}
        onClearCart={() => setCart([])}
      />

      <ShareModal
        isOpen={shareModal.open}
        onClose={() => setShareModal((prev) => ({ ...prev, open: false }))}
        initialMode={shareModal.mode}
      />
    </div>
  );
}
