import React, { useState } from 'react';
import { COMPANY_INFO, PROPERTIES } from '../data/lodgingData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';
import { CaliforniaExperiencesAccordion } from './CaliforniaExperiencesAccordion';

interface ContactSectionProps {
  preselectedPropertyId?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedPropertyId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [propertyChoice, setPropertyChoice] = useState(preselectedPropertyId || 'any');
  const [moveInDate, setMoveInDate] = useState('');
  const [stayDuration, setStayDuration] = useState('30-90');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const fullName = `${firstName} ${lastName}`.trim();
    try {
      const [bookingRes, inquiryRes] = await Promise.all([
        fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId: propertyChoice,
            guestName: fullName,
            guestEmail: email,
            guestPhone: phone,
            employer: company,
            role: jobTitle,
            checkIn: moveInDate || undefined,
            duration: stayDuration,
            notes: message,
          }),
        }),
        fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'contact',
            name: fullName,
            email,
            phone,
            company,
            role: jobTitle,
            propertyId: propertyChoice,
            moveInDate,
            duration: stayDuration,
            message,
          }),
        }),
      ]);

      const bookingData = await bookingRes.json().catch(() => ({}));
      const inquiryData = await inquiryRes.json().catch(() => ({}));

      if (!bookingRes.ok && !inquiryRes.ok) {
        throw new Error(bookingData.message || inquiryData.message || 'Could not submit inquiry');
      }

      setRefCode(
        bookingData?.booking?.id ||
          inquiryData?.referenceCode ||
          `ETL-${Math.floor(100000 + Math.random() * 900000)}`,
      );
      setSubmitted(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send inquiry right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-b border-[#e6dfd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Host Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="type-support font-semibold text-[#14616d] block">
                California Host Concierge &amp; Inquiries
              </span>
              <h2 className="type-h2 text-[#282828]">
                Get in Touch With Bill &amp; Marlena
              </h2>
              <p className="type-body text-[#5c5046]">
                Have questions about furnished residence availability across California, private vehicle fleet rentals, arrival add-ons, family relocations, or statewide organizational housing? Connect with Bill &amp; Marlena&apos;s California concierge team below.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-4">
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] hover:border-[#25D366] hover:bg-[#f0fdf4]/70 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.92 9.92 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.914 9.914 0 0012.012 2zm5.836 14.288c-.244.686-1.42 1.309-1.959 1.385-.506.071-1.168.102-1.884-.127-.433-.139-1.002-.326-1.728-.639-3.04-1.31-5.018-4.385-5.17-4.588-.152-.203-1.233-1.639-1.233-3.125 0-1.486.777-2.217 1.053-2.52.276-.303.602-.379.803-.379.201 0 .401.002.576.01.185.008.434-.07.679.519.245.589.833 2.034.906 2.181.073.148.122.322.024.518-.098.196-.148.318-.293.489-.146.171-.307.382-.439.514-.146.146-.298.305-.128.597.17.292.756 1.248 1.621 2.018 1.112.99 2.051 1.298 2.343 1.444.292.146.463.122.634-.073.171-.195.732-.854.927-1.147.195-.293.39-.244.659-.146.268.098 1.708.805 2.001.952.293.146.488.22.561.342.073.122.073.708-.171 1.394z" />
                  </svg>
                </div>
                <div>
                  <span className="type-support text-[#857568] font-medium block">WhatsApp &amp; Official Line</span>
                  <span className="text-base font-bold text-[#282828] tabular-nums">{COMPANY_INFO.phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] hover:border-[#14616d] hover:bg-[#f0f7f8]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#e6dfd5] flex items-center justify-center text-[#14616d] group-hover:bg-[#14616d] group-hover:text-white transition-colors shrink-0 shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="type-support text-[#857568] font-medium block">Email</span>
                  <span className="text-base font-semibold text-[#282828] break-all">{COMPANY_INFO.email}</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5]">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#e6dfd5] flex items-center justify-center text-[#82634f] shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="type-support text-[#857568] font-medium block">Coverage</span>
                  <span className="text-base font-semibold text-[#282828]">Statewide California Experiences &amp; Premier Residences</span>
                </div>
              </div>
            </div>

            {/* Check-In Timetable with Live Realistic Twilight Arrival Photo */}
            <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl text-white border border-[#3a2f28] shadow-md">
              <LivePhotoBackground scene="twilight" overlay="espresso" />
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 text-[#4de0d2] type-support font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Move-In &amp; Departure Schedule</span>
                </div>
                <p className="type-support text-[#f2ebe2] tabular-nums">
                  <strong className="font-semibold text-white">Check-in time:</strong> 2:00 PM on your mutually approved move-in day. <br />
                  <strong className="font-semibold text-white">Check-out time:</strong> 11:00 AM on move-out day.
                </p>
                <p className="type-support text-[#dfd3c5]">
                  Early check-in or late check-out accommodated upon schedule availability.
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#faf8f5] rounded-3xl p-6 sm:p-10 border border-[#e6dfd5] shadow-2xs">
              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-white rounded-2xl border border-[#b8ebe5] animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#e8f8f6] text-[#00897d] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="type-h3 text-[#282828]">
                    Inquiry Received, {firstName}!
                  </h3>
                  <p className="type-body text-[#5c5046] max-w-md mx-auto">
                    Thank you for reaching out to Easy Travel Lodging. Hosts Bill and Marlena have received your reservation request and will reply within 24 hours.
                  </p>
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e6dfd5] inline-block type-support font-mono font-semibold text-[#282828]">
                    Inquiry Reference: <span className="text-[#00897d]">{refCode}</span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 bg-[#82634f] text-white type-btn rounded-xl hover:bg-[#6e5240] transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="border-b border-[#e6dfd5] pb-3.5 mb-4 space-y-1">
                    <h3 className="type-h3 text-[#282828]">
                      Book Your Stay &amp; Check Vacancies
                    </h3>
                    <p className="type-support text-[#6e5f53]">
                      Fields marked with an asterisk (<span className="text-rose-500 font-semibold">*</span>) are required.
                    </p>
                  </div>

                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none"
                      />
                    </div>
                  </div>

                  {/* Contact fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(916) 555-0123"
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Optional Organization & Purpose */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Organization or Household (Optional)
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Family Relocation, Home Remodel, Company"
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Purpose of Stay (Optional)
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Short Visit, Extended Stay, Fleet Rental"
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                      />
                    </div>
                  </div>

                  {/* Property selection & dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Preferred Unit
                      </label>
                      <select
                        value={propertyChoice}
                        onChange={(e) => setPropertyChoice(e.target.value)}
                        className="w-full px-3 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white text-[#282828] focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                      >
                        <option value="any">Any Available Unit</option>
                        {PROPERTIES.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.code} - {p.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Move-In Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        className="w-full px-3 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white text-[#282828] tabular-nums focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Expected Duration
                      </label>
                      <select
                        value={stayDuration}
                        onChange={(e) => setStayDuration(e.target.value)}
                        className="w-full px-3 h-11 rounded-xl border border-[#d8cfc3] text-base bg-white text-[#282828] focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                      >
                        <option value="5-10">5 – 10 Days (Short Stay)</option>
                        <option value="10-30">10 – 30 Days</option>
                        <option value="30-60">30 – 60 Days</option>
                        <option value="60-90">60 – 90 Days</option>
                        <option value="90-180">90 – 180 Days</option>
                        <option value="6mo+">6+ Months</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Message / Special Requests <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please share details about your stay, desired destination, number of occupants, or any questions about our residences and fleet..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cfc3] text-base bg-white focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 type-support flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary w-full py-3.5 text-center flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Reservation Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Booking Inquiry to Bill &amp; Marlena</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 type-support text-[#6e5f53] pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>We respect your email privacy. Zero spam or third-party marketing.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* California Experiences & Regional Concierge Accordion */}
        <div className="mt-16 pt-12 border-t border-[#e6dfd5]">
          <CaliforniaExperiencesAccordion
            title="California Experiences & Regional Concierge"
            subtitle="Statewide Destinations &amp; Regional Corridors"
            description="Planning your California journey? Whether staying for corporate projects, healthcare assignments, or extended retreats, explore our curated regional experiences across dining, vineyards, culture, and outdoor escapes."
          />
        </div>
      </div>
    </section>
  );
};
