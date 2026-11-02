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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-3">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border whitespace-nowrap ${
                  active
                    ? 'bg-[#82634f] text-white border-[#82634f]'
                    : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:border-[#82634f]/40 hover:text-[#282828]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Residence Context Selector */}
        {selectedProperty && ['edit', 'images', 'availability'].includes(subTab) && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#857568]">Editing:</span>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="bg-white border border-[#dfd6ca] rounded-lg px-2.5 py-1.5 font-semibold text-[#282828] text-xs outline-none focus:border-[#00b7a8]"
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
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
            <div>
              <h3 className="type-h4 text-[#1b1d20]">Residence Portfolio Directory</h3>
              <p className="text-xs text-[#5c5046]">
                Manage property specifications, room layouts, video tours, availability holds, and verified status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#857568] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search unit, title, type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg text-xs outline-none focus:border-[#00b7a8]"
                />
              </div>

              <button
                type="button"
                onClick={() => setSubTab('add')}
                className="px-3.5 py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Residence</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="bg-[#faf8f5] text-[#697076] font-semibold border-b border-[#e6dfd5]">
                <tr>
                  <th className="py-3 px-3">Residence</th>
                  <th className="py-3 px-3">Specs &amp; Capacity</th>
                  <th className="py-3 px-3">Monthly Rate</th>
                  <th className="py-3 px-3">Media</th>
                  <th className="py-3 px-3">Verification &amp; Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5]">
                {filteredProperties.map((prop, idx) => (
                  <tr key={prop.id} className="hover:bg-[#fbf9f6] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images?.[0] || getFallbackPropertyImage(idx)}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getFallbackPropertyImage(idx);
                          }}
                          className="w-12 h-10 object-cover rounded-md border border-[#e6dfd5] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-mono font-semibold text-[#82634f] block">
                            {prop.unitNumber}
                          </span>
                          <span className="font-semibold text-[#1b1d20] line-clamp-1">
                            {prop.title}
                          </span>
                          <span className="text-[11px] text-[#697076]">
                            {prop.propertyType || prop.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#434a4f]">
                      <div>
                        {prop.bedrooms || 1} Bed · {prop.bathrooms || 1} Bath · Max{' '}
                        {prop.maxGuests || Math.max(2, (prop.bedrooms || 1) * 2)} Guests
                      </div>
                      <div className="text-[11px] text-[#697076]">
                        {prop.sqft || 'Standard'} · Min {prop.minimumStayDays || 5} nights
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#00897d]">
                      ${prop.monthlyRate?.toLocaleString()} / mo
                    </td>
                    <td className="py-3 px-3 text-[#434a4f]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPropertyId(prop.id);
                            setSubTab('images');
                          }}
                          className="text-[#82634f] hover:underline font-semibold cursor-pointer"
                        >
                          {prop.images?.length || 0} Photos
                        </button>
                        {prop.videoTourUrl && (
                          <span className="inline-flex items-center gap-1 text-[#00897d]">
                            · <Video className="w-3 h-3" /> Video
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
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
                          <span className="inline-flex items-center gap-0.5 text-[#1b1d20] font-medium">
                            · <ShieldCheck className="w-3.5 h-3.5 text-[#00897d]" /> Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPropertyId(prop.id);
                            setSubTab('availability');
                          }}
                          title="Manage Calendar & Rates"
                          className="p-1.5 rounded bg-white hover:bg-[#faf8f5] text-[#5c5046] border border-[#dfd6ca] cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(prop)}
                          title="Edit Residence, Rooms & Video"
                          className="px-2.5 py-1.5 rounded bg-[#e8f8f6] hover:bg-[#d0f2ed] text-[#00897d] border border-[#bfe8e3] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
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
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 max-w-4xl space-y-6">
          <div className="border-b border-[#e6dfd5] pb-4">
            <h3 className="type-h4 text-[#1b1d20]">Publish New Residence</h3>
            <p className="text-xs text-[#5c5046]">
              Creates a database-backed residence with its own detail page, room explorer, and live booking calendar.
            </p>
          </div>

          <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Unit Number *</label>
                <input
                  type="text"
                  required
                  value={newProp.unitNumber || ''}
                  onChange={(e) => setNewProp({ ...newProp, unitNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#5c5046] font-semibold mb-1">Residence Title *</label>
                <input
                  type="text"
                  required
                  value={newProp.title || ''}
                  onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 tabular-nums">
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Monthly Rate ($)</label>
                <input
                  type="number"
                  required
                  value={newProp.monthlyRate || 2800}
                  onChange={(e) => setNewProp({ ...newProp, monthlyRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  value={newProp.bedrooms || 1}
                  onChange={(e) => setNewProp({ ...newProp, bedrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  step="0.5"
                  value={newProp.bathrooms || 1}
                  onChange={(e) => setNewProp({ ...newProp, bathrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Max Guests</label>
                <input
                  type="number"
                  min={1}
                  value={newProp.maxGuests || 2}
                  onChange={(e) => setNewProp({ ...newProp, maxGuests: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Property Type</label>
                <input
                  type="text"
                  value={newProp.propertyType || ''}
                  onChange={(e) => setNewProp({ ...newProp, propertyType: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Interior Area (sq ft)</label>
                <input
                  type="text"
                  value={newProp.sqft || ''}
                  onChange={(e) => setNewProp({ ...newProp, sqft: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Min Stay (Nights)</label>
                <input
                  type="number"
                  min={1}
                  value={newProp.minimumStayDays || 5}
                  onChange={(e) =>
                    setNewProp({ ...newProp, minimumStayDays: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">
                  Video Tour URL (Optional — hidden if blank)
                </label>
                <input
                  type="text"
                  value={newProp.videoTourUrl || ''}
                  onChange={(e) => setNewProp({ ...newProp, videoTourUrl: e.target.value })}
                  placeholder="https://... (.mp4 or YouTube URL)"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-[#1b1d20]">
                  <input
                    type="checkbox"
                    checked={Boolean(newProp.verified)}
                    onChange={(e) => setNewProp({ ...newProp, verified: e.target.checked })}
                    className="w-4 h-4 accent-[#00897d]"
                  />
                  <span>Mark Residence Inspection Verified</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[#5c5046] font-semibold mb-1">Short Summary</label>
              <textarea
                rows={2}
                value={newProp.shortDesc || ''}
                onChange={(e) => setNewProp({ ...newProp, shortDesc: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[#5c5046] font-semibold mb-1">Full Description</label>
              <textarea
                rows={4}
                value={newProp.fullDesc || ''}
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
                className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Residence</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. EDIT RESIDENCE SPECS, BEDROOM EXPLORER, VIDEO TOUR & LOCATION */}
      {subTab === 'edit' && editForm && (
        <form onSubmit={handleSaveEdit} className="space-y-6 text-xs">
          {/* Core Specifications */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-3">
              <div>
                <h3 className="type-h4 text-[#1b1d20]">
                  Core Specifications — {editForm.unitNumber}
                </h3>
                <p className="text-[#5c5046]">
                  All changes save directly to the property database and update the public detail page immediately.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 font-semibold text-[#1b1d20] cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editForm.verified)}
                  onChange={(e) => setEditForm({ ...editForm, verified: e.target.checked })}
                  className="w-4 h-4 accent-[#00897d]"
                />
                <span>Verified Property Status</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[#5c5046] font-semibold mb-1">Property Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Unit Identifier</label>
                <input
                  type="text"
                  value={editForm.unitNumber}
                  onChange={(e) => setEditForm({ ...editForm, unitNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 tabular-nums">
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Monthly Rate ($)</label>
                <input
                  type="number"
                  value={editForm.monthlyRate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, monthlyRate: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.bedrooms || 1}
                  onChange={(e) => setEditForm({ ...editForm, bedrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  step="0.5"
                  value={editForm.bathrooms || 1}
                  onChange={(e) => setEditForm({ ...editForm, bathrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Max Guests</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.maxGuests || 2}
                  onChange={(e) => setEditForm({ ...editForm, maxGuests: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value as AdminProperty['status'],
                    })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-semibold"
                >
                  <option value="Available">Available</option>
                  <option value="Inquired">Inquired</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Property Type</label>
                <input
                  type="text"
                  value={editForm.propertyType || ''}
                  onChange={(e) => setEditForm({ ...editForm, propertyType: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Interior Size</label>
                <input
                  type="text"
                  value={editForm.sqft || ''}
                  onChange={(e) => setEditForm({ ...editForm, sqft: e.target.value })}
                  placeholder="e.g. 920 sq ft"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Min Stay (Nights)</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.minimumStayDays || 5}
                  onChange={(e) =>
                    setEditForm({ ...editForm, minimumStayDays: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Max Stay (Nights)</label>
                <input
                  type="number"
                  min={5}
                  value={editForm.maximumStayDays || 365}
                  onChange={(e) =>
                    setEditForm({ ...editForm, maximumStayDays: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#5c5046] font-semibold mb-1">Full Description</label>
              <textarea
                rows={4}
                value={editForm.fullDesc}
                onChange={(e) => setEditForm({ ...editForm, fullDesc: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">
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
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">
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
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Video Tour Settings */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h4 className="type-nav font-semibold text-[#1b1d20]">
                Video Walkthrough Configuration
              </h4>
              <p className="text-[#5c5046]">
                Supports direct HTML5 video streams (.mp4/.webm) or YouTube walkthrough URLs. Leave blank to hide the Video Tour section for this property.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Video Tour URL</label>
                <input
                  type="text"
                  value={editForm.videoTourUrl || ''}
                  onChange={(e) => setEditForm({ ...editForm, videoTourUrl: e.target.value })}
                  placeholder="https://... or leave empty to hide"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#5c5046] font-semibold mb-1">Poster Image URL</label>
                <input
                  type="text"
                  value={editForm.videoPosterUrl || ''}
                  onChange={(e) => setEditForm({ ...editForm, videoPosterUrl: e.target.value })}
                  placeholder="Defaults to hero photograph"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Bedroom Explorer Rooms Manager */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
              <div>
                <h4 className="type-nav font-semibold text-[#1b1d20]">
                  Interactive Bedroom Explorer Rooms ({(editForm.bedroomsDetail || []).length})
                </h4>
                <p className="text-[#5c5046]">
                  Configure each room’s label, bed setup, bathroom access, and room photograph.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBedroom}
                className="px-3 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#f2ece4] border border-[#dfd6ca] font-semibold text-[#1b1d20] inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#00897d]" />
                <span>Add Bedroom</span>
              </button>
            </div>

            <div className="space-y-4">
              {(editForm.bedroomsDetail || []).map((room, rIdx) => (
                <div
                  key={room.id || rIdx}
                  className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#00897d]">{room.roomLabel}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBedroom(rIdx)}
                      className="text-rose-700 hover:underline font-medium cursor-pointer"
                    >
                      Remove Room
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[#5c5046] font-semibold mb-1">Tab Label</label>
                      <input
                        type="text"
                        value={room.roomLabel}
                        onChange={(e) => handleUpdateBedroom(rIdx, { roomLabel: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#dfd6ca] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5c5046] font-semibold mb-1">Suite Title</label>
                      <input
                        type="text"
                        value={room.title}
                        onChange={(e) => handleUpdateBedroom(rIdx, { title: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#dfd6ca] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5c5046] font-semibold mb-1">Bed Setup</label>
                      <input
                        type="text"
                        value={room.bedConfig}
                        onChange={(e) => handleUpdateBedroom(rIdx, { bedConfig: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#dfd6ca] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5c5046] font-semibold mb-1">
                        Bathroom Access
                      </label>
                      <input
                        type="text"
                        value={room.bathroomAccess}
                        onChange={(e) =>
                          handleUpdateBedroom(rIdx, { bathroomAccess: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-[#dfd6ca] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#5c5046] font-semibold mb-1">
                        Room Photo URL (from property gallery)
                      </label>
                      <input
                        type="text"
                        value={room.image}
                        onChange={(e) => handleUpdateBedroom(rIdx, { image: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#dfd6ca] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#5c5046] font-semibold mb-1">
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
                        className="w-full px-2.5 py-1.5 bg-white border border-[#dfd6ca] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#5c5046] font-semibold mb-1">
                      Room Description
                    </label>
                    <textarea
                      rows={2}
                      value={room.description}
                      onChange={(e) => handleUpdateBedroom(rIdx, { description: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#dfd6ca] rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Address Privacy */}
          {editForm.locationInfo && (
            <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6dfd5] pb-3">
                <div>
                  <h4 className="type-nav font-semibold text-[#1b1d20]">
                    Location Corridor &amp; Address Privacy
                  </h4>
                  <p className="text-[#5c5046]">
                    Control whether exact street addresses are restricted until booking confirmation.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 font-semibold text-[#1b1d20] cursor-pointer">
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
                    className="w-4 h-4 accent-[#00897d]"
                  />
                  <span>Restrict Exact Street Address Until Confirmed</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#5c5046] font-semibold mb-1">
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
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-semibold mb-1">City</label>
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
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-semibold mb-1">
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
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSubTab('index')}
              className="px-4 py-2.5 border border-[#dfd6ca] bg-white rounded-xl font-semibold text-[#5c5046] cursor-pointer"
            >
              Back to Directory
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save All Property Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. PHOTO GALLERY MANAGER */}
      {subTab === 'images' && selectedProperty && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
            <div>
              <h3 className="type-h4 text-[#1b1d20]">
                Photography Gallery — {selectedProperty.unitNumber} (
                {selectedProperty.images?.length || 0} Photos)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Add verified property photographs, promote any image to Hero Cover, or remove outdated images.
              </p>
            </div>

            <form onSubmit={handleAddPhoto} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="url"
                required
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://... photograph URL"
                className="flex-1 sm:w-72 px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg text-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {(selectedProperty.images || []).map((imgUrl, idx) => (
              <div
                key={`${selectedProperty.id}-img-${idx}`}
                className="group relative rounded-xl overflow-hidden border border-[#e6dfd5] bg-[#faf8f5] aspect-4/3"
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
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMakeHeroPhoto(idx)}
                      title="Promote to Hero Cover"
                      className="p-1.5 bg-white text-[#1b1d20] rounded-md hover:bg-[#faf8f5] cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open Full Resolution"
                    className="p-1.5 bg-white text-[#1b1d20] rounded-md hover:bg-[#faf8f5]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {(selectedProperty.images?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      title="Remove Photograph"
                      className="p-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/65 text-white text-[10px] font-mono tabular-nums">
                  #{idx + 1}
                </span>
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#00897d] text-white text-[10px] font-semibold">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Blocked Dates */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h3 className="type-h4 text-[#1b1d20]">
                Calendar Holds &amp; Blocked Dates — {selectedProperty.unitNumber}
              </h3>
              <p className="text-[#5c5046]">
                Prevent double bookings during maintenance, inspections, or offline corporate holds.
              </p>
            </div>

            <form onSubmit={handleAddBlockedRange} className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={newBlockStart}
                  onChange={(e) => setNewBlockStart(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg tabular-nums"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  min={newBlockStart || undefined}
                  value={newBlockEnd}
                  onChange={(e) => setNewBlockEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg tabular-nums"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">Hold Type</label>
                <select
                  value={newBlockStatus}
                  onChange={(e) =>
                    setNewBlockStatus(e.target.value as BlockedDateRange['status'])
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                >
                  <option value="blocked">Owner / Admin Hold</option>
                  <option value="turnover">Inspection &amp; Turnover</option>
                  <option value="booked">Occupied Stay</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">Label</label>
                <input
                  type="text"
                  value={newBlockLabel}
                  onChange={(e) => setNewBlockLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-lg font-semibold cursor-pointer"
                >
                  Add Calendar Block
                </button>
              </div>
            </form>

            <div className="space-y-2 pt-2">
              {(selectedProperty.blockedDates || []).length === 0 ? (
                <p className="text-[#697076] py-3">No administrative date blocks configured.</p>
              ) : (
                (selectedProperty.blockedDates || []).map((blk) => (
                  <div
                    key={blk.id}
                    className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between gap-2 tabular-nums"
                  >
                    <div>
                      <span className="font-semibold text-[#1b1d20]">
                        {blk.start} → {blk.end}
                      </span>
                      <span className="text-[#5c5046] ml-2">
                        · {blk.label || blk.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlockedRange(blk.id)}
                      className="text-rose-700 hover:underline font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Seasonal Pricing Rules */}
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h3 className="type-h4 text-[#1b1d20]">
                Seasonal Pricing Rules — {selectedProperty.unitNumber}
              </h3>
              <p className="text-[#5c5046]">
                Configure seasonal rate multipliers applied automatically during live quote calculation.
              </p>
            </div>

            <form onSubmit={handleAddSeasonalRule} className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block font-semibold text-[#5c5046] mb-1">Season Name *</label>
                <input
                  type="text"
                  required
                  value={newSeasonLabel}
                  onChange={(e) => setNewSeasonLabel(e.target.value)}
                  placeholder="e.g. Autumn Relocation Peak"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">Start (MM-DD)</label>
                <input
                  type="text"
                  value={newSeasonStart}
                  onChange={(e) => setNewSeasonStart(e.target.value)}
                  placeholder="06-01"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">End (MM-DD)</label>
                <input
                  type="text"
                  value={newSeasonEnd}
                  onChange={(e) => setNewSeasonEnd(e.target.value)}
                  placeholder="08-31"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-mono"
                />
              </div>
              <div className="col-span-2 flex items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="block font-semibold text-[#5c5046] mb-1">
                    Rate Multiplier (e.g. 1.12 = +12%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="3"
                    value={newSeasonMultiplier}
                    onChange={(e) => setNewSeasonMultiplier(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg tabular-nums"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-lg font-semibold cursor-pointer whitespace-nowrap"
                >
                  Add Season Rule
                </button>
              </div>
            </form>

            <div className="space-y-2 pt-2">
              {(selectedProperty.seasonalPricing || []).map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between gap-2 tabular-nums"
                >
                  <div>
                    <strong className="font-semibold text-[#1b1d20]">{rule.label}</strong>
                    <span className="text-[#5c5046] ml-2">
                      ({rule.startMonthDay} → {rule.endMonthDay}) · ×{rule.multiplier || 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSeasonalRule(rule.id)}
                    className="text-rose-700 hover:underline font-medium cursor-pointer"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4 h-fit">
            <div className="border-b border-[#e6dfd5] pb-3">
              <h3 className="type-h4 text-[#1b1d20]">Add Concierge Add-On Service</h3>
              <p className="text-[#5c5046]">
                Published services appear on the Property Detail Concierge section and Interactive Booking Panel.
              </p>
            </div>

            <form onSubmit={handleCreateConciergeSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">Service Category</label>
                <select
                  value={svcCategory}
                  onChange={(e) => setSvcCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                >
                  {CONCIERGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={svcTitle}
                  onChange={(e) => setSvcTitle(e.target.value)}
                  placeholder="e.g. Private Vineyard Sommelier Tasting"
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#5c5046] mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={svcPrice}
                    onChange={(e) => setSvcPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#5c5046] mb-1">Billing Unit</label>
                  <input
                    type="text"
                    value={svcBilling}
                    onChange={(e) => setSvcBilling(e.target.value)}
                    placeholder="per session / per stay"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#5c5046] mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={svcDesc}
                  onChange={(e) => setSvcDesc(e.target.value)}
                  placeholder="Concise description shown on property concierge cards..."
                  className="w-full p-2.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white font-semibold rounded-xl cursor-pointer"
              >
                Publish Concierge Service
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-3">
              <h3 className="type-h4 text-[#1b1d20]">
                Concierge Services ({conciergeItems.length})
              </h3>
              <select
                value={svcFilterCat}
                onChange={(e) => setSvcFilterCat(e.target.value)}
                className="px-3 py-1.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-semibold"
              >
                <option value="all">All Categories</option>
                {CONCIERGE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {conciergeItems.map((svc) => (
                <div
                  key={svc.id}
                  className="p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] text-[#00897d] font-semibold">{svc.category}</div>
                    <div className="font-semibold text-[#1b1d20] truncate">{svc.title}</div>
                    <div className="text-[#5c5046] tabular-nums">
                      ${svc.priceUsd.toLocaleString()} {svc.billingUnitLabel}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onToggleConciergeService && (
                      <button
                        type="button"
                        onClick={() => onToggleConciergeService(svc)}
                        className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                          svc.available
                            ? 'bg-[#e8f8f6] text-[#00897d] border-[#bfe8e3]'
                            : 'bg-white text-[#857568] border-[#dfd6ca]'
                        }`}
                      >
                        {svc.available ? 'Active' : 'Paused'}
                      </button>
                    )}
                    {onDeleteConciergeService && (
                      <button
                        type="button"
                        onClick={() => onDeleteConciergeService(svc)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 cursor-pointer"
                        title="Remove service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-3">
            <div>
              <h3 className="type-h4 text-[#1b1d20]">Customer Reviews Moderation</h3>
              <p className="text-[#5c5046]">
                Review genuine customer submissions across all residences.
              </p>
            </div>
            <select
              value={reviewPropFilter}
              onChange={(e) => setReviewPropFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg font-semibold"
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
            <p className="text-[#697076] py-8 text-center">
              No customer reviews recorded for this filter.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((rev) => {
                const prop = properties.find((p) => p.id === rev.propertyId);
                return (
                  <div
                    key={rev.id}
                    className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-[#5c5046] tabular-nums">
                        <strong className="text-[#1b1d20]">{rev.authorName}</strong>
                        <span>·</span>
                        <span className="font-semibold text-[#00897d]">
                          {prop?.unitNumber || rev.propertyId}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {rev.rating}.0
                        </span>
                        {rev.verifiedBooking && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold">Verified Stay</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{rev.createdAt.split('T')[0]}</span>
                      </div>
                      {rev.title && (
                        <div className="font-semibold text-[#1b1d20]">{rev.title}</div>
                      )}
                      <p className="text-[#434a4f]">{rev.content}</p>
                    </div>

                    {onDeleteReview && (
                      <button
                        type="button"
                        onClick={() => onDeleteReview(rev.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
