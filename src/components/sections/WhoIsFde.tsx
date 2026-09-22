"use client";

import { useEffect, useState } from "react";

const roles = [
  {
    step: "Build",
    title: "Software Engineering",
    body: "Build production-ready systems.",
  },
  {
    step: "Deploy",
    title: "Platform Engineering",
    body: "Make them reliable, scalable and usable.",
  },
  {
    step: "Solve",
    title: "Solutions Architecture",
    body: "Adapt them to real-world problems.",
  },
];

// Connector geometry in a 1000×140 box that spans the three card columns
// (column centres at 1/6, 1/2 and 5/6). Outer lines drop, bevel 45° into a
// shared bus, and everything meets at the node above the result pill.
const NODE = { x: 500, y: 100 };
const paths = [
  "M166.7 0 V60 L206.7 100 H500 V140",
  "M500 0 V140",
  "M833.3 0 V60 L793.3 100 H500 V140",
];

// Folded-corner "document" outline shared by the border and the fill layers.
const cardShape =
  "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)";

function Spinner({ active }: { active: boolean }) {
  return (
    <span
      className="relative flex size-8 items-center justify-center"
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-full border-2 border-white/10" />
      <span
        className={`absolute inset-0 rounded-full border-2 border-transparent border-t-accent transition-opacity duration-500 ${
          active ? "animate-spin opacity-100" : "opacity-0"
        }`}
      />
      <span
        className={`size-2 rounded-full transition-colors duration-500 ${active ? "bg-accent" : "bg-white/25"}`}
      />
    </span>
  );
}

