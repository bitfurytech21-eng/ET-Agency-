import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit3,
  Eye,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Trash2,
  X,
  Search,
} from 'lucide-react';
import type { AdminProperty } from './adminTypes';

interface AdminPropertiesProps {
  properties: AdminProperty[];
  onUpdateProperty: (updated: AdminProperty) => void;
  onAddProperty?: (newProp: AdminProperty) => void;
}

export const AdminProperties: React.FC<AdminPropertiesProps> = ({
  properties,
  onUpdateProperty,
  onAddProperty,
}) => {
  const [subTab, setSubTab] = useState<'index' | 'add' | 'edit' | 'details' | 'images' | 'amenities'>('index');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || 'unit-91');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Edit form state
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const [editForm, setEditForm] = useState<AdminProperty | null>(null);

  // New Property form state
  const [newProp, setNewProp] = useState<Partial<AdminProperty>>({
    id: `unit-${Math.floor(Math.random() * 900 + 100)}`,
    unitNumber: 'Unit 412',
    title: 'Executive Lakeview Penthouse (Residence F)',
    category: 'Furnished Residence • Short & Extended Stays',
    monthlyRate: 3100,
    minimumStayDays: 5,
    status: 'Available',
    shortDesc: 'Modern upper-level executive suite with panoramic sunset views, private balcony, and gourmet kitchen.',
    fullDesc: 'Tailored for traveling physicians, executive consultants, and relocating families, this brand new suite offers step-free elevator access, sound-damped workspace, and resort-grade amenities across premier nationwide travel corridors.',
    pricingNote: 'All utilities, high-speed Wi-Fi, and reserved covered parking included.',
    bedrooms: 2,
    bathrooms: 2,
    sqft: '950 sq ft',
    images: selectedProperty?.images?.slice(0, 5) || [],
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'In-Unit Washer/Dryer', 'Private Patio', 'Workspace'],
  });

  // Amenities Manager State
  const [amenityCategories, setAmenityCategories] = useState<{ [category: string]: string[] }>({
    'Kitchen & Dining': ['Full Chef Kitchen', 'Stainless Appliances', 'Gourmet Cookware', 'Keurig & Drip Coffee', 'Dishwasher', 'Microwave'],
    'Workspace & Tech': ['High-Speed Fiber WiFi (400+ Mbps)', 'Ergonomic Desk & Chair', 'Smart TVs (Living & Bed)', 'Keyless Smart Lock', 'Surge Protected Power'],
    'Comfort & Bedding': ['Luxury King Mattress', 'Hypoallergenic Linens', 'Wood-Burning Fireplace', 'Central Air & Heating', 'In-Unit Washer & Dryer'],
    'Community & Wellness': ['Resort Swimming Pool', 'Heated Jacuzzi Spa', 'Fitness Athletic Club', 'Tennis & Pickleball Courts', 'Reserved Covered Parking'],
  });
  const [newAmenityName, setNewAmenityName] = useState('');
  const [selectedAmenityCategory, setSelectedAmenityCategory] = useState('Kitchen & Dining');

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleStartEdit = (prop: AdminProperty) => {
    setSelectedPropertyId(prop.id);
    setEditForm({ ...prop });
    setSubTab('edit');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      onUpdateProperty(editForm);
      setSubTab('index');
    }
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProp.title && newProp.unitNumber && onAddProperty) {
      onAddProperty(newProp as AdminProperty);
      setSubTab('index');
    }
  };

  const handleAddAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenityName.trim()) return;
    setAmenityCategories((prev) => ({
      ...prev,
      [selectedAmenityCategory]: [...(prev[selectedAmenityCategory] || []), newAmenityName.trim()],
    }));
    setNewAmenityName('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Bar matching admin/properties/*.php */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'index', label: 'All Residences (index.php)', icon: Building2 },
            { id: 'add', label: 'Add Residence (add-property.php)', icon: Plus },
            { id: 'edit', label: 'Edit Residence (edit-property.php)', icon: Edit3 },
            { id: 'details', label: 'Property Details (property-details.php)', icon: Eye },
            { id: 'images', label: 'Photo Gallery & Assets (property-images.php)', icon: ImageIcon },
            { id: 'amenities', label: 'Amenities Catalog (amenities.php)', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id as typeof subTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  active
                    ? 'bg-[#82634f] text-white border-[#82634f] shadow-xs'
                    : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:border-[#82634f]/40 hover:text-[#282828]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick selector for property context */}
        {selectedProperty && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#857568]">Selected:</span>
            <select
              value={selectedPropertyId}
              onChange={(e) => {
                setSelectedPropertyId(e.target.value);
                const found = properties.find((p) => p.id === e.target.value);
                if (found) setEditForm({ ...found });
              }}
              className="bg-white border border-[#dfd6ca] rounded-lg px-2.5 py-1 font-bold text-[#282828] text-xs outline-none focus:border-[#00b7a8]"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.unitNumber} — {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 1. INDEX: ALL PROPERTIES TABLE */}
      {subTab === 'index' && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#282828]">Nationwide Portfolio Directory</h3>
              <p className="text-xs text-[#5c5046]">
                Manage verified corporate residences across California’s homes agency portfolio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#857568] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search unit or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg text-xs outline-none focus:border-[#00b7a8]"
                />
              </div>

              <button
                type="button"
                onClick={() => setSubTab('add')}
                className="px-3 py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Property</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
                <tr>
                  <th className="py-3 px-3">Unit &amp; Residence</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Monthly Rate</th>
                  <th className="py-3 px-3">Min Stay</th>
                  <th className="py-3 px-3">Photos</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5]">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-[#fbf9f6] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                          alt={prop.title}
                          className="w-12 h-10 object-cover rounded-md border border-[#e6dfd5] shrink-0"
                        />
                        <div>
                          <span className="font-mono font-bold text-[#82634f] block">{prop.unitNumber}</span>
                          <span className="font-bold text-[#282828] line-clamp-1">{prop.title}</span>
                          <span className="text-[11px] text-[#857568]">{prop.sqft || '680-990 sq ft'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#5c5046]">{prop.category}</td>
                    <td className="py-3 px-3 font-bold text-[#00897d] tabular-nums">
                      ${prop.monthlyRate?.toLocaleString()} / mo
                    </td>
                    <td className="py-3 px-3 text-[#5c5046] tabular-nums">{prop.minimumStayDays || 5} nights</td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPropertyId(prop.id);
                          setSubTab('images');
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f5efe8] hover:bg-[#ebdccb] text-[#82634f] font-bold text-[11px] cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>{prop.images?.length || 0} Photos</span>
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          prop.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPropertyId(prop.id);
                            setSubTab('details');
                          }}
                          title="View Details"
                          className="p-1.5 rounded bg-white hover:bg-[#faf8f5] text-[#5c5046] border border-[#dfd6ca] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(prop)}
                          title="Edit Residence"
                          className="p-1.5 rounded bg-[#e8f8f6] hover:bg-[#d0f2ed] text-[#00897d] border border-[#bfe8e3] cursor-pointer"
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

      {/* 2. ADD PROPERTY (add-property.php) */}
      {subTab === 'add' && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-[#e6dfd5] pb-4">
            <h3 className="font-heading font-bold text-lg text-[#282828]">Add New Residence (add-property.php)</h3>
            <p className="text-xs text-[#5c5046]">
              Publish a new corporate apartment or mid-term suite into the public catalog and booking engine.
            </p>
          </div>

          <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Unit Number / Identifier</label>
                <input
                  type="text"
                  required
                  value={newProp.unitNumber}
                  onChange={(e) => setNewProp({ ...newProp, unitNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-mono"
                  placeholder="e.g. Unit 412"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Residence Title</label>
                <input
                  type="text"
                  required
                  value={newProp.title}
                  onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                  placeholder="e.g. Executive Lakeview Penthouse"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Monthly Rate ($ USD)</label>
                <input
                  type="number"
                  required
                  value={newProp.monthlyRate}
                  onChange={(e) => setNewProp({ ...newProp, monthlyRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Minimum Stay (Nights)</label>
                <input
                  type="number"
                  required
                  value={newProp.minimumStayDays}
                  onChange={(e) => setNewProp({ ...newProp, minimumStayDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Square Footage</label>
                <input
                  type="text"
                  value={newProp.sqft}
                  onChange={(e) => setNewProp({ ...newProp, sqft: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                  placeholder="e.g. 950 sq ft"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#5c5046] font-bold mb-1">Short Description (Cards &amp; Search)</label>
              <textarea
                rows={2}
                value={newProp.shortDesc}
                onChange={(e) => setNewProp({ ...newProp, shortDesc: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[#5c5046] font-bold mb-1">Full Editorial Description</label>
              <textarea
                rows={3}
                value={newProp.fullDesc}
                onChange={(e) => setNewProp({ ...newProp, fullDesc: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setSubTab('index')}
                className="px-4 py-2 border border-[#dfd6ca] rounded-lg text-[#5c5046] hover:bg-[#faf8f5] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Listing</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. EDIT PROPERTY (edit-property.php) */}
      {subTab === 'edit' && editForm && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Edit {editForm.unitNumber}: {editForm.title} (edit-property.php)
              </h3>
              <p className="text-xs text-[#5c5046]">Modify rates, policies, and listing descriptions.</p>
            </div>
            <button
              onClick={() => setSubTab('index')}
              className="p-1.5 text-[#857568] hover:text-[#282828] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Unit Number</label>
                <input
                  type="text"
                  value={editForm.unitNumber}
                  onChange={(e) => setEditForm({ ...editForm, unitNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Monthly Rate ($ USD)</label>
                <input
                  type="number"
                  value={editForm.monthlyRate}
                  onChange={(e) => setEditForm({ ...editForm, monthlyRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Min Stay (Nights)</label>
                <input
                  type="number"
                  value={editForm.minimumStayDays}
                  onChange={(e) => setEditForm({ ...editForm, minimumStayDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as AdminProperty['status'] })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-bold"
                >
                  <option value="Available">Available</option>
                  <option value="Inquired">Inquired</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#5c5046] font-bold mb-1">Short Description</label>
              <textarea
                rows={2}
                value={editForm.shortDesc}
                onChange={(e) => setEditForm({ ...editForm, shortDesc: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[#5c5046] font-bold mb-1">Full Description</label>
              <textarea
                rows={4}
                value={editForm.fullDesc}
                onChange={(e) => setEditForm({ ...editForm, fullDesc: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setSubTab('index')}
                className="px-4 py-2 border border-[#dfd6ca] rounded-lg text-[#5c5046] hover:bg-[#faf8f5] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#82634f] hover:bg-[#6e5240] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. PROPERTY DETAILS (property-details.php) */}
      {subTab === 'details' && selectedProperty && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono px-2 py-0.5 rounded bg-[#f5efe8] text-[#82634f] font-bold text-xs">
                  {selectedProperty.unitNumber}
                </span>
                <span className="text-xs uppercase font-bold text-[#00897d]">{selectedProperty.category}</span>
              </div>
              <h3 className="text-xl font-heading font-black text-[#282828] mt-1">{selectedProperty.title}</h3>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleStartEdit(selectedProperty)}
                className="px-3 py-1.5 bg-[#82634f] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Specs</span>
              </button>
              <button
                type="button"
                onClick={() => setSubTab('images')}
                className="px-3 py-1.5 bg-[#00b7a8] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Manage {selectedProperty.images?.length || 0} Photos</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden border border-[#e6dfd5] relative">
                <img
                  src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-xs text-white rounded-md text-xs font-bold">
                  {selectedProperty.images?.length} Verified Photos
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#282828] mb-1">Residence Summary</h4>
                <p className="text-xs text-[#5c5046] leading-relaxed">{selectedProperty.fullDesc}</p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#282828] mb-2">Amenities Included</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedProperty.amenities || ['WiFi', 'Smart TV', 'Air Conditioning', 'Fireplace', 'Washer/Dryer', 'Covered Parking']).map(
                    (am, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-[#faf8f5] border border-[#dfd6ca] text-[11px] font-semibold text-[#5c5046]"
                      >
                        {am}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-xl p-5 space-y-4 text-xs">
              <h4 className="font-heading font-bold text-sm text-[#282828] border-b border-[#e6dfd5] pb-2">
                Leasing &amp; Occupancy Specs
              </h4>

              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[#857568]">Monthly Base Rate:</span>
                  <span className="font-bold text-[#00897d] tabular-nums">${selectedProperty.monthlyRate?.toLocaleString()} / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#857568]">Minimum Stay:</span>
                  <span className="font-semibold text-[#282828]">{selectedProperty.minimumStayDays} nights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#857568]">Bedrooms / Baths:</span>
                  <span className="font-semibold text-[#282828]">
                    {selectedProperty.bedrooms || 1} Bed / {selectedProperty.bathrooms || 1} Bath
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#857568]">Dimensions:</span>
                  <span className="font-semibold text-[#282828]">{selectedProperty.sqft || '700 sq ft'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#857568]">Current Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px]">
                    {selectedProperty.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e6dfd5] space-y-2">
                <span className="font-bold text-[#282828] block">Community Inclusions:</span>
                <p className="text-[11px] text-[#857568] leading-relaxed">
                  All utilities (electric, gas, water, trash), unlimited 400Mbps Wi-Fi, swimming pool and fitness club keycards, and one reserved covered carport.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PROPERTY IMAGES (property-images.php) */}
      {subTab === 'images' && selectedProperty && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Asset &amp; Photography Manager: {selectedProperty.unitNumber} (property-images.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Review all {selectedProperty.images?.length || 0} high-resolution photographs for this residence.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#857568]">Viewing Unit:</span>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="bg-[#faf8f5] border border-[#dfd6ca] rounded-lg px-2.5 py-1 text-xs font-bold"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.unitNumber} ({p.images?.length || 0} Photos)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {selectedProperty.images?.map((imgUrl, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden border border-[#e6dfd5] bg-[#faf8f5] aspect-4/3 shadow-2xs hover:shadow-md transition-shadow"
              >
                <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-white text-[#282828] rounded-md text-xs font-bold hover:bg-neutral-100"
                    title="Open Full Resolution"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                  #{idx + 1}
                </span>
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#00b7a8] text-white text-[9px] font-black uppercase tracking-wider">
                    Hero Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. AMENITIES (amenities.php) */}
      {subTab === 'amenities' && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Executive Housing Amenities Catalog (amenities.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Standardize amenities across executive residences nationwide for medical and corporate travelers.
              </p>
            </div>

            <form onSubmit={handleAddAmenity} className="flex gap-2">
              <select
                value={selectedAmenityCategory}
                onChange={(e) => setSelectedAmenityCategory(e.target.value)}
                className="bg-[#faf8f5] border border-[#dfd6ca] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#5c5046]"
              >
                {Object.keys(amenityCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="New amenity..."
                value={newAmenityName}
                onChange={(e) => setNewAmenityName(e.target.value)}
                className="px-3 py-1.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg text-xs outline-none focus:border-[#00b7a8]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#00b7a8] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(amenityCategories).map(([category, items]) => (
              <div key={category} className="p-5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-[#282828]">{category}</h4>
                  <span className="text-[11px] font-bold text-[#82634f] bg-white px-2 py-0.5 rounded border border-[#dfd6ca]">
                    {items.length} Amenities
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {items.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#dfd6ca] rounded-lg text-xs text-[#282828] font-medium shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-[#00b7a8]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
