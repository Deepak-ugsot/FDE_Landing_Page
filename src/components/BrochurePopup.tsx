"use client";

import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { program } from "@/content/program";
import { CardTab } from "@/components/ui/CardTab";
import { CtaButton } from "@/components/ui/CtaButton";

// What the brochure will carry once it ships — kept short so the card stays one glance.
const contents = ["Week-by-week curriculum", "Projects & capstone brief", "Cohort dates and fees"];

/**
 * "Coming soon" popup for the brochure, in the same card language as the OfferPopup
 * (ink-deep card, label tab, red accents). It opens from any link to
 * `program.brochureHref` and from any link marked `data-brochure-popup`, so the hero
 * and footer links need no wiring of their own. A native modal <dialog>, so focus
 * trapping, Esc and an inert page come for free.
 */
export function BrochurePopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // One delegated listener, same approach as the OfferPopup: capture phase + preventDefault
  // only, so the link's own handlers (e.g. the nav menu closing itself) still run.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || (link.getAttribute("href") !== program.brochureHref && !link.hasAttribute("data-brochure-popup"))) return;
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
      aria-labelledby="brochure-title"
      data-lenis-prevent
      onClose={onClose}
      // Clicks on the dialog itself (not the card) land on the space around the card.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto max-h-dvh w-full max-w-[560px] overflow-y-auto overscroll-contain bg-transparent px-3 pt-[3.25rem] pb-3 text-paper [scrollbar-width:none] sm:px-6 sm:pt-[4.5rem] sm:pb-6 [&::-webkit-scrollbar]:hidden
        translate-y-4 opacity-0 transition-[opacity,translate,display,overlay] transition-discrete duration-400 ease-[cubic-bezier(0.2,0.7,0.2,1)] open:translate-y-0 open:opacity-100 starting:open:translate-y-4 starting:open:opacity-0
        backdrop:bg-black/0 backdrop:transition-[background-color,backdrop-filter,display,overlay] backdrop:transition-discrete backdrop:duration-400 open:backdrop:bg-black/75 open:backdrop:backdrop-blur-sm starting:open:backdrop:bg-black/0 starting:open:backdrop:backdrop-blur-none
        motion-reduce:transition-none motion-reduce:backdrop:transition-none"
    >
      {/* sm:rounded-[32px] would re-round all four corners, so the tl-none has to be repeated at sm. */}
      <div className="relative rounded-3xl rounded-tl-none bg-ink-deep sm:rounded-[32px] sm:rounded-tl-none shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)]">
        <CardTab compact>Program brochure</CardTab>

        {/* Sits at the tab's height, on the other side of the card's top edge */}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-0 bottom-full mb-1.5 grid size-10 place-items-center rounded-full bg-ink-deep text-paper ring-1 ring-white/10 transition duration-300 outline-offset-4 hover:rotate-90 hover:bg-accent hover:ring-accent focus-visible:outline-2 focus-visible:outline-accent sm:mb-2 sm:size-12"
        >
          <X className="size-4.5 sm:size-5" strokeWidth={1.75} />
        </button>

        <div className="p-5 sm:p-8 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/45 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-accent uppercase sm:text-[11px]">
            <span className="relative flex size-1.5" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            Coming soon
          </span>

          <h2
            id="brochure-title"
            className="mt-4 font-display text-[1.75rem] leading-[1.05] font-light tracking-[-0.01em] sm:mt-5 sm:text-[clamp(2.1rem,4.4vw,2.75rem)] sm:leading-[1.02]"
          >
            The brochure is
            <br />
            <span className="font-normal text-accent">almost ready.</span>
          </h2>

          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-mist sm:mt-4 sm:text-base">
            We&rsquo;re putting the finishing touches on it. Leave your e-mail in the footer and we&rsquo;ll send it
            across the moment it&rsquo;s out — along with the cohort dates.
          </p>

          <div className="mt-5 rounded-2xl border border-ink-line p-4 sm:mt-7 sm:rounded-3xl sm:p-5">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-dim uppercase sm:text-[11px]">
              What it will cover
            </p>
            <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              {contents.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[13px] text-mist sm:gap-2.5 sm:text-[15px]">
                  <span
                    className="grid size-[18px] shrink-0 place-items-center rounded-full bg-accent text-on-accent sm:size-5"
                    aria-hidden="true"
                  >
                    <Check className="size-2.5 sm:size-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <span onClick={close}>
              <CtaButton href="#updates">Notify me</CtaButton>
            </span>
            <button
              type="button"
              onClick={close}
              // On phones the ✕ and a tap outside already close it, so this stays off the one-CTA layout.
              className="hidden h-12 items-center rounded-2xl border border-ink-line px-5 text-base font-medium transition-colors outline-offset-4 hover:border-paper focus-visible:outline-2 focus-visible:outline-accent-light sm:inline-flex"
            >
              Keep browsing
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
