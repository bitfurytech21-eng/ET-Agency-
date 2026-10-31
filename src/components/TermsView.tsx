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
  CheckCircle2, 
  Download, 
  Printer, 
  FileCheck
} from 'lucide-react';

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
    <div className="py-12 sm:py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5 text-slate-700" />
            Clear Expectations & House Guidelines
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Terms, Conditions & House Rules
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            House rules set transparent expectations with guests from the start. Basically, we expect you to treat our home and apartment as well, if not better, than your own home.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Print House Rules</span>
            </button>
          </div>
        </div>

        {/* Core Notice Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-4 shadow-xs">
          <ShieldCheck className="w-7 h-7 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sky-950 text-sm">
            <h3 className="font-heading font-bold text-base text-sky-900">
              Community Standard & Background Screening Notice
            </h3>
            <p className="leading-relaxed">
              All applicants are required to pay for and complete a standard background check. Once the background check for your midterm rental application has yielded satisfactory results, your reservation will be officially approved.
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
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <IconComp className="w-6 h-6 text-sky-600" />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Rule 0{idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      rule.strictness === 'Strict'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {rule.strictness}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {rule.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Confirmation Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-heading font-black text-white">
            Ready to Reserve Your Turnkey Midterm Rental?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            By booking with Easy Travel Lodging, you are joining a respectful, quiet community of traveling medical personnel, tech executives, and corporate assignees.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              Start Application / Check Vacancies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
