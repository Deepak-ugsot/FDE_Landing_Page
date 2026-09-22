"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { program } from "@/content/program";

const { introVideoSrc, introVideoId, introVideoStart } = program;

// prefers-reduced-motion as a subscribable value (false on the server).
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4V9Z" fill="currentColor" />
      {muted ? (
        <path d="m16 9 5 6m0-6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

/**
 * Course intro: heading plus a video that starts playing (muted — browsers only
 * allow muted autoplay) once the section is on screen, and pauses when it leaves.
 * Plays a local file if `introVideoSrc` is set, otherwise a YouTube video.
 */
export function CourseIntro() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false); // the YouTube player is only mounted once first seen
  const [muted, setMuted] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play while on screen, pause when scrolled away (no autoplay for reduced-motion users).
  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (video) {
      if (inView) video.play().catch(() => {});
      else video.pause();
    }
    const player = iframeRef.current?.contentWindow;
    player?.postMessage(JSON.stringify({ event: "command", func: inView ? "playVideo" : "pauseVideo", args: [] }), "*");
  }, [inView, reducedMotion]);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: next ? "mute" : "unMute", args: [] }),
      "*",
    );
  };

  const autoplay = reducedMotion ? 0 : 1;
  const youtubeSrc =
    `https://www.youtube-nocookie.com/embed/${introVideoId}?autoplay=${autoplay}&mute=1&playsinline=1` +
    `&start=${introVideoStart}&rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <section id="course-intro" className="pt-4 pb-16 lg:pt-2 lg:pb-24">
      <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
        <h2 className="max-w-4xl font-display text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.06] font-light tracking-[-0.01em]">
          The program built to make you an <span className="whitespace-nowrap text-accent">industry-ready FDE.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
          Designed for engineers who want to own AI deployments end to end, all the way into production.
        </p>

        <div
          ref={frameRef}
          className="relative mt-10 aspect-video w-full overflow-hidden rounded-[24px] bg-ink-deep sm:rounded-[32px] lg:mt-12"
        >
          {introVideoSrc ? (
            <video
              ref={videoRef}
              src={introVideoSrc}
              muted
              loop
              playsInline
              preload="metadata"
              controls={reducedMotion}
              className="absolute inset-0 size-full object-cover"
            />
          ) : introVideoId ? (
            started && (
              <iframe
                ref={iframeRef}
                src={youtubeSrc}
                title="Course intro video"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <span className="size-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
              <p className="font-mono text-xs tracking-[0.12em] text-dim uppercase">Intro video coming soon</p>
            </div>
          )}

          {/* Sound toggle (autoplay has to start muted) */}
          {(introVideoSrc || introVideoId) && !reducedMotion && (
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={!muted}
              className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-2 text-xs font-medium text-paper backdrop-blur transition-colors hover:bg-accent hover:text-ink-deep sm:right-6 sm:bottom-6"
            >
              <SoundIcon muted={muted} />
              {muted ? "Tap for sound" : "Mute"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
