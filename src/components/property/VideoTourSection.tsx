import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Loader2,
  Maximize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { YouTubeEmbed, extractYouTubeId } from '../YouTubeEmbed';

interface VideoTourSectionProps {
  videoTourUrl?: string;
  posterUrl?: string;
  propertyTitle: string;
  unitNumber: string;
}

function isYouTubeVideo(urlOrId: string): boolean {
  const trimmed = urlOrId.trim();
  if (!trimmed) return false;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return true;
  return /youtube\.com|youtu\.be/i.test(trimmed);
}

export const VideoTourSection: React.FC<VideoTourSectionProps> = ({
  videoTourUrl,
  posterUrl,
  propertyTitle,
  unitNumber,
}) => {
  const trimmedUrl = (videoTourUrl || '').trim();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setIsBuffering(false);
    setHasError(false);
    setProgressPercent(0);
  }, [trimmedUrl]);

  // Only render the Video Tour section when an actual video exists for the property
  if (!trimmedUrl) {
    return null;
  }

  const isYouTube = isYouTubeVideo(trimmedUrl) && Boolean(extractYouTubeId(trimmedUrl));

  const togglePlay = async () => {
    const vid = videoRef.current;
    if (!vid || hasError) return;
    try {
      if (vid.paused) {
        setIsBuffering(true);
        await vid.play();
        setIsPlaying(true);
        setIsBuffering(false);
      } else {
        vid.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsBuffering(false);
      setHasError(true);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current || videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <div className="pt-8 border-t border-[#e6dfd5] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="type-h2 text-[#1b1d20]">Residence Video Walkthrough</h2>
          <p className="type-body text-[#5c5046] mt-1">
            Walk through the interior layout, natural lighting, and furnishings of {unitNumber}.
          </p>
        </div>
      </div>

      {isYouTube ? (
        <div className="rounded-xl overflow-hidden border border-[#e6dfd5] bg-black">
          <YouTubeEmbed
            urlOrId={trimmedUrl}
            title={`${propertyTitle} (${unitNumber}) Video Walkthrough`}
            aspectRatio="aspect-16/9"
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative aspect-16/9 rounded-xl overflow-hidden border border-[#e6dfd5] bg-black group"
        >
          {hasError ? (
            <div className="absolute inset-0 bg-[#1b1d20] text-white p-6 flex flex-col items-center justify-center text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-400" />
              <p className="type-body font-medium">
                This walkthrough video could not be loaded in your browser.
              </p>
              <a
                href={trimmedUrl}
                target="_blank"
                rel="noreferrer"
                className="type-btn px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                Open Direct Video Stream
              </a>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={trimmedUrl}
                poster={posterUrl}
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onCanPlay={() => setIsBuffering(false)}
                onError={() => {
                  setIsBuffering(false);
                  setHasError(true);
                }}
                onTimeUpdate={() => {
                  const vid = videoRef.current;
                  if (vid && vid.duration > 0) {
                    setProgressPercent((vid.currentTime / vid.duration) * 100);
                  }
                }}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Center Play Button Overlay when paused */}
              {!isPlaying && !isBuffering && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play walkthrough video"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer"
                >
                  <span className="w-16 h-16 rounded-full bg-white/95 text-[#1b1d20] flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </span>
                </button>
              )}

              {/* Buffering Indicator */}
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 pointer-events-none">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}

              {/* Bottom Control Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-8 pb-3 px-4 space-y-2">
                <div
                  className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const vid = videoRef.current;
                    if (!vid || !vid.duration) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    vid.currentTime = ratio * vid.duration;
                  }}
                >
                  <div
                    className="h-full bg-[#00b7a8] transition-transform origin-left"
                    style={{ transform: `scaleX(${progressPercent / 100})` }}
                  />
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      className="p-1.5 hover:text-[#4de0d2] transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="p-1.5 hover:text-[#4de0d2] transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <span className="type-support text-white/85">{unitNumber} Walkthrough</span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Toggle full-screen video"
                    className="p-1.5 hover:text-[#4de0d2] transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
