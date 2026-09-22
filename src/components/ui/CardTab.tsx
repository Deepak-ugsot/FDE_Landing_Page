import { InverseCorner } from "./InverseCorner";

/**
 * Label tab rising from the top-left corner of a dark (ink-deep) card, joined
 * to it by a fillet. The card must be `relative` with `rounded-tl-none`.
 */
export function CardTab({ children, dot = "bg-accent" }: { children: React.ReactNode; dot?: string }) {
  return (
    <div className="absolute bottom-full left-0 flex h-14 items-center gap-3 rounded-t-3xl bg-ink-deep px-5 font-display text-lg font-extrabold tracking-tight sm:h-16 sm:px-6 sm:text-2xl">
      <InverseCorner at="tr" color="var(--color-ink-deep)" className="-right-6 bottom-0" />
      <span className={`size-2.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
}
