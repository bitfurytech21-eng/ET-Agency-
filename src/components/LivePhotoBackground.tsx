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
    alt: 'Sunlit furnished executive residence courtyard with travertine walkways and olive trees',
  },
  interior: {
    src: interiorImg,
    alt: 'Modern furnished apartment living and dining suite with white oak flooring and natural daylight',
  },
  twilight: {
    src: twilightImg,
    alt: 'Executive residential arrival drive illuminated by architectural sconces at dusk',
  },
  river: {
    src: riverImg,
    alt: 'Tranquil morning sunrise reflecting across scenic California waterways',
  },
};

const OVERLAY_STYLES: Record<LivePhotoOverlay, string> = {
  espresso:
    'bg-linear-to-br from-[#0f172a]/86 via-[#1e293b]/78 to-[#0b1120]/88',
  dark:
    'bg-linear-to-br from-[#0b1120]/92 via-[#0f172a]/86 to-[#0b1120]/94',
  'warm-hero':
    'bg-linear-to-r from-[#ffffff]/94 via-[#f8fafc]/88 to-[#f1f5f9]/92',
  light:
    'bg-linear-to-b from-[#ffffff]/94 via-[#f8fafc]/90 to-[#ffffff]/95',
  subtle:
    'bg-linear-to-r from-[#0f172a]/72 via-[#1e293b]/54 to-[#0f172a]/76',
};

const FALLBACK_BG: Record<LivePhotoOverlay, string> = {
  espresso: 'bg-[#0f172a]',
  dark: 'bg-[#0b1120]',
  'warm-hero': 'bg-[#f8fafc]',
  light: 'bg-[#ffffff]',
  subtle: 'bg-[#1e293b]',
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
      <img
        src={primaryAsset.src}
        alt={primaryAsset.alt}
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover object-center etl-live-photo-primary"
      />

      {secondaryAsset && (
        <img
          src={secondaryAsset.src}
          alt={secondaryAsset.alt}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center etl-live-photo-secondary"
        />
      )}

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
