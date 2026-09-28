import { program } from "@/content/program";
import { InverseCorner } from "@/components/ui/InverseCorner";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { WhoIsFde } from "./WhoIsFde";
import { MarketSignal } from "./MarketSignal";

const ink = "var(--color-ink)";
const inkDeep = "var(--color-ink-deep)";

// What businesses need from an FDE, shown as an icon list beside the intro.
const capabilities = [
  {
    title: "Understand the problem",
    body: "Work directly with stakeholders to identify where AI can create meaningful value.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    title: "Build the solution",
    body: "Turn an idea into a working system across models, software, data, and infrastructure.",
    icon: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  },
  {
    title: "Deploy it for real",
    body: "Navigate the constraints of an actual business environment and make the system usable.",
    icon: <path d="M12 15V3m-5 5 5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />,
  },
  {
    title: "Own what happens next",
    body: "Measure results, iterate, improve reliability, and keep the system working.",
    icon: (
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m0-5v5h-5m5 4a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m5 0H3v5" />
    ),
  },
];

// The theory, revealed on scroll: what the role is, where it came from, why it matters now.
const theory = [
  "A Forward Deployed Engineer works embedded with the customer: scoping the problem, building across the stack, shipping into their environment and owning the outcome.",
  "The role began at Palantir in the early 2010s, where engineers placed on customer projects were known as “Deltas”.",
  "Today OpenAI, Anthropic and Salesforce are building FDE teams, because AI only pays off once it works inside a real business.",
];

export function WhyFde() {
  return (
    <section id="why-fde" className="relative pt-32 pb-24 lg:pt-48 lg:pb-32">
      {/* Seam with the hero card: a tab rises into it, and the card continues down on the right. */}
      <div className="absolute inset-x-0 top-0">
        <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
          <div className="relative -mt-14 flex h-14 w-fit items-center gap-3 rounded-t-3xl bg-ink px-5 font-display text-base font-extrabold tracking-tight sm:-mt-16 sm:h-16 sm:px-6 sm:text-2xl">
            <InverseCorner at="tl" color={ink} className="bottom-0 -left-6" />
            <InverseCorner at="tr" color={ink} className="-right-6 bottom-0" />
            <span className="size-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span className="whitespace-nowrap">
              Why Forward Deployed Engineering?
            </span>
          </div>
        </div>
      </div>
      {/* right-8 must match the hero card's lg:mx-8 */}
      <div aria-hidden="true" className="absolute top-0 right-8 hidden h-28 w-[42%] rounded-b-[32px] bg-ink-deep lg:block" />
      <InverseCorner at="bl" color={inkDeep} className="top-0 right-[calc(42%+2rem)] hidden lg:block" />

      <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
        {/* Intro */}
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Left: the problem */}
          <div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] font-light tracking-[-0.01em]">
              Building the demo
              <br />
              <span className="text-dim">is only the beginning.</span>
            </h2>
            <div className="mt-8 max-w-lg space-y-4 text-base leading-relaxed text-mist">
              <p className="text-paper">AI can look impressive in a prototype.</p>
              <p>
                The real challenge begins when you have to connect it to existing systems, work with imperfect data,
                handle real users, meet business requirements, and make it reliable enough to use every day.
              </p>
            </div>
            <p className="mt-8 flex items-center gap-3 font-display text-lg font-medium text-accent sm:text-xl">
              <span className="h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
              That&apos;s where the Forward Deployed Engineer comes in.
            </p>
          </div>

          {/* Right: what businesses need, as an icon list */}
          <div>
            <h3 className="font-display text-2xl font-normal">From possibility to production.</h3>
            <p className="mt-3 text-base leading-relaxed text-mist">
              Businesses don&apos;t just need people who can experiment with AI. They need engineers who can:
            </p>
            <ul className="mt-8 divide-y divide-ink-line border-t border-ink-line">
              {capabilities.map((c) => (
                <li key={c.title} className="flex gap-5 py-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ink-line text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {c.icon}
                    </svg>
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-medium text-paper">{c.title}</h4>
                    <p className="mt-1 text-base leading-relaxed text-mist/70">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing line */}
        <p className="mt-8 border-t border-ink-line pt-8 font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.1] font-light tracking-[-0.01em] lg:mt-10 lg:pt-10">
          <span className="text-dim">The future of AI isn&apos;t just about better models.</span>
          <br />
          It&apos;s about <span className="text-accent">better deployment.</span>
        </p>

        {/* Theory: pinned, revealed character by character on scroll */}
        <ScrollRevealText label="What is an FDE?" sentences={theory} />

      </div>

      {/* Who the role is: three disciplines merging into one engineer. Outside the centred
          container so its dark panel can span the page like the hero card. */}
      <WhoIsFde />

      {/* Market trend: full-width "Our vision"-style card, outside the centred container */}
      {/* overflow-x-clip trims the cluster's spill past the viewport edge (same colour as the page) without a scrollbar */}
      <div className="mt-24 overflow-x-clip lg:mt-32">
        <MarketSignal applyHref={program.applyHref} />
      </div>
    </section>
  );
}
