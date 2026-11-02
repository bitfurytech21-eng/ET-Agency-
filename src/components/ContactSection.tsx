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
              <span className="type-support font-semibold text-[#00897d] block">
                Direct Host Support &amp; Inquiries
              </span>
              <h2 className="type-h2 text-[#282828]">
                Get in Touch With Bill &amp; Marlena
              </h2>
              <p className="type-body text-[#5c5046]">
                Have questions about residence availability, vehicle rentals, arrival add-ons, family relocations, or multi-unit organizational stays? Reach out below and our local team will respond promptly.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-4">
              <a
                href={`tel:${COMPANY_INFO.phoneClean}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] hover:border-[#00b7a8] hover:bg-[#e8f8f6]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#e6dfd5] flex items-center justify-center text-[#00b7a8] group-hover:bg-[#00b7a8] group-hover:text-white transition-colors shrink-0 shadow-2xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="type-support text-[#857568] font-medium block">Phone</span>
                  <span className="text-base font-semibold text-[#282828] tabular-nums">{COMPANY_INFO.phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] hover:border-[#00b7a8] hover:bg-[#e8f8f6]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#e6dfd5] flex items-center justify-center text-[#00b7a8] group-hover:bg-[#00b7a8] group-hover:text-white transition-colors shrink-0 shadow-2xs">
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
                  <span className="text-base font-semibold text-[#282828]">California’s Homes · Regional Operations</span>
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
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-sm sm:text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none"
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
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-sm sm:text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none"
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
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-sm sm:text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none"
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
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-sm sm:text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none tabular-nums"
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
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-sm sm:text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none"
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
                        className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] text-sm sm:text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none"
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
                        className="w-full px-3 h-11 rounded-xl border border-[#d8cfc3] text-sm bg-white text-[#282828]"
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
                        className="w-full px-3 h-11 rounded-xl border border-[#d8cfc3] text-sm bg-white text-[#282828] tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="block type-label text-[#282828] mb-1.5">
                        Expected Duration
                      </label>
                      <select
                        value={stayDuration}
                        onChange={(e) => setStayDuration(e.target.value)}
                        className="w-full px-3 h-11 rounded-xl border border-[#d8cfc3] text-sm bg-white text-[#282828]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cfc3] text-sm sm:text-base bg-white focus:border-[#00b7a8] focus:ring-1 focus:ring-[#00b7a8] outline-none"
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
                      className="w-full py-3.5 px-6 bg-[#00b7a8] hover:bg-[#009e91] active:bg-[#00897d] disabled:opacity-60 text-white type-btn rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
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
      </div>
    </section>
  );
};
