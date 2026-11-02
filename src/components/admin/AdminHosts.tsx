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
      email: 'easytravelagency@trustagent.space',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h3 className="type-h3 text-slate-900">Nationwide Host &amp; Partner Directory</h3>
          <p className="type-body text-slate-600 mt-1">
            Manage residence ownership agreements, revenue share contracts, and monthly payout disbursements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hostsList.map((h) => (
          <div key={h.id} className="admin-panel p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <span className="font-mono type-support font-semibold text-[#14616d] block">{h.id}</span>
                <h4 className="type-h4 text-slate-900">{h.name}</h4>
                <p className="type-support text-slate-500">{h.title}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 type-support font-semibold text-emerald-700 shrink-0 capitalize">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{h.status}</span>
              </span>
            </div>

            <div className="space-y-2.5 type-support text-slate-600">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#14616d] shrink-0" />
                <span>{h.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#14616d] shrink-0" />
                <span className="tabular-nums">{h.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {h.assignedPropertyIds.length} Assigned Residences ({h.assignedPropertyIds.join(', ')})
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2 type-support">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Contract Split</span>
                <span className="font-semibold text-slate-900 text-right">{h.commissionSplit}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Payout Method</span>
                <span className="font-medium text-slate-800 text-right">{h.payoutMethod}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">YTD Disbursed</span>
                <span className="font-semibold text-[#14616d] tabular-nums">
                  ${h.ytdPayoutUsd?.toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
