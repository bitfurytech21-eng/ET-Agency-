import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AVAILABILITY_SCHEDULES } from '../data/availabilityData';
import { BlockedDateRange } from '../data/propertyEnrichment';
import {
  AlertCircle,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
} from 'lucide-react';

interface AvailabilityCalendarProps {
  propertyId: string;
  unitTitle: string;
  unitNumber: string;
  minimumStayDays?: number;
  maximumStayDays?: number;
  externalBlockedRanges?: BlockedDateRange[];
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  onSelectDateRange?: (checkIn: string, checkOut: string, nights: number) => void;
  onSelectDates?: (startDate: string, durationDays: string) => void;
  compact?: boolean;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  propertyId,
  unitNumber,
  minimumStayDays = 5,
  maximumStayDays = 365,
  externalBlockedRanges,
  selectedCheckIn,
  selectedCheckOut,
  onSelectDateRange,
  onSelectDates,
}) => {
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());

  const [selectedStart, setSelectedStart] = useState<string | null>(selectedCheckIn || null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(selectedCheckOut || null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [hoveredEventInfo, setHoveredEventInfo] = useState<string | null>(null);
  const [fetchedBlockedRanges, setFetchedBlockedRanges] = useState<BlockedDateRange[] | null>(null);

  useEffect(() => {
    if (selectedCheckIn !== undefined) {
      setSelectedStart(selectedCheckIn || null);
    }
  }, [selectedCheckIn]);

  useEffect(() => {
    if (selectedCheckOut !== undefined) {
      setSelectedEnd(selectedCheckOut || null);
    }
  }, [selectedCheckOut]);

  useEffect(() => {
    if (externalBlockedRanges !== undefined) {
      return;
    }
    let cancelled = false;
    fetch(`/api/properties/${encodeURIComponent(propertyId)}/availability`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.success && Array.isArray(data.blockedRanges)) {
          setFetchedBlockedRanges(data.blockedRanges);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [propertyId, externalBlockedRanges]);

  const fallbackSchedule = AVAILABILITY_SCHEDULES[propertyId] || {
    propertyId,
    unitNumber,
    code: '',
    currentStatus: 'Available',
    nextAvailableDate: '',
    statusMessage: `Flexible stays starting at ${minimumStayDays} nights (30+ days tax-exempt)`,
    bookedRanges: [],
  };

  const activeRanges = useMemo<BlockedDateRange[]>(() => {
    if (externalBlockedRanges !== undefined) {
      return externalBlockedRanges;
    }
    if (fetchedBlockedRanges !== null) {
      return fetchedBlockedRanges;
    }
    return fallbackSchedule.bookedRanges.map((r, idx) => ({
      id: `sched_${idx}`,
      start: r.start,
      end: r.end,
      status: r.status === 'turnover' ? 'turnover' : 'booked',
      label: r.label,
    }));
  }, [externalBlockedRanges, fetchedBlockedRanges, fallbackSchedule.bookedRanges]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const quickMonths = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, offset) => {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const shortMonth = d.toLocaleString('en-US', { month: 'short' });
      const shortYear = String(d.getFullYear()).slice(-2);
      return {
        name: `${shortMonth} ${shortYear}`,
        year: d.getFullYear(),
        month: d.getMonth(),
      };
    });
  }, []);

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

  const formatDateString = (year: number, month: number, day: number): string => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const getDayStatus = useCallback(
    (
      dateStr: string,
    ): {
      type: 'past' | 'booked' | 'turnover' | 'available';
      label?: string;
    } => {
      const todayStr = new Date().toISOString().split('T')[0];
      if (dateStr < todayStr) {
        return { type: 'past', label: 'Past Date' };
      }

      for (const range of activeRanges) {
        if (dateStr >= range.start && dateStr <= range.end) {
          if (range.status === 'turnover') {
            return { type: 'turnover', label: range.label || 'Inspection & Turnover' };
          }
          return { type: 'booked', label: range.label || 'Reserved / Occupied' };
        }
      }

      return {
        type: 'available',
        label: `Open (Min ${minimumStayDays} nights · 30+ days tax-exempt)`,
      };
    },
    [activeRanges, minimumStayDays],
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handleDateClick = (dateStr: string) => {
    const status = getDayStatus(dateStr);

    if (!selectedStart || (selectedStart && selectedEnd)) {
      if (status.type === 'past' || status.type === 'booked' || status.type === 'turnover') {
        setHoveredEventInfo(status.label || 'Date unavailable for check-in');
        return;
      }
      setSelectedStart(dateStr);
      setSelectedEnd(null);
      setHoveredEventInfo(
        `Check-in ${dateStr} selected. Choose your check-out date (minimum ${minimumStayDays} nights).`,
      );
      return;
    }

    if (dateStr <= selectedStart) {
      if (status.type === 'past' || status.type === 'booked' || status.type === 'turnover') {
        return;
      }
      setSelectedStart(dateStr);
      setSelectedEnd(null);
      return;
    }

    // Check every night in [selectedStart, dateStr) for occupied nights
    let hasOverlap = false;
    const cur = new Date(`${selectedStart}T00:00:00Z`);
    const end = new Date(`${dateStr}T00:00:00Z`);
    while (cur < end) {
      const checkStr = cur.toISOString().split('T')[0];
      const st = getDayStatus(checkStr);
      if (st.type === 'booked' || st.type === 'turnover') {
        hasOverlap = true;
        break;
      }
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    if (hasOverlap) {
      setHoveredEventInfo(
        'Selected dates cross a reserved stay. Please pick check-in and check-out dates within an open window.',
      );
      return;
    }

    const nights = Math.round((end.getTime() - new Date(`${selectedStart}T00:00:00Z`).getTime()) / 86400000);
    setSelectedEnd(dateStr);

    if (nights >= minimumStayDays && nights <= maximumStayDays && onSelectDateRange) {
      onSelectDateRange(selectedStart, dateStr, nights);
    }
  };

  const calculateDays = () => {
    if (!selectedStart || !selectedEnd) return 0;
    const s = new Date(`${selectedStart}T00:00:00Z`);
    const e = new Date(`${selectedEnd}T00:00:00Z`);
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const selectedDaysCount = calculateDays();
  const meetsMinimumStay = selectedDaysCount >= minimumStayDays && selectedDaysCount <= maximumStayDays;
  const qualifiesExtendedTaxExempt = selectedDaysCount >= 30;

  const handleApplySelection = () => {
    if (!selectedStart || !selectedEnd || !meetsMinimumStay) return;
    if (onSelectDateRange) {
      onSelectDateRange(selectedStart, selectedEnd, selectedDaysCount);
    }
    if (onSelectDates) {
      const durationLabel =
        selectedDaysCount >= 90
          ? '90-180'
          : selectedDaysCount >= 60
          ? '60-90'
          : selectedDaysCount >= 30
          ? '30-60'
          : String(selectedDaysCount);
      onSelectDates(selectedStart, durationLabel);
    }
  };

  return (
    <div className="bg-white border border-[#e6dfd5] text-left overflow-hidden rounded-xl">
      {/* Top Header / Real-time Status Banner */}
      <div className="bg-[#faf8f5] border-b border-[#e6dfd5] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="type-support flex items-center gap-2 text-[#5c5046]">
            <span className="font-semibold text-[#00897d]">Live Calendar</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#1b1d20]">{unitNumber}</span>
          </div>
          <p className="type-support text-[#282828] font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#00897d] shrink-0" />
            <span>
              Minimum stay: {minimumStayDays} nights · 30+ day stays qualify for tax-exempt monthly rates
            </span>
          </p>
        </div>

        {/* Quick Month Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {quickMonths.map((qm) => {
            const isActive = currentYear === qm.year && currentMonth === qm.month;
            return (
              <button
                key={qm.name}
                type="button"
                onClick={() => {
                  setCurrentYear(qm.year);
                  setCurrentMonth(qm.month);
                }}
                className={`type-btn px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap tabular-nums ${
                  isActive
                    ? 'bg-[#1b1d20] text-white'
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
            <h4 className="type-h4 text-[#1b1d20] tabular-nums">
              {monthNames[currentMonth]} {currentYear}
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-2 border border-[#dfd7cc] text-[#5c5046] hover:text-[#1b1d20] hover:border-[#82634f] transition-colors cursor-pointer rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-2 border border-[#dfd7cc] text-[#5c5046] hover:text-[#1b1d20] hover:border-[#82634f] transition-colors cursor-pointer rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-[#e6dfd5] rounded-lg overflow-hidden">
          <div className="type-support grid grid-cols-7 bg-[#faf8f5] border-b border-[#e6dfd5] text-center font-semibold text-[#5c5046] py-2">
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-[#e6dfd5]">
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-[#fcfaf7] min-h-[46px] sm:min-h-[58px]" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = formatDateString(currentYear, currentMonth, day);
              const status = getDayStatus(dateStr);

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
              let textStyle = 'text-[#1b1d20] font-medium';
              let cursorStyle = 'cursor-pointer hover:bg-[#e6f8f6]';
              let statusLabel: React.ReactNode = null;

              if (status.type === 'past') {
                cellBg = 'bg-[#fafafa]';
                textStyle = 'text-slate-300';
                cursorStyle = 'cursor-not-allowed';
              } else if (status.type === 'booked') {
                cellBg = 'bg-rose-50/75';
                textStyle = 'text-rose-900 font-semibold';
                cursorStyle = selectedStart && !selectedEnd && dateStr > selectedStart ? 'cursor-pointer' : 'cursor-not-allowed';
                statusLabel = (
                  <span className="text-[11px] font-medium text-rose-700 block truncate mt-0.5">
                    Reserved
                  </span>
                );
              } else if (status.type === 'turnover') {
                cellBg = 'bg-amber-50/80';
                textStyle = 'text-amber-900 font-semibold';
                cursorStyle = 'cursor-not-allowed';
                statusLabel = (
                  <span className="text-[11px] font-medium text-amber-700 block truncate mt-0.5">
                    Turnover
                  </span>
                );
              } else {
                cellBg = 'bg-white hover:bg-[#e6f8f6]';
                textStyle = 'text-[#1b1d20] font-semibold';
                statusLabel = (
                  <span className="text-[11px] font-medium text-[#00897d] block truncate mt-0.5">
                    Open
                  </span>
                );
              }

              if (isStart || isEnd) {
                cellBg = 'bg-[#00b7a8] text-white';
                textStyle = 'text-white font-bold';
                statusLabel = (
                  <span className="text-[11px] font-semibold text-white block truncate mt-0.5">
                    {isStart ? 'Check-In' : 'Check-Out'}
                  </span>
                );
              } else if (isInRange || isHovered) {
                cellBg = 'bg-[#d8f5f2]';
                textStyle = 'text-teal-950 font-semibold';
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
                  className={`min-h-[50px] sm:min-h-[60px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors relative tabular-nums ${cellBg} ${cursorStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm ${textStyle}`}>{day}</span>
                  </div>
                  {statusLabel}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="type-support flex flex-wrap items-center justify-between gap-3 pt-2 text-[#5c5046] border-t border-[#efe9e0]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#00b7a8]" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-200 border border-rose-300" />
              <span>Reserved / Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-200 border border-amber-300" />
              <span>Inspection &amp; Turnover</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#e6dfd5]" />
              <span className="text-[#857568]">Past</span>
            </div>
          </div>

          <div className="type-support text-[#697076] tabular-nums">
            Minimum stay: {minimumStayDays} nights
          </div>
        </div>

        {/* Date Selection Details & Action Bar */}
        {selectedStart && (
          <div className="p-4 bg-[#f4fbfa] border border-[#bfece7] rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#00897d]" />
                  <span className="type-support font-semibold text-[#1b1d20]">
                    Selected Stay Window
                  </span>
                </div>
                <div className="type-body font-medium text-[#1b1d20] tabular-nums">
                  <span>
                    Check-In: <strong className="font-semibold text-[#00897d]">{selectedStart}</strong>
                  </span>
                  {selectedEnd ? (
                    <span>
                      {' '}
                      → Check-Out:{' '}
                      <strong className="font-semibold text-[#00897d]">{selectedEnd}</strong> (
                      {selectedDaysCount} Nights)
                    </span>
                  ) : (
                    <span className="type-support text-[#697076] font-normal ml-2">
                      (Select your check-out date on the calendar)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStart(null);
                    setSelectedEnd(null);
                    onSelectDateRange?.('', '', 0);
                  }}
                  className="type-btn px-3.5 py-2 text-[#5c5046] hover:text-[#1b1d20] border border-[#dfd7cc] bg-white rounded-lg cursor-pointer"
                >
                  Clear
                </button>

                {(onSelectDates || onSelectDateRange) && selectedEnd && (
                  <button
                    type="button"
                    onClick={handleApplySelection}
                    disabled={!meetsMinimumStay}
                    className={`type-btn py-2 px-4 rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      !meetsMinimumStay
                        ? 'bg-[#dfd7cc] text-[#857568] cursor-not-allowed'
                        : 'bg-[#00b7a8] hover:bg-[#009b8e] text-white'
                    }`}
                  >
                    <span>Apply Dates</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {selectedEnd && !meetsMinimumStay && (
              <div className="type-support flex items-center gap-2 text-rose-800 bg-rose-50 p-3 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>
                  Selected stay is {selectedDaysCount} nights. This residence requires a minimum stay of{' '}
                  <strong>{minimumStayDays} nights</strong>.
                </span>
              </div>
            )}

            {selectedEnd && meetsMinimumStay && (
              <div className="type-support flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  {qualifiesExtendedTaxExempt
                    ? 'Qualifies for California 30+ day occupancy-tax-exempt monthly pricing, utilities, Wi-Fi, and covered parking.'
                    : `Dates open for a ${selectedDaysCount}-night stay. Extend to 30+ nights to unlock California occupancy-tax-exempt monthly rates.`}
                </span>
              </div>
            )}
          </div>
        )}

        {hoveredEventInfo && !selectedStart && (
          <div className="type-support text-[#5c5046] bg-[#faf8f5] p-3 rounded-lg border border-[#e6dfd5] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00897d] shrink-0" />
            <span>{hoveredEventInfo}</span>
          </div>
        )}
      </div>
    </div>
  );
};
