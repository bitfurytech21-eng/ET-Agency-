import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  UserCheck,
  CheckSquare,
  Square,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import type { AdminHousekeepingTask } from './adminTypes';

interface AdminHousekeepingProps {
  tasks?: AdminHousekeepingTask[];
}

export const AdminHousekeeping: React.FC<AdminHousekeepingProps> = () => {
  const [tasks, setTasks] = useState<AdminHousekeepingTask[]>([
    {
      id: 'hk-101',
      propertyId: 'unit-91',
      unitNumber: 'Unit 91',
      unitTitle: 'One-Bedroom Ground-Floor Suite',
      assignedStaff: 'Maria Gonzalez (Lead Turnover)',
      scheduledDate: '2026-11-03',
      status: 'ready',
      lastGuestCheckOut: '2026-11-02 11:00 AM',
      nextGuestCheckIn: '2026-11-03 03:00 PM (Dr. Sarah Miller)',
      checklist: {
        linensChanged: true,
        bathroomsSanitized: true,
        kitchenReset: true,
        toiletriesRestocked: true,
        keypadCodeReset: true,
        inspectionPassed: true,
      },
      notes: 'Hospital welcome kit placed on dining table.',
    },
    {
      id: 'hk-102',
      propertyId: 'unit-173',
      unitNumber: 'Unit 173',
      unitTitle: 'One-Bedroom Courtyard Suite',
      assignedStaff: 'Elena Vasquez',
      scheduledDate: '2026-11-04',
      status: 'inspected',
      lastGuestCheckOut: '2026-11-03 11:00 AM',
      nextGuestCheckIn: '2026-11-05 03:00 PM',
      checklist: {
        linensChanged: true,
        bathroomsSanitized: true,
        kitchenReset: true,
        toiletriesRestocked: true,
        keypadCodeReset: true,
        inspectionPassed: true,
      },
    },
    {
      id: 'hk-103',
      propertyId: 'unit-250',
      unitNumber: 'Unit 250',
      unitTitle: 'Two-Bedroom Upstairs Balcony Suite',
      assignedStaff: 'Carlos Ramos',
      scheduledDate: '2026-11-06',
      status: 'cleaning',
      lastGuestCheckOut: '2026-11-06 10:00 AM',
      nextGuestCheckIn: '2026-11-07 04:00 PM',
      checklist: {
        linensChanged: true,
        bathroomsSanitized: true,
        kitchenReset: false,
        toiletriesRestocked: false,
        keypadCodeReset: false,
        inspectionPassed: false,
      },
    },
    {
      id: 'hk-104',
      propertyId: 'unit-335',
      unitNumber: 'Unit 335',
      unitTitle: 'Two-Bedroom Premier Patio Residence',
      assignedStaff: 'Maria Gonzalez (Lead Turnover)',
      scheduledDate: '2026-11-08',
      status: 'dirty',
      lastGuestCheckOut: '2026-11-08 11:00 AM',
      nextGuestCheckIn: '2026-11-10 03:00 PM',
      checklist: {
        linensChanged: false,
        bathroomsSanitized: false,
        kitchenReset: false,
        toiletriesRestocked: false,
        keypadCodeReset: false,
        inspectionPassed: false,
      },
    },
  ]);

  const toggleChecklist = (taskId: string, key: keyof AdminHousekeepingTask['checklist']) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = { ...t.checklist, [key]: !t.checklist[key] };
        const allChecked = Object.values(updatedChecklist).every(Boolean);
        return {
          ...t,
          checklist: updatedChecklist,
          status: allChecked ? 'ready' : t.checklist.linensChanged ? 'cleaning' : 'dirty',
        };
      })
    );
  };

  const setTaskStatus = (taskId: string, status: AdminHousekeepingTask['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h3 className="type-h3 text-slate-900">Turnover &amp; Housekeeping Operations</h3>
          <p className="type-body text-slate-600 mt-1">
            Deep sanitization, linen swap schedules, smart lock passcode resets, and executive inspection checklists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="admin-panel p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <span className="font-mono type-support font-semibold text-[#14616d] block">{task.unitNumber}</span>
                <h4 className="type-h4 text-slate-900">{task.unitTitle}</h4>
                <p className="type-support text-slate-600 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#14616d] shrink-0" />
                  <span>{task.assignedStaff}</span>
                </p>
              </div>

              <select
                aria-label={`Turnover status for ${task.unitNumber}`}
                value={task.status}
                onChange={(e) => setTaskStatus(task.id, e.target.value as AdminHousekeepingTask['status'])}
                className={`px-3 py-2 min-h-[40px] rounded-lg type-support font-semibold border outline-none cursor-pointer shrink-0 ${
                  task.status === 'ready'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : task.status === 'inspected'
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : task.status === 'cleaning'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                <option value="dirty">Dirty / Turnover Due</option>
                <option value="cleaning">In Cleaning</option>
                <option value="inspected">Inspected</option>
                <option value="ready">Guest Ready</option>
              </select>
            </div>

            <div className="py-3 border-b border-slate-200 space-y-2 type-support tabular-nums">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Prior Check-Out</span>
                <span className="font-semibold text-slate-800">{task.lastGuestCheckOut}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Incoming Check-In</span>
                <span className="font-semibold text-[#14616d]">{task.nextGuestCheckIn}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="form-label mb-0">Turnover Checklist</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'linensChanged', label: 'Linens & Bedding Swapped' },
                  { key: 'bathroomsSanitized', label: 'Bathrooms Disinfected' },
                  { key: 'kitchenReset', label: 'Kitchen & Appliances Reset' },
                  { key: 'toiletriesRestocked', label: 'Toiletries & Coffee Restocked' },
                  { key: 'keypadCodeReset', label: 'Smart Keypad Code Renewed' },
                  { key: 'inspectionPassed', label: 'Supervisor Sign-Off' },
                ].map(({ key, label }) => {
                  const isChecked = task.checklist[key as keyof AdminHousekeepingTask['checklist']];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleChecklist(task.id, key as keyof AdminHousekeepingTask['checklist'])}
                      className={`px-3 py-2.5 min-h-[42px] rounded-lg border text-left flex items-center gap-2.5 type-support cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#edf6f8] border-[#14616d]/30 text-[#0f4952] font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#14616d] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
