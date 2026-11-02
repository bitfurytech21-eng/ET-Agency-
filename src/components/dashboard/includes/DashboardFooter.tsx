import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 py-4 px-4 sm:px-8 type-support text-slate-500">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-semibold text-[#0f172a]">Easy Travel Lodging LLC</span> · Furnished Residences &amp; Executive Car Rentals
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span className="tabular-nums">© {new Date().getFullYear()} All Rights Reserved</span>
          <span aria-hidden="true">·</span>
          <a href="mailto:easytravelagency@trustagent.space" className="type-nav hover:text-[#14616d] transition-colors">
            Direct Concierge Desk
          </a>
        </div>
      </div>
    </footer>
  );
};
