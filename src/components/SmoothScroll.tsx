"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Eased mouse-wheel scrolling for the whole page (Lenis). It still scrolls the
 * window itself, so scroll listeners, sticky sections and IntersectionObservers
 * keep working. Touch scrolling stays native, and it's skipped entirely for
 * people who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1, // lower = smoother / floatier
      wheelMultiplier: 1,
      anchors: { offset: 0 }, // in-page links (#curriculum etc.) glide too
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
