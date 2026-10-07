import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { mentorProfile } from "@/content/program";

/**
 * Two-column shell for the auth pages, styled to the landing page: a dark branded
 * aside (hidden on mobile) with a marketing quote + perks, and the form on the right.
 */
export function AuthLayout({
  eyebrow,
  headline,
  perks,
  children,
}: {
  eyebrow: string;
  headline: ReactNode;
  perks: string[];
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-ink text-paper lg:grid-cols-2">
      {/* Brand aside */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-ink-line bg-ink-deep p-10 lg:flex xl:p-14">
        {/* Accent glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(230,22,31,0.22),transparent_55%)]"
        />
        <Link href="/" className="relative z-10 inline-flex w-fit items-center" aria-label="Back to home">
          <Logo className="h-12 w-auto" />
        </Link>

        <div className="relative z-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-accent-light uppercase">{eyebrow}</p>
          <h2 className="mt-4 max-w-md font-display text-[2.4rem] leading-[1.05] font-light tracking-[-0.01em]">
            {headline}
          </h2>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px] text-mist">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="relative size-11 overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image src={mentorProfile.photo} alt={mentorProfile.name} fill sizes="44px" className="object-cover object-top" />
          </div>
          <div>
            <p className="font-display text-sm">{mentorProfile.name}</p>
            <p className="text-xs text-dim">{mentorProfile.role}</p>
          </div>
        </div>
      </aside>

      {/* Form side */}
      <main className="flex flex-col px-5 py-10 sm:px-10">
        <Link href="/" className="mb-10 inline-flex w-fit items-center lg:hidden" aria-label="Back to home">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="mx-auto w-full max-w-md animate-fade-up lg:my-auto">{children}</div>
      </main>
    </div>
  );
}
