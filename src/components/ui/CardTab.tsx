import { InverseCorner } from "./InverseCorner";

/**
 * Label tab rising from the top-left corner of a dark (ink-deep) card, joined
 * to it by a fillet. The card must be `relative` with `rounded-tl-none`.
 */
export function CardTab({
  children,
  dot = "bg-accent",
  compact = false,
}: {
  children: React.ReactNode;
  dot?: string;
  /** Smaller on phones (e.g. inside the offer popup). */
  compact?: boolean;
}) {
  const size = compact
    ? "h-11 gap-2.5 px-4 text-base sm:h-14 sm:gap-3 sm:px-5 sm:text-lg"
    : "h-14 gap-3 px-5 text-lg sm:h-16 sm:px-6 sm:text-2xl";
  return (
    <div
      className={`absolute bottom-full left-0 flex items-center rounded-t-3xl bg-ink-deep font-display font-extrabold tracking-tight ${size}`}
    >
      <InverseCorner at="tr" color="var(--color-ink-deep)" className="-right-6 bottom-0" />
      <span className={`shrink-0 rounded-full ${compact ? "size-2 sm:size-2.5" : "size-2.5"} ${dot}`} aria-hidden="true" />
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
}
