import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenTracker }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('services');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['services', 'process', 'projects', 'about', 'contact'];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'process', label: 'How We Work', href: '#process' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0F0F10] border-b border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none select-none">
          <img
            src="/assets/logo.png"
            alt="Carbon Department Official Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
          <div className="flex flex-col">
            <span className="font-heading font-semibold text-sm tracking-tight text-[#F2F2F0] leading-none">
              Carbon Department
            </span>
            <span className="text-[11px] text-[#9A9A9A] font-body mt-1 leading-none hidden sm:block">
              Auto Body &amp; Repair Services
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 h-full">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative h-full flex items-center text-sm font-medium transition-colors ${
                  isActive ? 'text-[#F2F2F0]' : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B8F0]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenTracker}
            className="px-3.5 py-1.5 rounded-[6px] text-xs font-medium text-[#F2F2F0] border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Track Repair
          </button>
          <button
            type="button"
            onClick={onOpenBooking}
            className="px-4 py-1.5 rounded-[6px] text-xs font-semibold text-[#0F0F10] bg-[#00B8F0] hover:bg-[#38C5F5] active:bg-[#009fd0] transition-colors cursor-pointer shadow-none"
          >
            Book a Visit
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-[6px] text-[#9A9A9A] hover:text-[#F2F2F0] hover:bg-white/[0.04] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#0F0F10] border-b border-white/[0.08] space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm rounded-[6px] transition-colors ${
                    isActive
                      ? 'text-[#00B8F0] bg-white/[0.04] font-medium'
                      : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="w-full py-2.5 rounded-[6px] text-xs font-medium text-[#F2F2F0] border border-white/15 text-center"
            >
              Track Repair
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 rounded-[6px] text-xs font-semibold text-[#0F0F10] bg-[#00B8F0] text-center"
            >
              Book a Visit
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
