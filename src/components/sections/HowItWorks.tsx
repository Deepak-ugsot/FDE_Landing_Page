"use client";

import { useState } from "react";
import { CtaButton } from "@/components/ui/CtaButton";

// Pixel-style marks in the reference's orange, one per step.
const icons = {
  discover: <path d="M12 0h8v12h12v8H20v12h-8V20H0v-8h12V0Z" />,
  build: (
    <>
      <rect x="0" y="16" width="14" height="16" />
      <rect x="18" y="16" width="14" height="16" />
      <rect x="9" y="0" width="14" height="12" />
    </>
  ),
  deploy: <path d="M0 12h18V4l14 12-14 12v-8H0v-8Z" />,
  own: (
    <>
      <rect x="0" y="0" width="32" height="8" />
      <rect x="0" y="12" width="20" height="8" />
      <rect x="0" y="24" width="32" height="8" />
    </>
  ),
};

const steps = [
  {
    title: "Discover",
    icon: icons.discover,
    body: "Sit with the client, separate the stated problem from the real one, and agree on what success means.",
  },
  {
    title: "Build",
    icon: icons.build,
    body: "Design and ship the system across data, backend and AI, on the client's messy real-world data.",
  },
  {
    title: "Deploy",
    icon: icons.deploy,
    body: "Run it inside an environment you don't control: their cloud, their security rules, their users.",
  },
  {
    title: "Own",
    icon: icons.own,
    body: "Prove it works with evals, keep cost and latency in check, and drive adoption after go-live.",
  },
];

// Card specs mirror the reference's Services cards.
const divider = "border-[#44443e]";
const hoverGradient = "bg-[linear-gradient(135deg,rgba(235,255,85,0)_0%,rgba(235,255,85,0.07)_100%)]";
const arrowGradient = "bg-[linear-gradient(315deg,rgba(235,255,85,0.16)_0%,rgba(235,255,85,0)_100%)]";

function Arrow({ left }: { left: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 transition-transform duration-500 ease-out ${left ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Services-style row. At rest all steps look the same. Hovering (or
 * clicking/focusing) a step gives it a soft accent card, an icon and a left
 * arrow while the others dim; leaving the row returns to the resting state.
 */
export function HowItWorks({ applyHref }: { applyHref: string }) {
  // null = resting state: every card looks the same until one is hovered.
  const [active, setActive] = useState<number | null>(null);
  const anyActive = active !== null;

  return (
    <div>
      <p className="flex items-center gap-2 text-sm">
        <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        How an FDE works
      </p>
      <h3 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-light tracking-[-0.01em]">
        The engineer who makes AI work for one specific customer, with the same four-step loop every time.
      </h3>

      <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-4" onMouseLeave={() => setActive(null)}>
        {steps.map((step, i) => {
          const isActive = i === active;
          const isDimmed = anyActive && !isActive;
          return (
            <li
              key={step.title}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`relative flex cursor-pointer flex-col gap-4 rounded-[32px] border-b py-8 pr-6 pl-8 lg:min-h-60 lg:border-r lg:border-b-0 ${divider}`}
            >
              {/* Active card layer */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 rounded-[32px] border-b bg-white/[0.025] ${divider} ${hoverGradient} transition-opacity duration-500 ease-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Heading: the icon grows in from zero width, nudging the title right */}
              <div className="relative flex h-12 items-center">
                <span
                  className={`flex shrink-0 items-center overflow-hidden transition-[width,opacity] duration-500 ease-out ${
                    isActive ? "w-14 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <svg viewBox="0 0 32 32" aria-hidden="true" className="size-10 shrink-0 fill-flame">
                    {step.icon}
                  </svg>
                </span>
                <h4
                  className={`font-display text-[clamp(2rem,2.8vw,2.5rem)] leading-[1.2] font-light whitespace-nowrap transition-colors duration-500 ${
                    isDimmed ? "text-paper/35" : "text-paper"
                  }`}
                >
                  {step.title}
                </h4>
              </div>

              {/* Body with the round arrow button pinned bottom-right */}
              <div className="relative flex-1 pb-2">
                <p
                  className={`max-w-[80%] text-[17px] leading-relaxed transition-colors duration-500 ${
                    isActive ? "text-mist" : isDimmed ? "text-paper/25" : "text-mist/70"
                  }`}
                >
                  {step.body}
                </p>
                <button
                  type="button"
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-label={`Show ${step.title}`}
                  className={`absolute right-0 bottom-0 grid size-11 place-items-center rounded-full lg:size-13 ${arrowGradient} transition-colors duration-500 ${
                    isDimmed ? "text-paper/45" : "text-paper"
                  }`}
                >
                  <Arrow left={isActive} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-10">
        <CtaButton href={applyHref}>Apply now</CtaButton>
      </div>
    </div>
  );
}
