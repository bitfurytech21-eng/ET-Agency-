import React, { useState, useRef, useEffect } from 'react';
import { UsVehicle } from '../data/vehicleData';
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCw,
  Compass,
} from 'lucide-react';

interface Vehicle3DViewerProps {
  vehicle: UsVehicle;
  selectedColorHex?: string;
  onColorChange?: (hex: string) => void;
}

export const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({
  vehicle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
  }, [vehicle.id, reloadKey]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request denied or not supported', err);
    }
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-[#0b1120] border border-slate-700 shadow-xl flex flex-col transition-all ${
        isFullscreen ? 'h-screen p-4 sm:p-6' : 'h-[480px] sm:h-[560px] lg:h-[600px]'
      }`}
    >
      {/* Top Studio Header Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="type-h4 text-white">{vehicle.name}</h4>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="type-support font-semibold text-[#5eead4]">
              360° 3D Studio
            </span>
          </div>
          <p className="type-support text-slate-400 hidden sm:block tabular-nums mt-0.5">
            {vehicle.specs.horsepower} · {vehicle.drivetrain}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReload}
            title="Reset 3D camera view"
            className="type-btn p-2 sm:px-3.5 sm:py-2 rounded-lg border border-slate-700 bg-[#1e293b] hover:bg-slate-700 text-slate-200 hover:text-white whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden md:inline">Reset View</span>
          </button>

          <a
            href={vehicle.sketchfab.modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View original 3D asset on Sketchfab"
            className="type-btn p-2 sm:px-3.5 sm:py-2 rounded-lg border border-slate-700 bg-[#1e293b] hover:bg-slate-700 text-slate-200 hover:text-white whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#5eead4]" />
            <span className="hidden md:inline">Sketchfab</span>
          </a>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            className="type-btn p-2 sm:px-3.5 sm:py-2 rounded-lg border border-[#14616d] bg-[#14616d] hover:bg-[#0f4952] text-white whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Iframe Viewport */}
      <div className="relative flex-1 w-full h-full min-h-[300px] bg-[#0b1120] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-xs text-white space-y-3 pointer-events-none px-4 text-center">
            <div className="w-9 h-9 border-2 border-slate-700 border-t-[#5eead4] rounded-full animate-spin" />
            <div className="type-body font-semibold text-slate-200">
              Loading 3D studio model for {vehicle.name}...
            </div>
            <div className="type-support text-slate-400">
              Initializing interactive 360° camera controls
            </div>
          </div>
        )}

        <iframe
          key={`${vehicle.id}-${reloadKey}`}
          title={vehicle.sketchfab.title}
          src={vehicle.sketchfab.embedUrl}
          className="w-full h-full border-0 absolute inset-0 z-0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />

        <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a]/85 backdrop-blur-md border border-slate-700 type-support text-slate-300">
          <Compass className="w-4 h-4 text-[#5eead4] shrink-0" />
          <span>Drag to rotate 360° · Scroll to zoom · Right-click to pan</span>
        </div>
      </div>

      {/* Bottom Attribution Bar */}
      <div className="relative z-20 px-4 py-2 sm:px-5 bg-[#0f172a] border-t border-slate-800 flex items-center justify-end text-right">
        <div className="type-support text-slate-400">
          <span>3D Model: </span>
          <a
            href={vehicle.sketchfab.modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-200 hover:text-[#5eead4] hover:underline"
          >
            {vehicle.sketchfab.title}
          </a>
          <span> by </span>
          <a
            href={vehicle.sketchfab.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-200 hover:text-[#5eead4] hover:underline"
          >
            {vehicle.sketchfab.authorName}
          </a>
          <span> on </span>
          <a
            href="https://sketchfab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-200 hover:text-[#5eead4] hover:underline"
          >
            Sketchfab
          </a>
        </div>
      </div>
    </div>
  );
};
