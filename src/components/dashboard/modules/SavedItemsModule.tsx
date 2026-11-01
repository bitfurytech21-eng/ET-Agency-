import React, { useState } from 'react';
import { SavedItemsSubView } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { PropertyCard } from '../components/PropertyCard';
import { EmptyState } from '../components/EmptyState';
import { PROPERTIES, PropertyListing } from '../../../data/lodgingData';
import { US_VEHICLES, UsVehicle } from '../../../data/vehicleData';
import { Heart, Car, Building2, ArrowRight } from 'lucide-react';

interface SavedItemsModuleProps {
  onReserveProperty: (id: string) => void;
  onExploreVehicles: () => void;
}

export const SavedItemsModule: React.FC<SavedItemsModuleProps> = ({
  onReserveProperty,
  onExploreVehicles,
}) => {
  const [subView, setSubView] = useState<SavedItemsSubView>('index');
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['residence-b', 'residence-c']);
  const [savedVehicleIds, setSavedVehicleIds] = useState<string[]>(['nissan-terra-2020', 'audi-a3-2021']);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'All Saved Items', fileName: 'index.php', badge: savedPropertyIds.length + savedVehicleIds.length },
    { id: 'saved-properties', label: 'Saved Residences', fileName: 'saved-properties.php', badge: savedPropertyIds.length },
    { id: 'saved-vehicles', label: 'Saved Fleet Cars', fileName: 'saved-vehicles.php', badge: savedVehicleIds.length },
  ];

  const toggleSaveProp = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSaveVeh = (id: string) => {
    setSavedVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const savedProperties = PROPERTIES.filter((p: PropertyListing) => savedPropertyIds.includes(p.id));
  const savedVehicles = US_VEHICLES.filter((v: UsVehicle) => savedVehicleIds.includes(v.id));

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/SavedItems/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as SavedItemsSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6">
        <div className="border-b border-[#e6dfd5] pb-4">
          <h3 className="font-heading font-bold text-lg text-[#282828]">
            Saved Wishlist &amp; Shortlist (SavedItems/)
          </h3>
          <p className="text-xs text-[#5c5046]">
            Compare suites, preview floor plans, and bookmark preferred 3D fleet vehicles for upcoming assignments.
          </p>
        </div>

        {/* 1. All Saved Items (index.php) */}
        {subView === 'index' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00b7a8]" />
                <span>Saved Residences ({savedProperties.length})</span>
              </h4>
              {savedProperties.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No Saved Residences"
                  description="Click the heart icon on any residence in the portfolio to save it here."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedProperties.map((p) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      onReserve={onReserveProperty}
                      onToggleSave={toggleSaveProp}
                      isSaved={true}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-[#e6dfd5]">
              <h4 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
                <Car className="w-4 h-4 text-[#82634f]" />
                <span>Saved Fleet Vehicles ({savedVehicles.length})</span>
              </h4>
              {savedVehicles.length === 0 ? (
                <EmptyState
                  icon={Car}
                  title="No Saved Vehicles"
                  description="Explore our interactive 3D fleet models and shortlist your preferred car."
                  actionText="Explore 3D Fleet"
                  onAction={onExploreVehicles}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedVehicles.map((v) => (
                    <div
                      key={v.id}
                      className="bg-white border border-[#e6dfd5] rounded-2xl p-5 hover:border-[#00b7a8] transition-all shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00b7a8]">{v.category}</span>
                        <button
                          type="button"
                          onClick={() => toggleSaveVeh(v.id)}
                          className="text-rose-500 hover:scale-110 cursor-pointer"
                          title="Remove"
                        >
                          <Heart className="w-4 h-4 fill-rose-500" />
                        </button>
                      </div>

                      <h5 className="font-heading font-black text-base text-[#282828]">{v.year} {v.name}</h5>
                      <p className="text-xs text-[#5c5046] line-clamp-2">{v.description}</p>

                      <div className="pt-2 border-t border-[#efe9e0] flex items-center justify-between text-xs">
                        <span className="font-bold text-[#282828]">${v.dailyRate}/day</span>
                        <button
                          type="button"
                          onClick={onExploreVehicles}
                          className="text-[#00b7a8] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>View 3D Model</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Saved Residences Only (saved-properties.php) */}
        {subView === 'saved-properties' && (
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00b7a8]" />
              <span>Saved Residences ({savedProperties.length})</span>
            </h4>

            {savedProperties.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No Saved Residences"
                description="Click the heart icon on any residence in the portfolio to save it here."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedProperties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    onReserve={onReserveProperty}
                    onToggleSave={toggleSaveProp}
                    isSaved={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Saved Vehicles Only (saved-vehicles.php) */}
        {subView === 'saved-vehicles' && (
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#82634f]" />
              <span>Saved Fleet Vehicles ({savedVehicles.length})</span>
            </h4>

            {savedVehicles.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No Saved Vehicles"
                description="Explore our interactive 3D fleet models and shortlist your preferred car."
                actionText="Explore 3D Fleet"
                onAction={onExploreVehicles}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white border border-[#e6dfd5] rounded-2xl p-5 hover:border-[#00b7a8] transition-all shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00b7a8]">{v.category}</span>
                      <button
                        type="button"
                        onClick={() => toggleSaveVeh(v.id)}
                        className="text-rose-500 hover:scale-110 cursor-pointer"
                        title="Remove"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                    </div>

                    <h5 className="font-heading font-black text-base text-[#282828]">{v.year} {v.name}</h5>
                    <p className="text-xs text-[#5c5046] line-clamp-2">{v.description}</p>

                    <div className="pt-2 border-t border-[#efe9e0] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#282828]">${v.dailyRate}/day</span>
                      <button
                        type="button"
                        onClick={onExploreVehicles}
                        className="text-[#00b7a8] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View 3D Model</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

