"use client";

import { useEffect, useMemo, useRef } from "react";

const DIM = 0.18; // resting opacity of unrevealed characters
const EDGE = 8; // characters over which the reveal fades in, for a soft sweep
const FILL_END = 0.85; // fraction of the pinned scroll by which all text is lit

function splitSentences(sentences: string[]) {
  const words: { key: string; chars: { ch: string; i: number }[] }[] = [];
  const starts: number[] = [];
  let i = 0;
  sentences.forEach((sentence, si) => {
    starts.push(i);
    sentence.split(" ").forEach((word, wi) => {
      words.push({ key: `${si}-${wi}`, chars: [...word].map((ch) => ({ ch, i: i++ })) });
    });
  });
  return { words, starts, total: i };
}

/**
 * Pinned block whose characters light up in reading order as the user
 * scrolls, with a "01 / 03" counter tracking the current sentence.
 */
export function ScrollRevealText({ label, sentences }: { label: string; sentences: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);
  const { words, starts, total } = useMemo(() => splitSentences(sentences), [sentences]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    const counter = counterRef.current;
    if (!wrap || !sticky || !counter) return;
    const chars = charRefs.current;
    const setCounter = (n: number) => (counter.textContent = String(n).padStart(2, "0"));

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chars.forEach((c) => (c.style.opacity = "1"));
      setCounter(sentences.length);
      return;
    }

    let frame = 0;
    let lastLit = -1;

    const update = () => {
      frame = 0;
      // Progress runs while the block is pinned: from the wrapper reaching the
      // sticky offset until the block hits the wrapper's bottom edge.
      const rect = wrap.getBoundingClientRect();
      const pinTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const scrollable = Math.max(1, rect.height - sticky.offsetHeight);
      const progress = Math.min(1, Math.max(0, (pinTop - rect.top) / scrollable));
      const lit = Math.min(1, progress / FILL_END) * (total + EDGE);
      if (Math.abs(lit - lastLit) < 0.05) return;
      lastLit = lit;

      for (let i = 0; i < total; i++) {
        const t = Math.min(1, Math.max(0, (lit - i) / EDGE));
        chars[i].style.opacity = (DIM + (1 - DIM) * t).toFixed(3);
      }
      const head = Math.max(0, lit - EDGE);
      setCounter(starts.findLastIndex((s) => s <= head) + 1);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [starts, total, sentences.length]);

  return (
    <div ref={wrapRef} className="relative my-20 h-[220vh] motion-reduce:h-auto lg:my-28">
      {/* Content-height sticky block, pinned near the top (no full-screen empty space). */}
      <div ref={stickyRef} className="sticky top-[12svh] motion-reduce:static">
        <div className="flex items-center justify-between gap-6 text-sm">
          <p className="flex items-center gap-2 tracking-[0.14em] text-dim uppercase">
            <span className="size-1.5 rounded-full bg-flame" aria-hidden="true" />
            {label}
          </p>
          <p className="font-mono" aria-hidden="true">
            <span ref={counterRef} className="text-paper">
              01
            </span>
            <span className="text-dim"> / {String(sentences.length).padStart(2, "0")}</span>
          </p>
        </div>

        <p
          aria-hidden="true"
          className="mt-10 font-display text-[clamp(1.75rem,3.9vw,3.4rem)] leading-[1.12] font-light tracking-[-0.01em]"
        >
          {words.map((word) => (
            <span key={word.key}>
              <span className="inline-block whitespace-nowrap">
                {word.chars.map(({ ch, i }) => (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) charRefs.current[i] = el;
                    }}
                    style={{ opacity: DIM }}
                  >
                    {ch}
                  </span>
                ))}
              </span>{" "}
            </span>
          ))}
        </p>
        <p className="sr-only">{sentences.join(" ")}</p>
      </div>
    </div>
  );
}
