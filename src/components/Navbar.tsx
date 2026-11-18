import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onReserveClick: () => void;
}

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Menu', href: '#menu' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Visit', href: '#visit' },
];

export function Navbar({ onReserveClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#171513]/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand mark using transparent Tastetables Africana logo */}
        <a
          href="#top"
          aria-label="Tastetables Africana Home"
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A4D33] rounded-sm"
        >
          <img
            src="/assets/aistudio/images__3__05b83de9.jpeg"
            alt="Tastetables Africana logo"
            className="h-11 w-11 rounded-md object-contain select-none"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-[#171513] hidden sm:inline">
            Africana
          </span>
        </a>

        {/* Zone 2: 4 concise single-line text nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#524D46]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 hover:text-[#171513] transition-colors duration-150 whitespace-nowrap shrink-0 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1.5px] after:bg-[#1A4D33] after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A4D33] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onReserveClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#F7F6F2] bg-[#1A4D33] hover:bg-[#143D28] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A4D33]"
          >
            Book a Table
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-[#171513] hover:bg-[#EAE7DF] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A4D33]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#171513]/10 bg-[#F7F6F2] px-4 py-4 space-y-2">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="block py-2.5 px-2 text-base font-medium text-[#171513] hover:bg-[#EAE7DF] rounded-md transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onReserveClick();
            }}
            className="w-full mt-2 py-3 px-4 text-sm font-medium text-[#F7F6F2] bg-[#1A4D33] hover:bg-[#143D28] rounded-md transition-colors cursor-pointer"
          >
            Book a Table
          </button>
        </div>
      )}
    </header>
  );
}
