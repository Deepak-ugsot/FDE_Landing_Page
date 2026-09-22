import { program } from "@/content/program";
import { CtaButton } from "@/components/ui/CtaButton";
import { InverseCorner } from "@/components/ui/InverseCorner";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { HowItWorks } from "./HowItWorks";

const ink = "var(--color-ink)";
const inkDeep = "var(--color-ink-deep)";

// The theory, revealed on scroll: what the role is, where it came from, why it matters now.
const theory = [
  "A Forward Deployed Engineer works embedded with the customer: scoping the problem, building across the stack, shipping into their environment and owning the outcome.",
  "The role began at Palantir in the early 2010s, where engineers placed on customer projects were known as “Deltas”.",
  "Today OpenAI, Anthropic and Salesforce are building FDE teams, because AI only pays off once it works inside a real business.",
];

// Every figure is sourced; keep the links when editing.
const stats = [
  {
    value: "729%",
    label: "Year-over-year growth in Forward Deployed Engineer job postings on Indeed.",
    source: "Indeed data via Business Insider, May 2026",
    href: "https://www.aol.com/articles/job-postings-tech-role-grown-185134000.html",
    featured: true,
  },
  {
    value: "1,000",
    label: "The size of the Forward Deployed Engineer team Salesforce has committed to building.",
    source: "Salesforce, March 2026",
    href: "https://www.salesforce.com/ap/blog/forward-deployed-engineer/",
  },
  {
    value: "$170K+",
    label: "US pay for FDE roles starts around $170K a year and runs past $200K.",
    source: "Indeed data via Business Insider, May 2026",
    href: "https://www.aol.com/articles/job-postings-tech-role-grown-185134000.html",
  },
  {
    value: "95%",
    label: "Of enterprise GenAI pilots showed no measurable P&L impact. Closing that gap is the FDE's job.",
    source: "MIT NANDA study via Fortune, August 2025",
    href: "https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo",
  },
];

export function WhyFde() {
  return (
    <section id="why-fde" className="relative pt-32 pb-24 lg:pt-48 lg:pb-32">
      {/* Seam with the hero card: a tab rises into it, and the card continues down on the right. */}
      <div className="absolute inset-x-0 top-0">
        <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
          <div className="relative -mt-14 flex h-14 w-fit items-center gap-3 rounded-t-3xl bg-ink px-5 font-display text-lg font-extrabold tracking-tight sm:-mt-16 sm:h-16 sm:px-6 sm:text-2xl">
            <InverseCorner at="tl" color={ink} className="bottom-0 -left-6" />
            <InverseCorner at="tr" color={ink} className="-right-6 bottom-0" />
            <span className="size-2.5 shrink-0 rounded-full bg-lilac" aria-hidden="true" />
            <span className="whitespace-nowrap">
              Why Forward Deployed Engineer<span className="hidden sm:inline"> (FDE)</span>?
            </span>
          </div>
        </div>
      </div>
      {/* right-8 must match the hero card's lg:mx-8 */}
      <div aria-hidden="true" className="absolute top-0 right-8 hidden h-28 w-[42%] rounded-b-[32px] bg-ink-deep lg:block" />
      <InverseCorner at="bl" color={inkDeep} className="top-0 right-[calc(42%+2rem)] hidden lg:block" />

      <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
        {/* Intro */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] font-light tracking-[-0.01em]">
            AI is easy to demo.
            <br />
            <span className="text-dim">It&apos;s hard to deploy.</span>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-mist lg:justify-self-end">
            Companies have the models. What they lack are engineers who can walk into a real business, understand how it
            works, and make AI hold up there. That engineer has a name now.
          </p>
        </div>

        {/* Theory: pinned, revealed character by character on scroll */}
        <ScrollRevealText label="What is an FDE?" sentences={theory} />

        {/* How the role works in practice: Services-style step row */}
        <HowItWorks applyHref={program.applyHref} />

        {/* Market trend */}
        <div className="mt-24 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm">
              <span className="size-1.5 rounded-full bg-flame" aria-hidden="true" />
              The market signal
            </p>
            <h3 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05] font-light">
              The fastest-rising role in tech
            </h3>
          </div>
          <p className="max-w-xs text-sm text-dim">Figures link to their original sources.</p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <li
              key={stat.value}
              className={`flex min-h-72 flex-col rounded-2xl p-7 ${
                stat.featured ? "bg-lilac text-ink-deep" : "bg-ink-raised text-paper"
              }`}
            >
              <span className="font-display text-6xl leading-none font-light tracking-tight">{stat.value}</span>
              <span className={`mt-5 text-base leading-relaxed ${stat.featured ? "text-ink-deep/80" : "text-mist"}`}>
                {stat.label}
              </span>
              <a
                href={stat.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto pt-6 text-xs underline-offset-4 hover:underline ${
                  stat.featured ? "text-ink-deep/60" : "text-dim"
                }`}
              >
                Source: {stat.source} ↗
              </a>
            </li>
          ))}
        </ul>

        {/* Closing CTA */}
        <div className="mt-3 flex flex-col gap-6 rounded-2xl bg-ink-deep p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <p className="font-display text-2xl leading-snug sm:text-3xl">
            The role is new. <span className="text-dim">The hiring isn&apos;t waiting.</span>
          </p>
          <CtaButton href={program.applyHref}>Apply now</CtaButton>
        </div>
      </div>
    </section>
  );
}
