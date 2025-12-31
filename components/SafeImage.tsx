/**
 * SafeImage Component
 * 
 * Wraps Next.js Image component with error handling for missing images.
 * Shows a placeholder when image fails to load.
 * 
 * @component
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  placeholderSize?: "sm" | "md" | "lg";
}

export default function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  placeholderSize = "md",
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Size mappings for placeholder icons
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  if (hasError || !src) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 ${className}`}>
        <Users className={`${sizeMap[placeholderSize]} text-gray-300`} />
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

