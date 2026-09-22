"use client";

import { useEffect, useRef } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { lerpRect, roundedUnionPath, type Rect } from "@/lib/roundedUnion";

// Every figure is sourced; keep the footnote links in sync when editing.
const stats = [
  { value: "729%", label: "Year-over-year growth in FDE job postings on Indeed", accent: true },
  { value: "1,000", label: "The FDE team Salesforce has committed to building" },
  { value: "$170K+", label: "US pay for FDE roles, running past $200K" },
  { value: "95%", label: "of enterprise GenAI pilots showed no measurable P&L impact" },
];

const sources = [
  { label: "Indeed via Business Insider, May 2026", href: "https://www.aol.com/articles/job-postings-tech-role-grown-185134000.html" },
  { label: "Salesforce, Mar 2026", href: "https://www.salesforce.com/ap/blog/forward-deployed-engineer/" },
  { label: "MIT NANDA via Fortune, Aug 2025", href: "https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo" },
];

/*
 * Stepped cluster geometry, in px, in a 700x620 box whose point (640, 560) is
 * the card's bottom-right corner. Anything past it runs over the page
 * background (same colour), so the bottom block reads as breaking out of the
 * card; the two thin strips there give the card's edges rounded corners where
 * the block meets them.
 */
const RADIUS = 24;
const CORNER = { x: 640, y: 560 };
const STAT_POS = [
  { left: 64, top: 90, width: 200 },
  { left: 306, top: 202, width: 270 },
  { left: 24, top: 334, width: 270 },
  { left: 350, top: 446, width: 262 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * The shape at time t (0 → 1), mirroring the reference timeline: the bottom
 * block grows out of the card corner first (slow start), then each block
 * above emerges from the previous one and grows to size.
 */
function clusterRects(t: number): Rect[] {
  const seg = (a: number, b: number) => clamp01((t - a) / (b - a));
  const g4 = easeIn(seg(0, 0.4));
  const g3 = seg(0.4, 0.55);
  const g2 = seg(0.55, 0.78);
  const g1 = easeOut(seg(0.78, 1));

  const rects: Rect[] = [
    // Bottom block: grows up-left out of the card corner, plus its two edge strips.
    [CORNER.x - 340 * g4, CORNER.y - 140 * g4, 700, 620],
    [CORNER.x, CORNER.y - 220 * g4, 700, 620],
    [CORNER.x - 420 * g4, CORNER.y, 700, 620],
  ];
  // Each later block starts as the small square where it joins the one before.
  if (g3 > 0) rects.push(lerpRect([300, 420, 330, 450], [0, 300, 330, 450], g3));
  if (g2 > 0) rects.push(lerpRect([200, 300, 330, 330], [200, 180, 600, 330], g2));
  if (g1 > 0) rects.push(lerpRect([200, 180, 280, 220], [40, 70, 280, 220], g1));
  return rects;
}

const START_PATH = roundedUnionPath(clusterRects(0), RADIUS);
const DELAY_MS = 250;
const DURATION_MS = 1200;

/**
 * "Our vision"-style card: copy on the left, a stepped dark cluster of stats
 * on the right that breaks out of the card's corner. When the cluster scrolls
 * into view it grows out of the corner block by block (once), and the stats
 * are uncovered by the same shape, like the reference's logo mask.
 */
export function MarketSignal({ applyHref }: { applyHref: string }) {
  const clusterRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const statsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const cluster = clusterRef.current;
    const pathEl = pathRef.current;
    const statsEl = statsRef.current;
    if (!cluster || !pathEl || !statsEl) return;

    const draw = (t: number) => {
      const d = roundedUnionPath(clusterRects(t), RADIUS);
      pathEl.setAttribute("d", d);
      statsEl.style.clipPath = `path("${d}")`;
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(1);
      return;
    }

    let frame = 0;
    let timer = 0;
    const play = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = clamp01((now - start) / DURATION_MS);
        draw(t);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // plays once, like the reference
        timer = window.setTimeout(play, DELAY_MS);
      },
      { threshold: 0.3 },
    );
    observer.observe(cluster);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, []);

  const statContent = (stat: (typeof stats)[number]) => (
    <>
      <span className={`block font-display text-[44px] leading-none font-light tracking-tight ${stat.accent ? "text-accent" : "text-paper"}`}>
        {stat.value}
      </span>
      <span className="mt-2 block text-[13px] leading-snug text-muted/80">{stat.label}</span>
    </>
  );

  return (
    <div className="relative mx-4 rounded-[32px] bg-paper text-ink-deep sm:mx-6 lg:mx-8 xl:min-h-[560px]">
      <div className="mx-auto max-w-[1328px] px-5 py-16 sm:px-8 lg:px-12 xl:py-24">
        <div className="max-w-[480px] 2xl:max-w-[540px]">
          <p className="flex items-center gap-2.5 font-display text-base font-bold">
            <span className="size-2 rounded-full bg-flame" aria-hidden="true" />
            The market signal
          </p>
          <h3 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,3.5rem)] leading-[1.02] font-normal tracking-[-0.01em]">
            The fastest-rising role in tech
          </h3>
          <p className="mt-6 text-base leading-relaxed text-ink-deep/75">
            Companies can buy models off the shelf. What they can&apos;t buy is the engineer who makes those models work
            inside their business. That gap is why FDE hiring has taken off, and why people who can do the job are
            scarce.
          </p>
          <div className="mt-8">
            <CtaButton href={applyHref}>Apply now</CtaButton>
          </div>
          <p className="mt-8 text-xs leading-relaxed text-ink-deep/50">
            Sources:{" "}
            {sources.map((s, i) => (
              <span key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                  {s.label}
                </a>
                {i < sources.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>

        {/* Below xl: simple 2x2 grid of dark stat cards */}
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 xl:hidden">
          {stats.map((stat) => (
            <li key={stat.value} className="rounded-3xl bg-ink p-6">
              {statContent(stat)}
            </li>
          ))}
        </ul>
      </div>

      {/* xl+: stepped cluster anchored to (and spilling past) the bottom-right corner */}
      <div ref={clusterRef} className="pointer-events-none absolute -right-[60px] -bottom-[60px] hidden h-[620px] w-[700px] xl:block">
        <svg viewBox="0 0 700 620" className="absolute inset-0 size-full" aria-hidden="true">
          <path ref={pathRef} d={START_PATH} fill="var(--color-ink)" />
        </svg>
        {/* Stats are masked by the same outline, so they appear as the shape grows under them. */}
        <ul ref={statsRef} className="absolute inset-0" style={{ clipPath: `path("${START_PATH}")` }}>
          {stats.map((stat, i) => (
            <li key={stat.value} className="absolute" style={STAT_POS[i]}>
              {statContent(stat)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
