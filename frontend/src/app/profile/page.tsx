"use client";

import { useEffect, useState } from "react";
import { Award, BookOpen, Check, Folder, Lock, Play, Shield, Sparkles, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/components/app/useRequireAuth";
import { AppHeader } from "@/components/app/AppHeader";
import { PageLoader } from "@/components/app/PageLoader";
import { CtaButton } from "@/components/ui/CtaButton";
import { getPaymentConfig } from "@/lib/payments";
import { program } from "@/content/program";

const statusLabels: Record<string, string> = {
  student: "Student",
  fresher: "Fresher",
  working_professional: "Working professional",
  other: "Learner",
};

const unlockedPerks = ["50+ organized lectures", "Notes & cheat sheets", "Hands-on practice projects", "Completion certificate"];

export default function ProfilePage() {
  const { ready } = useRequireAuth();
  const { user } = useAuth();
  const [lmsUrl, setLmsUrl] = useState<string | null>(null);

  useEffect(() => {
    getPaymentConfig().then((c) => setLmsUrl(c.lmsUrl)).catch(() => {});
  }, []);

  if (!ready || !user) return <PageLoader label="Loading your account…" />;

  const firstName = user.fullName?.split(" ")[0] || "there";
  const initials =
    user.fullName?.trim().split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-ink text-paper">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Welcome */}
        <div className="animate-fade-up">
          <h1 className="font-display text-3xl font-light tracking-[-0.01em] sm:text-4xl">
            Welcome back, <span className="text-accent">{firstName}</span> 👋
          </h1>
          <p className="mt-2 text-dim">Here&apos;s your hub for the AI Forward Deployed Engineer program.</p>
        </div>

        {/* Stat row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Shield className="size-4" />} label="Access status">
            {user.hasPaid ? (
              <Pill tone="success">
                <Check className="size-3" strokeWidth={3} /> Unlocked
              </Pill>
            ) : (
              <Pill tone="warning">
                <Lock className="size-3" /> Locked
              </Pill>
            )}
          </StatCard>
          <StatCard icon={<User className="size-4" />} label="You are a">
            <span className="text-lg">{statusLabels[user.currentStatus || "student"] || "Learner"}</span>
          </StatCard>
          <StatCard icon={<Award className="size-4" />} label="Member since">
            <span className="text-lg">{memberSince}</span>
          </StatCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Access + what's inside */}
          <div className="space-y-6">
            <section
              className={`relative overflow-hidden rounded-3xl border p-7 sm:p-9 ${
                user.hasPaid
                  ? "border-emerald-500/30 bg-[radial-gradient(120%_90%_at_20%_0%,rgba(16,185,129,0.14),var(--color-ink-deep))]"
                  : "border-accent/40 bg-[radial-gradient(120%_90%_at_20%_0%,#363636,var(--color-ink-raised)_40%,var(--color-ink-deep))]"
              }`}
            >
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-ink/40 text-paper ring-1 ring-white/10">
                {user.hasPaid ? <Check className="size-6 text-emerald-400" strokeWidth={3} /> : <Lock className="size-5" />}
              </div>

              {user.hasPaid ? (
                <>
                  <h2 className="font-display text-2xl font-light">You&apos;re all set! 🎉</h2>
                  <p className="mt-2 max-w-md text-sm text-mist">
                    Your access is unlocked. Head to the learning platform to start the lectures, notes and
                    hands-on projects.
                  </p>
                  <div className="mt-5">
                    <CtaButton
                      href={lmsUrl || "#"}
                      external={!!lmsUrl}
                      onClick={(e) => {
                        if (!lmsUrl) e.preventDefault();
                      }}
                    >
                      Continue to the platform
                    </CtaButton>
                    {!lmsUrl && <p className="mt-3 text-xs text-dim">The platform link will appear here once it&apos;s live.</p>}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-light">Unlock the full platform</h2>
                  <p className="mt-2 max-w-md text-sm text-mist">
                    Complete a one-time {program.platformPrice} payment to unlock all lectures, notes and practice
                    projects.
                  </p>
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {unlockedPerks.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm text-mist">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <CtaButton href="/payment">Unlock for {program.platformPrice}</CtaButton>
                  </div>
                </>
              )}
            </section>

            {/* What's inside */}
            <section className="rounded-3xl border border-ink-line bg-ink-deep p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-accent-light uppercase">
                <Sparkles className="size-3.5" /> What&apos;s inside
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: <Play className="size-5" />, t: "Lectures" },
                  { icon: <BookOpen className="size-5" />, t: "Notes" },
                  { icon: <Folder className="size-5" />, t: "Projects" },
                ].map((x) => (
                  <div
                    key={x.t}
                    className={`rounded-2xl border border-ink-line bg-ink/40 px-3 py-5 text-center ${user.hasPaid ? "" : "opacity-55"}`}
                  >
                    <div className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-accent/15 text-accent-light">
                      {x.icon}
                    </div>
                    <div className="text-sm font-medium">{x.t}</div>
                    {!user.hasPaid && <div className="mt-0.5 text-[11px] text-dim">Locked</div>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Profile summary */}
          <section className="h-fit rounded-3xl border border-ink-line bg-ink-deep p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-accent text-sm font-semibold text-on-accent">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate font-display">{user.fullName}</div>
                <div className="truncate text-sm text-dim">{user.email}</div>
              </div>
            </div>

            <InfoRow k="Phone" v={`+91 ${user.phone}`} />
            <InfoRow k="City" v={user.city || "—"} />
            <InfoRow k="Status" v={statusLabels[user.currentStatus || "student"] || "Learner"} />
            <InfoRow k="Access" v={user.hasPaid ? "Full access" : "Not unlocked"} />
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-line bg-ink-deep p-5">
      <div className="flex items-center gap-2 text-xs text-dim">
        {icon} {label}
      </div>
      <div className="mt-2 font-display">{children}</div>
    </div>
  );
}

function Pill({ tone, children }: { tone: "success" | "warning"; children: React.ReactNode }) {
  const tones = {
    success: "bg-emerald-500/15 text-emerald-300",
    warning: "bg-amber-500/15 text-amber-300",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-t border-ink-line py-2.5 text-sm first:border-t-0">
      <span className="text-dim">{k}</span>
      <span className="font-medium text-paper">{v}</span>
    </div>
  );
}
