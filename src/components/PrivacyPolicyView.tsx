import React from 'react';
import { PRIVACY_POLICY_TEXT, COMPANY_INFO } from '../data/lodgingData';
import { ShieldCheck, Phone, Mail } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="bg-[#faf8f5]">
      {/* Live Realistic Courtyard Header */}
      <section className="relative overflow-hidden py-14 sm:py-20 px-4 text-center text-white border-b border-[#3a2f28]">
        <LivePhotoBackground scene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[#4de0d2] type-support font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#4de0d2]" />
            <span>Legal &amp; Data Protection</span>
          </div>

          <h1 className="type-h1 text-white">
            Privacy Policy
          </h1>
          <p className="type-body-lg text-[#ede5dc] max-w-2xl mx-auto">
            This Privacy Policy explains how Easy Travel Lodging collects, uses, safeguards, and manages information shared through our website, shopping cart checkout, reservation forms, and client portal.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10 text-left">
        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e6dfd5] shadow-2xs space-y-8 text-[#4a3e35] type-body">
          <div className="space-y-3">
            <h3 className="type-h3 text-[#282828]">
              Summary of Our Privacy Commitments
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-[#5c5046] type-body">
              <li>What personal, reservation, and billing information we collect;</li>
              <li>How information is used strictly to fulfill stays, fleet rentals, and guest support;</li>
              <li>How you can review, update, or request deletion of your records;</li>
              <li>How online cart orders, payment references, and portal sessions are protected; and</li>
              <li>How to contact our hosts directly with any privacy questions.</li>
            </ul>
          </div>

          {PRIVACY_POLICY_TEXT.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2.5 pt-6 border-t border-[#efe9e0]">
              <h2 className="type-h3 text-[#282828]">
                {sec.title}
              </h2>
              <p className="text-[#5c5046] type-body whitespace-pre-line">
                {sec.content}
              </p>
            </div>
          ))}

          <div className="relative overflow-hidden p-6 sm:p-8 text-white rounded-2xl border border-[#3a2f28]">
            <LivePhotoBackground scene="twilight" overlay="espresso" />
            <div className="relative z-10 space-y-3">
              <h3 className="type-h4 text-white">
                Questions or Concerns Regarding Your Privacy?
              </h3>
              <p className="type-support text-[#ede5dc]">
                If you feel that we are not abiding by this privacy policy, you should contact us immediately:
              </p>
              <div className="flex flex-wrap items-center gap-4 type-btn pt-1">
                <a
                  href={`tel:${COMPANY_INFO.phoneClean}`}
                  className="flex items-center gap-1.5 text-[#4de0d2] hover:text-white transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4" />
                  <span>{COMPANY_INFO.phone}</span>
                </a>
                <span className="text-white/40" aria-hidden="true">·</span>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-center gap-1.5 text-[#4de0d2] hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
