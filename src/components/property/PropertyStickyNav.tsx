import React, { useEffect, useState } from 'react';

export interface PropertySectionNavItem {
  id: string;
  label: string;
}

interface PropertyStickyNavProps {
  sections: PropertySectionNavItem[];
  onQuickReserve?: () => void;
  monthlyRate: number;
}

export const PropertyStickyNav: React.FC<PropertyStickyNavProps> = ({
  sections,
  onQuickReserve,
  monthlyRate,
}) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || 'section-about');

  useEffect(() => {
    if (sections.length === 0) return;

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-110px 0px -60% 0px',
        threshold: [0, 0.15, 0.4],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const handleJump = (sectionId: string) => {
    setActiveId(sectionId);
    const el = document.getElementById(sectionId);
    if (!el) return;
    const headerOffset = 92;
    const elementTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, elementTop - headerOffset),
      behavior: 'smooth',
    });
  };

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-y border-[#e6dfd5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        <nav
          aria-label="Property detail sections"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1"
        >
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleJump(sec.id)}
                className={`type-nav py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#00897d] text-[#1b1d20] font-semibold'
                    : 'border-transparent text-[#5c5046] hover:text-[#1b1d20]'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </nav>

        {onQuickReserve && (
          <div className="hidden md:flex items-center gap-4 shrink-0 py-2">
            <span className="type-support text-[#5c5046] tabular-nums">
              <strong className="font-semibold text-[#1b1d20]">${monthlyRate.toLocaleString()}</strong> / month
            </span>
            <button
              type="button"
              onClick={onQuickReserve}
              className="type-btn px-4 py-2 rounded-lg bg-[#00b7a8] hover:bg-[#009b8e] text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Check Availability
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
