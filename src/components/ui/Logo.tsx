/** Placeholder brand mark: an "F" whose middle stroke is a forward arrow. Swap for the real logo later. */
export function Logo({ className = "size-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="11" fill="var(--color-lilac)" />
      <path d="M14 11h20v6H20v5h8.5v-4.5L37 24l-8.5 6.5V26H20v11h-6V11Z" fill="var(--color-ink-deep)" />
    </svg>
  );
}
