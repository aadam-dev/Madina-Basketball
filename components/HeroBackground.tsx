'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onReady = () => setVideoReady(true);
    video.addEventListener('canplay', onReady);
    video.addEventListener('loadeddata', onReady);
    video.load();
    return () => {
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('loadeddata', onReady);
    };
  }, []);

  return (
    <>
      {/* Fallback image — always rendered, hidden once video is ready */}
      <Image
        src="/images/journey/after/hero-background.jpg"
        alt="Madina Basketball Court"
        fill
        priority
        unoptimized
        className={`object-cover transition-opacity duration-700 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
      />
      {/* MP4 video — swaps in when ready */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src="/videos/highlights/compressed/launch-aerial-view-compressed.mp4" type="video/mp4" />
        <source src="/videos/highlights/compressed/launch-game-highlights-compressed.mp4" type="video/mp4" />
      </video>
    </>
  );
}
