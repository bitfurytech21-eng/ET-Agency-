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
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';

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
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generated = 'ETL-' + Math.floor(100000 + Math.random() * 900000);
    setRefCode(generated);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Host Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Direct Host Communication
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
                Get in Touch With Bill & Marlena
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Interested in more information to see if our midterm accommodations are the right fit for your assignment? We are happy to answer any questions. Fill out the form and we will get back to you ASAP.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-4">
              <a
                href={`tel:${COMPANY_INFO.phoneClean}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Phone</span>
                  <span className="text-base font-extrabold text-slate-900">{COMPANY_INFO.phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Email</span>
                  <span className="text-base font-extrabold text-slate-900 break-all">{COMPANY_INFO.email}</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Location</span>
                  <span className="text-base font-extrabold text-slate-900">Sacramento & Rancho Cordova, CA</span>
                </div>
              </div>
            </div>

            {/* Check-In Timetable */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Move-In & Departure Schedule</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Check-in time:</strong> 2:00 PM on your mutually approved move-in day. <br />
                <strong>Check-out time:</strong> 11:00 AM on move-out day.
              </p>
              <p className="text-[11px] text-slate-400">
                Early check-in or late check-out accommodated upon schedule availability.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-white rounded-2xl border border-teal-200 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-heading font-black text-2xl text-slate-900">
                    Inquiry Received, {firstName}!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Easy Travel Lodging. Hosts Bill and Marlena have received your reservation request and will reply within 24 hours.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block text-xs font-mono font-bold text-slate-800">
                    Inquiry Reference: <span className="text-sky-600">{refCode}</span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="border-b border-slate-200 pb-3 mb-4">
                    <h3 className="font-heading font-black text-xl text-slate-900">
                      Book Your Stay & Check Vacancies
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fields marked with an asterisk (<span className="text-rose-500 font-bold">*</span>) are required.
                    </p>
                  </div>

                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Contact fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@hospital.org"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(916) 555-0123"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Company & Job */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Company / Hospital / Agency <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. UC Davis Health / Intel / Travelers"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Job Title / Traveler Role <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Traveling ICU Nurse / Project Manager"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Property selection & dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Preferred Unit
                      </label>
                      <select
                        value={propertyChoice}
                        onChange={(e) => setPropertyChoice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
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
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Move-In Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Expected Duration
                      </label>
                      <select
                        value={stayDuration}
                        onChange={(e) => setStayDuration(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
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
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message / Special Requests <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please share details about your stay, number of occupants, or any questions about our Sacramento properties..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Booking Inquiry to Bill & Marlena</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
