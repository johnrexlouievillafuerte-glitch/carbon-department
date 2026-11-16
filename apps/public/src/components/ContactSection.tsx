import React, { useState } from 'react';
import { Copy, Check, ArrowRight, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Button, Input, Textarea } from '@carbon/ui';

interface ContactSectionProps {
  initialSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialSubject = '' }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState(initialSubject ? `Inquiry regarding: ${initialSubject}` : '');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('09482432421');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('carbondepartment2.0@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError('Please fill in your name, contact details, and inquiry message.');
      return;
    }
    if (!privacyConsent) {
      setError('Please agree to the privacy notice before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          message: message.trim(),
          _hp: honeypot,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message. Please call or email directly.');
      }

      setSubmitted(true);
      setName('');
      setContact('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error submitting inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-28 bg-[#0F0F10] border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <span className="text-xs font-mono text-[#00B8F0] uppercase tracking-wider block">
            Direct Communication
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-heading font-semibold text-[#F2F2F0] tracking-tight">
            Contact &amp; Workshop Location
          </h2>
          <p className="text-sm sm:text-base text-[#9A9A9A] font-body max-w-xl">
            Visit our Cainta facility, call our service desk for immediate technical consultations, or send us a message below.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Direct Info & Location (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* List with hairline dividers, no icon tiles */}
            <div className="border-t border-white/[0.08]">
              
              {/* Address */}
              <div className="py-4 border-b border-white/[0.08] space-y-1">
                <span className="text-xs font-mono text-[#9A9A9A] uppercase tracking-wider block">
                  Workshop Address
                </span>
                <p className="text-sm text-[#F2F2F0] font-body leading-relaxed">
                  009 Felix Ave., Vista Verde Executive Village, San Isidro, Cainta, Rizal
                </p>
              </div>

              {/* Phone */}
              <div className="py-4 border-b border-white/[0.08] space-y-1">
                <span className="text-xs font-mono text-[#9A9A9A] uppercase tracking-wider block">
                  Direct Mobile &amp; Hotline
                </span>
                <div className="flex items-center justify-between">
                  <a
                    href="tel:09482432421"
                    className="font-mono text-sm text-[#F2F2F0] hover:text-[#00B8F0] transition-colors"
                  >
                    0948-243-2421
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="text-xs font-mono text-[#9A9A9A] hover:text-[#00B8F0] flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedPhone ? <Check size={12} className="text-[#2DD4A0]" /> : <Copy size={12} />}
                    <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="py-4 border-b border-white/[0.08] space-y-1">
                <span className="text-xs font-mono text-[#9A9A9A] uppercase tracking-wider block">
                  Email Inquiries
                </span>
                <div className="flex items-center justify-between">
                  <a
                    href="mailto:carbondepartment2.0@gmail.com"
                    className="text-sm text-[#F2F2F0] hover:text-[#00B8F0] transition-colors break-all"
                  >
                    carbondepartment2.0@gmail.com
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="text-xs font-mono text-[#9A9A9A] hover:text-[#00B8F0] flex items-center gap-1.5 cursor-pointer shrink-0 ml-2"
                  >
                    {copiedEmail ? <Check size={12} className="text-[#2DD4A0]" /> : <Copy size={12} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="py-4 border-b border-white/[0.08] space-y-1">
                <span className="text-xs font-mono text-[#9A9A9A] uppercase tracking-wider block">
                  Operating Hours
                </span>
                <p className="text-sm text-[#F2F2F0] font-body">
                  Monday – Saturday · 8:00 AM – 6:00 PM
                </p>
                <p className="text-xs text-[#9A9A9A]">
                  Closed Sundays for shop re-tooling &amp; facility maintenance
                </p>
              </div>

            </div>

            {/* Muted/Grayscale Map with single marker & Open in Google Maps link */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#9A9A9A] uppercase tracking-wider block">
                  Workshop Map
                </span>
                <a
                  href="https://maps.google.com/?q=009+Felix+Ave+Vista+Verde+Executive+Village+Cainta+Rizal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#00B8F0] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>

              <div className="h-48 rounded-[8px] overflow-hidden bg-[#161617] border border-white/[0.08] relative">
                <iframe
                  title="Carbon Department Cainta Workshop Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?q=009%20Felix%20Ave,%20Vista%20Verde%20Executive%20Village,%20Cainta,%20Rizal&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full filter grayscale contrast-125 opacity-75 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Clean Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#161617] border border-white/[0.08] rounded-[8px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-heading font-semibold text-[#F2F2F0]">
                Send an Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-[#9A9A9A]">
                Have a question about custom aero fabrication, paint options, or mechanical maintenance? We reply within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-[6px] bg-[#0F0F10] border border-[#2DD4A0]/40 text-center space-y-3">
                <Check size={28} className="text-[#2DD4A0] mx-auto" />
                <h4 className="text-sm font-heading font-semibold text-[#F2F2F0]">
                  Inquiry Dispatched Successfully
                </h4>
                <p className="text-xs text-[#9A9A9A] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Our service advisor will review your message and contact your provided mobile number or email.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-mono text-[#00B8F0] hover:underline pt-2 cursor-pointer"
                >
                  Send another inquiry &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot */}
                <input
                  type="text"
                  name="_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {error && (
                  <div className="p-3 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C] flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    placeholder="e.g. Maria Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Phone or Email *"
                    placeholder="0917-000-0000 or email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>

                <Textarea
                  label="Inquiry Message *"
                  rows={4}
                  placeholder="Tell us about your project or repair requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <div className="p-3.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08]">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#9A9A9A] leading-relaxed">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 rounded-[4px] border-white/20 bg-[#161617] text-[#00B8F0] focus:ring-[#00B8F0]"
                    />
                    <span>
                      I consent to Carbon Department storing my contact details for the sole purpose of answering this inquiry, pursuant to the Data Privacy Act of 2012 (RA 10173).
                    </span>
                  </label>
                </div>

                {/* Primary Send Inquiry button: ALIGNED LEFT under consent */}
                <div className="pt-2 flex justify-start">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full sm:w-auto text-center justify-center flex items-center gap-2"
                  >
                    <span>{loading ? 'Sending...' : 'Send Inquiry'}</span>
                    <ArrowRight size={15} />
                  </Button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
