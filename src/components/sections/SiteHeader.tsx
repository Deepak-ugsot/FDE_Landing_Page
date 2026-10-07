import { program } from "@/content/program";
import { Marquee } from "@/components/ui/Marquee";
import { Sparkle } from "@/components/ui/Sparkle";

const tickerItems = [
  { label: "The loop", value: "Discover · Build · Deploy · Own" },
  { label: "Mentor", value: program.mentor },
  { label: "The goal", value: "AI that survives production" },
];

// Three items are narrower than a wide viewport, which would leave a gap before
// the loop restarts — repeat them so one copy always overfills the strip.
const tickerLoop = [...tickerItems, ...tickerItems, ...tickerItems];

/** Announcement ticker that sits on the page background above the hero card. */
export function Ticker() {
  return (
    <div className="flex items-center py-3 pl-4 text-sm sm:pl-6 lg:pl-8">
      <span className="flex shrink-0 items-center gap-2.5 pr-5 font-display text-base font-semibold">
        <span className="size-1.5 rounded-full bg-paper" aria-hidden="true" />
        FDE Program
      </span>
      <Marquee
        duration={45}
        className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        {tickerLoop.map((item, i) => (
          <span key={i} className="flex items-center gap-2 px-5">
            <Sparkle className="size-2.5 text-accent" />
            <span className="text-dim">{item.label}</span>
            <span className="text-paper">{item.value}</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
