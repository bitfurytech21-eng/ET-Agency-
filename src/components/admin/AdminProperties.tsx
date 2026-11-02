import React, { useEffect, useState } from 'react';
import {
  ArrowUp,
  Building2,
  Calendar,
  CheckCircle2,
  ConciergeBell,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  Video,
} from 'lucide-react';
import type { AdminProperty } from './adminTypes';
import {
  BedroomDetail,
  BlockedDateRange,
  CONCIERGE_CATEGORIES,
  PropertyReviewRecord,
  SeasonalPricingRule,
} from '../../data/propertyEnrichment';
import { getFallbackPropertyImage } from '../../data/lodgingData';

export interface AdminConciergeItem {
  id: string;
  sku: string;
  itemType: 'addon_service' | 'unit_package';
  category: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  priceUsd: number;
  billingUnitLabel: string;
  unitsIncluded?: number;
  image: string;
  available: boolean;
  maxQuantity: number;
  featured?: boolean;
  highlights: string[];
}

interface AdminPropertiesProps {
  properties: AdminProperty[];
  onUpdateProperty: (updated: AdminProperty) => void;
  onAddProperty?: (newProp: AdminProperty) => void;
  catalogItems?: AdminConciergeItem[];
  onCreateConciergeService?: (payload: {
    category: string;
    title: string;
    shortDesc: string;
    priceUsd: number;
    billingUnitLabel: string;
    image?: string;
  }) => Promise<void> | void;
  onToggleConciergeService?: (item: AdminConciergeItem) => Promise<void> | void;
  onDeleteConciergeService?: (item: AdminConciergeItem) => Promise<void> | void;
  reviews?: PropertyReviewRecord[];
  onDeleteReview?: (reviewId: string) => Promise<void> | void;
}

type SubTab =
  | 'index'
  | 'add'
  | 'edit'
  | 'images'
  | 'availability'
  | 'concierge'
  | 'reviews';

