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
      {/* Primary Modules Bar matching admin/car-rentals/ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'fleet', label: 'Fleet Inventory (fleet/)', icon: Car },
            { id: 'bookings', label: 'Fleet Bookings (bookings/)', icon: Calendar },
            { id: 'availability', label: 'Availability & Calendar (availability/)', icon: Clock },
            { id: 'pricing', label: 'Pricing & Surcharges (pricing/)', icon: DollarSign },
            { id: 'fleet-management', label: 'Fleet Management (fleet-management/)', icon: Wrench },
            { id: 'settings', label: 'Rental Settings (settings/)', icon: Settings },
          ].map((mod) => {
            const Icon = mod.icon;
            const active = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModule(mod.id as typeof activeModule)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  active
                    ? 'bg-[#82634f] text-white border-[#82634f] shadow-xs'
                    : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:border-[#82634f]/40 hover:text-[#282828]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Vehicle Selector for contextual views */}
        {selectedVehicle && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#857568]">Vehicle:</span>
            <select
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                const found = vehicles.find((v) => v.id === e.target.value);
                if (found) setEditForm({ ...found });
              }}
              className="bg-white border border-[#dfd6ca] rounded-lg px-2.5 py-1 font-bold text-[#282828] text-xs outline-none focus:border-[#00b7a8]"
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
          1. FLEET INVENTORY (admin/car-rentals/fleet/)
         ======================================================== */}
      {activeModule === 'fleet' && (
        <div className="space-y-5">
          {/* Sub-tabs for Fleet */}
          <div className="flex flex-wrap gap-2 border-b border-[#e6dfd5] pb-2.5">
            {[
              { id: 'index', label: 'Vehicles Directory (index.php)' },
              { id: 'add', label: 'Add Vehicle (add-vehicle.php)' },
              { id: 'edit', label: 'Edit Vehicle (edit-vehicle.php)' },
              { id: 'details', label: 'Vehicle Details (vehicle-details.php)' },
              { id: 'images', label: 'Vehicle Images & 3D (vehicle-images.php)' },
              { id: 'documents', label: 'Compliance & Docs (vehicle-documents.php)' },
            ].map((tab) => {
              const active = fleetSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFleetSubTab(tab.id as typeof fleetSubTab)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border ${
                    active ? 'bg-[#00b7a8] text-white border-[#00b7a8]' : 'bg-white text-[#5c5046] border-[#e6dfd5]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 1A. FLEET INDEX TABLE */}
          {fleetSubTab === 'index' && (
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
                <div>
                  <h3 className="font-heading font-bold text-base text-[#282828]">Executive Fleet Directory</h3>
                  <p className="text-xs text-[#5c5046]">
                    Active vehicles stationed across nationwide hubs, airport terminals, and suites.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFleetSubTab('add')}
                  className="px-3 py-1.5 bg-[#00b7a8] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Vehicle</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
                    <tr>
                      <th className="py-3 px-3">Vehicle &amp; Make</th>
                      <th className="py-3 px-3">License &amp; Hub</th>
                      <th className="py-3 px-3">Daily Rate</th>
                      <th className="py-3 px-3">Weekly Rate</th>
                      <th className="py-3 px-3">Monthly Rate</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6dfd5]">
                    {vehicles.map((veh) => (
                      <tr key={veh.id} className="hover:bg-[#fbf9f6] transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-[#282828]">{veh.name}</div>
                          <div className="text-[11px] text-[#5c5046]">{veh.category} • Year {veh.year}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-[#82634f] block">{veh.licensePlate}</span>
                          <span className="text-[11px] text-[#857568] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#00b7a8]" />
                            {veh.hubLocation}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-[#00897d] tabular-nums">${veh.dailyRate} / day</td>
                        <td className="py-3 px-3 font-semibold text-[#282828] tabular-nums">${veh.weeklyRate} / wk</td>
                        <td className="py-3 px-3 font-semibold text-[#282828] tabular-nums">${veh.monthlyRate} / mo</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              veh.inventoryStatus === 'available'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : veh.inventoryStatus === 'rented'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {veh.inventoryStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedVehicleId(veh.id);
                                setFleetSubTab('details');
                              }}
                              className="p-1.5 bg-white text-[#5c5046] hover:bg-[#faf8f5] rounded border border-[#dfd6ca] cursor-pointer"
                              title="Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(veh)}
                              className="p-1.5 bg-[#e8f8f6] text-[#00897d] hover:bg-[#d0f2ed] rounded border border-[#bfe8e3] cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
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
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-5">
              <div className="border-b border-[#e6dfd5] pb-3">
                <h3 className="font-heading font-bold text-lg text-[#282828]">Add Fleet Vehicle (add-vehicle.php)</h3>
                <p className="text-xs text-[#5c5046]">Onboard a new vehicle to the nationwide executive rental fleet.</p>
              </div>

              <form onSubmit={handleCreateVehicle} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">Make &amp; Model Name</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">License Plate</label>
                    <input
                      type="text"
                      required
                      value={newVehicle.licensePlate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">Daily Rate ($)</label>
                    <input
                      type="number"
                      required
                      value={newVehicle.dailyRate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, dailyRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">Weekly Rate ($)</label>
                    <input
                      type="number"
                      required
                      value={newVehicle.weeklyRate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, weeklyRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">Monthly Rate ($)</label>
                    <input
                      type="number"
                      required
                      value={newVehicle.monthlyRate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, monthlyRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Station Hub Location</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.hubLocation}
                    onChange={(e) => setNewVehicle({ ...newVehicle, hubLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setFleetSubTab('index')}
                    className="px-4 py-2 border border-[#dfd6ca] rounded-lg text-[#5c5046]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00b7a8] text-white rounded-lg font-bold"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 1C. EDIT VEHICLE */}
          {fleetSubTab === 'edit' && editForm && (
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-5">
              <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
                <h3 className="font-heading font-bold text-lg text-[#282828]">
                  Edit {editForm.name} (edit-vehicle.php)
                </h3>
                <button onClick={() => setFleetSubTab('index')} className="text-[#857568]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">Vehicle Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">License Plate</label>
                    <input
                      type="text"
                      value={editForm.licensePlate}
                      onChange={(e) => setEditForm({ ...editForm, licensePlate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">Daily Rate ($)</label>
                    <input
                      type="number"
                      value={editForm.dailyRate}
                      onChange={(e) => setEditForm({ ...editForm, dailyRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">Weekly Rate ($)</label>
                    <input
                      type="number"
                      value={editForm.weeklyRate}
                      onChange={(e) => setEditForm({ ...editForm, weeklyRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5c5046] font-bold mb-1">Inventory Status</label>
                    <select
                      value={editForm.inventoryStatus}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          inventoryStatus: e.target.value as AdminVehicle['inventoryStatus'],
                        })
                      }
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-bold"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setFleetSubTab('index')}
                    className="px-4 py-2 border border-[#dfd6ca] rounded-lg text-[#5c5046]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#82634f] text-white rounded-lg font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 1D. VEHICLE DETAILS */}
          {fleetSubTab === 'details' && selectedVehicle && (
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#82634f]">{selectedVehicle.licensePlate}</span>
                  <h3 className="font-heading font-black text-xl text-[#282828]">{selectedVehicle.name}</h3>
                  <p className="text-xs text-[#5c5046]">{selectedVehicle.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEdit(selectedVehicle)}
                    className="px-3 py-1.5 bg-[#82634f] text-white text-xs font-bold rounded-lg"
                  >
                    Edit Vehicle
                  </button>
                  <button
                    onClick={() => setFleetSubTab('images')}
                    className="px-3 py-1.5 bg-[#00b7a8] text-white text-xs font-bold rounded-lg"
                  >
                    View 3D Model
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
                  <span className="font-bold text-[#857568] uppercase text-[10px]">Rental Pricing</span>
                  <div className="text-base font-bold text-[#00897d]">${selectedVehicle.dailyRate} / day</div>
                  <div className="text-[#5c5046]">${selectedVehicle.weeklyRate} / week · ${selectedVehicle.monthlyRate} / mo</div>
                </div>

                <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
                  <span className="font-bold text-[#857568] uppercase text-[10px]">Station &amp; Mileage</span>
                  <div className="font-semibold text-[#282828]">{selectedVehicle.hubLocation}</div>
                  <div className="text-[#5c5046]">{selectedVehicle.mileage.toLocaleString()} total miles</div>
                </div>

                <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
                  <span className="font-bold text-[#857568] uppercase text-[10px]">Fleet Status</span>
                  <div className="font-bold uppercase text-emerald-700">{selectedVehicle.inventoryStatus}</div>
                  <div className="text-[#5c5046]">{selectedVehicle.maintenanceLogs?.length || 0} service records</div>
                </div>
              </div>
            </div>
          )}

          {/* 1E. VEHICLE IMAGES & 3D EMBED */}
          {fleetSubTab === 'images' && selectedVehicle && (
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="border-b border-[#e6dfd5] pb-3">
                <h3 className="font-heading font-bold text-lg text-[#282828]">
                  3D Digital Studio Asset: {selectedVehicle.name} (vehicle-images.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Interactive 3D model embed preview used across guest portals and vehicle customizer.
                </p>
              </div>

              <div className="aspect-16/9 bg-neutral-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center relative">
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
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="border-b border-[#e6dfd5] pb-3">
                <h3 className="font-heading font-bold text-lg text-[#282828]">
                  Compliance &amp; Documents: {selectedVehicle.name} (vehicle-documents.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  California DMV registrations, commercial fleet insurance, and smog certificates.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { title: 'California DMV Registration', type: 'Registration Card', plate: selectedVehicle.licensePlate, expires: '2027-08-31', status: 'Valid' },
                  { title: 'Commercial Fleet Policy #TRAV-CA-9921', type: 'Proof of Insurance', plate: selectedVehicle.licensePlate, expires: '2027-10-15', status: 'Valid' },
                  { title: 'California Annual Smog Certification', type: 'Inspection Certificate', plate: selectedVehicle.licensePlate, expires: '2027-06-30', status: 'Valid' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#82634f]" />
                      <div>
                        <span className="font-bold text-[#282828] block">{doc.title}</span>
                        <span className="text-[#857568] text-[11px]">{doc.type} • Expires {doc.expires}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          2. FLEET BOOKINGS (admin/car-rentals/bookings/)
         ======================================================== */}
      {activeModule === 'bookings' && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-[#282828]">Fleet Rental Bookings (bookings/)</h3>
              <p className="text-xs text-[#5c5046]">
                Manage pending, confirmed, active rentals, completed, and cancelled bookings.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
                <tr>
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Guest &amp; Phone</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5]">
                {bookings
                  .filter((b) => b.type === 'car-rental')
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-[#fbf9f6] transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#82634f]">{b.id}</td>
                      <td className="py-3 px-3 font-bold text-[#282828]">{b.targetTitle}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#282828]">{b.guestName}</div>
                        <div className="text-[11px] text-[#5c5046]">{b.guestPhone || b.guestEmail}</div>
                      </td>
                      <td className="py-3 px-3 text-[#5c5046]">
                        {b.startDate} → {b.endDate} ({b.totalDays}d)
                      </td>
                      <td className="py-3 px-3 font-bold text-[#00897d] tabular-nums">
                        ${b.amountUsd?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {b.status !== 'confirmed' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[11px] font-bold"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status !== 'completed' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                              className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-[11px] font-bold"
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
          3. AVAILABILITY & CALENDAR (admin/car-rentals/availability/)
         ======================================================== */}
      {activeModule === 'availability' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-[#282828]">
                  Fleet Availability &amp; Dispatch Timeline (calendar.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Real-time status tracking for Airport Terminal and Suite Curbside Deliveries Nationwide.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth('October 2026')}
                  className="p-1 rounded border border-[#dfd6ca] text-[#5c5046]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#282828] min-w-[110px] text-center">{currentMonth}</span>
                <button
                  onClick={() => setCurrentMonth('December 2026')}
                  className="p-1 rounded border border-[#dfd6ca] text-[#5c5046]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Grid of Vehicle Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {vehicles.map((v) => (
                <div key={v.id} className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#282828] truncate">{v.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        v.inventoryStatus === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {v.inventoryStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#857568]">{v.hubLocation}</div>
                  <div className="text-[11px] font-mono text-[#82634f]">{v.licensePlate}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked Dates Manager (blocked-dates.php) */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-[#282828]">
                  Maintenance &amp; Blackout Date Blocks (blocked-dates.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Prevent bookings during routine servicing, executive holds, or VIP reserve.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddBlockedDate} className="flex flex-wrap gap-2 text-xs">
              <select
                value={newBlockVehicleId}
                onChange={(e) => setNewBlockVehicleId(e.target.value)}
                className="px-3 py-1.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
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
                className="px-3 py-1.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg w-64"
              />
              <input
                type="text"
                placeholder="Reason (e.g. Brake replacement)"
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                className="px-3 py-1.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg flex-1"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#82634f] text-white rounded-lg font-bold"
              >
                Add Block
              </button>
            </form>

            <div className="space-y-2 text-xs">
              {blockedDates.map((b) => (
                <div key={b.id} className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#282828] mr-2">
                      {vehicles.find((v) => v.id === b.vehicleId)?.name || b.vehicleId}:
                    </span>
                    <span className="font-mono text-[#82634f] mr-2">{b.dates}</span>
                    <span className="text-[#5c5046]">({b.reason})</span>
                  </div>
                  <button
                    onClick={() => setBlockedDates(blockedDates.filter((x) => x.id !== b.id))}
                    className="text-rose-600 hover:text-rose-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. PRICING & SURCHARGES (admin/car-rentals/pricing/)
         ======================================================== */}
      {activeModule === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h3 className="font-heading font-bold text-base text-[#282828]">
                Vehicle Rate Matrix (daily-rates.php, weekly-rates.php, monthly-rates.php)
              </h3>
              <p className="text-xs text-[#5c5046]">Tiered rate cards configured for nationwide guest stays.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
                  <tr>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Daily (1-6 Days)</th>
                    <th className="py-3 px-3">Weekly (7-29 Days)</th>
                    <th className="py-3 px-3">Monthly (30+ Days)</th>
                    <th className="py-3 px-3">Savings vs Daily</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6dfd5]">
                  {vehicles.map((v) => {
                    const monthlyDailyEquivalent = Math.round(v.monthlyRate / 30);
                    const savingsPercent = Math.round(((v.dailyRate - monthlyDailyEquivalent) / v.dailyRate) * 100);
                    return (
                      <tr key={v.id} className="hover:bg-[#fbf9f6] transition-colors">
                        <td className="py-3 px-3 font-bold text-[#282828]">{v.name}</td>
                        <td className="py-3 px-3 font-bold text-[#00897d]">${v.dailyRate} / day</td>
                        <td className="py-3 px-3 font-semibold text-[#282828]">${v.weeklyRate} / week</td>
                        <td className="py-3 px-3 font-semibold text-[#282828]">${v.monthlyRate} / month</td>
                        <td className="py-3 px-3 text-emerald-700 font-bold">{savingsPercent}% Corporate Discount</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Fees (additional-fees.php) */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h3 className="font-heading font-bold text-base text-[#282828]">
                Additional Fees &amp; Surcharges (additional-fees.php)
              </h3>
              <p className="text-xs text-[#5c5046]">Mandatory deposits, doorstep delivery, and optional waivers.</p>
            </div>

            <div className="space-y-3 text-xs">
              {pricingFees.map((fee) => (
                <div key={fee.id} className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#282828]">{fee.name}</span>
                      {fee.isMandatory && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5c5046] mt-0.5">{fee.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#00897d]">${fee.amount}</span>
                    <span className="text-[10px] text-[#857568] block">{fee.type.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. FLEET MANAGEMENT (admin/car-rentals/fleet-management/)
         ======================================================== */}
      {activeModule === 'fleet-management' && (
        <div className="space-y-6">
          {/* Multi-point inspections (inspections.php) */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h3 className="font-heading font-bold text-base text-[#282828]">
                Multi-Point Safety Inspections (inspections.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Pre-departure and post-return safety checks for brakes, tires, fluids, and interior sanitation.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {inspections.map((insp) => (
                <div key={insp.id} className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-[#282828]">
                        {vehicles.find((v) => v.id === insp.vehicleId)?.name || insp.vehicleId}
                      </span>
                      <span className="text-[#857568] text-[11px]">• Inspected on {insp.date}</span>
                    </div>
                    <p className="text-[11px] text-[#5c5046]">Notes: {insp.notes}</p>
                    <span className="text-[10px] text-[#82634f] font-semibold">Audited by: {insp.inspector}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] border border-emerald-200">
                    Passed (100%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service History & Maintenance (service-history.php & maintenance.php) */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h3 className="font-heading font-bold text-base text-[#282828]">
                Service History &amp; Work Orders (service-history.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Itemized maintenance ledger with authorized repair facilities and parts cost.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {vehicles.flatMap((v) =>
                (v.maintenanceLogs || []).map((log) => (
                  <div key={log.id} className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#282828] block">{log.serviceType}</span>
                      <span className="text-[#857568] text-[11px]">
                        Vehicle: {v.name} ({v.licensePlate}) • Facility: {log.performedBy}
                      </span>
                      <p className="text-[#5c5046] text-[11px] mt-1">{log.notes}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#00897d] text-sm tabular-nums">${log.costUsd}</span>
                      <span className="text-[10px] text-[#857568] block">{new Date(log.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. RENTAL SETTINGS (admin/car-rentals/settings/)
         ======================================================== */}
      {activeModule === 'settings' && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-[#e6dfd5] pb-3">
            <h3 className="font-heading font-bold text-lg text-[#282828]">
              Fleet Rental Policies &amp; Hub Locations (settings/)
            </h3>
            <p className="text-xs text-[#5c5046]">
              Configure driver age restrictions, delivery radius, and terminal hubs.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-[#282828]">Driver Eligibility &amp; Requirements (rental-settings.php)</h4>
              <ul className="list-disc pl-5 text-[#5c5046] space-y-1">
                <li>Minimum driver age: 21+ with verified US/International driver license.</li>
                <li>Complimentary 100 miles/day included; $0.35/mile excess thereafter.</li>
                <li>Full-to-full fuel policy (returned at same fuel level as dispatched).</li>
                <li>Non-smoking fleet: $250 sanitization penalty strictly enforced.</li>
              </ul>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-[#282828]">Designated Pickup Locations (pickup-locations.php)</h4>
              <div className="space-y-2 text-[#5c5046]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00b7a8]" />
                  <span className="font-bold text-[#282828]">Major US Airport Hubs (Airport Concierge Delivery)</span>
                  <span>— Terminals Curbside Handover</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00b7a8]" />
                  <span className="font-bold text-[#282828]">Direct Residence Curbside Delivery</span>
                  <span>— Free doorstep parking bay at Reserved Suites</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00b7a8]" />
                  <span className="font-bold text-[#282828]">Regional Transit &amp; Executive FBO Hubs</span>
                  <span>— VIP Chauffeur Lane &amp; Private Jet Handover</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-[#282828]">Doorstep Delivery Parameters (delivery-settings.php)</h4>
              <p className="text-[#5c5046]">
                Vehicles delivered directly to guest suites at no extra charge if reservation exceeds 14 days. Transparent flat delivery fee applies for short-stay or off-hub dispatches.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
