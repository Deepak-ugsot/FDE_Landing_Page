import { program } from "@/content/program";
import { InverseCorner } from "@/components/ui/InverseCorner";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { WhoIsFde } from "./WhoIsFde";
import { MarketSignal } from "./MarketSignal";

const ink = "var(--color-ink)";
const inkDeep = "var(--color-ink-deep)";

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
          <div className="relative -mt-14 flex h-14 w-fit items-center gap-3 rounded-t-3xl bg-ink px-5 font-display text-lg font-extrabold tracking-tight sm:-mt-16 sm:h-16 sm:px-6 sm:text-2xl">
            <InverseCorner at="tl" color={ink} className="bottom-0 -left-6" />
            <InverseCorner at="tr" color={ink} className="-right-6 bottom-0" />
            <span className="size-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
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
