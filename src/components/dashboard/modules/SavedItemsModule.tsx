import React, { useState, useEffect } from 'react';
import { PROPERTIES } from '../../../data/lodgingData';
import { US_VEHICLES } from '../../../data/vehicleData';
import { PropertyCard } from '../components/PropertyCard';
import { EmptyState } from '../components/EmptyState';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { Heart, Building2, Car, Bookmark, Trash2, ArrowRight } from 'lucide-react';

interface SavedItemsModuleProps {
  onReserveProperty: () => void;
  onExploreVehicles: () => void;
}

export const SavedItemsModule: React.FC<SavedItemsModuleProps> = ({
  onReserveProperty,
  onExploreVehicles,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'properties' | 'vehicles'>('all');

  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('etl_saved_properties');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [PROPERTIES[0]?.id || 'unit-91', PROPERTIES[1]?.id || 'unit-173'].filter(Boolean);
  });

  const [savedVehicleIds, setSavedVehicleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('etl_saved_vehicles');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [US_VEHICLES[0]?.id || 'veh-escalade'].filter(Boolean);
  });

  useEffect(() => {
    localStorage.setItem('etl_saved_properties', JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  useEffect(() => {
    localStorage.setItem('etl_saved_vehicles', JSON.stringify(savedVehicleIds));
  }, [savedVehicleIds]);

  const handleRemoveProperty = (id: string) => {
    setSavedPropertyIds((prev) => prev.filter((pId) => pId !== id));
  };

  const handleRemoveVehicle = (id: string) => {
    setSavedVehicleIds((prev) => prev.filter((vId) => vId !== id));
  };

  const savedProperties = PROPERTIES.filter((p) => savedPropertyIds.includes(p.id));
  const savedVehicles = US_VEHICLES.filter((v) => savedVehicleIds.includes(v.id));

  const totalCount = savedProperties.length + savedVehicles.length;

  const subTabOptions: SubTabOption[] = [
    { id: 'all', label: 'All Saved Items', badge: totalCount },
    { id: 'properties', label: 'Executive Residences', badge: savedProperties.length },
    { id: 'vehicles', label: 'Fleet Vehicles', badge: savedVehicles.length },
  ];

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={activeSubTab}
        options={subTabOptions}
        onSelectSubTab={(id) => setActiveSubTab(id as 'all' | 'properties' | 'vehicles')}
      />

      <div className="px-4 sm:px-8 pb-8 space-y-8">
        <div className="border-b border-[#e6dfd5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#00b7a8]" /> Saved Residences &amp; Fleet Vehicles
            </h3>
            <p className="text-xs text-[#5c5046] mt-0.5">
              Review and reserve your bookmarked California corporate housing and verified 3D fleet rentals.
            </p>
          </div>
          <div className="text-xs font-semibold text-[#857568]">
            {totalCount} item{totalCount === 1 ? '' : 's'} bookmarked
          </div>
        </div>

        {totalCount === 0 ? (
          <EmptyState
            icon={Heart}
            title="No Saved Items"
            description="You have not bookmarked any properties or fleet vehicles yet. Explore our portfolio to save options for future executive travel."
            actionText="Browse Available Properties"
            onAction={onReserveProperty}
          />
        ) : (
          <div className="space-y-8">
            {/* Properties Section */}
            {(activeSubTab === 'all' || activeSubTab === 'properties') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#82634f] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#00b7a8]" /> Executive Residences ({savedProperties.length})
                  </h4>
                  <button
                    type="button"
                    onClick={onReserveProperty}
                    className="text-xs text-[#00897d] hover:text-[#005f56] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Reserve New Stay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {savedProperties.length === 0 ? (
                  <div className="p-6 bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl text-center text-xs text-[#857568]">
                    No residences currently bookmarked.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        isSaved={true}
                        onToggleSave={() => handleRemoveProperty(prop.id)}
                        onReserve={() => onReserveProperty()}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Vehicles Section */}
            {(activeSubTab === 'all' || activeSubTab === 'vehicles') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#82634f] flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#00b7a8]" /> Curated Fleet Rentals ({savedVehicles.length})
                  </h4>
                  <button
                    type="button"
                    onClick={onExploreVehicles}
                    className="text-xs text-[#00897d] hover:text-[#005f56] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Browse 3D Fleet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {savedVehicles.length === 0 ? (
                  <div className="p-6 bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl text-center text-xs text-[#857568]">
                    No vehicles currently bookmarked.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedVehicles.map((veh) => (
                      <div
                        key={veh.id}
                        className="bg-white border border-[#e6dfd5] rounded-2xl overflow-hidden shadow-2xs hover:border-[#00b7a8] transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-40 w-full bg-[#1f1915] overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                          <Car className="w-12 h-12 text-[#00b7a8] mb-2" />
                          <div className="text-white text-xs font-bold">{veh.make} · {veh.year}</div>
                          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                            {veh.category}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVehicle(veh.id)}
                            title="Remove from saved"
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-500 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </button>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h5 className="font-heading font-black text-base text-[#282828]">
                              {veh.name}
                            </h5>
                            <p className="text-xs text-[#5c5046] line-clamp-2">
                              {veh.tagline || veh.description}
                            </p>
                            <div className="flex items-center gap-3 pt-2 text-[11px] text-[#857568] font-semibold">
                              <span>Seats {veh.seating}</span>
                              <span>·</span>
                              <span>Luggage {veh.luggage}</span>
                              <span>·</span>
                              <span className="text-[#00897d] font-bold">${veh.dailyRate}/day</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#f0eae1] flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={onExploreVehicles}
                              className="w-full py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <span>Reserve Vehicle</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
