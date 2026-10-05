"use client";

import { useRef, useState } from "react";
import { curriculum, modulesOf } from "@/content/curriculum";
import { CardTab } from "@/components/ui/CardTab";

const n = curriculum.length;
const pad = (i: number) => String(i).padStart(2, "0");
const moduleCount = curriculum.reduce((sum, p) => sum + modulesOf(p).length, 0);
const topicCount = curriculum.reduce((sum, p) => sum + modulesOf(p).reduce((t, m) => t + m.topics.length, 0), 0);

const stats = [
  { value: n, label: "Phases" },
  { value: moduleCount, label: "Modules" },
  { value: topicCount, label: "Topics" },
];

const phaseMeta = (i: number) => {
  const count = modulesOf(curriculum[i]).length;
  return `${count} module${count === 1 ? "" : "s"}`;
};

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 ${back ? "rotate-180" : ""}`} aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** One phase's modules and topics, in teaching order (shared by the desktop panel and the phone accordion). */
function PhaseBody({ index }: { index: number }) {
  return (
    // Cards stretch to their row's height, so a short module doesn't leave a ragged gap above the next row.
    <ol className="grid gap-3 xl:grid-cols-2">
      {modulesOf(curriculum[index]).map((mod, i) => (
        <li key={mod.title} className="flex flex-col rounded-2xl border border-ink-line/70 bg-ink-raised/30 p-5">
          <h4 className="flex items-baseline gap-3 font-display text-lg leading-snug">
            <span className="font-mono text-xs font-bold text-accent-light">
              {index + 1}.{i + 1}
            </span>
            {mod.title}
          </h4>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {mod.topics.map((topic) => (
              <li key={topic} className="rounded-full border border-ink-line px-2.5 py-1 text-[13px] leading-snug text-muted">
                {topic}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/**
 * Phone / tablet layout: each phase is a card on a thin timeline spine. Tapping
 * one slides its details open (grid 0fr → 1fr) and closes the others; the opened
 * card's header is then brought back into view if the close above pushed it off.
 */
function PhaseAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  const headersRef = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);
    if (next === null) return;
    // After the height animation, make sure the opened header is on screen.
    window.setTimeout(() => {
      const top = headersRef.current[next]?.getBoundingClientRect().top ?? 0;
      if (top < 16) window.scrollBy({ top: top - 16, behavior: "smooth" });
    }, 520);
  };

  return (
    <div className="relative mt-10 lg:hidden">
      {/* Timeline spine running through the number badges */}
      <span aria-hidden="true" className="absolute top-6 bottom-6 left-[36px] w-px bg-ink-line" />
      <ol className="relative flex flex-col gap-3">
        {curriculum.map((phase, i) => {
          const isOpen = open === i;
          return (
            <li
              key={phase.title}
              className={`overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-500 ${
                isOpen
                  ? "border-accent/30 bg-ink bg-[linear-gradient(160deg,rgba(230,22,31,0.07),transparent_45%)] shadow-[0_20px_50px_-30px_rgba(230,22,31,0.35)]"
                  : "border-ink-line/70 bg-ink"
              }`}
            >
              <h3>
                <button
                  ref={(el) => {
                    headersRef.current[i] = el;
                  }}
                  type="button"
                  id={`curriculum-acc-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`curriculum-acc-panel-${i}`}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition-colors duration-500 ${
                      isOpen ? "bg-accent text-on-accent" : "bg-ink-raised text-dim"
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] tracking-[0.14em] text-dim uppercase">Phase {pad(i + 1)}</span>
                    <span className={`block font-display text-[17px] leading-snug transition-colors ${isOpen ? "text-paper" : "text-mist"}`}>
                      {phase.title}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] text-dim">{phaseMeta(i)}</span>
                  </span>
                  {/* Plus → minus */}
                  <span
                    aria-hidden="true"
                    className={`relative flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
                      isOpen ? "border-accent bg-accent text-on-accent" : "border-ink-line text-mist"
                    }`}
                  >
                    <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
                    <span
                      className={`absolute h-[1.5px] w-3 rounded-full bg-current transition-transform duration-500 ${
                        isOpen ? "rotate-0" : "rotate-90"
                      }`}
                    />
                  </span>
                </button>
              </h3>
              <div
                id={`curriculum-acc-panel-${i}`}
                role="region"
                aria-labelledby={`curriculum-acc-${i}`}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`border-t border-ink-line/70 px-4 pt-4 pb-5 transition-opacity duration-500 ${
                      isOpen ? "opacity-100 delay-150" : "opacity-0"
                    }`}
                  >
                    <PhaseBody index={i} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Curriculum: one card with the phase list and the selected phase's modules,
 * instead of every phase being expanded down the page.
 */
