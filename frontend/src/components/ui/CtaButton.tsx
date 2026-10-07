import { Sparkle } from "./Sparkle";

type Variant = "accent" | "paper" | "ink";

const tones: Record<Variant, string> = {
  accent: "bg-accent text-on-accent group-hover:bg-accent-light",
  paper: "bg-paper text-ink-deep group-hover:bg-white",
  ink: "bg-ink-deep text-paper group-hover:bg-black",
};

type CtaButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  /** "sm" is a shorter button for tight spots like the mobile bottom bar. */
  size?: "md" | "sm";
  /** Stretch to the container width (e.g. form submit buttons). */
  fullWidth?: boolean;
  /** Swaps the sparkle for a spinner and disables interaction. */
  loading?: boolean;
  className?: string;
  /** When set, renders an <a>; otherwise a <button>. */
  href?: string;
  /** Opens an <a> in a new tab (for off-site links). */
  external?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & { [key: `data-${string}`]: string | boolean | undefined };

/**
 * Two-part pill button: a sparkle icon block plus a text block. On hover the icon
 * slides from the left side to the right side. Renders as an <a> when `href` is
 * given, otherwise a <button> (with an optional loading spinner). This is the one
 * CTA style used everywhere, so the animation is consistent across the app.
 */
export function CtaButton({
  children,
  variant = "accent",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
  href,
  external = false,
  type = "button",
  disabled = false,
  onClick,
  ...rest
}: CtaButtonProps) {
  const sm = size === "sm";
  const isDisabled = disabled || loading;
  // Only attach the `group` (and therefore the hover animation) when interactive.
  const animate = !isDisabled;

  const block = `flex ${sm ? "h-10 rounded-xl" : "h-12 rounded-2xl"} items-center justify-center transition-all duration-300 ${tones[variant]}`;
  const iconExpand = sm ? "group-hover:w-10" : "group-hover:w-12";

  const root = `${animate ? "group " : ""}${fullWidth ? "flex w-full" : "inline-flex"} items-center ${
    sm ? "rounded-xl text-sm" : "rounded-2xl text-base"
  } font-medium outline-offset-4 focus-visible:outline-2 focus-visible:outline-accent-light ${
    isDisabled ? "cursor-not-allowed opacity-70" : ""
  } ${className}`;

  const inner = (
    <>
      <span className={`${block} mr-0.5 ${sm ? "w-10" : "w-12"} overflow-hidden group-hover:mr-0 group-hover:w-0`}>
        {loading ? (
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-current/40 border-t-current" aria-hidden="true" />
        ) : (
          <Sparkle />
        )}
      </span>
      <span className={`${block} ${fullWidth ? "flex-1" : ""} ${sm ? "px-7" : "px-5"} pb-0.5`}>{children}</span>
      <span className={`${block} w-0 overflow-hidden group-hover:ml-0.5 ${iconExpand}`}>
        <Sparkle />
      </span>
    </>
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={root}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} disabled={isDisabled} onClick={onClick} className={root} {...rest}>
      {inner}
    </button>
  );
}
