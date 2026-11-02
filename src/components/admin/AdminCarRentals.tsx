import React, { useState } from 'react';
import {
  Car,
  Calendar,
  DollarSign,
  Wrench,
  Settings,
  Plus,
  Edit3,
  Eye,
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Trash2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { AdminVehicle, AdminReservation, AdminPricingFee } from './adminTypes';

interface AdminCarRentalsProps {
  vehicles: AdminVehicle[];
  bookings: AdminReservation[];
  onUpdateVehicle: (vehicle: AdminVehicle) => void;
  onAddVehicle?: (vehicle: AdminVehicle) => void;
  onUpdateBookingStatus: (id: string, newStatus: AdminReservation['status']) => void;
}

export const AdminCarRentals: React.FC<AdminCarRentalsProps> = ({
  vehicles,
  bookings,
  onUpdateVehicle,
  onAddVehicle,
  onUpdateBookingStatus,
}) => {
  const [activeModule, setActiveModule] = useState<
    'fleet' | 'bookings' | 'availability' | 'pricing' | 'fleet-management' | 'settings'
  >('fleet');

  // Sub-tabs for Fleet
  const [fleetSubTab, setFleetSubTab] = useState<'index' | 'add' | 'edit' | 'details' | 'images' | 'documents'>('index');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || 'nissan-terra-2020');

  // Availability calendar state
  const [currentMonth, setCurrentMonth] = useState<string>('November 2026');
  const [blockedDates, setBlockedDates] = useState<Array<{ id: string; vehicleId: string; dates: string; reason: string }>>([
    { id: 'blk-1', vehicleId: 'nissan-terra-2020', dates: '2026-11-10 to 2026-11-12', reason: 'Scheduled 20k-Mile Transmission & 4WD Service' },
    { id: 'blk-2', vehicleId: 'skoda-karoq-2019', dates: '2026-11-24 to 2026-11-25', reason: 'Thanksgiving VIP Executive Reserve' },
  ]);
  const [newBlockVehicleId, setNewBlockVehicleId] = useState(vehicles[0]?.id || '');
  const [newBlockDates, setNewBlockDates] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');

  // Pricing fees state
  const [pricingFees, setPricingFees] = useState<AdminPricingFee[]>([
    { id: 'fee-dep', name: 'Refundable Security Deposit', amount: 500, type: 'fixed', description: 'Authorized at handover; returned immediately upon non-damaged return.', isMandatory: true },
    { id: 'fee-del', name: 'Curbside Residence Delivery', amount: 45, type: 'fixed', description: 'Direct delivery and drop-off to your reserved suite or doorstep nationwide.', isMandatory: false },
    { id: 'fee-ins', name: 'Loss Damage Waiver (LDW)', amount: 29, type: 'per_day', description: 'Full zero-deductible coverage for collision and paint scrapes.', isMandatory: false },
    { id: 'fee-cln', name: 'Excess Pet/Detailing Cleaning', amount: 150, type: 'fixed', description: 'Assessed only if vehicle requires deep bio/steam sanitization.', isMandatory: false },
  ]);

  // Inspection checklists
  const [inspections, setInspections] = useState<Array<{ id: string; vehicleId: string; date: string; inspector: string; passed: boolean; notes: string }>>([
    { id: 'insp-1', vehicleId: 'nissan-terra-2020', date: '2026-10-28', inspector: 'Marcus Vance (Fleet Lead)', passed: true, notes: 'Tire depth 9mm, brakes 80%, cabin pristine.' },
    { id: 'insp-2', vehicleId: 'skoda-karoq-2019', date: '2026-10-30', inspector: 'Marcus Vance (Fleet Lead)', passed: true, notes: 'Oil level optimal, zero exterior scratches, windshield spotless.' },
    { id: 'insp-3', vehicleId: 'audi-a3-2021', date: '2026-10-25', inspector: 'Carlos R.', passed: true, notes: 'Executive detailing completed, tires calibrated.' },
  ]);

  // Selected vehicle object
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Edit vehicle form state
  const [editForm, setEditForm] = useState<AdminVehicle | null>(null);

  // New vehicle form
  const [newVehicle, setNewVehicle] = useState<Partial<AdminVehicle>>({
    id: `veh-${Date.now()}`,
    name: 'BMW X5 xDrive40i',
    make: 'BMW',
    category: 'Luxury Mid-Size Executive SUV',
    year: 2023,
    licensePlate: '9ETL440',
    mileage: 9400,
    hubLocation: 'SMF Airport Concierge Terminal B',
    dailyRate: 145,
    weeklyRate: 850,
    monthlyRate: 2800,
    inventoryStatus: 'available',
    maintenanceLogs: [],
  });

  const handleStartEdit = (veh: AdminVehicle) => {
    setSelectedVehicleId(veh.id);
    setEditForm({ ...veh });
    setFleetSubTab('edit');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      onUpdateVehicle(editForm);
      setFleetSubTab('index');
    }
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVehicle.name && newVehicle.licensePlate && onAddVehicle) {
      onAddVehicle(newVehicle as AdminVehicle);
      setFleetSubTab('index');
    }
  };

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDates || !newBlockReason) return;
    setBlockedDates((prev) => [
      ...prev,
      { id: `blk-${Date.now()}`, vehicleId: newBlockVehicleId || vehicles[0]?.id, dates: newBlockDates, reason: newBlockReason },
    ]);
    setNewBlockDates('');
    setNewBlockReason('');
  };

  return (
    <div className="space-y-6">
      {/* Primary Modules Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'fleet', label: 'Fleet Inventory', icon: Car },
            { id: 'bookings', label: 'Fleet Bookings', icon: Calendar },
            { id: 'availability', label: 'Availability & Calendar', icon: Clock },
            { id: 'pricing', label: 'Pricing & Surcharges', icon: DollarSign },
            { id: 'fleet-management', label: 'Fleet Management', icon: Wrench },
            { id: 'settings', label: 'Rental Policies', icon: Settings },
          ].map((mod) => {
            const Icon = mod.icon;
            const active = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModule(mod.id as typeof activeModule)}
                className={`px-3.5 py-2 min-h-[40px] rounded-lg type-nav flex items-center gap-2 transition-colors cursor-pointer border whitespace-nowrap ${
                  active
                    ? 'bg-[#14616d] text-white border-[#14616d]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Vehicle Selector for contextual views */}
        {selectedVehicle && (
          <div className="flex items-center gap-2.5">
            <label htmlFor="admin-active-vehicle-select" className="form-label mb-0 whitespace-nowrap">
              Vehicle:
            </label>
            <select
              id="admin-active-vehicle-select"
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                const found = vehicles.find((v) => v.id === e.target.value);
                if (found) setEditForm({ ...found });
              }}
              className="form-select py-1.5 min-h-[40px] w-auto font-semibold"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.licensePlate})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ========================================================
          1. FLEET INVENTORY
         ======================================================== */}
      {activeModule === 'fleet' && (
        <div className="space-y-6">
          {/* Sub-tabs for Fleet */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'index', label: 'Vehicles Directory' },
              { id: 'add', label: 'Add Vehicle' },
              { id: 'edit', label: 'Edit Vehicle' },
              { id: 'details', label: 'Vehicle Details' },
              { id: 'images', label: '3D Studio Asset' },
              { id: 'documents', label: 'Compliance & Docs' },
            ].map((tab) => {
              const active = fleetSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFleetSubTab(tab.id as typeof fleetSubTab)}
                  className={`px-3 py-1.5 min-h-[38px] rounded-lg type-nav cursor-pointer border transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 1A. FLEET INDEX TABLE */}
          {fleetSubTab === 'index' && (
            <div className="admin-panel overflow-hidden">
              <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
                <div>
                  <h3 className="type-h3 text-slate-900">Executive Fleet Directory</h3>
                  <p className="type-body text-slate-600 mt-1">
                    Active vehicles stationed across nationwide hubs, airport terminals, and suites.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFleetSubTab('add')}
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Vehicle</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Vehicle &amp; Make</th>
                      <th>License &amp; Hub</th>
                      <th>Daily Rate</th>
                      <th>Weekly Rate</th>
                      <th>Monthly Rate</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((veh) => (
                      <tr key={veh.id}>
                        <td>
                          <div className="font-semibold text-slate-900">{veh.name}</div>
                          <div className="type-support text-slate-500">
                            {veh.category} · {veh.year}
                          </div>
                        </td>
                        <td>
                          <span className="font-mono type-support font-semibold text-[#14616d] block">
                            {veh.licensePlate}
                          </span>
                          <span className="type-support text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#14616d] shrink-0" />
                            <span>{veh.hubLocation}</span>
                          </span>
                        </td>
                        <td className="font-semibold text-[#14616d] tabular-nums whitespace-nowrap">
                          ${veh.dailyRate} / day
                        </td>
                        <td className="font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                          ${veh.weeklyRate} / wk
                        </td>
                        <td className="font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                          ${veh.monthlyRate.toLocaleString()} / mo
                        </td>
                        <td>
                          <span
                            className={`type-support font-semibold capitalize ${
                              veh.inventoryStatus === 'available'
                                ? 'text-emerald-700'
                                : veh.inventoryStatus === 'rented'
                                ? 'text-sky-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {veh.inventoryStatus}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedVehicleId(veh.id);
                                setFleetSubTab('details');
                              }}
                              className="btn btn-outline btn-sm px-2.5"
                              title="Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(veh)}
                              className="btn btn-primary btn-sm px-2.5"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 1B. ADD VEHICLE */}
          {fleetSubTab === 'add' && (
            <div className="admin-panel p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="type-h3 text-slate-900">Add Fleet Vehicle</h3>
                <p className="type-body text-slate-600 mt-1">
                  Onboard a new vehicle to the nationwide executive rental fleet.
                </p>
              </div>

              <form onSubmit={handleCreateVehicle} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Make &amp; Model Name</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">License Plate</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.licensePlate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                      className="form-input font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
                  <div>
                    <label className="form-label">Daily Rate ($)</label>
                    <input
                      type="number"
                      required
                      value={newVehicle.dailyRate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, dailyRate: Number(e.target.value) })}
                      className="form-input tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="form-label">Weekly Rate ($)</label>
                    <input
                      type="number"
                      required
                      value={newVehicle.weeklyRate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, weeklyRate: Number(e.target.value) })}
                      className="form-input tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="form-label">Monthly Rate ($)</label>
                    <input
                      type="number"
                      required
                      value={newVehicle.monthlyRate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, monthlyRate: Number(e.target.value) })}
                      className="form-input tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Station Hub Location</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.hubLocation}
                    onChange={(e) => setNewVehicle({ ...newVehicle, hubLocation: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFleetSubTab('index')}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 1C. EDIT VEHICLE */}
          {fleetSubTab === 'edit' && editForm && (
            <div className="admin-panel p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="type-h3 text-slate-900">
                  Edit {editForm.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setFleetSubTab('index')}
                  aria-label="Close edit vehicle form"
                  className="btn btn-ghost btn-sm px-2.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Vehicle Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">License Plate</label>
                    <input
                      type="text"
                      value={editForm.licensePlate}
                      onChange={(e) => setEditForm({ ...editForm, licensePlate: e.target.value })}
                      className="form-input font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
                  <div>
                    <label className="form-label">Daily Rate ($)</label>
                    <input
                      type="number"
                      value={editForm.dailyRate}
                      onChange={(e) => setEditForm({ ...editForm, dailyRate: Number(e.target.value) })}
                      className="form-input tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="form-label">Weekly Rate ($)</label>
                    <input
                      type="number"
                      value={editForm.weeklyRate}
                      onChange={(e) => setEditForm({ ...editForm, weeklyRate: Number(e.target.value) })}
                      className="form-input tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="form-label">Inventory Status</label>
                    <select
                      value={editForm.inventoryStatus}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          inventoryStatus: e.target.value as AdminVehicle['inventoryStatus'],
                        })
                      }
                      className="form-select font-semibold"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFleetSubTab('index')}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 1D. VEHICLE DETAILS */}
          {fleetSubTab === 'details' && selectedVehicle && (
            <div className="admin-panel p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1">
                  <span className="font-mono type-support font-semibold text-[#14616d] block">
                    {selectedVehicle.licensePlate}
                  </span>
                  <h3 className="type-h3 text-slate-900">{selectedVehicle.name}</h3>
                  <p className="type-body text-slate-600">{selectedVehicle.category}</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(selectedVehicle)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit Vehicle
                  </button>
                  <button
                    type="button"
                    onClick={() => setFleetSubTab('images')}
                    className="btn btn-primary btn-sm"
                  >
                    View 3D Model
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="space-y-1.5 pt-4 md:pt-0 first:pt-0">
                  <span className="type-support font-semibold text-slate-500 block">Rental Pricing</span>
                  <div className="type-h4 text-[#14616d] tabular-nums">${selectedVehicle.dailyRate} / day</div>
                  <div className="type-support text-slate-600 tabular-nums">
                    ${selectedVehicle.weeklyRate} / week · ${selectedVehicle.monthlyRate.toLocaleString()} / mo
                  </div>
                </div>

                <div className="space-y-1.5 pt-4 md:pt-0 md:pl-6">
                  <span className="type-support font-semibold text-slate-500 block">Station &amp; Mileage</span>
                  <div className="type-h4 text-slate-900">{selectedVehicle.hubLocation}</div>
                  <div className="type-support text-slate-600 tabular-nums">
                    {selectedVehicle.mileage.toLocaleString()} total miles
                  </div>
                </div>

                <div className="space-y-1.5 pt-4 md:pt-0 md:pl-6">
                  <span className="type-support font-semibold text-slate-500 block">Fleet Status</span>
                  <div className="type-h4 text-emerald-700 capitalize">{selectedVehicle.inventoryStatus}</div>
                  <div className="type-support text-slate-600 tabular-nums">
                    {selectedVehicle.maintenanceLogs?.length || 0} service records
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1E. VEHICLE IMAGES & 3D EMBED */}
          {fleetSubTab === 'images' && selectedVehicle && (
            <div className="admin-panel p-6 sm:p-8 space-y-5">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="type-h3 text-slate-900">
                  3D Digital Studio Asset — {selectedVehicle.name}
                </h3>
                <p className="type-body text-slate-600 mt-1">
                  Interactive 3D model embed preview used across guest portals and vehicle customizer.
                </p>
              </div>

              <div className="aspect-16/9 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center relative">
                {selectedVehicle.id === 'nissan-terra-2020' ? (
                  <iframe
                    title="Nissan Terra 2020"
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/46727bb6f4f84df5878bed50c58a70bf/embed"
                  />
                ) : (
                  <iframe
                    title="2019 Skoda Karoq"
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/7e359874ebe744158eddc37c9da8f487/embed"
                  />
                )}
              </div>
            </div>
          )}

          {/* 1F. VEHICLE DOCUMENTS */}
          {fleetSubTab === 'documents' && selectedVehicle && (
            <div className="admin-panel p-6 sm:p-8 space-y-5">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="type-h3 text-slate-900">
                  Compliance &amp; Documents — {selectedVehicle.name}
                </h3>
                <p className="type-body text-slate-600 mt-1">
                  California DMV registrations, commercial fleet insurance, and smog certificates.
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {[
                  { title: 'California DMV Registration', type: 'Registration Card', plate: selectedVehicle.licensePlate, expires: '2027-08-31', status: 'Valid' },
                  { title: 'Commercial Fleet Policy #TRAV-CA-9921', type: 'Proof of Insurance', plate: selectedVehicle.licensePlate, expires: '2027-10-15', status: 'Valid' },
                  { title: 'California Annual Smog Certification', type: 'Inspection Certificate', plate: selectedVehicle.licensePlate, expires: '2027-06-30', status: 'Valid' },
                ].map((doc, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <FileText className="w-5 h-5 text-[#14616d] shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900 block">{doc.title}</span>
                        <span className="type-support text-slate-500 tabular-nums">
                          {doc.type} · Expires {doc.expires}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 type-support font-semibold text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{doc.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          2. FLEET BOOKINGS
         ======================================================== */}
      {activeModule === 'bookings' && (
        <div className="admin-panel overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200">
            <div>
              <h3 className="type-h3 text-slate-900">Fleet Rental Bookings</h3>
              <p className="type-body text-slate-600 mt-1">
                Manage pending, confirmed, active rentals, completed, and cancelled bookings.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Vehicle</th>
                  <th>Guest &amp; Phone</th>
                  <th>Dates</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter((b) => b.type === 'car-rental')
                  .map((b) => (
                    <tr key={b.id}>
                      <td className="font-mono font-semibold text-[#14616d]">{b.id}</td>
                      <td className="font-semibold text-slate-900">{b.targetTitle}</td>
                      <td>
                        <div className="font-semibold text-slate-900">{b.guestName}</div>
                        <div className="type-support text-slate-500">{b.guestPhone || b.guestEmail}</div>
                      </td>
                      <td className="text-slate-600 tabular-nums whitespace-nowrap">
                        {b.startDate} → {b.endDate} ({b.totalDays}d)
                      </td>
                      <td className="font-semibold text-[#14616d] tabular-nums whitespace-nowrap">
                        ${b.amountUsd?.toLocaleString()}
                      </td>
                      <td>
                        <span className="type-support font-semibold text-sky-700 capitalize">
                          {b.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          {b.status !== 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                              className="btn btn-primary btn-sm"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                              className="btn btn-outline btn-sm"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          3. AVAILABILITY & CALENDAR
         ======================================================== */}
      {activeModule === 'availability' && (
        <div className="space-y-6">
          <div className="admin-panel p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="type-h3 text-slate-900">
                  Fleet Availability &amp; Dispatch Timeline
                </h3>
                <p className="type-body text-slate-600 mt-1">
                  Real-time status tracking for Airport Terminal and Suite Curbside Deliveries Nationwide.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMonth('October 2026')}
                  aria-label="Previous month"
                  className="btn btn-outline btn-sm px-2.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="type-nav text-slate-900 min-w-[130px] text-center">{currentMonth}</span>
                <button
                  type="button"
                  onClick={() => setCurrentMonth('December 2026')}
                  aria-label="Next month"
                  className="btn btn-outline btn-sm px-2.5"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid of Vehicle Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vehicles.map((v) => (
                <div key={v.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 truncate">{v.name}</span>
                    <span
                      className={`type-support font-semibold capitalize shrink-0 ${
                        v.inventoryStatus === 'available'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {v.inventoryStatus}
                    </span>
                  </div>
                  <div className="type-support text-slate-600">{v.hubLocation}</div>
                  <div className="type-support font-mono font-semibold text-[#14616d]">{v.licensePlate}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked Dates Manager */}
          <div className="admin-panel p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="type-h4 text-slate-900">
                  Maintenance &amp; Blackout Date Blocks
                </h3>
                <p className="type-support text-slate-600 mt-1">
                  Prevent bookings during routine servicing, executive holds, or VIP reserve.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddBlockedDate} className="flex flex-wrap gap-3">
              <select
                aria-label="Select vehicle for blackout block"
                value={newBlockVehicleId}
                onChange={(e) => setNewBlockVehicleId(e.target.value)}
                className="form-select sm:w-56"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Dates (e.g. 2026-11-20 to 2026-11-22)"
                value={newBlockDates}
                onChange={(e) => setNewBlockDates(e.target.value)}
                className="form-input sm:w-72 tabular-nums"
              />
              <input
                type="text"
                placeholder="Reason (e.g. Brake replacement)"
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                className="form-input flex-1 min-w-[200px]"
              />
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Block
              </button>
            </form>

            <div className="divide-y divide-slate-200 pt-2 border-t border-slate-200">
              {blockedDates.map((b) => (
                <div key={b.id} className="py-3.5 flex items-center justify-between gap-4 type-support">
                  <div>
                    <span className="font-semibold text-slate-900 mr-2">
                      {vehicles.find((v) => v.id === b.vehicleId)?.name || b.vehicleId}
                    </span>
                    <span className="font-mono text-[#14616d] font-semibold mr-2 tabular-nums">
                      · {b.dates}
                    </span>
                    <span className="text-slate-600">({b.reason})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBlockedDates(blockedDates.filter((x) => x.id !== b.id))}
                    aria-label="Remove blackout block"
                    className="text-rose-600 hover:text-rose-800 p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. PRICING & SURCHARGES
         ======================================================== */}
      {activeModule === 'pricing' && (
        <div className="space-y-6">
          <div className="admin-panel overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="type-h3 text-slate-900">
                Vehicle Rate Matrix
              </h3>
              <p className="type-body text-slate-600 mt-1">
                Tiered rate cards configured for nationwide guest stays.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Daily (1–6 Days)</th>
                    <th>Weekly (7–29 Days)</th>
                    <th>Monthly (30+ Days)</th>
                    <th>Savings vs Daily</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => {
                    const monthlyDailyEquivalent = Math.round(v.monthlyRate / 30);
                    const savingsPercent = Math.round(((v.dailyRate - monthlyDailyEquivalent) / v.dailyRate) * 100);
                    return (
                      <tr key={v.id}>
                        <td className="font-semibold text-slate-900">{v.name}</td>
                        <td className="font-semibold text-[#14616d] tabular-nums">${v.dailyRate} / day</td>
                        <td className="font-semibold text-slate-900 tabular-nums">${v.weeklyRate} / week</td>
                        <td className="font-semibold text-slate-900 tabular-nums">${v.monthlyRate.toLocaleString()} / month</td>
                        <td className="text-emerald-700 font-semibold tabular-nums">{savingsPercent}% Corporate Discount</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Fees */}
          <div className="admin-panel p-6 space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="type-h4 text-slate-900">
                Additional Fees &amp; Surcharges
              </h3>
              <p className="type-support text-slate-600 mt-1">
                Mandatory deposits, doorstep delivery, and optional waivers.
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {pricingFees.map((fee) => (
                <div key={fee.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{fee.name}</span>
                      {fee.isMandatory && (
                        <span className="type-support font-semibold text-amber-700">
                          · Mandatory
                        </span>
                      )}
                    </div>
                    <p className="type-support text-slate-600 mt-1">{fee.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="type-h4 text-[#14616d] tabular-nums">${fee.amount}</span>
                    <span className="type-support text-slate-500 block">{fee.type.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. FLEET MANAGEMENT
         ======================================================== */}
      {activeModule === 'fleet-management' && (
        <div className="space-y-6">
          {/* Multi-point inspections */}
          <div className="admin-panel p-6 space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="type-h3 text-slate-900">
                Multi-Point Safety Inspections
              </h3>
              <p className="type-body text-slate-600 mt-1">
                Pre-departure and post-return safety checks for brakes, tires, fluids, and interior sanitation.
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {inspections.map((insp) => (
                <div key={insp.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-900">
                        {vehicles.find((v) => v.id === insp.vehicleId)?.name || insp.vehicleId}
                      </span>
                      <span className="type-support text-slate-500 tabular-nums">
                        · Inspected on {insp.date}
                      </span>
                    </div>
                    <p className="type-support text-slate-600">Notes: {insp.notes}</p>
                    <span className="type-support text-[#14616d] font-medium block">
                      Audited by: {insp.inspector}
                    </span>
                  </div>
                  <span className="type-support font-semibold text-emerald-700 shrink-0">
                    Passed (100%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service History & Maintenance */}
          <div className="admin-panel p-6 space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="type-h4 text-slate-900">
                Service History &amp; Work Orders
              </h3>
              <p className="type-support text-slate-600 mt-1">
                Itemized maintenance ledger with authorized repair facilities and parts cost.
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {vehicles.flatMap((v) =>
                (v.maintenanceLogs || []).map((log) => (
                  <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900 block">{log.serviceType}</span>
                      <span className="type-support text-slate-500 block">
                        Vehicle: {v.name} ({v.licensePlate}) · Facility: {log.performedBy}
                      </span>
                      <p className="type-support text-slate-600 mt-1">{log.notes}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="type-h4 text-[#14616d] tabular-nums block">${log.costUsd}</span>
                      <span className="type-support text-slate-500 tabular-nums block">
                        {new Date(log.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. RENTAL SETTINGS
         ======================================================== */}
      {activeModule === 'settings' && (
        <div className="admin-panel p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="type-h3 text-slate-900">
              Fleet Rental Policies &amp; Hub Locations
            </h3>
            <p className="type-body text-slate-600 mt-1">
              Configure driver age restrictions, delivery radius, and terminal hubs.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            <div className="py-5 first:pt-0 space-y-2.5">
              <h4 className="type-h4 text-slate-900">Driver Eligibility &amp; Requirements</h4>
              <ul className="list-disc pl-5 type-body text-slate-600 space-y-1.5">
                <li>Minimum driver age: 21+ with verified US or International driver license.</li>
                <li>Complimentary 100 miles/day included; $0.35/mile excess thereafter.</li>
                <li>Full-to-full fuel policy (returned at same fuel level as dispatched).</li>
                <li>Non-smoking fleet: $250 sanitization fee strictly enforced.</li>
              </ul>
            </div>

            <div className="py-5 space-y-3">
              <h4 className="type-h4 text-slate-900">Designated Pickup Locations</h4>
              <div className="space-y-2.5 type-body text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#14616d] mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Major US Airport Hubs (Airport Concierge Delivery)</span>
                    <span> — Terminals Curbside Handover</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#14616d] mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Direct Residence Curbside Delivery</span>
                    <span> — Complimentary doorstep parking bay at Reserved Suites</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#14616d] mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Regional Transit &amp; Executive FBO Hubs</span>
                    <span> — VIP Chauffeur Lane &amp; Private Jet Handover</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-5 last:pb-0 space-y-2">
              <h4 className="type-h4 text-slate-900">Doorstep Delivery Parameters</h4>
              <p className="type-body text-slate-600">
                Vehicles delivered directly to guest suites at no extra charge if reservation exceeds 14 days. Transparent flat delivery fee applies for short-stay or off-hub dispatches.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
