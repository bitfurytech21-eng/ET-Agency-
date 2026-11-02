import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="mt-auto bg-[#faf8f5] border-t border-[#e6dfd5] py-4 px-4 sm:px-8 text-xs text-[#857568]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-bold text-[#282828]">Easy Travel Lodging LLC</span> · Nationwide Turnkey Furnished Housing &amp; 3D Fleet Dispatch
        </div>
        <div className="flex items-center gap-4 text-[#5c5046]">
          <span>© {new Date().getFullYear()} All Rights Reserved</span>
          <span>•</span>
          <span>UserDashboard v2.5.0</span>
          <span>•</span>
          <a href="mailto:easytravelagency@trustagent.space" className="hover:text-[#00b7a8]">
            Direct Concierge Desk
          </a>
        </div>
      </div>
    </footer>
  );
};
