"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { CtaButton } from "@/components/ui/CtaButton";
import { Alert, Field, SubmitButton, TextInput } from "@/components/ui/form";
import { api } from "@/lib/api";

const perks = ["Use at least 6 characters", "Pick something only you know", "You can log in right after"];

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (name: "password" | "confirm", value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    const e: Record<string, string> = {};
    if (form.password.length < 6) e.password = "At least 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password }, { auth: false });
      setDone(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not reset your password. The link may have expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="New password"
      headline={
        <>
          One strong password and you&apos;re <span className="text-accent">back in.</span>
        </>
      }
      perks={perks}
    >
      {!done ? (
        <>
          <h1 className="font-display text-3xl font-light tracking-[-0.01em]">Set a new password</h1>
          <p className="mt-2 text-sm text-dim">Choose a new password for your account.</p>

          {serverError && (
            <Alert className="mt-5">
              {serverError}
              <div className="mt-2">
                <Link href="/forgot-password" className="font-medium underline">
                  Request a new link
                </Link>
              </div>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="mt-6" noValidate>
            <Field label="New password" htmlFor="password" error={errors.password}>
              <TextInput
                id="password"
                type="password"
                icon={<Lock className="size-[18px]" />}
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                invalid={!!errors.password}
                autoComplete="new-password"
              />
            </Field>

            <Field label="Confirm new password" htmlFor="confirm" error={errors.confirm}>
              <TextInput
                id="confirm"
                type="password"
                icon={<Lock className="size-[18px]" />}
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                invalid={!!errors.confirm}
                autoComplete="new-password"
              />
            </Field>

            <SubmitButton loading={submitting}>Reset password</SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-dim">
            <Link href="/login" className="font-medium text-accent-light hover:underline">
              Back to log in
            </Link>
          </p>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-on-accent">
            <Check className="size-8" strokeWidth={3} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-light">Password reset! 🎉</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
            Your password has been updated. You can now log in with your new password.
          </p>
          <div className="mt-6">
            <CtaButton href="/login" fullWidth>Go to log in</CtaButton>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
