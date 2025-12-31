/**
 * HeroBackground Component
 * 
 * Displays a video background with image fallback for the homepage hero section.
 * 
 * Behavior:
 * - Attempts to load and play video
 * - Falls back to static image if video fails to load
 * - Smooth transition between image and video
 * 
 * @component
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Start with image visible, hide it when video successfully loads
  const [showImage, setShowImage] = useState(true);

  /**
   * Video loading logic
   * Attempts to load video and switches to image if video fails
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle video load errors - fallback to image
    const handleError = () => {
      setShowImage(true);
    };

    // Video is ready to play - hide image and show video
    const handleCanPlay = () => {
      setShowImage(false);
    };

    // Video data loaded - hide image and show video
    const handleLoadedData = () => {
      setShowImage(false);
    };

    // Attach event listeners
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);

    // Trigger video load
    video.load();

    // Cleanup: remove event listeners on unmount
    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div className="absolute inset-0 opacity-30">
      {/* Image - shown by default */}
      <Image
        src="/images/journey/after/hero-page.jpg"
        alt="Madina Basketball Court - Completed"
        fill
        className={`object-cover transition-opacity duration-500 ${showImage ? 'opacity-100' : 'opacity-0'}`}
        priority
        unoptimized
      />
      {/* Video background - overlays if it loads */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-500 ${showImage ? 'opacity-0' : 'opacity-100'}`}
      >
        <source src="/videos/compressed/hero-section-video.MOV" type="video/quicktime" />
      </video>
    </div>
  );
}

