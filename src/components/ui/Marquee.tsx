/**
 * Infinite horizontal scroller. Items are rendered twice so the loop is seamless.
 *
 * The second copy is aria-hidden decoration, so anything focusable inside it would
 * strand a tab stop on an element screen readers cannot see. Pass a function to
 * render the clone differently — see the Footer's apply link.
 */
export function Marquee({
  children,
  className = "",
  duration,
}: {
  children: React.ReactNode | ((clone: boolean) => React.ReactNode);
  className?: string;
  /** Seconds per loop; defaults to the `animate-marquee` theme value. */
  duration?: number;
}) {
  const copy = (clone: boolean) => (typeof children === "function" ? children(clone) : children);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee"
        style={duration ? { animationDuration: `${duration}s` } : undefined}
      >
        <div className="flex shrink-0 items-center">{copy(false)}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {copy(true)}
        </div>
      </div>
    </div>
  );
}
