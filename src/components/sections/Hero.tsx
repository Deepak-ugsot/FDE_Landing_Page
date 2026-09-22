import { program } from "@/content/program";
import { CtaButton } from "@/components/ui/CtaButton";
import { Marquee } from "@/components/ui/Marquee";
import { HeroPanel } from "./HeroPanel";
import { HeroVideo } from "./HeroVideo";
import { Nav } from "./Nav";

// Companies publicly building FDE teams (Business Insider, May 2026; Salesforce, Mar 2026).
const hiringCompanies = ["OpenAI", "Anthropic", "Palantir", "Stripe", "Google Cloud", "Salesforce", "McKinsey", "BCG"];

/**
 * Dark hero card on the lighter page background. Its bottom-right corner is
 * square on desktop because the card continues down into the next section.
 */
export function Hero() {
  return (
    <section id="top" className="relative mx-4 rounded-[32px] bg-ink-deep pb-28 sm:mx-6 lg:mx-8 lg:rounded-br-none">
      {/* Blurred background video, behind everything that follows */}
      <HeroVideo />

      <Nav />

      <div className="relative mx-auto max-w-[1328px] px-5 pt-6 sm:px-8 lg:px-12 lg:pt-10">
        <p className="flex items-center gap-2.5 font-display text-sm font-bold sm:text-base">
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          {program.focus} · Cohort program
        </p>

        <h1 className="mt-5 font-display text-[clamp(2.9rem,8.4vw,6.25rem)] leading-[0.92] font-light tracking-[-0.02em]">
          AI Forward Deployed Engineer Program
          <span className="mt-6 flex items-center gap-4 text-[clamp(1.5rem,3vw,2.25rem)] leading-none tracking-normal">
            <span className="h-px w-12 bg-accent" aria-hidden="true" />
            <span className="text-dim">by</span>
            <span className="text-accent">{program.mentor}</span>
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
          Learn to take AI from a promising demo to a system a real business runs on. Scope the problem with the client,
          build it across the stack, ship it into their environment, and own the outcome.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CtaButton href={program.applyHref}>Apply now</CtaButton>
          <a
            href={program.brochureHref}
            className="inline-flex h-12 items-center rounded-2xl border border-ink-line px-5 text-base font-medium transition-colors hover:border-paper"
          >
            Download brochure
          </a>
        </div>

        <HeroPanel />

        <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-center">
          <p className="shrink-0 text-sm text-dim md:w-40">Companies building FDE teams today</p>
          <Marquee className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            {hiringCompanies.map((name) => (
              <span key={name} className="px-8 font-display text-2xl font-medium whitespace-nowrap text-muted/60">
                {name}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
