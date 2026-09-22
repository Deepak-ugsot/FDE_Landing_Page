"use client";

import { useRef, useState } from "react";
import { curriculum } from "@/content/curriculum";
import { CardTab } from "@/components/ui/CardTab";

const n = curriculum.length;
const pad = (i: number) => String(i).padStart(2, "0");
const weeksOf = (duration: string) => parseInt(duration, 10) || 0;
const totalWeeks = curriculum.reduce((sum, m) => sum + weeksOf(m.duration), 0);
const projectCount = curriculum.filter((m) => m.project).length;

// Week each core module starts in; self-paced modules run alongside the core.
const startWeek: number[] = [];
let week = 1;
for (const m of curriculum) {
  startWeek.push(week);
  week += weeksOf(m.duration);
}
const weekRange = (i: number) => {
  const w = weeksOf(curriculum[i].duration);
  if (!w) return "Alongside the core modules";
  return w === 1 ? `Week ${startWeek[i]}` : `Weeks ${startWeek[i]}–${startWeek[i] + w - 1}`;
};

const stats = [
  { value: n, label: "Modules" },
  { value: totalWeeks, label: "Weeks" },
  { value: projectCount, label: "Projects shipped" },
];

function Clock() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 ${back ? "rotate-180" : ""}`} aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Summary, project and topics for one module (shared by the desktop panel and the phone accordion). */
function ModuleBody({ index }: { index: number }) {
  const m = curriculum[index];
  return (
    <>
      <p className="max-w-2xl text-base leading-relaxed text-mist/85">{m.summary}</p>

      {m.project && (
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-accent/25 bg-accent/[0.06] p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-ink-deep" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-5">
              <path d="M5 21V4m0 0h11l-2 4 2 4H5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="font-mono text-[11px] tracking-[0.12em] text-accent uppercase">Project you&apos;ll ship</p>
            <p className="font-display text-lg leading-snug">{m.project}</p>
          </div>
        </div>
      )}

      <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-dim uppercase">Topics covered</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {m.topics.map((t) => (
          <div key={t.heading}>
            <h4 className="flex items-center gap-2 font-display text-base font-semibold">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {t.heading}
            </h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {t.items.map((item) => (
                <li key={item} className="rounded-full border border-ink-line px-3 py-1.5 text-sm leading-snug text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * Phone / tablet layout: each module is a card on a thin timeline spine. Tapping
 * one slides its details open (grid 0fr → 1fr) and closes the others; the opened
 * card's header is then brought back into view if the close above pushed it off.
 */
function ModuleAccordion() {
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
        {curriculum.map((mod, i) => {
          const isOpen = open === i;
          return (
            <li
              key={mod.title}
              className={`overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-500 ${
                isOpen
                  ? "border-accent/30 bg-ink bg-[linear-gradient(160deg,rgba(235,255,85,0.07),transparent_45%)] shadow-[0_20px_50px_-30px_rgba(235,255,85,0.35)]"
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
                      isOpen ? "bg-accent text-ink-deep" : "bg-ink-raised text-dim"
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-display text-[17px] leading-snug transition-colors ${isOpen ? "text-paper" : "text-mist"}`}>
                      {mod.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-dim">
                      <span className="inline-flex items-center gap-1">
                        <Clock />
                        {mod.duration}
                      </span>
                      {weeksOf(mod.duration) > 0 && <span aria-hidden="true">·</span>}
                      {weeksOf(mod.duration) > 0 && <span>{weekRange(i)}</span>}
                    </span>
                  </span>
                  {/* Plus → minus */}
                  <span
                    aria-hidden="true"
                    className={`relative flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
                      isOpen ? "border-accent bg-accent text-ink-deep" : "border-ink-line text-mist"
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
                    <ModuleBody index={i} />
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
 * Curriculum: one card with the module list and the selected module's
 * details, instead of every module being expanded down the page.
 */
export function Curriculum() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const m = curriculum[active];

  // Roving focus for the module list (↑/↓, Home/End), per the WAI-ARIA tabs pattern.
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

        {/* Desktop: module list + selected module */}
        <div className="mt-10 hidden gap-10 lg:grid lg:grid-cols-[320px_1fr]">
          <div role="tablist" aria-label="Curriculum modules" aria-orientation="vertical" className="flex flex-col gap-1" onKeyDown={onKeyDown}>
            {curriculum.map((mod, i) => {
              const isActive = i === active;
              return (
                <button
                  key={mod.title}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`curriculum-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls="curriculum-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
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
                  <span className={`font-mono text-sm font-bold ${isActive ? "text-accent" : "text-dim"}`}>{pad(i + 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-display text-[17px] leading-snug ${isActive ? "text-paper" : "text-mist group-hover:text-paper"}`}>
                      {mod.title}
                    </span>
                    <span className="block text-xs text-dim">{mod.duration}</span>
                  </span>
                  <span className={`transition-all ${isActive ? "text-accent opacity-100" : "-translate-x-1 opacity-0"}`}>
                    <Arrow />
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="curriculum-panel"
            aria-labelledby={`curriculum-tab-${active}`}
            className="flex flex-col rounded-3xl bg-ink p-5 sm:p-8 lg:min-h-[600px]"
          >
            <div key={active} className="flex-1 animate-fade-up motion-reduce:animate-none">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-bold tracking-[0.12em] text-accent uppercase">Module {pad(active + 1)}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-line px-3 py-1 text-xs text-mist">
                  <Clock />
                  {m.duration}
                </span>
                <span className="font-mono text-xs text-dim">{weekRange(active)}</span>
              </div>
              <h3 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-light">{m.title}</h3>
              <div className="mt-3">
                <ModuleBody index={active} />
              </div>
            </div>

            {/* Step through modules */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink-line pt-5">
              <button
                type="button"
                onClick={() => setActive((a) => a - 1)}
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
                onClick={() => setActive((a) => a + 1)}
                disabled={active === n - 1}
                className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-30"
              >
                Next module
                <Arrow />
              </button>
            </div>
          </div>
        </div>

        {/* Phone / tablet: accordion */}
        <ModuleAccordion />
      </div>
    </section>
  );
}
