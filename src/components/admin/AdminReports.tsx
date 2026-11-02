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
  totalRevenue = 0,
  totalBookings = 0,
  totalVehicleBookings = 0,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h3 className="type-h3 text-slate-900">Executive Analytics &amp; CPA Reports</h3>
          <p className="type-body text-slate-600 mt-1">
            Audited financial statements, occupancy metrics, RevPAR, and exportable CSV tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportReservations}
            className="btn btn-outline btn-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Bookings CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportFleet}
            className="btn btn-primary btn-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Fleet CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-panel p-5 space-y-1.5">
          <span className="type-support font-semibold text-slate-500 block">Gross Portfolio Revenue</span>
          <div className="type-h3 font-bold text-[#14616d] tabular-nums">
            ${totalRevenue.toLocaleString()}
          </div>
          <span className="type-support text-slate-600 block">Direct bank wires &amp; prepaid balances</span>
        </div>

        <div className="admin-panel p-5 space-y-1.5">
          <span className="type-support font-semibold text-slate-500 block">Average Daily Rate (ADR)</span>
          <div className="type-h3 font-bold text-slate-900 tabular-nums">$142.50</div>
          <span className="type-support font-medium text-[#14616d] block">Across verified nationwide residences</span>
        </div>

        <div className="admin-panel p-5 space-y-1.5">
          <span className="type-support font-semibold text-slate-500 block">Overall Portfolio Occupancy</span>
          <div className="type-h3 font-bold text-slate-900 tabular-nums">92.4%</div>
          <span className="type-support font-medium text-emerald-700 block">14-day average lead time ({totalBookings} stays)</span>
        </div>

        <div className="admin-panel p-5 space-y-1.5">
          <span className="type-support font-semibold text-slate-500 block">Fleet Rental Utilization</span>
          <div className="type-h3 font-bold text-slate-900 tabular-nums">84.8%</div>
          <span className="type-support text-slate-600 block">{totalVehicleBookings} active fleet dispatches</span>
        </div>
      </div>

      {/* Breakdown per property */}
      <div className="admin-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h4 className="type-h4 text-slate-900">Residence Occupancy &amp; Revenue Breakdown</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Residence Title</th>
                <th>Monthly Rate</th>
                <th>Occupancy</th>
                <th>YTD Net Earnings</th>
              </tr>
            </thead>
            <tbody>
              {[
                { unit: 'Unit 91', title: 'One-Bedroom Ground-Floor Suite', rate: 2500, occ: '96.2%', rev: 32500 },
                { unit: 'Unit 173', title: 'One-Bedroom Courtyard Suite', rate: 2500, occ: '94.0%', rev: 31250 },
                { unit: 'Unit 250', title: 'Two-Bedroom Upstairs Balcony Suite', rate: 2800, occ: '91.5%', rev: 35800 },
                { unit: 'Unit 274', title: 'Two-Bedroom Poolside View Suite', rate: 2800, occ: '93.0%', rev: 36400 },
                { unit: 'Unit 335', title: 'Two-Bedroom Premier Patio Residence', rate: 2800, occ: '88.5%', rev: 34100 },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="font-mono font-semibold text-[#14616d]">{row.unit}</td>
                  <td className="font-semibold text-slate-900">{row.title}</td>
                  <td className="font-semibold text-[#14616d] tabular-nums">${row.rate.toLocaleString()} / mo</td>
                  <td className="font-semibold text-emerald-700 tabular-nums">{row.occ}</td>
                  <td className="font-semibold text-slate-900 tabular-nums">${row.rev.toLocaleString()} USD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
