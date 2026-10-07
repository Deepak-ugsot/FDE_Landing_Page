"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Client-side route guard. Redirects to /login when the visitor isn't
 * authenticated, and (optionally) to /payment when access isn't unlocked yet.
 * Returns `ready` once it's safe to render the protected content.
 */
export function useRequireAuth({ requirePaid = false }: { requirePaid?: boolean } = {}) {
  const { isAuthenticated, hasPaid, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (requirePaid && !hasPaid) {
      router.replace("/payment");
    }
  }, [loading, isAuthenticated, hasPaid, requirePaid, router]);

  const ready = !loading && isAuthenticated && (!requirePaid || hasPaid);
  return { ready, loading };
}
