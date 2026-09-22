import { navLinks, program } from "@/content/program";
import { Logo } from "@/components/ui/Logo";
import { Marquee } from "@/components/ui/Marquee";
import { Sparkle } from "@/components/ui/Sparkle";

const tickerItems = [
  { label: "Next cohort", value: program.nextCohort },
  { label: "Track", value: program.focus },
  { label: "The loop", value: "Discover · Build · Deploy · Own" },
  { label: "Mentor", value: program.mentor },
  { label: "The goal", value: "AI that survives production" },
];

/** Announcement ticker that sits on the page background above the hero card. */
export function Ticker() {
  return (
    <div className="flex items-center py-3 pl-4 text-sm sm:pl-6 lg:pl-8">
      <span className="flex shrink-0 items-center gap-2.5 pr-5 font-display text-base font-semibold">
        <span className="size-1.5 rounded-full bg-paper" aria-hidden="true" />
        FDE Program
      </span>
      <Marquee className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {tickerItems.map((item) => (
          <span key={item.label} className="flex items-center gap-2 px-5">
            <Sparkle className="size-2.5 text-accent" />
            <span className="text-dim">{item.label}</span>
            <span className="text-paper">{item.value}</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

const allLinks = [...navLinks, { label: "Apply now", href: program.applyHref }];

/** Top navigation, rendered inside the dark hero card: logo left, plain links right. */
export function Nav() {
  return (
    <nav className="relative flex items-center justify-between px-5 py-6 sm:px-8">
      <a href="#top" aria-label={`${program.name} by ${program.mentor} — home`}>
        <Logo className="size-12 sm:size-14" />
      </a>

      <ul className="hidden items-center gap-5 text-[15px] lg:flex">
        {allLinks.map((link) => (
          <li key={link.href}>
            {/* Hover: an accent dot pops in on the left and a soft gradient pill fades in behind */}
            <a
              href={link.href}
              className="group relative isolate flex h-8 items-center rounded-lg pr-2.5 pl-5 text-paper/80 transition-colors duration-300 hover:text-paper focus-visible:text-paper"
            >
              <span className="absolute left-2 flex size-1.5 items-center justify-center" aria-hidden="true">
                <span className="size-0 rounded-full bg-accent transition-all duration-300 ease-out group-hover:size-full group-focus-visible:size-full" />
              </span>
              {link.label}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-lg bg-[linear-gradient(315deg,rgba(235,255,85,0.16),rgba(235,255,85,0))] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile menu: native <details> keeps it JS-free. */}
      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full bg-ink px-4 py-2 font-display text-base font-bold [&::-webkit-details-marker]:hidden">
          <span className="size-2 rounded-full bg-accent transition-transform group-open:scale-125" aria-hidden="true" />
          Menu
        </summary>
        <ul className="absolute inset-x-5 top-full z-20 mt-1 space-y-1 rounded-3xl bg-ink p-3 shadow-2xl sm:right-8 sm:left-auto sm:w-64">
          {allLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="block rounded-2xl px-4 py-3 text-base transition-colors hover:bg-ink-raised">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
