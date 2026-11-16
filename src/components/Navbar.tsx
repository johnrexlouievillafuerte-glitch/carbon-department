import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Menu, 
  X 
} from 'lucide-react';
import { useCarbon } from '../context/CarbonContext';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenTracking: () => void;
  onNavigateAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenTracking,
  onNavigateAdmin,
}) => {
  const { theme, toggleTheme, session } = useCarbon();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'How We Work', href: '#how-we-work' },
    { name: 'Notable Projects', href: '#notable-projects' },
    { name: 'Workshop Tour', href: '#workshop-tour' },
    { name: 'About & Team', href: '#about-team' },
    { name: 'Permits', href: '#permits' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0D12]/92 backdrop-blur-xl border-b border-[#7B93BE]/20 py-2.5 shadow-lg shadow-black/40'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-[#172B57] border border-[#7B93BE]/40 flex items-center justify-center clip-brand transition-transform group-hover:scale-105 shadow-md">
              <div className="brand-corner-tr" />
              <span className="font-heading font-extrabold text-sm tracking-wider text-white">
                CD
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-heading font-extrabold tracking-tight text-white uppercase">
                  CARBON <span className="text-[#7B93BE] font-normal">DEPARTMENT</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-[#172B57]/70 text-[#FFB020] border border-[#FFB020]/30 font-semibold">
                  EST. 2020
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-body">
                009 Felix Ave., Vista Verde, Cainta, Rizal
              </span>
            </div>
          </a>

          <nav className="hidden xl:flex items-center gap-1 bg-[#151922]/75 px-3 py-1.5 rounded-full border border-[#7B93BE]/25 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1 rounded-full text-xs font-body text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg neu-control flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Color Theme"
            >
              {theme === 'dark' ? <Sun size={14} className="text-[#FFB020]" /> : <Moon size={14} className="text-[#172B57]" />}
            </button>

            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold text-slate-200 hover:text-white bg-[#151922] border border-[#7B93BE]/30 hover:border-[#7B93BE] transition-all cursor-pointer shadow-sm"
            >
              <Search size={13} className="text-[#FFB020]" />
              <span>Track Repair</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="btn-amber px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5 clip-tr shadow-md"
            >
              <Calendar size={13} />
              <span>Book Visit</span>
            </button>

            <button
              onClick={onNavigateAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold text-[#7B93BE] hover:text-white bg-[#172B57]/50 hover:bg-[#172B57] border border-[#7B93BE]/40 transition-all cursor-pointer"
              title="Open Secure Automotive Repair Management System"
            >
              <ShieldCheck size={13} className="text-[#FFB020]" />
              <span>{session ? `Admin (${session.name.split(' ')[0]})` : 'Admin System'}</span>
            </button>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg neu-control flex items-center justify-center text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} className="text-[#FFB020]" /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-lg bg-[#151922] border border-[#7B93BE]/30 flex items-center justify-center text-white"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0B0D12]/98 border-b border-[#7B93BE]/30 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-200 hover:text-white rounded-md hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#151922] border border-[#7B93BE]/40 text-xs font-semibold text-white"
            >
              <Search size={14} className="text-[#FFB020]" />
              <span>Track My Repair Status</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg btn-amber text-xs uppercase"
            >
              <Calendar size={14} />
              <span>Book a Visit (Free Slot)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#172B57] border border-[#7B93BE]/50 text-xs font-semibold text-white"
            >
              <ShieldCheck size={14} className="text-[#FFB020]" />
              <span>Enter Admin Management System</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
