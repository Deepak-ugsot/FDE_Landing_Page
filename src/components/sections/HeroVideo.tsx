"use client";

import { useEffect, useRef, useState } from "react";

// 568×320, ~1 MB. The clip is blurred, greyscaled and faded to 30–40% opacity, so a low-bitrate
// export is indistinguishable from the 1080p master while costing a fraction of the page weight.
// The master lives in git history (removed in the asset cleanup); re-export it with:
//   avconvert -s background_video.mp4 -p PresetMediumQuality -o background_video_320p.mp4 --multiPass
const VIDEO_SRC = "/assets/background_video_320p.mp4";

/**
 * Decorative, blurred background video on the right side of the hero, looping
 * forever. It stays invisible until it's actually playing, so visitors never
 * see a blank frame — and nothing at all if autoplay is blocked. On phones it
 * sits behind the heading, full width and a little dimmer. Skipped for
 * reduced-motion users.
 *
 * The src is attached only once the browser goes idle, so this decoration never
 * competes with the hero's text and images for bandwidth on first load.
 */
export function HeroVideo() {
  const [src, setSrc] = useState<string>();
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Reduced-motion users never see it, so don't spend their bandwidth on it either.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = () => setSrc(VIDEO_SRC);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(start, 1000); // Safari < 16.4
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      // Phones/tablets: full width behind the heading. Desktop: the right-hand 56%, as before.
      className="pointer-events-none absolute inset-x-0 top-16 h-[560px] overflow-hidden [mask-image:radial-gradient(ellipse_75%_60%_at_55%_42%,black_20%,transparent_75%)] sm:h-[640px] lg:top-20 lg:left-auto lg:w-[56%] lg:[mask-image:radial-gradient(ellipse_62%_58%_at_62%_46%,black_25%,transparent_75%)] motion-reduce:hidden!"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
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
