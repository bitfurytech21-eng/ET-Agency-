import React, { useState } from 'react';
import { AVAILABILITY_SCHEDULES, DateRange } from '../data/availabilityData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AvailabilityCalendarProps {
  propertyId: string;
  unitTitle: string;
  unitNumber: string;
  onSelectDates?: (startDate: string, durationDays: string) => void;
  compact?: boolean;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  propertyId,
  unitTitle,
  unitNumber,
  onSelectDates,
  compact = false
}) => {
  // Base date initialized dynamically from current date
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());
  
  // Selection state
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [hoveredEventInfo, setHoveredEventInfo] = useState<string | null>(null);

  const schedule = AVAILABILITY_SCHEDULES[propertyId] || {
    propertyId,
    unitNumber,
    code: '',
    currentStatus: 'Available Soon',
    nextAvailableDate: '2026-11-15',
    statusMessage: 'Check specific 30+ day availability',
    bookedRanges: []
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Quick jump month buttons (e.g., Nov 2026, Dec 2026, Jan 2027, Feb 2027, Mar 2027)
  const quickMonths = [
    { name: 'Nov 26', year: 2026, month: 10 },
    { name: 'Dec 26', year: 2026, month: 11 },
    { name: 'Jan 27', year: 2027, month: 0 },
    { name: 'Feb 27', year: 2027, month: 1 },
    { name: 'Mar 27', year: 2027, month: 2 },
    { name: 'Apr 27', year: 2027, month: 3 },
  ];

  // Helper to format Date into YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number): string => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Check day status
  const getDayStatus = (dateStr: string): { 
    type: 'past' | 'booked' | 'turnover' | 'available'; 
    label?: string;
  } => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr < todayStr) {
      return { type: 'past', label: 'Past Date' };
    }

    for (const range of schedule.bookedRanges) {
      if (dateStr >= range.start && dateStr <= range.end) {
        if (range.status === 'turnover') {
          return { type: 'turnover', label: range.label || 'Turnover / Sanitization' };
        }
        return { type: 'booked', label: range.label || 'Reserved / Occupied' };
      }
    }

    return { type: 'available', label: 'Available (30+ Day Stay)' };
  };

  // Generate calendar days
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Handle date click
  const handleDateClick = (dateStr: string) => {
    const status = getDayStatus(dateStr);
    if (status.type === 'past' || status.type === 'booked' || status.type === 'turnover') {
      setHoveredEventInfo(status.label || 'Date not available for move-in');
      return;
    }

    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Starting new selection
      setSelectedStart(dateStr);
      setSelectedEnd(null);
      setHoveredEventInfo('Move-in date selected! Now select your estimated move-out date (30+ days).');
    } else {
      // Setting end date
      if (dateStr <= selectedStart) {
        setSelectedStart(dateStr);
        setSelectedEnd(null);
      } else {
        // Check if any date in between is booked
        let hasOverlap = false;
        const cur = new Date(selectedStart);
        const end = new Date(dateStr);
        while (cur <= end) {
          const checkStr = cur.toISOString().split('T')[0];
          const st = getDayStatus(checkStr);
          if (st.type === 'booked' || st.type === 'turnover') {
            hasOverlap = true;
            break;
          }
          cur.setDate(cur.getDate() + 1);
        }

        if (hasOverlap) {
          setHoveredEventInfo('The chosen range overlaps with an existing booking. Please pick dates within an open block.');
        } else {
          setSelectedEnd(dateStr);
        }
      }
    }
  };

  // Calculate days count
  const calculateDays = () => {
    if (!selectedStart || !selectedEnd) return 0;
    const s = new Date(selectedStart);
    const e = new Date(selectedEnd);
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const selectedDaysCount = calculateDays();
  const meetsMinimumStay = selectedDaysCount >= 30;

  const handleApplySelection = () => {
    if (selectedStart && onSelectDates) {
      const durationLabel = selectedDaysCount >= 90 ? '90-180' : selectedDaysCount >= 60 ? '60-90' : '30-60';
      onSelectDates(selectedStart, durationLabel);
    }
  };

  return (
    <div className="bg-white border border-[#e6dfd5] shadow-xs text-left overflow-hidden rounded-lg">
      {/* Top Header / Real-time Status Banner */}
      <div className="bg-[#faf8f5] border-b border-[#e6dfd5] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00b7a8]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#00b7a8]">
              Live Availability
            </span>
            <span className="text-xs text-[#857568]">•</span>
            <span className="text-xs font-semibold text-[#5c5046]">
              {schedule.unitNumber} ({schedule.code})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#282828] font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00b7a8] shrink-0" />
            <span>{schedule.statusMessage}</span>
          </p>
        </div>

        {/* Quick Month Selector Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {quickMonths.map((qm) => {
            const isActive = currentYear === qm.year && currentMonth === qm.month;
            return (
              <button
                key={qm.name}
                onClick={() => {
                  setCurrentYear(qm.year);
                  setCurrentMonth(qm.month);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#00b7a8] text-white shadow-xs'
                    : 'bg-[#f2ece4] text-[#5c5046] hover:bg-[#e6dfd5]'
                }`}
              >
                {qm.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Month Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h4 className="font-heading font-bold text-lg sm:text-xl text-[#282828]">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            <span className="text-xs text-[#857568] hidden sm:inline">
              (Stays of 30 days or more)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 border border-[#dfd7cc] text-[#5c5046] hover:text-[#282828] hover:border-[#82634f] transition-colors cursor-pointer rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 border border-[#dfd7cc] text-[#5c5046] hover:text-[#282828] hover:border-[#82634f] transition-colors cursor-pointer rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-[#e6dfd5] rounded-xs overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 bg-[#faf8f5] border-b border-[#e6dfd5] text-center text-[11px] font-bold text-[#5c5046] uppercase py-2">
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-px bg-[#e6dfd5]">
            {/* Blank offset days */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-[#fcfaf7] min-h-[46px] sm:min-h-[58px]" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = formatDateString(currentYear, currentMonth, day);
              const status = getDayStatus(dateStr);
              
              // Selection logic
              const isStart = selectedStart === dateStr;
              const isEnd = selectedEnd === dateStr;
              const isInRange =
                selectedStart &&
                selectedEnd &&
                dateStr > selectedStart &&
                dateStr < selectedEnd;
              const isHovered =
                selectedStart &&
                !selectedEnd &&
                hoverDate &&
                dateStr > selectedStart &&
                dateStr <= hoverDate;

              let cellBg = 'bg-white';
              let textStyle = 'text-slate-800 font-medium';
              let cursorStyle = 'cursor-pointer hover:bg-teal-50';
              let statusPill = null;

              if (status.type === 'past') {
                cellBg = 'bg-[#fafafa]';
                textStyle = 'text-slate-300';
                cursorStyle = 'cursor-not-allowed';
              } else if (status.type === 'booked') {
                cellBg = 'bg-rose-50/70';
                textStyle = 'text-rose-900 font-semibold';
                cursorStyle = 'cursor-not-allowed';
                statusPill = (
                  <span className="text-[9px] font-semibold text-rose-600 block truncate mt-0.5 sm:mt-1">
                    Booked
                  </span>
                );
              } else if (status.type === 'turnover') {
                cellBg = 'bg-amber-50/80';
                textStyle = 'text-amber-900 font-semibold';
                cursorStyle = 'cursor-not-allowed';
                statusPill = (
                  <span className="text-[9px] font-semibold text-amber-600 block truncate mt-0.5 sm:mt-1">
                    Turnover
                  </span>
                );
              } else if (status.type === 'available') {
                cellBg = 'bg-white hover:bg-[#e6f8f6]';
                textStyle = 'text-emerald-950 font-semibold';
                statusPill = (
                  <span className="text-[9px] font-semibold text-[#00b7a8] block truncate mt-0.5 sm:mt-1">
                    Open
                  </span>
                );
              }

              // Selected styling override
              if (isStart || isEnd) {
                cellBg = 'bg-[#00b7a8] text-white';
                textStyle = 'text-white font-bold';
                statusPill = (
                  <span className="text-[9px] font-bold text-white block truncate mt-0.5 sm:mt-1">
                    {isStart ? 'Move-In' : 'Move-Out'}
                  </span>
                );
              } else if (isInRange || isHovered) {
                cellBg = 'bg-[#d8f5f2]';
                textStyle = 'text-teal-900 font-semibold';
              }

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(dateStr)}
                  onMouseEnter={() => {
                    setHoverDate(dateStr);
                    if (status.label) setHoveredEventInfo(status.label);
                  }}
                  onMouseLeave={() => {
                    setHoverDate(null);
                    setHoveredEventInfo(null);
                  }}
                  className={`min-h-[46px] sm:min-h-[58px] p-1.5 flex flex-col justify-between transition-colors relative ${cellBg} ${cursorStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${textStyle}`}>{day}</span>
                    {status.type === 'available' && !isStart && !isEnd && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00b7a8] shrink-0" />
                    )}
                  </div>
                  {statusPill}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[#5c5046] border-t border-[#efe9e0]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#00b7a8]" />
              <span className="font-medium text-[#5c5046]">Available Date</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-200 border border-rose-300" />
              <span className="font-medium text-[#5c5046]">Occupied / Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-200 border border-amber-300" />
              <span className="font-medium text-[#5c5046]">Cleaning &amp; Inspection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#e6dfd5]" />
              <span className="font-medium text-[#857568]">Past</span>
            </div>
          </div>

          <div className="text-[11px] text-[#857568] font-medium italic">
            * Minimum booking: 30 consecutive days
          </div>
        </div>

        {/* Date Selection Details & Action Bar */}
        {selectedStart && (
          <div className="p-4 bg-[#f4fbfa] border border-[#bfece7] space-y-3 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#00b7a8]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#282828]">
                    Selected Stay Window
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#282828]">
                  <span>Move-In: <strong className="text-[#00b7a8]">{selectedStart}</strong></span>
                  {selectedEnd ? (
                    <span> → Move-Out: <strong className="text-[#00b7a8]">{selectedEnd}</strong> ({selectedDaysCount} Nights)</span>
                  ) : (
                    <span className="text-[#857568] font-normal ml-2">
                      (Click an end date to finalize your stay period)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedStart(null);
                    setSelectedEnd(null);
                  }}
                  className="px-3 py-2 text-xs text-[#5c5046] hover:text-[#282828] border border-[#dfd7cc] bg-white cursor-pointer"
                >
                  Clear
                </button>

                <button
                  onClick={handleApplySelection}
                  disabled={selectedEnd ? !meetsMinimumStay : false}
                  className={`et_pb_button text-xs py-2 px-5 cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedEnd && !meetsMinimumStay
                      ? 'bg-[#dfd7cc] text-[#857568] cursor-not-allowed'
                      : 'et_pb_button_teal'
                  }`}
                >
                  <span>Reserve These Dates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {selectedEnd && !meetsMinimumStay && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>
                  The selected duration is {selectedDaysCount} nights. Easy Travel Lodging requires stays of <strong>30 days or more</strong> for traveling professionals.
                </span>
              </div>
            )}

            {selectedEnd && meetsMinimumStay && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Qualifies for nationwide corporate housing rates ($0 utilities, 400+ Mbps WiFi, dedicated parking included).
                </span>
              </div>
            )}
          </div>
        )}

        {/* Hover / Status Note */}
        {hoveredEventInfo && !selectedStart && (
          <div className="text-xs text-[#5c5046] bg-[#faf8f5] p-2.5 border border-[#e6dfd5] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00b7a8] shrink-0" />
            <span>{hoveredEventInfo}</span>
          </div>
        )}
      </div>
    </div>
  );
};
