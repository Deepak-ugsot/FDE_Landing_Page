import Image from "next/image";
import { Check } from "lucide-react";
import { CardTab } from "@/components/ui/CardTab";
import { CtaButton } from "@/components/ui/CtaButton";
import { program } from "@/content/program";
import certificate from "../../../public/assets/demo_fde.png";
import {
  CertificateVisual,
  CommunityVisual,
  JobsVisual,
  NotesVisual,
  PlatformVisual,
  ProjectsVisual,
} from "./WhyPaidVisuals";

type Perk = {
  title: string;
  body: string;
  /** Decorative illustration drawn inside the card's panel (absolutely positioned). */
  visual: React.ReactNode;
};

// What the paid tier adds on top of the free YouTube course.
// TODO: confirm the wording with the program team (especially the job-opportunities promise).
const perks: Perk[] = [
  {
    title: "Structured notes",
    body: "Module-by-module notes that follow the videos, so you revise in minutes instead of rewatching hours.",
    visual: <NotesVisual />,
  },
  {
    title: "Practice projects",
    body: "Hands-on projects for every module, so you build the systems yourself instead of only watching them being built.",
    visual: <ProjectsVisual />,
  },
  {
    title: "Learning platform",
    body: "One place for the whole course: lessons, notes, projects and your progress.",
    visual: <PlatformVisual />,
  },
  {
    title: "Community",
    body: "Learn alongside other engineers on the same path. Ask questions, share what you build and get unstuck faster.",
    visual: <CommunityVisual />,
  },
  {
    title: "Job opportunities",
    body: "Hear about FDE and applied-AI roles as you work through the program.",
    visual: <JobsVisual />,
  },
  {
    // TODO: confirm who issues the certificate and what completing the program requires.
    title: "Certificate",
    body: "Finish the program and earn a certificate you can add to your resume and LinkedIn profile.",
    visual: <CertificateVisual />,
  },
];

const panel =
  "rounded-2xl border border-accent/45 bg-[radial-gradient(120%_90%_at_20%_0%,#363636,var(--color-ink-raised)_40%,var(--color-ink-deep))]";

/**
 * What the paid tier unlocks. Left column: heading, a card per perk, then the sample
 * certificate. Right column: a price card that stays pinned while the left side scrolls.
 */
export function WhyPaid() {
  return (
    <section id="why-paid" className="w-full py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 lg:px-12 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-14">
        <div className="min-w-0">
          <div className="mb-10 flex flex-col gap-5 lg:mb-12">
            <p className="flex items-center gap-2.5 font-display text-base font-bold">
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
              What {program.platformPrice} unlocks
            </p>
            <h2 className="font-display text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.05] font-light tracking-[-0.01em]">
              Watch it free. <span className="text-accent">Master it for {program.platformPrice}.</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-mist">
              The lessons stay free on YouTube. {program.platformPrice} adds everything that turns watching into doing.
            </p>
          </div>

          {/* Phones: a swipeable row with the next card peeking in. From sm: a 2- then 3-column grid. */}
          <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden">
            {perks.map((p) => (
              <li
                key={p.title}
                className="flex w-[78vw] max-w-[20rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-ink-line bg-ink-deep sm:w-auto sm:max-w-none"
              >
                {/* Visual runs edge to edge; the card's own border and rounding frame it. */}
                <div
                  aria-hidden="true"
                  className="@container relative aspect-[10/7] overflow-hidden bg-[radial-gradient(120%_90%_at_20%_0%,#363636,var(--color-ink-raised)_40%,var(--color-ink-deep))]"
                >
                  <div className="absolute inset-0">
                    {/* Visuals are drawn on a fixed 352×246 canvas, scaled to the card's width. */}
                    <div className="feature-canvas absolute top-0 left-0 h-[246.4px] w-[352px] origin-top-left">{p.visual}</div>
                  </div>
                </div>
                <div className="px-5 pt-5 pb-6">
                  <h3 className="font-display text-xl leading-tight font-normal">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* TODO: confirm the completion criteria and the issuing entity with the program team. */}
          <div id="certificate" className="mt-16 scroll-mt-24 lg:mt-20">
            <div className="mb-8 flex flex-col gap-4">
              <p className="flex items-center gap-2.5 font-display text-base font-bold">
                <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
                Certificate
              </p>
              <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-light tracking-[-0.01em]">
                Finish the program. <span className="text-accent">Earn the certificate.</span>
              </h3>
              <p className="max-w-2xl text-base leading-relaxed text-mist">
                Complete the modules and the projects, and {program.institution} issues a certificate with your name on
                it — one more line on your profile that says you have built this, not just watched it.
              </p>
            </div>
            <div className={`overflow-hidden p-3 sm:rounded-3xl sm:p-6 ${panel}`}>
              <Image
                src={certificate}
                alt={`Sample certificate of participation from ${program.institution}`}
                sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 60vw, 100vw"
                placeholder="blur"
                className="w-full rounded-lg shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] sm:rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Stepped ink card with a label tab, like the other cards on the page. The padding on top
            leaves room for the tab, so it stays in view while the card is pinned. */}
        <aside className="pt-14 sm:pt-16 lg:sticky lg:top-20 lg:self-start">
          <div className="relative rounded-[32px] rounded-tl-none bg-ink-deep px-6 pt-6 pb-7 sm:px-8 sm:pb-8">
            <CardTab>Full access</CardTab>

            <div className="flex justify-end font-mono text-[11px] tracking-[0.04em] text-mist uppercase" aria-hidden="true">
              /unlock
            </div>

            <h3 className="mt-2 font-display text-[clamp(2rem,2.6vw,2.5rem)] leading-[1.05] font-light tracking-[-0.01em]">
              Start learning <span className="font-normal text-accent">today.</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
              Keep the free lessons and add the notes, projects and community that make them stick.
            </p>

            <div className="mt-6 flex items-end justify-between gap-4 border-y border-ink-line py-5">
              <div>
                <p className="font-display text-5xl leading-none font-light text-accent sm:text-6xl">
                  {program.platformPrice}
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">Full platform access</p>
              </div>
              <span className="mb-1 rounded-full border border-ink-line px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.12em] text-dim uppercase">
                Lessons free
              </span>
            </div>

            <p className="mt-5 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">Inclusions</p>
            <ul className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-3">
              {perks.map((p) => (
                <li key={p.title} className="flex items-center gap-2 text-sm text-mist">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {p.title}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col items-start gap-3">
              <CtaButton href={program.platformHref} data-offer-popup>
                Unlock it for {program.platformPrice}
              </CtaButton>
              <a
                href={program.youtubeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-dim transition-colors hover:text-paper"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 fill-[#ff0033]" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
                Or keep watching free on YouTube
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
