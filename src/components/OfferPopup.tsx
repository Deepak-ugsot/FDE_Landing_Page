"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { mentorProfile, program } from "@/content/program";
import { CardTab } from "@/components/ui/CardTab";
import { CtaButton } from "@/components/ui/CtaButton";

const freePerks = ["Full course videos", "Learn at your own pace"];
// Same perks, same order, as the WhyPaid cards.
const paidPerks = ["Structured notes", "Practice projects", "Learning platform", "Community", "Job opportunities", "Certificate"];

const photoGlow =
  "bg-[radial-gradient(120%_90%_at_78%_100%,rgba(230,22,31,0.42)_0%,rgba(230,22,31,0.08)_45%,#1a1a17_78%)]";

function Perk({ children, paid = false }: { children: React.ReactNode; paid?: boolean }) {
  return (
    <li className="flex items-center gap-2 text-[13px] text-mist sm:gap-2.5 sm:text-[15px]">
      <span
        className={`grid size-[18px] shrink-0 place-items-center rounded-full sm:size-5 ${paid ? "bg-accent text-on-accent" : "bg-white/8 text-dim"}`}
        aria-hidden="true"
      >
        <Check className="size-2.5 sm:size-3" strokeWidth={3} />
      </span>
      {children}
    </li>
  );
}

/**
 * Apply popup: the free-vs-₹99 offer in the page's own card language (ink-deep card with a
 * label tab, red accents). It opens from any link to `program.applyHref` (Apply now, Apply to
 * the next cohort, ...) and from any link marked `data-offer-popup`. A native modal <dialog>, so it gets focus trapping, Esc to close and an
 * inert page for free. It closes with the ✕, Esc, a click outside the card or either CTA.
 */
