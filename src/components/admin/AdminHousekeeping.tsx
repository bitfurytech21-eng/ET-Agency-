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
      {/* Header matching admin/housekeeping/ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-[#282828]">Turnover &amp; Housekeeping Operations (housekeeping/)</h3>
          <p className="text-xs text-[#5c5046]">
            Deep sanitization, linen swap schedules, smart lock passcode resets, and executive inspection checklists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="p-6 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-[#e6dfd5] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#82634f] font-bold block">{task.unitNumber}</span>
                <h4 className="font-heading font-bold text-base text-[#282828]">{task.unitTitle}</h4>
                <p className="text-[#857568] text-[11px] flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#00b7a8]" />
                  <span>{task.assignedStaff}</span>
                </p>
              </div>

              <select
                value={task.status}
                onChange={(e) => setTaskStatus(task.id, e.target.value as AdminHousekeepingTask['status'])}
                className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] border outline-none cursor-pointer ${
                  task.status === 'ready'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : task.status === 'inspected'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : task.status === 'cleaning'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                <option value="dirty">Dirty / Turnover Due</option>
                <option value="cleaning">In Cleaning</option>
                <option value="inspected">Inspected</option>
                <option value="ready">Guest Ready</option>
              </select>
            </div>

            <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e6dfd5] space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#857568]">Prior Check-Out:</span>
                <span className="font-semibold text-[#282828]">{task.lastGuestCheckOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857568]">Incoming Check-In:</span>
                <span className="font-semibold text-[#00897d]">{task.nextGuestCheckIn}</span>
              </div>
            </div>

            {/* Turnover Checklist */}
            <div className="space-y-2">
              <span className="font-bold text-[#282828] block">Turnover Checklist:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
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
                      className={`p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#e8f8f6] border-[#bfe8e3] text-[#00897d] font-bold'
                          : 'bg-[#faf8f5] border-[#dfd6ca] text-[#857568]'
                      }`}
                    >
                      {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-[#00b7a8]" /> : <Square className="w-3.5 h-3.5" />}
                      <span className="line-clamp-1">{label}</span>
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
