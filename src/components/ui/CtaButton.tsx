import { Sparkle } from "./Sparkle";

type Variant = "accent" | "paper" | "ink";

const tones: Record<Variant, string> = {
  accent: "bg-accent text-ink-deep group-hover:bg-accent-light",
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
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
}) {
  const block = `flex h-12 items-center justify-center rounded-2xl transition-all duration-300 ${tones[variant]}`;

  return (
    <a href={href} className="group inline-flex items-center text-base font-medium">
      <span className={`${block} mr-0.5 w-12 overflow-hidden group-hover:mr-0 group-hover:w-0`}>
        <Sparkle />
      </span>
      <span className={`${block} px-5 pb-0.5`}>{children}</span>
      <span className={`${block} w-0 overflow-hidden group-hover:ml-0.5 group-hover:w-12`}>
        <Sparkle />
      </span>
    </a>
  );
}
