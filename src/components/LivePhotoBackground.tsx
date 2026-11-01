import React from 'react';
import courtyardImg from '../assets/images/sacramento_courtyard_hero_1793491092775.jpg';
import interiorImg from '../assets/images/warm_suite_interior_1793491093928.jpg';
import twilightImg from '../assets/images/twilight_residence_drive_1793491095868.jpg';
import riverImg from '../assets/images/american_river_sunrise_1793491096385.jpg';

export type LivePhotoScene = 'courtyard' | 'interior' | 'twilight' | 'river' | 'cycle';
export type LivePhotoOverlay = 'espresso' | 'dark' | 'warm-hero' | 'light' | 'subtle';

interface LivePhotoBackgroundProps {
  scene?: LivePhotoScene;
  secondaryScene?: Exclude<LivePhotoScene, 'cycle'>;
  overlay?: LivePhotoOverlay;
  className?: string;
  children?: React.ReactNode;
}

const SCENE_ASSETS: Record<
  Exclude<LivePhotoScene, 'cycle'>,
  { src: string; alt: string }
> = {
  courtyard: {
    src: courtyardImg,
    alt: 'Sunlit furnished executive residence courtyard with travertine walkways and olive trees at golden hour',
  },
  interior: {
    src: interiorImg,
    alt: 'Warm luxury furnished apartment living and dining room with white oak flooring and afternoon sunlight',
  },
  twilight: {
    src: twilightImg,
    alt: 'Boutique residential arrival drive illuminated by warm amber architectural sconces at dusk',
  },
  river: {
    src: riverImg,
    alt: 'Tranquil morning sunrise reflecting across scenic waters near our executive residences',
  },
};

const OVERLAY_STYLES: Record<LivePhotoOverlay, string> = {
  espresso:
    'bg-linear-to-br from-[#1f1915]/82 via-[#2b211b]/74 to-[#1a1512]/86',
  dark:
    'bg-linear-to-br from-[#191411]/90 via-[#241d18]/84 to-[#15110e]/92',
  'warm-hero':
    'bg-linear-to-r from-[#faf7f2]/90 via-[#f7f1e8]/80 to-[#faf7f2]/86',
  light:
    'bg-linear-to-b from-[#fcfaf7]/92 via-[#f8f3eb]/88 to-[#fcfaf7]/94',
  subtle:
    'bg-linear-to-r from-[#241c17]/62 via-[#2c221b]/44 to-[#1e1713]/68',
};

const FALLBACK_BG: Record<LivePhotoOverlay, string> = {
  espresso: 'bg-linear-to-br from-[#2a211b] via-[#3b2e25] to-[#1e1814]',
  dark: 'bg-linear-to-br from-[#1f1915] via-[#2b221c] to-[#16120f]',
  'warm-hero': 'bg-linear-to-br from-[#f7f2ea] via-[#efe7db] to-[#e6dbc9]',
  light: 'bg-linear-to-br from-[#faf8f5] via-[#f4efe7] to-[#ebe3d7]',
  subtle: 'bg-linear-to-br from-[#332820] via-[#45362c] to-[#261e18]',
};

export const LivePhotoBackground: React.FC<LivePhotoBackgroundProps> = ({
  scene = 'courtyard',
  secondaryScene,
  overlay = 'espresso',
  className = '',
  children,
}) => {
  const isCycle = scene === 'cycle';
  const primaryKey: Exclude<LivePhotoScene, 'cycle'> = isCycle ? 'courtyard' : scene;
  const secondaryKey: Exclude<LivePhotoScene, 'cycle'> | null = isCycle
    ? secondaryScene || 'interior'
    : secondaryScene || null;

  const primaryAsset = SCENE_ASSETS[primaryKey];
  const secondaryAsset = secondaryKey ? SCENE_ASSETS[secondaryKey] : null;

  const backdropLayer = (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${FALLBACK_BG[overlay]} ${children ? '' : className}`}
    >
      {/* Primary live realistic photograph with gentle compositor pan/zoom */}
      <img
        src={primaryAsset.src}
        alt={primaryAsset.alt}
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover object-center etl-live-photo-primary"
      />

      {/* Optional crossfading secondary realistic photograph for living multi-scene ambiance */}
      {secondaryAsset && (
        <img
          src={secondaryAsset.src}
          alt={secondaryAsset.alt}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center etl-live-photo-secondary"
        />
      )}

      {/* Subtle warm golden-hour sunlight drift layer */}
      <div className="absolute inset-0 bg-radial from-[#f5d09c]/22 via-transparent to-transparent etl-warm-sunlight-drift" />

      {/* Measured contrast scrim matching the website's warm hospitality palette */}
      <div className={`absolute inset-0 ${OVERLAY_STYLES[overlay]}`} />
    </div>
  );

  if (children) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {backdropLayer}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return backdropLayer;
};

export const LIVE_PHOTO_URLS = {
  courtyard: courtyardImg,
  interior: interiorImg,
  twilight: twilightImg,
  river: riverImg,
};
