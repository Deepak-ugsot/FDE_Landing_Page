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

// What an FDE is, revealed on scroll: the role, who they work with, the journey they own.
const theory = [
  "An FDE takes AI where it matters most: into the real world.",
  "A Forward Deployed Engineer works closely with customers and teams to turn complex business problems into working technical solutions.",
  "They operate across the entire journey — understanding the problem, designing the approach, building the system, integrating it with existing infrastructure, deploying it, and improving it based on real-world feedback.",
];

// The disciplines one FDE spans, shown as a row of hover cards after the theory.
const disciplines = [
  {
    title: "Software Engineering",
    body: "Build robust applications and production systems.",
    icon: <path d="m4 17 6-6-6-6M12 19h8" />,
  },
  {
    title: "AI & Machine Learning",
    body: "Apply models and AI capabilities to practical problems.",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </>
    ),
  },
  {
    title: "Platform & Infrastructure",
    body: "Make systems reliable, scalable, secure, and usable.",
    icon: <path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  },
  {
    title: "Solutions Architecture",
    body: "Design solutions around the constraints of a specific business.",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  {
    title: "Product & Customer Discovery",
    body: "Understand what actually needs to be built — not just what can be built.",
    icon: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
];

/** Hairline-divided list with a round icon badge beside each title and line of copy. */
function IconList({ items }: { items: { title: string; body: string; icon: React.ReactNode }[] }) {
  return (
    <ul className="mt-8 divide-y divide-ink-line border-t border-ink-line">
      {items.map((c) => (
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
  );
}

/** Large two-line statement that closes a block: a dim setup line, then the payoff. */
function ClosingLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 border-t border-ink-line pt-8 font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.1] font-light tracking-[-0.01em] lg:mt-10 lg:pt-10">
      {children}
    </p>
  );
}

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
            <IconList items={capabilities} />
          </div>
        </div>

        {/* Closing line */}
        <ClosingLine>
          <span className="text-dim">The future of AI isn&apos;t just about better models.</span>
          <br />
          It&apos;s about <span className="text-accent">better deployment.</span>
        </ClosingLine>

        {/* Theory: pinned, revealed character by character on scroll */}
        <ScrollRevealText label="What is an FDE?" sentences={theory} />

        {/* The disciplines the role spans: a row of tall cards; on desktop the hovered one widens and reveals its copy */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h3 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-light tracking-[-0.01em]">
            One role.
            <br />
            <span className="text-dim">Multiple disciplines.</span>
          </h3>
          <p className="max-w-md text-base leading-relaxed text-mist lg:justify-self-end">
            It&apos;s a role that combines the mindset of an engineer with the context of a product builder and the
            proximity of a customer-facing problem solver.
          </p>
        </div>

        <p className="mt-12 flex items-center gap-2 text-sm tracking-[0.14em] text-dim uppercase">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          An FDE may work across
        </p>
        <ul className="-mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
          {disciplines.map((d) => (
            <li
              key={d.title}
              className="group relative isolate flex h-[340px] w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(160deg,#2b2b2b,#161616_60%,#1c1c1c)] p-6 transition-[flex-grow,border-color] duration-500 hover:border-accent/40 lg:h-[380px] lg:w-auto lg:grow lg:basis-0 lg:hover:grow-[1.7]"
            >
              {/* Accent wash that fades in on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(230,22,31,0),rgba(230,22,31,0.12))] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <svg
                viewBox="0 0 24 24"
                className="size-10 text-accent opacity-50 transition-opacity duration-500 group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {d.icon}
              </svg>
              <span
                aria-hidden="true"
                className="absolute top-6 right-6 flex size-8 items-center justify-center rounded-full bg-white/10 text-paper transition-colors duration-500 group-hover:bg-accent group-hover:text-on-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 transition-transform duration-500 group-hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>

              <div className="mt-auto">
                <h4 className="font-display text-2xl leading-tight font-normal">{d.title}</h4>
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 hover-reveal:grid-rows-[0fr] hover-reveal:group-hover:grid-rows-[1fr]">
                  {/* Padding lives on the inner <p> so the collapsed row shrinks to 0 */}
                  <div className="min-h-0 overflow-hidden transition-opacity duration-500 hover-reveal:opacity-0 hover-reveal:group-hover:opacity-100">
                    <p className="pt-3 text-base leading-relaxed text-mist/80">{d.body}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <ClosingLine>
          <span className="text-dim">The FDE&apos;s job isn&apos;t simply to build AI.</span>
          <br />
          It&apos;s to <span className="text-accent">make AI work.</span>
        </ClosingLine>
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
