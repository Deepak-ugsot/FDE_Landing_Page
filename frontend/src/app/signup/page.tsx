"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, MapPin, User } from "lucide-react";
import { useAuth, type CurrentStatus } from "@/context/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Alert, Field, SelectInput, SubmitButton, TextInput } from "@/components/ui/form";
import { ApiError } from "@/lib/api";

const perks = [
  "All lectures, notes & projects in one place",
  "Lifetime access for a one-time ₹99",
  "Learner community + completion certificate",
];

type Form = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  currentStatus: CurrentStatus;
};

export default function SignupPage() {
  const { signup, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<Form>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    currentStatus: "student",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace("/profile");
  }, [loading, isAuthenticated, router]);

  const set = (name: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 2) e.fullName = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signup({ ...form, phone: form.phone.trim() });
      router.replace("/profile");
    } catch (err) {
      if (err instanceof ApiError && err.errors) setErrors(err.errors);
      setServerError(err instanceof Error ? err.message : "Could not create your account");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Join the platform"
      headline={
        <>
          The lectures got you started. The platform gets you <span className="text-accent">deployed.</span>
        </>
      }
      perks={perks}
    >
      <h1 className="font-display text-3xl font-light tracking-[-0.01em]">Create your account</h1>
      <p className="mt-2 text-sm text-dim">Capture your spot — it takes less than a minute.</p>

      {serverError && <Alert className="mt-5">{serverError}</Alert>}

      <form onSubmit={onSubmit} className="mt-6" noValidate>
        <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
          <TextInput
            id="fullName"
            icon={<User className="size-[18px]" />}
            placeholder="Aditi Sharma"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            invalid={!!errors.fullName}
            autoComplete="name"
          />
        </Field>

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

        <Field label="Mobile number" htmlFor="phone" error={errors.phone}>
          <TextInput
            id="phone"
            inputMode="numeric"
            maxLength={10}
            prefixText="+91"
            placeholder="9876543210"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
            invalid={!!errors.phone}
            autoComplete="tel"
          />
        </Field>

        <div className="grid gap-x-4 sm:grid-cols-2">
          <Field label={<>City <span className="text-dim">(optional)</span></>} htmlFor="city">
            <TextInput
              id="city"
              icon={<MapPin className="size-[18px]" />}
              placeholder="Bengaluru"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              autoComplete="address-level2"
            />
          </Field>

          <Field label="You are a" htmlFor="currentStatus">
            <SelectInput
              id="currentStatus"
              value={form.currentStatus}
              onChange={(e) => set("currentStatus", e.target.value)}
            >
              <option value="student">Student</option>
              <option value="fresher">Fresher</option>
              <option value="working_professional">Working professional</option>
              <option value="other">Other</option>
            </SelectInput>
          </Field>
        </div>

        <Field label="Password" htmlFor="password" error={errors.password}>
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

        <div className="mt-2">
          <SubmitButton loading={submitting}>Create account</SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-dim">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-light hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
