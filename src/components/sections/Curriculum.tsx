"use client";

import { useEffect, useRef, useState } from "react";
import { curriculum } from "@/content/curriculum";

const moduleId = (i: number) => `module-${i + 1}`;

function Clock() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Module list on the left (sticky, tracks the module in view) and one detailed
 * card per module on the right. On small screens the list becomes a sticky,
 * horizontally scrolling chip row.
 */
export function Curriculum() {
  const [active, setActive] = useState(0);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const chipsRef = useRef<HTMLDivElement>(null);

  // Scroll-spy: the active module is the last one whose top has passed 40% of the viewport.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let next = 0;
      cardsRef.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) next = i;
      });
      setActive(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Keep the active chip visible in the mobile chip row (horizontal scroll only).
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.children[active] as HTMLElement | undefined;
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - 20, behavior: "smooth" });
  }, [active]);

  return (
    <section id="curriculum" className="scroll-mt-6 py-20 lg:py-28">
      <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
        {/* Intro */}
        <p className="flex items-center gap-2.5 font-display text-base font-bold">
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          Curriculum overview
        </p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.04] font-light tracking-[-0.01em]">
            The structured FDE curriculum <span className="text-dim">you&apos;ll follow.</span>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-mist lg:justify-self-end">
            {curriculum.length} modules that take you from how LLMs work to running a full client engagement, with a
            project to ship at every step.
          </p>
        </div>

        {/* Mobile / tablet: sticky chip row */}
        <nav aria-label="Curriculum modules" className="sticky top-0 z-10 -mx-5 mt-10 bg-ink/95 py-3 backdrop-blur sm:-mx-8 lg:hidden">
          <div ref={chipsRef} className="flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:px-8">
            {curriculum.map((m, i) => (
              <a
                key={m.title}
                href={`#${moduleId(i)}`}
                aria-current={i === active ? "true" : undefined}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                  i === active ? "border-accent bg-accent text-ink-deep" : "border-ink-line text-mist"
                }`}
              >
                Module {i + 1}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-6 grid gap-10 lg:mt-14 lg:grid-cols-[320px_1fr] lg:gap-12">
          {/* Desktop: sticky module list */}
          <nav aria-label="Curriculum modules" className="hidden lg:block">
            <ol className="sticky top-8 space-y-1">
              {curriculum.map((m, i) => {
                const isActive = i === active;
                return (
                  <li key={m.title}>
                    <a
                      href={`#${moduleId(i)}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`group relative block rounded-2xl px-5 py-3.5 transition-colors ${
                        isActive ? "bg-ink-deep" : "hover:bg-ink-raised/60"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute top-1/2 left-0 h-7 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span
                        className={`block font-display text-[17px] font-semibold transition-colors ${
                          isActive ? "text-accent" : "text-paper"
                        }`}
                      >
                        Module {i + 1}
                      </span>
                      <span className={`mt-0.5 block text-sm ${isActive ? "text-mist" : "text-dim group-hover:text-mist"}`}>
                        {m.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Module cards */}
          <div className="space-y-8">
            {curriculum.map((m, i) => (
              <article
                key={m.title}
                id={moduleId(i)}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="scroll-mt-20 lg:scroll-mt-8"
              >
                <header className="flex items-center gap-4 rounded-3xl bg-accent px-5 py-4 text-ink-deep sm:px-6 sm:py-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-deep/10 font-display text-lg font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 font-display text-lg leading-snug font-semibold sm:text-2xl">
                    <span className="sr-only">Module {i + 1}: </span>
                    {m.title}
                  </h3>
                  <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-ink-deep px-3 py-1.5 text-xs font-semibold tracking-wider text-accent uppercase sm:flex">
                    <Clock />
                    {m.duration}
                  </span>
                </header>

                <div className="mt-2 rounded-3xl bg-ink-deep p-5 sm:p-8">
                  <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-accent uppercase sm:hidden">
                    <Clock />
                    {m.duration}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-mist sm:mt-0">{m.summary}</p>
                  {m.project && (
                    <p className="mt-5 text-base">
                      <span className="font-semibold text-accent">Project: </span>
                      {m.project}
                    </p>
                  )}

                  <p className="mt-7 text-xs font-semibold tracking-[0.14em] text-dim uppercase">Topics covered</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {m.topics.map((t) => (
                      <div key={t.heading} className="rounded-2xl border border-ink-line p-5">
                        <h4 className="border-l-2 border-accent pl-3 font-display text-base font-semibold">{t.heading}</h4>
                        <ul className="mt-4 space-y-2.5">
                          {t.items.map((item) => (
                            <li key={item} className="flex gap-2.5 text-sm leading-snug text-muted">
                              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-dim" aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
