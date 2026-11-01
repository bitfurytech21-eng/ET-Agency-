import React from 'react';
import { HOUSE_RULES } from '../data/lodgingData';
import { 
  ShieldCheck, 
  PawPrint, 
  Users, 
  CigaretteOff, 
  Ban, 
  VolumeX, 
  Clock, 
  UserPlus, 
  CameraOff, 
  Lock, 
  Printer, 
  FileCheck
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface TermsViewProps {
  onOpenBooking: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onOpenBooking }) => {
  const iconMap: Record<string, any> = {
    ShieldCheck,
    PawPrint,
    Users,
    CigaretteOff,
    Ban,
    VolumeX,
    Clock,
    UserPlus,
    CameraOff,
    Lock
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#faf8f5]">
      {/* Live Realistic Interior Header */}
      <section className="relative overflow-hidden py-14 sm:py-20 px-4 text-center text-white border-b border-[#3a2f28]">
        <LivePhotoBackground scene="interior" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[#4de0d2] text-xs font-bold uppercase tracking-widest">
            <FileCheck className="w-4 h-4 text-[#4de0d2]" />
            <span>Community Standards &amp; Guest Guidelines</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight text-balance">
            Terms, Conditions &amp; House Rules
          </h1>

          <p className="text-[#ede5dc] text-base sm:text-lg leading-relaxed">
            Transparent expectations protect the comfort, safety, and quiet enjoyment of every guest. We simply ask that you care for your furnished residence and shared community spaces with the same respect you give your own home.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#282828] text-xs font-bold hover:bg-[#faf8f5] transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#00b7a8]" />
              <span>Print House Rules</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Core Notice Box (Warm Taupe / Sand — Zero Sky Blue) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#f5efe8] border border-[#dfd3c5] flex items-start gap-4 shadow-2xs">
          <ShieldCheck className="w-7 h-7 text-[#00897d] shrink-0 mt-0.5" />
          <div className="space-y-1 text-[#3d2e24] text-sm">
            <h3 className="font-heading font-bold text-base text-[#282828]">
              Identity Verification &amp; Extended-Stay Screening
            </h3>
            <p className="leading-relaxed text-[#5c5046]">
              Short-stay reservations require government-issued photo ID verification prior to keyless check-in. Guests booking 30+ day extended leases complete a standard residential background screening prior to lease countersignature so our community remains safe and peaceful for everyone.
            </p>
          </div>
        </div>

        {/* 10 House Rules Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HOUSE_RULES.map((rule, idx) => {
            const IconComp = iconMap[rule.icon] || ShieldCheck;
            return (
              <div
                key={rule.id}
                className="bg-white rounded-2xl border border-[#e6dfd5] p-6 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#faf8f5] border border-[#ebe4da] flex items-center justify-center shrink-0">
                  <IconComp className="w-6 h-6 text-[#00b7a8]" />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
                    <span className="text-[#857568] tabular-nums">
                      0{idx + 1 < 10 ? idx + 1 : ''}{idx + 1 >= 10 ? idx + 1 : ''} · Guideline
                    </span>
                    <span className={rule.strictness === 'Strict' ? 'text-rose-600 font-bold' : 'text-[#82634f]'}>
                      {rule.strictness} Policy
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#282828]">
                    {rule.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5c5046] leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Confirmation Card with Live Realistic Courtyard Photo */}
        <div className="relative overflow-hidden text-white rounded-3xl p-8 sm:p-10 border border-[#3a2f28] text-center shadow-xl">
          <LivePhotoBackground scene="courtyard" overlay="espresso" />
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-heading font-black text-white">
              Ready to Plan Your Stay Across California’s homes?
            </h3>
            <p className="text-[#ede5dc] text-sm max-w-xl mx-auto leading-relaxed">
              By reserving with Easy Travel Lodging, you join a quiet, well-cared-for residential community shared by families, relocating homeowners, visiting guests, and extended-stay residents.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Check Residence Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
