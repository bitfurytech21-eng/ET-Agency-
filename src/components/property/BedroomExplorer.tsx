import React, { useEffect, useState } from 'react';
import { Bath, BedDouble, Check } from 'lucide-react';
import { BedroomDetail } from '../../data/propertyEnrichment';
import { getFallbackPropertyImage } from '../../data/lodgingData';

interface BedroomExplorerProps {
  propertyId: string;
  bedrooms: BedroomDetail[];
  fallbackImages: string[];
}

export const BedroomExplorer: React.FC<BedroomExplorerProps> = ({
  propertyId,
  bedrooms,
  fallbackImages,
}) => {
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [roomImageLoaded, setRoomImageLoaded] = useState(false);

  useEffect(() => {
    setSelectedRoomIdx(0);
    setRoomImageLoaded(false);
  }, [propertyId]);

  if (!bedrooms || bedrooms.length === 0) {
    return null;
  }

  const activeRoom = bedrooms[selectedRoomIdx] || bedrooms[0];
  const resolvedImage =
    activeRoom.image ||
    fallbackImages[selectedRoomIdx % Math.max(1, fallbackImages.length)] ||
    getFallbackPropertyImage(selectedRoomIdx);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="type-h2 text-[#1b1d20]">Sleeping Arrangements &amp; Suite Layout</h2>
          <p className="type-body text-[#5c5046] mt-1">
            Explore each bedroom’s mattress configuration, bathroom access, and in-room furnishings.
          </p>
        </div>

        <span className="type-support text-[#697076] tabular-nums shrink-0">
          {bedrooms.length} {bedrooms.length === 1 ? 'Private Bedroom' : 'Private Bedrooms'}
        </span>
      </div>

      {/* Interactive Room Selector Tabs */}
      <div
        role="tablist"
        aria-label="Select bedroom"
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin"
      >
        {bedrooms.map((room, idx) => {
          const isActive = idx === selectedRoomIdx;
          return (
            <button
              key={room.id || idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                if (idx !== selectedRoomIdx) {
                  setRoomImageLoaded(false);
                  setSelectedRoomIdx(idx);
                }
              }}
              className={`type-btn px-4 py-2.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#1b1d20] text-white border-[#1b1d20]'
                  : 'bg-white text-[#5c5046] border-[#dfd7cc] hover:border-[#82634f] hover:text-[#1b1d20]'
              }`}
            >
              {room.roomLabel}
            </button>
          );
        })}
      </div>

      {/* Selected Room Detail Panel */}
      <div className="bg-white border border-[#e6dfd5] rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
        <div className="md:col-span-6 relative aspect-4/3 md:aspect-auto md:min-h-[280px] bg-[#f2ece4]">
          {!roomImageLoaded && (
            <div className="absolute inset-0 bg-[#ede6dc] animate-pulse flex items-center justify-center">
              <span className="type-support text-[#857568]">Loading room photograph...</span>
            </div>
          )}
          <img
            key={`${propertyId}-room-${selectedRoomIdx}`}
            src={resolvedImage}
            alt={`${activeRoom.roomLabel} — ${activeRoom.title}`}
            referrerPolicy="no-referrer"
            onLoad={() => setRoomImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getFallbackPropertyImage(selectedRoomIdx + 1);
              setRoomImageLoaded(true);
            }}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              roomImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="type-support text-[#697076] flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#00897d]">{activeRoom.roomLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{activeRoom.bedConfig}</span>
            </div>

            <h3 className="type-h3 text-[#1b1d20]">{activeRoom.title}</h3>

            <p className="type-body text-[#434a4f]">{activeRoom.description}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#efe9e0]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5">
                <BedDouble className="w-4 h-4 text-[#00897d] shrink-0 mt-1 stroke-[1.75]" />
                <div>
                  <span className="type-support text-[#697076] block">Bed Configuration</span>
                  <span className="type-support font-semibold text-[#1b1d20]">{activeRoom.bedConfig}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Bath className="w-4 h-4 text-[#00897d] shrink-0 mt-1 stroke-[1.75]" />
                <div>
                  <span className="type-support text-[#697076] block">Bathroom Access</span>
                  <span className="type-support font-semibold text-[#1b1d20]">
                    {activeRoom.bathroomAccess}
                  </span>
                </div>
              </div>
            </div>

            {activeRoom.facilities && activeRoom.facilities.length > 0 && (
              <div>
                <span className="type-label text-[#1b1d20] block mb-2">Room Appointments</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeRoom.facilities.map((item, idx) => (
                    <li key={idx} className="type-support text-[#434a4f] flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00897d] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
