import { CtaButton } from "@/components/ui/CtaButton";
import { program } from "@/content/program";

/**
 * Below lg, where the WhyPaid price card isn't pinned: a bar fixed to the bottom of the screen
 * with the ₹99 offer, so the unlock button is always one tap away. The spacer keeps the end of
 * the footer from sitting underneath the bar.
 */
export function MobileCtaBar() {
  return (
    <>
      <div aria-hidden="true" className="h-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-ink-deep/90 px-5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:px-8 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-2xl leading-none font-light text-accent">{program.platformPrice}</p>
            <p className="mt-1 truncate font-mono text-[10px] tracking-[0.12em] text-dim uppercase">Full platform access</p>
          </div>
          <CtaButton href={program.platformHref} size="sm" data-offer-popup>
            Unlock it
          </CtaButton>
        </div>
      </div>
    </>
  );
}
