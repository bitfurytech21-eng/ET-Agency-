export interface DateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  status: 'booked' | 'turnover' | 'reserved';
  label?: string; // e.g., "Corporate Traveler", "Deep Clean / Inspection"
}

export interface PropertyAvailability {
  propertyId: string;
  unitNumber: string;
  code: string;
  currentStatus: 'Available Now' | 'Available Soon' | 'Reserved';
  nextAvailableDate: string; // YYYY-MM-DD
  statusMessage: string;
  bookedRanges: DateRange[];
}

// Booking schedules reflecting authentic mid-term corporate rental cycles in Sacramento
export const AVAILABILITY_SCHEDULES: Record<string, PropertyAvailability> = {
  'unit-91': {
    propertyId: 'unit-91',
    unitNumber: 'Unit 91',
    code: '#A',
    currentStatus: 'Available Soon',
    nextAvailableDate: '2026-11-15',
    statusMessage: 'Occupied through Nov 14 • Available starting Nov 15, 2026',
    bookedRanges: [
      {
        start: '2026-10-01',
        end: '2026-11-14',
        status: 'booked',
        label: 'Traveling ICU Nurse (UC Davis Health)'
      },
      {
        start: '2027-02-01',
        end: '2027-02-28',
        status: 'booked',
        label: 'Corporate Tech Consultant'
      }
    ]
  },
  'unit-173': {
    propertyId: 'unit-173',
    unitNumber: 'Unit 173',
    code: '#B',
    currentStatus: 'Available Now',
    nextAvailableDate: '2026-11-01',
    statusMessage: 'Immediate move-in ready • Open through Jan 10, 2027',
    bookedRanges: [
      {
        start: '2027-01-11',
        end: '2027-03-31',
        status: 'booked',
        label: 'Healthcare Specialist (Kaiser Permanente)'
      }
    ]
  },
  'unit-250': {
    propertyId: 'unit-250',
    unitNumber: 'Unit 250',
    code: '#C',
    currentStatus: 'Available Soon',
    nextAvailableDate: '2026-12-16',
    statusMessage: 'Occupied through Dec 15 • Available starting Dec 16, 2026',
    bookedRanges: [
      {
        start: '2026-09-15',
        end: '2026-12-14',
        status: 'booked',
        label: 'Corporate Executive Relocation'
      },
      {
        start: '2026-12-15',
        end: '2026-12-15',
        status: 'turnover',
        label: 'Sanitization & Linens Refresh'
      }
    ]
  },
  'unit-333': {
    propertyId: 'unit-333',
    unitNumber: 'Unit 333',
    code: '#D',
    currentStatus: 'Available Soon',
    nextAvailableDate: '2026-12-01',
    statusMessage: 'Occupied through Nov 30 • Open starting Dec 1, 2026',
    bookedRanges: [
      {
        start: '2026-09-01',
        end: '2026-11-30',
        status: 'booked',
        label: 'State Capitol Legislative Fellow'
      }
    ]
  },
  'unit-335': {
    propertyId: 'unit-335',
    unitNumber: 'Unit 335',
    code: '#E',
    currentStatus: 'Available Soon',
    nextAvailableDate: '2027-01-05',
    statusMessage: 'Booked through Dec 31 • Turnover Jan 1-4 • Available Jan 5, 2027',
    bookedRanges: [
      {
        start: '2026-10-01',
        end: '2026-12-31',
        status: 'booked',
        label: 'Insurance Claim Family Relocation'
      },
      {
        start: '2027-01-01',
        end: '2027-01-04',
        status: 'turnover',
        label: 'Turnover & Multi-Point Inspection'
      }
    ]
  }
};
