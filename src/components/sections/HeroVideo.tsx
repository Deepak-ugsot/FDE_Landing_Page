"use client";

import { useEffect, useRef, useState } from "react";

// Vishwa Mohan's YouTube video (Codingshala, @VishwaMohan-01), embedded (not re-hosted) via the privacy-enhanced player.
const VIDEO_ID = "N_SDFwZ9FPI";
const YT_ORIGIN = "https://www.youtube-nocookie.com";
const STATE = { ENDED: 0, PLAYING: 1 } as const;
// YouTube flashes its pause/title overlay for a moment after playback starts; stay hidden until it's gone.
const REVEAL_AFTER_MS = 3000;
// Jump back to the start this close to the end, so the end screen never shows.
const LOOP_BEFORE_END_S = 1.5;

function embedSrc(origin: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    // No loop/playlist params: a one-video playlist makes YouTube show prev/next buttons. We loop via the API instead.
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    enablejsapi: "1", // lets us hear the player's state and send it commands
    origin,
  });
  return `${YT_ORIGIN}/embed/${VIDEO_ID}?${params}`;
}

type PlayerInfo = { playerState?: number; currentTime?: number; duration?: number };
type PlayerMessage = { event?: string; info?: number | PlayerInfo };

/**
 * Decorative, blurred background video on the right side of the hero.
 * The heavy YouTube iframe is only inserted after the page has loaded. It stays
 * invisible until it has been playing for a few seconds (past YouTube's
 * start-up overlay), so visitors never see a thumbnail, play/pause icon or
 * skip buttons — and nothing at all if autoplay is blocked. Looping is done
 * through the player API. Hidden on small screens and for reduced-motion users.
 */
export function HeroVideo() {
  const [src, setSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Insert the iframe only after the page load event, and only on lg+ screens
  // (a hidden iframe still downloads the ~1MB player, so skip it on phones).
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(min-width: 1024px)").matches) return;
    const start = () => setSrc(embedSrc(window.location.origin));
    if (document.readyState === "complete") {
      const id = window.setTimeout(start, 300);
      return () => clearTimeout(id);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  // Follow the player's state: reveal once playback has settled, and loop it ourselves.
  useEffect(() => {
    if (!src) return;
    let revealTimer = 0;
    let looping = false;

    const command = (func: string, args: unknown[] = []) =>
      frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args, id: VIDEO_ID, channel: "widget" }), YT_ORIGIN);
    const restart = () => {
      command("seekTo", [0, true]);
      command("playVideo");
    };

    const onMessage = (e: MessageEvent) => {
      if (!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(e.origin) || e.source !== frameRef.current?.contentWindow) return;
      let data: PlayerMessage | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      const info = typeof data?.info === "object" ? data.info : undefined;
      const state = typeof data?.info === "number" ? data.info : info?.playerState;

      if (state === STATE.PLAYING && !revealTimer) {
        revealTimer = window.setTimeout(() => setVisible(true), REVEAL_AFTER_MS);
      }
      // Loop just before the end so the end screen never appears…
      if (info?.currentTime != null && info.duration && info.duration - info.currentTime < LOOP_BEFORE_END_S) {
        if (!looping) {
          looping = true;
          restart();
        }
      } else if (info?.currentTime != null && info.currentTime < LOOP_BEFORE_END_S) {
        looping = false;
      }
      // …and as a backup, if it does end, hide it, restart, and reveal again once playing.
      if (state === STATE.ENDED) {
        setVisible(false);
        clearTimeout(revealTimer);
        revealTimer = 0;
        restart();
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(revealTimer);
    };
  }, [src]);

  // Once loaded, ask the player to start sending state events.
  const subscribe = () => {
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: VIDEO_ID, channel: "widget" }), YT_ORIGIN);
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-20 right-0 hidden h-[640px] w-[56%] overflow-hidden [container-type:size] [mask-image:radial-gradient(ellipse_62%_58%_at_62%_46%,black_25%,transparent_75%)] lg:block motion-reduce:hidden!"
    >
      {src && (
        <iframe
          ref={frameRef}
          src={src}
          onLoad={subscribe}
          title="Background video"
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          // Cover the box at 16:9, overscale to crop YouTube's edge UI, then tilt, fade and blur.
          className={`absolute top-1/2 left-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 scale-125 -rotate-6 border-0 blur-[2px] grayscale-[35%] transition-opacity duration-1000 ease-out ${
            visible ? "opacity-40" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
