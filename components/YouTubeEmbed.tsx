'use client';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
  modestbranding?: boolean;
}

export default function YouTubeEmbed({
  videoId,
  title,
  className = '',
  autoplay = false,
  controls = true,
  modestbranding = true,
}: YouTubeEmbedProps) {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: controls ? '1' : '0',
    modestbranding: modestbranding ? '1' : '0',
    rel: '0', // Don't show related videos from other channels
    playsinline: '1',
  });

  return (
    <div className={`aspect-video w-full ${className}`}>
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title || 'YouTube video player'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

