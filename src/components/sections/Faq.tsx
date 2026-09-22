"use client";

import { useEffect, useRef, useState } from "react";
import { faqs } from "@/content/faq";
import { program } from "@/content/program";
import { CtaButton } from "@/components/ui/CtaButton";

const ease = "ease-[cubic-bezier(0.65,0,0.35,1)]";

/** Plus made of two bars; the vertical bar turns flat when open, leaving a minus. */
function Toggle({ open }: { open: boolean }) {
  return (
    <span className="relative block size-4 shrink-0" aria-hidden="true">
      <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 bg-current" />
      <span
        className={`absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 bg-current transition-transform duration-500 ${ease} ${
          open ? "rotate-0" : "rotate-90"
        }`}
      />
    </span>
  );
}

/**
 * FAQ accordion. On first view the divider lines draw in left to right and the
 * questions slide up out of a mask, one after another. One answer is open at a
 * time; answers open with a height animation (grid 0fr → 1fr).
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [shown, setShown] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1328px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.35fr] lg:gap-20 lg:px-12">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-light tracking-[-0.01em]">
            Frequently asked
            <br />
            questions
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-mist">
            Everything you need to know before you start. Still unsure? Apply and we&apos;ll get in touch.
          </p>
          <div className="mt-8">
            <CtaButton href={program.applyHref}>Apply now</CtaButton>
          </div>
        </div>

        <div ref={listRef}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const delay = { transitionDelay: shown ? `${i * 90}ms` : "0ms" };
            return (
              <div key={f.q} className="relative">
                {/* Divider that draws in from the left */}
                <span
                  aria-hidden="true"
                  style={delay}
                  className={`absolute inset-x-0 top-0 h-px origin-left bg-ink-line transition-transform duration-1000 ${ease} motion-reduce:transition-none ${
                    shown ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
                  >
                    <span className="overflow-hidden">
                      <span
                        // Stagger only the slide-up (transform), not the hover colour.
                        style={{ transitionDelay: shown ? `${i * 90}ms, 0ms` : "0ms" }}
                        className={`block font-display text-[clamp(1.15rem,1.8vw,1.4rem)] leading-snug font-light transition-[transform,color] duration-700 ${ease} motion-reduce:transition-none ${
                          shown ? "translate-y-0" : "translate-y-[110%]"
                        } ${isOpen ? "text-accent" : "text-paper group-hover:text-accent"}`}
                      >
                        {f.q}
                      </span>
                    </span>
                    <span
                      style={delay}
                      className={`flex shrink-0 transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"} ${isOpen ? "text-accent" : "text-paper"}`}
                    >
                      <Toggle open={isOpen} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-[grid-template-rows] duration-500 ${ease} ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`max-w-2xl pb-7 text-base leading-relaxed text-mist transition-opacity duration-500 ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <span
            aria-hidden="true"
            style={{ transitionDelay: shown ? `${faqs.length * 90}ms` : "0ms" }}
            className={`block h-px origin-left bg-ink-line transition-transform duration-1000 ${ease} motion-reduce:transition-none ${
              shown ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
