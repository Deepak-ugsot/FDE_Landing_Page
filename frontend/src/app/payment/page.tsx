"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Shield, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/components/app/useRequireAuth";
import { AppHeader } from "@/components/app/AppHeader";
import { PageLoader } from "@/components/app/PageLoader";
import { CtaButton } from "@/components/ui/CtaButton";
import { Alert, Spinner } from "@/components/ui/form";
import { getPaymentConfig, startCheckout, type PaymentConfig, type VerifyResponse } from "@/lib/payments";

const benefits = [
  "All 50+ lectures, neatly organized",
  "Downloadable notes & cheat sheets",
  "Every hands-on practice project",
  "Learner community access",
  "Completion certificate",
];

export default function PaymentPage() {
  const { ready } = useRequireAuth();
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loadingCfg, setLoadingCfg] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [lmsUrl, setLmsUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(6);

  // If already unlocked (and not mid-success), go to the dashboard.
  useEffect(() => {
    if (ready && user?.hasPaid && !success) router.replace("/profile");
  }, [ready, user?.hasPaid, success, router]);

  useEffect(() => {
    getPaymentConfig()
      .then((c) => {
        setConfig(c);
        setLmsUrl(c.lmsUrl);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load pricing"))
      .finally(() => setLoadingCfg(false));
  }, []);

  // Countdown redirect to the LMS after success.
  useEffect(() => {
    if (!success || !lmsUrl) return;
    if (countdown <= 0) {
      window.location.href = lmsUrl;
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, lmsUrl]);

  const finishSuccess = useCallback(
    (result: VerifyResponse) => {
      updateUser({ hasPaid: true, paidAt: new Date().toISOString() });
      if (result.lmsUrl) setLmsUrl(result.lmsUrl);
      setSuccess(true);
      setProcessing(false);
    },
    [updateUser]
  );

  const handlePay = () => {
    setError("");
    setProcessing(true);
    startCheckout({
      onSuccess: finishSuccess,
      onError: (msg) => {
        setError(msg);
        setProcessing(false);
      },
      onDismiss: () => {
        setProcessing(false);
        setError("Payment was cancelled. You can try again anytime.");
      },
    });
  };

  if (!ready || !user) return <PageLoader label="Loading checkout…" />;

  const priceRupees = config ? (config.amount / 100).toFixed(0) : "99";

  return (
    <div className="min-h-screen bg-ink text-paper">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        {success ? (
          <div className="mx-auto max-w-lg animate-fade-up rounded-3xl border border-ink-line bg-ink-deep p-8 text-center sm:p-10">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-on-accent">
              <Check className="size-8" strokeWidth={3} />
            </div>
            <h1 className="mt-5 font-display text-3xl font-light">Payment successful! 🎉</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
              Your access is unlocked. {lmsUrl ? "Taking you to the learning platform…" : "The learning platform link will be shared with you shortly."}
            </p>
            {lmsUrl && <p className="mt-2 text-xs text-dim">Redirecting in {countdown}s</p>}
            {config?.mock && <p className="mt-3 text-xs text-dim">Test mode — simulated payment (no money was charged).</p>}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {lmsUrl && (
                <CtaButton href={lmsUrl} external>
                  Go to the platform
                </CtaButton>
              )}
              <Link
                href="/profile"
                className="inline-flex h-11 items-center rounded-2xl border border-ink-line px-5 text-sm font-medium transition-colors hover:bg-ink-raised"
              >
                Back to profile
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="animate-fade-up">
              <h1 className="font-display text-3xl font-light tracking-[-0.01em] sm:text-4xl">Unlock your access</h1>
              <p className="mt-2 text-dim">One-time payment — lifetime access to the AI Forward Deployed Engineer platform.</p>
            </div>

            {error && <Alert className="mt-5">{error}</Alert>}

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              {/* Plan details */}
              <section className="rounded-3xl border border-ink-line bg-ink-deep p-7 sm:p-8">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-accent-light uppercase">
                  <Sparkles className="size-3.5" /> Platform access
                </div>
                <h2 className="mt-2 font-display text-2xl font-light">Everything, unlocked</h2>
                <ul className="mt-6 space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-mist">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Order summary */}
              <section className="h-fit rounded-3xl border border-accent/40 bg-[radial-gradient(120%_90%_at_20%_0%,#363636,var(--color-ink-raised)_40%,var(--color-ink-deep))] p-7 sm:p-8">
                <h3 className="font-display text-lg">Order summary</h3>

                {loadingCfg ? (
                  <div className="grid place-items-center py-10">
                    <Spinner className="size-6 text-accent" />
                  </div>
                ) : (
                  <>
                    <div className="mt-4 flex justify-between text-sm text-mist">
                      <span>Platform access (lifetime)</span>
                      <span>₹{priceRupees}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-mist">
                      <span>Taxes</span>
                      <span>Included</span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-display text-lg">
                      <span>Total</span>
                      <span>₹{priceRupees}</span>
                    </div>

                    {config?.mock && (
                      <Alert variant="info" className="mt-4">
                        <strong>Test mode</strong> — Razorpay keys aren&apos;t configured, so this completes a simulated
                        payment (no money is charged).
                      </Alert>
                    )}

                    <div className="mt-5">
                      <CtaButton type="button" fullWidth loading={processing} onClick={handlePay}>
                        Pay ₹{priceRupees}
                        {config?.mock ? " (Test)" : ""}
                      </CtaButton>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-dim">
                      <Shield className="size-3.5" /> Secured by Razorpay · 256-bit encryption
                    </div>
                  </>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
