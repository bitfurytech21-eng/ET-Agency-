import React from 'react';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenBooking?: () => void;
  onOpenBrochure?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer id="main-footer" className="bg-[#1f1f1f] text-[#666666] py-5 border-t border-[#2d2d2d] text-center text-[12px]">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div id="footer-info">
          ©️ Copyright 2022 Easy Travel Lodging | All Rights Reserved | Website by{' '}
          <a
            href="https://thathelpfulchick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#999999] hover:text-[#00b7a8] transition-colors"
          >
            That Helpful Chick
          </a>{' '}
          |{' '}
          <button
            onClick={() => onNavClick('vehicles')}
            className="text-[#999999] hover:text-[#00b7a8] transition-colors cursor-pointer"
          >
            Fleet Rentals (3D)
          </button>{' '}
          |{' '}
          <button
            onClick={() => onNavClick('portal')}
            className="text-[#999999] hover:text-[#00b7a8] transition-colors cursor-pointer"
          >
            Client Sign In
          </button>{' '}
          |{' '}
          <button
            onClick={() => onNavClick('privacy')}
            className="text-[#999999] hover:text-[#00b7a8] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </footer>
  );
};
