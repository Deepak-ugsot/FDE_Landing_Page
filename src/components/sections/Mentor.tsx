import Image from "next/image";
import { mentorProfile as m } from "@/content/program";
import { CtaButton } from "@/components/ui/CtaButton";
import { roundedUnionPath, type Rect } from "@/lib/roundedUnion";

// Stepped backdrop behind the photo (px, in a 600x440 box), like the reference's founder block.
// The photo covers x ≥ 200 / y 40–440, so only the stair edges on its left and top peek out.
const BACKDROP: Rect[] = [
  [96, 0, 210, 72],
  [120, 36, 340, 200],
  [0, 186, 280, 350],
  [120, 330, 300, 440],
];
const BACKDROP_PATH = roundedUnionPath(BACKDROP, 24);

// How each logo is turned one-colour so they read as a set on the dark background.
const logoTone = {
  mono: "brightness-0 invert", // any colours → white
  invert: "invert", // black badge with cut-out letters → white badge
  none: "", // already one-colour (e.g. linkedin-mono.svg)
} as const;

const photoGlow =
  "bg-[radial-gradient(120%_90%_at_78%_100%,rgba(235,255,85,0.42)_0%,rgba(235,255,85,0.08)_45%,#1a1a17_78%)]";

function Photo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[32px] ${photoGlow} ${className}`}>
      <Image
        src={m.photo}
        alt={`${m.name}, ${m.role}`}
        fill
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 420px, 90vw"
        className="object-cover object-top"
      />
    </div>
  );
}

export function Mentor() {
  return (
    <section id="mentor" className="pb-16 lg:pb-20">
      <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[600px_1fr] lg:gap-16">
          {/* Desktop composition: stepped backdrop, name card and photo */}
          <div className="relative hidden h-[440px] w-[600px] lg:block">
            <svg viewBox="0 0 600 440" className="absolute inset-0 size-full" aria-hidden="true">
              <path d={BACKDROP_PATH} fill="var(--color-ink-deep)" />
            </svg>
            <div className="absolute top-[222px] left-8 w-[150px]">
              <p className="font-display text-[26px] leading-[1.1] font-normal">
                Vishwa
                <br />
                Mohan
              </p>
              <p className="mt-2 text-[13px] leading-snug text-dim">{m.role}</p>
            </div>
            <Photo className="absolute top-[40px] left-[200px] size-[400px]" />
          </div>

          {/* Mobile / tablet: photo with a name chip */}
          <div className="relative mx-auto w-full max-w-[420px] lg:hidden">
            <Photo className="aspect-square w-full" />
            <div className="absolute -bottom-6 left-4 rounded-3xl bg-ink-deep px-5 py-4">
              <p className="font-display text-xl leading-tight">{m.name}</p>
              <p className="mt-1 text-xs text-dim">{m.role}</p>
            </div>
          </div>

          {/* Copy */}
          <div className="max-w-xl pt-6 lg:pt-0">
            <p className="flex items-center gap-2.5 font-display text-base font-bold">
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
              Meet your mentor
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4vw,3.25rem)] leading-[1.06] font-light tracking-[-0.01em]">
              Learn from someone who has built at scale.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-mist">
              {m.name} is the Founder &amp; CEO of upGrad School of Technology. Before that, he worked at Oracle,
              Walmart, PayPal, LinkedIn and PW.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {m.highlights.map((h) => (
                <li key={h} className="rounded-full border border-ink-line px-3.5 py-1.5 text-sm text-mist">
                  {h}
                </li>
              ))}
            </ul>
            {/* Where he has built: one-colour logos, optically sized so they read as one set */}
            <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-5" aria-label="Companies he has worked with">
              {m.companies.map((c) => {
                // Square marks get 36px height; wordmarks aim for ~88px wide (max 24px tall),
                // so a very wide wordmark like Oracle doesn't dominate the row.
                const square = c.width / c.height < 1.5;
                const height = square ? 36 : Math.min(24, Math.round((88 * c.height) / c.width));
                return (
                  <li key={c.name}>
                    <Image
                      src={c.logo}
                      alt={c.name}
                      width={c.width}
                      height={c.height}
                      style={{ height }}
                      className={`w-auto object-contain opacity-70 transition-opacity hover:opacity-100 ${logoTone[c.tone]}`}
                    />
                  </li>
                );
              })}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <CtaButton href={m.linkedin} external>
                Connect on LinkedIn
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
