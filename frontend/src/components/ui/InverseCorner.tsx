/**
 * A 24px concave "fillet" used to join two stepped shapes smoothly.
 * `at` is the corner where the empty quarter-circle is centred; the colour
 * fills the opposite (inner) corner. Position it with Tailwind classes.
 */
export function InverseCorner({
  at,
  color,
  className = "",
}: {
  at: "tl" | "tr" | "bl" | "br";
  color: string;
  className?: string;
}) {
  const origin = { tl: "0 0", tr: "100% 0", bl: "0 100%", br: "100% 100%" }[at];

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute size-6 ${className}`}
      style={{ background: `radial-gradient(circle at ${origin}, transparent 23.5px, ${color} 24px)` }}
    />
  );
}
