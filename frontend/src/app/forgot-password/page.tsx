"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Alert, Field, SubmitButton, TextInput } from "@/components/ui/form";
import { api } from "@/lib/api";

const perks = ["Reset links expire in 60 minutes", "We'll never share your email", "Back to learning in a minute"];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setSubmitting(true);
    try {
      const data = await api.post<{ message: string; devResetUrl?: string }>("/auth/forgot-password", { email }, { auth: false });
      setDevResetUrl(data.devResetUrl || null);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Turn the dev reset URL into an in-app path (strip the origin).
  const devResetPath = devResetUrl ? devResetUrl.replace(/^https?:\/\/[^/]+/, "") : null;

  return (
    <AuthLayout
      eyebrow="Account recovery"
      headline={
        <>
          Locked out? Let&apos;s get you back to <span className="text-accent">building.</span>
        </>
      }
      perks={perks}
    >
      {!sent ? (
        <>
          <h1 className="font-display text-3xl font-light tracking-[-0.01em]">Forgot password?</h1>
          <p className="mt-2 text-sm text-dim">Enter your account email and we&apos;ll send you a link to reset it.</p>

          {error && <Alert className="mt-5">{error}</Alert>}

          <form onSubmit={onSubmit} className="mt-6" noValidate>
            <Field label="Email address" htmlFor="email">
              <TextInput
                id="email"
                type="email"
                icon={<Mail className="size-[18px]" />}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                invalid={!!error}
                autoComplete="email"
              />
            </Field>

            <SubmitButton loading={submitting}>Send reset link</SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-dim">
            Remembered it?{" "}
            <Link href="/login" className="font-medium text-accent-light hover:underline">
              Back to log in
            </Link>
          </p>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full border border-ink-line bg-ink-deep text-accent-light">
            <Mail className="size-7" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-light">Check your email</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
            If an account exists for <strong className="text-paper">{email}</strong>, we&apos;ve sent a password reset
            link. It expires in 60 minutes.
          </p>

          {devResetPath && (
            <Alert variant="info" className="mt-5 text-left">
              <strong>Dev mode:</strong> no email provider is configured, so use this link to continue:
              <div className="mt-3">
                <Link
                  href={devResetPath}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 px-3 py-1.5 text-sm font-medium hover:bg-amber-500/10"
                >
                  Open reset link <ArrowRight className="size-4" />
                </Link>
              </div>
            </Alert>
          )}

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-ink-line text-sm font-medium transition-colors hover:bg-ink-raised"
          >
            Back to log in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
