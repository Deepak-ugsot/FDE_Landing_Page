import { mentorProfile, navLinks, program, socials } from "@/content/program";
import { InverseCorner } from "@/components/ui/InverseCorner";
import { Logo } from "@/components/ui/Logo";
import { Marquee } from "@/components/ui/Marquee";
import { Sparkle } from "@/components/ui/Sparkle";

const accent = "var(--color-accent)";

const columns = [
  { title: "Program", links: navLinks },
  {
    title: "Get started",
    links: [
      { label: "Apply now", href: program.applyHref },
      { label: "Download brochure", href: program.brochureHref },
    ],
  },
];

const socialTone = {
  flame: "bg-flame hover:bg-[#ff6a52]",
  accent: "bg-accent hover:bg-accent-light",
} as const;

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="group relative flex items-center text-base transition-colors hover:text-accent">
      {/* Accent dot slides in on hover, like the reference */}
      <span
        aria-hidden="true"
        className="absolute -left-3 size-1.5 rounded-full bg-accent opacity-0 transition-all duration-300 group-hover:-left-3.5 group-hover:opacity-100"
      />
      {children}
    </a>
  );
}

/**
 * Closing CTA band (accent, scrolling "Ready to become an FDE?") followed by
 * the dark footer card, which a notch splits into a newsletter side and a
 * links side — mirroring the reference footer.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rounded-t-[32px] bg-accent text-ink-deep">
      {/* CTA marquee band */}
      <Marquee className="py-12 lg:py-16">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center">
            <span className="px-6 font-display text-[clamp(2.25rem,4.4vw,3.5rem)] leading-none font-light whitespace-nowrap">
              Ready to become an FDE?
            </span>
            <a
              href={program.applyHref}
              className="flex h-11 items-center gap-2 rounded-2xl bg-ink-deep px-4 text-sm font-medium whitespace-nowrap text-paper transition-colors hover:bg-black"
            >
              <Sparkle className="size-3.5 text-accent" />
              Apply now
            </a>
            <Sparkle className="mx-8 size-7" />
          </span>
        ))}
      </Marquee>

      {/* Dark footer card on the accent background */}
      <div className="relative mx-4 rounded-t-[32px] bg-ink-deep text-paper sm:mx-6 lg:mx-8">
        {/* Notch from the top, splitting the card into two (desktop only) */}
        <div aria-hidden="true" className="absolute top-0 left-[38%] hidden h-24 w-4 rounded-b-full bg-accent lg:block">
          <InverseCorner at="bl" color={accent} className="top-0 -left-6" />
          <InverseCorner at="br" color={accent} className="top-0 -right-6" />
        </div>

        <div className="grid gap-14 px-6 pt-14 pb-10 sm:px-10 lg:grid-cols-[38%_1fr] lg:gap-0 lg:px-16 lg:pt-16">
          {/* Newsletter */}
          <div className="lg:pr-16">
            <Logo className="size-14" />
            <h2 className="mt-10 flex gap-3 font-display text-2xl leading-snug font-normal">
              <span className="mt-3 size-2.5 shrink-0 rounded-full bg-flame" aria-hidden="true" />
              Want cohort dates and program updates?
            </h2>
            <form action={program.newsletterAction} method="post" className="mt-7 space-y-3">
              <label className="block">
                <span className="sr-only">Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  autoComplete="name"
                  className="h-13 w-full rounded-[14px] bg-ink-raised px-5 text-base text-paper placeholder:text-dim focus:ring-2 focus:ring-accent/60 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="sr-only">E-mail</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="E-mail"
                  autoComplete="email"
                  className="h-13 w-full rounded-[14px] bg-ink-raised px-5 text-base text-paper placeholder:text-dim focus:ring-2 focus:ring-accent/60 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2.5 pt-2 text-sm text-mist">
                <input type="checkbox" name="consent" required className="size-4 accent-accent" />
                <span>
                  I agree with the{" "}
                  <a href={program.privacyHref} className="text-accent underline-offset-2 hover:underline">
                    privacy statement
                  </a>
                </span>
              </label>
              <div className="pt-6">
                <button type="submit" className="group inline-flex items-center text-base font-medium text-ink-deep">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent transition-colors group-hover:bg-accent-light">
                    <Sparkle />
                  </span>
                  <span className="ml-0.5 flex h-12 items-center rounded-2xl bg-accent px-5 pb-0.5 transition-colors group-hover:bg-accent-light">
                    Get the updates
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Links + socials */}
          <div className="flex flex-col justify-between gap-12 lg:pl-16">
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:pt-[104px]">
              {columns.map((col) => (
                <nav key={col.title} aria-label={col.title}>
                  <h3 className="text-sm text-paper/60">{col.title}</h3>
                  <ul className="mt-4 space-y-1.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <FooterLink href={l.href}>{l.label}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
              <div>
                <h3 className="text-sm text-paper/60">Mentor</h3>
                <p className="mt-4 text-base">{mentorProfile.name}</p>
                <p className="mt-1 text-sm leading-snug text-paper/60">{mentorProfile.role}</p>
              </div>
            </div>

            <ul className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-12 w-[150px] items-center justify-center rounded-lg text-base font-medium text-ink-deep transition-colors ${socialTone[s.tone]}`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/8 px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-paper/50">©</span>
            <span>{year}</span>
            <Sparkle className="size-2.5 text-accent" />
            <span className="text-paper/50">{program.name}</span>
            <a href={program.privacyHref} className="ml-4 transition-colors hover:text-accent">
              Privacy Statement
            </a>
          </p>
          <div className="flex items-center gap-5">
            <span className="text-paper/50">by {program.mentor}</span>
            <a
              href="#top"
              aria-label="Back to top"
              className="grid size-12 place-items-center rounded-2xl bg-[#1a1a1a] transition-colors hover:bg-ink-raised"
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <path d="M12 20V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
