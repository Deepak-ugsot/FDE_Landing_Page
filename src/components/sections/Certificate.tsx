import Image from "next/image";
import { program } from "@/content/program";
import certificate from "../../../public/assets/demo_fde.png";

/**
 * The certificate the paid tier ends with: a centered heading (same header block as
 * the WhyPaid cards above) over a sample certificate on a dark panel.
 */
// TODO: confirm the completion criteria and the issuing entity with the program team.
export function Certificate() {
  return (
    <section id="certificate" className="w-full py-16 lg:py-24">
      <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto mb-12 flex flex-col items-center gap-5 text-center lg:mb-14">
          <p className="flex items-center gap-2.5 font-display text-base font-bold">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            Certificate
          </p>
          {/* One line from lg, where the container is wide enough for it. */}
          <h2 className="font-display text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.05] font-light tracking-[-0.01em] lg:whitespace-nowrap">
            Finish the program. <span className="text-accent">Earn the certificate.</span>
          </h2>
          <p className="max-w-[52rem] text-base leading-relaxed text-mist">
            Complete the modules and the projects, and {program.institution} issues a certificate with your name on it —
            one more line on your profile that says you have built this, not just watched it.
          </p>
        </div>

        <div className="mx-auto max-w-[920px] overflow-hidden rounded-2xl border border-accent/45 bg-[radial-gradient(120%_90%_at_20%_0%,#363636,var(--color-ink-raised)_40%,var(--color-ink-deep))] p-3 sm:rounded-3xl sm:p-6">
          <Image
            src={certificate}
            alt={`Sample certificate of participation from ${program.institution}`}
            sizes="(min-width: 1024px) 900px, 100vw"
            placeholder="blur"
            className="w-full rounded-lg shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] sm:rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
