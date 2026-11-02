import React, { useState, useEffect } from 'react';
import { PROPERTIES } from '../../../data/lodgingData';
import { US_VEHICLES } from '../../../data/vehicleData';
import { getVehicleImage } from '../../../data/fleetImages';
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
    return [PROPERTIES[0]?.id, PROPERTIES[1]?.id].filter(Boolean) as string[];
  });

  const [savedVehicleIds, setSavedVehicleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('etl_saved_vehicles');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [US_VEHICLES[0]?.id].filter(Boolean) as string[];
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

      <div className="space-y-8">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="type-h3 text-[#0f172a] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#14616d]" /> Saved Residences &amp; Fleet Vehicles
            </h3>
            <p className="type-body text-slate-500 mt-1">
              Review and reserve your bookmarked California corporate housing and fleet rentals.
            </p>
          </div>
          <div className="type-support font-medium text-slate-500 tabular-nums">
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
            {(activeSubTab === 'all' || activeSubTab === 'properties') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="type-h4 text-[#0f172a] flex items-center gap-2 tabular-nums">
                    <Building2 className="w-4 h-4 text-[#14616d]" /> Executive Residences ({savedProperties.length})
                  </h4>
                  <button
                    type="button"
                    onClick={onReserveProperty}
                    className="type-btn text-[#14616d] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Reserve New Stay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {savedProperties.length === 0 ? (
                  <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center type-body text-slate-500">
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

            {(activeSubTab === 'all' || activeSubTab === 'vehicles') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="type-h4 text-[#0f172a] flex items-center gap-2 tabular-nums">
                    <Car className="w-4 h-4 text-[#14616d]" /> Fleet Rentals ({savedVehicles.length})
                  </h4>
                  <button
                    type="button"
                    onClick={onExploreVehicles}
                    className="type-btn text-[#14616d] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Browse Car Rentals</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {savedVehicles.length === 0 ? (
                  <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center type-body text-slate-500">
                    No vehicles currently bookmarked.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedVehicles.map((veh) => {
                      const imgSrc = getVehicleImage(veh.id);
                      return (
                        <div
                          key={veh.id}
                          className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors flex flex-col justify-between"
                        >
                          <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                            <img
                              src={imgSrc}
                              alt={veh.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover hover:scale-103 transition-transform duration-200"
                            />
                            <div className="absolute top-3 left-3 bg-[#0f172a]/85 backdrop-blur-xs text-white type-support font-semibold px-2.5 py-1 rounded-lg">
                              {veh.category}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveVehicle(veh.id)}
                              title="Remove from saved"
                              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-rose-600 hover:scale-105 transition-transform cursor-pointer shadow-xs"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <h5 className="type-h4 text-[#0f172a]">
                                {veh.year} {veh.name}
                              </h5>
                              <p className="type-support text-slate-600 line-clamp-2">
                                {veh.tagline || veh.description}
                              </p>
                              <div className="flex items-center gap-2 pt-1 type-support text-slate-500 tabular-nums">
                                <span>Seats {veh.seating}</span>
                                <span aria-hidden="true">·</span>
                                <span>Luggage {veh.luggage}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#14616d] font-bold">${veh.dailyRate}/day</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={onExploreVehicles}
                                className="btn btn-primary btn-sm w-full"
                              >
                                <span>Reserve Vehicle</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
