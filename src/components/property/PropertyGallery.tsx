import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  X,
} from 'lucide-react';
import { getFallbackPropertyImage } from '../../data/lodgingData';
import { useCart } from '../../context/CartContext';

interface PropertyGalleryProps {
  propertyId: string;
  title: string;
  unitNumber: string;
  images: string[];
  onRequireAuth?: () => void;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  propertyId,
  title,
  unitNumber,
  images,
  onRequireAuth,
}) => {
  const { isWishlisted, toggleWishlist } = useCart();
  const safeImages = images.length > 0 ? images : [getFallbackPropertyImage(0)];

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [savingWishlist, setSavingWishlist] = useState(false);
  const [wishlistPrompt, setWishlistPrompt] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const saved = isWishlisted(propertyId);

  useEffect(() => {
    setActiveIndex(0);
    setImageLoaded(false);
    setLightboxOpen(false);
    setWishlistPrompt(false);
  }, [propertyId]);

  const goToIndex = (nextIdx: number) => {
    const normalized = ((nextIdx % safeImages.length) + safeImages.length) % safeImages.length;
    if (normalized !== activeIndex) {
      setImageLoaded(false);
      setActiveIndex(normalized);
    }
  };

  const handlePrev = () => goToIndex(activeIndex - 1);
  const handleNext = () => goToIndex(activeIndex + 1);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goToIndex(activeIndex - 1);
      if (e.key === 'ArrowRight') goToIndex(activeIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeIndex, safeImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = touchStartXRef.current - endX;
    touchStartXRef.current = null;
    if (Math.abs(delta) > 45) {
      if (delta > 0) handleNext();
      else handlePrev();
    }
  };

  const handleWishlistClick = async () => {
    if (savingWishlist) return;
    setSavingWishlist(true);
    try {
      const res = await toggleWishlist(propertyId);
      if (res.requiresAuth) {
        setWishlistPrompt(true);
      } else {
        setWishlistPrompt(false);
      }
    } finally {
      setSavingWishlist(false);
    }
  };

  // Show up to 12 dot indicators directly; for larger galleries show condensed window
  const maxIndicators = Math.min(safeImages.length, 10);
  const indicatorIndices = Array.from({ length: maxIndicators }, (_, idx) => {
    if (safeImages.length <= maxIndicators) return idx;
    const half = Math.floor(maxIndicators / 2);
    const start = Math.max(0, Math.min(safeImages.length - maxIndicators, activeIndex - half));
    return start + idx;
  });

  return (
    <div className="space-y-3">
      {/* Main Hero Photograph */}
      <div
        className="relative aspect-16/10 sm:aspect-16/9 bg-[#f2ece4] rounded-xl overflow-hidden border border-[#e6dfd5]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Skeleton Placeholder */}
        {!imageLoaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#ede6dc] animate-pulse flex items-center justify-center"
          >
            <span className="type-support text-[#857568] font-medium">
              Loading residence photograph...
            </span>
          </div>
        )}

        <img
          key={`${propertyId}-${activeIndex}`}
          src={safeImages[activeIndex]}
          alt={`${title} (${unitNumber}) — Photograph ${activeIndex + 1} of ${safeImages.length}`}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getFallbackPropertyImage(activeIndex);
            setImageLoaded(true);
          }}
          onClick={() => setLightboxOpen(true)}
          className={`w-full h-full object-cover transition-opacity duration-200 cursor-zoom-in ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Top Bar Overlay: Photo Count + Wishlist Action */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="type-support px-3 py-1.5 bg-black/70 text-white font-medium rounded-lg tabular-nums pointer-events-auto">
            Photo {activeIndex + 1} of {safeImages.length}
          </div>

          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={savingWishlist}
            aria-label={saved ? 'Remove from saved residences' : 'Save residence to wishlist'}
            className={`type-btn px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer pointer-events-auto whitespace-nowrap ${
              saved
                ? 'bg-white text-rose-700 border border-rose-200'
                : 'bg-black/70 hover:bg-black/85 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Previous / Next Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photograph"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Scrim: Clickable Indicators + Fullscreen Button */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pt-8 pb-3 px-3 sm:px-4 flex items-center justify-between gap-3">
          {safeImages.length > 1 ? (
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Photograph indicators">
              {indicatorIndices.map((imgIdx) => {
                const isActive = imgIdx === activeIndex;
                return (
                  <button
                    key={imgIdx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`View photograph ${imgIdx + 1}`}
                    onClick={() => goToIndex(imgIdx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      isActive ? 'w-6 bg-white' : 'w-2 bg-white/55 hover:bg-white/85'
                    }`}
                  />
                );
              })}
            </div>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="type-btn px-3.5 py-2 bg-white/95 hover:bg-white text-[#1b1d20] rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Maximize2 className="w-4 h-4 text-[#00897d]" />
            <span>Full-Screen Gallery ({safeImages.length})</span>
          </button>
        </div>
      </div>

      {/* Unauthenticated Wishlist Sign-In Prompt */}
      {wishlistPrompt && (
        <div className="type-support p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-wrap items-center justify-between gap-3 text-[#282828]">
          <span>Sign in to save residences to your personal account wishlist.</span>
          <div className="flex items-center gap-2">
            {onRequireAuth && (
              <button
                type="button"
                onClick={onRequireAuth}
                className="type-btn px-3.5 py-1.5 rounded-lg bg-[#00b7a8] hover:bg-[#009b8e] text-white cursor-pointer whitespace-nowrap"
              >
                Sign In / Register
              </button>
            )}
            <button
              type="button"
              onClick={() => setWishlistPrompt(false)}
              className="type-btn px-2.5 py-1.5 text-[#5c5046] hover:text-[#1b1d20] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Thumbnail Navigation Strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {safeImages.map((imgUrl, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${propertyId}-thumb-${idx}`}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Select photograph ${idx + 1}`}
                className={`w-20 sm:w-24 h-14 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-opacity cursor-pointer bg-[#f2ece4] ${
                  isActive
                    ? 'border-[#00897d] opacity-100'
                    : 'border-transparent opacity-65 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${title} thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(idx);
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Full-Screen Lightbox Viewer */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="type-support text-white/75 truncate">{unitNumber}</p>
              <h3 className="type-nav font-semibold text-white truncate tabular-nums">
                {title} · Photo {activeIndex + 1} of {safeImages.length}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close full-screen gallery"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative max-w-6xl w-full mx-auto flex-1 my-4 flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={safeImages[activeIndex]}
              alt={`${title} full-screen photograph ${activeIndex + 1}`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackPropertyImage(activeIndex);
              }}
              className="max-h-[72vh] max-w-full object-contain rounded-lg"
            />

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photograph"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photograph"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {safeImages.length > 1 && (
            <div
              className="max-w-6xl w-full mx-auto flex gap-2 overflow-x-auto pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {safeImages.map((imgUrl, idx) => (
                <button
                  key={`lb-thumb-${idx}`}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`w-16 h-12 shrink-0 rounded-md overflow-hidden border-2 transition-opacity cursor-pointer ${
                    idx === activeIndex
                      ? 'border-[#00b7a8] opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-90'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${title} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackPropertyImage(idx);
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