export const AdminProperties: React.FC<AdminPropertiesProps> = ({
  properties,
  onUpdateProperty,
  onAddProperty,
  catalogItems = [],
  onCreateConciergeService,
  onToggleConciergeService,
  onDeleteConciergeService,
  reviews = [],
  onDeleteReview,
}) => {
  const [subTab, setSubTab] = useState<SubTab>('index');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    properties[0]?.id || 'unit-91',
  );
  const [searchQuery, setSearchQuery] = useState('');

  const selectedProperty =
    properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const [editForm, setEditForm] = useState<AdminProperty | null>(
    selectedProperty ? { ...selectedProperty } : null,
  );

  useEffect(() => {
    const found = properties.find((p) => p.id === selectedPropertyId) || properties[0];
    if (found) {
      setEditForm({ ...found });
    }
  }, [selectedPropertyId, properties]);

  // Add New Property state
  const [newProp, setNewProp] = useState<Partial<AdminProperty>>({
    unitNumber: 'Unit 412',
    title: 'Executive Riverfront Suite',
    category: 'Furnished Residence',
    propertyType: 'Upper-Level Furnished Residence',
    verified: true,
    monthlyRate: 3100,
    minimumStayDays: 5,
    maximumStayDays: 365,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    sqft: '960 sq ft',
    floor: 'Upstairs',
    location: 'Rancho Cordova, CA',
    status: 'Available',
    shortDesc:
      'Quiet upper-level furnished residence with private balcony, equipped kitchen, and covered parking.',
    fullDesc:
      'Designed for extended corporate stays, family relocations, and short visits of 5+ nights. Includes utilities, 400+ Mbps Wi-Fi, in-unit laundry, and dedicated parking.',
    pricingNote: 'All utilities, 400+ Mbps Wi-Fi, and covered parking included.',
    videoTourUrl: '',
    images: selectedProperty?.images?.slice(0, 4) || [],
    amenities: ['WiFi', 'Smart TV', 'Air Conditioning', 'In-Unit Washer/Dryer', 'Covered Parking'],
    facilities: ['Reserved Covered Parking', 'High-Speed 400+ Mbps Wi-Fi', 'Keyless Smart-Lock Entry'],
  });

  // Photo URL addition state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Blocked date addition state
  const [newBlockStart, setNewBlockStart] = useState('');
  const [newBlockEnd, setNewBlockEnd] = useState('');
  const [newBlockStatus, setNewBlockStatus] = useState<BlockedDateRange['status']>('blocked');
  const [newBlockLabel, setNewBlockLabel] = useState('Owner / Maintenance Hold');

  // Seasonal pricing addition state
  const [newSeasonLabel, setNewSeasonLabel] = useState('');
  const [newSeasonStart, setNewSeasonStart] = useState('06-01');
  const [newSeasonEnd, setNewSeasonEnd] = useState('08-31');
  const [newSeasonMultiplier, setNewSeasonMultiplier] = useState('1.12');

  // Concierge service addition state
  const [svcCategory, setSvcCategory] = useState<string>(CONCIERGE_CATEGORIES[0]);
  const [svcTitle, setSvcTitle] = useState('');
  const [svcPrice, setSvcPrice] = useState('165');
  const [svcBilling, setSvcBilling] = useState('per service');
  const [svcDesc, setSvcDesc] = useState('');
  const [svcFilterCat, setSvcFilterCat] = useState<string>('all');

  // Reviews filter state
  const [reviewPropFilter, setReviewPropFilter] = useState<string>('all');

  const filteredProperties = properties.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.unitNumber.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.propertyType || '').toLowerCase().includes(q)
    );
  });

  const conciergeItems = catalogItems.filter((c) => {
    if (c.itemType !== 'addon_service') return false;
    if (svcFilterCat !== 'all' && c.category !== svcFilterCat) return false;
    return true;
  });

  const filteredReviews = reviews.filter((r) =>
    reviewPropFilter === 'all' ? true : r.propertyId === reviewPropFilter,
  );

  const handleStartEdit = (prop: AdminProperty) => {
    setSelectedPropertyId(prop.id);
    setEditForm({ ...prop });
    setSubTab('edit');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      onUpdateProperty(editForm);
    }
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.title || !newProp.unitNumber || !onAddProperty) return;
    onAddProperty({
      ...(newProp as AdminProperty),
      id: `unit-${Date.now().toString().slice(-4)}`,
    });
    setSubTab('index');
  };

  const handleAddBedroom = () => {
    if (!editForm) return;
    const currentRooms = editForm.bedroomsDetail || [];
    const nextNum = currentRooms.length + 1;
    const newRoom: BedroomDetail = {
      id: `${editForm.id}-bed-${Date.now().toString().slice(-4)}`,
      roomLabel: `Bedroom ${nextNum}`,
      title: `Guest Suite ${nextNum}`,
      description: 'Private furnished bedroom with hotel-grade mattress, cotton linens, and closet storage.',
      bedConfig: '1 Queen Bed',
      bathroomAccess: 'Full Bathroom Access',
      image: editForm.images?.[0] || '',
      facilities: ['Cotton Linens', 'Blackout Shades', 'Closet Storage'],
    };
    setEditForm({
      ...editForm,
      bedrooms: nextNum,
      bedroomsDetail: [...currentRooms, newRoom],
    });
  };

  const handleUpdateBedroom = (idx: number, patch: Partial<BedroomDetail>) => {
    if (!editForm) return;
    const next = [...(editForm.bedroomsDetail || [])];
    next[idx] = { ...next[idx], ...patch };
    setEditForm({ ...editForm, bedroomsDetail: next });
  };

  const handleRemoveBedroom = (idx: number) => {
    if (!editForm) return;
    const next = (editForm.bedroomsDetail || []).filter((_, i) => i !== idx);
    setEditForm({
      ...editForm,
      bedrooms: Math.max(1, next.length),
      bedroomsDetail: next,
    });
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !newPhotoUrl.trim()) return;
    const updatedImages = [...(selectedProperty.images || []), newPhotoUrl.trim()];
    onUpdateProperty({ ...selectedProperty, images: updatedImages });
    setNewPhotoUrl('');
  };

  const handleMakeHeroPhoto = (idx: number) => {
    if (!selectedProperty || idx <= 0) return;
    const imgs = [...(selectedProperty.images || [])];
    const [picked] = imgs.splice(idx, 1);
    imgs.unshift(picked);
    onUpdateProperty({ ...selectedProperty, images: imgs });
  };

  const handleRemovePhoto = (idx: number) => {
    if (!selectedProperty) return;
    const imgs = (selectedProperty.images || []).filter((_, i) => i !== idx);
    onUpdateProperty({ ...selectedProperty, images: imgs });
  };

  const handleAddBlockedRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !newBlockStart || !newBlockEnd) return;
    if (newBlockEnd < newBlockStart) return;
    const nextBlocks: BlockedDateRange[] = [
      ...(selectedProperty.blockedDates || []),
      {
        id: `blk_${Date.now().toString().slice(-6)}`,
        start: newBlockStart,
        end: newBlockEnd,
        status: newBlockStatus,
        label: newBlockLabel.trim() || 'Administrative Hold',
      },
    ];
    onUpdateProperty({ ...selectedProperty, blockedDates: nextBlocks });
    setNewBlockStart('');
    setNewBlockEnd('');
  };

  const handleRemoveBlockedRange = (blockId: string) => {
    if (!selectedProperty) return;
    const nextBlocks = (selectedProperty.blockedDates || []).filter((b) => b.id !== blockId);
    onUpdateProperty({ ...selectedProperty, blockedDates: nextBlocks });
  };

  const handleAddSeasonalRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !newSeasonLabel.trim()) return;
    const rule: SeasonalPricingRule = {
      id: `sea_${Date.now().toString().slice(-6)}`,
      label: newSeasonLabel.trim(),
      startMonthDay: newSeasonStart,
      endMonthDay: newSeasonEnd,
      multiplier: Number(newSeasonMultiplier) || 1.1,
      appliesToExtended: false,
    };
    const nextSeasonal = [...(selectedProperty.seasonalPricing || []), rule];
    onUpdateProperty({ ...selectedProperty, seasonalPricing: nextSeasonal });
    setNewSeasonLabel('');
  };

  const handleRemoveSeasonalRule = (ruleId: string) => {
    if (!selectedProperty) return;
    const nextSeasonal = (selectedProperty.seasonalPricing || []).filter((r) => r.id !== ruleId);
    onUpdateProperty({ ...selectedProperty, seasonalPricing: nextSeasonal });
  };

  const handleCreateConciergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateConciergeService || !svcTitle.trim()) return;
    await onCreateConciergeService({
      category: svcCategory,
      title: svcTitle.trim(),
      shortDesc: svcDesc.trim() || svcTitle.trim(),
      priceUsd: Number(svcPrice) || 100,
      billingUnitLabel: svcBilling.trim() || 'per service',
    });
    setSvcTitle('');
    setSvcDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'index', label: `All Residences (${properties.length})`, icon: Building2 },
            { id: 'add', label: 'Add Residence', icon: Plus },
            { id: 'edit', label: 'Specs, Rooms & Video', icon: Edit3 },
            { id: 'images', label: 'Photo Gallery', icon: ImageIcon },
            { id: 'availability', label: 'Availability & Seasonal Rates', icon: Calendar },
            { id: 'concierge', label: 'Concierge Add-Ons', icon: ConciergeBell },
            { id: 'reviews', label: `Guest Reviews (${reviews.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id as SubTab)}
                className={`px-3.5 py-2 min-h-[40px] rounded-lg type-nav flex items-center gap-2 transition-colors cursor-pointer border whitespace-nowrap ${
                  active
                    ? 'bg-[#14616d] text-white border-[#14616d]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Residence Context Selector */}
        {selectedProperty && ['edit', 'images', 'availability'].includes(subTab) && (
          <div className="flex items-center gap-2.5">
            <label htmlFor="admin-active-residence-select" className="form-label mb-0 whitespace-nowrap">
              Editing:
            </label>
            <select
              id="admin-active-residence-select"
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="form-select py-1.5 min-h-[40px] w-auto font-semibold"
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

      {/* 1. ALL RESIDENCES DIRECTORY */}
      {subTab === 'index' && (
        <div className="admin-panel overflow-hidden">
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
            <div>
              <h3 className="type-h3 text-slate-900">Residence Portfolio Directory</h3>
              <p className="type-body text-slate-600 mt-1">
                Manage property specifications, room layouts, video tours, availability holds, and verified status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search unit, title, type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10 min-h-[40px] py-2"
                />
              </div>

              <button
                type="button"
                onClick={() => setSubTab('add')}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Residence</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Residence</th>
                  <th>Specs &amp; Capacity</th>
                  <th>Monthly Rate</th>
                  <th>Media</th>
                  <th>Verification &amp; Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((prop, idx) => (
                  <tr key={prop.id}>
                    <td>
                      <div className="flex items-center gap-3.5">
                        <img
                          src={prop.images?.[0] || getFallbackPropertyImage(idx)}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getFallbackPropertyImage(idx);
                          }}
                          className="w-14 h-11 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-mono type-support font-semibold text-[#14616d] block">
                            {prop.unitNumber}
                          </span>
                          <span className="font-semibold text-slate-900 line-clamp-1">
                            {prop.title}
                          </span>
                          <span className="type-support text-slate-500 block">
                            {prop.propertyType || prop.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-700">
                      <div className="font-medium">
                        {prop.bedrooms || 1} Bed · {prop.bathrooms || 1} Bath · Max{' '}
                        {prop.maxGuests || Math.max(2, (prop.bedrooms || 1) * 2)} Guests
                      </div>
                      <div className="type-support text-slate-500">
                        {prop.sqft || 'Standard'} · Min {prop.minimumStayDays || 5} nights
                      </div>
                    </td>
                    <td className="font-semibold text-[#14616d] tabular-nums whitespace-nowrap">
                      ${prop.monthlyRate?.toLocaleString()} / mo
                    </td>
                    <td className="text-slate-700">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPropertyId(prop.id);
                            setSubTab('images');
                          }}
                          className="type-support font-semibold text-[#14616d] hover:underline cursor-pointer"
                        >
                          {prop.images?.length || 0} Photos
                        </button>
                        {prop.videoTourUrl && (
                          <span className="inline-flex items-center gap-1 type-support text-slate-600">
                            · <Video className="w-3.5 h-3.5 text-[#14616d]" /> Video
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 whitespace-nowrap type-support">
                        <span
                          className={`font-semibold ${
                            prop.status === 'Available'
                              ? 'text-emerald-700'
                              : prop.status === 'Reserved'
                              ? 'text-rose-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {prop.status}
                        </span>
                        {prop.verified && (
                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                            · <ShieldCheck className="w-4 h-4 text-[#14616d]" /> Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPropertyId(prop.id);
                            setSubTab('availability');
                          }}
                          title="Manage Calendar & Rates"
                          className="btn btn-outline btn-sm px-2.5"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(prop)}
                          title="Edit Residence, Rooms & Video"
                          className="btn btn-primary btn-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
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

      {/* 2. ADD NEW RESIDENCE */}
      {subTab === 'add' && (
        <div className="admin-panel p-6 sm:p-8 max-w-4xl space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="type-h3 text-slate-900">Publish New Residence</h3>
            <p className="type-body text-slate-600 mt-1">
              Creates a database-backed residence with its own detail page, room explorer, and live booking calendar.
            </p>
          </div>

          <form onSubmit={handleCreateProperty} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Unit Number *</label>
                <input
                  type="text"
                  required
                  value={newProp.unitNumber || ''}
                  onChange={(e) => setNewProp({ ...newProp, unitNumber: e.target.value })}
                  className="form-input font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Residence Title *</label>
                <input
                  type="text"
                  required
                  value={newProp.title || ''}
                  onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
              <div>
                <label className="form-label">Monthly Rate ($)</label>
                <input
                  type="number"
                  required
                  value={newProp.monthlyRate || 2800}
                  onChange={(e) => setNewProp({ ...newProp, monthlyRate: Number(e.target.value) })}
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  value={newProp.bedrooms || 1}
                  onChange={(e) => setNewProp({ ...newProp, bedrooms: Number(e.target.value) })}
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  step="0.5"
                  value={newProp.bathrooms || 1}
                  onChange={(e) => setNewProp({ ...newProp, bathrooms: Number(e.target.value) })}
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Max Guests</label>
                <input
                  type="number"
                  min={1}
                  value={newProp.maxGuests || 2}
                  onChange={(e) => setNewProp({ ...newProp, maxGuests: Number(e.target.value) })}
                  className="form-input tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Property Type</label>
                <input
                  type="text"
                  value={newProp.propertyType || ''}
                  onChange={(e) => setNewProp({ ...newProp, propertyType: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Interior Area (sq ft)</label>
                <input
                  type="text"
                  value={newProp.sqft || ''}
                  onChange={(e) => setNewProp({ ...newProp, sqft: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Min Stay (Nights)</label>
                <input
                  type="number"
                  min={1}
                  value={newProp.minimumStayDays || 5}
                  onChange={(e) =>
                    setNewProp({ ...newProp, minimumStayDays: Number(e.target.value) })
                  }
                  className="form-input tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Video Tour URL (Optional — hidden if blank)
                </label>
                <input
                  type="text"
                  value={newProp.videoTourUrl || ''}
                  onChange={(e) => setNewProp({ ...newProp, videoTourUrl: e.target.value })}
                  placeholder="https://... (.mp4 or YouTube URL)"
                  className="form-input"
                />
              </div>
              <div className="flex items-center sm:pt-6">
                <label className="inline-flex items-center gap-2.5 cursor-pointer type-label text-slate-900">
                  <input
                    type="checkbox"
                    checked={Boolean(newProp.verified)}
                    onChange={(e) => setNewProp({ ...newProp, verified: e.target.checked })}
                    className="w-4 h-4 accent-[#14616d]"
                  />
                  <span>Mark Residence Inspection Verified</span>
                </label>
              </div>
            </div>

            <div>
              <label className="form-label">Short Summary</label>
              <textarea
                rows={2}
                value={newProp.shortDesc || ''}
                onChange={(e) => setNewProp({ ...newProp, shortDesc: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div>
              <label className="form-label">Full Description</label>
              <textarea
                rows={4}
                value={newProp.fullDesc || ''}
                onChange={(e) => setNewProp({ ...newProp, fullDesc: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSubTab('index')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Create Residence</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. EDIT RESIDENCE SPECS, BEDROOM EXPLORER, VIDEO TOUR & LOCATION */}
      {subTab === 'edit' && editForm && (
        <form onSubmit={handleSaveEdit} className="space-y-6">
          {/* Core Specifications */}
          <div className="admin-panel p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="type-h3 text-slate-900">
                  Core Specifications — {editForm.unitNumber}
                </h3>
                <p className="type-body text-slate-600 mt-1">
                  All changes save directly to the property database and update the public detail page immediately.
                </p>
              </div>
              <label className="inline-flex items-center gap-2.5 type-label text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editForm.verified)}
                  onChange={(e) => setEditForm({ ...editForm, verified: e.target.checked })}
                  className="w-4 h-4 accent-[#14616d]"
                />
                <span>Verified Property Status</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label">Property Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Unit Identifier</label>
                <input
                  type="text"
                  value={editForm.unitNumber}
                  onChange={(e) => setEditForm({ ...editForm, unitNumber: e.target.value })}
                  className="form-input font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 tabular-nums">
              <div>
                <label className="form-label">Monthly Rate ($)</label>
                <input
                  type="number"
                  value={editForm.monthlyRate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, monthlyRate: Number(e.target.value) })
                  }
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.bedrooms || 1}
                  onChange={(e) => setEditForm({ ...editForm, bedrooms: Number(e.target.value) })}
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  step="0.5"
                  value={editForm.bathrooms || 1}
                  onChange={(e) => setEditForm({ ...editForm, bathrooms: Number(e.target.value) })}
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Max Guests</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.maxGuests || 2}
                  onChange={(e) => setEditForm({ ...editForm, maxGuests: Number(e.target.value) })}
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value as AdminProperty['status'],
                    })
                  }
                  className="form-select font-semibold"
                >
                  <option value="Available">Available</option>
                  <option value="Inquired">Inquired</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Property Type</label>
                <input
                  type="text"
                  value={editForm.propertyType || ''}
                  onChange={(e) => setEditForm({ ...editForm, propertyType: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Interior Size</label>
                <input
                  type="text"
                  value={editForm.sqft || ''}
                  onChange={(e) => setEditForm({ ...editForm, sqft: e.target.value })}
                  placeholder="e.g. 920 sq ft"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Min Stay (Nights)</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.minimumStayDays || 5}
                  onChange={(e) =>
                    setEditForm({ ...editForm, minimumStayDays: Number(e.target.value) })
                  }
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Max Stay (Nights)</label>
                <input
                  type="number"
                  min={5}
                  value={editForm.maximumStayDays || 365}
                  onChange={(e) =>
                    setEditForm({ ...editForm, maximumStayDays: Number(e.target.value) })
                  }
                  className="form-input tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Full Description</label>
              <textarea
                rows={4}
                value={editForm.fullDesc}
                onChange={(e) => setEditForm({ ...editForm, fullDesc: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={(editForm.amenities || []).join(', ')}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      amenities: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">
                  Verified Facilities (comma-separated)
                </label>
                <input
                  type="text"
                  value={(editForm.facilities || []).join(', ')}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      facilities: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Video Tour Settings */}
          <div className="admin-panel p-6 space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <h4 className="type-h4 text-slate-900">
                Video Walkthrough Configuration
              </h4>
              <p className="type-support text-slate-600 mt-1">
                Supports direct HTML5 video streams (.mp4/.webm) or YouTube walkthrough URLs. Leave blank to hide the Video Tour section for this property.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Video Tour URL</label>
                <input
                  type="text"
                  value={editForm.videoTourUrl || ''}
                  onChange={(e) => setEditForm({ ...editForm, videoTourUrl: e.target.value })}
                  placeholder="https://... or leave empty to hide"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Poster Image URL</label>
                <input
                  type="text"
                  value={editForm.videoPosterUrl || ''}
                  onChange={(e) => setEditForm({ ...editForm, videoPosterUrl: e.target.value })}
                  placeholder="Defaults to hero photograph"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Bedroom Explorer Rooms Manager */}
          <div className="admin-panel p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h4 className="type-h4 text-slate-900">
                  Interactive Bedroom Explorer Rooms ({(editForm.bedroomsDetail || []).length})
                </h4>
                <p className="type-support text-slate-600 mt-1">
                  Configure each room’s label, bed setup, bathroom access, and room photograph.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBedroom}
                className="btn btn-outline btn-sm"
              >
                <Plus className="w-4 h-4 text-[#14616d]" />
                <span>Add Bedroom</span>
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {(editForm.bedroomsDetail || []).map((room, rIdx) => (
                <div
                  key={room.id || rIdx}
                  className="py-5 first:pt-0 last:pb-0 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="type-h4 text-[#14616d]">{room.roomLabel}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBedroom(rIdx)}
                      className="type-support text-rose-700 hover:underline font-semibold cursor-pointer"
                    >
                      Remove Room
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="form-label">Tab Label</label>
                      <input
                        type="text"
                        value={room.roomLabel}
                        onChange={(e) => handleUpdateBedroom(rIdx, { roomLabel: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Suite Title</label>
                      <input
                        type="text"
                        value={room.title}
                        onChange={(e) => handleUpdateBedroom(rIdx, { title: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Bed Setup</label>
                      <input
                        type="text"
                        value={room.bedConfig}
                        onChange={(e) => handleUpdateBedroom(rIdx, { bedConfig: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        Bathroom Access
                      </label>
                      <input
                        type="text"
                        value={room.bathroomAccess}
                        onChange={(e) =>
                          handleUpdateBedroom(rIdx, { bathroomAccess: e.target.value })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">
                        Room Photo URL (from property gallery)
                      </label>
                      <input
                        type="text"
                        value={room.image}
                        onChange={(e) => handleUpdateBedroom(rIdx, { image: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        Room Appointments (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(room.facilities || []).join(', ')}
                        onChange={(e) =>
                          handleUpdateBedroom(rIdx, {
                            facilities: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">
                      Room Description
                    </label>
                    <textarea
                      rows={2}
                      value={room.description}
                      onChange={(e) => handleUpdateBedroom(rIdx, { description: e.target.value })}
                      className="form-textarea"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Address Privacy */}
          {editForm.locationInfo && (
            <div className="admin-panel p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h4 className="type-h4 text-slate-900">
                    Location Corridor &amp; Address Privacy
                  </h4>
                  <p className="type-support text-slate-600 mt-1">
                    Control whether exact street addresses are restricted until booking confirmation.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2.5 type-label text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.locationInfo.addressDisclosureRestricted)}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        locationInfo: {
                          ...editForm.locationInfo!,
                          addressDisclosureRestricted: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 accent-[#14616d]"
                  />
                  <span>Restrict Exact Street Address Until Confirmed</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">
                    Neighborhood / Corridor
                  </label>
                  <input
                    type="text"
                    value={editForm.locationInfo.neighborhood}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        locationInfo: {
                          ...editForm.locationInfo!,
                          neighborhood: e.target.value,
                        },
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={editForm.locationInfo.city}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        locationInfo: {
                          ...editForm.locationInfo!,
                          city: e.target.value,
                        },
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">
                    Approved Address Line
                  </label>
                  <input
                    type="text"
                    value={editForm.locationInfo.addressLine || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        locationInfo: {
                          ...editForm.locationInfo!,
                          addressLine: e.target.value,
                        },
                      })
                    }
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSubTab('index')}
              className="btn btn-outline"
            >
              Back to Directory
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save All Property Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. PHOTO GALLERY MANAGER */}
      {subTab === 'images' && selectedProperty && (
        <div className="admin-panel p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="type-h3 text-slate-900">
                Photography Gallery — {selectedProperty.unitNumber} (
                {selectedProperty.images?.length || 0} Photos)
              </h3>
              <p className="type-body text-slate-600 mt-1">
                Add verified property photographs, promote any image to Hero Cover, or remove outdated images.
              </p>
            </div>

            <form onSubmit={handleAddPhoto} className="flex items-center gap-2.5 w-full sm:w-auto">
              <input
                type="url"
                required
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://... photograph URL"
                className="form-input flex-1 sm:w-72 min-h-[42px]"
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(selectedProperty.images || []).map((imgUrl, idx) => (
              <div
                key={`${selectedProperty.id}-img-${idx}`}
                className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/3"
              >
                <img
                  src={imgUrl}
                  alt={`${selectedProperty.unitNumber} photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(idx);
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMakeHeroPhoto(idx)}
                      title="Promote to Hero Cover"
                      className="p-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  )}
                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open Full Resolution"
                    className="p-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {(selectedProperty.images?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      title="Remove Photograph"
                      className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/75 text-white type-support font-mono tabular-nums">
                  #{idx + 1}
                </span>
                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#14616d] text-white type-support font-semibold">
                    Hero Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AVAILABILITY HOLDS & SEASONAL PRICING */}
      {subTab === 'availability' && selectedProperty && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blocked Dates */}
          <div className="admin-panel p-6 space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="type-h4 text-slate-900">
                Calendar Holds &amp; Blocked Dates — {selectedProperty.unitNumber}
              </h3>
              <p className="type-support text-slate-600 mt-1">
                Prevent double bookings during maintenance, inspections, or offline corporate holds.
              </p>
            </div>

            <form onSubmit={handleAddBlockedRange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  required
                  value={newBlockStart}
                  onChange={(e) => setNewBlockStart(e.target.value)}
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  required
                  min={newBlockStart || undefined}
                  value={newBlockEnd}
                  onChange={(e) => setNewBlockEnd(e.target.value)}
                  className="form-input tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">Hold Type</label>
                <select
                  value={newBlockStatus}
                  onChange={(e) =>
                    setNewBlockStatus(e.target.value as BlockedDateRange['status'])
                  }
                  className="form-select"
                >
                  <option value="blocked">Owner / Admin Hold</option>
                  <option value="turnover">Inspection &amp; Turnover</option>
                  <option value="booked">Occupied Stay</option>
                </select>
              </div>
              <div>
                <label className="form-label">Label</label>
                <input
                  type="text"
                  value={newBlockLabel}
                  onChange={(e) => setNewBlockLabel(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Add Calendar Block
                </button>
              </div>
            </form>

            <div className="divide-y divide-slate-200 pt-2 border-t border-slate-200">
              {(selectedProperty.blockedDates || []).length === 0 ? (
                <p className="type-support text-slate-500 py-4">No administrative date blocks configured.</p>
              ) : (
                (selectedProperty.blockedDates || []).map((blk) => (
                  <div
                    key={blk.id}
                    className="py-3 flex items-center justify-between gap-3 type-support tabular-nums"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">
                        {blk.start} → {blk.end}
                      </span>
                      <span className="text-slate-600 ml-2">
                        · {blk.label || blk.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlockedRange(blk.id)}
                      className="text-rose-700 hover:underline font-semibold cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Seasonal Pricing Rules */}
          <div className="admin-panel p-6 space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="type-h4 text-slate-900">
                Seasonal Pricing Rules — {selectedProperty.unitNumber}
              </h3>
              <p className="type-support text-slate-600 mt-1">
                Configure seasonal rate multipliers applied automatically during live quote calculation.
              </p>
            </div>

            <form onSubmit={handleAddSeasonalRule} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label">Season Name *</label>
                <input
                  type="text"
                  required
                  value={newSeasonLabel}
                  onChange={(e) => setNewSeasonLabel(e.target.value)}
                  placeholder="e.g. Autumn Relocation Peak"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Start (MM-DD)</label>
                <input
                  type="text"
                  value={newSeasonStart}
                  onChange={(e) => setNewSeasonStart(e.target.value)}
                  placeholder="06-01"
                  className="form-input font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="form-label">End (MM-DD)</label>
                <input
                  type="text"
                  value={newSeasonEnd}
                  onChange={(e) => setNewSeasonEnd(e.target.value)}
                  placeholder="08-31"
                  className="form-input font-mono tabular-nums"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="form-label">
                    Rate Multiplier (e.g. 1.12 = +12%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="3"
                    value={newSeasonMultiplier}
                    onChange={(e) => setNewSeasonMultiplier(e.target.value)}
                    className="form-input tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Season Rule
                </button>
              </div>
            </form>

            <div className="divide-y divide-slate-200 pt-2 border-t border-slate-200">
              {(selectedProperty.seasonalPricing || []).map((rule) => (
                <div
                  key={rule.id}
                  className="py-3 flex items-center justify-between gap-3 type-support tabular-nums"
                >
                  <div>
                    <strong className="font-semibold text-slate-900">{rule.label}</strong>
                    <span className="text-slate-600 ml-2">
                      ({rule.startMonthDay} → {rule.endMonthDay}) · ×{rule.multiplier || 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSeasonalRule(rule.id)}
                    className="text-rose-700 hover:underline font-semibold cursor-pointer shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. CONCIERGE SERVICES & PRICING MANAGER */}
      {subTab === 'concierge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 admin-panel p-6 space-y-5 h-fit">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="type-h4 text-slate-900">Add Concierge Add-On Service</h3>
              <p className="type-support text-slate-600 mt-1">
                Published services appear on the Property Detail Concierge section and Interactive Booking Panel.
              </p>
            </div>

            <form onSubmit={handleCreateConciergeSubmit} className="space-y-4">
              <div>
                <label className="form-label">Service Category</label>
                <select
                  value={svcCategory}
                  onChange={(e) => setSvcCategory(e.target.value)}
                  className="form-select"
                >
                  {CONCIERGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Service Title *</label>
                <input
                  type="text"
                  required
                  value={svcTitle}
                  onChange={(e) => setSvcTitle(e.target.value)}
                  placeholder="e.g. Private Vineyard Sommelier Tasting"
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Price ($ USD) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={svcPrice}
                    onChange={(e) => setSvcPrice(e.target.value)}
                    className="form-input tabular-nums"
                  />
                </div>
                <div>
                  <label className="form-label">Billing Unit</label>
                  <input
                    type="text"
                    value={svcBilling}
                    onChange={(e) => setSvcBilling(e.target.value)}
                    placeholder="per session / per stay"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={svcDesc}
                  onChange={(e) => setSvcDesc(e.target.value)}
                  placeholder="Concise description shown on property concierge cards..."
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Publish Concierge Service
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 admin-panel p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <h3 className="type-h4 text-slate-900">
                Concierge Services ({conciergeItems.length})
              </h3>
              <select
                aria-label="Filter concierge services by category"
                value={svcFilterCat}
                onChange={(e) => setSvcFilterCat(e.target.value)}
                className="form-select w-auto min-h-[40px] py-1.5 font-semibold"
              >
                <option value="all">All Categories</option>
                {CONCIERGE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="divide-y divide-slate-200 max-h-[540px] overflow-y-auto pr-1">
              {conciergeItems.map((svc) => (
                <div
                  key={svc.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="type-support text-[#14616d] font-semibold">{svc.category}</div>
                    <div className="font-semibold text-slate-900 truncate">{svc.title}</div>
                    <div className="type-support text-slate-600 tabular-nums">
                      ${svc.priceUsd.toLocaleString()} {svc.billingUnitLabel}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onToggleConciergeService && (
                      <button
                        type="button"
                        onClick={() => onToggleConciergeService(svc)}
                        className={`btn btn-sm ${
                          svc.available
                            ? 'bg-[#edf6f8] text-[#0f4952] border-[#14616d]/30'
                            : 'btn-outline text-slate-500'
                        }`}
                      >
                        {svc.available ? 'Active' : 'Paused'}
                      </button>
                    )}
                    {onDeleteConciergeService && (
                      <button
                        type="button"
                        onClick={() => onDeleteConciergeService(svc)}
                        className="btn btn-outline btn-sm px-2.5 text-rose-700 hover:bg-rose-50 border-rose-200"
                        title="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. GUEST REVIEWS MODERATION */}
      {subTab === 'reviews' && (
        <div className="admin-panel p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="type-h3 text-slate-900">Customer Reviews Moderation</h3>
              <p className="type-body text-slate-600 mt-1">
                Review genuine customer submissions across all residences.
              </p>
            </div>
            <select
              aria-label="Filter reviews by residence"
              value={reviewPropFilter}
              onChange={(e) => setReviewPropFilter(e.target.value)}
              className="form-select w-auto min-h-[40px] py-1.5 font-semibold"
            >
              <option value="all">All Residences ({reviews.length})</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.unitNumber} — {p.title}
                </option>
              ))}
            </select>
          </div>

          {filteredReviews.length === 0 ? (
            <p className="type-body text-slate-500 py-8 text-center">
              No customer reviews recorded for this filter.
            </p>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredReviews.map((rev) => {
                const prop = properties.find((p) => p.id === rev.propertyId);
                return (
                  <div
                    key={rev.id}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 type-support text-slate-600 tabular-nums">
                        <strong className="text-slate-900 font-semibold">{rev.authorName}</strong>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#14616d]">
                          {prop?.unitNumber || rev.propertyId}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {rev.rating}.0
                        </span>
                        {rev.verifiedBooking && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700 font-semibold">Verified Stay</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{rev.createdAt.split('T')[0]}</span>
                      </div>
                      {rev.title && (
                        <div className="type-h4 text-slate-900">{rev.title}</div>
                      )}
                      <p className="type-body text-slate-700">{rev.content}</p>
                    </div>

                    {onDeleteReview && (
                      <button
                        type="button"
                        onClick={() => onDeleteReview(rev.id)}
                        className="btn btn-outline btn-sm text-rose-700 hover:bg-rose-50 border-rose-200 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
