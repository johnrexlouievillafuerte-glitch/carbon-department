import { useState, useEffect } from 'react';
import { CarbonProvider, useCarbon } from './context/CarbonContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { NotableProjects } from './components/NotableProjects';
import { WorkshopTour } from './components/WorkshopTour';
import { AboutTeam } from './components/AboutTeam';
import { PermitsSection } from './components/PermitsSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TrackRepairModal } from './components/TrackRepairModal';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPage } from './pages/AdminPage';

function MainApp() {
  const { session } = useCarbon();

  // Track My Repair modal state
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackPlate, setTrackPlate] = useState('');
  const [trackJobNo, setTrackJobNo] = useState('');

  // Preselected service for booking
  const [preselectedBookingService, setPreselectedBookingService] = useState<string>('');

  // Routing State: Check for /admin or #admin
  const checkIsAdminPath = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.startsWith('/admin') || hash.startsWith('#/admin') || hash.startsWith('#admin');
  };

  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdminPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(checkIsAdminPath());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    try {
      window.location.hash = '#admin';
    } catch {}
    setIsAdminRoute(true);
  };

  const navigateToPublic = () => {
    try {
      window.location.hash = '';
      window.history.pushState({}, '', '/');
    } catch {}
    setIsAdminRoute(false);
  };

  const scrollToBooking = (serviceName?: string) => {
    if (serviceName) setPreselectedBookingService(serviceName);
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenTracking = (plate?: string, jobNo?: string) => {
    if (plate) setTrackPlate(plate);
    if (jobNo) setTrackJobNo(jobNo);
    setIsTrackingOpen(true);
  };

  if (isAdminRoute) {
    if (!session) {
      return <AdminLoginPage onReturnToPublic={navigateToPublic} />;
    }
    return <AdminPage onNavigatePublic={navigateToPublic} />;
  }

  return (
    <div className="min-h-screen bg-carbon-twill text-[#EEF1F6] flex flex-col font-body selection:bg-[#7B93BE]/30">
      <Navbar
        onOpenBooking={() => scrollToBooking()}
        onOpenTracking={() => handleOpenTracking()}
        onNavigateAdmin={navigateToAdmin}
      />

      <main className="flex-1">
        <Hero
          onOpenBooking={() => scrollToBooking()}
          onOpenTracking={handleOpenTracking}
        />
        <ServicesSection onSelectService={(srv) => scrollToBooking(srv)} />
        <ProcessSection />
        <NotableProjects />
        <WorkshopTour />
        <AboutTeam />
        <PermitsSection />
        <BookingSection preselectedService={preselectedBookingService} />
        <ContactSection />
      </main>

      <Footer
        onNavigateAdmin={navigateToAdmin}
        onOpenTracking={() => handleOpenTracking()}
        onOpenBooking={() => scrollToBooking()}
      />

      <TrackRepairModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialPlate={trackPlate}
        initialJobNo={trackJobNo}
      />
    </div>
  );
}

export default function App() {
  return (
    <CarbonProvider>
      <MainApp />
    </CarbonProvider>
  );
}
