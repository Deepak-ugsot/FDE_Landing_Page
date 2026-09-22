"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";

const n = projects.length;
const pad = (i: number) => String(i).padStart(2, "0");
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

// Card size (--reel-w is 86vw on phones, 72vw from sm), capped so card + caption fit under the header.
const cardWidth = "min(var(--reel-w), 1040px, (100svh - 390px) * 1.78)";

// Hand-drawn marker strokes, one per card (cycled), in the page accent.
const scribbles = [
  "M 229 398 C 171 469 89 437 105 327 C 121 218 209 84 271 78 C 321 76 322 144 276 200",
  "M 110 120 C 190 60 300 90 290 170 C 280 250 150 240 160 320 C 170 400 280 410 320 380",
  "M 120 400 C 100 300 180 250 240 280 C 300 310 290 400 230 410 C 160 420 150 300 200 200 C 240 120 300 90 320 70",
];

/**
 * Where a card sits on the reel for a signed distance `d` from the current
 * slot (0 = current, 1 = next, -1 = just passed). Cards lie on a curve that
 * sweeps side to side as it recedes, and the camera travels along it on scroll.
 * `w` / `h` are the card's rendered size, so the curve scales with it.
 */
function place(d: number, w: number, h: number) {
  const s = Math.sin(1.1 * d);
  const x = 0.93 * w * s;
  const y = -0.32 * h * s;
  const z = -0.72 * w * d;
  const rotY = -clamp(0.46 * d, -0.55, 0.55);
  const rotZ = 0.15 * s;
  const opacity = d >= 0 ? clamp((2.7 - d) / 0.9) : clamp((d + 1.6) / 0.6);
  // Rounded so the server-rendered first frame matches the client exactly.
  const r = (v: number, k = 10) => Math.round(v * k) / k;
  return {
    transform: `translate(-50%, -50%) translate3d(${r(x)}px, ${r(y)}px, ${r(z)}px) rotateY(${r(rotY, 1e4)}rad) rotateZ(${r(rotZ, 1e4)}rad)`,
    opacity: r(opacity, 1e3),
  };
}

