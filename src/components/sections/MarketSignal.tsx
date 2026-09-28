"use client";

import { useEffect, useRef } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { lerpRect, roundedUnionPath, type Rect } from "@/lib/roundedUnion";

// Why the role is in demand, shown in the stepped cluster (xl+) or a card grid.
const points = [
  {
    title: "AI adoption is accelerating",
    body: "Businesses are moving beyond experimentation and looking for people who can turn AI capabilities into working systems.",
    accent: true,
  },
  {
    title: "The deployment gap is growing",
    body: "Knowing how to use an AI model is different from engineering a reliable solution around it.",
  },
  {
    title: "Production skills matter",
    body: "The value of AI comes from what actually gets adopted, used, and integrated into a business.",
  },
  {
    title: "The role is evolving",
    body: "Forward Deployed Engineering sits at the intersection of software, AI, product, and the customer.",
  },
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
  { left: 60, top: 88, width: 216 },
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
  if (g1 > 0) rects.push(lerpRect([200, 180, 280, 220], [40, 70, 296, 220], g1));
  return rects;
}

const START_PATH = roundedUnionPath(clusterRects(0), RADIUS);
const DELAY_MS = 250;
const DURATION_MS = 1200;

/**
 * "Our vision"-style card: copy on the left, a stepped dark cluster of points
 * on the right that breaks out of the card's corner. When the cluster scrolls
 * into view it grows out of the corner block by block (once), and the points
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

  const pointContent = (point: (typeof points)[number]) => (
    <>
      <span className={`block font-display text-lg leading-tight font-medium ${point.accent ? "text-accent" : "text-paper"}`}>
        {point.title}
      </span>
      <span className="mt-1.5 block text-[13px] leading-snug text-muted/80">{point.body}</span>
    </>
  );

  const opportunityLabel = (
    <p className="flex items-center gap-2.5 font-display text-base font-bold">
      <span className="size-2 rounded-full bg-accent-deep" aria-hidden="true" />
      The opportunity
    </p>
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
            The market is moving from AI experiments to AI in production
          </h3>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-deep/75">
            <p>
              AI models are increasingly accessible. The harder problem is making them work inside real businesses —
              with real data, real systems, real users, and real constraints.
            </p>
            <p>
              That is creating demand for a new kind of engineer: someone who can understand the business problem, build
              the solution, deploy it in the real world, and stay accountable for what happens next.
            </p>
          </div>
          <div className="mt-8">
            <CtaButton href={applyHref}>Apply to the next cohort</CtaButton>
          </div>
        </div>

        {/* Below xl: simple 2x2 grid of dark cards */}
        <div className="mt-12 xl:hidden">
          {opportunityLabel}
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point.title} className="rounded-3xl bg-ink p-6">
                {pointContent(point)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* xl+: stepped cluster anchored to (and spilling past) the bottom-right corner */}
      <div ref={clusterRef} className="pointer-events-none absolute -right-[60px] -bottom-[60px] hidden h-[620px] w-[700px] xl:block">
        <svg viewBox="0 0 700 620" className="absolute inset-0 size-full" aria-hidden="true">
          <path ref={pathRef} d={START_PATH} fill="var(--color-ink)" />
        </svg>
        {/* Points are masked by the same outline, so they appear as the shape grows under them. */}
        <div className="absolute top-8 left-[60px]">{opportunityLabel}</div>
        <ul ref={statsRef} className="absolute inset-0" style={{ clipPath: `path("${START_PATH}")` }}>
          {points.map((point, i) => (
            <li key={point.title} className="absolute" style={STAT_POS[i]}>
              {pointContent(point)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
