import { program } from "@/content/program";

// What the paid tier adds on top of the free YouTube course.
// TODO: confirm the wording with the program team (especially the job-opportunities promise).
const perks = [
  {
    title: "Structured notes",
    body: "Module-by-module notes that follow the videos, so you revise in minutes instead of rewatching hours.",
  },
  {
    title: "Practice projects",
    body: "Hands-on projects for every module, so you build the systems yourself instead of only watching them being built.",
  },
  {
    title: "Learning platform",
    body: "One place for the whole course: lessons, notes, projects and your progress.",
  },
  {
    title: "Community",
    body: "Learn alongside other engineers on the same path. Ask questions, share what you build and get unstuck faster.",
  },
  {
    title: "Job opportunities",
    body: "Hear about FDE and applied-AI roles as you work through the program.",
  },
];

/**
 * What the paid tier unlocks. The heading sits in the first cell of a two-column grid and
 * each perk is a soft card: rounded, a hairline on its right edge and a faint
 * accent gradient that brightens on hover.
 */
export function WhyPaid() {
  return (
    <section id="why-paid" className="pt-4 pb-16 lg:pt-2 lg:pb-24">
      <div className="mx-auto grid max-w-[1328px] gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
        {/* Heading cell: free vs paid contrast, then what the price adds */}
        <div className="flex flex-col justify-center gap-5 lg:py-4 lg:pr-8">
          <p className="flex items-center gap-2.5 font-display text-base font-bold">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            What {program.platformPrice} unlocks
          </p>
          <h2 className="font-display text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.05] font-light tracking-[-0.01em]">
            Watch it free.
            <br />
            <span className="font-normal text-accent">Master it for {program.platformPrice}.</span>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-mist">
            The lessons stay free on YouTube. {program.platformPrice} adds everything that turns watching into doing.
          </p>
        </div>

        {perks.map((p) => (
          <article
            key={p.title}
            className="group relative isolate flex min-h-52 flex-col justify-between gap-6 rounded-[32px] border-r border-[#44443e] p-8 pr-6 sm:pr-16 lg:min-h-60 lg:pr-14 lg:pl-10"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(135deg,rgba(235,255,85,0),rgba(235,255,85,0.07))] transition-opacity duration-500"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(135deg,rgba(235,255,85,0),rgba(235,255,85,0.16))] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.25rem)] leading-tight font-normal">{p.title}</h3>
            <p className="max-w-md text-base leading-relaxed text-paper/60">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
