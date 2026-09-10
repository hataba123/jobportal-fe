"use client";

import Image from "next/image";
import { useState } from "react";
import { isExternalImageUrl, toBackendUrl } from "@/lib/api/url";

interface SafeImageProps {
  src?: string | null;
  fallback?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Ảnh backend/local/external với fallback cố định, không làm vỡ layout khi URL lỗi. */
export default function SafeImage({
  src,
  fallback = "/image/Image.jpg",
  alt,
  width,
  height,
  className,
  sizes,
  priority,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const normalized = src ? toBackendUrl(src) : fallback;
  const displaySrc = failed ? fallback : normalized;

  if (isExternalImageUrl(displaySrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={displaySrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      unoptimized
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