function RoleCard({ index, active }: { index: number; active: boolean }) {
  const r = roles[index];
  return (
    <div className="relative mx-auto w-full max-w-[225px] text-left">
      {/* Glass card: a 1px gradient border layer with the fill layer inset inside it */}
      <div
        className={`relative aspect-[5/4] transition-all md:aspect-[6/7] duration-700 ${active ? "-translate-y-1" : ""}`}
        style={{
          clipPath: cardShape,
          background: active
            ? "linear-gradient(160deg, rgba(235,255,85,0.55), rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.14))"
            : "linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12))",
        }}
      >
        <div
          className="absolute inset-px overflow-hidden"
          style={{
            clipPath: cardShape,
            background:
              "linear-gradient(155deg, #2b2b2b 0%, #161616 42%, #0d0d0d 70%, #1c1c1c 100%)",
          }}
        >
          {/* Sheen that sweeps across the active card */}
          {active && (
            <span
              key={`sheen-${index}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-white/10 to-transparent motion-reduce:hidden"
            />
          )}
          <div className="relative flex h-full flex-col p-4">
            <div className="flex items-center gap-3">
              <Spinner active={active} />
              <span
                className={`font-mono text-[13px] font-bold tracking-[0.12em] uppercase ${active ? "text-accent" : "text-dim"}`}
              >
                0{index + 1} · {r.step}
              </span>
            </div>
            <p className="mt-auto mb-10 text-xs leading-snug text-mist/80">
              {r.body}
            </p>
          </div>
        </div>
        {/* The folded corner */}
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 size-8"
          style={{
            background:
              "linear-gradient(225deg, transparent 50%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.04))",
          }}
        />
      </div>

      {/* Title chip overlapping the card's lower-left edge */}
      <div
        className={`absolute bottom-3 -left-2.5 rounded-lg border px-2.5 py-1.5 font-display text-sm leading-tight font-medium backdrop-blur-md transition-colors duration-700 ${
          active
            ? "border-accent/40 bg-ink-raised/90 text-paper"
            : "border-white/10 bg-ink-raised/80 text-paper/85"
        }`}
      >
        {r.title}
      </div>
    </div>
  );
}

function ResultPill({ lit }: { lit: boolean }) {
  return (
    <div
      className={`relative inline-flex items-center gap-3 rounded-full border bg-gradient-to-b from-[#2a2a2a] to-[#111] py-2 pr-5 pl-2 transition-[border-color,box-shadow] duration-500 ${
        lit
          ? "border-accent/50 shadow-[0_0_40px_-6px_rgba(235,255,85,0.45)]"
          : "border-white/12 shadow-none"
      }`}
    >
      <span
        className="flex size-7 items-center justify-center rounded-full bg-accent text-ink-deep"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="size-4">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="font-display text-base font-semibold tracking-tight whitespace-nowrap sm:text-lg">
        Forward Deployed AI Engineer
      </span>
    </div>
  );
}

/**
 * "Who is an FDE?": three role cards whose connectors merge into one node and
 * flow down into the result. One role is active at a time — its ring spins,
 * a light sweeps the card, and a pulse travels its line down to the result.
 */
export function WhoIsFde() {
  const [active, setActive] = useState(0);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let litTimer: ReturnType<typeof setTimeout>;
    const tick = () => {
      // The pulse reaches the pill ~1.1s into its 1.5s run.
      litTimer = setTimeout(() => {
        setLit(true);
        litTimer = setTimeout(() => setLit(false), 700);
      }, 1100);
    };
    tick();
    const id = setInterval(() => {
      setActive((a) => (a + 1) % roles.length);
      tick();
    }, 2400);
    return () => {
      clearInterval(id);
      clearTimeout(litTimer);
    };
  }, []);

  return (
    <div className="text-center">
      <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-ink-raised/60 px-4 py-1.5 text-sm text-mist">
          <span
            className="size-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          Who is an FDE?
        </p>
        <h3 className="mx-auto mt-5 font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.1] font-light tracking-[-0.01em] lg:whitespace-nowrap">
          Who is a Forward Deployed{" "}
          <span className="bg-gradient-to-r from-paper via-paper/70 to-paper/35 bg-clip-text text-transparent">
            Engineer?
          </span>
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-mist/80">
          This role combines building, deploying and owning AI systems. It spans
          software, platforms and solutions. It exists to make AI work beyond
          demos.
        </p>
      </div>

      {/* Diagram panel */}
      <div className="relative mx-4 mt-10 overflow-hidden rounded-[32px] bg-ink-deep px-5 pt-12 pb-10 sm:mx-6 sm:px-10 lg:mx-8">
        {/* Desktop / tablet: cards → merging connectors → result */}
        <div className="mx-auto hidden max-w-[980px] md:block">
          {/* No grid gap: columns stay exactly 1/3 wide so card centres line up with the connectors */}
          <div className="grid grid-cols-3">
            {roles.map((r, i) => (
              <div key={r.step} className="px-4 lg:px-6">
                <RoleCard index={i} active={i === active} />
              </div>
            ))}
          </div>
          <svg
            viewBox="0 0 1000 140"
            className="block w-full overflow-visible"
            aria-hidden="true"
          >
            {paths.map((d, i) => (
              <g key={d}>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1.5"
                />
                {i === active && (
                  <path
                    key={`pulse-${active}`}
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="0.22 1"
                    className="animate-line-pulse drop-shadow-[0_0_6px_rgba(235,255,85,0.8)] motion-reduce:hidden"
                  />
                )}
              </g>
            ))}
            {/* Merge node */}
            <rect
              x={NODE.x - 9}
              y={NODE.y - 9}
              width="18"
              height="18"
              rx="5"
              fill="#111"
              stroke={lit ? "var(--color-accent)" : "rgba(255,255,255,0.35)"}
              strokeWidth="1.5"
              className="transition-[stroke] duration-500"
            />
            <circle
              cx={NODE.x}
              cy={NODE.y}
              r="3"
              fill={lit ? "var(--color-accent)" : "rgba(255,255,255,0.5)"}
            />
          </svg>
        </div>

        {/* Phone: stacked cards on one spine */}
        <div className="relative mx-auto flex max-w-[240px] flex-col items-center gap-8 md:hidden">
          <span
            className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-white/14"
            aria-hidden="true"
          />
          {roles.map((r, i) => (
            <div key={r.step} className="relative w-full">
              <RoleCard index={i} active={i === active} />
            </div>
          ))}
          <span className="-mt-4 h-6" aria-hidden="true" />
        </div>

        <div className="flex justify-center">
          <ResultPill lit={lit} />
        </div>
        <p className="mt-5 font-mono text-sm font-bold tracking-[0.2em] text-accent uppercase sm:text-base">
          Build <span className="text-dim">•</span> Deploy{" "}
          <span className="text-dim">•</span> Solve
        </p>
      </div>
    </div>
  );
}
