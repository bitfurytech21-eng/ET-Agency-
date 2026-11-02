import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
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
  ChevronDown,
  Info,
  Printer
} from 'lucide-react';
import { PROPERTIES, PropertyListing } from '../data/lodgingData';
import { LivePhotoBackground } from './LivePhotoBackground';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPropertyId?: string;
  initialMoveInDate?: string;
  initialDuration?: string;
  properties?: PropertyListing[];
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
  properties,
}) => {
  const availableProps = properties?.length ? properties : PROPERTIES;
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
  const [floorPreference] = useState<'any' | 'downstairs' | 'upstairs'>('any');
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

  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialPropertyId) setSelectedPropertyId(initialPropertyId);
      if (initialMoveInDate) setMoveInDate(initialMoveInDate);
      if (initialDuration) setDuration(initialDuration);
      setSubmitError(null);
      setBookingSuccessData(null);

      const storedToken = localStorage.getItem('etl_php_token');
      if (storedToken) {
        fetch('/api/auth/customer/session', {
          method: 'GET',
          headers: { Authorization: `Bearer ${storedToken}` },
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.success && data.customer) {
              setName((prev) => prev || data.customer.name || '');
              setEmail((prev) => prev || data.customer.email || '');
              setPhone((prev) => prev || data.customer.phone || '');
              setCompany((prev) => prev || data.customer.company || '');
              setRole((prev) => prev || data.customer.role || '');
            }
          })
          .catch(() => {});
      }
    }
  }, [isOpen, initialPropertyId, initialMoveInDate, initialDuration]);

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

  const currentProperty = useMemo(() => {
    if (selectedPropertyId === 'any') return null;
    return availableProps.find((p) => p.id === selectedPropertyId) || null;
  }, [selectedPropertyId, availableProps]);

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
      case 'role':
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

      const notesParts = [
        `Employer/Agency: ${company}`,
        `Role: ${role}`,
        `Duration Requested: ${duration}`,
        `Floor Preference: ${floorPreference}`,
        hasPet ? 'Traveling with Pet' : 'No Pets',
        needsParking ? 'Dedicated Parking Requested' : 'No Parking Needed',
        specialRequests ? `Special Requests: ${specialRequests}` : null,
      ].filter(Boolean);

      const activeToken = localStorage.getItem('etl_php_token');
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
        customerToken: activeToken || undefined,
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (activeToken) {
        headers.Authorization = `Bearer ${activeToken}`;
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers,
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
      const message = err instanceof Error ? err.message : 'Network submission error.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1c1613]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#e6dfd5] text-left overflow-hidden relative"
      >
        {/* Modal Header with Live Realistic Interior Photo */}
        <div className="relative overflow-hidden px-6 sm:px-8 py-6 border-b border-[#3a2f28] text-white shrink-0">
          <LivePhotoBackground scene="interior" secondaryScene="courtyard" overlay="espresso" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="type-support font-semibold text-[#4de0d2]">
                Custom Stay &amp; Availability Inquiry
              </div>
              <h2 className="type-h3 text-white">
                Plan Your Stay With Bill &amp; Marlena
              </h2>
              <p className="type-support text-[#ede5dc] max-w-xl">
                Share your preferred dates and household or travel needs below. We personally review every request within 12–24 hours to confirm availability, short- or extended-stay rates, and arrival details.
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 sm:p-2.5 rounded-xl text-[#ede5dc] hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-[#fcfaf7]">
          {bookingSuccessData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-[#e8f8f6] border border-[#b8ebe5] text-[#00897d] rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-9 h-9 text-[#00897d]" />
              </div>

              <div className="space-y-2">
                <span className="type-support font-semibold text-[#00897d] block">
                  Inquiry Dispatched Successfully
                </span>
                <h3 className="type-h3 text-[#282828]">
                  Thank You, {bookingSuccessData.guestName}!
                </h3>
                <p className="type-body text-[#5c5046] max-w-lg mx-auto">
                  Your reservation inquiry has been transmitted directly to agency founders <strong className="font-semibold text-[#282828]">Bill &amp; Marlena</strong>. A confirmation email has been dispatched to <strong className="font-semibold text-[#282828]">{bookingSuccessData.email}</strong>.
                </p>
              </div>

              {/* Booking Reference & Details Card */}
              <div className="bg-white border border-[#e6dfd5] rounded-2xl p-5 sm:p-6 text-left max-w-lg mx-auto space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
                  <span className="type-support font-semibold text-[#6e5f53]">
                    Inquiry Reference
                  </span>
                  <span className="font-mono text-sm font-semibold text-[#00897d] tabular-nums bg-[#e8f8f6] px-2.5 py-0.5 rounded-lg border border-[#b8ebe5]">
                    {bookingSuccessData.reference}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 type-support tabular-nums">
                  <div>
                    <span className="text-[#857568] block font-medium">Selected Unit</span>
                    <span className="text-[#282828] font-semibold mt-0.5 block truncate">
                      {bookingSuccessData.propertyName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#857568] block font-medium">Contact Email</span>
                    <span className="text-[#282828] font-semibold mt-0.5 block truncate">
                      {bookingSuccessData.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#857568] block font-medium">Check-In Date</span>
                    <span className="text-[#282828] font-semibold mt-0.5 block">
                      {bookingSuccessData.checkIn}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#857568] block font-medium">Estimated Check-Out</span>
                    <span className="text-[#282828] font-semibold mt-0.5 block">
                      {bookingSuccessData.checkOut}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#efe9e0] flex items-start gap-2.5 type-support text-[#5c5046]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    No charges apply now. Rates and terms will be sent for your approval before signing.
                  </span>
                </div>
              </div>

              {/* Next Steps Guidance */}
              <div className="max-w-lg mx-auto text-left bg-[#f5efe8] border border-[#dfd3c5] rounded-xl p-4 type-support text-[#3d2e24] space-y-1.5">
                <span className="font-semibold flex items-center gap-1.5 text-[#282828]">
                  <Info className="w-4 h-4 text-[#00897d]" /> What Happens Next?
                </span>
                <p className="text-[#5c5046]">
                  1. Bill &amp; Marlena review your requested dates and suite preferences.<br />
                  2. You will receive an availability confirmation and written quote within 12–24 hours.<br />
                  3. For immediate questions, call or text us at <strong className="font-semibold tabular-nums">916-800-3295</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl border border-[#d8cfc3] text-[#5c5046] hover:bg-[#f4efe9] type-btn flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <Printer className="w-4 h-4" /> Print Summary
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-xl bg-[#82634f] hover:bg-[#6e5240] text-white type-btn shadow-2xs cursor-pointer transition-colors whitespace-nowrap"
                >
                  Close &amp; Return
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {submitError && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 type-support flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold">Notice during submission:</span>
                    <p className="text-amber-800">{submitError}</p>
                    <p className="text-amber-700">Your details are saved in the form above so you can retry or call us directly.</p>
                  </div>
                </div>
              )}

              {/* SECTION 1: Guest Information */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#e6dfd5]">
                  <div className="w-6 h-6 rounded-lg bg-[#e8f8f6] text-[#00897d] flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="type-h4 text-[#282828]">
                    1. Guest Information
                  </h3>
                </div>

                <div>
                  <label className="block type-label text-[#282828] mb-1.5">
                    Full Name <span className="text-[#00897d] font-semibold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="guestName"
                      value={name}
                      onChange={(e) => handleInputChange('name', e.target.value, setName)}
                      onBlur={() => handleBlur('name')}
                      placeholder="e.g. Amanda Clark"
                      className={`w-full pl-10 pr-4 h-11 text-base bg-white text-[#282828] rounded-xl border transition-all duration-200 outline-none ${
                        errors.name && touched.name
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                          : 'border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12'
                      }`}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="type-support text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Email Address <span className="text-[#00897d] font-semibold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="guestEmail"
                        value={email}
                        onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                        onBlur={() => handleBlur('email')}
                        placeholder="amanda@example.com"
                        className={`w-full pl-10 pr-4 h-11 text-base bg-white text-[#282828] rounded-xl border transition-all duration-200 outline-none ${
                          errors.email && touched.email
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12'
                        }`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="type-support text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Phone Number <span className="text-[#00897d] font-semibold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="guestPhone"
                        value={phone}
                        onChange={(e) => handleInputChange('phone', e.target.value, setPhone)}
                        onBlur={() => handleBlur('phone')}
                        placeholder="(916) 555-0182"
                        className={`w-full pl-10 pr-4 h-11 text-base bg-white text-[#282828] rounded-xl border transition-all duration-200 outline-none ${
                          errors.phone && touched.phone
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12'
                        }`}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="type-support text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Stay Context (Optional) */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#e6dfd5]">
                  <div className="w-6 h-6 rounded-lg bg-[#f5efe8] text-[#82634f] flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="type-h4 text-[#282828]">
                    2. Household, Relocation, or Organization Details (Optional)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Organization, Company, or Insurance Carrier
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="employer"
                        value={company}
                        onChange={(e) => handleInputChange('company', e.target.value, setCompany)}
                        placeholder="Optional (e.g. Personal Stay, Relocation, Company)"
                        className="w-full pl-10 pr-4 h-11 text-base bg-white text-[#282828] rounded-xl border border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12 transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Reason for Visit or Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="role"
                        value={role}
                        onChange={(e) => handleInputChange('role', e.target.value, setRole)}
                        placeholder="Optional (e.g. Family Visit, Home Remodel, Project)"
                        className="w-full pl-10 pr-4 h-11 text-base bg-white text-[#282828] rounded-xl border border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12 transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Accommodation Preferences */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#e6dfd5]">
                  <div className="w-6 h-6 rounded-lg bg-[#e8f8f6] text-[#00897d] flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="type-h4 text-[#282828]">
                    3. Residence &amp; Schedule Preferences
                  </h3>
                </div>

                <div>
                  <label className="block type-label text-[#282828] mb-1.5">
                    Preferred Residence
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                      <Home className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(e.target.value)}
                      className="w-full pl-10 pr-10 h-11 text-base bg-white text-[#282828] rounded-xl border border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12 transition-all duration-200 outline-none appearance-none cursor-pointer"
                    >
                      <option value="any">Any Available Residence (Best Match)</option>
                      {availableProps.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.unitNumber} ({p.code}) · {p.title} - ${p.monthlyRate}/mo
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#857568]">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  {currentProperty && (
                    <div className="mt-2 p-2.5 bg-white border border-[#e6dfd5] rounded-xl flex items-center justify-between type-support text-[#5c5046] tabular-nums">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#282828]">{currentProperty.unitNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{currentProperty.floor}</span>
                        <span aria-hidden="true">·</span>
                        <span>{currentProperty.bedrooms} Bed / {currentProperty.bathrooms} Bath</span>
                      </div>
                      <span className="font-semibold text-[#00897d]">${currentProperty.monthlyRate}/month</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Estimated Move-In Date <span className="text-[#00897d] font-semibold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        min={todayStr}
                        value={moveInDate}
                        onChange={(e) => handleInputChange('moveInDate', e.target.value, setMoveInDate)}
                        onBlur={() => handleBlur('moveInDate')}
                        className={`w-full pl-10 pr-4 h-11 text-base bg-white text-[#282828] rounded-xl border transition-all duration-200 outline-none cursor-pointer tabular-nums ${
                          errors.moveInDate && touched.moveInDate
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12'
                        }`}
                      />
                    </div>
                    {errors.moveInDate && touched.moveInDate && (
                      <p className="type-support text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.moveInDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Estimated Move-Out Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        min={moveInDate || todayStr}
                        value={moveOutDate}
                        onChange={(e) => handleInputChange('moveOutDate', e.target.value, setMoveOutDate)}
                        onBlur={() => handleBlur('moveOutDate')}
                        className={`w-full pl-10 pr-4 h-11 text-base bg-white text-[#282828] rounded-xl border transition-all duration-200 outline-none cursor-pointer tabular-nums ${
                          errors.moveOutDate && touched.moveOutDate
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/10'
                            : 'border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12'
                        }`}
                      />
                    </div>
                    {errors.moveOutDate && touched.moveOutDate && (
                      <p className="type-support text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.moveOutDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Expected Duration
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full pl-10 pr-8 h-11 text-base bg-white text-[#282828] rounded-xl border border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] transition-all duration-200 outline-none appearance-none cursor-pointer"
                      >
                        <option value="5-10">5 – 10 Days</option>
                        <option value="10-30">10 – 30 Days</option>
                        <option value="30-60">30 – 60 Days</option>
                        <option value="60-90">60 – 90 Days</option>
                        <option value="90-180">90 – 180 Days</option>
                        <option value="6mo+">6+ Months</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#857568]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Adult Occupants
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Users className="w-4 h-4" />
                      </div>
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full pl-10 pr-8 h-11 text-base bg-white text-[#282828] rounded-xl border border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] transition-all duration-200 outline-none appearance-none cursor-pointer"
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#857568]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">
                      Children (Under 18)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#857568]">
                        <Users className="w-4 h-4" />
                      </div>
                      <select
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full pl-10 pr-8 h-11 text-base bg-white text-[#282828] rounded-xl border border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] transition-all duration-200 outline-none appearance-none cursor-pointer"
                      >
                        <option value={0}>0 Children</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                        <option value={3}>3 Children</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#857568]">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 type-support font-medium text-[#3d352e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsParking}
                      onChange={(e) => setNeedsParking(e.target.checked)}
                      className="w-4 h-4 accent-[#00b7a8] rounded-md border-[#d8cfc3] cursor-pointer"
                    />
                    <span>Dedicated covered parking space</span>
                  </label>

                  <label className="flex items-center gap-2 type-support font-medium text-[#3d352e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPet}
                      onChange={(e) => setHasPet(e.target.checked)}
                      className="w-4 h-4 accent-[#00b7a8] rounded-md border-[#d8cfc3] cursor-pointer"
                    />
                    <span>Traveling with service animal or pet</span>
                  </label>
                </div>
              </div>

              {/* SECTION 4: Additional Information */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#e6dfd5]">
                  <div className="w-6 h-6 rounded-lg bg-[#f5efe8] text-[#82634f] flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="type-h4 text-[#282828]">
                    4. Additional Information &amp; Special Requests
                  </h3>
                </div>

                <div>
                  <label className="block type-label text-[#282828] mb-1.5">
                    Special Requests or Stay Notes
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Arriving on evening flight; ground-floor preference; quiet workspace needs; or vehicle rental pairing..."
                    className="w-full p-3.5 text-base bg-white text-[#282828] rounded-xl border border-[#d8cfc3] hover:border-[#bcae9d] focus:border-[#00b7a8] focus:ring-3 focus:ring-[#00b7a8]/12 transition-all duration-200 outline-none resize-none placeholder:text-[#9c8d80]"
                  />
                </div>
              </div>

              {/* Action Buttons & Safety Footer */}
              <div className="pt-4 border-t border-[#e6dfd5] space-y-3">
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 h-11 border border-[#d8cfc3] hover:border-[#bcae9d] text-[#5c5046] hover:text-[#282828] hover:bg-[#f4efe9] type-btn rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 h-11 bg-[#00b7a8] hover:bg-[#009e91] active:bg-[#00897d] disabled:opacity-60 text-white type-btn rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap"
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

                <div className="flex flex-wrap items-center justify-center gap-3 type-support text-[#6e5f53] pt-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00897d]" />
                    <span>Your privacy is protected</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span>Direct personal review by Bill &amp; Marlena</span>
                  <span aria-hidden="true">·</span>
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
