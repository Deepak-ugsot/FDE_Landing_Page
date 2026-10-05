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
}: {
  children: React.ReactNode | ((clone: boolean) => React.ReactNode);
  className?: string;
}) {
  const copy = (clone: boolean) => (typeof children === "function" ? children(clone) : children);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee">
        <div className="flex shrink-0 items-center">{copy(false)}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {copy(true)}
        </div>
      </div>
    </div>
  );
}
