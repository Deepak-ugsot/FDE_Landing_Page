"use client";

import { useEffect, useRef, useState } from "react";

// 960×540 export of public/assets/background_video.mp4 (1080p, 40 MB): it's blurred and faded, so the
// smaller file (~7 MB) looks the same and starts much sooner. Re-export it if the source video changes.
const VIDEO_SRC = "/assets/background_video_540p.mp4";

/**
 * Decorative, blurred background video on the right side of the hero, looping
 * forever. It stays invisible until it's actually playing, so visitors never
 * see a blank frame — and nothing at all if autoplay is blocked. On phones it
 * sits behind the heading, full width and a little dimmer. Skipped for
 * reduced-motion users.
 */
export function HeroVideo() {
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay can start before React hydrates, so the onPlaying event may already have fired.
  useEffect(() => {
    const v = videoRef.current;
    if (v && !v.paused && v.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) setVisible(true);
  }, []);

  return (
    <div
      aria-hidden="true"
      // Phones/tablets: full width behind the heading. Desktop: the right-hand 56%, as before.
      className="pointer-events-none absolute inset-x-0 top-16 h-[560px] overflow-hidden [mask-image:radial-gradient(ellipse_75%_60%_at_55%_42%,black_20%,transparent_75%)] sm:h-[640px] lg:top-20 lg:left-auto lg:w-[56%] lg:[mask-image:radial-gradient(ellipse_62%_58%_at_62%_46%,black_25%,transparent_75%)] motion-reduce:hidden!"
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        onPlaying={() => setVisible(true)}
        // Overscaled so the -6° tilt never shows the box's corners.
        className={`absolute inset-0 size-full scale-125 -rotate-6 object-cover blur-[3px] grayscale-[35%] transition-opacity duration-1000 ease-out ${
          visible ? "opacity-30 lg:opacity-40" : "opacity-0"
        }`}
      />
    </div>
  );
}
