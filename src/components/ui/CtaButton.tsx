import { Sparkle } from "./Sparkle";

type Variant = "accent" | "paper" | "ink";

const tones: Record<Variant, string> = {
  accent: "bg-accent text-on-accent group-hover:bg-accent-light",
  paper: "bg-paper text-ink-deep group-hover:bg-white",
  ink: "bg-ink-deep text-paper group-hover:bg-black",
};

/**
 * Two-part pill button: an icon block plus a text block. On hover the icon
 * slides from the left side to the right side.
 */
export function CtaButton({
  href,
  children,
  variant = "accent",
  external = false,
  size = "md",
  ...rest
}: Omit<React.ComponentProps<"a">, "href" | "children"> & {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  /** Opens in a new tab (for off-site links). */
  external?: boolean;
  /** "sm" is a shorter button for tight spots like the mobile bottom bar. */
  size?: "md" | "sm";
}) {
  const sm = size === "sm";
  const block = `flex ${sm ? "h-10 rounded-xl" : "h-12 rounded-2xl"} items-center justify-center transition-all duration-300 ${tones[variant]}`;
  const icon = sm ? "group-hover:w-10" : "group-hover:w-12";

  return (
    <a
      href={href}
      className={`group inline-flex items-center ${sm ? "rounded-xl text-sm" : "rounded-2xl text-base"} font-medium outline-offset-4 focus-visible:outline-2 focus-visible:outline-accent-light`}
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={`${block} mr-0.5 ${sm ? "w-10" : "w-12"} overflow-hidden group-hover:mr-0 group-hover:w-0`}>
        <Sparkle />
      </span>
      <span className={`${block} ${sm ? "px-7" : "px-5"} pb-0.5`}>{children}</span>
      <span className={`${block} w-0 overflow-hidden group-hover:ml-0.5 ${icon}`}>
        <Sparkle />
      </span>
    </a>
  );
}
