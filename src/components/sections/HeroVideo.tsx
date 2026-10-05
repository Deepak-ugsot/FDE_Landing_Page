"use client";

import { useEffect, useRef, useState } from "react";

// Two encodes of the same 11.8s clip, both H.264 and both with the audio track stripped — the
// element is muted, so an AAC track is weight nobody ever hears (the old 320p file carried one).
//
// Phones get the 640x360 cut: the hero box is the full viewport width there, so ~390px of CSS
// width, and 640 still lands slightly oversampled. Everything from `sm:` up gets 960x540, which
// roughly matches the 56% column the video occupies on desktop once `scale-125` is applied.
//
// Earlier this was a single 568x320 @715kbps file. That measured 33.8dB luma PSNR against the
// master and the artifacts survived the 3px blur — chalk lettering in the background smeared and
// hair detail went blotchy. 960x540 @1100kbps measures 42.0dB and reads clean at the same blur.
//
// The 1920x1080 master is in git history (deleted in 46bf4a2, so `git show 46bf4a2^:public/assets/
// background_video.mp4 > master.mp4` brings it back). Re-encode with AVAssetWriter at
// AVVideoAverageBitRateKey 1_100_000 / 650_000 and no audio input; `avconvert` can't hit these
// bitrates or drop the audio track, so the comment that used to live here was wrong.
//
// NOTE: /assets/* is served `immutable` for a year (see next.config.ts), so any re-encode has to
// land under a NEW filename or browsers will keep the old bytes.
const VIDEO_WIDE = "/assets/background_video_960x540.mp4";
const VIDEO_NARROW = "/assets/background_video_640x360.mp4";

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

    // Resolved once, on idle. A later resize doesn't re-pick: swapping the src mid-visit would
    // re-download the whole clip to show the same frames at a resolution nobody asked for.
    const start = () =>
      setSrc(window.matchMedia("(min-width: 640px)").matches ? VIDEO_WIDE : VIDEO_NARROW);

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
