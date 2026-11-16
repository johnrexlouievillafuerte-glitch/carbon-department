import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RepairTrackerStrip } from './components/RepairTrackerStrip';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { NotableProjects } from './components/NotableProjects';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingWizardModal } from './components/BookingWizardModal';
import { TrackRepairModal } from './components/TrackRepairModal';

export const App: React.FC = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);

  const [bookingDivision, setBookingDivision] = useState('Body & Custom Work');
  const [bookingService, setBookingService] = useState('Carbon Fiber & Fiberglass Layup');

  // Pre-fill tracker from Hero / Tracker Strip
  const [trackerPlate, setTrackerPlate] = useState('');
  const [trackerJobNo, setTrackerJobNo] = useState('');
  const [trackerPin, setTrackerPin] = useState('');

  // Inquiry subject
  const [inquirySubject, setInquirySubject] = useState('');

  const handleOpenBookingWithService = (division: string, service: string) => {
    setBookingDivision(division);
    setBookingService(service);
    setBookingOpen(true);
  };

  const handleOpenTrackerWithValues = (plate: string, jobNo: string, pin: string) => {
    setTrackerPlate(plate);
    setTrackerJobNo(jobNo);
    setTrackerPin(pin);
    setTrackerOpen(true);
  };

  const handleRequestVerification = () => {
    setInquirySubject('Official Permits & Compliance Verification Request');
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#F2F2F0] selection:bg-[#00B8F0]/30 selection:text-white flex flex-col justify-between">
      {/* Navigation */}
      <Navbar
        onOpenBooking={() => setBookingOpen(true)}
        onOpenTracker={() => setTrackerOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero onOpenBooking={() => setBookingOpen(true)} />
        <RepairTrackerStrip onOpenTrackerWithValues={handleOpenTrackerWithValues} />
        <ServicesSection onSelectService={handleOpenBookingWithService} />
        <ProcessSection />
        <NotableProjects />
        <AboutSection onRequestVerification={handleRequestVerification} />
        <ContactSection initialSubject={inquirySubject} />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => setBookingOpen(true)} />

      {/* Modals */}
      <BookingWizardModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialDivision={bookingDivision}
        initialService={bookingService}
      />

      <TrackRepairModal
        open={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        prefillPlate={trackerPlate}
        prefillJobNo={trackerJobNo}
        prefillPin={trackerPin}
      />
    </div>
  );
};
