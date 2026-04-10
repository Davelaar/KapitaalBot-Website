"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Re-fetches server components on an interval so snapshot-backed dashboards stay current.
 * Align with bot observability export cadence (~2 min); user-requested 60s for critical route board.
 */
export function DashboardAutoRefresh({
  children,
  intervalMs = 60_000,
}: {
  children: ReactNode;
  intervalMs?: number;
}) {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      router.refresh();
    }, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router, intervalMs]);

  return <>{children}</>;
}