export function Curriculum() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const p = curriculum[active];

  // Phases can be long: when switching, bring the panel's top back into view if it scrolled away.
  const select = (i: number) => {
    setActive(i);
    const top = panelRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 24, behavior: "smooth" });
  };

  // Roving focus for the phase list (↑/↓, Home/End), per the WAI-ARIA tabs pattern.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: n - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + n) % n;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="curriculum" className="mx-4 pt-28 pb-16 sm:mx-6 lg:mx-8 lg:pb-24">
      <div className="relative rounded-[32px] rounded-tl-none bg-ink-deep px-5 pt-10 pb-8 sm:px-8 lg:px-12 lg:pt-12 lg:pb-12">
        <CardTab>Curriculum</CardTab>

        {/* Heading + key numbers */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl font-display text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-light tracking-[-0.01em]">
            The structured FDE curriculum <span className="text-dim">you&apos;ll follow.</span>
          </h2>
          <dl className="flex gap-8 sm:gap-12">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl leading-none font-light text-accent sm:text-5xl">{s.value}</dd>
                <dd className="mt-2 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Desktop: phase list (sticky while a long phase scrolls) + selected phase */}
        <div className="mt-10 hidden gap-10 lg:grid lg:grid-cols-[320px_1fr]">
          <div
            role="tablist"
            aria-label="Curriculum phases"
            aria-orientation="vertical"
            className="flex flex-col gap-1 self-start lg:sticky lg:top-24"
            onKeyDown={onKeyDown}
          >
            {curriculum.map((phase, i) => {
              const isActive = i === active;
              return (
                <button
                  key={phase.title}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`curriculum-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls="curriculum-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(i)}
                  className={`group relative flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors ${
                    isActive ? "bg-ink-raised" : "hover:bg-ink-raised/50"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className={`font-mono text-sm font-bold ${isActive ? "text-paper" : "text-dim"}`}>{pad(i + 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-display text-[17px] leading-snug ${isActive ? "text-paper" : "text-mist group-hover:text-paper"}`}>
                      {phase.title}
                    </span>
                    <span className="block text-xs text-dim">{phaseMeta(i)}</span>
                  </span>
                  <span className={`transition-all ${isActive ? "text-accent opacity-100" : "-translate-x-1 opacity-0"}`}>
                    <Arrow />
                  </span>
                </button>
              );
            })}
          </div>

          <div
            ref={panelRef}
            role="tabpanel"
            id="curriculum-panel"
            aria-labelledby={`curriculum-tab-${active}`}
            className="flex scroll-mt-24 flex-col rounded-3xl bg-ink p-5 sm:p-8 lg:min-h-[600px]"
          >
            <div key={active} className="flex-1 animate-fade-up motion-reduce:animate-none">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-bold tracking-[0.12em] text-accent-light uppercase">Phase {pad(active + 1)}</span>
                <span className="rounded-full border border-ink-line px-3 py-1 text-xs text-mist">{phaseMeta(active)}</span>
              </div>
              <h3 className="mt-4 mb-8 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-light">{p.title}</h3>
              <PhaseBody index={active} />
            </div>

            {/* Step through phases */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink-line pt-5">
              <button
                type="button"
                onClick={() => select(active - 1)}
                disabled={active === 0}
                className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-30"
              >
                <Arrow back />
                Previous
              </button>
              <span className="font-mono text-xs text-dim">
                {pad(active + 1)} / {pad(n)}
              </span>
              <button
                type="button"
                onClick={() => select(active + 1)}
                disabled={active === n - 1}
                className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-30"
              >
                Next phase
                <Arrow />
              </button>
            </div>
          </div>
        </div>

        {/* Phone / tablet: accordion */}
        <PhaseAccordion />
      </div>
    </section>
  );
}
