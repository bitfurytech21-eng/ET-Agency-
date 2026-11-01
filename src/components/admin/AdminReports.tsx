import React from 'react';
import {
  FileSpreadsheet,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Car,
  PieChart,
} from 'lucide-react';

interface AdminReportsProps {
  totalRevenue: number;
  totalBookings: number;
  totalVehicleBookings: number;
  onExportCsv: (filename: string, headers: string[], rows: Array<Array<string | number>>) => void;
}

export const AdminReports: React.FC<AdminReportsProps> = ({
  totalRevenue,
  totalBookings,
  totalVehicleBookings,
  onExportCsv,
}) => {
  const handleExportReservations = () => {
    onExportCsv(
      'etl-reservations-audit.csv',
      ['Booking ID', 'Category', 'Target Asset', 'Guest Name', 'Start Date', 'End Date', 'Nights/Days', 'Total USD', 'Status'],
      [
        ['bk_rec_910', 'Accommodation', 'Unit 91', 'Dr. Sarah Miller', '2026-11-03', '2027-01-02', 60, 5000, 'confirmed'],
        ['bk_rec_914', 'Accommodation', 'Unit 250', 'Dr. Marcus Vance', '2026-12-17', '2027-01-16', 30, 2800, 'pending'],
        ['bk_rec_918', 'Accommodation', 'Unit 173', 'Elena Rostova', '2026-12-02', '2027-02-01', 61, 5600, 'confirmed'],
        ['vb_corp_101', 'Fleet', 'Nissan Terra 2020', 'David Sterling', '2026-11-05', '2026-11-12', 7, 740, 'confirmed'],
        ['vb_corp_102', 'Fleet', '2019 Skoda Karoq', 'Elena Rostova', '2026-11-15', '2026-11-29', 14, 1120, 'confirmed'],
      ]
    );
  };

  const handleExportFleet = () => {
    onExportCsv(
      'etl-fleet-utilization.csv',
      ['Vehicle ID', 'Name', 'License Plate', 'Hub Location', 'Daily Rate', 'Weekly Rate', 'Monthly Rate', 'Status', 'Mileage'],
      [
        ['nissan-terra-2020', 'Nissan Terra 2020', '9ETL501', 'US Airport Terminal Concierge Bay', 125, 740, 2450, 'available', 18450],
        ['skoda-karoq-2019', '2019 Skoda Karoq', '9ETL882', 'Executive Suite Delivery Hub', 95, 560, 1890, 'available', 22100],
        ['audi-a3-2021', 'Audi A3 2021', '9ETL710', 'Regional Airport / Executive Hub', 115, 680, 2250, 'available', 14200],
        ['vw-jetta-gli', 'Volkswagen Jetta GLI', '9ETL999', 'National Chauffeur Dispatch Bay', 105, 620, 2050, 'available', 11300],
      ]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header matching admin/reports/ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-[#282828]">Executive Analytics &amp; CPA Reports (reports/)</h3>
          <p className="text-xs text-[#5c5046]">
            Audited financial statements, occupancy metrics, RevPAR, and exportable CSV tables.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportReservations}
            className="px-3 py-1.5 bg-[#82634f] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Bookings CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportFleet}
            className="px-3 py-1.5 bg-[#00b7a8] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Fleet CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568]">Gross Portfolio Revenue</span>
          <div className="text-2xl font-heading font-black text-[#00897d] tabular-nums">
            ${totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#5c5046]">Direct bank wires &amp; prepaid balances</span>
        </div>

        <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568]">Average Daily Rate (ADR)</span>
          <div className="text-2xl font-heading font-black text-[#282828] tabular-nums">$142.50</div>
          <span className="text-[11px] text-[#00897d] font-semibold">Across verified nationwide residences</span>
        </div>

        <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568]">Overall Portfolio Occupancy</span>
          <div className="text-2xl font-heading font-black text-[#282828] tabular-nums">92.4%</div>
          <span className="text-[11px] text-emerald-700 font-semibold">14-day average lead time</span>
        </div>

        <div className="p-5 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568]">Fleet Rental Utilization</span>
          <div className="text-2xl font-heading font-black text-[#82634f] tabular-nums">84.8%</div>
          <span className="text-[11px] text-[#857568]">Days dispatched / Total available days</span>
        </div>
      </div>

      {/* Breakdown per property */}
      <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-[#e6dfd5] pb-3">
          <h4 className="font-heading font-bold text-base text-[#282828]">Residence Occupancy &amp; Revenue Breakdown</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
              <tr>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Monthly Rate</th>
                <th className="py-3 px-3">Occupancy %</th>
                <th className="py-3 px-3">YTD Net Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd5]">
              {[
                { unit: 'Unit 91', title: 'One-Bedroom Ground-Floor Suite', rate: 2500, occ: '96.2%', rev: 32500 },
                { unit: 'Unit 173', title: 'One-Bedroom Courtyard Suite', rate: 2500, occ: '94.0%', rev: 31250 },
                { unit: 'Unit 250', title: 'Two-Bedroom Upstairs Balcony Suite', rate: 2800, occ: '91.5%', rev: 35800 },
                { unit: 'Unit 274', title: 'Two-Bedroom Poolside View Suite', rate: 2800, occ: '93.0%', rev: 36400 },
                { unit: 'Unit 335', title: 'Two-Bedroom Premier Patio Residence', rate: 2800, occ: '88.5%', rev: 34100 },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#fbf9f6]">
                  <td className="py-3 px-3 font-mono font-bold text-[#82634f]">{row.unit}</td>
                  <td className="py-3 px-3 font-semibold text-[#282828]">{row.title}</td>
                  <td className="py-3 px-3 font-bold text-[#00897d] tabular-nums">${row.rate} / mo</td>
                  <td className="py-3 px-3 font-bold text-emerald-700 tabular-nums">{row.occ}</td>
                  <td className="py-3 px-3 font-bold text-[#282828] tabular-nums">${row.rev.toLocaleString()} USD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
