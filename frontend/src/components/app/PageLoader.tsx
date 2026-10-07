import { Spinner } from "@/components/ui/form";

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-ink text-paper">
      <div className="flex flex-col items-center gap-3 text-dim">
        <Spinner className="size-7 text-accent" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
}
