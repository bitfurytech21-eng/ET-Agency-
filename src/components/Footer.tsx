import React from 'react';
import { COMPANY_INFO } from '../data/lodgingData';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenBooking?: () => void;
  onOpenBrochure?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer id="main-footer" className="bg-[#1f1f1f] text-[#999999] py-8 border-t border-[#2d2d2d] text-[12px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="space-y-1">
          <div className="text-stone-200 font-semibold">
            {COMPANY_INFO.name} · Furnished Residences &amp; Extended Stays
          </div>
          <div className="text-[#888888]">
            © {new Date().getFullYear()} Easy Travel Lodging. Furnished Residences &amp; Corporate Services Across California’s homes. All Rights Reserved.
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-[#b0a89f]">
          <button
            type="button"
            onClick={() => onNavClick('portfolio')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Residences
          </button>
          <button
            type="button"
            onClick={() => onNavClick('vehicles')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            3D Fleet
          </button>
          <button
            type="button"
            onClick={() => onNavClick('terms')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => onNavClick('privacy')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onNavClick('contact')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => onNavClick('dashboard')}
            className="hover:text-white transition-colors cursor-pointer font-medium text-[#4de0d2]"
          >
            Client Portal
          </button>
        </div>
      </div>
    </footer>
  );
};
