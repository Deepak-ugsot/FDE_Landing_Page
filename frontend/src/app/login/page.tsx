"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Alert, Field, SubmitButton, TextInput } from "@/components/ui/form";

const perks = [
  "Pick up exactly where you left off",
  "All your lectures, notes & projects",
  "Your unlocked access, saved",
];

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace("/profile");
  }, [loading, isAuthenticated, router]);

  const set = (name: "email" | "password", value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      await login(form);
      router.replace("/profile");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Invalid email or password");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      headline={
        <>
          Your path to becoming a <span className="text-accent">deployed engineer</span> continues here.
        </>
      }
      perks={perks}
    >
      <h1 className="font-display text-3xl font-light tracking-[-0.01em]">Welcome back</h1>
      <p className="mt-2 text-sm text-dim">Log in to continue.</p>

      {serverError && <Alert className="mt-5">{serverError}</Alert>}

      <form onSubmit={onSubmit} className="mt-6" noValidate>
        <Field label="Email address" htmlFor="email" error={errors.email}>
          <TextInput
            id="email"
            type="email"
            icon={<Mail className="size-[18px]" />}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            invalid={!!errors.email}
            autoComplete="email"
          />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <TextInput
            id="password"
            type="password"
            icon={<Lock className="size-[18px]" />}
            placeholder="Your password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            invalid={!!errors.password}
            autoComplete="current-password"
          />
        </Field>

        <div className="-mt-2 mb-4 text-right">
          <Link href="/forgot-password" className="text-[13px] text-dim hover:text-accent-light">
            Forgot password?
          </Link>
        </div>

        <SubmitButton loading={submitting}>Log in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-dim">
        New here?{" "}
        <Link href="/signup" className="font-medium text-accent-light hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
