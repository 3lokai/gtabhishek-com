"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type BlogCoverProps = {
  src: string;
  alt: string;
  title: string;
  objectPosition?: string;
  animate?: boolean;
  caption?: string;
  priority?: boolean;
  className?: string;
};

export function BlogCover({
  src,
  alt,
  objectPosition = "center",
  animate = false,
  caption,
  priority = true,
  className,
}: BlogCoverProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (animate && isLoaded) {
      // Start animation after image loads
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animate, isLoaded]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl",
        "h-[180px] md:h-[32vh]",
        className
      )}
      style={{
        aspectRatio: "16 / 9",
        maxHeight: "420px",
        minHeight: "180px",
      }}
    >
      {/* Image with optional Ken Burns animation */}
      <div
        className={cn(
          "absolute inset-0 transition-transform duration-[8000ms] ease-out",
          animate && shouldAnimate && "scale-[1.03]"
        )}
      >
        <Image
          alt={alt}
          className="object-cover"
          fill
          onLoad={() => setIsLoaded(true)}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          src={src}
          style={{ objectPosition }}
        />
      </div>

      {/* Scrim overlay - adaptive gradient from bottom to transparent with accent tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent dark:from-black/80 dark:via-black/40"
      />
      {/* Accent tint overlay for subtle color enhancement */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent"
      />

      {/* Inner vignette - soft dark edges (2-4% black) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.04)_100%)]"
      />

      {/* Optional caption/credit */}
      {caption ? (
        <div className="absolute right-3 bottom-3 text-white text-xs opacity-[0.5]">
          {caption}
        </div>
      ) : null}
    </div>
  );
}

type BlogCoverFallbackProps = {
  title: string;
  tags?: string[];
  className?: string;
};

export function BlogCoverFallback({
  title,
  tags,
  className,
}: BlogCoverFallbackProps) {
  // Generate a color from the title or tags
  const getColorFromString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + (hash * 31 - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 50%)`;
  };

  const color =
    tags && tags.length > 0
      ? getColorFromString(tags[0])
      : getColorFromString(title);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl",
        "h-[180px] md:h-[32vh]",
        "flex items-center justify-center",
        className
      )}
      style={{
        aspectRatio: "16 / 9",
        maxHeight: "420px",
        minHeight: "180px",
        backgroundColor: color,
      }}
    >
      {/* Gradient overlay for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"
      />

      {/* Icon or first letter */}
      <div className="relative z-10 font-bold text-6xl text-white/80">
        {title.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}
