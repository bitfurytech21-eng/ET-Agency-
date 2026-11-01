import React from 'react';
import { COMPANY_INFO } from '../data/lodgingData';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenBooking?: () => void;
  onOpenBrochure?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer id="main-footer" className="bg-[#1f1f1f] text-[#999999] py-8 border-t border-[#2d2d2d] text-[12px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <div className="text-stone-200 font-semibold">
            {COMPANY_INFO.name} · Furnished Residences &amp; Extended Stays
          </div>
          <div className="text-[#888888]">
            © {new Date().getFullYear()} Easy Travel Lodging. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