function Scribble({ path, id }: { path: string; id: string }) {
  return (
    <svg viewBox="80 55 255 410" aria-hidden="true" className="pointer-events-none absolute top-[6%] -left-[4%] h-[36%] w-auto">
      <defs>
        <filter id={id} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.27" numOctaves="2" seed="14" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path
        d={path}
        filter={`url(#${id})`}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Meta({ category, client }: { category: string; client: string }) {
  return (
    <p className="mt-2 flex items-center gap-3 font-mono text-xs text-dim">
      <span>{category}</span>
      <span className="h-3 w-px bg-ink-line" aria-hidden="true" />
      <span>{client}</span>
    </p>
  );
}

/**
 * "In Evidenza"-style reel: the section pins while you scroll, and the camera
 * moves through a 3D line of project cards. The current card shows its title;
 * a counter tracks progress. Reduced-motion users get a plain grid instead.
 */
export function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const captionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame = 0;
    let last = -1;

    const update = () => {
      frame = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      const first = cardsRef.current[0];
      if (!track || !stage || !first) return;

      const rect = track.getBoundingClientRect();
      const t = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
      const p = t * (n - 1);
      const w = first.offsetWidth;
      const h = first.offsetHeight;
      stage.style.perspective = `${Math.round(w * 1.43)}px`;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const d = i - p;
        const { transform, opacity } = place(d, w, h);
        card.style.transform = transform;
        card.style.opacity = String(opacity);
        card.style.visibility = opacity > 0.01 ? "visible" : "hidden";
        const caption = captionsRef.current[i];
        if (caption) caption.style.opacity = String(clamp(1 - Math.abs(d) * 2.2));
      });
      if (barRef.current) barRef.current.style.transform = `scaleX(${t})`;

      const next = Math.round(p);
      if (next !== last) {
        last = next;
        setCurrent(next);
      }
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  const header = (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="flex items-center gap-2.5 font-display text-base font-bold">
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          Projects
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] font-light tracking-[-0.01em]">
          What you&apos;ll <span className="text-dim">ship.</span>
        </h2>
      </div>
      <a href="#projects-end" className="shrink-0 pb-2 font-mono text-xs text-mist transition-colors hover:text-accent">
        Skip projects <span aria-hidden="true">↘</span>
      </a>
    </div>
  );

  return (
    <section id="projects">
      {/* Scroll track: its extra height is the distance the reel plays over */}
      <div ref={trackRef} className="relative motion-reduce:hidden" style={{ height: `${n * 80 + 100}svh` }}>
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
          <div className="mx-auto w-full max-w-[1328px] px-5 pt-10 sm:px-8 lg:px-12 lg:pt-14">{header}</div>

          {/* 3D stage */}
          <div ref={stageRef} className="relative mt-8 flex-1 lg:mt-12" style={{ perspective: "1100px" }}>
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {projects.map((p, i) => {
                const isCurrent = i === current;
                return (
                  <article
                    key={p.title}
                    ref={(el) => {
                      cardsRef.current[i] = el;
                    }}
                    aria-hidden={!isCurrent}
                    className="absolute top-[48%] left-1/2 will-change-transform [--reel-w:86vw] sm:[--reel-w:72vw]"
                    style={{ width: cardWidth, ...place(i, 1000, 562) }}
                  >
                    <a
                      href={p.href}
                      tabIndex={isCurrent ? 0 : -1}
                      className={`group block ${isCurrent ? "" : "pointer-events-none"}`}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-deep">
                        <Image
                          src={p.image}
                          alt={p.imageAlt}
                          fill
                          sizes="(min-width: 1440px) 1040px, 86vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                      <div
                        ref={(el) => {
                          captionsRef.current[i] = el;
                        }}
                        className="mt-4 flex items-start justify-between gap-6"
                        style={{ opacity: i === 0 ? 1 : 0 }}
                      >
                        <div className="min-w-0">
                          <h3 className="line-clamp-2 font-display text-xl sm:truncate font-medium sm:text-[28px] sm:leading-tight">
                            {p.title}
                          </h3>
                          <Meta category={p.category} client={p.client} />
                        </div>
                        <span
                          aria-hidden="true"
                          className="text-2xl leading-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent sm:text-3xl"
                        >
                          ↗
                        </span>
                      </div>
                    </a>
                    <Scribble path={scribbles[i % scribbles.length]} id={`project-marker-${i}`} />
                  </article>
                );
              })}
            </div>
          </div>

          {/* Progress HUD */}
          <div className="mx-auto flex w-full max-w-[1328px] items-center gap-6 px-5 pb-8 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4 font-mono">
              <span className="w-8 font-display text-2xl tabular-nums" aria-live="polite">
                {pad(current + 1)}
              </span>
              <span className="relative h-px w-20 bg-ink-line sm:w-28">
                <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
              </span>
              <span className="text-xs text-dim">{pad(n)}</span>
            </div>
            <p className="ml-auto font-mono text-xs text-dim sm:mx-auto sm:pr-28">
              Scroll to see projects <span aria-hidden="true">↓</span>
            </p>
          </div>
        </div>
      </div>

      {/* Reduced motion: the same projects as a static grid */}
      <div className="mx-auto hidden max-w-[1328px] px-5 py-20 motion-reduce:block sm:px-8 lg:px-12">
        {header}
        <ul className="mt-10 grid gap-10 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.title}>
              <a href={p.href} className="block">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-deep">
                  <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 768px) 50vw, 90vw" className="object-cover" />
                </div>
                <h3 className="mt-4 font-display text-xl font-medium">{p.title}</h3>
                <Meta category={p.category} client={p.client} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div id="projects-end" />
    </section>
  );
}
