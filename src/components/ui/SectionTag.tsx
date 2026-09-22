/**
 * "• Label" tab that sits on top of a card and merges into it.
 * `tone` must match the background of the card directly below.
 */
export function SectionTag({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: "ink" | "paper" | "deep";
}) {
  const bg = { ink: "var(--color-ink)", paper: "var(--color-paper)", deep: "var(--color-ink-deep)" }[tone];
  const text = tone === "paper" ? "text-ink-deep" : "text-paper";

  return (
    <div
      className={`notch-tab inline-flex items-center gap-2 px-4 pt-3 pb-3 text-sm ${text}`}
      style={{ "--tab-bg": bg } as React.CSSProperties}
    >
      <span className="size-1.5 rounded-full bg-flame" aria-hidden="true" />
      {children}
    </div>
  );
}
