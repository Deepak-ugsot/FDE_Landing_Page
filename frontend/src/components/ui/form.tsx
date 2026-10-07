import type { ReactNode } from "react";
import { CtaButton } from "./CtaButton";

/** Small inline spinner that inherits the current text color. */
export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <span
      className={`inline-block ${className} animate-spin rounded-full border-2 border-current/30 border-t-current`}
      aria-hidden="true"
    />
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-mist">
        {label}
      </label>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-accent-light">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-dim">{hint}</span>
      ) : null}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border bg-ink/60 py-3 text-[15px] text-paper placeholder:text-dim/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

type TextInputProps = Omit<React.ComponentProps<"input">, "prefix"> & {
  icon?: ReactNode;
  invalid?: boolean;
  /** Short text prefix shown inside the field, e.g. "+91". */
  prefixText?: string;
};

export function TextInput({ icon, invalid, prefixText, className = "", ...rest }: TextInputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-dim">{icon}</span>
      )}
      {prefixText && (
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-dim">
          {prefixText}
        </span>
      )}
      <input
        {...rest}
        className={`${inputBase} ${icon ? "pl-11" : prefixText ? "pl-12" : "px-4"} ${icon || prefixText ? "pr-4" : ""} ${
          invalid ? "border-accent/70" : "border-ink-line"
        } ${className}`}
      />
    </div>
  );
}

type SelectProps = React.ComponentProps<"select"> & { invalid?: boolean };

export function SelectInput({ invalid, className = "", children, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      className={`${inputBase} cursor-pointer appearance-none px-4 ${invalid ? "border-accent/70" : "border-ink-line"} ${className}`}
    >
      {children}
    </select>
  );
}

export function SubmitButton({ loading, children }: { loading?: boolean; children: ReactNode }) {
  return (
    <CtaButton type="submit" fullWidth loading={loading}>
      {children}
    </CtaButton>
  );
}

export function Alert({
  variant = "error",
  children,
  className = "",
}: {
  variant?: "error" | "success" | "info";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    error: "border-accent/40 bg-accent/10 text-accent-light",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    info: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  } as const;
  return (
    <div role="alert" className={`rounded-xl border px-4 py-3 text-sm ${tones[variant]} ${className}`}>
      {children}
    </div>
  );
}