export function OfferPopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // One delegated listener, so every apply link on the page opens the popup without each
  // section having to know about it. Capture phase + preventDefault only: the link's own
  // handlers still run (e.g. the nav menu closing itself).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || (link.getAttribute("href") !== program.applyHref && !link.hasAttribute("data-offer-popup"))) return;
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      e.preventDefault();
      dialog.showModal();
      // Freeze the page behind it. Lenis ignores wheel events inside [data-lenis-prevent], and
      // the stable gutter stops the page shifting when the scrollbar hides.
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.scrollbarGutter = "stable";
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const close = () => dialogRef.current?.close();

  const onClose = () => {
    document.documentElement.style.overflow = "";
    document.documentElement.style.scrollbarGutter = "";
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="offer-title"
      data-lenis-prevent
      onClose={onClose}
      // Clicks on the dialog itself (not the card) land on the space around the card.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto max-h-dvh w-full max-w-[920px] overflow-y-auto overscroll-contain bg-transparent px-3 pt-[3.25rem] pb-3 text-paper [scrollbar-width:none] sm:px-6 sm:pt-[4.5rem] sm:pb-6 [&::-webkit-scrollbar]:hidden
        translate-y-4 opacity-0 transition-[opacity,translate,display,overlay] transition-discrete duration-400 ease-[cubic-bezier(0.2,0.7,0.2,1)] open:translate-y-0 open:opacity-100 starting:open:translate-y-4 starting:open:opacity-0
        backdrop:bg-black/0 backdrop:transition-[background-color,backdrop-filter,display,overlay] backdrop:transition-discrete backdrop:duration-400 open:backdrop:bg-black/75 open:backdrop:backdrop-blur-sm starting:open:backdrop:bg-black/0 starting:open:backdrop:backdrop-blur-none
        motion-reduce:transition-none motion-reduce:backdrop:transition-none"
    >
      {/* sm:rounded-[32px] would re-round all four corners, so the tl-none has to be repeated at sm. */}
      <div className="relative rounded-3xl rounded-tl-none bg-ink-deep sm:rounded-[32px] sm:rounded-tl-none shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)]">
        <CardTab compact>Forward Deployed Engineer</CardTab>

        {/* Sits at the tab's height, on the other side of the card's top edge */}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-0 bottom-full mb-1.5 grid size-10 place-items-center rounded-full bg-ink-deep text-paper ring-1 ring-white/10 transition duration-300 outline-offset-4 hover:rotate-90 hover:bg-accent hover:ring-accent focus-visible:outline-2 focus-visible:outline-accent sm:mb-2 sm:size-12"
        >
          <X className="size-4.5 sm:size-5" strokeWidth={1.75} />
        </button>

        <div className="p-4 sm:p-8 lg:p-10">
          {/* Promise + mentor */}
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="max-w-xl">
              <h2
                id="offer-title"
                className="font-display text-[1.75rem] leading-[1.05] sm:text-[clamp(2.1rem,5vw,3.25rem)] sm:leading-[1.02] font-light tracking-[-0.01em]"
              >
                Build AI that works
                <br />
                in the <span className="font-normal text-accent">real world.</span>
              </h2>
              <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-mist sm:mt-4 sm:text-base">
                The complete course is free on YouTube. {program.platformPrice} unlocks the tools and resources that
                turn learning into building.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:gap-4 md:w-44 md:flex-col md:gap-0 md:text-center">
              <div
                className={`relative size-11 shrink-0 overflow-hidden rounded-xl sm:size-14 sm:rounded-2xl ${photoGlow} md:size-32 md:rounded-[28px]`}
              >
                <Image
                  src={mentorProfile.photo}
                  alt={mentorProfile.name}
                  fill
                  sizes="128px"
                  className="object-cover object-top"
                />
              </div>
              <div className="md:mt-4">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-accent uppercase sm:text-[11px]">Learn with</p>
                <p className="mt-0.5 font-display text-base leading-tight sm:mt-1 sm:text-xl">{mentorProfile.name}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-dim sm:mt-1 sm:text-xs">{mentorProfile.role}</p>
              </div>
            </div>
          </div>

          {/* Free vs paid. On phones the paid card comes first so its CTA is on screen. */}
          <div className="mt-5 grid gap-3 sm:mt-7 sm:gap-4 md:grid-cols-[0.8fr_1.2fr] lg:mt-10">
            <div className="flex flex-col rounded-2xl border border-ink-line p-4 sm:rounded-3xl sm:p-6">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 28 20" className="h-5 w-7 shrink-0" aria-hidden="true">
                  <rect width="28" height="20" rx="5" fill="#ff0033" />
                  <path d="M11.5 6v8l6.5-4-6.5-4Z" fill="#fff" />
                </svg>
                <h3 className="font-display text-lg sm:text-xl">YouTube</h3>
                <span className="ml-auto rounded-full border border-ink-line px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.12em] text-dim uppercase">
                  Free
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 sm:mt-5 sm:block sm:space-y-3">
                {freePerks.map((p) => (
                  <Perk key={p}>{p}</Perk>
                ))}
              </ul>
              <a
                href={program.youtubeHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="group mt-4 inline-flex h-10 items-center justify-center gap-2.5 self-start rounded-xl border border-ink-line px-4 text-sm font-medium sm:mt-6 sm:h-12 sm:gap-3 sm:rounded-2xl sm:px-5 sm:text-base transition-colors hover:border-[#ff0033] hover:bg-[#ff0033] md:mt-auto"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-[#ff0033] transition-colors group-hover:fill-white" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
                Watch free
              </a>
            </div>

            <div className="order-first flex flex-col rounded-2xl border border-accent/45 bg-[radial-gradient(120%_90%_at_20%_0%,#363636,var(--color-ink-raised)_40%,var(--color-ink-deep))] p-4 sm:rounded-3xl sm:p-6 md:order-none">
              <div className="flex items-center gap-3">
                <span className="size-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <h3 className="font-display text-lg sm:text-xl">Full FDE experience</h3>
                <span className="ml-auto rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">
                  {program.platformPrice}
                </span>
              </div>
              <ul className="mt-3.5 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 sm:gap-x-6">
                {paidPerks.map((p) => (
                  <Perk key={p} paid>
                    {p}
                  </Perk>
                ))}
              </ul>
              <div className="mt-4 sm:mt-6 md:mt-auto md:pt-6" onClick={close}>
                <CtaButton href={program.platformHref}>Unlock FDE for {program.platformPrice}</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
