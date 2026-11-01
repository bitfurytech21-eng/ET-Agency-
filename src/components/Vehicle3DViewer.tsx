import React, { useState, useRef, useEffect } from 'react';
import { UsVehicle } from '../data/vehicleData';
import { 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  RotateCw, 
  Eye, 
  Sparkles, 
  Compass, 
  Layers
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

  // Reset loading state whenever vehicle or reload key changes
  useEffect(() => {
    setIsLoading(true);
  }, [vehicle.id, reloadKey]);

  // Fullscreen change listener
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
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#14100d] border border-[#3f332b] shadow-2xl flex flex-col transition-all ${
        isFullscreen ? 'h-screen p-4 sm:p-6' : 'h-[500px] sm:h-[580px] lg:h-[620px]'
      }`}
    >
      {/* Top Header Bar inside 3D Viewer */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-[#1f1915]/95 backdrop-blur-md border-b border-[#3f332b]">
        {/* Left: Vehicle Title & Specs Tag */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00b7a8] animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                {vehicle.name}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#00b7a8]/20 border border-[#00b7a8]/40 text-[#4de0d2]">
                3D Interactive
              </span>
            </div>
            <p className="text-[11px] text-[#c8b9a9] hidden sm:block">
              {vehicle.specs.horsepower} • {vehicle.drivetrain}
            </p>
          </div>
        </div>

        {/* Right Controls: Reset, Open in Sketchfab, Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReload}
            title="Reset 3D camera view"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[#45382f] bg-[#2a211b]/80 hover:bg-[#392d24] text-[#ede5dc] hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Camera</span>
          </button>

          <a
            href={vehicle.sketchfab.modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View original 3D asset on Sketchfab"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[#45382f] bg-[#2a211b]/80 hover:bg-[#392d24] text-[#ede5dc] hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#00b7a8]" />
            <span className="hidden md:inline">Sketchfab Model</span>
          </a>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[#00b7a8]/40 bg-[#00b7a8]/15 hover:bg-[#00b7a8]/30 text-[#4de0d2] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Iframe Container */}
      <div className="relative flex-1 w-full h-full min-h-[300px] bg-[#0c0908] overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#15110e]/90 backdrop-blur-xs text-white space-y-3 pointer-events-none transition-opacity duration-300">
            <div className="w-10 h-10 border-3 border-[#00b7a8]/30 border-t-[#00b7a8] rounded-full animate-spin" />
            <div className="text-xs font-semibold text-[#ede5dc] tracking-wide">
              Loading interactive 3D model for {vehicle.name}...
            </div>
            <div className="text-[11px] text-[#a89988]">
              Initializing WebGL, materials &amp; environment shaders
            </div>
          </div>
        )}

        {/* The Official Sketchfab 3D Embed Iframe */}
        <iframe
          key={`${vehicle.id}-${reloadKey}`}
          title={vehicle.sketchfab.title}
          src={vehicle.sketchfab.embedUrl}
          className="w-full h-full border-0 absolute inset-0 z-0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />

        {/* Subtle Orbit Tip Pill on bottom-left */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181310]/85 backdrop-blur-md border border-[#3f332b]/80 text-[11px] text-[#ede5dc] shadow-lg">
          <Compass className="w-3.5 h-3.5 text-[#00b7a8]" />
          <span>Click &amp; drag to rotate 360° • Scroll to zoom • Right-click to pan</span>
        </div>
      </div>

      {/* Bottom Attribution Bar */}
      <div className="relative z-20 px-4 py-2.5 sm:px-6 bg-[#191410] border-t border-[#3f332b] flex items-center justify-end text-right">
        {/* Sketchfab Author Credit / Attribution */}
        <div className="text-[11px] text-[#a89988]">
          <span>3D Model: </span>
          <a
            href={vehicle.sketchfab.modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#00b7a8] hover:underline"
          >
            {vehicle.sketchfab.title}
          </a>
          <span> by </span>
          <a
            href={vehicle.sketchfab.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#00b7a8] hover:underline"
          >
            {vehicle.sketchfab.authorName}
          </a>
          <span> on </span>
          <a
            href="https://sketchfab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#00b7a8] hover:underline"
          >
            Sketchfab
          </a>
        </div>
      </div>
    </div>
  );
};
