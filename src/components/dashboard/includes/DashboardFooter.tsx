import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="mt-auto bg-[#faf8f5] border-t border-[#e6dfd5] py-5 px-4 sm:px-8 text-xs text-[#6e5f53]">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-bold text-[#282828]">Easy Travel Lodging LLC</span> · Furnished Residences &amp; Fleet Mobility
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[#5c5046]">
          <span>© {new Date().getFullYear()} Easy Travel Lodging</span>
          <span aria-hidden="true">·</span>
          <a href="tel:9168003295" className="hover:text-[#00897d] transition-colors tabular-nums">
            916-800-3295
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="mailto:easytravelagency@trustagent.space"
            className="hover:text-[#00897d] transition-colors"
          >
            easytravelagency@trustagent.space
          </a>
        </div>
      </div>
    </footer>
  );
};
