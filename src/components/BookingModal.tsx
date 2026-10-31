import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Home, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ChevronDown,
  Info,
  Printer,
  Check
} from 'lucide-react';
import { PROPERTIES, PropertyListing } from '../data/lodgingData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPropertyId?: string;
  initialMoveInDate?: string;
  initialDuration?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  moveInDate?: string;
  moveOutDate?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPropertyId = 'any',
  initialMoveInDate = '',
  initialDuration = '30-60',
}) => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropertyId);
  const [moveInDate, setMoveInDate] = useState(initialMoveInDate);
  const [moveOutDate, setMoveOutDate] = useState('');
  const [duration, setDuration] = useState(initialDuration);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [floorPreference, setFloorPreference] = useState<'any' | 'downstairs' | 'upstairs'>('any');
  const [specialRequests, setSpecialRequests] = useState('');
  const [hasPet, setHasPet] = useState(false);
  const [needsParking, setNeedsParking] = useState(true);

  // UI State
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingSuccessData, setBookingSuccessData] = useState<{
    reference: string;
    propertyName: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    email: string;
  } | null>(null);

  // Today string for min date
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Update initial values whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      if (initialPropertyId) setSelectedPropertyId(initialPropertyId);
      if (initialMoveInDate) setMoveInDate(initialMoveInDate);
      if (initialDuration) setDuration(initialDuration);
      setSubmitError(null);
      setBookingSuccessData(null);
    }
  }, [isOpen, initialPropertyId, initialMoveInDate, initialDuration]);

  // Sync Move-Out date automatically based on Move-In date and duration if not manually altered
  useEffect(() => {
    if (!moveInDate) return;

    let daysToAdd = 30;
    if (duration === '5-10') daysToAdd = 7;
    else if (duration === '10-30') daysToAdd = 21;
    else if (duration === '30-60') daysToAdd = 45;
    else if (duration === '60-90') daysToAdd = 75;
    else if (duration === '90-180') daysToAdd = 120;
    else if (duration === '6mo+') daysToAdd = 180;

    const start = new Date(moveInDate);
    if (!isNaN(start.getTime())) {
      start.setDate(start.getDate() + daysToAdd);
      setMoveOutDate(start.toISOString().split('T')[0]);
    }
  }, [moveInDate, duration]);

  // Selected Property Object
  const currentProperty = useMemo(() => {
    if (selectedPropertyId === 'any') return null;
    return PROPERTIES.find((p) => p.id === selectedPropertyId) || null;
  }, [selectedPropertyId]);

  // Validation function
  const validateField = (field: keyof FormErrors, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 2) return 'Please enter your complete name.';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address.';
        }
        return undefined;
      case 'phone':
        if (!value.trim()) return 'Phone number is required.';
        if (value.replace(/\D/g, '').length < 7) {
          return 'Please enter a valid phone number with area code.';
        }
        return undefined;
      case 'company':
        if (!value.trim()) return 'Employer, hospital or agency is required.';
        return undefined;
      case 'role':
        if (!value.trim()) return 'Job title or traveler role is required.';
        return undefined;
      case 'moveInDate':
        if (!value) return 'Estimated move-in date is required.';
        return undefined;
      case 'moveOutDate':
        if (moveInDate && value && new Date(value) <= new Date(moveInDate)) {
          return 'Estimated move-out date must be after your move-in date.';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'name') val = name;
    else if (field === 'email') val = email;
    else if (field === 'phone') val = phone;
    else if (field === 'company') val = company;
    else if (field === 'role') val = role;
    else if (field === 'moveInDate') val = moveInDate;
    else if (field === 'moveOutDate') val = moveOutDate;

    const errorMsg = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleInputChange = (field: keyof FormErrors, value: string, setter: (val: string) => void) => {
    setter(value);
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      phone: validateField('phone', phone),
      company: validateField('company', company),
      role: validateField('role', role),
      moveInDate: validateField('moveInDate', moveInDate),
      moveOutDate: validateField('moveOutDate', moveOutDate),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      company: true,
      role: true,
      moveInDate: true,
      moveOutDate: true,
    });

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate effective checkIn and checkOut
      let finalCheckIn = moveInDate;
      if (!finalCheckIn) {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        finalCheckIn = d.toISOString().split('T')[0];
      }

      let finalCheckOut = moveOutDate;
      if (!finalCheckOut || new Date(finalCheckOut) <= new Date(finalCheckIn)) {
        const d = new Date(finalCheckIn);
        d.setDate(d.getDate() + 30);
        finalCheckOut = d.toISOString().split('T')[0];
      }

      // Compile notes with metadata
      const notesParts = [
        `Employer/Agency: ${company}`,
        `Role: ${role}`,
        `Duration Requested: ${duration}`,
        `Floor Preference: ${floorPreference}`,
        hasPet ? 'Traveling with Pet' : 'No Pets',
        needsParking ? 'Dedicated Parking Requested' : 'No Parking Needed',
        specialRequests ? `Special Requests: ${specialRequests}` : null,
      ].filter(Boolean);

      const requestPayload = {
        propertyId: selectedPropertyId === 'any' ? 'unit-91' : selectedPropertyId,
        guestName: name.trim(),
        guestEmail: email.trim(),
        guestPhone: phone.trim(),
        employer: company.trim(),
        role: role.trim(),
        checkIn: finalCheckIn,
        checkOut: finalCheckOut,
        adults,
        children,
        duration,
        notes: notesParts.join(' | '),
        specialRequests: specialRequests.trim() || undefined,
        paymentProvider: 'manual',
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to submit reservation inquiry. Please check your connection.');
      }

      const generatedRef = data?.booking?.id || `ETL-${Math.floor(100000 + Math.random() * 900000)}`;
      const propTitle = currentProperty ? `${currentProperty.unitNumber} (${currentProperty.title})` : 'Flexible 1-2 Bedroom Suite';

      setBookingSuccessData({
        reference: generatedRef,
        propertyName: propTitle,
        checkIn: finalCheckIn,
        checkOut: finalCheckOut,
        guestName: name.trim(),
        email: email.trim(),
      });
    } catch (err: unknown) {
      console.error('[BookingModal] Submission failed:', err);
      // Fallback gracefully while informing user
      const message = err instanceof Error ? err.message : 'Network submission error.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-slate-900/20 border border-slate-200/90 text-left overflow-hidden relative"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/60">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Mid-Term & Corporate Reservation Inquiry
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
              Book Your Stay With Bill & Marlena
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
              Submit your dates and assignment details below. We personally review every inquiry within 12–24 hours to confirm vacancies, lock in monthly rates, and provide tailored lease terms.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {bookingSuccessData ? (
            /* Success Feedback Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-blue-600" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Inquiry Dispatched Successfully
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                  Thank You, {bookingSuccessData.guestName}!
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Your reservation inquiry has been transmitted directly to local Sacramento hosts <strong>Bill & Marlena</strong>. A confirmation email has been dispatched to <strong>{bookingSuccessData.email}</strong>.
                </p>
              </div>

              {/* Booking Reference & Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-left max-w-lg mx-auto space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Inquiry Reference
                  </span>
                  <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {bookingSuccessData.reference}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Selected Unit</span>
                    <span className="text-slate-800 font-bold mt-0.5 block truncate">
                      {bookingSuccessData.propertyName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Contact Email</span>
                    <span className="text-slate-800 font-bold mt-0.5 block truncate">
                      {bookingSuccessData.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Check-In Date</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">
                      {bookingSuccessData.checkIn}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Estimated Check-Out</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">
                      {bookingSuccessData.checkOut}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    No charges apply now. Rates and terms will be sent for your approval before signing.
                  </span>
                </div>
              </div>

              {/* Next Steps Guidance */}
              <div className="max-w-lg mx-auto text-left bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-900 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Info className="w-4 h-4 text-blue-600" /> What Happens Next?
                </span>
                <p className="leading-relaxed text-blue-800">
                  1. Bill & Marlena review your assignment dates.<br />
                  2. You will receive an official availability confirmation and custom quote within 12–24 hours.<br />
                  3. If you have urgent questions, call or text us at <strong>(916) 426-3655</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Summary
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Close & Return
                </button>
              </div>
            </motion.div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {submitError && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold">Notice during submission:</span>
                    <p className="text-amber-800">{submitError}</p>
                    <p className="text-amber-700">Your details are saved in the form above so you can retry or call us directly.</p>
                  </div>
                </div>
              )}

              {/* SECTION 1: Guest Information */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    1. Guest Information
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-blue-600 font-medium">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="guestName"
                      value={name}
                      onChange={(e) => handleInputChange('name', e.target.value, setName)}
                      onBlur={() => handleBlur('name')}
                      placeholder="e.g. Amanda Clark"
                      className={`w-full pl-10 pr-4 h-11 text-sm bg-white rounded-xl border transition-all duration-200 outline-none ${
                        errors.name && touched.name
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                          : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10'
                      }`}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address <span className="text-blue-600 font-medium">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="guestEmail"
                        value={email}
                        onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                        onBlur={() => handleBlur('email')}
                        placeholder="amanda@travelers.com"
                        className={`w-full pl-10 pr-4 h-11 text-sm bg-white rounded-xl border transition-all duration-200 outline-none ${
                          errors.email && touched.email
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10'
                        }`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number <span className="text-blue-600 font-medium">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="guestPhone"
                        value={phone}
                        onChange={(e) => handleInputChange('phone', e.target.value, setPhone)}
                        onBlur={() => handleBlur('phone')}
                        placeholder="(916) 555-0182"
                        className={`w-full pl-10 pr-4 h-11 text-sm bg-white rounded-xl border transition-all duration-200 outline-none ${
                          errors.phone && touched.phone
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10'
                        }`}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Professional Information */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    2. Professional Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Employer / Hospital / Agency <span className="text-blue-600 font-medium">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="employer"
                        value={company}
                        onChange={(e) => handleInputChange('company', e.target.value, setCompany)}
                        onBlur={() => handleBlur('company')}
                        placeholder="e.g. Kaiser / Sutter / Intel"
                        className={`w-full pl-10 pr-4 h-11 text-sm bg-white rounded-xl border transition-all duration-200 outline-none ${
                          errors.company && touched.company
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10'
                        }`}
                      />
                    </div>
                    {errors.company && touched.company && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Job Title / Traveler Role <span className="text-blue-600 font-medium">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="role"
                        value={role}
                        onChange={(e) => handleInputChange('role', e.target.value, setRole)}
                        onBlur={() => handleBlur('role')}
                        placeholder="e.g. Traveling Physical Therapist"
                        className={`w-full pl-10 pr-4 h-11 text-sm bg-white rounded-xl border transition-all duration-200 outline-none ${
                          errors.role && touched.role
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10'
                        }`}
                      />
                    </div>
                    {errors.role && touched.role && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Accommodation Preferences */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    3. Accommodation Preferences
                  </h3>
                </div>

                {/* Preferred Unit Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Accommodation Unit
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Home className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(e.target.value)}
                      className="w-full pl-10 pr-10 h-11 text-sm bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all duration-200 outline-none appearance-none cursor-pointer"
                    >
                      <option value="any">Any Available Unit (Best Match / Flexible)</option>
                      {PROPERTIES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.unitNumber} ({p.code}) • {p.title} - ${p.monthlyRate}/mo
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  {currentProperty && (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{currentProperty.unitNumber}</span>
                        <span>•</span>
                        <span>{currentProperty.floor}</span>
                        <span>•</span>
                        <span>{currentProperty.bedrooms} Bed / {currentProperty.bathrooms} Bath</span>
                      </div>
                      <span className="font-bold text-blue-700">${currentProperty.monthlyRate}/month</span>
                    </div>
                  )}
                </div>

                {/* Move-in and Move-out Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Estimated Move-In Date <span className="text-blue-600 font-medium">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        min={todayStr}
                        value={moveInDate}
                        onChange={(e) => handleInputChange('moveInDate', e.target.value, setMoveInDate)}
                        onBlur={() => handleBlur('moveInDate')}
                        className={`w-full pl-10 pr-4 h-11 text-sm bg-white rounded-xl border transition-all duration-200 outline-none cursor-pointer ${
                          errors.moveInDate && touched.moveInDate
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10'
                        }`}
                      />
                    </div>
                    {errors.moveInDate && touched.moveInDate && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.moveInDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Estimated Move-Out Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        min={moveInDate || todayStr}
                        value={moveOutDate}
                        onChange={(e) => handleInputChange('moveOutDate', e.target.value, setMoveOutDate)}
                        onBlur={() => handleBlur('moveOutDate')}
                        className={`w-full pl-10 pr-4 h-11 text-sm bg-white rounded-xl border transition-all duration-200 outline-none cursor-pointer ${
                          errors.moveOutDate && touched.moveOutDate
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10'
                        }`}
                      />
                    </div>
                    {errors.moveOutDate && touched.moveOutDate && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.moveOutDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stay Duration & Occupants */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Expected Duration
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full pl-10 pr-8 h-11 text-sm bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all duration-200 outline-none appearance-none cursor-pointer"
                      >
                        <option value="5-10">5 – 10 Days</option>
                        <option value="10-30">10 – 30 Days</option>
                        <option value="30-60">30 – 60 Days</option>
                        <option value="60-90">60 – 90 Days</option>
                        <option value="90-180">90 – 180 Days</option>
                        <option value="6mo+">6+ Months</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Adult Occupants
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full pl-10 pr-8 h-11 text-sm bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all duration-200 outline-none appearance-none cursor-pointer"
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Children (Under 18)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <select
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full pl-10 pr-8 h-11 text-sm bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all duration-200 outline-none appearance-none cursor-pointer"
                      >
                        <option value={0}>0 Children</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                        <option value={3}>3 Children</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floor and Amenities Quick Preferences */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsParking}
                      onChange={(e) => setNeedsParking(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Dedicated covered parking space</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPet}
                      onChange={(e) => setHasPet(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Traveling with service animal or pet</span>
                  </label>
                </div>
              </div>

              {/* SECTION 4: Additional Information */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    4. Additional Information & Special Requests
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Special Requests or Assignment Notes
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Arriving on evening flight; traveling with healthcare colleague; need quiet work desk; ground-floor preference for heavy luggage; etc."
                    className="w-full p-3.5 text-sm bg-white rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 transition-all duration-200 outline-none resize-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Action Buttons & Safety Footer */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 h-11 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Reservation Inquiry</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Your privacy is protected</span>
                  </div>
                  <span>•</span>
                  <span>Direct personal review by Bill & Marlena</span>
                  <span>•</span>
                  <span>No upfront payment or booking fee required</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
