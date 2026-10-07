"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

const navLinks = [{ label: "Profile", href: "/profile" }];

export function AppHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const initials =
    user?.fullName
      ?.trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const onLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-line bg-ink-deep/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Home" className="flex items-center">
          <Logo className="h-9 w-auto" />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-ink-raised text-paper" : "text-dim hover:text-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <span className="mx-1 hidden h-6 w-px bg-ink-line sm:block" />

          <span
            className="hidden size-8 place-items-center rounded-full bg-accent text-xs font-semibold text-on-accent sm:grid"
            title={user?.fullName}
          >
            {initials}
          </span>

          <button
            type="button"
            onClick={onLogout}
            className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-dim transition-colors hover:bg-ink-raised hover:text-paper"
          >
            <LogOut className="size-4" /> <span className="hidden sm:inline">Log out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
