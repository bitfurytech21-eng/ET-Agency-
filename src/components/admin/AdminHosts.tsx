import React, { useState } from 'react';
import {
  Users,
  Building2,
  DollarSign,
  ShieldCheck,
  Plus,
  Edit3,
  FileText,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import type { AdminHost } from './adminTypes';

interface AdminHostsProps {
  hosts?: AdminHost[];
}

export const AdminHosts: React.FC<AdminHostsProps> = () => {
  const [hostsList, setHostsList] = useState<AdminHost[]>([
    {
      id: 'host-01',
      name: 'Bill Wheelock & Dr. Marlena Uhrik',
      title: 'Founding Property Owners & Principals',
      email: 'bill@easytravellodging.com',
      phone: '(916) 800-3295',
      assignedPropertyIds: ['unit-91', 'unit-173', 'unit-250', 'unit-274', 'unit-335'],
      commissionSplit: '100% Direct Principal Owner',
      payoutMethod: 'Bank of America Direct Wire / Treasury',
      ytdPayoutUsd: 184500,
      status: 'active',
      joinedDate: '2024-01-01',
    },
    {
      id: 'host-02',
      name: 'ETL Executive Housing Holdings LLC',
      title: 'Hospitality Partner & Real Estate Syndicate',
      email: 'partners@etlexecutive.com',
      phone: '(916) 426-3655',
      assignedPropertyIds: ['unit-335'],
      commissionSplit: '85% Host / 15% Concierge Operations',
      payoutMethod: 'ACH Corporate Direct Deposit',
      ytdPayoutUsd: 42000,
      status: 'active',
      joinedDate: '2025-06-15',
    },
  ]);

  const [selectedHost, setSelectedHost] = useState<AdminHost | null>(null);

  return (
    <div className="space-y-6">
      {/* Header matching admin/hosts/ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-[#282828]">Nationwide Host &amp; Partner Directory (hosts/)</h3>
          <p className="text-xs text-[#5c5046]">
            Manage residence ownership agreements, revenue share contracts, and monthly payout disbursements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hostsList.map((h) => (
          <div key={h.id} className="p-6 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-[#e6dfd5] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#82634f] font-bold block">{h.id}</span>
                <h4 className="font-heading font-bold text-base text-[#282828]">{h.name}</h4>
                <p className="text-[#857568] text-[11px]">{h.title}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] border border-emerald-200">
                {h.status}
              </span>
            </div>

            <div className="space-y-2 text-[#5c5046]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00b7a8]" />
                <span>{h.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00b7a8]" />
                <span>{h.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#82634f]" />
                <span className="font-semibold text-[#282828]">
                  {h.assignedPropertyIds.length} Assigned Residences ({h.assignedPropertyIds.join(', ')})
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#857568]">Contract Split:</span>
                <span className="font-bold text-[#282828]">{h.commissionSplit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857568]">Payout Method:</span>
                <span className="font-medium text-[#282828]">{h.payoutMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857568]">YTD Disbursed:</span>
                <span className="font-bold text-[#00897d] tabular-nums">${h.ytdPayoutUsd?.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
