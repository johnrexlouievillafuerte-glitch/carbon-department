import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Navigation,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { SHOP_INFO } from '../data/carbonStore';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-carbon-twill border-b border-[#7B93BE]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B57]/50 border border-[#7B93BE]/30 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
            <MapPin size={13} />
            <span>Workshop Location &amp; Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Let's Talk About Your Build. <br />
            <span className="text-[#7B93BE]">Visit Our Facility in Cainta.</span>
          </h2>
          <p className="text-sm text-slate-300 font-body leading-relaxed">
            Direct communication with our technical team. Drop by for an in-person vehicle inspection or send us your scope of work.
          </p>
        </div>

        {/* 2-Column Asymmetrical Grid: Contact Details & Map vs Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (6 Cols): Contact Cards & Map Block */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Phone */}
              <a
                href="tel:09482432421"
                className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/30 clip-brand group cursor-pointer block hover:border-[#FFB020] transition-colors"
              >
                <div className="brand-corner-tr" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/30 flex items-center justify-center text-[#FFB020]">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-[#7B93BE] font-semibold block">
                      Direct Shop Mobile
                    </span>
                    <span className="text-sm font-heading font-bold text-white group-hover:text-[#FFB020] transition-colors">
                      {SHOP_INFO.phone}
                    </span>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:carbondepartment2.0@gmail.com"
                className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/30 clip-brand group cursor-pointer block hover:border-[#7B93BE] transition-colors"
              >
                <div className="brand-corner-tr" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/30 flex items-center justify-center text-[#7B93BE]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-[#7B93BE] font-semibold block">
                      Official Email
                    </span>
                    <span className="text-xs font-mono-code font-bold text-white group-hover:text-[#7B93BE] transition-colors truncate block max-w-[160px]">
                      {SHOP_INFO.email}
                    </span>
                  </div>
                </div>
              </a>

            </div>

            {/* Address & Hours Card */}
            <div className="glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 clip-brand space-y-3">
              <div className="brand-corner-tr" />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/30 flex items-center justify-center text-[#FFB020] shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-code uppercase text-[#7B93BE] font-semibold block">
                    Cainta Facility Address
                  </span>
                  <p className="text-sm font-heading font-bold text-white">
                    {SHOP_INFO.address}
                  </p>
                  <p className="text-xs text-slate-300 font-body">
                    Located inside Vista Verde Executive Village, accessible via Felix Ave. (Imelda Ave.) connecting Ortigas Extension and Marcos Highway.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center gap-3 text-xs text-slate-300 font-body">
                <Clock size={14} className="text-[#10B981] shrink-0" />
                <span>
                  <strong className="text-white">Operating Hours:</strong> {SHOP_INFO.hours}
                </span>
              </div>
            </div>

            {/* Interactive Map Visual Block */}
            <div className="glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 clip-brand space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-heading font-bold text-white">
                  <Navigation size={14} className="text-[#FFB020]" />
                  <span>Workshop Directions Cue</span>
                </div>
                <span className="text-[10px] font-mono-code text-[#7B93BE]">
                  Cainta, Rizal
                </span>
              </div>

              {/* Styled Mock Map Container with Grid & Pin */}
              <div className="relative h-48 rounded-xl bg-[#090C12] border border-[#7B93BE]/30 overflow-hidden flex flex-col items-center justify-center p-4 text-center space-y-2">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#7B93BE_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative w-12 h-12 rounded-full bg-[#172B57] border-2 border-[#FFB020] flex items-center justify-center text-[#FFB020] shadow-xl animate-bounce">
                  <MapPin size={22} />
                </div>

                <div className="relative z-10 space-y-0.5">
                  <span className="font-heading font-bold text-xs text-white block">
                    Carbon Department Auto Body &amp; Repair Services
                  </span>
                  <span className="text-[10px] font-mono-code text-[#7B93BE] block">
                    14.6091° N, 121.1147° E · 009 Felix Ave., Cainta
                  </span>
                </div>

                <a
                  href="https://maps.google.com/?q=009+Felix+Ave+Vista+Verde+Cainta+Rizal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 px-3 py-1 rounded-md bg-[#172B57] hover:bg-[#203a74] text-white text-[11px] font-heading font-semibold border border-[#7B93BE]/40 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Navigation size={11} className="text-[#FFB020]" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column (6 Cols): Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="glass-navy p-6 sm:p-8 rounded-3xl border border-[#7B93BE]/30 clip-brand-lg shadow-2xl space-y-6">
              <div className="brand-corner-tr" />

              <div className="space-y-1 border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
                  <MessageSquare size={13} />
                  <span>Direct Consultation Message</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-white">
                  Send an Inquiry
                </h3>
                <p className="text-xs text-slate-300 font-body">
                  Have a specific composite fabrication request or mechanical symptom? Drop a message and our technical lead will respond promptly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#11141C] border border-[#10B981]/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-[#10B981] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-base font-heading font-bold text-white">
                    Message Dispatched to Shop Leads
                  </h4>
                  <p className="text-xs text-slate-300 font-body">
                    Thank you, <strong className="text-white">{name}</strong>. We have received your inquiry and will reach out to <strong className="text-[#FFB020]">{contact}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-[#172B57] text-white text-xs font-semibold cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                      Your Name <span className="text-[#FFB020]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Oliver Santos"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                      Mobile Number or Email <span className="text-[#FFB020]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="0917-000-0000 or email@domain.ph"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                      Subject / Division of Interest
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                    >
                      <option value="Body & Custom Work">Body &amp; Custom Work (Carbon Fiber / Metalwork / Paint)</option>
                      <option value="Mechanical & Maintenance">Mechanical &amp; Maintenance (PMS / Engine / AC)</option>
                      <option value="Fleet Consultation">Commercial / Fleet Custom Finishing</option>
                      <option value="General Inquiry">General Question / Shop Visit</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                      Message / Vehicle Details <span className="text-[#FFB020]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide details on your vehicle make/model and desired repair or composite project..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-body flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-[#10B981]" />
                      <span>Data held confidential</span>
                    </span>

                    <button
                      type="submit"
                      className="btn-amber px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-2 clip-tr shadow-md"
                    >
                      <Send size={13} />
                      <span>Send Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
