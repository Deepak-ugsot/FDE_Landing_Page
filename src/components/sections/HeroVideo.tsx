"use client";

import { useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";

// Vishwa Mohan's YouTube video (Codingshala, @VishwaMohan-01), embedded (not re-hosted) via the privacy-enhanced player.
const VIDEO_ID = "N_SDFwZ9FPI";
const YT_ORIGIN = "https://www.youtube-nocookie.com";
const STATE = { ENDED: 0, PLAYING: 1 } as const;

// Endless loop over a short clip: only this segment is ever buffered, so it stays smooth and light.
const LOOP_START_S = 0;
const LOOP_END_S = 40;
// YouTube flashes its pause/title overlay for a moment after playback starts; stay hidden until it's gone.
const REVEAL_AFTER_MS = 2500;
// Insert the player once the browser is idle, but never later than this after hydration.
const MAX_WAIT_MS = 1200;

function embedSrc(origin: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    start: String(LOOP_START_S),
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
 * Decorative, blurred background video on the right side of the hero, looping
 * a short clip forever.
 *
 * Speed: connections to YouTube are warmed up right after hydration and the
 * player is inserted as soon as the browser is idle. The iframe is rendered at
 * half size and scaled up, so YouTube streams a small, fast-starting quality
 * (the blur hides it).
 *
 * It stays invisible until it has been playing for a moment (past YouTube's
 * start-up overlay), so visitors never see a thumbnail, play/pause icon or skip
 * buttons — and nothing at all if autoplay is blocked. On phones it sits behind
 * the heading, full width and a little dimmer. Skipped for reduced-motion users.
 */
export function HeroVideo() {
  const [src, setSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Warm up connections, then insert the iframe when idle (all screen sizes).
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    preconnect(YT_ORIGIN);
    preconnect("https://www.youtube.com");
    preconnect("https://i.ytimg.com");

    const start = () => setSrc(embedSrc(window.location.origin));
    // requestIdleCallback isn't in every browser (e.g. older Safari); fall back to a short timeout.
    const idle = (window as Partial<Pick<Window, "requestIdleCallback">>).requestIdleCallback;
    if (idle) {
      // Call it on window (a detached call throws "Illegal invocation").
      const id = window.requestIdleCallback(start, { timeout: MAX_WAIT_MS });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  // Follow the player's state: reveal once playback has settled, and loop the clip.
  useEffect(() => {
    if (!src) return;
    let revealTimer = 0;
    let seeking = false;

    const command = (func: string, args: unknown[] = []) =>
      frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args, id: VIDEO_ID, channel: "widget" }), YT_ORIGIN);
    const backToStart = () => {
      command("seekTo", [LOOP_START_S, true]);
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

      // Loop: once the clip's end (or the video's end, if shorter) is reached, jump back.
      if (info?.currentTime != null) {
        const end = Math.min(LOOP_END_S, info.duration ? info.duration - 1 : Infinity);
        if (info.currentTime >= end && !seeking) {
          seeking = true;
          backToStart();
        } else if (info.currentTime < end - 1) {
          seeking = false;
        }
      }
      // Backup: if it ever ends anyway, restart straight away.
      if (state === STATE.ENDED) backToStart();
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
      // Phones/tablets: full width behind the heading. Desktop: the right-hand 56%, as before.
      className="pointer-events-none absolute inset-x-0 top-16 h-[560px] overflow-hidden [container-type:size] [mask-image:radial-gradient(ellipse_75%_60%_at_55%_42%,black_20%,transparent_75%)] sm:h-[640px] lg:top-20 lg:left-auto lg:w-[56%] lg:[mask-image:radial-gradient(ellipse_62%_58%_at_62%_46%,black_25%,transparent_75%)] motion-reduce:hidden!"
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
          // Rendered at HALF the cover size so YouTube picks a small, fast stream, then scaled 2.5x
          // (= the old 1.25x overscale) to cover the box and crop YouTube's edge UI. Blur is applied
          // before the scale, so 1px here reads like the old 2px+.
          className={`absolute top-1/2 left-1/2 h-[max(50cqh,28.125cqw)] w-[max(50cqw,88.89cqh)] -translate-x-1/2 -translate-y-1/2 scale-250 -rotate-6 border-0 blur-[1px] grayscale-[35%] transition-opacity duration-1000 ease-out ${
            visible ? "opacity-30 lg:opacity-40" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
