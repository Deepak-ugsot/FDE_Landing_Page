// Illustrative "client engagement" window shown in the hero panel.

const stages = [
  { n: "01", title: "Discover", detail: "Stated problem vs. the real one", status: "done" },
  { n: "02", title: "Build", detail: "RAG + agents on the client's data", status: "done" },
  { n: "03", title: "Deploy", detail: "Inside their VPC, behind their SSO", status: "live" },
  { n: "04", title: "Own", detail: "Evals, cost and adoption", status: "next" },
] as const;

const statusStyle = {
  done: "bg-sage/15 text-sage",
  live: "bg-accent/20 text-accent",
  next: "bg-white/5 text-dim",
};

const log = [
  { mark: "$", text: "fde deploy --env client-vpc", tone: "text-paper" },
  { mark: "✓", text: "golden-set evals passed", tone: "text-sage" },
  { mark: "✓", text: "PII guardrails enabled", tone: "text-sage" },
  { mark: "✓", text: "SSO (OIDC) connected", tone: "text-sage" },
  { mark: "→", text: "canary: 10% of support team", tone: "text-accent" },
];

export function HeroConsole() {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-t-2xl bg-ink-deep text-left shadow-[0_30px_80px_-20px_rgba(20,20,20,0.6)]">
      <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
        <span className="size-2.5 rounded-full bg-flame/80" />
        <span className="size-2.5 rounded-full bg-accent/80" />
        <span className="size-2.5 rounded-full bg-sage/80" />
        <span className="ml-3 font-mono text-xs text-dim">client-engagement · week 06</span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-white/5 md:grid-cols-[1.15fr_1fr]">
        <ol className="space-y-2 bg-ink-deep p-5 sm:p-6">
          {stages.map((s) => (
            <li key={s.n} className="flex items-center gap-4 rounded-xl bg-ink px-4 py-3">
              <span className="font-mono text-xs text-dim">{s.n}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-tight">{s.title}</span>
                <span className="block truncate text-sm text-dim">{s.detail}</span>
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs ${statusStyle[s.status]}`}>{s.status}</span>
            </li>
          ))}
        </ol>

        <div className="bg-ink-deep p-5 font-mono text-[13px] leading-7 sm:p-6">
          {log.map((line) => (
            <p key={line.text} className={line.tone}>
              <span className="mr-3 text-dim">{line.mark}</span>
              {line.text}
            </p>
          ))}
          <p className="mt-1 text-dim">
            <span className="mr-3">$</span>
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" />
          </p>
        </div>
      </div>
    </div>
  );
}
