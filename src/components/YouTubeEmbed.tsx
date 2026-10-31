import React from 'react';

interface YouTubeEmbedProps {
  urlOrId: string;
  title: string;
  className?: string;
  aspectRatio?: string;
}

export const extractYouTubeId = (input: string): string => {
  if (!input) return '';
  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }
  // Try matching standard YouTube URLs, short URLs, or embed URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = input.match(regExp);
  return match && match[2].length === 11 ? match[2] : input;
};

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  urlOrId,
  title,
  className = '',
  aspectRatio = 'aspect-video',
}) => {
  const videoId = extractYouTubeId(urlOrId);

  if (!videoId) {
    return null;
  }

  // Standard embed URL with proper parameters for reliable cross-origin playback
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <div className={`relative overflow-hidden bg-black ${aspectRatio} ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
      />
    </div>
  );
};
