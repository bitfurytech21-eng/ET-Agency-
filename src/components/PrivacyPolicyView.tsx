import React from 'react';
import { PRIVACY_POLICY_TEXT, COMPANY_INFO } from '../data/lodgingData';
import { ShieldCheck, Lock, Phone, Mail } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 text-left">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            Legal & Data Protection
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">

          <div className="space-y-3">
            <h3 className="font-heading font-bold text-slate-900 text-base">
              It will notify you of the following:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>What information we collect;</li>
              <li>With whom it is shared;</li>
              <li>How it can be corrected;</li>
              <li>How it is secured;</li>
              <li>How policy changes will be communicated; and</li>
              <li>How to address concerns over misuse of personal data.</li>
            </ul>
          </div>

          {PRIVACY_POLICY_TEXT.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2 pt-4 border-t border-slate-100">
              <h2 className="font-heading font-black text-lg text-slate-900">
                {sec.title}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {sec.content}
              </p>
            </div>
          ))}

          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
            <h3 className="font-heading font-bold text-base text-white">
              Questions or Concerns Regarding Your Privacy?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you feel that we are not abiding by this privacy policy, you should contact us immediately:
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
              <a
                href={`tel:${COMPANY_INFO.phoneClean}`}
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <span className="text-slate-600">•</span>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{COMPANY_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
