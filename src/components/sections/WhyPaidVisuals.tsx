import Image from "next/image";
import { Award, BadgeCheck, BriefcaseBusiness, CircleCheck, MapPin } from "lucide-react";
import a1 from "../../../public/assets/why-paid/avatars/1.webp";
import a2 from "../../../public/assets/why-paid/avatars/2.webp";
import a3 from "../../../public/assets/why-paid/avatars/3.webp";
import a4 from "../../../public/assets/why-paid/avatars/4.webp";
import a5 from "../../../public/assets/why-paid/avatars/5.webp";

// Illustrations for the WhyPaid cards: small product mockups drawn in code, so they stay
// crisp and on-brand. Each fills a FeatureSections frame (dark panel, ~352×246) and its
// white cards run off the right/bottom edge on purpose. All decorative.

const sheet = "absolute bg-white text-ink-deep shadow-[0_12px_40px_rgba(0,0,0,0.25)]";

export function NotesVisual() {
  const points = ["Chunk by meaning, not by length", "Re-rank before you generate", "Cite a source in every answer"];
  return (
    <div className={`${sheet} top-[14%] right-0 bottom-0 left-[9%] rounded-tl-2xl p-5`}>
      <p className="text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">Module 04 · Notes</p>
      <p className="mt-1.5 font-display text-[17px] leading-tight font-semibold">RAG pipelines, end to end</p>
      <ul className="mt-3.5 space-y-2 text-[12.5px] text-ink-deep/75">
        {points.map((p, i) => (
          <li key={p} className="flex items-center gap-2">
            <CircleCheck className="size-3.5 shrink-0 text-accent" strokeWidth={2.5} />
            <span className={i === 1 ? "rounded bg-accent/12 px-1 text-ink-deep" : ""}>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectsVisual() {
  const k = "text-accent-light";
  const f = "text-[#f6c177]";
  return (
    <>
      <div className="absolute top-[12%] right-0 bottom-0 left-[9%] overflow-hidden rounded-tl-2xl border-t border-l border-white/10 bg-[#161616] shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-2.5">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="ml-3 font-mono text-[10px] text-white/50">support_agent.py</span>
        </div>
        <pre className="px-4 py-3 font-mono text-[11px] leading-[1.7] text-paper/85">
          <span className={k}>def</span> <span className={f}>answer</span>(query):{"\n"}
          {"    "}docs = <span className={f}>retrieve</span>(query, k=<span className={k}>8</span>){"\n"}
          {"    "}ranked = <span className={f}>rerank</span>(query, docs){"\n"}
          {"    "}<span className={k}>return</span> llm.<span className={f}>generate</span>(ranked)
        </pre>
      </div>
      <div className={`${sheet} bottom-[10%] left-[5%] flex items-center gap-2 rounded-full py-2 pr-4 pl-2.5 text-[12px] font-medium`}>
        <CircleCheck className="size-4 text-[#16a34a]" strokeWidth={2.5} />
        12 / 12 tests passed
      </div>
    </>
  );
}

export function PlatformVisual() {
  const bars = [62, 24, 46, 38, 70, 52, 88, 96, 30, 46, 38, 58];
  const current = 6;
  return (
    <div className={`${sheet} top-[16%] right-0 bottom-0 left-[16%] flex flex-col rounded-tl-2xl px-5 pt-4`}>
      <p className="text-[12px] text-ink-deep/60">Course progress</p>
      <p className="font-display text-[28px] leading-none font-medium">
        64<span className="text-[18px]">%</span>
      </p>
      <div className="mt-auto flex h-[58%] items-end gap-[6%] pr-4">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`flex-1 rounded-t-full ${i === current ? "bg-accent" : "bg-accent/15"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Avatar centres as % of the frame, joined in a loop by dashed lines.
const people = [
  { src: a1, x: 20, y: 52 },
  { src: a2, x: 47, y: 23 },
  { src: a3, x: 78, y: 33 },
  { src: a5, x: 77, y: 77 },
  { src: a4, x: 44, y: 79 },
];

export function CommunityVisual() {
  return (
    <>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <polygon
          points={people.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="1.25"
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {people.map((p, i) => (
        <span
          key={i}
          className="absolute aspect-square w-[19%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <Image src={p.src} alt="" fill sizes="72px" className="object-cover" />
        </span>
      ))}
      <span className={`${sheet} top-[7%] right-[4%] rounded-full rounded-br-sm px-3 py-1.5 text-[11px] font-medium`}>
        Got my agent working!
      </span>
    </>
  );
}

function Role({ title, meta, className }: { title: string; meta: string; className: string }) {
  return (
    <div className={`${sheet} ${className} flex items-start gap-3 rounded-l-2xl p-4`}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-white">
        <BriefcaseBusiness className="size-4.5" />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[13.5px] font-semibold">
          {title}
          <BadgeCheck className="size-3.5 shrink-0 text-accent" strokeWidth={2.5} />
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-ink-deep/60">
          <MapPin className="size-3" />
          {meta}
        </p>
        <span className="mt-2 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
          New role
        </span>
      </div>
    </div>
  );
}

export function JobsVisual() {
  return (
    <>
      <Role title="Forward Deployed Engineer" meta="Applied AI · Bengaluru" className="top-[11%] right-0 left-[20%]" />
      <Role title="AI Solutions Engineer" meta="GenAI · Remote" className="top-[57%] right-0 -bottom-4 left-[8%] rounded-bl-none" />
    </>
  );
}

export function CertificateVisual() {
  return (
    <>
      <div className={`${sheet} top-[13%] right-[9%] -bottom-3 left-[9%] rounded-t-2xl p-2`}>
        <div className="flex h-full flex-col items-center rounded-t-xl border border-b-0 border-accent/25 px-4 pt-4 text-center">
          <p className="text-[9.5px] font-semibold tracking-[0.18em] text-accent uppercase">Certificate of completion</p>
          <p className="mt-2 font-display text-[16px] leading-tight font-semibold">AI Forward Deployed Engineer</p>
          <p className="mt-3 text-[10px] text-ink-deep/50">Awarded to</p>
          <p className="font-display text-[19px] italic">Your Name</p>
          <span className="mt-1.5 h-px w-2/5 bg-ink-deep/15" />
        </div>
      </div>
      <span className="absolute right-[5%] bottom-[9%] grid size-14 place-items-center rounded-full border-4 border-white bg-accent text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
        <Award className="size-6" />
      </span>
    </>
  );
}
